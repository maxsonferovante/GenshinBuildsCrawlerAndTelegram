import prisma from '../prisma.js'

import DiaDaSemana from '../../utils/diaDaSemana.js';

export default class PostgreDungeonRepository{
    
    /**
     * @param {string} [diasDaSemana]
     */
    async existsToday(diasDaSemana){
        try {
            const dungeon = await prisma.dungeon.findFirst({
                where:{
                    dayOfTheWeek: diasDaSemana,
                    //2024-01-23T23:19:49.763Z 
                    createdAt:{
                        gte: new Date(new Date().setHours(0,0,0,0)).toISOString(),
                    }
                }
            })
            return dungeon !== null
        } catch (error) {
            console.log(error)
            throw new Error('Erro ao buscar armas para farmar:')
        }
    }

    async getDungeonAndWeponsToFarmToday(){ 
        try {
            // metodo para retornar somente as dungeons e os seus chartacters que podem ser farmadas no dia atual
            const dungeons = await prisma.dungeon.findMany({
                where:{
                    dayOfTheWeek: DiaDaSemana.obterDiaAtual()
                },
                include:{
                    weapons:{
                        select:{
                            name:true,
                            url:true,
                            img:true
                        }
                    }
                }
            });
            return dungeons.filter((/** @type {{ weapons: string | any[]; }} */ dungeon) => dungeon.weapons.length > 0)
        } catch (error) {
            console.log(error)
            throw new Error('Erro ao buscar armas para farmar:')
        }
    }
    async getDungeonAndCharactersToFarmToday() {
        try {
            // metodo para retornar somente as dungeons e os seus chartacters que podem ser farmadas no dia atual
            // o retoro precisa ser somente as dungeons com chartacters
            const dungeons = await prisma.dungeon.findMany({
                where:{
                    dayOfTheWeek: DiaDaSemana.obterDiaAtual()
                },
                include:{
                    characters:{
                            select:{
                                name:true,
                                url:true,
                                img:true
                            }
                    }
                }
            });
            return dungeons.filter((/** @type {{ characters: string | any[]; }} */ dungeon) => dungeon.characters.length > 0)
        } catch (error) {
            console.log(error)
            throw new Error('Erro ao buscar personagens para farmar')
        }
    }

    /**
     * 
     * @param {*} param0 
     * @returns Prisma.PromiseReturnType<Prisma.dungeonCreateClient<Prisma.dungeonCreateArgs>>  
     */
    async create({name, dayOfTheWeek}){
        try {
            const dungeon = await prisma.dungeon.create({
                data:{
                    name,
                    dayOfTheWeek

                }
            })
            return  dungeon
        } catch (error) {
                console.log(error)
                throw new Error('Erro ao criar arma')
        }
    }

    /**
     * @param {string} name
     * @param {string} [dayOfTheWeek]
     */
    async findByName(name, dayOfTheWeek){
        try {
            const dungeon = await prisma.dungeon.findFirst({
                where:{
                    name,
                    dayOfTheWeek
                }
            })
            return dungeon
        } catch (error) {
            console.log(error)
            throw new Error('Erro ao buscar arma')
        }
    }
    async findAll(){
        try {
            const dungeons = await prisma.dungeon.findMany()
            return dungeons
        } catch (error) {
            console.log(error)
            throw new Error('Erro ao buscar arma')
        }
    }

    /**
     * @param {string} name
     * @param {string} [dayOfTheWeek]
     */
    async existsByName(name, dayOfTheWeek){
        try {            
            const dungeon = await prisma.dungeon.findFirst({
                where:{
                    name,
                    dayOfTheWeek
                }
            })
            return dungeon !== null
        } catch (error) {
            console.log(error)
            throw new Error('Erro ao buscar arma')
        }
    }
}

