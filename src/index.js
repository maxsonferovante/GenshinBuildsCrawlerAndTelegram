import GenshinBuildsMaalBot from './Telegram/GenshinBuildsMaalBot.js';
import { config } from 'dotenv';

(async () => {
    config();
    const genshinBuildsMaalBot = new GenshinBuildsMaalBot();
    await genshinBuildsMaalBot.initBot();
})();