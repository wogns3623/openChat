class state {
    constructor() {
        this.users = {};
        this.rooms = {};
    }

    addRoom(room) {
        if(this.rooms[room.name]) return false;

        this.rooms[room.name] = room;
        return true;
    }
    
    removeRoom(room) {
        delete this.rooms[room.name];
    }

    addUser(user) {
        if(this.users[user.name]) return false;

        this.users[user.name] = user;
        return true;
    }

    removeUser(user) {
        delete this.users[user.id];
    }
}

module.exports = new state();