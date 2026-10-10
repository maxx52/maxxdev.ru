import nodemailer from 'nodemailer'

export function formatBrief(job) {
  const { name, contact, platform, goal } = job.payload
  return [
    'Новая заявка — MaxxDev', `Номер: ${job.id}`,
    `Дата: ${new Date(job.createdAt).toISOString()}`, '',
    `Имя: ${name}`, `Контакт: ${contact}`, `Тип проекта: ${platform}`, '',
    'Задача:', goal,
  ].join('\n')
}

export function splitTelegramText(text, limit = 3900) {
  // Bound UTF-16 length too, without splitting an emoji's surrogate pair.
  const parts = []
  let part = ''
  for (const character of text) {
    if (part.length + character.length > limit) { parts.push(part); part = '' }
    part += character
  }
  if (part) parts.push(part)
  return parts
}

export function createSenders(config, dependencies = {}) {
  const transport = dependencies.transport || nodemailer.createTransport({
    host: config.smtpHost, port: config.smtpPort, secure: config.smtpSecure,
    ...(config.smtpUser ? { auth: { user: config.smtpUser, pass: config.smtpPassword } } : {}),
    connectionTimeout: 15000, greetingTimeout: 15000, socketTimeout: 20000,
    disableFileAccess: true, disableUrlAccess: true,
  })

  return {
    async email(job) {
      const contact = job.payload.contact
      const replyTo = /^[^\s<>@]+@[^\s<>@]+\.[^\s<>@]+$/.test(contact) ? contact : undefined
      const info = await transport.sendMail({
        from: { name: 'MaxxDev', address: config.mailFrom }, to: config.mailTo,
        subject: `MaxxDev — заявка: ${job.payload.platform}`,
        messageId: `<${job.id}@${config.messageDomain}>`,
        ...(replyTo ? { replyTo } : {}), text: formatBrief(job),
      })
      if (!info.accepted?.length || info.rejected?.length) {
        const error = new Error('SMTP did not accept the recipient')
        error.code = 'SMTP_REJECTED'
        throw error
      }
    },
    async telegram(job, saveProgress = async () => {}) {
      const parts = splitTelegramText(formatBrief(job))
      for (let index = job.channels.telegram.partsSent || 0; index < parts.length; index++) {
        const response = await (dependencies.fetch || fetch)(`https://api.telegram.org/bot${config.telegramToken}/sendMessage`, {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ chat_id: config.telegramChatId,
            text: parts.length === 1 ? parts[index] : `[${index + 1}/${parts.length}] Заявка ${job.id}\n${parts[index]}`,
            link_preview_options: { is_disabled: true } }),
          signal: AbortSignal.timeout(15000),
        })
        const result = await response.json().catch(() => null)
        if (!response.ok || result?.ok !== true) {
          const error = new Error('Telegram rejected the message')
          error.code = 'TELEGRAM_REJECTED'
          throw error
        }
        job.channels.telegram.partsSent = index + 1
        await saveProgress()
      }
    },
  }
}
