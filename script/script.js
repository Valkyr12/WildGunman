(function gunmanMove() {
	var elem = document.getElementById('alone_gunman_move');
	var pos = 1100;
	var id = setInterval(frame, 10);
	function frame () {
		if(pos == 415) {
			clearInterval(id);
		} else {
			pos--;
			elem.style.left = pos + 'px';
		}
	}
})();






	//Параметры
	var styles = {};
	styles.width = '170px';
	styles.height = '320px';

	(function Animation(elementId, Name, styles) {

	var img = document.createElement('img');
	var offset = 0;

	img.onload = function () {
	 //как только спрайт загружается

		var el = document.getElementById(elementId);
		console.log(el.style.width);
		el.style.width = styles.width;
		el.style.height = styles.height;
		el.style.background = "url('" + Name + "') " + offset + "px 50%"; //меняем стили для нашего элемента
		var i = 0;
			interval = setInterval(function() {  //запускаем интервал
				if (offset < img.width) { //для смены позиции изображения
					i=i-60; // если дошли до конца спрайта
				} else {
					i = 510; // то возвращаемся к началу
				}
				offset = 2.8333333 * i; //сдвиг по слайду
				el.style.background = "url('" + Name + "') " + offset + "px 50%";
			} , 1000/3) //меняем позиционирование спрайта
		}
		img.src = Name; //задаем имянашего спрайта
	}
	)('alone_gunman_move', 'images/alone_gunman_move.png', styles);