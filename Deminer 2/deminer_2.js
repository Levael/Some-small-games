// FIELD SIZE И NUMBER OF BOMBS ==============================

var size_x = 20;
var size_y = 10;
var bombs = 30;

// STYLE VARIABLES ===========================================

var cell_size_x = 25;
var cell_size_y = 25;

// SERVICE VARIABLES =========================================

var bombs_array = [];
var array_x = [];

var bombs_near = 0;
var checked_inn = 0;
var checked_label = 0;

var divs;
var base_cell;
var base_cell_number;
var base_cell_cords;
var wreaper = document.getElementById('wreaper');	// надо переписать все глобальные переменные заглавными буквами

// FUNCTIONS =================================================

function RandomNumbers (min, max) {
	return Math.round(Math.random() * (max - min) + min);
}

function CreateEmptyField (size_x, size_y) {
	for (let i = 0; i < size_x; i++) {
		array_x.push([]);
		for (let n = 0; n < size_y; n++) {
			array_x[i].push(0);
		}
	}
}

function DrawEmptyField (size_x, size_y) {
	var cells = size_x * size_y;
	var count = 0;
	
	while (count != cells) {
		var cell_div = document.createElement('div');
		cell_div.addEventListener("click", FirstClick);
		cell_div.className += "cell";
		wreaper.appendChild(cell_div);
		count++;
	}

	divs = document.getElementsByClassName('cell');
}

function FindDivNumber (cell) {
	for (let i = 0; i < divs.length; i++) {
		if (divs[i] == cell) {
			return i + 1;
		}
	}
}

function FindCell (size_y, cord_x, cord_y) {	// находит номер ячейки (по порядку) по координатам
	return (cord_x - 1) * size_y + cord_y;
}

function FindDivCords (cell_number) {	// отсчёт идёт с "1" (и у Х, и у У)
	var cord_x = Math.ceil((cell_number / size_y));	// округление в большую сторону
	var cord_y = cell_number - size_y * (cord_x - 1);
	return [cord_x, cord_y];
}

function ReturnDivLink (cell_number) {
	for (let i = 0; i < divs.length; i++) {
		if (i == cell_number - 1) {
			return divs[i];
		}
	}
}

function ShowCell (cord_x, cord_y) {
	var cell = FindCell(size_y, cord_x, cord_y);
	var link = ReturnDivLink(cell);

	if (link.className == 'cell') {
		checked_inn++;

		link.className = 'cell innocent';
		link.removeEventListener("contextmenu", LabeledClick);
		link.removeEventListener("click", InnocentClick);
		var inner_number = GetInnerNumber(cord_x, cord_y);

		if (inner_number === 0) {
			link.innerHTML = '';
			MakeWithNearCells(cord_x, cord_y, ShowCell);
		} else {
			link.innerHTML = inner_number;
			link.addEventListener("dblclick", UpdateDblClick);
		}

		if ((bombs == checked_label) && (checked_inn == (size_x * size_y - bombs))) {
			FinishGame('win');
			return;
		}
	}
}

function NotMines (cord_x, cord_y) {
	array_x[cord_x - 1][cord_y - 1] = 22;
}

function MakeWithNearCells (this_x, this_y, callback) {

	var up = [this_x, this_y - 1];	// сверху
	var up_right = [this_x + 1, this_y - 1];	// сверху справа
	var rigth = [this_x + 1, this_y];	// справа
	var bottom_right = [this_x + 1, this_y + 1];	// снизу справа
	var bottom = [this_x, this_y + 1];	// снизу
	var bottom_left = [this_x - 1, this_y + 1];		// снизу слева
	var left = [this_x - 1, this_y];	// слева
	var up_left = [this_x - 1, this_y - 1];		// сверху слева

	var cords = [up, up_right, rigth, bottom_right, bottom, bottom_left, left, up_left];

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
				callback(cord_x, cord_y);
		}

	}
}

