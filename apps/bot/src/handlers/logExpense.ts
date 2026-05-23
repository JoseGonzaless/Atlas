import TelegramBot from 'node-telegram-bot-api'
import { parseExpenseMessage } from '../parser/message'

export function registerLogExpenseHandler(bot: TelegramBot) {
  bot.on('message', (msg) => {
    const text = msg.text ?? ''
    const parsed = parseExpenseMessage(text)
    if (parsed) {
      console.log('Parsed expense:', parsed)
    }
  })
}
