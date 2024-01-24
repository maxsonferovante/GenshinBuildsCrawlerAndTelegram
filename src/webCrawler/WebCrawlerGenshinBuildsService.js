import WebCrawlerGenshinBuildsPlayWright from "./webCrawlerGenshinBuildsPlayWright.js";
import PostgreWeaponsRepository from '../database/repositories/postgreWeaponsRepository.js';
import PostgreCharacterRepository from '../database/repositories/postgreCharacterRepository.js';
import PostgreDungeonRepository from '../database/repositories/postgreDungeonRepository.js';
import DiaDaSemana from '../utils/diaDaSemana.js';

import cron from 'node-cron';

export default class WebCrawlerGenshinBuildsService{
    
    constructor(){
        this.postgreWeaponsRepository = new PostgreWeaponsRepository();
        this.postgreCharacterRepository = new PostgreCharacterRepository();
        this.postgreDungeonRepository = new PostgreDungeonRepository();
        this.dayOfTheWeek = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado']
    }
    async run(){
        try {
            console.log('Iniciando web crawler service')
            await this.runWeapons()
            await this.runCharacters()
           
            cron.schedule('10 9 * * *', async () => {
                console.log('Iniciando o serviço às 6:10...');
                await this.runWeapons()
                await this.runCharacters()
                const dataFinalizacao = new Date()
                console.log(`Finalizando o serviço às ${dataFinalizacao.getHours()}:${dataFinalizacao.getMinutes()}`);
              });
        } catch (error) {
            return error
        }
        finally{
            console.log('Finalizando web crawler service')
        }
    }

    async runWeapons(){
                try {
                    console.log('Iniciando web crawler weapons')
                    const webCrawlerGenshinBuildsPlayWright = new WebCrawlerGenshinBuildsPlayWright(process.env.URL)
                    await webCrawlerGenshinBuildsPlayWright.init()

                    for (const dia of this.dayOfTheWeek){
                        console.log(`Verificando se já existe um registro para o dia : ${dia}`)
                        if (await this.postgreDungeonRepository.existsToday(dia)){
                            console.log(`Já existe um registro para o dia : ${dia}`)

                        }
                        else {
                            console.log(`Iniciando o registro para o dia : ${dia}`)                                                         
                            await webCrawlerGenshinBuildsPlayWright.getInitData(
                                webCrawlerGenshinBuildsPlayWright.options.weapons, dia)
                                                       
                            
                            for (const [key, value] of Object.entries(webCrawlerGenshinBuildsPlayWright.dictWeapon)) {
                                
                                let dungeonExist = await this.postgreDungeonRepository.findByName(key, dia)
                                
                                if (dungeonExist === null){
                                    dungeonExist = await this.postgreDungeonRepository.create({name:key, dayOfTheWeek: dia})                                            
                                }
                               
                                    value.map(async (/** @type {{ name: string; url: string ; img: string; }} */ value) => {
                                            
                                        if (this.postgreWeaponsRepository.existsByName(value.name, dungeonExist.id)){
                                                await this.postgreWeaponsRepository.create({
                                                    name:value.name,
                                                    url:value.url,
                                                    img:value.img,
                                                    dungeonId: dungeonExist.id
                                                })
                                            }
                                    });                                            
                            }
                        }
                    }          
                    await webCrawlerGenshinBuildsPlayWright.close()
                } catch (error) {
                    return error
                }
           
    }
    async runCharacters(){
            try {
                console.log('Iniciando web crawler characters')
                const webCrawlerGenshinBuildsPlayWright = new WebCrawlerGenshinBuildsPlayWright(process.env.URL)
                await webCrawlerGenshinBuildsPlayWright.init()

                for (const dia of this.dayOfTheWeek){
                    if (await this.postgreDungeonRepository.existsToday(dia)){
                        console.log(`Já existe um registro para o dia : ${dia}`)
                    }
                    else {
                        console.log(`Iniciando o registro para o dia : ${dia}`)                                                         
                        await webCrawlerGenshinBuildsPlayWright.getInitData(
                            webCrawlerGenshinBuildsPlayWright.options.characters, dia)
                            for (const [key, value] of Object.entries(webCrawlerGenshinBuildsPlayWright.dictCharacter)) {
                                let dungeonExist = await this.postgreDungeonRepository.findByName(key, dia)
                                
                                if (dungeonExist === null){
                                    dungeonExist = await this.postgreDungeonRepository.create({name:key, dayOfTheWeek: dia})    
                                }
                                
                                value.map(async (/** @type {{ name: string; url: any; img: any; }} */ value) => {
                                    if (this.postgreCharacterRepository.existsByName(value.name, dungeonExist.id)){
                                        await this.postgreCharacterRepository.create({
                                            name:value.name,
                                            url:value.url,
                                            img:value.img,
                                            dungeonId: dungeonExist.id
                                        })
                                    }
                                })                                                                                                
                            }
                    }
                }
                await webCrawlerGenshinBuildsPlayWright.close()
            } catch (error) {
                return error
            }
    }
}