function FirstClick () {
	base_cell = this;
	base_cell_number = FindDivNumber(base_cell);
	base_cell_cords = FindDivCords(base_cell_number);
	base_cell.className = 'cell base_cell';
	checked_inn += 1;

	var base_x_cord = base_cell_cords[0];
	var base_y_cord = base_cell_cords[1];
	array_x[base_x_cord - 1][base_y_cord - 1] = 22;	// center

	MakeWithNearCells(base_x_cord, base_y_cord, NotMines);	// вокруг 100% незаминированные ячейки

	for (let i = 0; i < divs.length; i++) {
		divs[i].removeEventListener("click", FirstClick);
		divs[i].addEventListener("click", InnocentClick);
		divs[i].addEventListener("contextmenu", LabeledClick);
	}

	this.removeEventListener("click", InnocentClick);
	this.removeEventListener("contextmenu", LabeledClick);
	
	AfterFirstClick();
}

function SetBombs (size_x, size_y, number_of_bombs) {	
	var bombs = 0;				
	while (bombs != number_of_bombs) {
		var rand_col = RandomNumbers(0, size_x - 1);
		var rand_row = RandomNumbers(0, size_y - 1);
		var point = array_x[rand_col][rand_row];

		if ((point != 11) && (point != 22)) {
			array_x[rand_col][rand_row] = 11;
			bombs += 1;
			bombs_array.push([rand_col + 1, rand_row + 1]);
		}
	
	}
}

function FinishGame (status) {
	for (let i = 0; i < divs.length; i++) {
		divs[i].removeEventListener("click", InnocentClick);
		divs[i].removeEventListener("contextmenu", LabeledClick);
		divs[i].removeEventListener("dblclick", UpdateDblClick);
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
		this.className = 'cell bomb';
		document.getElementById('status').innerHTML = 'Ты проиграл';
		FinishGame('lose');
		ShowBombs();
	}

}

function UpdateDblClick () {

	function IsNotedCorrectly (cord_x, cord_y) {
		var cell_number = FindCell(size_y, cord_x, cord_y);
		var link = ReturnDivLink (cell_number);

		var bomb_Y_N = IsReallyBomb(cord_x, cord_y);
		var noticed_Y_N = (link.className == 'cell labeled');
		
		if (bomb_Y_N && noticed_Y_N) {
			cells_noted_right++;
		}
	}

	var div_number = FindDivNumber(this);
	var cords = FindDivCords(div_number);
	var cord_x = cords[0];
	var cord_y = cords[1];

	bombs_near = 0;
	bombs_near = FindBombsNearby(cord_x, cord_y);
	var cells_noted_right = 0;
	MakeWithNearCells(cord_x, cord_y, IsNotedCorrectly);

	if (cells_noted_right == bombs_near) {
		MakeWithNearCells(cord_x, cord_y, ShowCell);
	}

}

function InnocentClick () {

	if (this.className != 'cell labeled') {

		var div_number = FindDivNumber(this);
		var cords = FindDivCords(div_number);

		ShowCell(cords[0], cords[1]);

		var inner_number = GetInnerNumber(cords[0], cords[1]);

		if (inner_number === 0) {
			MakeWithNearCells(cords[0], cords[1], ShowCell);
		} else if (inner_number == 1) {
			this.addEventListener("dblclick", UpdateDblClick);
		}

		this.removeEventListener("click", InnocentClick);
		this.removeEventListener("contextmenu", LabeledClick);
	}
}

function LabeledClick () {

	if (this.className == 'cell labeled') {
		checked_label -= 1;
	} else if (this.className == 'cell') {
		checked_label += 1;
	} else {
		alert("It's an error");
		return false;
	}

	this.classList.toggle("labeled");

	if ((bombs == checked_label) && (checked_inn == (size_x * size_y - bombs))) {
		FinishGame('win');
		return;
	}
	
}

