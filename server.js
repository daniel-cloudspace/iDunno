var express = require('express');
var sys = require("sys");
var util = require('util');
var io = require("socket.io");


app = express.createServer();

app.listen(8080);


app.configure(function(){
    app.use(express.methodOverride());
    app.use(express.bodyParser());
    app.use(app.router);
    app.use(express.static(__dirname + '/public'));
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});


var socket = io.listen(app);
var players = {};

socket.on('connection', function(client) {
  client.on('message', function(message){ 
    // Update the locations of all known people on the map
    players[client.sessionId] = message;
	//sys.puts(util.inspect(message));
  });
  client.on('disconnect', function(){ sys.puts("client disconnected"); });
});

setInterval(function() {
        socket.broadcast(players);
}, 50);
