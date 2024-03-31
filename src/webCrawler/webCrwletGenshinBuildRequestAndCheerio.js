import axios from "axios";
import cheerio from "cheerio";
export default class WebCrawlerGenshinBuildsRequestAndCheerio {
    /**
     * Initializes a new instance of the WebCrawlerGenshinBuildsRequestAndCheerio class.
     * @param {string} url - The URL to be crawled.
     */
    constructor(url) {
        this.url = this.validateUrl(url);
        this.dictWeapon = {};
        this.dictCharacter = {};
        this.options = {
            'weapon': 'weapon',
            'character': 'character'
        }
        this.$ = null;
    }
    
    async initExtratcData(chatId) {
        try {
            //const response = await axios.get(this.url);
            const options = {
                Timeout: 40,
                Method: 'GET',
                Url: this.url,
                UserAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3',
            }
            const response = await axios.post(
                'http://0.0.0.0:9090',
                {
                    TLSOptions: options
                },
                {
                    timeout: ((40 * 1000) + 10000)
                }
            );

            switch (response.status) {
                case 200:
                    console.log(`Resquest Success - ChatId: ${chatId}`)
                    this.loadData(response);
                    this.extratcData();
                    console.log(`Extratc Data Success - ChatId: ${chatId}`);
                    break;
                case 404:                    
                    throw new Error('URL not found');
                default:
                    throw new Error('An error occurred');
            }
        } catch (error) {
            return error;
        }
    }

    /**
     * @param {import("axios").AxiosResponse<any, any>} response
     */
    loadData(response) {
        try {
            this.$ = cheerio.load(response.data.data);
        } catch (error) {
            throw new Error('Error loading data - cheerio.load()');
        }
    }

    extratcData() {
        this.$('body').each((i, el) => {
            this.$(el).find('div').find("main").find('div').find('div').find('div').find('table')
            .each((i, element) => {
                this.$(element).find('tbody').find('tr').each((i, line) => {                

                    const nameDungeon = this.$(line).find('td').eq(0).text().trim();
                        

                    this.$(line).find('td').eq(1).find('div').find('a').each((i, column) => {

                        const item = this.$(column).attr('href').split('/')[2];    
                        
                        if (item === this.options.weapon) {
                            if (!this.dictWeapon[nameDungeon]) {
                                this.dictWeapon[nameDungeon] = [];
                            }
                            this.dictWeapon[nameDungeon].push({                                
                                name: this.$(column).attr('href').split('/')[3].replace('_', ' ').toUpperCase(),
                                type: this.$(column).attr('href').split('/')[2],
                                url: process.env.URL + this.$(column).attr('href').slice(3),
                                imagen: this.get_img_weapon(this.$(column).attr('href'))
                            });

                        }else if (item === this.options.character) {
                            if (!this.dictCharacter[nameDungeon]) {
                                this.dictCharacter[nameDungeon] = [];
                            }
                            this.dictCharacter[nameDungeon].push( {
                                name: this.$(column).attr('href').split('/')[3].replace('_', ' ').toUpperCase(),
                                type: this.$(column).attr('href').split('/')[2],
                                url: process.env.URL + this.$(column).attr('href').slice(3),
                                imagen: this.get_img_character(this.$(column).attr('href'))
                            });
                        }                                
                    })                
                });
            });
        });
    }  
    /**
     * @param {string} path
     */
    get_img_weapon(path) {
        //https://i2.wp.com/genshinbuilds.aipurrjects.com/genshin/weapons/pt/weapon/cashflow_supervision.png?strip=all&quality=100&w=80        
        return `https://i2.wp.com/genshinbuilds.aipurrjects.com/genshin/weapons/${path.slice(11)}.png?strip=all&quality=100&w=80`;
    }
    /**
     * @param {string} href
     */
    get_img_character(href) {        
        return `https://i2.wp.com/genshinbuilds.aipurrjects.com/genshin/characters/${href.slice(14)}.png?strip=all&quality=100&w=80`;
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


// process.env.URL = 'https://genshin-builds.com/pt';

// const webCrawlerGenshinBuildsRequestAndCheerio = new WebCrawlerGenshinBuildsRequestAndCheerio('https://genshin-builds.com/pt');

// webCrawlerGenshinBuildsRequestAndCheerio.initExtratcData().then(() => {
//     for (const key in webCrawlerGenshinBuildsRequestAndCheerio.dictWeapon) {
//         console.log(key);
//         console.log(webCrawlerGenshinBuildsRequestAndCheerio.dictWeapon[key]);
//     }
// })


// .catch((error) => {
//     console.log(error);
// });