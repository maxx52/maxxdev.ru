import { mkdir, readFile, readdir, rename, unlink, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { createHash, randomUUID } from 'node:crypto'

const channels = ['email', 'telegram']

export async function createOutbox(directory, senders, options = {}) {
  const now = options.now || Date.now
  const retentionMs = (options.retentionDays ?? 14) * 86400000
  const maxPending = options.maxPending ?? 500
  await mkdir(directory, { recursive: true, mode: 0o700 })
  let enqueueChain = Promise.resolve()
  let running = false

  async function save(job) {
    const file = path.join(directory, job.id + '.json')
    const temporary = file + '.' + randomUUID() + '.tmp'
    try {
      await writeFile(temporary, JSON.stringify(job), { mode: 0o600, flag: 'wx' })
      await rename(temporary, file)
    } finally {
      await unlink(temporary).catch(() => {})
    }
  }

  async function load(file) {
    try { return JSON.parse(await readFile(path.join(directory, file), 'utf8')) }
    catch (error) {
      if (error.code === 'ENOENT') return null
      throw error
    }
  }

  async function enqueue(id, payload) {
    // Serialise admission so a retry and the original POST cannot create two jobs.
    const operation = enqueueChain.then(async () => {
      const fingerprint = createHash('sha256').update(JSON.stringify(payload)).digest('hex')
      const existing = await load(id + '.json')
      if (existing) {
        if (existing.fingerprint !== fingerprint) {
          const error = new Error('Request id reused for another payload')
          error.status = 409
          throw error
        }
        return existing.id
      }
      const files = (await readdir(directory)).filter(file => file.endsWith('.json'))
      let pending = 0
      for (const file of files) {
        const job = await load(file)
        if (job && !job.completedAt) pending++
      }
      if (pending >= maxPending) {
        const error = new Error('Outbox capacity exceeded')
        error.status = 503
        throw error
      }
      const job = { id, fingerprint, payload, createdAt: now(), completedAt: null,
        channels: Object.fromEntries(channels.map(channel => [channel, { sentAt: null, attempts: 0, nextAttemptAt: 0 }])) }
      await save(job)
      return id
    })
    enqueueChain = operation.catch(() => {})
    return operation
  }

  async function processPending() {
    if (running) return
    running = true
    try {
      const files = (await readdir(directory)).filter(file => file.endsWith('.json')).sort()
      for (const file of files) {
        const job = await load(file)
        if (!job) continue
        if (job.completedAt) {
          if (now() - job.completedAt > retentionMs) await unlink(path.join(directory, file))
          continue
        }
        for (const channel of channels) {
          const delivery = job.channels[channel]
          if (delivery.sentAt || delivery.nextAttemptAt > now()) continue
          try {
            await senders[channel](job, () => save(job))
            delivery.sentAt = now()
            delivery.lastError = null
          } catch (error) {
            delivery.attempts++
            delivery.nextAttemptAt = now() + Math.min(3600000, 30000 * 2 ** Math.min(delivery.attempts - 1, 7))
            delivery.lastError = typeof error.code === 'string' ? error.code.slice(0, 50) : 'DELIVERY_FAILED'
            // Never log form fields, SMTP credentials, bot URLs or Telegram tokens.
            console.warn(`Delivery pending: ${job.id} / ${channel} / ${delivery.lastError}`)
          }
          // Persist each channel separately; retries skip already delivered channels.
          if (channels.every(name => job.channels[name].sentAt)) job.completedAt = now()
          await save(job)
        }
      }
    } finally { running = false }
  }

  return { enqueue, processPending }
}
