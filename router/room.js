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

    connectUser(user, password){
        if(this.password == null || password == this.password){
            user.connectRoom(this.name);
            this.users[user.name] = user;
            if(this.visitedUsers[user.name] == undefined) this.visitedUsers[user.name] = user;
        }
    }

    disconnectUser(user){
        if(this.users[user.name] == undefined) {
            return false;
        } else if(user == this.admin) {
            var userArr = Object.values(this.users);
            for( var i=0; i<userArr.length; i++ ){
                userArr[i].disconnectRoom();
            }

            return 2;
        } else {
            user.disconnectRoom();
            delete this.users[user.name];

            return 1;
        }
    }

    addMessage(message){
        this.messages.push(message);
    }
}