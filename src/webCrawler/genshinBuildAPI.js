import axios from "axios";
export default class genshinBuildAPI {
  constructor() {
    this.dictWeapon = {};
    this.dictCharacter = {};
    this.url_base = process.env.URL_API;
  }

  async getWeaponList(chatId) {
    try {
      const response = await axios.get(`${this.url_base}/crawler/weapons`, {
        timeout: 30 * 1000,
      });
      console.log(
        `Solicitação - chatId ${chatId} -> response: ${response.status} - ${response.data["created_at"]}`
      );
      this.dictWeapon = response.data.data;
    } catch (error) {
      console.log(`Solicitação - chatId ${chatId} -> error: ${error}`);
      throw new Error(`Solicitação - chatId ${chatId} -> error: ${error}`);
    }
  }

  async getCharacterList(chatId) {
    try {
      const response = await axios.get(`${this.url_base}/crawler/characters`, {
        timeout: 30 * 1000,
      });
      console.log(
        `Solicitação - chatId ${chatId} -> response: ${response.status} - ${response.data["created_at"]}`
      );
      this.dictCharacter = response.data.data;
    } catch (error) {
      console.log(`Solicitação - chatId ${chatId} -> error: ${error}`);
      throw new Error(`Solicitação - chatId ${chatId} -> error: ${error}`);
    }
  }
}
