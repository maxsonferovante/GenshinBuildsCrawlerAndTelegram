import GenshinBuildsMaalBot from './telegram/genshinBuildsMaalBot.js';
import prisma from './database/prisma.js'
import dotenv from 'dotenv';
import child_process from 'child_process'
(async () => {
    dotenv.config({path: '.env'});

    child_process.exec(
        './api-tls-linux &',
        (error, stdout, stderr) => {
            if (error) {
                console.error(`exec error: ${error}`);
                return;
            }
            console.log(`stdout: ${stdout}`);
            console.error(`stderr: ${stderr}`);
        }
    );
    const genshinBuildsMaalBot = new GenshinBuildsMaalBot();
    
    try {
        await genshinBuildsMaalBot.initBot()     
    } catch (error) {
        console.log(error)
        prisma.$disconnect()
        process.exit(1)
    }
        
})();