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




Animation('alone_gunman_move', '../images/alone_gunman_move.png', styles); // вызываем функцию

	//Параметры
	var styles = {};
	styles.width = '150px';
	styles.height = '370px';

	function Animation(elementId, Name, styles) {

	var img = document.createElement('img');
	var q = 0;
	img.onload = function () {  //как только спрайт загружается
		var el = document.getElementById('alone_gunman_move');
		el.style.width = styles.width;
		el.style.height = styles.height;
		element.style.background = "url('" + imgName + "') " + offset + "px 50%"; //меняем стили для нашего элемента
		var i = 0;
			interval = setInterval(function() {  //запускаем интервал
				if (q < img.width) { //для смены позиции изображения
					i=i+30; // если дошли до конца спрайта
				} else {
					i = 0; // то возвращаемся к началу
				}
				q = 8.8*i; //сдвиг по слайду
				el.style.background = "url('" + Name + "') " + q + "px 50%";
			} , 1000/7) //меняем позиционирование спрайта
		}
		img.src = Name; //задаем имянашего спрайта
	}