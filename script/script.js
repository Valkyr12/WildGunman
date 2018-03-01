
var startButton = document.getElementById('start_game');
startButton.addEventListener('click', gunmanMove());

//Параметры
	var styles = {};
		styles.width = '170px';
		styles.height = '320px';
	var elem = document.getElementById('alone_gunman_move');
	var pos = 800;

function gunmanMove() {
	var id = setInterval(frame, 20);
	function frame () {
		if(pos == 415) {
			clearInterval(id);
		} else {
			pos--;
			elem.style.left = pos + 'px';
		}
	}
}
gunmanMove();

function Animation(elementId, Name, styles) {
	var img = document.createElement('img');
	var offset = 0;
	var el = document.getElementById(elementId);
	img.onload = function () {
	 //как только спрайт загружается
		el.style.width = styles.width;
		el.style.height = styles.height;
		el.style.background = "url('" + Name + "') " + offset + "px 50%"; //меняем стили для нашего элемента
		var i = 0;
			interval = setInterval(move, 400/3);

			function move() {  //запускаем интервал
				if (offset < img.width) { //для смены позиции изображения
					i=i-60; // если дошли до конца спрайта
				} else {
					i = 510; // то возвращаемся к началу
				}
				offset = 2.8333333 * i; //сдвиг по слайду
				//меняем позиционирование спрайта
				el.style.background = "url('" + Name + "') " + offset + "px 50%";

				//Если дошел до центра - остановиться

				if(elem.style.left == 415 + 'px') {
					clearInterval(interval);
					var stay = 'images/gunman_preshoot.png';
					el.style.background = "url('" + stay + "') " + 0 + "px 50%";
				}
			}
		}
		img.src = Name; //задаем имянашего спрайта
	}

Animation('alone_gunman_move', 'images/alone_gunman_move.png', styles);