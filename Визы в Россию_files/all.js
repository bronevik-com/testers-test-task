/*
 *Файл с несколькими полезными функциями
 *@author Евгений.
 **/

/**
 * кроссбраузерное добавление события на элемент
 *
 * @param object elem Элемент, на который навешиваем событие
 * @param object elem2 Элемент, от имени которого выполняем событие (именно на него ссылаться будет this)
 * @param string type тип события (click, change)
 * @param function handler функция - обработчик события
 * @param bool f флаг "Перехватывать события"
 */
function addEvent(elem,elem2, type, handler,f) {
    if (elem.addEventListener){
        elem.addEventListener(type, function(event) {
            handler.call(elem2,event)
        }, f)
    } else {
        elem.attachEvent("on"+type, function(event) {
            handler.call(elem2,event)
        })
    }
}

function stopEventPropagation(event)
{
    event = event || window.event

    event.stopPropagation ? event.stopPropagation() : (event.cancelBubble = true)
}

/*
 * Получение координат элемента, с помощью getBoundingClientRect
 */
function getOffsetRect(elem) {
    // (1)
    var box = elem.getBoundingClientRect()

    // (2)
    var body = document.body
    var docElem = document.documentElement

    // (3)
    var scrollTop = window.pageYOffset || docElem.scrollTop || body.scrollTop
    var scrollLeft = window.pageXOffset || docElem.scrollLeft || body.scrollLeft

    // (4)
    var clientTop = docElem.clientTop || body.clientTop || 0
    var clientLeft = docElem.clientLeft || body.clientLeft || 0

    // (5)
    var top  = box.top +  scrollTop - clientTop
    var left = box.left + scrollLeft - clientLeft
//alert(left)
    return {
        top: Math.round(top),
        left: Math.round(left)
    }
}

// получение координат, суммированием оффсетов
function getOffsetSum(elem) {
    var top=0, left=0
    while(elem) {
        top = top + parseInt(elem.offsetTop)
        left = left + parseInt(elem.offsetLeft)
        elem = elem.offsetParent
    }

    return {
        top: top,
        left: left
    }
}

function getOffset(elem) {
    if (elem.getBoundingClientRect) {
        // "правильный" вариант
        return getOffsetRect(elem)
    } else {
        // пусть работает хоть как-то
        return getOffsetSum(elem)
    }
}

/**
 * В зависимости от переданного числа возвращает один из 3х параметров - нужная форма числа
 * @param integer number число
 * @param string form1 строка вида: День
 * @param string form2 строка вида: Дня
 * @param string form3 строка вида: Дней
 * @reutrn string form1 || form2 || form3
 * @author Евгений
 */
function numEnding(number, form1, form2, form3) {
    //2 последние цифры числа
    var num100 = number % 100;
    // последняя цифра числа
    var num10  = number % 10;

    //если число не заканчивается на 5-20
    if ((num100 < 5) || (num100 > 20)) {

        //число заканичается на 1. например: 1,21,31
        if (num10 == 1)                   return form1;
        //число заканичается на 2-4. например: 2,23,34
        if ( (num10 > 1) && (num10 < 5) ) return form2;

    }

    return form3
}

//транслитерация
function translit(src) {
    var lvol = new Array();
    var uvol = new Array();
    var lrus = new String("абвгдеёжзийклмнопрстуфхцчшщъыьэюя");
    var urus = new String("АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ");
    var res  = new String('');
    lvol[0]='a';uvol[0]='A';
    lvol[1]='b';uvol[1]='B';
    lvol[2]='v';uvol[2]='V';
    lvol[3]='g';uvol[3]='G';
    lvol[4]='d';uvol[4]='D';
    lvol[5]='e';uvol[5]='E';
    lvol[6]='e';uvol[6]='E';
    lvol[7]='zh';uvol[7]='Zh';
    lvol[8]='z';uvol[8]='Z';
    lvol[9]='i';uvol[9]='I';
    lvol[10]='i';uvol[10]='I';
    lvol[11]='k';uvol[11]='K';
    lvol[12]='l';uvol[12]='L';
    lvol[13]='m';uvol[13]='M';
    lvol[14]='n';uvol[14]='N';
    lvol[15]='o';uvol[15]='O';
    lvol[16]='p';uvol[16]='P';
    lvol[17]='r';uvol[17]='R';
    lvol[18]='s';uvol[18]='S';
    lvol[19]='t';uvol[19]='T';
    lvol[20]='u';uvol[20]='U';
    lvol[21]='f';uvol[21]='F';
    lvol[22]='kh';uvol[22]='Kh';
    lvol[23]='ts';uvol[23]='Ts';
    lvol[24]='ch';uvol[24]='Ch';
    lvol[25]='sh';uvol[25]='Sh';
    lvol[26]='shch';uvol[26]='Shch';
    lvol[27]='';uvol[27]='';
    lvol[28]='y';uvol[28]='Y';
    lvol[29]="";uvol[29]="";
    lvol[30]='e';uvol[30]='E';
    lvol[31]='yu';uvol[31]='Yu';
    lvol[32]='ya';uvol[32]='Ya';

    for (var i=0;i<src.length;i++) {

        if (lrus.indexOf(src.charAt(i))>=0) {
            res += lvol[lrus.indexOf(src.charAt(i))];
        } else if (urus.indexOf(src.charAt(i))>=0) {
            res += uvol[urus.indexOf(src.charAt(i))];
        } else {
            res += src.charAt(i);
        }
    }
    return res;

}

/**
 * Перкключение уменьшенных блоков
 */
function toggleSmalledBlock(el)
{
    var isBig  = $(el).attr('isbig');
    var parent = $(el).parents('*[type=smalled]').get(0);

    isBig      = isBig ? true : false;

    $('*[type=big]',   parent).toggle(!isBig);
    $('*[type=small]', parent).toggle(isBig);

    if (isBig) $(el).removeAttr('isbig')
        else $(el).attr('isbig', 'true');

    $(el).toggleClass('open');

}

/**
 * Переключение уменьшенных блоков без дублирования контента
 */
function toggleSmalledBlock_v2(el) {
	$(el).parent().parent().find('div:eq(0)').css('height', 'auto');
	$(el).parent().parent().find('div:eq(1)').hide();
	$(el).hide();
}

/**
 * Делаем из таблицы зебру - на каждую вторую ячейку навешиваем класс odd
 * @param object table таблица, которую превращаем в зебру
 */
function setTableZebra(table) {
	if (!table) return;
	var row = -1;

	$("tbody", table).each(function(){
		var row = -1;

		$("tr:visible", this).each(function() {
			if (row % 2 == 0)
				$(this).addClass('odd');
			else
				$(this).removeClass('odd');

			row++;
		});
	});
}

function openToolbox (url, width, height, left, top, reloadPage) {
	if ( width  === undefined ) width  = 1000;
	if ( height === undefined ) height = 800;
	if ( left   === undefined ) left   = 50;
	if ( top    === undefined ) top    = 50;

	var options = [];

    if (typeof reloadPage !== 'boolean') {
        reloadPage = true;
    }

	options.push('width='  + width );
	options.push('height=' + height);
	options.push('left='   + left  );
	options.push('top='    + top   );
	options.push('scrollbars=yes'  );

	var w = window.open( url, 'toolbox', options.join(',') );

    w.focus();
    if (reloadPage === true) {
        $(w).on("beforeunload", function () {
            location.reload();
        });
    }
}

/**
 * Отправляет запрос яндексу на перевод текста
 * Задача #579
 *
 * @param text string  Текст для перевода
 * @param sl string  с какого языка переводим
 * @param tl string  на какой язык переводим
 * @param success function  Функция, которая вызывается при удачном переводе
 * @param progressbar object jquery элемент - картинка крутилка
 */
function translate(text, sl, tl, success, progressbar) {
    try {
        progressbar.show();
    }
    catch (e){}

    $.ajax({
        type    : "POST",
        url     : '/translate/translate.json.php',
        data    : JSON.stringify({from: sl, to: tl, text: text}),
        dataType: "json",
        success : function (result) {
            success(result.data.text);
        },
        error   : function (XMLHttpRequest, errorMsg, errorThrown) {
            alert(errorMsg);
        },
        complete: function () {
            try {
                progressbar.hide();
            }
            catch (e) {
            }
        }
    });
}

/**
 * Отправляет запрос яндексу на перевод текста
 * Фикс для Chrome, в котором translate - зарезервированное слово для каждого элемента
 * Задача #579
 *
 * @param text string  Текст для перевода
 * @param sl string  с какого языка переводим
 * @param tl string  на какой язык переводим
 * @param success function  Функция, которая вызывается при удачном переводе
 * @param progressbar object jquery элемент - картинка крутилка
 */
function translateProxy(text, sl, tl, success, progressbar) {
	translate(text, sl, tl, success, progressbar);
}

/**
 * Содержимое LangEnt.js
 */
function LangEnt()
{

    this.lang = 'ru';
    this.ent      = new Array();
    this.toString = function () {return "[LangEnt]"}
}
LangEnt.prototype.add = function(descript, ru_value, eng_value)
{
    this.ent[descript] =  {ru: ru_value, en: eng_value}
}
LangEnt.prototype.get = function(descript)
{
    if (!this.ent[descript])  return "";
    return this.ent[descript][this.lang]
}

lang_ent = new LangEnt();
/** Конец - LangEnt.js */

/**
 * Содержимое help_tool-1.2.js
 */
/*
 *Класс для организации всплывающих подсказок
 *@author Евгений.
 */

/*
 * Констурктор класса
 */
function HelpTool() {
    // массив элементов, для которых показываем помощь
    this.elements = new Array();

    //количество элементов
    this.elementCount = 0;

    //номер последнего инициализированного объекта
    this.lastInited = -1;

    addEvent(window,this,"load",this.init,false)

    //активный элемент помощи
    this.activeHelp = null;

    //последний активный элемент помощи
    this.lastHelp = null

    //элемент, в котором отображается помощь
    this.helpElement = null;

	// Элемент, в котором отображается текст помощи
    this.helpTextElement = null

    //локаль
    this.lang        = 'ru';

    //настроек для отображения помощи
    this.options = {
        /**
		 * тип открываемой помощи. Доступны значения:
		 * right - открываем справа,
		 * bottom - открываем снизу
		 * right_up - открываем справа вверх (совпадают нижне границы)
		 * left_up - аналогично right_up, только слева)))
		 */
        helpType   : 'right_up',
        //задержка открытия окна помощи
        openDelay  : 0,
        //задержка закрытия окна помощи
        closeDelay : 0,
        /**
		 *максимальная ширина помощи
		 *
		 *@deprecated в пользу css
		 */
        maxWidth   : 400
    }

    /**
	 *настройки стиливого оформления
	 *@deprecated в пользу css
	 */
    this.styleOptions = {
        borderColor     : '#d6a974',
        backgroundColor : '#FFF5C7',
        buttonPrefix    : 'yellow_'
    }
    //таймер открытия окна помощи
    this.openTimer = null;

    //таймер закрытия окна помощи
    this.closeTimer = null;

	// Навешиваем событие на документ - чтоб закрывать помощь при клике где угодно
	addEvent(document, document, "click", function(event) { help.hide()}, false)

	this.toString = function() {return "[HelpTool]"};
}

