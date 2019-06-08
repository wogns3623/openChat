var fs = require('fs');

class state {
    constructor() {
        this.users = {};
        this.inactivateUsers = {};
        this.rooms = {};
    }

    addRoom(room) {
        if (this.rooms[room.name]) return false;

        this.rooms[room.name] = room;
        return true;
    }

    removeRoom(room) {
        var visitedUsers = Object.keys(room.visitedUsers);
        for (var i = 0; i < visitedUsers.length; i++) {
            var user = visitedUsers[i];
            if (this.users[user]) {
                this.users[user].visitedRooms[room.name] = undefined;
            }
            if (this.inactivateUsers[user]) {
                this.inactivateUsers[user].visitedRooms[room.name] = undefined;

                if (Object.keys(this.this.inactivateUsers[user].visitedRooms).length == 0) {
                    this.removeUser(user);
                }
            }
        }
        delete this.rooms[room.name];
    }

    addUser(user) {
        if (this.users[user.name]) return false;

        this.users[user.name] = user;
        return true;
    }

    inactivateUser(user) {
        if (this.users[user.name] == undefined) return false;
        delete this.users[user.name];
        
        if (this.inactivateUsers[user.name]) return false;
        this.inactivateUsers[user.name] = user;

        if (Object.keys(user.visitedRooms).length == 0) {
            this.removeUser(user);
        }
    }

    activateUser(user) {
        if (this.inactivateUsers[user.name] == undefined) return false;
        delete this.inactivateUsers[user.name];

        if (this.users[user.name]) return false;
        this.users[user.name];
    }

    removeUser(user) {
        if (this.inactivateUsers[user.name]) {
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
            delete this.inactivateUsers[user.name];
        }
    }
}

module.exports = new state();