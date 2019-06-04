class state {
    constructor() {
        this.users = {};
        this.rooms = {};
    }

    addRoom(room) {
        if(this.rooms[room.name] != undefined) return false;

        this.rooms[room.name] = room;
        return true;
    }
    
    removeRoom(room) {
        delete this.rooms[room.name];
    }

    addUser(user) {
        var userValues = Object.values(this.users)
        for ( var i=0; i<users.length; i++ ) {
            if(user.name == userValues[i].name){
                return false;
            }
        }

        this.users[user.socket_id] = user;
        return true;
    }

    removeUser(user) {
        delete this.users[user.id];
    }
}

module.exports = new state();