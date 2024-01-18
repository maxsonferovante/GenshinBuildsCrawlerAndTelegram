import {
    PrismaClient
} from '@prisma/client'


/**
 * @description: Cria uma instância do PrismaClient
 * @returns {PrismaClient} 
 * @throws {Error}
 * @example
 * const prisma = new PrismaClient()
 * log: ['query', 'info', 'warn']
 */
let prisma
try {
    prisma = new PrismaClient()    
} catch (error) {
    console.log(error)
    throw new Error('Error em conectar com o banco de dados')
}


export default prisma
