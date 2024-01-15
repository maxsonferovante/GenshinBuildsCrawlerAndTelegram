import GenshinBuildsMaalBot from './Telegram/GenshinBuildsMaalBot.js';
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