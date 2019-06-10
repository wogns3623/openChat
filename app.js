var express = require('express');
var app = express();

var http = require('http');
var server = http.createServer(app);

var fs = require("fs");
var cookie = require('cookie');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

app.set('views', __dirname + '/views');
app.set('view engine', 'html');
app.engine('html', require('ejs').renderFile);

app.use('/static', express.static('public'));

app.use(cookieParser('!@%$^&*!@#$%^&'));

app.use(bodyParser.urlencoded({extended: false}));
  
server.listen(3000, function() {
    console.log('Socket IO server listening on port 3000');
});

var state = require('./router/state.js');
  
var io = require('./router/io.js')(server, fs, cookie);
var router = require('./router/main.js')(app);