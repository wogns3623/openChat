module.exports = class room{
    constructor(id, name, img, maxUser, admin, password=null){
        this.id = id;
        this.name = name;
        this.img = img;
        this.maxUser = maxUser;
        this.password = password;

        this.messages = [];
        this.users = {};
    }

    connectUser(user){
        this.users[user.id] = user;
    }

    disconnectUser(user){
        delete this.users[user.id];
    }

    addMessage(message){
        this.messages.push(message);
    }
}