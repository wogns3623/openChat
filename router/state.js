class state {
    constructor() {
        this.users = {};
        this.rooms = {};
    }

    addRoom(room) {
        this.rooms[room.id] = room;
    }
    
    removeRoom(room) {
        delete this.rooms[room.id];
    }

    addUser(user) {
        var users = Object.values(this.users)
        for ( var i=0; i<users.length; i++ ) {
            if(user.name == users[i].name){
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