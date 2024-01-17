export default class User{
    constructor({id, name, email, chatId, createdAt, updatedAt}){
        this.id = id
        this.firstName = name
        this.lastName = email
        this.chatId = chatId
        this.createdAt = createdAt
        this.updatedAt = updatedAt
    }
}