/**
 * Добавление нового элемента для отображения помощи
 * @param element       string|object  ид елемента (или сам элемент), на котороый навешиваем помощь
 * @param event_type    string  событие, при котором отображать помощь
 * @param text          string  текст помощи / название сраницы, которую надо получит с сервера
 * @param fromserver    boolean флаг, указывающий что текст необходимо загрузить с сервера
 * @param options       object  объект настроект для помощи
 */
HelpTool.prototype.addElement = function(element, event_type, text, fromserver, options) {
    var num = this.elementCount;

    //делаем временную ссылку на переданный объект, или создаем пустой если объект не передан
    var _options = options ? options : {}

    // записываем недостающие настройки из установленных в классе настроек
    for (var i in this.options) if (! _options[i]) _options[i] = this.options[i];

    this.elements[num] = {
        element :    element,
        event_type : event_type,
        text:        text,
        fromserver:  fromserver,
        options:     _options
    }
    this.elementCount++;
}
/* инициализация элементов помощи */
HelpTool.prototype.init = function() {
    //проходим по всем добавленным элементам для установки необходимых событий
    for (var i = this.lastInited + 1; i < this.elementCount; i++) {

        //изменяем в классе идешники, на элементы
        if (typeof this.elements[i].element === 'string')
            this.elements[i].element = document.getElementById(this.elements[i].element);

        //получение элемента
        el = this.elements[i].element;

        if (!el) continue;

        //номер элемента в списке - для активации
        el.num = i;

        //установка событий в зависимости от типа отображения помощи
        switch (this.elements[i].event_type) {

            //показывать помощь пока мышка на элементе
            case 'mousein':
                addEvent(el, el, "mouseover", function() {help.toggle(this.num, true)}, false);
                addEvent(el, el, "mouseout", function() {help.toggle(this.num, false)}, false);
                break;

            // показывать помощь пои клике
            default:
                addEvent(el, el, "click", function(event) {help.toggle(this.num, true, event)}, false)
        }
        //устанавливаем номер последнего инициализированного объекта
        this.lastInited = i;
    }
}
HelpTool.prototype.clearTimer = function(timer) {
    if (timer)  clearTimeout(timer);
    return null
}
/*
 * Показ/скрытие окна помощи
 * @param num int номер элемента, для которого показываем помощь
 */
HelpTool.prototype.toggle = function(num, show, event) {
    // закрытие элемента если нажали на активном
    if ((this.activeHelp) && (this.activeHelp == this.elements[num])) {

        this.closeTimer = setTimeout(function() {help.hide()}, this.activeHelp.options.closeDelay)

        // очищаем таймер открытия, если установлен
        this.openTimer = this.clearTimer(this.openTimer)

        this.activeHelp = null;
        return true;
    }

	if (show) {
		// очищаем таймер закрытия, если установлен
		this.closeTimer = this.clearTimer(this.closeTimer)

		// устанавливаем активный элемент
		this.lastHelp = num
		this.activeHelp = this.elements[num]
		//показываем окно помощи
		this.openTimer = setTimeout(function() {help.show()}, this.activeHelp.options.openDelay)
	}

	try {
		event = event || window.event

		if (event.stopPropagation) {
			event.stopPropagation()
		}
		else {
			event.cancelBubble = true
		}
	}
	catch(e) {}

}
/* просчет координат и выставление элемента в нужную позицию, справа от элемента */
HelpTool.prototype.setRightPosition = function() {
    var el = this.activeHelp.element;

    //размеры и позиция элемента, на котором отображаем помощь.
    var coord = getOffset(el)
    var el_width  = el.offsetWidth;
    var el_height = el.offsetHeight;
    var el_center = Math.round(el_height / 2);

    //устанавливаем координату х окна помощи
    this.helpElement.style.left = coord.left + el_width + 15 + 'px';

    // размеры окна помощи
    var help_height = this.helpElement.offsetHeight;
    var help_center = Math.round(help_height / 2);

    var el_center_coord = el_center + coord.top;

    /* подсчет верхней координаты для окна помощи. По возможноси окно распологаем так,
     чтобы середины по вертикали у окна помощи и элемента совпадали */
    help_top = el_center_coord < help_center ? 5 : el_center_coord - help_center;

    //устанавливаем координаты окна
    this.helpElement.style.top  = help_top + 'px';

    //устанавливаем позицию маркера
    var help_marker_pos = el_center_coord - help_top - 15

    this.buttonDiv.style.top = (help_marker_pos < 10 ? 10 : help_marker_pos) + 'px'

}
HelpTool.prototype.setBottomPosition = function() {
    var el = this.activeHelp.element;

    //размеры и позиция элемента, на котором отображаем помощь.
    var coord = getOffset(el)

    var el_width  = el.offsetWidth;
    var el_height = el.offsetHeight;
    var el_center = Math.round(el_width / 2);

    //устанавливаем координату х окна помощи. 15px - высота маркера
    this.helpElement.style.top = coord.top + el_height + 15 + 'px';

    // размеры окна помощи
    var help_width  = this.helpElement.offsetWidth;
    var help_center = Math.round(help_width / 2);

    var el_center_coord = el_center + coord.left;
    // подсчет левой координаты для окна помощи. По возможноси окно распологаем так,
    // чтобы середины по горизонтали у окна помощи и элемента совпадали
    help_left = el_center_coord < help_center ? 5 : el_center_coord - help_center;

	// Если элемент не влазит в экран по ширине (20 - зазор эт края экрана)
	if ( document.body.offsetWidth <= this.helpElement.offsetWidth + 20 + help_left)
		// Уризаем насильно его ширину
		$(this.helpElement).width( document.body.offsetWidth - 20 - help_left);

    //устанавливаем координаты окна
    this.helpElement.style.left  = help_left + 'px';

    //устанавливаем позицию маркера
    var help_marker_pos = el_center_coord - help_left - 15

    this.buttonDiv.style.left = (help_marker_pos < 10 ? 10 : help_marker_pos) + 'px'

}
/* Открываем помощь справа от элемента, с совпадением нижней границы */
HelpTool.prototype.setRightUpPosition = function() {
    var el = this.activeHelp.element;

    //размеры и позиция элемента, на котором отображаем помощь.
    var coord = getOffset(el)

    var el_width  = el.offsetWidth;
    var el_height = el.offsetHeight;

    // размеры окна помощи
    var help_height = this.helpElement.offsetHeight;

	var left = coord.left + el_width + 5;

	// Если элемент не влазит в экран (20 - зазор эт края экрана)
	if ( document.body.offsetWidth <= this.helpElement.offsetWidth + 20 + left)
		// Уризаем насильно его ширину
		$(this.helpElement).width( document.body.offsetWidth - 20 - left);

    //устанавливаем координаты окна
    this.helpElement.style.left  = left + 'px';
	//устанавливаем координату y окна помощи.
	this.helpElement.style.top = coord.top - help_height + el_height + 'px';
}
/**
 * Открываем помощь слева от элемента, с совпадением нижней границы
 */
HelpTool.prototype.setLeftUpPosition = function() {
    var el = this.activeHelp.element;

    //размеры и позиция элемента, на котором отображаем помощь.
    var coord = getOffset(el)

    var el_height = el.offsetHeight;

    // размеры окна помощи
    var help_height = this.helpElement.offsetHeight;
	var help_width  = this.helpElement.offsetWidth;

    //устанавливаем координаты окна
    this.helpElement.style.left  = coord.left - help_width - 5 + 'px';
	//устанавливаем координату y окна помощи.
	this.helpElement.style.top = coord.top - help_height + el_height + 'px';

}
/* функция для показа помощи */
HelpTool.prototype.setPosition = function() {
    switch (this.activeHelp.options.helpType) {
        case 'bottom'	:this.setBottomPosition();break;
		case 'right_up'	:this.setRightUpPosition();break;
		case 'left_up'	:this.setLeftUpPosition();break;

        default :this.setRightPosition();
    }

}
/**
 * Показ окна помощи
 */
HelpTool.prototype.show = function() {
    if (!this.activeHelp) return false;

    //удаляем существующее окно помощи
    if (this.helpElement) this.helpElement.parentNode.removeChild(this.helpElement);

    //создаем окно помощи
    this.create();

    //установка текста помощи
    this.helpTextElement.innerHTML = this.activeHelp.text;

    // проверка необходимости загрузки помощи с сервера
    if (this.activeHelp.fromserver) {
        this.loadHelp();
    }

    // проверка необходимости вызова сторонней функции
    if ((this.activeHelp.callFunc) && (this.activeHelp.func)) {

        var res = this.activeHelp.func.apply(this.activeHelp.element, this.activeHelp.params)
        if (res)
            this.setText(this.activeHelp.element.num, res);
    }

    if (this.activeHelp.event_type == 'mousein') {
        addEvent(this.helpElement, this, 'mouseover',
            function() {
                this.closeTimer = this.clearTimer(this.closeTimer);
                //this.canHide = false;
            },
        true)

        addEvent(this.helpTextElement, this, 'mouseout',
            function() {
                this.closeTimer = setTimeout(function() {help.hide()}, this.elements[this.lastHelp].options.closeDelay)
            },
        true)
    }

    //показ окна помощи
    this.setPosition();

    this.onShow();
}
/*
 * Функция, вызываемая каждый раз при открытии окна помощи
 */
HelpTool.prototype.onShow = function() {
}
/*
 * Функция, вызываемая каждый раз при скрытии окна помощи
 */
HelpTool.prototype.onHide = function() {
}
/*
 * Скрытие окна помощи
 */
HelpTool.prototype.hide = function() {
    //this.canHide = true;
    this.activeHelp = null;

    // проверяем существование открытого окна помощи
    if (!this.helpElement) return false;

    // удаляем существующее окно помощи
    this.helpElement.parentNode.removeChild(this.helpElement)

    //удаляем указатели
    this.helpElement = false;

    this.onHide();
}
/*
 * Создание окна помощи
 */
HelpTool.prototype.create = function() {
    // создаем див-контейнер для окна помощи
    var div = document.createElement('div');
    document.body.appendChild(div);

	div.onclick = function(event) {
		event = event || window.event
		if (event.stopPropagation) {
			event.stopPropagation()
		}
		else {
			event.cancelBubble = true
		}
	}

    // див с текстом помощи
    var mainDiv = document.createElement('div');
    div.appendChild(mainDiv);

    //маркер-указатель окна помощи (стрелка влево)
    var button = document.createElement('div');
    div.appendChild(button);

    //делаем сслыки на созданные элементы
    this.helpElement = div
    this.helpTextElement = mainDiv
    this.buttonDiv       = button

    //устанавливаем стили для элементов
    div.className = 'help'
	mainDiv.className = 'help_content'

    //смещаем в левый верхний угол, чтобы не появлялся скроллинг
    div.style.left = div.style.top = '0px'

	button.className = 'help_button_' + this.activeHelp.options.helpType;

	// Если не задано свойство size - уходим отсюда
	if (!this.activeHelp.size) return true;

	/*Если у элемента помощи установлены размеры - поумолчанию принимаем их*/
	if (this.activeHelp.size.width)	 div.style.minWidth  = this.activeHelp.size.width  + 'px'
	if (this.activeHelp.size.height) div.style.minHeight = this.activeHelp.size.height + 'px'
}
/**
 * Загрузка помощи с сервера
 */
