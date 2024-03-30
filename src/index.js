import GenshinBuildsMaalBot from './telegram/genshinBuildsMaalBot.js';
import prisma from './database/prisma.js'
import dotenv from 'dotenv';

(async () => {
    dotenv.config({path: '.env'});

    const genshinBuildsMaalBot = new GenshinBuildsMaalBot();
    
    try {
        await genshinBuildsMaalBot.initBot()     
    } catch (error) {
        console.log(error)
        prisma.$disconnect()
        process.exit(1)
    }
        
})();