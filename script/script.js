(function() {
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
var restart = document.getElementById('restart');

var reward = document.getElementById('reward');
var wins = document.getElementById('wins');
var lifes = document.getElementById('lifes');
var score = document.getElementById('score');

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
var winCount = 0;
var lifeCount;
var scoreCount = 0;



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

	// msg_fire.classList.remove('display');
	gunman.removeEventListener('click', stopTime);

	if( +finalTime > 0 && +finalTime < gunmanTime ) {
		shot_fall.play();
		winGame();
		bkg.classList.add('shot');
	}

	if( +finalTime > gunmanTime ) {
		msg_fire.classList.remove('display');
		loseGame();
		gunman.removeEventListener('click', stopTime);
	}

	if ( finalTime == undefined ) {

		msg_fire.classList.remove('display');
		foulGame();

	}


}

function clearTime() {
	playerTime.innerHTML = '0.00';
	clearTimeout(clocktimer);
	startDate = undefined;
	finalTime = undefined;
	// stopTime();
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
		stopTime();

		return;
	}

	clocktimer = setTimeout(findTime, 10);
	// thisDate = undefined;
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
function startGame () {
	lifeCount = 3;
	lifes.innerHTML = lifeCount;
	restart.classList.add('remove');
	start.addEventListener('click', removeMenu);
}

function removeMenu() {
	start.removeEventListener('click', removeMenu);
	main_msc.stop();
	menu.classList.add('remove');
	waitingStart();
}

function waitingStart() {
	initFire = 1;
	intro.play();
	intro.addEventListener('ended', goingGunman);
}

function goingGunman() {
	intro.removeEventListener('ended', goingGunman);
	walk.play();
	wrapper.classList.add('transition');
	gunman.classList.add('walk');
	gunman.classList.remove('remove');
	wrapper.addEventListener('transitionend', turnGunman);
}

function turnGunman() {

	// if ( finish == 1 ) {
	// 	return;
	// }

	walk.stop();
	gunman.classList.remove('walk');
	wrapper.removeEventListener('transitionend', turnGunman);

	gunman.style.backgroundPosition = '-500px 0';
	gunman.classList.remove('walk');

	gunman.addEventListener('click', stopTime);
	wait.play();

	var shootTimer = setTimeout(getFire, fireRange);
}

function getFire() {
	if ( initFire == 1 ) {
		wait.stop();
		fire.play();

		msg_fire.classList.add('display');
		gunman.classList.add('fire');

		startTime();

	} else {
		return;
	}
}

//Game results
function winGame() {
	msg_won.classList.add('display');
	gunman.style.background = 'url(images/g1.png) left top';
	hat.classList.add('display');
	hat.classList.add('drop');
	gunman.classList.add('won');

	hat.addEventListener('animationend', function() { win.play(); } );
	finish = 1;
	winCount += 1;
	wins.innerHTML = winCount;

	hat.addEventListener('animationend', restartGame);
}

function loseGame() {
	shot.play();
	gunman.classList.remove('walk');
	gunman.style.backgroundPosition = '-840px 0';
	gunman.classList.add('lost');
	bkg.classList.add('shot-lose');
	msg_lost.classList.add('display');
	lose.play();
	// init = 1;
	// initFire = 0;

	lifeCount -= 1;
	lifes.innerHTML = lifeCount;
	finish = 1;

	goAway();
}

function foulGame() {
	foul.play();
	gunman.classList.remove('walk');
	gunman.style.backgroundPosition = '-840px 0';
	gunman.classList.add('lost');
	bkg.classList.add('foul');
	msg_foul.classList.add('display');
	// init = 1;
	initFire = 0;
	finish = 1;
	lifeCount -= 1;
	lifes.innerHTML = lifeCount;
	wait.stop();

	goAway();
}

function goAway() {

	setTimeout(function() {
		gunman.style.backgroundPosition = '0px 0';
		gunman.classList.remove('fire');
		gunman.classList.remove('lost');
		gunman.classList.add('goaway');
		gunman.classList.add('walk');
		wrapper.style.left = '800px';
		wrapper.classList.add('transition-reverse');
		finish = 1;
	}, 2500);

	lose.addEventListener('ended', restartGame);
	wrapper.addEventListener('transitionend', restartGame);
}

// function goAwayFoul() {
// 	gunman.style.backgroundPosition = '0px 0';
// 	gunman.classList.remove('lost');
// 	gunman.classList.add('goaway');
// 	gunman.classList.add('walk');
// 	wrapper.style.left = '800px';
// 	wrapper.classList.add('transition-reverse');
// 	finish = 1;

// 	wrapper.addEventListener('transitionend', restartGame);
// }



function restartGame() {
	// debugger;
	restart.classList.remove('remove');

	restart.addEventListener('click', removeMessages);
	wrapper.removeEventListener('transitionend', restartGame);
	lose.removeEventListener('ended', restartGame);

	// startGame();
};

function removeMessages() {

	restart.classList.add('remove');
	removeBody();
	clearTime();
	msg_won.classList.remove('display');
	msg_lost.classList.remove('display');
	msg_foul.classList.remove('display');
	msg_fire.classList.remove('display');
};

function removeBody() {
	// finish = 0;
	init = 0;
	// initFire = 1;

	gunman.classList.add('remove');
	gunman.classList.remove('fire');
	gunman.classList.remove('won');
	gunman.style.cssText = '';
	wrapper.style.cssText = '';
	gunman.classList.remove('walk');
	gunman.classList.remove('goaway');
	wrapper.classList.remove('transition');
	wrapper.classList.remove('transition-reverse');

	hat.classList.remove('display');
	hat.classList.remove('drop');

	bkg.classList.remove('shot');
	bkg.classList.remove('foul');

	bkg.classList.remove('shot-lose');
	bkg.classList.remove('shot-foul');

	waitingStart();
};

//Onload
window.onload = startGame();
})();