HelpTool.prototype.loadHelp = function() {
}
/*
 * Добавление нового элемента для отображения помощи
 * @param element       string|object  ид елемента (или сам элемент), на котороый навешиваем помощь
 * @param event_type    string  событие, при котором отображать помощь
 * @param text          string  текст, который
 * @param func          function функция, которую необходимо вызвать при отображении помощи
 * @param params        object  объект настроек для вызываемой функции
 * @param options       object  объект настроект для помощи
 */
HelpTool.prototype.addCallFuncElement = function(element, event_type, text, func, params, options) {
    var num = this.elementCount;
    params.push(num);

    //делаем временную ссылку на переданный объект, или создаем пустой если объект не передан
    var _options = options ? options : {}

    // записываем недостающие настройки из установленных в классе настроек
    for (var i in this.options) if (! _options[i]) _options[i] = this.options[i];

    this.elements[num] = {
        element    : element,
        event_type : event_type,
        func       : func,
        params     : params,
        callFunc   : true,
        text       : text,
        options    : _options
    }
    this.elementCount++;
}
/**
 * Установка текста помощи для элемента с номером num
 * @param num  integer номер элемента, на который устанавливаем поиощь
 * @param text string  текст помощи
 */
HelpTool.prototype.setText = function(num, text) {
    try {
        //получаем элемент, для которого загружали данные
        var data = this.elements[num];

        // устанавливаем текст
        data.text = text;

        //отключаем флаги загрузки данных
        data.callFunc   = false
        data.fromserver = false

        //Если открыто окно, для которого устанавливаем текст - перерисовываем окно.
        if (this.activeHelp && this.activeHelp.element.num == num)
            this.show();
    }
    catch (err) {}
}
help = new HelpTool();
/** Конец - help_tool-1.2.js */


/**
 * Содержимое dialog-1.1.js
 */
/**
 * Класс диалогового окна
 */
function dialog(_options) {
	try {
		var lang = Lang
	}
	catch(e) {
		var lang = 'ru'
	}

	// элементв-отображение диалогового окна
	var visel = false;

	// флаг открытости окна
	this.opened = false;

	/**
	 * Тип кнопки закрытия
	 * Варианты: full, short, none
	 */
	this.closeButtonType = 'full';

	options = {
		closeButton : 'full'
	}

	$.extend(options, _options);

	var content = null;
	/**
	 * открывает диалоговое окно
	 *
	 * @return
	 */
	this.open  = function() {
		if (!visel) create();

		$(visel).show();
		this.opened = true;
		return visel
	}

	/**
	 * Закрывает диалоговое окно
	 */
	this.close = function() {
		// Если установлен параметр уничтожения после закрытия
		if (options.destroyOnClose)
			this.destroy();
		else {
			$(visel).hide();
			this.opened = false;
		}
	}

	/**
	 * Уничтожает диалоговое окно
	 */
	this.destroy = function() {
		$(visel).remove();
		this.opened = visel = false;
	}

	/**
	 * Открытие/закрытие окна
	 */
	this.toggle = function() {
		if (!visel) create();
		$(visel).toggle(this.opened = !this.opened);
	}

	/**
	 * Перемещаем окно в центр экрана
	 */
	this.moveToCenter = function() {
		var w = $(window);
		$(visel).css("top",(w.height()-$(visel).height())/2+w.scrollTop() + "px");
		$(visel).css("left",(w.width()-$(visel).width())/2+w.scrollLeft() + "px");
	}

	/**
	 * Перемещает окно в координаты
	 *
	 * @param int x координата x окна
	 * @param int y координата y окна
	 */
	this.moveTo = function(x, y) {
		if (x) visel.style.left = x + 'px';
		if (y) visel.style.top  = y + 'px';
	}

	this.moveUnderElement = function(element, dx, dy)
	{
		var rect = getOffset(element);
		var el	 = $(element)

		if (!parseInt(dx)) dx = 0;
		if (!parseInt(dy)) dy = 0;

		$(visel).css('top'  , rect.top  + dy + el.height() + 'px')
		$(visel).css('left' , rect.left + dx + 'px')
	}
	/**
	 * Устанавливаем содержимое окна
	 *
	 * @param string text содержимое
	 */
	this.setContent = function(html) {
		if ( !visel ) create();
		content.innerHTML = html
	}

	/**
	 * Возвращает элемет-отображение окна
	 */
	this.getElement = function () {return content;}

	this.getMainElement = function () {return visel;}

	var me = this;

	/**
	 * Создаем окно
	 *
	 * @access private
	 */
	var create = function()
	{
		var close_el = false;

		visel   = document.createElement('div');
		content = document.createElement('div');
		close_el = createCloseButton();

		if (close_el)
			visel.appendChild(close_el);

		visel.appendChild(content);
		document.body.appendChild(visel);

		visel.className = 'dialog';

		// Скрываем сразу после создания
		me.toggle();
		me.moveToCenter();
	}

	/**
	 * Создает кнопку закрытия
	 *
	 * @access private
	 */
	var createCloseButton = function ()
	{
		var button = options.closeButton

		switch (button) {
			case null:
			case 'none': return false;

			case 'full':
				var close_el = document.createElement('div');
				close_el.className = 'close_button'
				close_el.innerHTML = '<a href="JavaScript:void(1)"><img src="/static/icons/close.png" /></a>'
				close_el.onclick = function () {me.close()}

				$(close_el).children('a').html(lang == 'en' ? 'Close' : 'Закрыть');

				return close_el;

			case 'short' :
				var close_el = document.createElement('div');
				close_el.className = 'close_button'
				close_el.innerHTML = '<a href="JavaScript:void(1)"><img src="/static/icons/close.png" /></a>'
				close_el.onclick = function () {me.close()}

				return close_el;
		}

		return false;
	}
}
/** Содержимое dialog-1.1.js */


/**
 * Содержимое calendar-1.4.2.js
 */

/**
 * Календарь
 *
 * @author: Антон Прибора
 */
