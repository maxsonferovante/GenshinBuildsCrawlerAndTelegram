import GenshinBuildsMaalBot from './telegram/genshinBuildsMaalBot.js';
import dotenv from 'dotenv';

(async () => {
    dotenv.config(
        {
            path: '.env'
        }
    );
    const genshinBuildsMaalBot = new GenshinBuildsMaalBot();
    await genshinBuildsMaalBot.initBot();
})();