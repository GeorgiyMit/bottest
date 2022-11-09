const TelegramApi = require('node-telegram-bot-api')
const {gameOptions, againOptions} = require('./options')
const token = '*******'

const bot = new TelegramApi(token, {polling: true})

const chats = {}



const startGame = async (chatId)=>{
    await bot.sendMessage(chatId, `Давай немного поиграем ,я загадаю цифру от 0 до 9, а ты должен ее угадать!`)
    const randomNumber = Math.floor(Math.random() * 10)
    chats[chatId] = randomNumber;
    await bot.sendMessage(chatId, 'Отгадывай', gameOptions);
}

const start =()=>{
    bot.setMyCommands([
        {command:'/start',description:'Начальное приветствие'},
        {command:'/info',description:'Получить информацию о пользователе'},
        {command:'/game',description:'Игра угадай цифру'},
        {command:'/cheer',description:'Поверить в себя'},
    ])
    
    bot.on ('message', async msg=>{
        const text = msg.text;
        const chatId = msg.chat.id;
        if(text ==='/start'){
        await bot.sendSticker(chatId,'https://tlgrm.ru/_/stickers/5ba/fb7/5bafb75c-6bee-39e0-a4f3-a23e523feded/1.webp')
        return bot.sendMessage(chatId,`Добро пожаловать в телеграм бот Анастасии по психологии`)}
        if (text ==='/info'){
            return  bot.sendMessage(chatId,`Тебя зовут ${msg.from.first_name}`)
        }
        if( text === '/game'){
            return startGame(chatId);
        }
       if ( text === '/cheer'){
        await bot.sendSticker(chatId,'https://tlgrm.ru/_/stickers/5ba/fb7/5bafb75c-6bee-39e0-a4f3-a23e523feded/4.webp')
        return bot.sendMessage(chatId,`${msg.from.first_name},у тебя все получится,поверь в себя и ты все сможешь`)
       }
        return bot.sendMessage(chatId,'Я тебя не понимаю, попробуй еще раз!')
    })  
    bot.on('callback_query',async msg =>{
        const data = msg.data;
        const chatId= msg.message.chat.id;
        if(data === '/again'){
            return startGame(chatId);
        }
        if(data == chats[chatId]){
          await  bot.sendSticker(chatId,'https://tlgrm.ru/_/stickers/5ba/fb7/5bafb75c-6bee-39e0-a4f3-a23e523feded/192/25.webp')
            return bot.sendMessage(chatId,`Поздравляю, ты отгадал цифру ${chats[chatId]}`,againOptions)
        }else{
           await  bot.sendSticker(chatId,'https://tlgrm.ru/_/stickers/5ba/fb7/5bafb75c-6bee-39e0-a4f3-a23e523feded/6.webp')
            return bot.sendMessage(chatId,`К сожалению ты не угадал, я загадала цифру ${chats[chatId]}`,againOptions)
        }
    })
}

start()
