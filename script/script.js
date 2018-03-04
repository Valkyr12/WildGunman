//Elements
var menu = document.getElementById('menu');
var start = document.getElementById('start_game');
var wrapper = document.getElementById('wrapper');
var gunman = document.getElementById('gunman');
var msg_fire = document.getElementById('message_fire');
var msg_won = document.getElementById('message_won');
var msg_lost = document.getElementById('message_lost');
var msg_foul = document.getElementById('message_foul');
var playerTime = document.getElementById('player_time');
var bkg = document.getElementById('background');
var hat = document.getElementById('hat');

//Sounds
var main_msc = document.getElementById('main');
var intro = document.getElementById('intro');
var walk = document.getElementById('walk');
var wait = document.getElementById('wait');
var fire = document.getElementById('fire');
var win = document.getElementById('win');
var lose = document.getElementById('lose');
var foul = document.getElementById('foul');
var shot = document.getElementById('shot');
var shot_fall = document.getElementById('shot-fall');

//Variables
var fireRange = getRandomInRange(1000, 3000);
var gunmanTime = 1.00;
var initFire = 1;

//Listeners
start.addEventListener('click', initial);
intro.addEventListener('ended', walkGunman);
wrapper.addEventListener('transitionend', changeBkg);
// wait.addEventListener('ended', getFire);
gunman.addEventListener('click', stopTime);

//Helpers
HTMLAudioElement.prototype.stop = function() {
	this.pause();
	this.currentTime = 0.0;
}

function getRandomInRange(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

//Timers
var init = 0;
var startDate;
var clocktimer;
var finalTime;
var finish = 0;

function stopTime() {
	init = 0;
	clearTimeout(clocktimer);
	// shot.play();
	msg_fire.classList.add('remove');

	if( +finalTime > 0 && +finalTime < gunmanTime ) {
		shot_fall.play();
		winGame();
		bkg.classList.add('shot');
	}

	if( +finalTime > gunmanTime ) {
		loseGame();
	}

	if ( finalTime == undefined ) {
		foulGame();
		return;
	}
}

function clearTime() {
	playerTime.innerHTML = '0.00';
	stopTime();
}

function findTime() {
	var thisDate = new Date();
	var t = thisDate.getTime() - startDate.getTime();
	var ms = t % 1000; t -= ms; ms = Math.floor( ms / 10 );
	t = Math.floor ( t / 1000 );
	var s = t % 60;
	t -= s;
	if ( s < 10 ) {
		s = s;
	}
	if ( ms < 10) {
		ms = '0' + ms;
	}
	if ( init == 1 ) {
		finalTime = playerTime.innerHTML = s + '.' + ms;
	}

	if( +finalTime > gunmanTime ) {
		playerTime.innerHTML = 'OVER';
		loseGame();
		return;
	}

	clocktimer = setTimeout(findTime, 10);
}

function startTime() {
	if ( init == 0 ) {
		startDate = new Date();
		findTime();
		init = 1;
	} else {
		stopTime();
	}
}

//Functions
function initial() {
	main_msc.stop();
	menu.classList.add('remove');
	intro.play();
}

function walkGunman() {
	walk.play();
	wrapper.classList.add('transition');
	gunman.classList.add('walk');
	gunman.classList.add('display');
}

function changeBkg() {

	if(finish == 1) {
		return;
	}

	walk.stop();
	gunman.style.backgroundPosition = '-500px 0';
	gunman.classList.remove('walk');
	wait.play();
	timerShoot;
	var timerShoot = setTimeout(getFire, fireRange); //Поменять звук и логику!
}


function getFire() {
	if( initFire == 1 ){
		fire.play();
		msg_fire.classList.add('display');
		gunman.classList.add('fire');
		wait.stop();
		startTime();
	} else {
		return;
	}
}


function winGame() {
	msg_won.classList.add('display');
	gunman.style.background = 'url(images/g1.png) left top';
	hat.classList.add('display');
	hat.classList.add('drop');
	gunman.classList.add('won');
	gunman.removeEventListener('click', stopTime);

	hat.addEventListener('animationend', function() { win.play(); } );
	finish = 1;
}

function loseGame() {
	shot.play();
	gunman.classList.remove('walk');
	gunman.style.backgroundPosition = '-840px 0';
	gunman.classList.add('lost');
	bkg.classList.add('shot-lose');
	msg_lost.classList.add('display');
	lose.play();

	goAway();
}

function foulGame() {
	foul.play();
	bkg.classList.add('foul');
	msg_foul.classList.add('display');
	init = 1;
	initFire = 0;
	wait.stop();
	// debugger;

	goAwayFoul()
}

function goAway() {
	gunman.addEventListener('animationend', function() {
		gunman.classList.remove('fire');
		// gunman.classList.remove('lost');
		// gunman.style.backgroundPosition = '-500px 0';
		// gunman.classList.remove('lost');
	});

	setTimeout(function() {
		// debugger;
		gunman.style.backgroundPosition = '0px 0';
		gunman.classList.remove('lost');
		gunman.classList.add('goaway');
		gunman.classList.add('walk');
		wrapper.style.left = '800px';
		wrapper.classList.add('transition-reverse');
		finish = 1;
	}, 3000);

	// gunman.classList.add('goaway');
	// gunman.style.background = 'url(images/g1move.png) left top';
}

function goAwayFoul() {
	// debugger;
	gunman.style.backgroundPosition = '0px 0';
	gunman.classList.remove('lost');
	gunman.classList.add('goaway');
	gunman.classList.add('walk');
	wrapper.style.left = '800px';
	wrapper.classList.add('transition-reverse');
	finish = 1;
}

//Onload
// window.onload = function() {
// 	clearTimeout(timerShoot);
// }