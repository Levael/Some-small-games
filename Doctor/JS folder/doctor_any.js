var age_mode;
var sex;

var PLAYERS = [];

var game_name = document.getElementById('game_name');
var rules_div = document.getElementById('rules');
var center_div = document.getElementById('center');
var input = document.getElementById('name_input');
var gender_btns_div = document.getElementById('hidden_sex');
var wreaper_for_players_div = document.getElementById('wraper_for_all_players');
var play_zone_div = document.getElementById('play_zone');
var footer_div = document.getElementById('footer');

var BTN_show_rules = document.getElementById('rules_button');
var BTN_close_rules = document.getElementById('rules_up_button');
var BTN_add_player = document.getElementById('add_players_button');
var BTN_male = document.getElementById('male_sex');
var BTN_female = document.getElementById('female_sex');
var BTN_any_age = document.getElementById('any_age');
var BTN_adult_age = document.getElementById('adult_age');
var BTN_start_game = document.getElementById('start_game');

// ============================== VIEW AND TOGGLES ==============================

function OpenCloseRules () {
	rules_div.classList.toggle("displayNone");
	center_div.classList.toggle("displayNone");
	footer_div.classList.toggle("displayNone");
}

function CloseRules (e) {
	if (e.keyCode == 27) {
		if (rules_div.classList != "displayNone") {
			OpenCloseRules();
		}		
	}
}

function EnterInput(e) {
	if ((e.keyCode == 13) && (CheckValidation())) {
		InnerPlayerBox();
	} else if ((e.keyCode == 13) && (CheckValidation() == false)){
		ResetSexButtons();
	}
}

function CheckSameName (player_name) {
	for (let i = 0; i < PLAYERS.length; i++) {
		if (PLAYERS[i].name == player_name) {
			alert("Имена не могут повторяться");
			return true;
		}
	}
	return false;
}

function ReloadWebPage () {
	window.location.reload();
}

function DefaulSettings () {
	age_mode = "any";
	input.focus();
	BTN_any_age.style.backgroundColor = "#DF0B0B";
	gender_btns_div.style.display = "none";
	BTN_add_player.innerHTML = "Добавить игрока";
	BTN_add_player.style.width = "215px";
}

function ResetSexButtons () {
	BTN_male.style.color = "white";
	BTN_male.style.fontWeight = "normal";
	BTN_female.style.color = "white";
	BTN_female.style.fontWeight = "normal";

	sex = undefined;
}

function SexToggle () {
	if (this.id == "male_sex") {
		sex = "male";
		this.style.color = "blue";
		this.style.fontWeight = "bold";

		BTN_female.style.color = "white";
		BTN_female.style.fontWeight = "normal";
	} else {
		sex = "female";
		this.style.color = "#980E0E";
		this.style.fontWeight = "bold";

		BTN_male.style.color = "white";
		BTN_male.style.fontWeight = "normal";
	}
	
	input.focus();
}

function CheckValidation () {
	if ((age_mode == "any") && (input.value != "")) {
		return true;
	} else if ((age_mode == "adult") && (input.value != "")) {
		if ((sex != undefined) && (sex != null)) {
			return true;
		} else {
			return false;
		}
	} else {
		return false;
	}
}

function CheckStartButton (PLAYERS, BTN_start_game) {
	if (PLAYERS.length >= 2) {
		BTN_start_game.className = "start_game_active start_game_active_hover";
	} else {
		BTN_start_game.className = "start_game_inactive";
	}	
}

function ChangeAgeAnyButton () {
	age_mode = "any";
	BTN_adult_age.style.backgroundColor = "#FA5858";
	this.style.backgroundColor = "#DF0B0B";

	this.setAttribute("disabled", "disabled");
	BTN_adult_age.removeAttribute("disabled", "disabled");

	BTN_add_player.innerHTML = "Добавить игрока";
	BTN_add_player.style.width = "215px";

	ResetAgeButtons();
}

function ChangeAgeAdultButton () {
	age_mode = "adult";
	BTN_any_age.style.backgroundColor = "#FA5858";
	this.style.backgroundColor = "#DF0B0B";
	
	this.setAttribute("disabled", "disabled");
	BTN_any_age.removeAttribute("disabled", "disabled");

	gender_btns_div.style.display = "block";
	BTN_add_player.innerHTML = "ОК";
	BTN_add_player.style.width = "65px";

	ResetAgeButtons();
}

