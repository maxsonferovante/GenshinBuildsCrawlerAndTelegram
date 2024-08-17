import TelegramBot from 'node-telegram-bot-api';
import fs from 'node:fs';
import cron from 'node-cron';


import DiaDaSemana from '../utils/diaDaSemana.js';

import WebCrawlerGenshinBuildsRequestAndCheerio from '../webCrawler/webCrwletGenshinBuildRequestAndCheerio.js';
import PostgreUserRepository from '../database/repositories/postgreUserRepository.js'; 


const LINK_REPOSITORY = "https://github.com/maxsonferovante/GenshinBuildsCrawlerAndTelegram"

export default class GenshinBuildsMaalBot {
    /**
         * Creates an instance of GenshinBuildsMaalBot.
         * @memberof GenshinBuildsMaalBot
         * @constructor
         */
    
    constructor() {
        console.log('GenshinBuildsMaalBot initialized ...');

        this.postgreUserRepository = new PostgreUserRepository();

        this.bot = new TelegramBot(process.env.TELEGRAM_TOKEN, { polling: true, filepath: false });

        this.crawler = new WebCrawlerGenshinBuildsRequestAndCheerio(process.env.URL);

        this.fileBuffer = fs.readFileSync('./src/media/img/logo.png');

        this.keyboard = [["/weapons", "/characters"], ["/start", "/about"]];
    }
    async initBot() {
        await this.welconeGenshinBuidlsMaalBot();
        await this.sendCharacters();
        await this.sendWeapons();
        await this.sendAbout();
        //await this.SendUpdateDaily();
        await this.sendHelper();
    }
    async SendUpdateDaily() {
        try {
            cron.schedule('20 9 * * *', async () => {
                console.log('Iniciando o serviço às 6:20...');
                
                await this.crawler.initExtratcData('SendUpdateDaily');            
                
                const usersSaved = await this.postgreUserRepository.getAll()
                
                for (const user of usersSaved) {
                    const chatId = user.chatId;
                    try {
                        await this.bot.sendMessage(chatId,
                            `<i> Aguarde, estamos buscando as armas disponíveis para farmar hoje (${DiaDaSemana.obterDataAtualComDiaDaSemana()}) ... </i>`,
                            {
                                parse_mode: 'HTML',
                                reply_markup: {
                                    // @ts-ignore
                                    "keyboard": this.keyboard,
                                    "resize_keyboard": true,
                                    "one_time_keyboard": true
                                }
                            });
                       
    
                        await this.bot.sendMessage(chatId, `Armas Disponível para Farmar hoje (${DiaDaSemana.obterDataAtualComDiaDaSemana()}) são : \n\n`, { parse_mode: 'HTML' });
    
                        for (const key in this.crawler.dictWeapon) {
                            let quantityWeapons = this.crawler.dictWeapon[key].length + 1;
                            await this.bot.sendMessage(chatId,
                                `<b>${key}</b> \n\n${this.crawler.dictWeapon[key].map((/** @type {{ url: any; name: any; }} */ weapon) => {
                                    quantityWeapons--;
                                    const textResponse = `${(this.crawler.dictWeapon[key].length - quantityWeapons) + 1} - <a href="${weapon.url}">${weapon.name}</a>`;
                                    return textResponse;
                                }).join(' \n')}`
                                , { parse_mode: 'HTML' });
                        }  
        
    
                    } catch (error) {
                        throw new Error(error);
                    }
                    
    
                    try{
                        await this.bot.sendMessage(chatId,
                            `<i> Aguarde, estamos buscando os personagens disponíveis para farmar hoje (${DiaDaSemana.obterDataAtualComDiaDaSemana()}) ... </i>`,
                            {
                                parse_mode: 'HTML',
                                reply_markup: {
                                    // @ts-ignore
                                    "keyboard": this.keyboard,
                                    "resize_keyboard": true,
                                    "one_time_keyboard": true
                                }
                            });
    
    
                        await this.bot.sendMessage(chatId, `Personagens Disponível para Farmar hoje (${DiaDaSemana.obterDataAtualComDiaDaSemana()}) são : \n\n`, { parse_mode: 'HTML' });
    
                        for (const key in this.crawler.dictCharacter) {
                            let quantityCharacters = this.crawler.dictCharacter[key].length + 1;
                            await this.bot.sendMessage(chatId,
                                `<b>${key}</b> \n\n${this.crawler.dictCharacter[key].map((/** @type {{ url: any; name: any; }} */ character) => {
                                    quantityCharacters--;
                                    const textResponse = `${(this.crawler.dictCharacter[key].length - quantityCharacters) + 1} - <a href="${character.url}">${character.name}</a>`;
                                    return textResponse;
                                }).join(' \n')}`
                                , { parse_mode: 'HTML' });
                        }
                    }
                    catch(error){
                        throw new Error(error);
                    }
                    
                }
                
                const dataFinalizacao = new Date()
                console.log(`Finalizando o serviço às ${dataFinalizacao.getHours()}:${dataFinalizacao.getMinutes()}`);
            });    
        } catch (error) {
            console.log(error)
            await this.bot.sendMessage(process.env.CHAT_ID_ADM, 'Ocorreu um erro ao tentar enviar o SendUpdateDaily.');
            await this.bot.sendMessage(process.env.CHAT_ID_ADM, error);
        }
    }

