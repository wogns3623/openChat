module.exports = function(app, ejs, fs, state) {

    app.get('/', function(req, res) {
        res.render('login', {
            title: 'login',
            visitors: Object.keys(state.users).length
        });
    });
    
    app.get('/lobby', function(req, res) {
        var userInfo = req.cookies.userInfo;

        if(userInfo != undefined && state.users[userInfo.user_name] != undefined){
            res.render('lobby', {
                title: 'lobby'
            });
        } else {
            res.redirect('/');
        }
    });

    app.get('/room/:roomName', function(req, res) {
        var userInfo = req.cookies.userInfo;
        // console.log("userInformation is ",userInfo);
        if(userInfo != undefined && state.users[userInfo.user_name] != undefined){
            res.render('room', {
                title: req.params.roomName,
            });
        } else {
            res.redirect('/');
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
        // res.cookie('userInfo', userInfo, {maxAge: 1000*60*60});

        res.json(result);
    });
}