function ResetAgeButtons () {
	ResetSexButtons();
	PLAYERS = [];
	CheckStartButton(PLAYERS, BTN_start_game);
	wreaper_for_players_div.innerHTML = null;
	input.removeAttribute("disabled", "disabled");
	input.value = "";
	input.focus();
	BTN_male.removeAttribute("disabled", "disabled");
	BTN_female.removeAttribute("disabled", "disabled");
}

// ================================== LOGIC ==================================

function Random (min, max) {
	var x = Math.round(Math.random() * (max - min) + min);
	return x;
}

function RandomSortArray (array) {
	for (let i = 0; i < array.length * 3; i++) {
		var del_number = array.splice(Random(0, array.length - 1), 1);
		del_number = del_number[0];
		array.splice(Random(0, array.length - 1), 0, del_number);
	}
	return array;
}

function FindIndex (array, variable) {
	var i = 0;
	while (i < array.length) {
		if (array[i].name == variable) {
			return i;
		} else {
			i++;
		}  
	}
	console.log('Error in FindIndex.');
	return false;
}

function InnerPlayerBox () {

	if ((PLAYERS.length < 12) && (CheckValidation())) {

		var player_name = input.value;
		if (CheckSameName(player_name)) {
			input.focus();
			return;
		}

		var main_div = document.createElement('div');
		var name_box = document.createElement('div');
		var delete_box = document.createElement('div');

		main_div.className = "player_box_all";
		name_box.className = "player_box_small";
		delete_box.className = "player_box_deleted";
		name_box.innerHTML = player_name;
		delete_box.innerHTML = "&#10006";

		//////////////////////////////////////////////////////////////////////

		PLAYERS.push({name: player_name, gender: sex});

		//////////////////////////////////////////////////////////////////////

		wreaper_for_players_div.appendChild(main_div);	// общий контейнер
		main_div.appendChild(name_box);					// див для имени
		main_div.appendChild(delete_box);			// див для крестика
		delete_box.addEventListener("click", RemovePlayer);		
		input.value = "";
		input.focus();

		if (sex == "male") {
			name_box.style.backgroundColor = "#668AEE";						
		} else if (sex == "female") {
			name_box.style.backgroundColor = "#E369A8";
		}

	} else {
		input.focus();
	}

	if (PLAYERS.length == 12) {
		input.setAttribute("disabled", "disabled");
		input.value = "мест нет";
		BTN_male.setAttribute("disabled", "disabled");
		BTN_female.setAttribute("disabled", "disabled");
	}

	CheckStartButton(PLAYERS, BTN_start_game);
	ResetSexButtons();
}

function RemovePlayer () {
	var remove_div = this.parentNode;
	remove_div.parentNode.removeChild(remove_div);
	
	var remove_player_name = this.parentNode.firstChild.innerHTML;
	var id_remove_player = FindIndex(PLAYERS, remove_player_name);
	PLAYERS.splice(id_remove_player, 1);

	if (PLAYERS.length < 12) {
		input.removeAttribute("disabled", "disabled");
		input.value = "";
		input.focus();
		BTN_male.removeAttribute("disabled", "disabled");
		BTN_female.removeAttribute("disabled", "disabled");
	}
	CheckStartButton(PLAYERS, BTN_start_game);
}

