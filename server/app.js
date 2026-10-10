import express from 'express'
import path from 'node:path'

const platforms = new Set(['Сайт', 'Android-приложение', 'Программа для компьютера', 'Пока не определился'])
const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

export function validatePayload(body) {
  if (!body || typeof body !== 'object' || Array.isArray(body) || !uuid.test(body.requestId || '')) return null
  for (const field of ['name', 'contact', 'platform', 'goal']) if (typeof body[field] !== 'string') return null
  if (/[\r\n\x00]/.test(body.name + body.contact) || /\x00/.test(body.goal)) return null
  const data = Object.fromEntries(['name', 'contact', 'platform', 'goal'].map(key => [key, body[key].trim()]))
  if (!data.name || data.name.length > 200 || !data.contact || data.contact.length > 200 ||
    !data.goal || data.goal.length > 4000 || !platforms.has(data.platform)) return null
  if (/[\r\n\x00]/.test(data.name + data.contact) || /\x00/.test(data.goal)) return null
  return { requestId: body.requestId.toLowerCase(), payload: data }
}

export function createContactApp({ outbox, siteOrigin, distDirectory, now = Date.now, maxRequests = 5 }) {
  const app = express()
  const clients = new Map()
  app.disable('x-powered-by')
  app.set('trust proxy', 'loopback')
  app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff')
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin')
    next()
  })
  app.post('/api/contact', (req, res, next) => {
    res.setHeader('Cache-Control', 'no-store')
    const origin = req.get('origin')
    const fetchSite = req.get('sec-fetch-site')
    if ((origin && origin !== siteOrigin) || fetchSite === 'cross-site') return res.status(403).json({ ok: false, error: 'Отправьте заявку с нашего сайта.' })
    if (!req.is('application/json')) return res.status(415).json({ ok: false, error: 'Неверный формат заявки.' })
    // Single-process limiter; the deployment runs one Node service behind nginx.
    const timestamp = now()
    for (const [ip, entry] of clients) if (timestamp - entry.start > 600000) clients.delete(ip)
    const ip = req.ip
    const entry = clients.get(ip) || { start: timestamp, count: 0 }
    if (entry.count >= maxRequests) {
      res.setHeader('Retry-After', Math.max(1, Math.ceil((entry.start + 600000 - timestamp) / 1000)))
      return res.status(429).json({ ok: false, error: 'Слишком много заявок. Попробуйте немного позже.' })
    }
    entry.count++
    clients.set(ip, entry)
    next()
  }, express.json({ limit: '24kb' }), async (req, res, next) => {
    try {
      if (typeof req.body?.website !== 'string' || req.body.website) return res.status(400).json({ ok: false, error: 'Не удалось принять заявку.' })
      const validated = validatePayload(req.body)
      if (!validated) return res.status(400).json({ ok: false, error: 'Проверьте имя, контакт и описание задачи.' })
      const id = await outbox.enqueue(validated.requestId, validated.payload)
      // Success only after the job is persisted, not after a browser-side timeout.
      res.status(202).json({ ok: true, requestId: id, message: 'Заявка принята. Я свяжусь с вами по указанному контакту.' })
    } catch (error) { next(error) }
  })
  app.use('/api', (_req, res) => res.status(404).json({ ok: false, error: 'Неизвестный адрес.' }))
  if (distDirectory) {
    app.use(express.static(distDirectory, { dotfiles: 'deny', index: 'index.html' }))
    app.get('/', (_req, res) => res.sendFile(path.join(distDirectory, 'index.html')))
  }
  app.use((_req, res) => res.status(404).send('Not found'))
  app.use((error, _req, res, _next) => {
    const status = [400, 409, 413, 503].includes(error.status) ? error.status : 503
    const messages = { 400: 'Неверный формат заявки.', 409: 'Заявка изменилась. Обновите страницу и отправьте её снова.', 413: 'Описание слишком длинное.', 503: 'Сейчас не удалось принять заявку. Попробуйте позже.' }
    if (status === 503) console.error('Contact request could not be persisted.')
    res.status(status).json({ ok: false, error: messages[status] })
  })
  return app
}
