import GenshinBuildsMaalBot from './Telegram/GenshinBuildsMaalBot.js';


(async () => {
    const genshinBuildsMaalBot = new GenshinBuildsMaalBot();
    await genshinBuildsMaalBot.initBot();
})();