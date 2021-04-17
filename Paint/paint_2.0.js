alert("'c' - clear screen\r\n's' - save the image\r\n'r' - redraw the image");

var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");	// context

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// code

var radius = 0.5,
	pen_color = 'black';

var isMouseDown = false,
	coords = [],
	image_id = 1,	// start from 1
	speed = 5;		// miliseconds for replay function
ctx.lineWidth = radius * 2;

// functions

function DrawingCode (e) {
		ctx.lineTo(e.clientX, e.clientY);
		ctx.stroke();

		ctx.beginPath();
		ctx.arc(e.clientX, e.clientY, radius, 0, Math.PI * 2);
		ctx.fill();

		ctx.beginPath();
		ctx.moveTo(e.clientX, e.clientY);
}

function FirstDot (e) {
	ctx.beginPath();
	ctx.arc(e.clientX, e.clientY, radius, 0, Math.PI * 2);
	ctx.fill();

	ctx.beginPath();
	ctx.moveTo(e.clientX, e.clientY);
	// точка становится жирной если отключить последние две строки и я не знаю почему
}

function MouseMove (e) {
	if (isMouseDown) {
		coords.push([e.clientX, e.clientY]);
		DrawingCode(e);
	}
}

function MouseDown (e) {
	isMouseDown = true;
	FirstDot(e);
	coords.push([e.clientX, e.clientY]);
}

function MouseUp (e) {
	isMouseDown = false;
	ctx.beginPath();
	coords.push('space');	// костыль
}

function KeyBoard (e) {
	if (e.keyCode == 67) {
		ClearScreen();
	}

	if (e.keyCode == 83) {
		SaveImage();
	}

	if (e.keyCode == 82) {
		RedrawImage();
	}
}

function ClearScreen () {
	ctx.fillStyle = 'white';
	ctx.fillRect(0, 0, canvas.width, canvas.height);

	ctx.beginPath();
	ctx.fillStyle = 'black';
}

function SaveImage () {
	localStorage.setItem(toString('Image_' + image_id), JSON.stringify(coords));
	image_id++;
}

function RedrawImage () {
	coords = JSON.parse(localStorage.getItem(toString('image_' + image_id - 1)));
	ClearScreen();
	Replay();
}

function Replay () {
	coords.reverse();	// only for optimisation

	var timer = setInterval(function() {
		if (!coords.length) {
			clearInterval(timer);
			ctx.beginPath();
			return
		}

		var coord = coords.pop(),	// only for optimisation
			e = {
				clientX: coord["0"],
				clientY: coord["1"]
			};

		DrawingCode(e);

	}, speed);
}


// listeners

canvas.addEventListener('mousemove', MouseMove);
canvas.addEventListener('mousedown', MouseDown);
canvas.addEventListener('mouseup', MouseUp);
document.addEventListener('keydown', KeyBoard);
