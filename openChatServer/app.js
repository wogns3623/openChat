var express = require('express');
var app = express();

var http = require('http');
var server = http.createServer(app);

var fs = require("fs");

app.use('/static', express.static('public'));

server.listen(3303, function() {
    console.log('Socket IO server listening on port 3000');
});

var state = require('./router/state.js');
  
var io = require('./router/io.js')(server, fs);