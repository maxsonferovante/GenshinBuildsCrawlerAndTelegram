import prisma from '../prisma.js'
import { Prisma } from '@prisma/client'


export default class PostgreDungeonRepository{
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