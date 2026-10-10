import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { createOutbox } from './outbox.js'
import { createSenders } from './delivery.js'
import { createContactApp } from './app.js'

const root = fileURLToPath(new URL('../', import.meta.url))
const required = ['SITE_URL', 'MAIL_TO', 'MAIL_FROM', 'SMTP_HOST', 'TELEGRAM_BOT_TOKEN', 'TELEGRAM_CHAT_ID']
for (const key of required) if (!process.env[key]) throw new Error(`Missing server setting: ${key}`)
const site = new URL(process.env.SITE_URL)
if (!['https:', 'http:'].includes(site.protocol)) throw new Error('SITE_URL must be an HTTP(S) URL')
for (const key of ['MAIL_TO', 'MAIL_FROM']) if (!/^[^\s<>@]+@[^\s<>@]+\.[^\s<>@]+$/.test(process.env[key])) throw new Error(`Invalid server setting: ${key}`)
const smtpPort = Number(process.env.SMTP_PORT || 25)
const port = Number(process.env.PORT || 3001)
if (![smtpPort, port].every(value => Number.isInteger(value) && value > 0 && value <= 65535)) throw new Error('Invalid port')
if (process.env.SMTP_USER && !process.env.SMTP_PASSWORD) throw new Error('SMTP_PASSWORD is required with SMTP_USER')
const config = {
  smtpHost: process.env.SMTP_HOST, smtpPort,
  smtpSecure: process.env.SMTP_SECURE === 'true',
  smtpUser: process.env.SMTP_USER, smtpPassword: process.env.SMTP_PASSWORD,
  mailTo: process.env.MAIL_TO, mailFrom: process.env.MAIL_FROM,
  messageDomain: site.hostname,
  telegramToken: process.env.TELEGRAM_BOT_TOKEN, telegramChatId: process.env.TELEGRAM_CHAT_ID,
}
const senders = createSenders(config)
const outbox = await createOutbox(path.resolve(root, process.env.CONTACT_DATA_DIR || 'var/contact-outbox'), senders)
const app = createContactApp({ outbox, siteOrigin: site.origin, distDirectory: path.join(root, 'dist') })
const server = app.listen(port, process.env.HOST || '127.0.0.1', () => console.log(`MaxxDev backend listening on port ${port}`))
let delivery = Promise.resolve()
let stopping = false
function deliver() {
  if (stopping) return
  delivery = delivery.then(() => outbox.processPending()).catch(() => console.error('Outbox processing failed. Pending jobs remain on disk.'))
}
deliver()
const timer = setInterval(deliver, 5000)
timer.unref()
for (const signal of ['SIGTERM', 'SIGINT']) process.on(signal, async () => {
  if (stopping) return
  stopping = true
  clearInterval(timer)
  const closed = new Promise(resolve => server.close(resolve))
  setTimeout(() => process.exit(0), 25000).unref()
  await Promise.all([closed, delivery])
  process.exit(0)
})