function CreatePlayBox () {

	function MassageDuration () {
		if (doctor == "Массажист") {
			var time = Random(1, 3);
			doctor_name_div.innerHTML += " <span class = 'massage_time'>" + "(" + time + " мин)" + "</span>";
		}	
	}

	function NumberOf (who) {
		number = 0;
		switch (who) {
			case 'boyes':
				for (let n = 0; n < players.length; n++) {
					if (players[n].gender == 'male') {
						number++;
					}
				}
				break;
			case 'girls':
				for (let l = 0; l < players.length; l++) {
					if (players[l].gender == 'female') {
						number++;
					}
				}
				break;
			default:
				console.log("Error in NumberOf.");
				number = 0;
		}
		return number;
	}

	function WriteNamesInBox (doctor, player_doctor, patient) {
		doctor_name_div.innerHTML = "<b>" + doctor + "</b>" + " &ndash; " + player_doctor[0].name;
    	MassageDuration();
    	patient_name_div.innerHTML = "<b>Пациент &ndash; </b>" + patient[0].name;
	}

	function ChooseBoy () {
		for (let n = 0; n < players.length; n++) {
			if (players[n].gender == 'male') {
				return players.splice(n, 1);				
			}
		}
	}

	function ChooseGirl () {
		for (let m = 0; m < players.length; m++) {
			if (players[m].gender == 'female') {
				return players.splice(m, 1);
			}
		}
	}

	function DeleteDifferentGenderDoctors () {
		for (let i = 0; i < doctors.length; i++) {
			switch (doctors[i]) {
				case 'Уролог':
				case 'Гинеколог':
				case 'Маммолог':
				case 'Патологоанатом':
				case 'Мед. осмотр':
					doctors.splice(i, 1);
					i--;
					break;
			}
		}
	}


	var players = PLAYERS.slice();

	if (players.length > 1) {
		play_zone_div.classList.add("border_to_play_zone");

		var doctors = ["Терапевт", "Хирург", "Окулист", "Массажист", "Психотерапевт", "Народный доктор", "Мед. осмотр"];
		if (age_mode == "adult") {
			doctors.push("Патологоанатом", "Маммолог", "Уролог", "Гинеколог");
		}

		do {
			var play_box = document.createElement('div');
			var doctor_name_div = document.createElement('div');
			var patient_name_div = document.createElement('div');
	
			play_box.className = "play_box_with_names";
			doctor_name_div.className = "doctor_and_patient_name";
			patient_name_div.className = "doctor_and_patient_name";
	
			play_zone_div.appendChild(play_box);
			play_box.appendChild(doctor_name_div);
			play_box.appendChild(patient_name_div);

			var boyes = NumberOf('boyes');
			var girls = NumberOf('girls');
			RandomSortArray(players);
			
			if (age_mode == "adult") {
				if ((boyes > 0) && (girls > 0)) {
					var random_number = Random(0, doctors.length - 1);
    				var doctor = doctors.splice(random_number, 1);
	
    				if (doctor == "Маммолог" || doctor == "Гинеколог") {	//маммолог и гинеколог
	
    					var player_doctor = ChooseBoy();
    					var patient = ChooseGirl();
						WriteNamesInBox(doctor, player_doctor, patient);				
	
    				} else if (doctor == "Уролог") {	// уролог
	
    					var player_doctor = ChooseGirl();
    					var patient = ChooseBoy();
						WriteNamesInBox(doctor, player_doctor, patient);
	
    				} else if (doctor == "Мед. осмотр") {
	
    					var player_doctor = players.splice(0, 1);
    					switch (player_doctor[0].gender) {
    						case "male":
    							var patient = ChooseGirl();
    							break;
    						case "female":
    							var patient = ChooseBoy();
    							break;
    						default:
    							console.log("Error in Мед. осмотр.");
    					}
    					WriteNamesInBox(doctor, player_doctor, patient);
	
    				} else {
	
    					var player_doctor = players.splice(0, 1);	// первый попавшийся элемент массива, он всё равно рандомно отсортирован
    					var patient = players.splice(0, 1);		//  это массив из одного элемента
    					WriteNamesInBox(doctor, player_doctor, patient);
    				}

				} else {
					DeleteDifferentGenderDoctors();

					var random_number = Random(0, doctors.length - 1);
    				var doctor = doctors.splice(random_number, 1);
					var player_doctor = players.splice(0, 1);	// первый попавшийся элемент массива, он всё равно рандомно отсортирован
    				var patient = players.splice(0, 1);		//  это массив из одного элемента
    				WriteNamesInBox(doctor, player_doctor, patient);
				}

			} else {	// age_mode == any

				var random_number = Random(0, doctors.length - 1);
    			var doctor = doctors.splice(random_number, 1);
    			var player_doctor = players.splice(0, 1);
    			var patient = players.splice(0, 1);
    			WriteNamesInBox(doctor, player_doctor, patient);

			}

    	} while (players.length > 1);

    	var play_break_box = document.createElement('div');
    	play_zone_div.appendChild(play_break_box);
    	play_break_box.innerHTML = "Партия закончена";
    	play_break_box.className = "play_break_box";
    	play_zone_div.scrollTop = play_zone_div.scrollHeight;	// опускаем скролл в самый низ

	} else {
		alert("Нужно минимум 2 игрока");
	}
}

// ============================== EVENT LISTENERS ==============================

game_name.addEventListener("click", ReloadWebPage);
BTN_close_rules.addEventListener("click", OpenCloseRules);
BTN_show_rules.addEventListener("click", OpenCloseRules);
BTN_add_player.addEventListener("click", InnerPlayerBox);
BTN_start_game.addEventListener("click", CreatePlayBox);
input.addEventListener("keydown", EnterInput);
window.addEventListener("keydown", CloseRules);
BTN_any_age.addEventListener("click", ChangeAgeAnyButton);
BTN_adult_age.addEventListener("click", ChangeAgeAdultButton);
window.addEventListener("load", DefaulSettings);
BTN_male.addEventListener("click", SexToggle);
BTN_female.addEventListener("click", SexToggle);