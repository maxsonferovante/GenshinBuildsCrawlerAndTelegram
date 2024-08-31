import axios from "axios";
export default class genshinBuildAPI {

    constructor() {
        this.dictWeapon = {};
        this.dictCharacter = {};

    }

    async getWeaponList(chatId) {
        /* 
        curl -X 'GET' \
        'http://192.168.2.121:8000/crawler/weapons' \
        -H 'accept: application/json'
        */
        try {
            const response = await axios.get('http://0.0.0.0:8000/crawler/weapons',{timeout: 30 * 1000,});
            console.log(`Solicitação - chatId ${chatId} -> response: ${response.status} - ${response.data['created_at']}`);
            this.dictWeapon = response.data.data;
        } catch (error) {
            console.log(`Solicitação - chatId ${chatId} -> error: ${error}`);
            throw new Error(`Solicitação - chatId ${chatId} -> error: ${error}`);
        }
    }

    async getCharacterList(chatId) {
        /* curl -X 'GET' \
        'http://192.168.2.121:8000/crawler/characters' \
        -H 'accept: application/json' */
        try {
            const response = await axios.get('http://0.0.0.0:8000/crawler/characters',{timeout: 30 * 1000,});
            console.log(`Solicitação - chatId ${chatId} -> response: ${response.status} - ${response.data['created_at']}`);
            this.dictCharacter = response.data.data;
        } catch (error) {
            console.log(`Solicitação - chatId ${chatId} -> error: ${error}`);
            throw new Error(`Solicitação - chatId ${chatId} -> error: ${error}`);
        }
    }
    
    

}


const crawler = new genshinBuildAPI();

// crawler.getWeaponList().then((response) => {
//     console.log(response);
// }).catch((error) => {
//     console.log(error);
// });

// crawler.getCharacterList().then((response) => {
//     console.log(response);
// }).catch((error) => {});