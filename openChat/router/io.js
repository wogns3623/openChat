var room = require('./room');
var user = require('./user');
var message = require('./message');
var state = require('./state.js');

module.exports = function (server, fs, cookie) {

    var getUserName = function (socket) {
        if (socket.handshake.headers.cookie) {
            var clientCookie = cookie.parse(socket.handshake.headers.cookie);
            if (clientCookie.userInfo) {
                var userInfo = JSON.parse(clientCookie.userInfo.substr(2));
                return userInfo.user_name
            }
        }
        console.log("fail to get cookie information");
        return;
    }

    var updateUserList = function (room) {
        var userNames = Object.values(room.users);
        var userList = [];
        for (var i = 0; i < userNames.length; i++) {
            var user = state.users[userNames[i]];
            userInfo = {
                name: user.name,
                img: user.img == null ? "default.png" : "userImg/" + user.img
            }
            userList.push(userInfo);
        }
        io.to(room.name).emit('update user_list', userList);
    }

    var io = require('socket.io')(server);
    io.sockets.on('connection', function (socket) {

        socket.on('login', function (data) {
            var currentUser = new user(
                Object.keys(state.users).length + 1,
                data.user_name,
            );

            if (state.addUser(currentUser)) {
                if (data.user_img) {
                    currentUser.img = data.user_name + "." + data.img_name.split(".").pop();
                    fs.writeFile("./public/img/userImg/" + currentUser.img, data.user_img, 'binary', function (err) {
                        if (err) {
                            console.log('login fail');
                            socket.emit('login fail', {
                                reason: "이미지를 업로드하지 못해 로그인에 실패하였습니다"
                            });
                        } else {
                            console.log('login success!');
                            socket.emit('login success', currentUser);
                            console.log("바뀐 접속자 수 데이터를 보냅니다!");
                            io.emit('update concurrent user', {
                                visitors: Object.keys(state.users).length
                            });
                        }
                    });
                } else {
                    console.log('login success!');
                    socket.emit('login success', currentUser);
                    console.log("바뀐 접속자 수 데이터를 보냅니다!");
                    io.emit('update concurrent user', {
                        visitors: Object.keys(state.users).length
                    });
                }

            } else {
                console.log('login fail');
                socket.emit('login fail', {
                    reason: "이름이 같은 유저가 접속중입니다!"
                });
            }
        });

        socket.on('get concurrent user', function () {
            socket.emit('update concurrent user', {
                visitors: Object.keys(state.users).length
            });
        });

        socket.on('get cookie', function () {
            // var clientCookie = cookie.parse(socket.handshake.headers.cookie);
            // var userInfo = JSON.parse(clientCookie.userInfo.substr(2));
            var currentUser = state.users[getUserName(socket)];
            if (currentUser == undefined) {
                console.log("connect fail")
                socket.emit('connection fail');
                return;
            } else {
                currentUser.distroyTimer();
                currentUser.setSocket(socket);

                socket.emit('get cookie success', {
                    user_name: currentUser.name
                });
            }
        });

        socket.on('get room_list', function () {
            console.log("방 리스트 정보 요청을 받았습니다!");
            io.emit("update room_list", state.rooms);
        });

        socket.on('enter room', function (data) {
            var currentRoom;
            if(data.room_name == ""){
                return socket.emit('enter room fail', "입력이 제대로 들어오지 않았습니다");
            }
            if(data.room_maxUser == "") data.room_maxUser = 10;
            if (state.rooms[data.room_name] == undefined) {
                currentRoom = new room(
                    Object.keys(state.rooms).length + 1,
                    data.room_name,
                    state.users[getUserName(socket)].name,
                    null,
                    data.room_maxUser > 999 ? 999 : data.room_maxUser,
                    data.room_pw
                );

                if (data.room_img) {
                    currentRoom.img = data.room_name + "." + data.img_name.split(".").pop();
                    fs.writeFile("./public/img/roomImg/" + currentRoom.img, data.room_img, 'binary', function (err) {
                        if (err) {
                            console.log('get room_img fail');
                            delete currentRoom;
                            socket.emit('enter room fail', "이미지를 저장하지 못해 방을 생성하지 못했습니다");
                            return;
                        } else {
                            console.log('get room_img success!');
                        }
                    });
                } else {
                    console.log('get room_img success!');
                }

                state.addRoom(currentRoom);
            } else {
                currentRoom = state.rooms[data.room_name];
            }
            // console.log(currentRoom);
            // console.log(currentRoom.password, data.room_pw)
            if(Object.keys(currentRoom.users).length == currentRoom.maxUser){
                return socket.emit('enter room fail', "사람이 너무 많아요!");
            } else if (currentRoom.password == data.room_pw) {
                socket.emit('enter room success', {
                    room_name: data.room_name
                });

            } else {
                return socket.emit('enter room fail', "비밀번호가 틀렸습니다!");
            }
        });

        socket.on('join room', function (data) {
            var currentUser = state.users[getUserName(socket)];
            if (currentUser == undefined) {
                socket.emit('connection fail');
                return;
            }

            var currentRoom = state.rooms[data.room_name];
            if (currentRoom == undefined) {
                socket.emit('remove room');
                return;
            }

            currentRoom.connectUser(currentUser);

            socket.emit('join room success', {
                img: currentRoom.img == null ? "defaultRoom.png" : "roomImg/" + currentRoom.img
            });
            io.emit('update room_list', state.rooms);

            socket.join(currentRoom.name, function () {
                console.log(currentUser.name + ' successfuly join in room ' + currentRoom.name);

                var msg = new message(
                    currentRoom.messages.length,
                    currentUser.name,
                    currentUser.img == null ? "default.png" : "userImg/" + currentUser.img,
                    "user " + currentUser.name + " join the room!",
                    new Date().toISOString(),
                    true
                );
                currentRoom.addMessage(msg);

                updateUserList(currentRoom);

                socket.emit('receive beforeMessages', {
                    msgs: currentRoom.messages
                });

                socket.broadcast.to(currentRoom.name).emit('receive message', {
                    msg: msg
                });

            });
        });

        socket.on('send message', function (data) {
            // console.log(data);
            var currentUser = state.users[getUserName(socket)];
            if (currentUser == undefined) {
                socket.emit('connection fail');
                return;
            }
            if (currentUser) {
                var currentRoom = state.rooms[currentUser.connectedRoom];
                var msg = new message(
                    currentRoom.messages.length,
                    currentUser.name,
                    currentUser.img == null ? "default.png" : "userImg/" + currentUser.img,
                    data.content,
                    data.date
                );
                currentRoom.addMessage(msg);

                io.to(currentRoom.name).emit('receive message', {
                    msg: msg
                });
            } else {
                socket.emit('connection fail');
            }
        });

        socket.on('disconnect', function (reason) {
            var currentUser = state.users[getUserName(socket)];
            if (currentUser == undefined) {
                socket.emit('connection fail');
                return;
            }
            console.log("user " + currentUser.name + " disconnected because of " + reason);

            if (currentUser.connectedRoom != null) {
                var currentRoom = state.rooms[currentUser.connectedRoom];
                var result = currentRoom.disconnectUser(currentUser);
                if (result == 1) {
                    var msg = new message(
                        currentRoom.messages.length,
                        currentUser.name,
                        currentUser.img == null ? "default.png" : "userImg/" + currentUser.img,
                        "user " + currentUser.name + " leave the room",
                        new Date().toISOString(),
                        true
                    );
                    currentRoom.addMessage(msg);

                    io.to(currentRoom.name).emit('receive message', {
                        msg: msg
                    });

                    io.emit('update room_list', state.rooms);

                    updateUserList(currentRoom);

                    console.log("user " + currentUser.name + " leave room");
                } else if (result == 2) {
                    state.removeRoom(currentRoom);

                    io.emit('update room_list', state.rooms);

                    console.log("room Removed!");
                } else {
                    console.log("그 유저는 방에 없어요!");
                }
            }
            currentUser.setTimer(setTimeout(function (user) {
                // console.log(user.currentSocket);
                state.inactivateUser(user);
                console.log("remove user " + user.name + " success!");
                if (Object.keys(user.visitedRooms).length == 0) {
                    state.removeUser(user);
                }
                // console.log(state.users);
                io.emit('update concurrent user', {
                    visitors: Object.keys(state.users).length
                });
            }, 3000, currentUser));
        });
    });
    return io;
}