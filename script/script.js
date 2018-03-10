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
var msg_over = document.getElementById('message_gameover');
var playerTime = document.getElementById('player_time');
var bkg = document.getElementById('background');
var hat = document.getElementById('hat');
var restart = document.getElementById('restart');

var reward = document.getElementById('reward');
var wins = document.getElementById('wins');
var lifes = document.getElementById('lifes');
var score = document.getElementById('score');
var gnmTime = document.getElementById('gunman_time');

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
var shot_alt = document.getElementById('shot-alt');
var shot_fall = document.getElementById('shot-fall');
var gameover = document.getElementById('gameover');

//Variables
var fireRange = getRandomInRange(1000, 3000);
var gunmanTime;
var initFire = 1;
var winCount = 0;
var lifeCount;
var scoreCount = 0;
var rewardCount;
var GAMEOVER;
var gunmanSprite = [ 1, 2, 3, 4, 5 ];
var direction = 1;

var gunmanNumber = 1;

//Helpers
HTMLAudioElement.prototype.stop = function() {
	this.pause();
	this.currentTime = 0.0;
}

function getRandomInRange(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandom(min, max) {
  return Math.random() * (max - min + 1) + min;
}

function roundTo100(num) {
	return Math.round( num / 100 ) * 100;
}

function calcReward() {
	rewardCount = Math.floor( 2000 / gunmanTime );

	rewardCount = roundTo100(rewardCount);
}

function calcScores() {
	var total, zero, place = +score.innerHTML;
	place += +rewardCount;

	if ( place < 10000 ) {
		zero = '00';
	} else if ( place >= 10000 && place < 100000 ) {
		zero = '0';
	} else if ( place >= 100000 ) {
		zero = '';
	}

	score.innerHTML = zero + place;
}

//Получаем время выстрела бандита
function calcGunmanTime() {
	var gunmanShotTimes = [ 1.5, 1.3, 1, 0.9, 0.7, 0.5, 0.3 ];
	var excludeST = [];
	var filteredST = [];

	if ( gunmanNumber == 1 ) {
		excludeST = [0.7, 0.5, 0.3];
	}

	if ( gunmanNumber == 2 ) {
		excludeST = [1.5, 0.3];
	}

	if ( gunmanNumber == 3 ) {
		excludeST = [1.5, 0.3];
	}

	if ( gunmanNumber == 4 ) {
		excludeST = [1.5, 1.3];
	}

	if ( gunmanNumber == 5 ) {
		excludeST = [1.5, 1.3, 1, 0.9];
	}

	for (var i = 0; i < gunmanShotTimes.length; i++) {
  		if (excludeST.indexOf(gunmanShotTimes[i]) === -1) {
   			filteredST.push(gunmanShotTimes[i]);
  		}
	}

	gunmanTime = filteredST[Math.floor(Math.random() * filteredST.length)];
	var fixedTime = gunmanTime.toFixed(2);
	gnmTime.innerHTML = fixedTime;
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

	gunman.removeEventListener('click', stopTime);

	if( +finalTime > 0 && +finalTime <= gunmanTime ) {
		if ( gunmanNumber == 2 || gunmanNumber == 3 ) {
			shot_alt.play();
		} else {
			shot_fall.play();
		}
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
	gunman.style.background = 'url(images/g' + gunmanNumber + '.png) left top';
	lifeCount = 3;
	lifes.innerHTML = lifeCount;
	start.addEventListener('click', removeMenu);
}

function startNewGame() {
	startGame();
	clearTime();
	resetCounters();
	menu.classList.remove('remove');
	msg_over.classList.remove('display');
	main_msc.play();
	GAMEOVER = 0;
}

function removeMenu() {
	start.removeEventListener('click', removeMenu);
	main_msc.stop();
	menu.classList.add('remove');
	firstStart();

	if ( direction == 1) {
		wrapper.classList.add('right');
	}

	if ( direction == 2) {
		wrapper.classList.add('left');
	}
}

function firstStart() {
	initFire = 1;
	intro.play();
	intro.addEventListener('ended', goingGunman);
}

function waitingStart() {

	if ( direction == 1) {
		wrapper.classList.add('right');
	}

	if ( direction == 2) {
		wrapper.classList.add('left');
	}

	initFire = 1;
	var outputDelay = function(){
		if( GAMEOVER == 1 ) {
			return;
		} else {
			setTimeout(goingGunman, 2000);
		}
	}();
}

function goingGunman() {
	gunman.classList.add('g' + gunmanNumber +'w');
	gunman.style.background = 'url(../images/g' + gunmanNumber + '.png) no-repeat left top;'

	calcGunmanTime();
	calcReward();

	reward.innerHTML = rewardCount;

	if ( gunmanNumber == 1 && direction == 2 ) {
		gunman.classList.add('scale');
	}

	intro.removeEventListener('ended', goingGunman);
	walk.play();

	wrapper.classList.add('transition');
	gunman.classList.add('walk' + gunmanNumber);

	gunman.classList.remove('remove');
	wrapper.addEventListener('transitionend', turnGunman);
}

function turnGunman() {

	walk.stop();
	gunman.classList.add('cursor');
	gunman.classList.remove('walk' + gunmanNumber);
	wrapper.removeEventListener('transitionend', turnGunman);

	if ( gunmanNumber == 1 ) {
		gunman.style.backgroundPosition = '-500px 0';
	} else if ( gunmanNumber == 2 ) {
		gunman.style.backgroundPosition = '0px 0';
	}

	gunman.classList.remove('walk' + gunmanNumber);

	gunman.addEventListener('click', stopTime);
	wait.play();

	var shootTimer = setTimeout(getFire, fireRange);
}

function getFire() {
	if ( initFire == 1 ) {
		wait.stop();
		fire.play();

		msg_fire.classList.add('display');
		gunman.classList.add('fire' + gunmanNumber);

		startTime();

	} else {
		return;
	}
}

//Game results
function winGame() {
	msg_won.classList.add('display');
	gunman.style.background = 'url(images/g' + gunmanNumber + '.png) left top';

	hat.classList.add('display');
	hat.classList.add('drop' + gunmanNumber);

	if ( gunmanNumber == 2 ) {
		hat.classList.add('unvisible');
	}

	gunman.classList.add('won' + gunmanNumber);

	hat.addEventListener('animationend', function () {
		win.play();
	});

	finish = 1;
	winCount += 1;
	wins.innerHTML = winCount;
	calcScores();

	hat.addEventListener('animationend', restartGame);
}

function loseGame() {
	shot.play();
	gunman.classList.remove('walk' + gunmanNumber);
	gunman.style.backgroundPosition = '-840px 0';
	gunman.classList.add('lost' + gunmanNumber);
	bkg.classList.add('shot-lose');
	msg_lost.classList.add('display');
	lose.play();

	lifeCount -= 1;

	lifes.innerHTML = lifeCount;
	finish = 1;

	goAway();
}

function foulGame() {
	foul.play();
	gunman.classList.remove('walk' + gunmanNumber);
	gunman.style.backgroundPosition = '-840px 0';
	gunman.classList.add('lost' + gunmanNumber);
	bkg.classList.add('foul');
	msg_foul.classList.add('display');

	initFire = 0;
	finish = 1;
	lifeCount -= 1;

	lifes.innerHTML = lifeCount;
	wait.stop();

	goAway();
}

function checkLifes() {
	if( lifeCount <= 0 ) {
		finishGame();
	}

	return;
}

function goAway() {
	setTimeout(function() {
		gunman.style.backgroundPosition = '0px 0';
		gunman.classList.remove('fire' + gunmanNumber);
		gunman.classList.remove('lost' + gunmanNumber);

		if ( gunmanNumber == 1 && direction == 2 ) {
		gunman.classList.remove('scale');
	}

		if ( gunmanNumber == 1 && direction == 1 ) {
			gunman.classList.add('scale');
		}

		gunman.classList.add('walk' + gunmanNumber);
		wrapper.classList.remove('transition');

		if ( direction == 2 ) {
			wrapper.style.left = '100px';
			wrapper.classList.add('transition-right');
		} else if ( direction == 1) {
			wrapper.style.left = '800px';
			wrapper.classList.add('transition-left');
		}

		finish = 1;
		wrapper.addEventListener('transitionend', removeMessages);
	}, 2500);

	gunman.classList.remove('cursor');
	lose.addEventListener('ended', restartGame);
}

function restartGame() {
	checkLifes();
	if( GAMEOVER == 1 ) {
		return;
	}

	hat.removeEventListener('animationend', restartGame);
	win.addEventListener('ended', removeMessages);
	wrapper.removeEventListener('transitionend', restartGame);
	lose.removeEventListener('ended', restartGame);

	wrapper.addEventListener('transitionend', removeMessages);
	lose.addEventListener('ended', removeMessages);
};

function removeMessages() {

	restart.classList.remove('display');
	removeBody();
	clearTime();
	msg_won.classList.remove('display');
	msg_lost.classList.remove('display');
	msg_foul.classList.remove('display');
	msg_fire.classList.remove('display');
// debugger;
	wrapper.addEventListener('transitionend', checkLifes);
	hat.classList.remove('unvisible');

	wrapper.removeEventListener('transitionend', removeMessages);
	lose.removeEventListener('ended', removeMessages);

	waitingStart();
};

function removeBody() {
	init = 0;
	gunman.classList.add('remove');
	gunman.classList.remove('fire' + gunmanNumber);
	gunman.classList.remove('won' + gunmanNumber);
	gunman.style.cssText = '';
	wrapper.style.cssText = '';
	gunman.classList.remove('walk' + gunmanNumber);
	gunman.classList.remove('scale');
	gunman.classList.remove('g' + gunmanNumber +'w');
	wrapper.classList.remove('transition');
	wrapper.classList.remove('transition-right');
	wrapper.classList.remove('transition-left');
	wrapper.classList.remove('right');
	wrapper.classList.remove('left');

	hat.classList.remove('display');
	hat.classList.remove('drop' + gunmanNumber);

	bkg.classList.remove('shot');
	bkg.classList.remove('foul');

	bkg.classList.remove('shot-lose');
	bkg.classList.remove('shot-foul');

	direction = getRandomInRange(1, 2);

	gunmanNumber += 1;
	if ( gunmanNumber == 6 ) {
		gunmanNumber = 1;
	}

	gunman.style.background = 'url(images/g' + gunmanNumber + '.png) left top';
};

function resetCounters() {
	winCount = 0;
	rewardCount = 0;
	scoreCount = 0;

	reward.innerHTML = '0';
	score.innerHTML = '000000';
	wins.innerHTML = '0';
	gnmTime.innerHTML = '0.00';
}

function finishGame() {
	GAMEOVER = 1;

	restart.classList.add('remove');
	removeMessages();
	wrapper.removeEventListener('transitionend', restartGame);
	lose.removeEventListener('ended', restartGame);

	msg_lost.classList.remove('display');
	msg_foul.classList.remove('display');
	msg_over.classList.add('display');

	removeBody();
	gameover.play();

	gameover.addEventListener('ended', startNewGame);

	gunmanNumber = 1;

	return GAMEOVER;
}

//Onload
window.onload = startGame();
})();