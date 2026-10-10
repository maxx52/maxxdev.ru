import test from 'node:test'
import assert from 'node:assert/strict'
import { mkdtemp, readFile, readdir, rm } from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import { randomUUID } from 'node:crypto'
import { createOutbox } from '../server/outbox.js'
import { createContactApp } from '../server/app.js'
import { createSenders } from '../server/delivery.js'
import { postContact } from '../src/contact.js'

const payload = { name: 'Иван', contact: 'ivan@example.com', platform: 'Сайт', goal: 'Разработка сайта' }
async function fixture(t, senders, options) {
  const dir = await mkdtemp(path.join(os.tmpdir(), 'maxxdev-'))
  t.after(() => rm(dir, { recursive: true, force: true }))
  return { dir, outbox: await createOutbox(dir, senders, options) }
}
async function endpoint(t, outbox, options = {}) {
  const server = createContactApp({ outbox, siteOrigin: 'https://maxxdev.ru', ...options }).listen(0, '127.0.0.1')
  await new Promise(resolve => server.once('listening', resolve))
  t.after(() => new Promise(resolve => { server.close(resolve); server.closeAllConnections() }))
  return body => fetch(`http://127.0.0.1:${server.address().port}/api/contact`, {
    method: 'POST', headers: { 'Content-Type': 'application/json', Origin: body.origin || 'https://maxxdev.ru' },
    body: JSON.stringify(body),
  })
}

test('API persists a request before accepting it, deduplicates retries, rejects changed payload', async t => {
  const { dir, outbox } = await fixture(t, {})
  const send = await endpoint(t, outbox)
  const request = { ...payload, requestId: randomUUID(), website: '' }
  const result = await send(request)
  assert.equal(result.status, 202)
  assert.equal((await result.json()).requestId, request.requestId)
  assert.deepEqual(JSON.parse(await readFile(path.join(dir, request.requestId + '.json'))).payload, payload)
  assert.equal((await send(request)).status, 202)
  assert.equal((await readdir(dir)).length, 1)
  assert.equal((await send({ ...request, goal: 'Другая задача' })).status, 409)
})

test('API rejects invalid input, foreign origins, honeypot and excessive requests', async t => {
  let accepted = 0
  const send = await endpoint(t, { enqueue: async () => { accepted++ } }, { maxRequests: 3 })
  const request = { ...payload, requestId: randomUUID(), website: '' }
  assert.equal((await send({ ...request, origin: 'https://foreign.example' })).status, 403)
  assert.equal((await send({ ...request, name: '\r\nBad' })).status, 400)
  assert.equal((await send({ ...request, website: 'spam' })).status, 400)
  assert.equal((await send({ ...request, goal: ' ' })).status, 400)
  assert.equal((await send(request)).status, 429)
  assert.equal(accepted, 0)
})

test('API returns failure when durable admission fails', async t => {
  const send = await endpoint(t, { enqueue: async () => { throw new Error('Disk failure') } })
  const response = await send({ ...payload, requestId: randomUUID(), website: '' })
  assert.equal(response.status, 503)
  assert.equal((await response.json()).ok, false)
})

test('partial delivery survives restart and retries only the failing channel', async t => {
  let time = 100000, email = 0, telegram = 0
  const senders = { email: async () => { email++ }, telegram: async () => { telegram++; throw Object.assign(new Error('offline'), { code: 'OFFLINE' }) } }
  const { dir, outbox } = await fixture(t, senders, { now: () => time })
  const id = randomUUID()
  await outbox.enqueue(id, payload)
  await outbox.processPending()
  assert.equal(email, 1)
  assert.equal(telegram, 1)
  const restarted = await createOutbox(dir, { email: senders.email, telegram: async () => { telegram++ } }, { now: () => time })
  await restarted.processPending()
  assert.equal(telegram, 1)
  time += 30001
  await restarted.processPending()
  assert.equal(email, 1)
  assert.equal(telegram, 2)
  const job = JSON.parse(await readFile(path.join(dir, id + '.json')))
  assert.ok(job.completedAt)
  await restarted.processPending()
  assert.equal(telegram, 2)
})

test('Telegram resumes long messages after a failed part without resending accepted parts', async t => {
  const messages = []
  let fail = true
  const senders = createSenders({ telegramToken: 'fake', telegramChatId: '123' }, {
    transport: {}, fetch: async (_url, options) => {
      const text = JSON.parse(options.body).text
      messages.push(text)
      if (messages.length === 2 && fail) return { ok: false, json: async () => ({ ok: false }) }
      return { ok: true, json: async () => ({ ok: true }) }
    },
  })
  const job = { id: randomUUID(), createdAt: 100000, payload: { ...payload, goal: '🙂'.repeat(1500) + 'a'.repeat(1000) }, channels: { telegram: {} } }
  let saves = 0
  await assert.rejects(senders.telegram(job, async () => { saves++ }))
  assert.equal(job.channels.telegram.partsSent, 1)
  fail = false
  await senders.telegram(job, async () => { saves++ })
  assert.equal(messages.length, 3)
  assert.equal(messages[1], messages[2])
  assert.equal(saves, 2)
  for (const text of messages) assert.ok(text.length <= 4096)
})

test('browser reports acceptance only for a matching successful API response', async () => {
  const request = { ...payload, requestId: randomUUID(), website: '' }
  await assert.rejects(postContact(request, async () => ({ ok: true, json: async () => ({ ok: true, requestId: 'other' }) })))
  await assert.rejects(postContact(request, async () => ({ ok: false, json: async () => ({ error: 'Недоступно' }) })), /Недоступно/)
  await assert.rejects(postContact(request, async () => { throw new TypeError('Network failure') }), /данные сохранены/)
  const result = await postContact(request, async (_url, options) => {
    assert.deepEqual(JSON.parse(options.body), request)
    return { ok: true, json: async () => ({ ok: true, requestId: request.requestId }) }
  })
  assert.match(result.message, /Заявка принята/)
})
