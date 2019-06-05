var room = require('./room');
var user = require('./user');
var message = require('./message');

module.exports = function(server, state, cookie){
    var io = require('socket.io')(server);
    io.sockets.on('connection', function(socket) {

        socket.on('login', function(data) {
            var currentUser = new user(
                Object.keys(state.users).length+1,
                data.user_name,
                null
            );
            
            if( state.addUser(currentUser) ) {
                console.log('login success!');
                socket.emit('login success', currentUser);
                io.emit('change visitor', {visitors: Object.keys(state.users).length});

            } else {
                console.log('login fail');
                socket.emit('login fail', {socket_id: data.socket_id});
            }
        });

        socket.on('get cookie', function() {
            var clientCookie = cookie.parse(socket.handshake.headers.cookie);
            var userInfo = JSON.parse(clientCookie.userInfo.substr(2));
            socket.emit('get cookie success', {
                user_name: userInfo.user_name
            });
        });

        socket.on('create room', function(data) {
            state.addRoom(new room(
                Object.keys(state.rooms).length+1,
                data.room_name,
                state.users[data.user_name],
                null
            ));

            socket.emit('enter room success', {
                room_name: data.room_name
            });

        });

        socket.on('join room', function(data) {
            var currentUser = state.users[data.user_name];
            // console.log(currentUser);
            
            var room = currentUser.connectedRoom;
            socket.join(room.name, function() {
                console.log(data.user_name+' successfuly join in room '+room.name);

                var msg = new message(
                    this.messages.length,
                    user.name,
                    "user "+user.name+" join the room!",
                    Date(),
                    true
                );
                room.addMessage(msg);

                socket.emit('receive beforeMessages', {
                    msgs: room.messages
                });
                // console.log(Object.keys(socket.rooms)[1]);
                io.to(room.name).emit('receive message', {
                    msg: msg
                })
            });
        });

        socket.on('send message', function(data) {
            // console.log(data);
            var currentUser = state.users[data.user_name];
            var room = currentUser.connectedRoom;
            var msg = new message(
                room.messages.length,
                data.user_name,
                data.content,
                data.date
            );
            room.addMessage(msg);

            io.to(room.name).emit('receive message', {
                msg: msg
            })
        })
    });
    return io;
}