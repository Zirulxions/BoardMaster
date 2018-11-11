var users = [];

function addUsers(){
	var usuario = document.getElementById("nickname").value;
	document.getElementById("user").hidden = true;
	document.getElementById("board").hidden = false;
	users.push(usuario);
  	socket.emit('new-user', users);
  	console.log("addUsers: " + users);
  	return false;
	//init();
}

class Pencil {

	constructor (pizarra) {
		this.started = false;
		this.color = '#000'; //establecer default color
		this.pizarra = pizarra;
		this.pizarra.strokeStyle = this.color;
	}

	changeColor () {
		var numero = (Math.floor(Math.random() * 10 ) + 1);
		console.log(numero);
		if(numero == 1){	
			this.color = '#f00' //Red
		} else if(numero == 2) {
			this.color = '#770167'; //Purple
		} else if(numero == 3){
			this.color = '#f80'; //Orange
		} else if(numero == 4){
			this.color = '#0019fc'; //Blue
		} else if(numero == 5){
			this.color = '#fcf700'; //Yellow
		} else if(numero == 6){
			this.color = '#ff009d'; //Pink
		} else if(numero == 7){
			this.color = '#15fc00'; //Green
		} else if(numero == 8){
			this.color = '#ffffff'; //White
		} else if(numero == 9){
			this.color = '#814fff'; //Teal
		} else if(numero == 10){
			this.color = '#4e1414'; //Wine
		} else {
			this.color = '#000'; //Default Black
		}
		this.pizarra.strokeStyle = this.color;
	}

	mousedown (ev) {
		this.begin(ev.layerX, ev.layerY);
		this.started = true;
		socket.emit('click', {
			x: ev.layerX, 
			y: ev.layerY
		});
	}

	mousemove (ev) {
		if (this.started) {
			this.move(ev.layerX, ev.layerY);
			socket.emit('drawing', {
				x: ev.layerX, 
				y: ev.layerY,
				color: this.color
			});
		}
	}

	mouseup (ev) {
		if (this.started) {
			this.mousemove(ev);
			this.started = false;
		}
	}

	moveMsg (data) {
		this.pizarra.strokeStyle = data.color;
		this.move(data.x, data.y);
		this.pizarra.strokeStyle = this.color;
	}

	begin (x, y) {
		this.pizarra.beginPath();
		this.pizarra.moveTo(x, y);
	}

	move (x, y) {
		this.pizarra.lineTo(x, y);
		this.pizarra.stroke();
	}
}

const socket = io();

const canvas = document.getElementById("pizarra");
const pizarra = canvas.getContext("2d");
const btn = document.getElementById('boton');

//function init () {
	const pencil = new Pencil(pizarra);

	canvas.addEventListener('mousedown', ev_handler, false);
	canvas.addEventListener('mousemove', ev_handler, false);
	canvas.addEventListener('mouseup',	 ev_handler, false);
	btn.addEventListener('click', ev_change, false);

	socket.on('begin', io_begin);
	socket.on('move', io_move);

	socket.on('users', function(data){
		console.log("socket on users: "+data);
	});

	function ev_handler (ev) {
		pencil[ev.type](ev);
	}
	function ev_change (ev) {
		pencil.changeColor()
	}
	function io_begin (data) {
		pencil.begin(data.x, data.y);
	}
	function io_move (data) {
		pencil.moveMsg(data);
	}    
//}