const TelegramApi = require('node-telegram-bot-api')
const {gameOption, againOption} = require('./options')

const token = '5563416902:AAFr-6Uzgpthjp3WfjE16911B1cZavgy7ow'

const bot = new TelegramApi(token, {polling: true})

const chats = {}

bot.setMyCommands( [
  {command: '/start', description: 'Початкове привітання'},
  {command: '/info', description: 'Отримати інформацію про користувача'},
  {command: '/game', description: 'Отримати інформацію про користувача'}
])

const startGame = async (chatId) => {
  await bot.sendMessage(chatId, `Я загадаю число від 0 до 10 ,  а ти маєш вгадати`)
  const randomNumber = Math.floor(Math.random()*10)
  chats[chatId] = randomNumber;
  await bot.sendMessage(chatId, `Відгадуй`, gameOption)
}

const start = () => {
  bot.on('message', async msg => {
    const text = msg.text;
    const chatId = msg.chat.id;
    
    if (text === `/start`) {
      return bot.sendMessage(chatId, `Ласкаво просимо`)
    }
  
    if (text === `/info`) {
      return bot.sendMessage(chatId, `Тебе звати ${msg.from.first_name} ${msg.from.last_name}?`)
    }

    if (text === `/game`) {
      return startGame(chatId);
    }
    return bot.sendMessage(chatId, `Не розумію команду. Скористайся командою /info , щоб отримати детальніше інформації`)
  })

  bot.on(`callback_query`, async msg => {
    const data = msg.data;
    const chatId = msg.message.chat.id;
    if (data === '/again') {
      return startGame(chatId)
    }
    if(data === chats[chatId]) {
      return await bot.sendMessage(chatId, `Вітаю ${msg.from.first_name} ${msg.from.last_name} ти вгадав(ла) число ${chats[chatId]}`, againOption)
    } else {
      return await bot.sendMessage(chatId, `Ех ${msg.from.first_name} ${msg.from.last_name} ти не вгадав(ла). Я загадав ${chats[chatId]}`, againOption)
    }
  })
}

start ()