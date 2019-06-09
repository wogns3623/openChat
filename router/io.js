var room = require('./room');
var user = require('./user');
var message = require('./message');
var state = require('./state.js');

module.exports = function(server, fs, cookie) {
    
    var getUserName = function(socket) {
        if(socket.handshake.headers.cookie) {
            var clientCookie = cookie.parse(socket.handshake.headers.cookie);
            if(clientCookie.userInfo) {
                var userInfo = JSON.parse(clientCookie.userInfo.substr(2));
                return userInfo.user_name
            }
        }
        console.log("fail to get cookie information");
        return;
    }

    var io = require('socket.io')(server);
    io.sockets.on('connection', function(socket) {

        socket.on('login', function(data) {
            var currentUser = new user(
                Object.keys(state.users).length+1,
                data.user_name,
            );

            if( state.addUser(currentUser) ) {
                if(data.user_img){
                    currentUser.img = data.user_name+"."+data.img_name.split(".").pop();
                    fs.writeFile("./public/img/userImg/"+currentUser.img, data.user_img, 'binary', function(err){
                        if(err){
                            console.log('login fail');
                            socket.emit('login fail',{
                                reason: "이미지를 업로드하지 못해 로그인에 실패하였습니다"
                            });
                        } else {
                            console.log('login success!');
                            socket.emit('login success', currentUser);
                            console.log("바뀐 접속자 수 데이터를 보냅니다!");
                            io.emit('update concurrent user', {visitors: Object.keys(state.users).length});
                        }
                    });
                } else {
                    console.log('login success!');
                    socket.emit('login success', currentUser);
                    console.log("바뀐 접속자 수 데이터를 보냅니다!");
                    io.emit('update concurrent user', {visitors: Object.keys(state.users).length});
                }

            } else {
                console.log('login fail');
                socket.emit('login fail',{
                    reason: "이름이 같은 유저가 접속중입니다!"
                });
            }
        });

        socket.on('get concurrent user', function() {
            socket.emit('update concurrent user', {visitors: Object.keys(state.users).length});
        });

        socket.on('get cookie', function() {
            // var clientCookie = cookie.parse(socket.handshake.headers.cookie);
            // var userInfo = JSON.parse(clientCookie.userInfo.substr(2));
            var currentUser = state.users[getUserName(socket)];
            if(currentUser == undefined) {
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

        socket.on('get room_list', function() {
            io.emit('update room_list', state.rooms);
        });

        socket.on('enter room', function(data) {
            var currentRoom;
            if(state.rooms[data.room_name] == undefined){
                currentRoom = new room(
                    Object.keys(state.rooms).length+1,
                    data.room_name,
                    state.users[getUserName(socket)].name,
                    null,
                    10,
                    data.room_pw
                )
                state.addRoom(currentRoom);
            } else {
                currentRoom = state.rooms[data.room_name];
            }
            // console.log(currentRoom);
            // console.log(currentRoom.password, data.room_pw)
            if(currentRoom.password == data.room_pw) {
                socket.emit('enter room success', {
                    room_name: data.room_name
                });

                io.emit('update room_list', state.rooms);

            } else {
                socket.emit('enter room fail');
            }
        });

        socket.on('join room', function(data) {
            var currentUser = state.users[getUserName(socket)];
            if(currentUser == undefined) {
                socket.emit('connection fail');
                return;
            }
            
            var currentRoom = state.rooms[data.room_name];
            if( currentRoom == undefined) {
                socket.emit('remove room');
                return;
            }

            currentRoom.connectUser(currentUser);

            socket.join(currentRoom.name, function() {
                console.log(currentUser.name+' successfuly join in room '+currentRoom.name);

                var msg = new message(
                    currentRoom.messages.length,
                    currentUser.name,
                    currentUser.img == null ? "default.png" : "userImg/"+currentUser.img,
                    "user "+currentUser.name+" join the room!",
                    new Date().toISOString(),
                    true
                );
                currentRoom.addMessage(msg);

                socket.emit('receive beforeMessages', {
                    msgs: currentRoom.messages
                });

                socket.broadcast.to(currentRoom.name).emit('receive message', {
                    msg: msg
                });

            });
        });

        socket.on('send message', function(data) {
            // console.log(data);
            var currentUser = state.users[getUserName(socket)];
            if(currentUser == undefined) {
                socket.emit('connection fail');
                return;
            }
            if(currentUser) {
                var currentRoom = state.rooms[currentUser.connectedRoom];
                var msg = new message(
                    currentRoom.messages.length,
                    currentUser.name,
                    currentUser.img == null ? "default.png" : "userImg/"+currentUser.img,
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

        socket.on('disconnect', function(reason) {
            var currentUser = state.users[getUserName(socket)];
            if(currentUser == undefined) {
                socket.emit('connection fail');
                return;
            }
            console.log("user "+currentUser.name+" disconnected because of "+reason);

            console.log(currentUser);

            if(currentUser.connectedRoom != null){
                var currentRoom = state.rooms[currentUser.connectedRoom];
                var result = currentRoom.disconnectUser(currentUser);
                if( result == 1 ){
                    var msg = new message(
                        currentRoom.messages.length,
                        currentUser.name,
                        currentUser.img == null ? "default.png" : "userImg/"+currentUser.img,
                        "user "+currentUser.name+" leave the room",
                        new Date().toISOString(),
                        true
                    );
                    currentRoom.addMessage(msg);
        
                    io.to(currentRoom.name).emit('receive message', {
                        msg: msg
                    });
                    console.log("user "+currentUser.name+" leave room");
                } else if(result == 2) {
                    state.removeRoom(currentRoom);
                    
                    io.emit('update room_list', state.rooms);

                    console.log("room Removed!");
                } else {
                    console.log("그 유저는 방에 없어요!");
                }
            }
            currentUser.setTimer(setTimeout(function(user) {
                // console.log(user.currentSocket);
                state.inactivateUser(user);
                console.log("remove user "+user.name+" success!");
                if(Object.keys(user.visitedRooms).length == 0){
                    state.removeUser(user);
                }
                // console.log(state.users);
                io.emit('update concurrent user', {visitors: Object.keys(state.users).length});
            }, 3000, currentUser));
        });
    });
    return io;
}