    /**
         * Handles the /start command in the Telegram bot.
         * Sends a welcome message to the user along with a photo and a caption.
         * Sets up a custom keyboard for the user to interact with.
         * 
         * @async
         * @memberof GenshinBuildsMaalBot
         * @function welconeGenshinBuidlsMaalBot
         * @param {TelegramBot.Message} msg - The Telegram message object.
         * @returns {Promise<void>} - A promise that resolves when the welcome message is sent.
         */
    async welconeGenshinBuidlsMaalBot() {

        this.bot.onText(/\/start/, async (msg) => {
            try {
                const chatId = msg.chat.id;
                const userExist = await this.postgreUserRepository.existsByChatId(chatId);
                let capition = ''
                if (userExist){
                    capition = `<b>Olá ${msg.from.first_name}</b>, Bem-vindo novamente ao Genshin-Builds Maal-Bot! 🔮⚔️                    
                                \n Aqui você descobrirá quais armas são mais vantajosas para farmar, otimizando suas estratégias no mundo de Genshin Impact. 
                                \n Estou aqui para ajudar você a escolher as armas ideais para potencializar o poder dos seus personagens! 🌟✨`
                }
                else {                  
                    capition = `<b>Olá ${msg.from.first_name}</b>, Bem-vindo ao Genshin-Builds Maal-Bot! 🔮⚔️                                        
                                \n Aqui você descobrirá quais armas são mais vantajosas para farmar, otimizando suas estratégias no mundo de Genshin Impact. 
                                \n Estou aqui para ajudar você a escolher as armas ideais para potencializar o poder dos seus personagens! 🌟✨`
                    
                    await this.postgreUserRepository.create({
                        firstName: msg.from.first_name,
                        lastName: msg.from.last_name,
                        chatId: msg.chat.id
                    });

                    await this.sendInfoDeveloper({
                        chatId: chatId,
                        firstName: msg.from.first_name,
                        lastName: msg.from.last_name,
                        userExist: userExist,
                        command: '/start'
                    });
                }
                await this.bot.sendPhoto(
                    chatId,
                    this.fileBuffer,
                    {
                        caption: capition,
                        reply_markup: {
                            // @ts-ignore
                            "keyboard": this.keyboard,
                            "resize_keyboard": true,
                            "one_time_keyboard": true
                        },
                        parse_mode: "HTML"
                    },
                    {
                        filename: 'logo.png',
                        contentType: 'image/png'
                    }
                );
                
            } catch (error) {
                const chatId = msg.chat.id;
                await this.bot.sendMessage(chatId, 'Possivelmente estamos com problemas, tente novamente mais tarde.');
                console.error(error);
            }
        });
    }
    async sendCharacters() {
        this.bot.onText(/\/characters/, async (msg) => {
            const chatId = msg.chat.id;
            console.log(`Init sendCharacters ${chatId}`)
            try {

                await this.bot.sendMessage(chatId, 
                    `<i> Aguarde, estamos buscando os personagens disponíveis para farmar hoje (${DiaDaSemana.obterDataAtualComDiaDaSemana()}) ... </i>`, 
                    { 
                        parse_mode: 'HTML',
                        reply_markup: {
                            // @ts-ignore
                            "keyboard": this.keyboard,
                            "resize_keyboard": true,
                            "one_time_keyboard": true
                        } 
                });
                
                await this.crawler.initExtratcData(chatId);
                

                await this.bot.sendMessage(chatId, `Personagens Disponível para Farmar hoje (${DiaDaSemana.obterDataAtualComDiaDaSemana()}) são : \n\n`, { parse_mode: 'HTML' });
                
                for (const key in this.crawler.dictCharacter) {
                    let quantityCharacters = this.crawler.dictCharacter[key].length + 1;
                    await this.bot.sendMessage(chatId,
                        `<b>${key}</b> \n\n${this.crawler.dictCharacter[key].map((/** @type {{ url: any; name: any; }} */ character) => {
                            quantityCharacters--;
                            const textResponse = `${(this.crawler.dictCharacter[key].length - quantityCharacters) + 1} - <a href="${character.url}">${character.name}</a>`;
                            return textResponse;
                        }).join(' \n')}`
                        , { parse_mode: 'HTML' });
                }
            
            } catch (error) {
                this.bot.sendMessage(chatId, 'Ocorreu um erro ao tentar obter os personagens.');
                console.error(error);
            }
            finally {
                await this.sendInfoDeveloper({
                    chatId: chatId,
                    firstName: msg.from.first_name,
                    lastName: msg.from.last_name,
                    userExist: null,
                    command: '/characters'
                });
                console.log(`End sendCharacters ${chatId}`)
            }
        });
    }
    /**
         * Sends a message to the user with a list of available weapons to farm in the game Genshin Impact.
         * 
         * @async
         * @memberof GenshinBuildsMaalBot
         * @function sendWeapons
         * @param {TelegramBot.Message} msg - The Telegram message object.
         * @returns {Promise<void>} - The method does not return a value.
         */
    async sendWeapons() {

        this.bot.onText(/\/weapons/, async (msg) => {
            const chatId = msg.chat.id;
            console.log(`Init sendCharacters ${chatId}`)
            try {
                await this.bot.sendMessage(chatId, 
                    `<i> Aguarde, estamos buscando as armas disponíveis para farmar hoje (${DiaDaSemana.obterDataAtualComDiaDaSemana()}) ... </i>`,
                    { 
                        parse_mode: 'HTML',
                        reply_markup: {
                            // @ts-ignore
                            "keyboard": this.keyboard,
                            "resize_keyboard": true,
                            "one_time_keyboard": true
                        } 
                });

                await this.crawler.initExtratcData(chatId);

                await this.bot.sendMessage(chatId, `Armas Disponível para Farmar hoje (${DiaDaSemana.obterDataAtualComDiaDaSemana()}) são : \n\n`, { parse_mode: 'HTML' });
                
                for (const key in this.crawler.dictWeapon) {
                    let quantityWeapons = this.crawler.dictWeapon[key].length + 1;
                    await this.bot.sendMessage(chatId,
                        `<b>${key}</b> \n\n${this.crawler.dictWeapon[key].map((/** @type {{ url: any; name: any; }} */ weapon) => {
                            quantityWeapons--;
                            const textResponse = `${(this.crawler.dictWeapon[key].length - quantityWeapons) + 1} - <a href="${weapon.url}">${weapon.name}</a>`;
                            return textResponse;
                        }).join(' \n')}`
                        , { parse_mode: 'HTML' });
                }              

            } catch (error) {
                this.bot.sendMessage(chatId, 'Ocorreu um erro ao tentar obter as armas.');
                console.error(error);
            }
            finally {
                await this.sendInfoDeveloper({
                    chatId: chatId,
                    firstName: msg.from.first_name,
                    lastName: msg.from.last_name,
                    userExist: null,
                    command: '/weapons'
                });
                console.log(`End sendCharacters ${chatId}`)
            }
        });
    }

