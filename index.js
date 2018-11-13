var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var users = [];

app.use(express.static('public'));

io.on('connection', socket => {
	console.log('Alguien se conecto!!!');

	socket.on('new-user', function(data){
		users.push(data);
		socket.broadcast.emit('users', users);
		console.log("array de users: " + users + " /// supuesta data: " + data);
	});

	socket.broadcast.emit('users', users);

	socket.on('click', data => {
		socket.broadcast.emit('begin', data);
	});

	socket.on('drawing', data => {
		socket.broadcast.emit('move', data);
	});

});

server.listen(4000, () => console.log('Corriendo... Puerto: 4000'))