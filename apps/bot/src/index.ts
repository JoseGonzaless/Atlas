import 'dotenv/config'
import TelegramBot from 'node-telegram-bot-api'
import { registerLogExpenseHandler } from './handlers/logExpense'

const token = process.env.TELEGRAM_BOT_TOKEN ?? ''

const bot = new TelegramBot(token, { polling: token !== '' })

registerLogExpenseHandler(bot)

bot.on('message', (msg) => {
  if (msg.chat.id) {
    bot.sendMessage(msg.chat.id, 'Message received').catch(() => {})
  }
})

console.log('Atlas bot running')
