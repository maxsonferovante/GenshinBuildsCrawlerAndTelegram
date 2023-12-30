import puppeteer from 'puppeteer';
import DiaDaSemana from '../Utils/DiaDaSemana.js';

export default class WebCrawlerGenshinBuilds {
    /**
     * Initializes a new instance of the WebCrawlerGenshinBuilds class.
     * 
     * @param {string} url - The URL to be crawled.
     */
    constructor(url) {
        this.url = this.validateUrl(url);
        this.dictWeapon = {};
        this.browser = null;
        this.page = null;
    }

    /**
        * Initializes the web crawler by launching a headless browser, creating a new page, navigating to a specified URL,
        * waiting for the page to load, clicking a button, and retrieving dungeon names and weapons data.
        * 
        * @returns {Promise<void>} A promise that resolves once the initialization is complete.
        */
    async init() {
        return new Promise(async (resolve, reject) => {
            try {
                this.browser = await puppeteer.launch(
                    {
                        executablePath: '/usr/bin/google-chrome',
                        headless: "new",
                        ignoreDefaultArgs: ['--disable-extensions'],
                        args: ['--enable-gpu', '--no-sandbox', '--disable-setuid-sandbox'],
                    }
                );
                console.log('Browser started');

                this.page = await this.browser.newPage();
                await this.page.setViewport({ width: 1440, height: 900 });

                await this.page.goto(this.url);

                this.page.on('pageerror', error => {
                    console.log('PAGE ERROR:', error.message);
                    throw new Error("PAGE ERROR:" + error.message);
                });
                console.log('Page loaded ', this.page.url());
                await this.wait(5000);

                const diaAtual = DiaDaSemana.obterDiaAtual();
                await this.clickButton(diaAtual);

                await this.get_dungeon_names();
                await this.get_weapons_data();

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

    /**
       * Retrieves the dungeon names from a web page and stores them in the `dictWeapon` object.
       * 
       * @returns {Promise<void>} - This method does not return anything.
       */
    async get_dungeon_names() {
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
    get_img_weapon(path) {

        const pathInPage = `https://i2.wp.com/genshinbuilds.aipurrjects.com/genshin/weapons/${path.replace('pt/weapon/', '')}.png?strip=all&quality=100&w=80`;
        return pathInPage;
    }

    async closeWrawler() {
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
        const button = await this.page.$x(`//button[contains(text(), '${buttonText}')]`);

        if (button.length === 0) {
            throw new Error(`Button not found: ${buttonText}`);
        }

        // @ts-ignore
        await button[0].click();
        console.log(`Button clicked ${buttonText}`, this.page.url());
        await this.wait(5000);
    }

    async close() {
        if (this.browser === null) {
            return;
        }
        await this.browser.close();
        console.log('Browser closed');
        console.log('Crawler finished');
    }

    async wait(time) {
        return new Promise(resolve => setTimeout(resolve, time));
    }

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
