import prisma from '../prisma.js'
import User from '../models/user.js'
import { Prisma } from '@prisma/client'


export default class PostgreUserRepository{
    // o parametro é do tipo User
    async create({firstName, lastName, chatId}){
        try {
            await prisma.user.create({
                data:{
                    firstName,
                    lastName,
                    chatId
                },            
            })
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                await prisma.user.update(
                    {
                        where:{
                            chatId
                        },
                        data:{
                            updatedAt: new Date()
                        }
                    }
                )
            }
            else {
                console.log(error)
                throw new Error('Erro ao criar usuário')
            }
        }
    }

    async findByChatId(chatId){
        try {
            const user = await prisma.user.findFirst({
                where:{
                    chatId
                }
            })
            return new User(
                {
                    id: user.id,
                    // @ts-ignore
                    firstName: user.firstName,
                    lastName: user.lastName,
                    chatId: user.chatId,
                    createdAt: user.createdAt,
                    updatedAt: user.updatedAt
                }    
            )
        } catch (error) {
            console.log(error)
            throw new Error('Erro ao buscar usuário')
        }
    }

    /**
     * @param {number} chatId
     */
    async existsByChatId(chatId){
        try {
            const user = await prisma.user.findFirst({
                where:{
                    chatId
                }
            })
            return user !== null
        } catch (error) {
            console.log(error)
            throw new Error('Erro ao buscar usuário')
        }
    }

    async getAll(){
        try {
            const users = await prisma.user.findMany()
            return users
        } catch (error) {
            console.log(error)
            throw new Error('Erro ao buscar usuário')
        }
    }
}