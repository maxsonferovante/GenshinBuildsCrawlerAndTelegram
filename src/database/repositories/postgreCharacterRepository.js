import { Prisma } from '@prisma/client'
import prisma from '../prisma.js'

export default class PostgreCharacterRepository{
    async create({name, url, img, dungeonId}){
        try {
            await prisma.character.create({
                data:{
                    name,
                    url,
                    img,
                    dungeonId
                },            
            })
        } catch (error) {
                console.log(error)
                throw new Error('Erro ao criar personagem')
        }
    }
    /**
     * @param {string} name
     */
    async existsByName(name, dungeonId){
        try {
            const character = await prisma.character.findFirst({
                where:{
                    name,
                    dungeonId
                }
            })
            return character  !== null
        } catch (error) {
            console.log(error)
            throw new Error('Erro ao buscar personagem')
        }
    }
    async findByName(name){
        try {
            const character = await prisma.character.findFirst({
                where:{
                    name
                },
                include:{
                    dungeon:true
                }
            })
            return character
        } catch (error) {
            console.log(error)
            throw new Error('Erro ao buscar personagem')
        }
    }

    async findByDungeonId(dungeonId){
        try {
            const character = await prisma.character.findMany({
                where:{
                    dungeonId
                }
            })
            return character
        } catch (error) {
            console.log(error)
            throw new Error('Erro ao buscar personagem')
        }
    }

    async getAllDungeonId(){
        try {
            const character = await prisma.character.findMany({
                select:{
                    dungeonId:true
                }
            })
            return character
        } catch (error) {
            console.log(error)
            throw new Error('Erro ao buscar personagem')
        }
    }

    async getAll(){
        try {
            const characters = await prisma.character.findMany()
            return characters
        } catch (error) {
            console.log(error)
            throw new Error('Erro ao buscar personagens')
        }
    }
    
    async getCharacterToFarmToday(){
        try {
            const character = await prisma.character.findMany({
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
            return character
        } catch (error) {
            console.log(error)
            throw new Error('Erro ao buscar personagens')
        }
    }
}