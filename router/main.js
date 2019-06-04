module.exports = function(app, ejs, fs, state) {

    app.get('/', function(req, res) {
        var body = fs.readFileSync(app.get('views')+'/login.ejs', 'utf8');
        var bodyContent = ejs.render(body, {
            visitors: Object.keys(state.users).length
        });
        res.render('index', {
            title: 'login',
            content: bodyContent
        })
    });
    
    app.get('/lobby', function(req, res) {
        var userInfo = req.cookies.userInfo;

        console.log(req.cookies);

        if(userInfo != undefined){
            var body = fs.readFileSync(app.get('views')+'/lobby.ejs', 'utf8');
            var bodyContent = ejs.render(body, {
            });
            res.render('index', {
                title: 'lobby',
                content: bodyContent
            })
        } else {
            res.redirect('/');
        }
    });

    app.get('/room/:roomName', function(req, res) {
        var body = fs.readFileSync(app.get('views')+'/room.ejs', 'utf8');
        var bodyContent = ejs.render(body, {
            socketObj: 0
        });
        res.render('index', {
            title: req.params.roomName,
            content: bodyContent
        })
    });

    app.post('/saveUserInfo', function(req, res) {

        var socket_id = req.body.socket_id;
        var user_name = req.body.user_name;
        
        var result = {
        }

        // Object.keys(req.body).forEach(function(item) {
        //     console.log(item+" is "+req.body[item]);
        // });

        if(req.cookies.userInfo == undefined){
            result['override'] = false;
        } else {
            result['override'] = true;
        }

        var userInfo = {
            socket_id: socket_id,
            user_name: user_name
        }

        res.cookie('userInfo', userInfo, {maxAge: 1000*60*3});

        res.json(result);
    });
}