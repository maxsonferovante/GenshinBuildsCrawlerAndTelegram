import { chromium } from 'playwright';
import DiaDaSemana from '../Utils/DiaDaSemana.js';

export default class WebCrawlerGenshinBuildsPlayWright {
    /**
     * Initializes a new instance of the WebCrawlerGenshinBuildsPlayWright class.
     * 
     * @param {string} url - The URL to be crawled.
     */
    constructor(url) {
        this.url = this.validateUrl(url);
        this.dictWeapon = {};
        this.dictCharacter = {};
        this.browser = null;
        this.context = null;
        this.page = null;
        this.options = {
            'weapons': 'weapons',
            'characters': 'characters'
        }
    }

    /**
     * Initializes the web crawler by launching a headless browser, creating a new page, navigating to a specified URL,
     * waiting for the page to load, clicking a button, and retrieving dungeon names and weapons data.
     * @returns {Promise<void>} A promise that resolves once the initialization is complete.
     * @param {string} [characterOrWeapon]
     */
    async init(characterOrWeapon) {
        return new Promise(async (resolve, reject) => {
            try {
                this.browser = await chromium.launch(
                    {
                        headless: true,
                        args: ['--ignore-certificate-errors', '--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
                    }
                );
                console.log('Browser started');
                this.context = await this.browser.newContext(
                    {
                        userAgent: 'Mozilla/5.0 (X11; Linux x86_64)' +
                            'AppleWebKit/537.36 (KHTML, like Gecko)' +
                            'Chrome/64.0.3282.39 Safari/537.36',
                        locale: 'pt-BR'
                    }

                );
                this.page = await this.context.newPage();

                console.log('Page created');
                console.log('Navigating to ', this.url);
                await this.page.goto(this.url);

                this.page.on('pageerror', error => {
                    console.log('PAGE ERROR:', error.message);
                    throw new Error("PAGE ERROR:" + error.message);
                });
                console.log('Page loaded ', this.page.url());
                await this.wait(1000);

                const diaAtual = DiaDaSemana.obterDiaAtual();
                await this.clickButton(diaAtual);

                if (characterOrWeapon === this.options.weapons) {
                    await this.get_dungeon_names();
                    await this.get_weapons_data();

                }
                if (characterOrWeapon === this.options.characters) {
                    await this.get_characters_names();
                    await this.get_characters_data();
                }
                await this.close();
                resolve();
            } catch (error) {
                reject(error);
            }
        });
    }

    get_json_weapons() {
        return JSON.stringify(this.dictWeapon);
    }
    get_json_characters() {
        return JSON.stringify(this.dictCharacter);
    }
    async get_characters_names() {
        console.log('get_characters_names');
        const trItems = await this.page.$$('tr:not([class])');
        for (const trItem of trItems) {
            const h3Text = await trItem.$eval('h3', (h3) => h3.innerText);
            this.dictCharacter[h3Text] = [];
        }
    }

    async get_characters_data() {
        console.log('get_characters_data');
        const trItems = await this.page.$$('tr:not([class])');

        for (const trItem of trItems) {
            const key = await trItem.$eval('h3', (h3) => h3.innerText);
            const aTags = await trItem.$$eval('td:nth-child(2) a', (as) => as.map((a) => a.href));
            this.dictCharacter[key] = [];
            for (const aTag of aTags) {
                const name = aTag.replace(this.url, '').replace('/character/', '').replace(/\b\w/g, c => c.toUpperCase());
                const url = new URL(aTag, this.url).href;
                const img = await this.get_img_character(aTag);
                this.dictCharacter[key].push({
                    name, url, img
                });
            }
        }
    }
    /**
     * @param {string} href
     */
    async get_img_character(href) {
        const character = href.replace('https://genshin-builds.com/pt/character/', '');
        console.log(`get img character ${character}`);
        const pathInPage = `https://i2.wp.com/genshinbuilds.aipurrjects.com/genshin/characters/${character}.png?strip=all&quality=100&w=80`;
        return pathInPage;
    }
    /**
       * Retrieves the dungeon names from a web page and stores them in the `dictWeapon` object.
       * 
       * @returns {Promise<void>} - This method does not return anything.
       */
    async get_dungeon_names() {
        console.log('get_dungeon_names');
        const trItems = await this.page.$$('tr.border-b.border-gray-700.pt-2.align-middle');
        for (const trItem of trItems) {
            const h3Text = await trItem.$eval('td > h3.text-lg.text-gray-200', el => el.textContent);
            this.dictWeapon[h3Text] = [];
        }
    }

    /**
       * Retrieves weapon data from a web page and stores it in the `dictWeapon` object.
       * 
       * @returns {Promise<void>} - A promise that resolves once the weapon data is stored in `dictWeapon`.
       */
    async get_weapons_data() {
        console.log('get_weapons_data');
        const trItems = await this.page.$$('tr.border-b.border-gray-700.pt-2.align-middle');

        for (const trItem of trItems) {
            const [firstTd, secondTd] = await trItem.$$('td');

            const key = await firstTd.$eval('h3.text-lg.text-gray-200', el => el.textContent);
            const aTags = await secondTd.$$('a');

            this.dictWeapon[key] = [];

            for (const aTag of aTags) {
                const href = await aTag.evaluate(node => node.getAttribute('href'));
                const name = href.replace('/pt/weapon/', '').replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase());
                const url = new URL(href, this.url).href;
                const img = this.get_img_weapon(href);
                this.dictWeapon[key].push({
                    name, url, img
                });
            }
        }
    }
    /**
     * @param {string} path
     */
    get_img_weapon(path) {
        const weapon = path.replace('pt/weapon/', '')
        console.log(`get img weapon ${weapon}`);
        const pathInPage = `https://i2.wp.com/genshinbuilds.aipurrjects.com/genshin/weapons/${weapon}.png?strip=all&quality=100&w=80`;
        return pathInPage;
    }

    async closeWrawler() {
        await this.context.close();
        await this.browser.close();
    }

    /**
      * Clicks on a button on a web page based on the provided button text.
      * 
      * @param {string} buttonText - The text of the button to be clicked.
      * @returns {Promise<void>} - A promise that resolves once the button is clicked.
      * @throws {Error} - If the button is not found.
      */
    async clickButton(buttonText) {
        console.log(`clickButton ${buttonText}`);
        const button = this.page.locator(`//button[contains(text(), '${buttonText}')]`);

        // @ts-ignore
        button.click();
        console.log(`Button clicked ${buttonText}`, this.page.url());
        await this.wait(1000);
    }

    async close() {
        if (this.browser === null) {
            return;
        }
        await this.context.close();
        await this.browser.close();
        console.log('Browser closed');
        console.log('Crawler finished');
    }

    /**
     * @param {number} time
     */
    async wait(time) {
        return new Promise(resolve => setTimeout(resolve, time));
    }

    /**
     * @param {string} url
     */
    validateUrl(url) {
        if (url === null) {
            throw new Error('URL is null');
        }
        if (typeof url !== 'string') {
            throw new Error('URL is not a string');
        }
        if (url === '') {
            throw new Error('URL is empty');
        }
        if (!url.startsWith('http') && !url.startsWith('https')) {
            throw new Error('URL is not valid');
        }
        if (url.endsWith('/')) {
            return url.slice(0, -1);
        }
        return url;
    }
}
