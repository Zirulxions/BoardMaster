var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var user = ["usuario1","usuario2"]; //array de retorno, llenado por emergencia, debe llenarse automaticamente

app.use(express.static('public'))

io.on('connection', socket => {
	console.log('Alguien se conecto');
	socket.on('click', data => {
		socket.broadcast.emit('begin', data);
	});
	socket.on('drawing', data => {
		socket.broadcast.emit('move', data);
	});
	socket.on('userList', data =>{          // Establecer el socket
		console.log(user);                  // para retorno de array
		socket.broadcast.emit('user', user);// o eso creo
	});
});

server.listen(4000, () => console.log('Corriendo...'))