function Calendar(objText, lang) {
	// Защита от многократного создания
	if ( objText.calendar !== undefined ) return objText.calendar;

	/** Приватные функции */

	/** Добавление нового элемента */
	var createElement = function (elementName, elementClass) {
		var object = document.createElement(elementName);

		if ( typeof elementClass === 'string' )
			object.className = elementClass;

		return object;
	}

    /** Добавление новой кнопки
     *
     * @param string elementValue - надпись на кнопке
     * @param string elementClass - css класс кнопки
     * @return object
     **/
	var createButtonElement = function (elementValue, elementClass) {
        var object = document.createElement('input');
        object.type = "button"

        if ( typeof elementClass === 'string' )
			object.className = elementClass;

        if ( typeof elementValue === 'string' )
            object.value = elementValue

		return object;
	}

	/** Добавление объекта к телу документа */
	var appendObject = function (object) {
		document.body.appendChild(object);
	}

	/** Функция создания списка опций для селекта */
	var createOptions = function (object, options) {
		// Обнуляем список
		object.options.length = 0;

		// Заполняем список значениями
		for( var i in options )
		{
			var option = new Option();

			option.value = i;
			option.text  = options[i];

			object.options[ object.options.length ] = option;
		}
	}

	/** Функция для установки активного элемента */
	var setActiveIndex = function (object, value)
	{
		for( var i = 0; i < object.options.length; ++i )
		{
			if ( object.options[i].value == value )
			{
				object.selectedIndex = i;
				break;
			}
		}
	}

	/** Установка объекта под другим */
	var setOffsetPostion = function (objSrc, objTo) {

        coord = getOffset(objTo);

        var left = coord.left;
        var top  = coord.top + objTo.offsetHeight;

		objSrc.style.left = left + 'px';
		objSrc.style.top  = top  + 'px';
	}

	/** Получение форматированной даты */
	var dateFormat = function (aDate, aFormat) {
		if ( aDate   === undefined ) aDate = date;
		if ( aFormat === undefined ) aFormat = options.dateFormat;

		var Y = aDate.getFullYear();           // Y A full numeric representation of a year, 4 digits Examples: 1999 or 2003
		var y = String(Y).substr(2, 2);        // y A two digit representation of a year Examples: 99 or 03

		var n = aDate.getMonth() + 1;          // n Numeric representation of a month, without leading zeros 1 through 12
		var m = n < 10 ? '0' + n : n;          // m Numeric representation of a month, with leading zeros 01 through 12

		var j = aDate.getDate();               // j Day of the month without leading zeros 1 to 31
		var d = j < 10 ? '0' + j : j;          // d Day of the month, 2 digits with leading zeros 01 to 31

		var F = options.monthName[ aDate.getMonth() ];        // F A full textual representation of a month, such as January or March January through December
		var M = options.monthNameShort[ aDate.getMonth() ];   // M A short textual representation of a month, three letters Jan through Dec

		return aFormat.
			replace(/Y/g, Y).
			replace(/y/g, y).
			replace(/n/g, n).
			replace(/m/g, m).
			replace(/j/g, j).
			replace(/d/g, d).
			replace(/F/g, F).
			replace(/M/g, M);
	}

	// Разбор даты
	var parseDate = function(d)
	{
		if ( typeof d === 'string' )
		{
			var arr = d.split( /\W+/ );

			d = new Date();

			// Заглушка для вредных дат
			d.setDate(1);

            if ( parseInt(arr[0].replace(/^0/g, '')) ) d.setFullYear(arr[0]);
			if ( parseInt(arr[1].replace(/^0/g, '')) ) d.setMonth(arr[1] - 1);
			if ( parseInt(arr[2].replace(/^0/g, '')) ) d.setDate(arr[2]);

		}

		return d;
	}


	/** Функция для создания таблицы календаря */
	var getCalendarTable = function (month, year)
	{
		// Отключить даты меньше заданной
		var dMin = dateFormat(parseDate(options['disableDatesBefore']), 'Ymd');
		var dMax = dateFormat(parseDate(options['disableDatesAfter' ]), 'Ymd');

		month = parseInt(month);
		year  = parseInt(year );

		var d = new Date();

		d.setDate(1);
		d.setMonth(month);
		d.setFullYear(year);

		// Позиция первого дня
		var fistDayPosition = d.getDay() - 1;

		// Заплатка для смещения по дням (на западе неделя начинается в воскресенье)
		if ( fistDayPosition < 0 ) fistDayPosition = 7 + fistDayPosition;

		// Вычисляем последний день
		d.setMonth(month + 1);
		d.setDate(-1);

		// Колчиество дней месяца
		var dayCount = d.getDate();

		// Счётчик дней
		var dc = 0;

		var table = createElement('table');

		table.cellPadding = 0;
		table.cellSpacing = 0;
		table.width = '100%';

		var thead = createElement('thead');

		// Добавляем голову таблицы
		table.appendChild(thead);

		var tr = createElement('tr');

		// Дни недели
		var days = ['П', 'В', 'С', 'Ч', 'П', 'С', 'В'];

        //берем список названий дней недели из объекта options
        days = options.dayName;

		for(var i in days)
		{
			var th = createElement('th');
			th.innerHTML = days[i];
			if ( i % 7 == 5 || i % 7 == 6 ) th.className += ' holiday';
			tr.appendChild(th);
		}

		thead.appendChild(tr);

		// Тело таблицы
		var tbody = createElement('tbody');

		table.appendChild(tbody);

		var i = 0, td = null;

		// Начальное смещение дней
		if ( fistDayPosition )
		{
			tr = createElement('tr');
			tbody.appendChild(tr);

			for ( ; i < fistDayPosition; ++i )
			{
				td = createElement('td');
				td.innerHTML = '&nbsp;';
				tr.appendChild(td);
			}
		}

		var month = d.getMonth() + 1;
		var year  = d.getFullYear();

		if ( month < 10 ) month = '0' + month;

		// Флаг отключения даты
		var disabled = null;

		// Расчётная дата
		var calDate  = null;

		// Флаг - расчётная дата является текущей
		var current  = calendar.getDate('Ymd');

		// Сегодняшнее число
		var today    = dateFormat(new Date(), 'Ymd');

		// Основной цикл по дням
		while( dc <= dayCount )
		{
			// Если нужно, начинаем новую строку
			if ( i % 7 == 0 )
			{
				tr = createElement('tr');
				tbody.appendChild(tr);
			}

			// Создаём элемент td
			td = createElement('td');
			td.innerHTML = ++dc;
			tr.appendChild(td);

			// Заполняем свойства активной ячейки
			td.calendar  = calendar;

			calDate = year + '-' + month + '-' + (dc < 10 ? '0' + dc : dc);
			td.date = calDate;

			td.title = calDate;

			calDate = calDate.replace(/\D/g, '');

			disabled = calDate < dMin || calDate > dMax || (calDate in disabledDates);

			td.className = disabled ? 'disabled' : 'active';

			if ( calDate == current ) td.className += ' current';
			if ( calDate == today   ) td.className += ' today';
			if ( i % 7 == 5 || i % 7 == 6 ) td.className += ' holiday';

			if ( !disabled )
			{
				td.onclick   = function()
				{
					this.calendar.setDate(this.date);
					this.calendar.close();
				}
			}

			++i;
		}

		if ( i % 7 )
		{
			// Закрываем смещение дней в конце
			while( true )
			{
				td = createElement('td');
				td.innerHTML = '&nbsp;';
				tr.appendChild(td);

				if ( i++ % 7 == 6 ) break;
			}
		}

		// Возвращаем объект таблицы
		return table;
	}

	/** Публицчные методы */

	/** Установка опций календаря */
	this.setOption = function(name, value)
	{
		options[ name ] = value;
	}

	/** Установка новой даты */
	this.setDate = function (newDate) {
		var oldValue = this.getDate();

		date = parseDate(newDate);

		objHidden.value = dateFormat(date, options.dateFormat);
		objText.value   = dateFormat(date, options.dateFormatVisible);

		// Обработка события "Изменение календаря"
		if ( oldValue !== this.getDate() && typeof this.onchange === 'function' ) this.onchange(oldValue);
	}

    /**
     * Установить первую свободную (не запрещенную) дату
     * @author Евгений
     */
    this.setFreeDate = function()
    {
        //получаем текущую дату
        var current_date = new Date(date);

        // значение свободной даты
        var freedate = null;

        // ищем свободную дату начиная с текущей по конечную дату(запрещенную настройками)
        for (var day = current_date; day < parseDate(options.disableDatesAfter); day.setDate(day.getDate() + 1)) {
            if(disabledDates [dateFormat(day, 'Ymd')]) continue;
            if (dateFormat(day, 'Y-m-d') < options['disableDatesBefore']) continue;
            freedate = day;
            break;
        }

        // проверяем найдена ли свободная дата, если найдена - устанавливаем ее
        if (freedate) {
            this.setDate(freedate)
            return true;
        }
        //восстанавливаем значение текущей даты, т.к. в цикле оно изменилось
        var current_date = new Date(date)

        // ищем свободную дату начиная с вервой разрешенной по текущую дату
        for (day = parseDate(options.disableDatesBefore); day < current_date; day.setDate(day.getDate() + 1)) {
            if(disabledDates [dateFormat(day, 'Ymd')]) continue;
            freedate = day;
            break;
        }
        if (freedate) this.setDate(freedate)

    }


    /**
     * получение максимально доступного года календаря
     * @author Евгений
    */
    this.getMaxYear = function()
    {
        return objSelectYear.options[ objSelectYear.options.length - 1 ].value - 0;
    }
    /**
     * получение минимально доступного года календаря
     * @author Евгений
    */
    this.getMinYear = function()
    {
        return objSelectYear.options[0].value - 0;
    }

	/**
     *Функция установки селектов
     *Вынесена из функции show.
     *Вынес: Евгений
     */
    this.setSelectsAIndex = function()
    {
		setActiveIndex(objSelectMonth, date.getMonth());
		setActiveIndex(objSelectYear , date.getFullYear());
    }

	this.disable = function(disabled, dontHideDates)
	{
		if ( disabled )
		{
			objHidden.disabled = true;
			objText.disabled   = true;

			if (!dontHideDates)
				objText.value  = 'нет значения';
		}
		else
		{
			objHidden.disabled = false;
			objText.disabled   = false;

			objHidden.value = dateFormat(date, options.dateFormat);
			objText.value   = dateFormat(date, options.dateFormatVisible);
		}
	}

	/** Возврат даты */
	this.getDate = function(format) {
		if ( format === 'obj' || format === 'object' )
			return date;
		else
			return dateFormat(date, format);
	}

	/** Создание таблицы календаря */
	this.rewrite = function() {
		// Удаляем старую таблицу
		if ( objTableCalendar != null )
		{
			objDivCalendar.removeChild( objTableCalendar );
		}

		objTableCalendar = getCalendarTable (
			objSelectMonth.options[ objSelectMonth.selectedIndex ].value,
			objSelectYear.options[ objSelectYear.selectedIndex ].value
		);

		// Заполняем содержимое контейнера для календаря
		objDivCalendar.appendChild( objTableCalendar );
	}

	/** Показ календаря */
	this.show = function() {

		if ( showed || objText.disabled) return false;

        //формирование списка годов
        var today = new Date();
		var cyear = today.getFullYear();

        var years = {};

        for (var i = -options.dYearPrev; i <= options.dYearNext; i++) years[ cyear + i ] = cyear + i;

        createOptions(objSelectYear, years);

		// Установка координат
		setOffsetPostion(objDiv, objText);

		// Установка селектов
		this.setSelectsAIndex();

		// Перерисовка
		this.rewrite();

		// Показ календаря
		objDiv.style.display = 'block';

		showed = true;

		/*// Обработка кликов
		listener = document.addClickListener( function(){
			if ( !override ) this.close();
			override = false;
		}, this);*/
	}

	/** Закрытие календаря */
	this.close = function() {

		if (!showed) return true;
		objDiv.style.display = 'none';
		showed = false;
		return true;


		if ( !listener ) return true;

		override = false;

		objDiv.style.display = 'none';
		document.removeClickListener(listener);

		listener = null;
	}

	/** Функция для обработки события изменения каледаря */
	this.onchange = function(oldValue) {;}


    this.prevYear = function ()
    {
        var selIndex = objSelectYear.selectedIndex - 1;
        var maxIndex = objSelectYear.options.length;
        objSelectYear.selectedIndex=selIndex >= 0 ? selIndex : maxIndex - 1;
        this.rewrite();
    }

    /**
     * Функция перемещения на предыдущий месяц
     * @author Евгений
    */
    this.prevMonth = function ()
    {
        //получаем выбранные элемент месяца и максимальный
        var selIndex = objSelectMonth.selectedIndex - 1;
        var maxIndex = objSelectMonth.options.length;

        //изменяем индекс выбранного элемента
        objSelectMonth.selectedIndex = selIndex >= 0 ? selIndex : maxIndex - 1;

        if (selIndex < 0)  this.prevYear();
          else this.rewrite();

		return false;
    }

    /**
     * Функция перемещения на следующий год
     * @author Евгений
    */
    this.nextYear = function ()
    {
        var selIndex = objSelectYear.selectedIndex + 1;
        var maxIndex = objSelectYear.options.length;

        objSelectYear.selectedIndex = selIndex < maxIndex ? selIndex : 0;
        this.rewrite();
    }
    /**
     * Функция перемещения на следующий месяц
     * @author Евгений
    */
    this.nextMonth = function ()
    {
        var selIndex = objSelectMonth.selectedIndex + 1;
        var maxIndex = objSelectMonth.options.length;

        objSelectMonth.selectedIndex = selIndex < maxIndex ? selIndex : 0;

        if (selIndex>=maxIndex) this.nextYear();
          else this.rewrite();
    }

    /**
     * Переходим на выбранную дату
     */
    this.gotoCurrentDate = function()
    {
        this.setSelectsAIndex();
        this.rewrite();
    }

    /**
     * Дорбавляем период отключенных дат
     * @param string start начало периода. формат: YYYY-MM-DD
     * @param string end   конец периода. формат: YYYY-MM-DD
     * @author Евгений
     */
    this.addDisablePeriod = function(start, end)
    {
        disabledPeriods.push({start: start,end: end});

        var start = parseDate(start);
        var end   = parseDate(end);

        for (var day = start; day <= end; day.setDate(day.getDate() + 1) ) {
            //alert(dateFormat(day, 'Ymd'))
            disabledDates [dateFormat(day, 'Ymd')] = 1;
        }
    }

	/* Оборачиваем календарь в див - чтобы иконка календаря была снаружи*/
	var objTextDiv     = document.createElement('i');
	objText.parentNode.insertBefore(objTextDiv, objText);
	objTextDiv.appendChild(objText);
	objTextDiv.className = 'datepicker';

	/** Объекты для управления календаря */
	var calendar       = this;
	var objDiv         = createElement('div', 'zg-calendar');
	var objSelectMonth = createElement('select', 'zg-calendar-month');
	var objSelectYear  = createElement('select', 'zg-calendar-year');
	var objDivCalendar = createElement('div', 'zg-calendar-container');
	var objHidden      = createElement('input');

    /** *Объекты для перемещения по месяцам/годам */
    var objDivMovePanel= createElement("div");

    var objMonthPrev   = createButtonElement("","moveButton prev");
    var objMonthNext   = createButtonElement('',"moveButton next");
    var objYearPrev    = createButtonElement("","moveButton prev");
    var objYearNext    = createButtonElement('',"moveButton next");

	var objTableCalendar = null; // Таблица календаря, создаётся автоматически

	var listener = null;  // Идентификатор обработчика
	var override = false; // Признак того, что фокус находится на календаре
	var showed   = false; // Показан ли календарь

	/** Дата календаря */
	var date = new Date();

	/** Опции календаря */


	var options = {
		// Имена месяцев, с нулевой нумерацией
		monthName: [
			'Январь' , 'Февраль', 'Март'    ,
			'Апрель' , 'Май'    , 'Июнь'    ,
		    'Июль'   , 'Август' , 'Сентябрь',
			'Октябрь', 'Ноябрь' , 'Декабрь'
		],

		monthNameShort: [
			'янв', 'фев', 'мар',
			'апр', 'мая', 'июн',
		    'июл', 'авг', 'сен',
			'окт', 'ноя', 'дек'
		],

		// Отключить даты меньше значения
		disableDatesBefore: '1900-01-01',

		// Отключить даты больше значения
		disableDatesAfter: '3000-12-31',

		// Названия дней недели
		dayName: [ 'П', 'В', 'С', 'Ч', 'П', 'С', 'В' ],

		// Формат даты для скрытого поля
		dateFormat: 'Y-m-d',

		// Формат даты для отображения
		dateFormatVisible: 'j M Y',

        // смещение начального и конечного года в списке годов. отсчет от текущего
        dYearPrev: 1,
        dYearNext: 2

	};

	switch (lang) {
		case 'cn':
	        // Имена месяцев, с нулевой нумерацией
	        options.monthName = [
	            '一月', '二月' , '三月',
	            '四月', '五月' , '六月',
	            '七月', '八月' , '九月',
	            '十月', '十一月' , '十二月'
	        ];
	        // Сокращенные имена месяцев, с нулевой нумерацией
	        options.monthNameShort = [
	            '一月', '二月', '三月',
	            '四月', '五月', '六月',
	            '七月', '八月', '九月',
	            '十月', '十一月', '十二月'
	        ];

	        // Названия дней недели
	        options.dayName = [ '星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期天' ];

	    break;

        case 'en':
            // Имена месяцев, с нулевой нумерацией
            options.monthName = [
                'January', 'February' , 'March',
                'April'  , 'May'      , 'June',
                'July'   , 'August'   , 'September',
                'October', 'November' , 'December'
            ];
            // Сокращенные имена месяцев, с нулевой нумерацией
            options.monthNameShort = [
                'Jan', 'Feb', 'Mar',
                'Apr', 'May', 'Jun',
                'Jul', 'Aug', 'Sep',
                'Oct', 'Nov', 'Dec'
            ];

            // Названия дней недели
            options.dayName = [ 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun' ];

        break;

        default:
            options.monthName = [
                'Январь' , 'Февраль', 'Март'    ,
                'Апрель' , 'Май'    , 'Июнь'    ,
                'Июль'   , 'Август' , 'Сентябрь',
                'Октябрь', 'Ноябрь' , 'Декабрь'
            ];

            options.monthNameShort = [
                'янв', 'фев', 'мар',
                'апр', 'мая', 'июн',
                'июл', 'авг', 'сен',
                'окт', 'ноя', 'дек'
            ];
            options.dayName = [ 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс' ];

        break;
    }

	var lang = lang;
    // массив заблокированных чисел.
    var disabledPeriods = new Array();
    var disabledDates   = {};

/*меняем расположение календаря: создаем для него див*/

	/** Инициализация объектов - заполнение свойства календаря */
	objDiv.calendar         = this;
	objSelectMonth.calendar = this;
	objSelectYear.calendar  = this;
	objDivCalendar.calendar = this;
	objText.calendar        = this;
	objHidden.calendar      = this;

    objMonthNext.calendar   = this;
    objMonthPrev.calendar   = this;
    objYearNext.calendar    = this;
    objYearPrev.calendar    = this;

	objTextDiv.calendar		= this;

	// Задаём тип скрытому полю тип
	objHidden.type = 'hidden';

	/** Заменяем начальное поле ввода на скрытое */
	if ( objText.form )
	{
		// Подменяем текстовое поле
		objHidden.name = objText.name;
		objText.removeAttribute('name');
		objText.form.appendChild(objHidden);
	}

	// Установка режима "только для чтения"
	objText.readOnly = true;

	// Обработка событий объектов управления
	objSelectMonth.onchange = objSelectYear.onchange = function() {this.calendar.rewrite()}
	//objTextDiv.onmousedown	= objText.onmousedown    = objDiv.onmousedown = function() {override = true;}
	objText.onfocus			= function() {try{this.calendar.show();}catch(e){alert(e.message);}}

	// Установка начальной даты
	if (objText.value) {
        this.setDate(objText.value);
    }

	// Заполняем списки
	createOptions(objSelectMonth, options.monthName);

	// Строим иерархию объектов

	/*Создаем таблицу для отображения селектов месяца/года*/
    objSelectsTable = createElement("table","selects");
    objSelectsTable.cellSpacing = 0;
    objSelectsTable.cellPadding = 0;

	/*строки для месяца/года*/
	var year = objSelectsTable.insertRow(0);
    var month = objSelectsTable.insertRow(1);

	year.insertCell(0);
	year.insertCell(1);

    month.insertCell(0);
    month.insertCell(1);

	/*Формируем строку с выбором года*/
	year.cells[0].innerHTML = lang == 'en' ? 'Year:' : 'Год:';
	year.cells[1].appendChild(objYearPrev);
    year.cells[1].appendChild(objSelectYear);
    year.cells[1].appendChild(objYearNext);


	/*Формируем строку с выбором месяца*/
	month.cells[0].innerHTML = lang == 'en' ? 'Month:' : 'Месяц:';
    month.cells[1].appendChild(objMonthPrev);
    month.cells[1].appendChild(objSelectMonth);
    month.cells[1].appendChild(objMonthNext);

	year.cells[0].style.textAlign = month.cells[0].style.textAlign = 'right';
	year.cells[1].style.textAlign = month.cells[1].style.textAlign = 'left';

	year.cells[1].style.whiteSpace = month.cells[1].style.whiteSpace = 'nowrap';

    objDiv.appendChild(objSelectsTable);

    objDiv.appendChild(objDivCalendar);

	objDiv.style.display = 'none';

	// Отключение
	if ( objText.disabled ) this.disable(true);

	document.body.appendChild(objDiv);

	addEvent(document.body, this, 'click', function(event) { this.close(); }, false)

	addEvent(objTextDiv, this, 'click', function (event) { this.show(); stopEventPropagation(event); }, false)

	addEvent(objMonthPrev, this, 'click', function () {this.prevMonth();}, false)
	addEvent(objMonthNext, this, 'click', function () {this.nextMonth();}, false)
	addEvent(objYearPrev , this, 'click', function () {this.prevYear(); }, false)
	addEvent(objYearNext , this, 'click', function () {this.nextYear(); }, false)

	addEvent(objDiv, objDiv, 'click', stopEventPropagation )
};
/** Конец - calendar-1.4.2.js */


/**
 * Содержимое qsearch1-5.js
 */
/**
 * Организация поиска
 * @author Евгений.
 */

/**
 * добавление элемента
 *
 * @param parentEl      string      id элемента, на котором создаем
 * @param childElType   string     тип создаваемого элемента
 * @param id            string      значение атрибута id создаваемого элемента
 * @return mixed    созданный элемент
 * @author Евгений.
 */
function AddElement(parentEl,childElType,id) {
    var owner = parentEl.ownerDocument;
    var Elem = owner.createElement(childElType);

    if (id) Elem.id=id;
    parentEl.appendChild(Elem);
    return Elem;
}

/**
 *Класс быстрого
 *@param id             string идентификатор элемента, к которому подключаем поиск
 *@param db_descript    string идентификатор запроса поиска
 *@param lang           string описание локали
 *@param query_descript string идентификатор уточнений поиска
 */
function TSearch(id, db_descript, query_descript, lang) {
    this.toString     = function(){return "[TSearch]"}

    this.elid         = id
    this.db_descript  = db_descript ? db_descript : null

	// Пробуем взять глобальное значение языка
    try {
        this.lang = Lang;
    }
    catch (e) {
        this.lang = 'ru';
    }

	// Если передали значение локали - оно приоритетнее - устанавливаем его
    if (lang) this.lang = lang;

    //массив найденных данных
    this.searchResult = new Array()

    //див, в котором выводятся найденные данные
    this.resDiv       = null

    //элемент, в который выводятся данные
    this.visel        = null

    //текст, который был в прошлом запросе поиска. Нужен для различных проверок
    this.oldtext	  = "";

    // провекра заданности дескриптора базы
    if (
        ( typeof this.db_descript != 'string') ||
        (this.db_descript.replace(/\s+/g,"") == "")
       ) return false

    this.query_descript = query_descript;

    //тип найденного результата: 0 - пусто, 1 - один результат, 2 - множестенный результат
    this.findResultType       = null;

    //функция, выполняемая при одиночном результате
    this.onSingleFindResult   = null;

    //функция, выполняемая при неодиночном результате (несколько или 0)
    this.onUnSingleFindResult = null;

	//событие, возникающее при выборе варианта из результата
	this.onSelectResult = null;

    //текст, который будет выведен под результатом поиска, и который не выбирается.
    this.text         = null;

    //ссылка на объект "поиск", от которого зависит результат данного поиск
    this.dependence   = new Array();

    //массив элементов, от которых зависит результат поиска. Вид массива: ключи - идешники элементов, значение - тип элемента
    this.dependenceElement = new Array();

    //количество символов, с которого начинаем поиск
    this.minTextLength = 2

    //обязательно ли должно быть найден только одно значение, что бы сохранить результат для отправки не сервер
    this.needSingle = true

    // идентифактор дива, в который выводить результат. Установить если необходимо перенаправить вывод
    this.otherViselId = null

    //флаг "кликабельности" результата - навешивать клик на элементы результата
    this.clickableResult = true;

    //флаг возможности скрыть результат !!!Если выставить в false результат не будет скрываться
    this.hideResult = true

    //флаг автоматической подстройка размеров дива с результатами к привязанному полю ввода
    this.autoSize = true

    //показ сообщение, если ничего не найдено
    this.showNullResultText = true;

    //автоматическая отправка формы при выборе элемента
    this.sendOnSelect = true

    //флаг возможности перемещения по результату
    this.movedResult = true

    this.icons = {
        defaultIcon: '/static/icons/find.png',
        notFound:    '/static/icons/accept.png',
        singleFound: '/static/icons/cross.png',
        multyFound:  '/static/icons/cross.png',

		progressBar: '/static/img/progress_bar.gif'
    }

    // объект для временного хранения данных - при перемещении курсором
    this.tmpData = {
        eltext  : '',
        sendval : '',
        seted   : false
    }

	/*
	 * Имя элемента, значением которого будет являтся результат поиска - выбранный элемент.
	 * Если не указано - будет работать схема:
	 *   К элементу, в который вводим добавляем суффикс _show, а его изначальное имя передается элементу
	 *   с результатами поиска
	 */
	this.sendelName = '';

	// Урл для запроса
	this.url = document.URL.match(/(obt).ibc.ru/) ? '/ajax/qsearch/' : '/static/ajax/qsearch.php?callback=?';
}
/**
 * Устанавливаем отправляемое значение
 */
TSearch.prototype.setSendvalue = function (value) {
	try {
		this.sendel.value = value
	}
	catch(e) {}

}
/**
 * Получаем отправляемое значение
 */
TSearch.prototype.getSendvalue = function () {
	try {
		return this.sendel.value
	}
	catch(e) {return ''}

}
/**
 * Устанавливает события
 */
TSearch.prototype.setEvents = function() {
	var el = this.inputel

    //нажатие кнопки - для ввода и перемещенния по результату
    addEvent(el,            this, "keyup",   this.onkeyup,     false)
    //клик вне элемента - закрытие результата поиска
    addEvent(document,      this, "click",   this.onBodyClick, false)
    //обработка нажатия таба для скрытия результатов поиска
    addEvent(document.body, this, "keydown", this.isTab,       false)
    //фокус попадает на элемент ввода
    addEvent(el,            this, "focus",   this.onInputFocus,     false)

    addEvent(el,            this, "blur",   this.onblur,     false)

    addEvent(el,            this, "click",   this.onkeyup,     false)
}
/**
* Установка событий обработки поиска на указанный элемент
*/
TSearch.prototype.init=function() {
    var el = this.inputel = document.getElementById(this.elid)

	var form = el.form;

	// отключаем автозаполнения, и выполняем настройки
    el.setAttribute("autocomplete","off")
    el.codeel          = this
    this.oldtext       = el.value;
    this.inputCSSClass = el.className;

//+++++++++++++++++++++++++++++++++++++++++++

	//обработка указанного элемента - изменение параметра name и отключение автозаполнения
	var name = el.getAttribute('name')

	var showName = name.replace(/^([^\[]+)(.*)$/, '$1_show$2')

	if (!this.sendelName)
		el.setAttribute('name', showName)

	// Создам элемент для хранения выбранного значения поиска
	this.sendel = document.createElement('input');
	this.sendel.type = 'hidden'
	this.sendel.setAttribute('name', this.sendelName ? this.sendelName : name)

	// Устанавливаем отправляемое значение
	this.setSendvalue(el.getAttribute('sendval'));

	form.appendChild(this.sendel);
//+++++++++++++++++++++++++++++++++++++++++++


	//дополнительное поле, в котором хранится количество найденных элементов
    this.resCount = 0

    var newVisEl = null;

    if ((this.otherViselId) && (newVisEl = document.getElementById(this.otherViselId)))
        this.visel = newVisEl;

	// Создаем картинку - прогресс бар
	this.progressBar = new Image();
	this.progressBar.src = this.icons.progressBar;

	var progress = $(this.progressBar)
	progress.insertAfter(this.inputel);
	progress.addClass('qsearchProgressBar');
	progress.css("left", progress.position().left - 30 + "px");

	progress.addClass('qsearchHiddenProgressBar');

	this.setEvents();

}
TSearch.prototype.onblur = function() {
    this.tmpData.seted = false;
    search.canSend = true;

	if ( !this.sendel.value && !this.needSingle )
		this.sendel.value = this.inputel.value
}
// востановление изначального стиля и текста "последнего запроса поиска"
TSearch.prototype.onInputFocus=function() {
    this.inputel.value = this.oldtext
    this.inputel.className = this.inputCSSClass
}
/**
 * обработка нажатия. проверка tab - скрытие результатов поиска
 */
TSearch.prototype.isTab=function(event) {
    if (!this.resDiv) return false
    var code = event.which ? event.which : event.keyCode
    if (code == 9) this.hideResDiv()
    return true;
}
/**
 * закрытие дива с результатами при щелчке мыши.
 */
TSearch.prototype.onBodyClick=function(event) {
    if (!this.resDiv) return false
    this.hideResDiv()
}
// создание дива с информацией
TSearch.prototype.createDataDiv=function() {
    this.visel            = AddElement(document.body,"div","")
    this.visel.className  = 'qsearchDataDiv'
}
/**
 * Создание дива, для отображения результатов поиска
 */
TSearch.prototype.createResDiv=function() {
    if (!this.visel) this.createDataDiv()
    this.resDiv           = AddElement(this.visel,"div","res_"+(this.elid))
    this.resDiv.codeel    = this
    this.resDiv.className = 'qsearchResDiv'
}
/**
 * Отображение дива с результатами
 */
TSearch.prototype.showResDiv=function() {
    if (!this.resDiv) this.createResDiv();

    var coord = getOffset(this.inputel)

    this.setTmpData();

    //установка координат и ширины
    this.visel.style.top   = coord.top + this.inputel.offsetHeight + 'px'
    this.visel.style.left  = coord.left + 'px'
	if (this.autoSize) this.visel.style.width = this.inputel.offsetWidth + 'px'

    this.visel.style.display = ""
}
//скрытие результатов поиска
TSearch.prototype.hideResDiv=function() {
    if (!this.resDiv) this.createResDiv();
    if (this.hideResult)  this.visel.style.display = "none"
}
//очистка результатов поиска
TSearch.prototype.clearResDiv=function() {
    if (!this.visel) this.createDataDiv()
    this.visel.innerHTML = '';
    this.createResDiv();
}
/**
 * Проверяет пустой ли результат поиска
 */
TSearch.prototype.isEmptyRes=function() {
    return (this.searchResult == null) || this.searchResult.length == 0
}
/**
 * Проверяе скрыт ли див с результатами поиска
 */
TSearch.prototype.isHideRes=function() {
    return (!this.visel) || this.visel.style.display == "none"
}
/**
 * Переиещает по результатам поиска
 *
 * @param int step смещение на step элементов
 * @param bool f флаг, запрещающий перескок на другой край результата: переход вврех на первом элементе - кидаем на
 *     последний
 */
TSearch.prototype.move = function(step, f) {
    if (this.isEmptyRes()) return false

    // отображение элемента с результатами
    this.showResDiv();

    if (!this.movedResult) return false;

    if (!this.sendOnSelect) {
        search.canSend = false;
    }
    //search.canSend = false;

    var num = 0
    //подсчет номера элемента, на который осуществляется переход
    if ( this.resDiv.cnum != null ) {
        // если номер задан у результирующего дива выполняем переход
        num = this.resDiv.cnum;
		$(this.resDiv.childNodes[num]).removeClass('selected');

        if ( num + step < 0 ) num = f ? 0 : this.resDiv.childNodes.length - 1;
            else if ( num + step > this.resDiv.childNodes.length - 1 ) num = f ? this.resDiv.childNodes.length - 1 : 0
                 else  num += step;
    }
    else num = (step > 0) ? 0 : this.resDiv.childNodes.length - 1;

    // сохранение номера выбранного элемента
    this.resDiv.cnum = num;

    // подсветка выбранного элемента
	$(this.resDiv.childNodes[num]).addClass('selected');

    // получаем значения позиции скроллинга, высоты дива, отступ выбранного элемента, высоту выбранного элемента
    var sTop  = this.resDiv.scrollTop
    var h     = this.resDiv.offsetHeight
    var elTop = this.resDiv.childNodes[num].offsetTop
    var elH   = this.resDiv.childNodes[num].offsetHeight

    //перемещам позицию скроллинга
    if ((h + sTop < elTop + elH) || (elTop < sTop) )  this.resDiv.scrollTop = elTop - Math.round(h/2)

    this.oldtext = this.inputel.value = this.searchResult[num][2] ? this.searchResult[num][2] : this.searchResult[num][0]

	this.setSendvalue(this.searchResult[num][1])

    return true;
}
/**
 * установка данных выбранного элемента из результата
 *
 * @param int номер выбранного элемента
 * @return bool
 */
TSearch.prototype.setData=function(num) {

    //проверяем правильнось переданного номера
    if ((num == null) || !this.searchResult[num]) return true;

    // установка значений: найденное значени,id записи
    this.inputel.value = this.searchResult[num][2] ? this.searchResult[num][2] : this.searchResult[num][0]

	this.setSendvalue(this.inputel.setedValue = this.searchResult[num][1])

	// Если установлено событие на выбор результата
	if (this.onSelectResult) {

		//Если событие установлено как строка
		if (typeof(this.onSelectResult) === 'string')
			// Вызываем ее через eval
			eval(this.onSelectResult + "('" + this.getSendvalue() + "')");
		else
			// Если событие задано не как строка - работаем с ней как с функцией
			this.onSelectResult( this.getSendvalue() )
	}



    this.hideResDiv()
    this.oldtext = this.inputel.value

	// Снимаем флаг использования временного хранилища
	this.tmpData.seted = false;

	this.setFindResultType(1);

    return false;
}
/**
 * обработка события при "отжатии" кнопки
 */
TSearch.prototype.onkeyup = function(event) {
    // Если скрыта таблица результатов - резрешаем отправлять форму
    if (this.isHideRes()) search.canSend = true;

	// Получаем введенный для поиска текст
    var text = this.inputel.value

	// Если изменился текст
    if (this.oldtext != text) {
		// Устанавливаем передаваемое значение
		this.setSendvalue(this.needSingle ? "" : text)
		// Сбрасываем количество найденных результатов
        this.resCount = 0
    }

	// Если символов меньше минимального требования для поиска
    if (text.length < this.minTextLength) {

		// Очищаем див с результатами
        this.clearResDiv();

		// Скрываем див результатов
        this.hideResDiv();

        this.setFindResultType(0)

		// Сохраняем текст предыдущего нажатия кнопки
        this.oldtext = text

        return false;
    }

	// Если попали сюда - значит строка достаточной для поиска длины

	// хватаем код нажатой кнопки
    var code = event.which ? event.which : event.keyCode

    switch (code) {

        //нажатие page up - перемещение на 10 рузультатов вверх
        case 33:
            this.move(-10, true);
            return true;
			break;

        //нажатие page down - перемещение на 10 рузультатов вниз
        case 34:
            this.move(10, true);
            return true;
			break;

        //нажатие стрелки вврех - перемещение по результату вверх
        case 38:
            this.move(-1);
            return true;
			break;

        //нажатие стрелки вниз - перемещение по результату вниз
        case 40:
            this.move(1);
            return true;
			break;

        // нажатие enter - выбор результата
        case 13:
			try {
				this.setData(this.resDiv.childNodes[this.resDiv.cnum].num);
			}
			catch (e)  {}
            return true
			break;

		// Нажатие ESC - отмена выбора
        case 27 :
			// Восстанавливаем из tmp данные
            this.restoreData();
            this.hideResDiv();
            return true;
			break;
    }

	// на всякий случай отключаем временное хранилище
	this.tmpData.seted = false;

	// Текст пред ввода совпадает с текущим значением - уходим
	if (this.oldtext == text) return false;

	// Дошли до сюда - будем отправлять запрос на получение данных
	this.setSendvalue(this.needSingle ? '' : text)

    this.oldtext = text

	// сбрасываем строку запроса
    this.query = '';

	//
    this.addToQuery('value', text);
    this.addToQuery('db_descript', this.db_descript);
    this.addToQuery('lg', this.lang);
    if (this.query_descript) this.addToQuery('query_descript', this.query_descript);

	for (var i in this.dependence) {
		var dep = this.dependence[i]
		this.addToQuery('dependence['+ (dep.name ? dep.name : dep.search.sendel.name) +']', dep.search.getSendvalue())
	}


	// Временное хранилище значение элемента для зависимости
    var inp = null;
	// Временное хранилище для ID
    var did = '';

	// Перебираем все элементы
    for (var i in this.dependenceElement) {

		// Если не получается элемент - идем к следующему
        if (! (inp = document.getElementById(i))) continue;

        did = 'dependence[' + i + ']'

		// В зависимости от "типа" элемента делаем
        switch (this.dependenceElement[i]) {

			// это чекбокс
            case 'checkbox':
				// если не нажат - идем дальше
                if (!inp.checked) continue;
				// кидаем в качестве зависимости 1
                this.addToQuery(did, 1);
            break;

            default:
				// добавляем в качестве значеняи зависимости значение элемента
                this.addToQuery(did, inp.value);
        }
    }

	$(this.progressBar).removeClass('qsearchHiddenProgressBar');

	// запрос на поучение результатов поиска
    $.ajax({
        url:    this.url,
        data:   this.query,
        cache:  false,
        type:   'GET',
        async:  true,
        search: this,

        dataType: 'json',

        beforeSend: function(XMLHttpRequest){},
        success: function(data){
			$(this.search.progressBar).addClass('qsearchHiddenProgressBar');

            this.search.resultCount = 0;
            this.search.text        = '';

            if (data.resultData) {
                this.search.searchResult = data.resultData;
                if (data.text)        this.search.text        = data.text;
                if (data.resultCount) this.search.resultCount = data.resultCount;

            }
            else this.search.searchResult = data;

            this.search.showQSearchResult();
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {  }
    });

}
TSearch.prototype.doSearch = function() {
    $.ajax({
        url:    this.url,
        data:   this.query,
        cache:  false,
        type:   'GET',
        async:  true,
        search: this,

        dataType: 'json',

        beforeSend: function(XMLHttpRequest){},
        success: function(data){
			$(this.search.progressBar).addClass('qsearchHiddenProgressBar');

            this.search.resultCount = 0;
            this.search.text        = '';

            if (data.resultData) {
                this.search.searchResult = data.resultData;
                if (data.text)        this.search.text        = data.text;
                if (data.resultCount) this.search.resultCount = data.resultCount;

            }
            else this.search.searchResult = data;

            this.search.showQSearchResult();
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {  }
    });
}
/**
 * Восстановление данных из временного хранилища - если при выборе нажали ESC
 */
TSearch.prototype.restoreData = function() {
	// Если не установлен флах сохранения временных данных - уходим
    if (!this.tmpData.seted) return true

	// Получаем выбранный элемент
    num = this.resDiv.cnum;

	// Снимаем выделение с выбранного элемента - это когда перенаправляем вывод результатов и они не скрываются
    if (this.resDiv.childNodes[num]) this.resDiv.childNodes[num].className = ''

	// Убираем текущий выбранный элемент
    this.resDiv.cnum   = null

    this.setSendvalue(this.tmpData.sendval);
	//Восстанавливаем значение
    this.oldtext = this.inputel.value = this.tmpData.eltext;
    this.tmpData.seted = false
}
/**
 * Сохранение временных данных
 */
TSearch.prototype.setTmpData = function() {
    if (this.tmpData.seted) return false;
    this.tmpData.sendval = this.getSendvalue();
    this.tmpData.eltext  = this.inputel.value;
    this.tmpData.seted   = true
}
TSearch.prototype.addToQuery=function(field,value) {
    this.query += (this.query != '' ? '&' : '') + field + '=' + encodeURIComponent(value)
}
/**
 * Отображение результатов поиска
 */
TSearch.prototype.showQSearchResult=function() {
    this.showResDiv();

    switch (this.lang) {
        case 'en':text = 'Sorry, nothing was found';break;
        default:text = 'По вашему запросу ничего не найдено';
    }


    if (this.searchResult.length < 1) {
        this.resCount = 0
        this.clearResDiv();
        var el = AddElement(this.resDiv,"div","")

        el.innerHTML = this.showNullResultText ? text : '';
        this.setFindResultType(0);
        return false;
    }

    this.resToDiv()
    return true
}
/**
 * Формирвоание дива с результатами
 */
TSearch.prototype.resToDiv = function() {
	var me = this

    this.clearResDiv();
    this.resCount = this.searchResult.length;

    // найдено одно значение - сразу сохраняем найденное значение
    if (this.searchResult.length == 1) {

		this.setSendvalue(this.needSingle ? this.searchResult[0][1] : this.inputel.value)

        if (this.inputel.setedValue != this.getSendvalue()) this.setFindResultType(1);
        this.inputel.setedValue = this.getSendvalue();
    }

    //получение типа результата
    var find_type = this.searchResult.length > 2 ? 2 : this.searchResult.length;

    // проверка изменения типа результата. установка измененного значения
    if (find_type != this.findResultType) this.setFindResultType(find_type);

    //формирование результатов поиска
    for (var i = 0; i < this.searchResult.length; i++) {

        var el = AddElement(this.resDiv,"div","")

        //установка значений для элемента в результатах
        el.innerHTML = this.searchResult[i][0];
        el.num       = i

        if (this.clickableResult)
            el.onclick   = function() {
                me.setData(this.num)
            }

        // установка события, которое осуществляет подсветку элемента при попадании на него мыши
        if (this.movedResult)
            el.onmouseover = function()
            {
                if (this.parentNode.cnum !=null)
                    $(this.parentNode.childNodes[this.parentNode.cnum]).removeClass('selected');
					//.className = ''
                //this.className = 'selected'
				$(this).addClass('selected');
                this.parentNode.cnum = this.num
            }

		if (i % 2) {
			$(el).addClass('odd');
		}
		//el.className = i % 2 ? 'odd' : '';
    }

    //создание элемента с тексом
    if (this.text) {
        el = AddElement(this.visel,"div","");
        el.innerHTML   = this.text;
        el.className   = 'data'
    }

    this.resDiv.scrollTop   = 0;
}
/**
 Установка типа результата, вызов соответствующего "события"
 */
TSearch.prototype.setFindResultType = function(type) {

    var func = '';
    this.findResultType = type
    switch (this.findResultType) {
        case 0:func = this.onUnSingleFindResult; break;
        case 1:func = this.onSingleFindResult;   break;
        case 2:func = this.onUnSingleFindResult; break;
        default:break;
    }

	// Если найдено событие, которое требуется выполнить
    if (func) {
		if (typeof(func) === 'string')
			eval(func + "('" + this.getSendvalue() + "')");
		else
			func(this.getSendvalue());
	}
}
/**
 * Установка класса поиска, резыльтат которого будет учтен при данном поиске
 *
 * @param TSearch search класс поиска
 * @param string name имя, которое будет передаваться в качестве имени зависимости
 */
TSearch.prototype.setDependence = function(search, name) {
	this.dependence.push({search:search, name:name})
}
/**
 * установка свойства необходимости выбора конкретного значения
 */
TSearch.prototype.needSingleResult = function(need) {
    this.needSingle = need ? true : false;
}
/**
 * Добавление элемента формы в зависимость
 * @param elid string Идешник элемента
 * @param type string Тип элемента
 */
TSearch.prototype.addElementToDependence = function(elid,type) {
    this.dependenceElement[elid] = type
}
/**
 * Установка ид элемента, на который будет перенаправлен вывод данных
 * @param elid string идентификатор дива
 */
TSearch.prototype.setResultElement = function(elid) {
    var newVisEl;
    //проверяем существование элемента
    if (newVisEl = document.getElementById(elid)) {
        //очищаем старый элемент вывода
        if (this.visel) {
            this.visel.parentNode.removeChild(this.visel);
        }
        this.resDiv = null

        //устанавливаем ссылку на новый элемент
        this.visel = newVisEl;
    }
    this.otherViselId = elid
}
/**
 * установка настроек, если поиск выполняет функцию проверки на уникальность ввода
 * @param string|HTMLNode elid элемент, в который перенаправляем вывод
 * @param string icoiт  картинка, отвечающая за статус поиска
 */
TSearch.prototype.setCheckOptions = function(elid, icoid) {
    //изменяем элемент вывода
    this.setResultElement(elid)

    //отключаем флаги: кликабельности результатов, автоскрытия и авторазмера, показ ошибки
    this.clickableResult    = false;
    this.hideResult         = false;
    this.autoSize           = false;
    this.showNullResultText = false;
    this.movedResult        = false;

    this.needSingleResult(false);

    //если задана иконка устанавливаем требуемые значения, для ее смены в зависимости от результата
    if (icoid) {
        this.statusIcon = icoid
        this.onSingleFindResult = this.onUnSingleFindResult = 'this.setStatusIcon'
    }
}
/**
 * Устанавливает иконку
 */
TSearch.prototype.setStatusIcon = function() {

    var ico = document.getElementById(this.statusIcon);

    if (!ico) return false;

    if (this.inputel.value.length < this.minTextLength) {
        ico.src = this.icons.defaultIcon;
        return true;
    }

    switch (this.findResultType) {
        case 0:ico.src = this.icons.notFound;break
        case 1:ico.src = this.icons.singleFound;break;
        case 2:ico.src = this.icons.multyFound;break;
        default:break;
    }
    //alert(ico.src);
}
//Контейнер поисковых классов
function TSearchContainer() {
    //ключ возможности отправки формы
    this.canSend  = true;
    //массив поисковых классов
    this.searches = new Array();
    //последний инициализированный поиск
    this.lastInit = -1;
    addEvent(window,this,"load",this.init,false)
}
/**
 * добавляем поиск в контейнер
 */
TSearchContainer.prototype.add = function(id, db_descript, query_descript, lang) {
    var el = new TSearch(id, db_descript, query_descript ? query_descript : "", lang);
    this.searches.push(el);
    return el;
}
TSearchContainer.prototype.init = function() {
    if (!this.searches.length) return false;

    var lastNum = this.lastInit;

    for (i = this.lastInit + 1; i <= this.searches.length - 1; i++) {
        this.searches[i].init()
        lastNum = i;
    }

    this.lastInit = lastNum;

    var form        = this.searches[lastNum].inputel.form;
    if (this.onsubmit != form.onsubmit) this.formsubmit = form.onsubmit
    form.onsubmit   = this.onsubmit;
    form.search     = this

}
TSearchContainer.prototype.onsubmit = function() {
    if (!this.search.canSend) return false;

	for (var i in this.search.searches) {
		//alert(i)
		this.search.searches[i].onblur();
	}

    if (this.search.formsubmit) this.search.formsubmit();
    return true;
}
search = new TSearchContainer();
/** Конец - qsearch1-5.js */


/**
 * Проверяет, является ли телефоном устройство, с которого просматривается страница
 */
function isMobile() {
//    return (/android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(navigator.userAgent.toLowerCase()));

    var isMobile = {
        Android: function() {
            return navigator.userAgent.match(/Android/i);
        },
        BlackBerry: function() {
            return navigator.userAgent.match(/BlackBerry/i);
        },
        iOS: function() {
            return navigator.userAgent.match(/iPhone|iPad|iPod/i);
        },
        Opera: function() {
            return navigator.userAgent.match(/Opera Mini/i);
        },
        Windows: function() {
            return navigator.userAgent.match(/IEMobile/i);
        },
        any: function() {
            return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows() || /webos/i.test(navigator.userAgent.toLowerCase()));
        }
    };

    return isMobile;
}

/**
 * Поддерживает форматы PHP: H, i, Y, y, m, d
 *
 * @param date Date
 * @param format
 */
function getFormattedDate(date, format) {
    var Y, y, m, d, H, i;

    Y = date.getFullYear();
    y = String(Y).substr(2, 2);
    m = ('0' + (date.getMonth() + 1)).slice(-2);
    d = ('0' + date.getDate()).slice(-2);
    H = ('0' + date.getHours()).slice(-2);
    i = ('0' + date.getMinutes()).slice(-2);

    var formattedDate = format.replace(/Y/g, Y)
        .replace(/Y/g, Y)
        .replace(/y/g, y)
        .replace(/m/g, m)
        .replace(/d/g, d)
        .replace(/H/g, H)
        .replace(/i/g, i);

    return formattedDate;
}

function makeOptions (options, selectedKey) {
    var opts = '';
    Object.keys(options).forEach(function(key) {
        if (selectedKey === key) {
            opts += "<option selected value='" + key + "'>" + options[key] + "</option>";
        } else {
            opts += "<option value='" + key + "'>" + options[key] + "</option>";
        }
    });

    return opts;
}


function disableByFlag ( flag, selector ) {
    if (flag) {
        selector.attr('disabled', 'disabled');
    } else {
        selector.removeAttr('disabled');
    }
}

function preventConfirm (message, event) {
    if ( ! confirm(message)) {
        event.preventDefault();
    }
}


function initRangeCalendars ($start, $end, yearsPrev, endlessSyncedStartCalendar) {
    var startCalendar = new Calendar($start.get(0));
    var stopCalendar  = new Calendar($end.get(0));

    stopCalendar.setOption('disableDatesBefore', startCalendar.getDate());

    if (!endlessSyncedStartCalendar) {
        startCalendar.setOption('disableDatesAfter', stopCalendar.getDate());
    }

    if (yearsPrev) {
        startCalendar.setOption("dYearPrev", yearsPrev);
        stopCalendar.setOption("dYearPrev", yearsPrev);
    }

    startCalendar.onchange = function () {
        if (endlessSyncedStartCalendar) {
            if (startCalendar.getDate('Ymd') > stopCalendar.getDate('Ymd')) {
                stopCalendar.setDate(startCalendar.getDate());
            }
        }

        stopCalendar.setOption('disableDatesBefore', startCalendar.getDate());
    };
    stopCalendar.onchange  = function () {
        if (endlessSyncedStartCalendar) {
            if (startCalendar.getDate('Ymd') > stopCalendar.getDate('Ymd')) {
                startCalendar.setDate(stopCalendar.getDate());
            }
        }
        else {
            startCalendar.setOption('disableDatesAfter', stopCalendar.getDate());
        }
    };
}

function initTabs (tabsId, activeTabId, activatedCallback) {
    var activeTabIdSelector = '#' + activeTabId;

    activatedCallback = activatedCallback || function (arg) {};

    setActiveTabClass(activeTabIdSelector);
    activatedCallback(activeTabIdSelector.slice(1));

    function setActiveTabClass (idSelector) {
        $('#'+ tabsId).find('a[href="' + idSelector + '"]').parent().addClass('active');
        $(idSelector).addClass('active');
    }

    function unsetActivateTabClass (idSelector) {
        $('#'+ tabsId).find('a[href="' + activeTabIdSelector + '"]').parent().removeClass('active');
        $(idSelector).removeClass('active')
    }

    $('#' + tabsId + ' .tab-link-bvk' + ' a').click(function (event) {
        event.preventDefault();

        var newActiveTabIdSelector = $(this).attr('href');

        if (newActiveTabIdSelector !== activeTabIdSelector) {
            unsetActivateTabClass(activeTabIdSelector);
            setActiveTabClass(newActiveTabIdSelector);
            activatedCallback(newActiveTabIdSelector.slice(1));

            activeTabIdSelector = newActiveTabIdSelector;
        }
    });
}

(function ($) {
	$(document).ready(function () {
		/**  hr **/
		$('hr').each(function () {
			$(this).replaceWith('<div style="clear: both; overflow: hidden;"><div class="hr' + (this.className ? ' ' + this.className : '') + '"><div></div></div></div>');
		});
		/**  /hr **/


		/** reviews-block **/
		function setHeightReviewsElements() {
			var maxHeight = 0;
			$('.reviews-block .text').each(function (i) {
				var $this = $(this);
				var height = $this.height();
				if (maxHeight < height) {
					maxHeight = height;
				}
			});
			$('.reviews-block .text').each(function (i) {
				var $this = $(this);
				var height = $this.height();
				var paddingTop = parseInt((maxHeight - height) / 2);
				$this.css({
					'padding-top': paddingTop + 'px',
					'padding-bottom': (maxHeight - height - paddingTop) + 'px'
				});
			});
			var maxHeight = 0;
			$('.reviews-block .name-block').each(function (i) {
				var $this = $(this);
				var height = $this.height();
				if (maxHeight < height) {
					maxHeight = height;
				}
			});
			$('.reviews-block .name-block').each(function (i) {
				var $this = $(this);
				var height = $this.height();
				var paddingTop = parseInt((maxHeight - height) / 2);
				$this.css({
					'padding-top': paddingTop + 'px',
					'padding-bottom': (maxHeight - height - paddingTop) + 'px'
				});
			});
		}

		setHeightReviewsElements();
		/** /reviews-block **/

		
		/** main-search-block **/
		//-// выбор количества

		//-//-// чекбоксы
		$('.select-people-block label.btn:has(input[type=checkbox]), .select-people-block label.btn:has(input[type=radio])').on('click', function () {
			var $this = $(this);
			var value = $this.find('input').val();
			var $parent = $this.parents('li');
			var valueField = $parent.find('input[type=hidden]').eq(0);

			// обнуление других вариантов выбора значения - либо выпадающего списка, либо поля ввода
			$parent.find('div, input[type=text], .more-button').removeClass('active');

			if ($this.hasClass('active')) {

				// обнуление radio-buttons
				$this.removeClass('active');
				$this.find('input').attr('checked', false);
				valueField.val(0); // передаваемое значение

				return false;
			}
			else {
				valueField.val(value); // передаваемое значение
			}
		});
		//-//-// /чекбоксы

		//-//-// выпадающие списки
		$('.select-people-block .dropdown-menu a').on('click', function () {
			var $this = $(this);
			var $parent = $this.parents('li');
			var value = $this.text();
			var valueField = $parent.find('input[type=hidden]').eq(0);
			var displayedTag = $parent.find('.number-text').eq(0);

			// обнуление radio-buttons
			var labelList = $parent.find('label.btn').removeClass('active');
			$parent.find('input[type=radio],input[type=checkbox]').attr('checked', false);

			// внешний вид
			$this.parents('.dropdown').eq(0).find('.more-button').addClass('active');
			valueField.val(value); // передаваемое значение
			displayedTag.html(value);

		});
		//-//-// /выпадающие списки
		/** /main-search-block **/


		/** DatePicker **/
		$.datepicker.regional['ru'] = {
			closeText: 'Закрыть',
			prevText: '<Пред',
			nextText: 'След>',
			currentText: 'Сегодня',
			monthNames: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
				'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'],
			monthNamesShort: ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн',
				'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'],
			dayNames: ['воскресенье', 'понедельник', 'вторник', 'среда', 'четверг', 'пятница', 'суббота'],
			dayNamesShort: ['вск', 'пнд', 'втр', 'срд', 'чтв', 'птн', 'сбт'],
			dayNamesMin: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
			weekHeader: 'Не',
			dateFormat: 'dd.mm.yy',
			firstDay: 1,
			isRTL: false,
			showMonthAfterYear: false,
			numberOfMonths: 3,
			showCurrentAtPos: 0,
			yearSuffix: ''
		};
		$.datepicker.regional['en'] = {
			dateFormat: 'dd.mm.yy',
			firstDay: 1,
			isRTL: false,
			showMonthAfterYear: false,
			numberOfMonths: 3,
			showCurrentAtPos: 0,
			yearSuffix: ''
		};
		$.datepicker.setDefaults($.datepicker.regional[Lang]);
                              
		$('input.date').each(function(i,el){
                    var name = $(el).attr('name');
                    var val  = new Date($(el).val());
                    var uniqId = parseInt(Math.random()*Math.pow(10,10));
                    $(el).removeAttr('name');
                    $(el).attr('data-datepickerFor', name);
                    $(el).after('<input class="hidden" name="'+name+'"" value="'+val+'" id="'+uniqId+'">');                   
                    $(el).datepicker({
                        dateFormat: 'd M yy',
                        altField: "#"+uniqId,
                        altFormat: "yy-mm-dd",
                        onSelect:function(){
                            $("#"+uniqId).trigger('change');
                        }
                    }).datepicker('setDate', val);
                    
                });
		/** /DatePicker **/

		/** HeartIcon **/
		$('.heart').on('click', function () {
			$(this).toggleClass('heart-active');
			return false;
		});
		/** /HeartIcon **/
		
		/** ShowHideFilter **/
		$('.show-hide-filter').on('click', function () {
			var $this = $(this);
			if ($this.find('.hide-link').hasClass('active-link')) {
				$('.filter-block').hide();
				$this.find('.hide-link').removeClass('active-link');
				$this.find('.show-link').addClass('active-link');
			}
			else {
				$('.filter-block').show();
				$this.find('.show-link').removeClass('active-link');
				$this.find('.hide-link').addClass('active-link');
			}
			return false;
		});
		/** /ShowHideFilter **/

		/** SubmitForms **/
		function initSubmitForm() {
			$(".modal-body form").each(function () {
				var $form = $(this);
				if (!$form.attr('init')) {
					$form.attr('init', 1);

					$form.validationEngine('attach', {
						bindMethod: "live",
						scroll: false,
						lang: 'ru',
						language: 'ru'
					});
				}
			});
		}

		initSubmitForm();
		/** /SubmitForms **/


		/** windows **/
		$(window).resize(function () {
			setHeightReviewsElements();
		}).scroll(function () {
			setHeightReviewsElements();
		}).on('load', function () {
			setHeightReviewsElements();
		});
		/** /windows **/
                
                // MainSearchBlock show blank-block
		$('.main-search-block .selected-params-block a').on('click', function () {
			var $this = $(this);
			var $searchBlock = $this.parents('.main-search-block').eq(0);
			$searchBlock.find('.selected-params-block').hide();
			$searchBlock.find('.blank-block').removeClass('hide');
                        var focus = $this.data('focus');
                        
                        if (focus === 'sd' || focus === 'ed'){
                            $('[data-datepickerfor=sd]').datepicker('show');
                        }else{
                            $('#'+focus).focus();
                            $('#'+focus).select();
                        }
		});
		// /MainSearchBlock show blank-block

	});
})(jQuery);