    /**
         * Sends a photo with a caption to the user, providing information about the Genshin-Builds Maal-Bot.
         * 
         * @async
         * @memberof GenshinBuildsMaalBot
         * @function sendAbout
         * @param {object} msg - The message object received from the user.
         * @returns {Promise<void>} - A promise that resolves when the photo is sent successfully.
         */
    async sendAbout() {
        this.bot.onText(/\/about/, async (msg) => {
            try {
                const chatId = msg.chat.id;
                const userExist = await this.postgreUserRepository.existsByChatId(chatId);
                let caption = ''
                if (!userExist){
                      caption = `<b>Olá ${msg.from.first_name}</b>, Bem-vindo ao Genshin-Builds Maal-Bot! 🔮⚔️
                                \n Aqui você descobrirá quais armas são mais vantajosas para farmar, otimizando suas estratégias no mundo de Genshin Impact. 
                                \n Estou aqui para ajudar você a escolher as armas ideais para potencializar o poder dos seus personagens! 🌟✨
                                \n Para mais informações acesse o <a href="${LINK_REPOSITORY}">link</a>.` 
                }
                else{
                    caption = `<b>Olá ${msg.from.first_name}</b>, Bem-vindo novamente ao Genshin-Builds Maal-Bot! 🔮⚔️
                                \n Aqui você descobrirá quais armas são mais vantajosas para farmar, otimizando suas estratégias no mundo de Genshin Impact. 
                                \n Estou aqui para ajudar você a escolher as armas ideais para potencializar o poder dos seus personagens! 🌟✨
                                \n Para mais informações acesse o <a href="${LINK_REPOSITORY}">link</a>.` 
                        
                }
                await this.bot.sendPhoto(chatId,
                    this.fileBuffer,
                    {
                        caption:caption,
                        reply_markup: {
                            // @ts-ignore
                            "keyboard": this.keyboard,
                            "resize_keyboard": true,
                            "one_time_keyboard": true
                        },
                        parse_mode: "HTML"
                    },
                    {
                        filename: 'logo.png',
                        contentType: 'image/png'
                    }
                );  
                
            } catch (error) {
                const chatId = msg.chat.id;
                await this.bot.sendMessage(chatId, 'Possivelmente estamos com problemas, tente novamente mais tarde.');
                console.error(error);
            }
        });
    }

