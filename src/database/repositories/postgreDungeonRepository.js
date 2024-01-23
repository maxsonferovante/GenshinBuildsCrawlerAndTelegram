import prisma from '../prisma.js'

import DiaDaSemana from '../../utils/diaDaSemana.js';

export default class PostgreDungeonRepository{
    
    async getDungeonAndWeponsToFarmToday(){ 
        try {
            const dungeons = await prisma.dungeon.findMany({
                where:{
                    dayOfTheWeek: DiaDaSemana.obterDiaAtual()
                },
                include:{
                    weapons:true
                }
            })
            return dungeons
        } catch (error) {
            console.log(error)
            throw new Error('Erro ao buscar armas para farmar:')
        }
    }
    async getDungeonAndCharactersToFarmToday() {
        try {
            const dungeons = await prisma.dungeon.findMany({
                where:{
                    dayOfTheWeek: DiaDaSemana.obterDiaAtual()
                },
                include:{
                    characters:true
                }
            })
            return dungeons
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