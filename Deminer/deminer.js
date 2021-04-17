var size_x = 20;
var size_y = 10;
var bombs = 70;

var bombs_array = [];
var array_x = [];

var bombs_near = 0;
var innocent_near = 8;

var checked_inn = 0;
var checked_label = 0;

var divs;
var wreaper = document.getElementById('wreaper');


function RandomNumbers (min, max) {
	return Math.round(Math.random() * (max - min) + min);
}

function CreateField (size_x, size_y) {		
	for (let i = 0; i < size_x; i++) {
		array_x.push([]);
		for (let n = 0; n < size_y; n++) {
			array_x[i].push(0);
		}
	}
}

function DrawField (size_x, size_y) {
	var cells = size_x * size_y;
	var count = 0;
	
	while (count != cells) {
		var cell_div = document.createElement('div');
		cell_div.addEventListener("click", InnocentClick);
		cell_div.addEventListener("contextmenu", LabeledClick);
		cell_div.className += "cell";
		wreaper.appendChild(cell_div);
		count += 1;
	}

	divs = document.getElementsByClassName('cell');
}

function SetBombs (size_x, size_y, number_of_bombs) {
	var bombs = 0;				
	while (bombs != number_of_bombs) {
		var rand_col = RandomNumbers(0, size_x - 1);
		var rand_row = RandomNumbers(0, size_y - 1);
		var point = array_x[rand_col][rand_row];
		if (point != 1) {
			array_x[rand_col][rand_row] = 1;
			bombs += 1;
			bombs_array.push([rand_col + 1, rand_row + 1]);
		}			
	}
}

function FindCell (size_y, cord_x, cord_y) {	// находит номер ячейки (по порядку) по координатам
	return (cord_x - 1) * size_y + cord_y;
}

function DrawBombs (size_y) {
	bombs_array.forEach(function(item, i, arr) {
		var cord_x = arr[i][0];
		var cord_y = arr[i][1];
		var bomb_cell = FindCell(size_y, cord_x, cord_y);
		var divs = document.getElementsByClassName('cell');
		divs[bomb_cell - 1].addEventListener("click", BombClick);
		divs[bomb_cell - 1].removeEventListener("click", InnocentClick);
	});
}

function SetNumbers (mod) {
	for (let i = 0; i < divs.length; i++) {
		bombs_near = 0;
		innocent_near = 8;

		var cord_x = Math.ceil(((i + 1) / size_y));
		var cord_y = (i + 1) - size_y * (cord_x - 1);

		FindBombsNearby(cord_x, cord_y);

		if (mod === 'innocent_near') {
			divs[i].innerHTML = innocent_near;
		} else {
			divs[i].innerHTML = bombs_near;
		}		
	}
}

function InnMod () {
	SetNumbers('innocent_near');
}

function BombMod () {
	SetNumbers('bombs_near');
}

function ShowBombs () {
	for (let i = 0; i < divs.length; i++) {

		var cord_x = Math.ceil(((i + 1) / size_y));
		var cord_y = (i + 1) - size_y * (cord_x - 1);

		if (divs[i].className == 'cell labeled') {
			divs[i].style.color = 'red';	// цвет НЕправильно отмеченной клеточки
		}

		loop: for (let n = 0; n < bombs_array.length; n++) {
			var bomb_cord_x = bombs_array[n][0];
			var bomb_cord_y = bombs_array[n][1];

			 if (bomb_cord_x == cord_x && bomb_cord_y == cord_y) {
				if (divs[i].className != 'cell labeled') {
					divs[i].className = 'cell bomb';
					break loop;
				} else if (divs[i].className == 'cell labeled') { 
					divs[i].style.color = 'white';	// цвет правильно отмеченной клеточки
					break loop;
				}
			}
			
		}

	}
}

function FinishGame (status) {
	for (let i = 0; i < divs.length; i++) {
		divs[i].removeEventListener("click", InnocentClick);
		divs[i].removeEventListener("contextmenu", LabeledClick);
	}

	var status_div = document.getElementById('status');

	switch (status) {
		case 'win':
			status_div.innerHTML = 'Ты победил';
			break;
		case 'lose':
			status_div.innerHTML = 'Ты проиграл';
			break;
		default:
			console.log('error in FinishGame');
	}
}

function BombClick () {
	if (this.className != 'cell labeled') {			
		this.classList.toggle("bomb");
		FinishGame('lose');
		ShowBombs();
	}	
}

function InnocentClick () {
	if (this.className == 'cell') {
		checked_inn += 1;
		this.classList.toggle("innocent");
	} else {
		return false;
	}		

	if ((bombs == checked_label) && (checked_inn == (size_x * size_y - bombs))) {
		FinishGame('win');
	}

}

function LabeledClick (e) {

	if (this.className == 'cell labeled') {			
		checked_label -= 1;
	} else if (this.className == 'cell') {
		checked_label += 1;
	} else {
		return false;
	}

	this.classList.toggle("labeled");

	if ((bombs == checked_label) && (checked_inn == (size_x * size_y - bombs))) {
		FinishGame('win');
	}

}

function IsBomb (cord_x, cord_y) {
	bombs_array.forEach(function(item, i, arr) {
		var bomb_cord_x = arr[i][0];
		var bomb_cord_y = arr[i][1];
		if (bomb_cord_x == cord_x && bomb_cord_y == cord_y) {
			bombs_near += 1;
			innocent_near -= 1;
		}
	});
}

function FindBombsNearby (this_x, this_y) {

	var up = [this_x, this_y - 1];	// сверху
	var up_right = [this_x + 1, this_y - 1];	// сверху справа
	var rigth = [this_x + 1, this_y];	// справа
	var bottom_right = [this_x + 1, this_y + 1];	// снизу справа
	var bottom = [this_x, this_y + 1];	// снизу
	var bottom_left = [this_x - 1, this_y + 1];		// снизу слева
	var left = [this_x - 1, this_y];	// слева
	var up_left = [this_x - 1, this_y - 1];		// сверху слева

	var cords = [up, up_right, rigth, bottom_right, bottom, bottom_left, left, up_left];

	var count = 0;

	for (let n = 0; n < cords.length; n++) {
		var cord_x = cords[n][0];
		var cord_y = cords[n][1];

		check: switch (true) {
			case (cord_x > size_x):
				break check;
			case (cord_x < 1):
				break check;
			case (cord_y > size_y):
				break check;
			case (cord_y < 1):
				break check;
			default:
				IsBomb(cord_x, cord_y);
				count++;				
		}

	}

	innocent_near = count - bombs_near;
}

function WreaperPrevent (e) {
	e.preventDefault();		// отключеник мени ПКМ на территории wreaper'а
}


CreateField(size_x, size_y);
SetBombs(size_x, size_y, bombs);
DrawField(size_x, size_y);
DrawBombs(size_y);
InnMod();	// расстановка цифр

wreaper.addEventListener('contextmenu', WreaperPrevent);
document.getElementById('innocent_radio').addEventListener("click", InnMod);
document.getElementById('bomb_radio').addEventListener("click", BombMod);

wreaper.style.gridTemplateColumns = 'repeat(' + size_x + ', 30px)';
wreaper.style.gridTemplateRows = 'repeat(' + size_y + ', 30px)';