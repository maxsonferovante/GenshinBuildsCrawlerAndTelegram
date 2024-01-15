import TelegramBot from 'node-telegram-bot-api';
import WebCrawlerGenshinBuilds from '../WebCrawler/WebCrawlerGenshinBuildsPlayWright.js';
import DiaDaSemana from '../Utils/DiaDaSemana.js';
import fs from 'node:fs';
import WebCrawlerGenshinBuildsPlayWright from '../WebCrawler/WebCrawlerGenshinBuildsPlayWright.js';

export default class GenshinBuildsMaalBot {
    constructor() {
        console.log('GenshinBuildsMaalBot initialized ...');

        this.bot = new TelegramBot(process.env.TELEGRAM_TOKEN, { polling: true, filepath: false });

        this.crawler = new WebCrawlerGenshinBuildsPlayWright(process.env.URL);

        this.keyboard = [["/weapons", "/characters"], ["/start"], ["/about"], ["/help"]];
    }
    async initBot() {
        await this.welconeGenshinBuidlsMaalBot();
        await this.sendCharacters();
        await this.sendWeapons();
        await this.sendAbout();
        await this.sendHelper();
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
                const fileBuffer = fs.readFileSync('./src/media/img/logo.png');
                await this.bot.sendPhoto(
                    chatId,
                    fileBuffer,
                    {
                        caption: `<b>Olá ${msg.from.first_name}</b>, Bem-vindo ao Genshin-Builds Maal-Bot! 🔮⚔️  
                        \n Aqui você descobrirá quais armas são mais vantajosas para farmar, otimizando suas estratégias no mundo de Genshin Impact. 
                        \n Estou aqui para ajudar você a escolher as armas ideais para potencializar o poder dos seus personagens! 🌟✨
                        \n Para mais informações acesse o link abaixo: link`,
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
                this.bot.sendMessage(chatId, `<i> Aguarde, estamos buscando os personagens disponíveis para farmar hoje (${DiaDaSemana.obterDataAtualComDiaDaSemana()}) ... </i>`, { parse_mode: 'HTML' });
                await this.crawler.init(
                    this.crawler.options.characters
                );

                await this.bot.sendMessage(chatId, `Personagens Disponível para Farmar hoje (${DiaDaSemana.obterDataAtualComDiaDaSemana()}) são : \n\n`, { parse_mode: 'HTML' });

                for (const [key, value] of Object.entries(this.crawler.dictCharacter)) {
                    let quantityCharacters = value.length + 1;
                    await this.bot.sendMessage(chatId,
                        `<b>${key}</b> \n\n${value.map((character) => {
                            quantityCharacters--;
                            const textResponse = `${(value.length - quantityCharacters) + 1} - <a href="${character.url}">${character.name}</a>`;
                            return textResponse;
                        }).join(' \n')}`
                        , { parse_mode: 'HTML' });
                }
            } catch (error) {
                this.bot.sendMessage(chatId, 'Ocorreu um erro ao tentar obter os personagens.');
                console.error(error);
            }
            finally {
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
                this.bot.sendMessage(chatId, `<i> Aguarde, estamos buscando as armas disponíveis para farmar hoje (${DiaDaSemana.obterDataAtualComDiaDaSemana()}) ... </i>`, { parse_mode: 'HTML' });

                await this.crawler.init(
                    this.crawler.options.weapons
                );

                await this.bot.sendMessage(chatId, `Armas Disponível para Ffarmar hoje (${DiaDaSemana.obterDataAtualComDiaDaSemana()}) são : \n\n`, { parse_mode: 'HTML' });

                for (const [key, value] of Object.entries(this.crawler.dictWeapon)) {
                    let quantityWeapons = value.length + 1;
                    await this.bot.sendMessage(chatId,
                        `<b>${key}</b> \n\n${value.map((weapon) => {
                            quantityWeapons--;
                            const textResponse = `${(value.length - quantityWeapons) + 1} - <a href="${weapon.url}">${weapon.name}</a>`;
                            return textResponse;
                        }).join(' \n')}`
                        , { parse_mode: 'HTML' });
                }

            } catch (error) {
                this.bot.sendMessage(chatId, 'Ocorreu um erro ao tentar obter as armas.');
                console.error(error);
            }
            finally {
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
                const fileBuffer = fs.readFileSync('./src/media/img/logo.png')

                await this.bot.sendPhoto(chatId,
                    fileBuffer,
                    {
                        caption:
                            `<b>Olá ${msg.from.first_name}</b>, Bem-vindo ao Genshin-Builds Maal-Bot! 🔮⚔️  
                            \n Aqui você descobrirá quais armas são mais vantajosas para farmar, otimizando suas estratégias no mundo de Genshin Impact. 
                            \n Estou aqui para ajudar você a escolher as armas ideais para potencializar o poder dos seus personagens! 🌟✨
                            \n Para mais informações acesse o link abaixo: link`,
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
                    { parse_mode: "HTML" }
                );
            } catch (error) {
                const chatId = msg.chat.id;
                await this.bot.sendMessage(chatId, 'Possivelmente estamos com problemas, tente novamente mais tarde.');
                console.error(error);
            }
        });
    }
}