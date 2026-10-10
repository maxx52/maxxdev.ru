if (!process.env.TELEGRAM_BOT_TOKEN) throw new Error('Set TELEGRAM_BOT_TOKEN in .env first')
const response = await fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/getUpdates`, { signal: AbortSignal.timeout(15000) })
const data = await response.json()
if (!response.ok || !data.ok) throw new Error('Telegram could not return updates. Check the bot settings.')
const chats = new Map()
for (const update of data.result) {
  const chat = update.message?.chat || update.channel_post?.chat
  if (chat) chats.set(chat.id, { id: chat.id, type: chat.type, name: chat.title || chat.first_name })
}
console.log([...chats.values()])
if (!chats.size) console.log('Open the bot in Telegram, send /start, then run this command again.')
