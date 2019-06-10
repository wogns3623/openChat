var state = require('./state.js');

module.exports = class room{
    constructor(id, name, admin, img, maxUser=10, password=null){
        this.id = id;
        this.name = name;
        this.admin = admin;
        
        this.img = img;
        this.maxUser = maxUser;
        this.password = password;
        
        this.messages = [];
        this.users = {};
        this.visitedUsers = {};
    }

    connectUser(user){
        // user.connectRoom(this.name);
        this.users[user.name] = user.name;
        if(this.visitedUsers[user.name] == undefined) this.visitedUsers[user.name] = user.name;
    }

    disconnectUser(user){
        if(this.users[user.name] == undefined) {
            return false;
        } else if(user.name == this.admin) {
            console.log("방장이 퇴장하여 방을 제거합니다.");
            var userArr = Object.values(this.users);
            for( var i=0; i<userArr.length; i++ ){
                state.users[userArr[i]].disconnectRoom();
            }

            return 2;
        } else {
            console.log("유저가 나가 유저 목록에서 제거합니다.");
            user.disconnectRoom();
            delete this.users[user.name];

            return 1;
        }
    }

    addMessage(message){
        this.messages.push(message);
    }
}