    /**
         * Sends a message to the user with a list of available commands and their descriptions.
         * @async
         * @memberof GenshinBuildsMaalBot
         * @function sendHelper
         * @param {object} msg - The message object received from the user.
         * @returns {Promise<void>} - None. The method sends a message to the user.
         */
    async sendHelper() {
        this.bot.onText(/\/help/, async (msg) => {
            try {
                const chatId = msg.chat.id;
                await this.bot.sendMessage(chatId,
                    `<b>Olá ${msg.from.first_name}</b>,  
                            \n Os comandos disponíveis são:
                            \n /start - Inicia o bot
                            \n /weapons - Lista as armas disponíveis para farmar hoje
                            \n /about - Sobre o bot
                            \n /help - Ajuda
                            \n /feedback - Envia um feedback para o desenvolvedor
                            \n /report - Reporta um erro para o desenvolvedor
                            \n /source - Link do código fonte
                            `,
                            { 
                                parse_mode: 'HTML',
                                reply_markup: {
                                    // @ts-ignore
                                    "keyboard": this.keyboard,
                                    "resize_keyboard": true,
                                    "one_time_keyboard": true
                                } 
                        }
                );
            } catch (error) {
                const chatId = msg.chat.id;
                await this.bot.sendMessage(chatId, 'Possivelmente estamos com problemas, tente novamente mais tarde.');
                console.error(error);
            }
        });
    }

    /**
     * @param {{ chatId: any; firstName: any; lastName: any; userExist?: boolean; command: string}} data
     */
    async sendInfoDeveloper(data){
        const dataAtual = new Date().toLocaleString().replace(/T/, ' ').replace(/\..+/, '');
        
        const mensagem = data.userExist ? `O usuário usou o comando: ${data.command}` : `Um novo usuário acessou o bot Genshin-Builds Maal-Bot.
        \n Nome: ${data.firstName} ${data.lastName}
        \n ChatId: ${data.chatId}
        \n Data: ${dataAtual}`
        
        try {
            await this.bot.sendMessage(process.env.CHAT_ID_ADM,mensagem);
        } catch (error) {
            console.log(error)
        }
    }
}