var room = require('./room');
var user = require('./user');
var message = require('./message');

module.exports = function(server, state){
    var io = require('socket.io')(server);
    io.sockets.on('connection', function(socket) {
        socket.on('login', function(data) {
            var currentUser = new user(
                Object.keys(state.users).length+1,
                data.user_name,
                null,
                data.socket_id
            );
            if( state.addUser(currentUser) ) {
                socket.emit('login success', currentUser);
            } else {
                socket.emit('login fail', {});
            }
        });
        
        // socket.join(data.room_name, function() {
        //     console.log(data.user_name+" successfuly join in room "+data.room_name);
        //     socket.to(data.room_name).emit('join room', {
        //         user_name: data.user_name,
        //         room_name: data.room_name,
        //         msg: "user "+data.user_name+" join in our room!"
        //     });
        //     // console.log(Object.keys(socket.rooms)[1]);        
        // });
      
        });
    return io;
}