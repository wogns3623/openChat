var fs = require('fs');

class state {
    constructor() {
        this.users = {};
        this.rooms = {};
    }

    addRoom(room) {
        if (this.rooms[room.name]) return false;

        this.rooms[room.name] = room;
        return true;
    }

    removeRoom(room) {
        delete this.rooms[room.name];
    }

    addUser(user) {
        if (this.users[user.name]) return false;

        this.users[user.name] = user;
        return true;
    }

    removeUser(user) {
        fs.stat("./public/img/userImg/" + user.img, function (err, stats) {
            // console.log(stats); //here we got all information of file in stats variable
            if (err) {
                return console.error(err);
            } else {
                fs.unlink("./public/img/userImg/" + user.img, function (err) {
                    if (err) return console.log(err);
                    else console.log('file deleted successfully');
                });
            }
        });
        delete this.users[user.name];
    }
}

module.exports = new state();