import prisma from '../prisma.js'
import { Prisma } from '@prisma/client'


export default class PostgreWeaponsRepository{
    async create({name, url, img, dungeonId}){
        try {
            await prisma.weapons.create({
                data:{
                    name,
                    url,
                    img,
                    dungeonId
                },            
            })
        } catch (error) {
                console.log(error)
                throw new Error('Erro ao criar arma')
        }
    }

    /**
     * @param {string} name
     */
    async findByName(name){
        try {
            const weapons = await prisma.weapons.findFirst({
                where:{
                    name
                },
                include:{
                    dungeon:true
                }
            })
            return weapons
        } catch (error) {
            console.log(error)
            throw new Error('Erro ao buscar arma')
        }
    }

    /**
     * @param {string} name
     * @param {string} dungeonId
     */
    async existsByName(name, dungeonId){
        try {
            const weapons = await prisma.weapons.findFirst({
                where:{
                    name,
                    dungeonId
                }
            })
            return weapons!== null
        } catch (error) {            
            console.log(error)
            throw new Error('Erro ao buscar arma')
        }
    }

    async getAll(){
        try {
            const weapons = await prisma.weapons.findMany()
            return weapons
        } catch (error) {
            console.log(error)
            throw new Error('Erro ao buscar armas')
        }
    }
     
    async findByDuration(duration){
        try {
            const weapons = await prisma.weapons.findMany({
                where:{
                    duration
                }
            })
            return weapons
        } catch (error) {
            console.log(error)
            throw new Error('Erro ao buscar armas')
        }
    }
    async getAllByDungeonId(dungeonId){
        try {
            const weapons = await prisma.weapons.findMany({
                where:{
                    dungeonId
                }
            })
            return weapons
        } catch (error) {
            console.log(error)
            throw new Error('Erro ao buscar armas')
        }
    }

    async getWeaponsToFarmToday(){
        try {
            const weapons = await prisma.weapons.findMany({
                where:{
                    createdAt: new Date()
                },
                orderBy:{
                    createdAt:'desc'
                },
                include:{
                    dungeon:true
                }
            })
            return weapons
        } catch (error) {
            console.log(error)
            throw new Error('Erro ao buscar armas')
        }
    }
}