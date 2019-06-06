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
    }

    connectUser(user){
        user.connectRoom(this);
        this.users[user.name] = user;
    }

    disconnectUser(user){
        if(this.users[user.name] == undefined) {
            return false;
        } else if(user == this.admin) {
            var userArr = Object.values(this.users);
            for( var i=0; i<userArr.length; i++ ){
                userArr[i].disconnectRoom(this);
            }

            return 2;
        } else {
            user.disconnectRoom(this);
            delete this.users[user.name];

            return 1;
        }
    }

    addMessage(message){
        this.messages.push(message);
    }
}