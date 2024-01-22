import GenshinBuildsMaalBot from './telegram/genshinBuildsMaalBot.js';
import WebCrawlerGenshinBuildsService from './webCrawler/WebCrawlerGenshinBuildsService.js';
import prisma from './database/prisma.js'
import dotenv from 'dotenv';

(async () => {
    dotenv.config(
        {
            path: '.env'
        }
    );
    const webCrawlerGenshinBuildsService = new WebCrawlerGenshinBuildsService();
    const genshinBuildsMaalBot = new GenshinBuildsMaalBot();

    try {
        
        await webCrawlerGenshinBuildsService.run()
        await genshinBuildsMaalBot.initBot()     
    } catch (error) {
        console.log(error)
        prisma.$disconnect()
        process.exit(1)
    }
        
})();