function DrawBombs (size_y) {
	bombs_array.forEach(function(item, i, arr) {
		var cord_x = arr[i][0];
		var cord_y = arr[i][1];
		var bomb_cell = FindCell(size_y, cord_x, cord_y);
		divs[bomb_cell - 1].addEventListener("click", BombClick);
		divs[bomb_cell - 1].removeEventListener("click", InnocentClick);
	});
}

// NUMBER CODES:
// 
// 0 == empty
// 11 == bomb
// 22 == always empty
// other numbers == bombs near

function SetNumbers () {
	for (let i = 0; i < divs.length; i++) {
		bombs_near = 0;

		var cord_x = Math.ceil(((i + 1) / size_y));
		var cord_y = (i + 1) - size_y * (cord_x - 1);

		FindBombsNearby(cord_x, cord_y);
		var pos = IsReallyBomb(cord_x, cord_y);

		if (pos === true) {
			// ничего не делать, там и так уже 11 записано
			// array_x[cord_x - 1][cord_y - 1] = 11;
		} else if ((bombs_near === 0) && (pos === false)) {
			array_x[cord_x - 1][cord_y - 1] = 0;
		} else {
			array_x[cord_x - 1][cord_y - 1] = bombs_near;
		}

	}
}

function GetInnerNumber (cord_x, cord_y) {
	return array_x[cord_x - 1][cord_y - 1];
}

function ShowBombs () {
	for (let i = 0; i < divs.length; i++) {

		var cord_x = Math.ceil(((i + 1) / size_y));
		var cord_y = (i + 1) - size_y * (cord_x - 1);

		if (divs[i].className == 'cell labeled') {
			divs[i].style.color = 'red';	// цвет НЕправильно отмеченной клеточки
			var inner_number = GetInnerNumber(cord_x, cord_y);
			divs[i].innerHTML = inner_number;
		}

		loop: for (let n = 0; n < bombs_array.length; n++) {
			var bomb_cord_x = bombs_array[n][0];
			var bomb_cord_y = bombs_array[n][1];

			if (bomb_cord_x == cord_x && bomb_cord_y == cord_y) {
			 	divs[i].innerHTML = '*';

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

function IsBomb (cord_x, cord_y) {
	bombs_array.forEach(function(item, i, arr) {
		var bomb_cord_x = arr[i][0];
		var bomb_cord_y = arr[i][1];
		if (bomb_cord_x == cord_x && bomb_cord_y == cord_y) {
			bombs_near += 1;
		}
	});

}

function FindBombsNearby (cord_x, cord_y) {
	MakeWithNearCells(cord_x, cord_y, IsBomb);
	return bombs_near;
}

function IsReallyBomb (cord_x, cord_y) {
	for (let i = 0; i < bombs_array.length; i++) {
		var bomb_cord_x = bombs_array[i][0];
		var bomb_cord_y = bombs_array[i][1];
		if (bomb_cord_x == cord_x && bomb_cord_y == cord_y) {
			return true;
		}
	}
	return false;
}

function WreaperPrevent (e) {
	e.preventDefault();		// отключение меню ПКМ на территории wreaper'а
}

function AfterFirstClick () {
	SetBombs(size_x, size_y, bombs);
	DrawBombs(size_y);

	SetNumbers();
	MakeWithNearCells(base_cell_cords[0], base_cell_cords[1], ShowCell);
	// ShowBombs();		// для дебагов (выиграть нельзя, т.к. метка не ставится)
}

// FIELD GENERATION =================================================================

CreateEmptyField(size_x, size_y);
DrawEmptyField(size_x, size_y);

wreaper.addEventListener('contextmenu', WreaperPrevent);
wreaper.style.gridTemplateColumns = 'repeat(' + size_x + ', ' + cell_size_x + 'px)';
wreaper.style.gridTemplateRows = 'repeat(' + size_y + ', ' + cell_size_y + 'px)';