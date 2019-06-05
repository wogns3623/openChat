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

        this.connectUser(admin);
    }

    connectUser(user){
        console.log(user);
        
        user.connectRoom(this);
        this.users[user.name] = user;
    }

    disconnectUser(user, callback){
        if(user == admin) {
            for( [key, value] of Object.entries(this.users) ){
                value.disconnectRoom(this);
            }

            callback(this);
        } else {
            user.disconnectRoom(this);
            delete this.users[user.name];

            // this.addMessage(new message(
            //     this.messages.length,
            //     user.name,
            //     "user +"+user.name+" leave the room",
            //     Date(),
            //     true
            // ));
            
            return true;
        }
    }

    addMessage(message){
        this.messages.push(message);
    }
}