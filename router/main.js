var state = require('./state.js');

module.exports = function(app) {

    app.get('/', function(req, res) {
        res.render('login.html');
    });
    
    app.get('/lobby', function(req, res) {
        var userInfo = req.cookies.userInfo;

        if(userInfo != undefined && state.users[userInfo.user_name] != undefined){
            res.render('lobby.html');
        } else {
            res.redirect('/');
        }
    });

    app.get('/room/:roomName', function(req, res) {
        var userInfo = req.cookies.userInfo;

        if(userInfo == undefined || state.users[userInfo.user_name] == undefined){
            // console.log("userInformation is ",userInfo);
            res.redirect('/');
        } else if(state.rooms[req.params.roomName] == undefined ) {
            res.redirect('/lobby');
        } else {
            res.render('room.html');
        }
    });

    app.post('/saveUserInfo', function(req, res) {
        var user_name = req.body.user_name;
        
        var result = {};

        if(req.cookies.userInfo == undefined){
            result['override'] = false;
        } else {
            result['override'] = true;
        }

        var userInfo = {
            user_name: user_name
        };

        res.cookie('userInfo', userInfo);
        
        res.json(result);
    });
}