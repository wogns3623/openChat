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
                null,
                data.socket_id
            );
            
            console.log(data.socket_id);
            if( state.addUser(currentUser) ) {
                console.log("login success!");
                socket.emit('login success', currentUser);
            } else {
                console.log("login fail");
                socket.emit('login fail', {socket_id: data.socket_id});
            }
        });

        socket.on('get cookie', function(data) {
            console.log(data);
            var clientCookie = cookie.parse(socket.handshake.headers.cookie);
            var userInfo = JSON.parse(clientCookie.userInfo.substr(2));
            socket.emit('get cookie success', {
                user_name: userInfo.user_name,
                socket_id: userInfo.socket_id,
                originSocket_id: data.socket_id
            });
        });

        socket.on('create room', function(data) {
            state.addRoom(new room(
                Object.keys(state.rooms).length+1,
                data.room_name,
                state.users[data.socket_id],
                null
            ));

            socket.emit('join room success', {
                room_name: data.room_name,
                socket_id: data.socket_id
            });

        });

        // socket.join(data.room_name, function() {
        //     // console.log(data.user_name+" successfuly join in room "+data.room_name);
        //     // socket.to(data.room_name).emit('join room', {
        //     //     user_name: data.user_name,
        //     //     room_name: data.room_name,
        //     //     msg: "user "+data.user_name+" join in our room!"
        //     // });
        //     // console.log(Object.keys(socket.rooms)[1]); 
        // });
      
        });
    return io;
}