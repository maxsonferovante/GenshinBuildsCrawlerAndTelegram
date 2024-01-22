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
        this.dayOfTheWeek = DiaDaSemana.obterDiaAtual()
    }
    async run(){
        try {
            console.log('Iniciando web crawler service')
            
             cron.schedule('10 6 * * *', async () => {
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
                    await webCrawlerGenshinBuildsPlayWright.init(webCrawlerGenshinBuildsPlayWright.options.weapons)
                    await webCrawlerGenshinBuildsPlayWright.close()
                    
                    
                    for (const [key, value] of Object.entries(webCrawlerGenshinBuildsPlayWright.dictWeapon)) {
                        
                        let dungeonExist = await this.postgreDungeonRepository.findByName(key, this.dayOfTheWeek)
                        
                        if (dungeonExist === null){
                            dungeonExist = await this.postgreDungeonRepository.create({name:key, dayOfTheWeek: this.dayOfTheWeek})                                            
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
                } catch (error) {
                    return error
                }
           
    }
    async runCharacters(){
            try {
                console.log('Iniciando web crawler characters')
                
                const webCrawlerGenshinBuildsPlayWright = new WebCrawlerGenshinBuildsPlayWright(process.env.URL)
                await webCrawlerGenshinBuildsPlayWright.init(webCrawlerGenshinBuildsPlayWright.options.characters)
                await webCrawlerGenshinBuildsPlayWright.close()

                for (const [key, value] of Object.entries(webCrawlerGenshinBuildsPlayWright.dictCharacter)) {
                    let dungeonExist = await this.postgreDungeonRepository.findByName(key, this.dayOfTheWeek)
                    
                    if (dungeonExist === null){
                        await this.postgreDungeonRepository.create({name:key, dayOfTheWeek: this.dayOfTheWeek})    
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
            } catch (error) {
                return error
            }
    }
}