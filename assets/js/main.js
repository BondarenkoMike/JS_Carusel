//const { Exception } = require("sass");
console.log('Sample JavaScript #6 HW #18.');

function Carusel() {
  this.defaultOptions = {
    isPlaying: true,
    timeOut: 1000,
    slideChangeEffect: null, // пока не реализовано
    slidesCount: 2,
    startSlideNum: 0, //0-based

    displayElements: {
      controls: true,
      indicators: true
    },
    handleEvents: {
      mouse: true,
      kbd: true,
      swipe: true
    }
  }

  this.container = document.getElementById('carousel');
  this.timerID = null;
  this.options;

  this.KEYCODE_ARROW_LEFT = 'ArrowLeft'
  this.KEYCODE_ARROW_RIGHT = 'ArrowRight'
  this.KEYCODE_SPACE = 'Space'

  this.prevIndicator = null;
  this.swipeStartX, this.swipeStartY, this.swipeEndX, this.swipeEndY;
  this.slides;
  this.indicators;
  this.controls;


  this.timeOut;
  this.slidesCount
  this.isPlaying;
  this.currentSlide;

  this.pauseButton;
  this.prevButton;
  this.nextButton;
  this.slider;
}

Carusel.prototype = {


  init: function (sliderOptions) {

    this.options = { ...this.defaultOptions, ...sliderOptions }
    console.log(this.options);

    this.isPlaying = this.options.isPlaying;
    this.timeOut = this.options.timeOut;
    this.slidesCount = this.options.slidesCount;
    this.currentSlide = this.options.startSlideNum;

    this._createStructure(this.options);
    console.log([this.isPlaying, this.timeOut, this.slidesCount, this.currentSlide]);


    if (this.isPlaying) {
      this._gotoSlide(this.currentSlide);
      this._playSlideShow();
    }
    else this._pauseSlideShow();
  },
  /**
   * Переход к следующему слайду
   */
  nextSlide: function () {
    this._gotoSlide(+this.currentSlide + 1);
  },

  /**
   * Переход к предыдущему слайду
   */
  prevSlide: function () {
    this._gotoSlide(+this.currentSlide - 1);
  },


  /**
     * Переход к слайду с определённым номером
     * @param slideNum : номер слайда оторый будет сделан активным
     */
  _gotoSlide: function (slideNum) {
    if ((slideNum > this.slides.length) || !isFinite(slideNum)) {
      throw Error("Значение параметр slideNum не является корректным номером слайда")
    }

    this.slides[this.currentSlide].classList.toggle('slide-active');
    this.currentSlide = (slideNum + this.slidesCount) % this.slidesCount;
    this.slides[this.currentSlide].classList.toggle('slide-active');

    this.prevIndicator = this.container.querySelector('.indicators__item-active');
    if (this.prevIndicator !== null) {
      this.prevIndicator.classList.remove('indicators__item-active');
    }
    this.prevIndicator = document.querySelector(`.indicators__item[data-slide-to='${this.currentSlide}']`);
    this.prevIndicator.classList.add('indicators__item-active');
  },



  /***
    * Создание элемента управления
    */
  _createFaElement: function (fa_class) {
    let i = document.createElement('i')
    i.classList.add('fas');
    i.classList.add(fa_class);
    return i.outerHTML;
  },
  /**
   * Запуск слайдшоу
   */
  _playSlideShow: function () {
    if (!this.timerID) {
      this.timerID = setInterval(this.nextSlide.bind(this), this.timeOut);
    }
    this.isPlaying = true;
    this.pauseButton.innerHTML = this._createFaElement('fa-pause');
  },

  /**
   * Остановка слайдшоу. Пауза.
   */
  _pauseSlideShow: function () {
    clearInterval(this.timerID);
    this.timerID = null;
    this.isPlaying = false;
    this.pauseButton.innerHTML = this._createFaElement('fa-play');
  },

  /**
      * Обработчик нажатия на индикатор слайда. Переход к соответствующему слайду.  
      * 
      * @param e Событие родительского элемента индикаторов
      */
  _indicatorsClick: function (e) {
    let target = e.target;

    if (target.classList.contains('indicators__item')) {
      this._gotoSlide(parseInt(target.getAttribute("data-slide-to")));
      this._pauseSlideShow();
    }
  },
  /**
   * Обработчик для кнопки "Next"
   */
  _nextSlideHandler: function () {
    this.nextSlide();
    this._pauseSlideShow();
  },

  /**
   * Обработчик для кнопки "Prev"
   */
  _prevSlideHandler: function () {
    this.prevSlide();
    this._pauseSlideShow();
  },
  /**
   * Обработчик для кнопки "Play/Pause"
   */
  startStopHandler: function () {
    if (this.isPlaying) {
      this._pauseSlideShow();
    }
    else {
      this._playSlideShow();
    }
  },
  /**
   * Назначение обраотчиков событий
   */
  _setupListeners: function () {
    this.indicators = this.container.querySelector('div.indicators');
    if (this.indicators) {
      this.indicators.addEventListener('click', this._indicatorsClick.bind(this));
    }
    if (this.options.displayElements.controls === true) {
      this.pauseButton.addEventListener('click', this.startStopHandler.bind(this));
      this.nextButton.addEventListener('click', this._nextSlideHandler.bind(this));
      this.prevButton.addEventListener('click', this._prevSlideHandler.bind(this));
    }
    if (this.options.handleEvents.mouse === true) {
      this.slider.addEventListener('mouseout', this._mouseoutHandler.bind(this)); // let wasPlaying =options.isPlaying;
      this.slider.addEventListener('mouseover', this._mouseoverHandler.bind(this)); //pauseSlideShow
    }

    if (this.options.handleEvents.kbd === true) {
      document.addEventListener('keydown', this._keyPressed.bind(this)); // let wasPlaying =options.isPlaying;    
    }

    if (this.options.handleEvents.swipe) {
      this.slider.addEventListener('touchstart', this._swipeStart.bind(this)); // let wasPlaying =options.isPlaying;
      this.slider.addEventListener('touchend', this._swipeEnd.bind(this)); //pauseSlideShow  }
    }
  },

  _swipeStart: function (ev) {
    this.swipeStartX = this.swipeEndX = ev.targetTouches[0].clientX;
    this.swipeStartY = this.swipeEndY = ev.targetTouches[0].clientY;
    this.swipeEndX = this.swipeStartX;
    this.swipeEndY = this.swipeStartY;
  },

  _swipeEnd: function (ev) {
    this.swipeEndX = ev.changedTouches[0].clientX;
    this.swipeEndY = ev.changedTouches[0].clientY;
    if (Math.abs(this.swipeStartX - this.swipeEndX) > 10) {
      if (this.swipeStartX > this.swipeEndX) this.nextSlide(); else this.prevSlide();
    }
    if (this.isPlaying) {
      this._pauseSlideShow();
    }
  },

  /**
     * Обработчик события когда указатель мыши покидает слайдер. 
     */
  _mouseoutHandler: function () {
    if (this.wasPlaying_beforeMouseOver) this._playSlideShow();
  },

  /**
   * Обработчик события когда указатель мыши проходит над слайдером. 
   */
  _mouseoverHandler: function () {
    this.wasPlaying_beforeMouseOver = this.isPlaying;
    if (this.wasPlaying_beforeMouseOver) {
      this._pauseSlideShow();
    }
  },
  /**
   * Обработчик управления слайдером с клавиатуры
   */
  _keyPressed: function (e) {
    if (this.options.handleEvents.kbd === true) {
      switch (e.code) {
        case this.KEYCODE_ARROW_LEFT:
          {
            this.prevSlide();
            this._pauseSlideShow();
            break;
          }
        case this.KEYCODE_ARROW_RIGHT:
          {
            this.nextSlide();
            this._pauseSlideShow();
            break;
          }
        case this.KEYCODE_SPACE:
          {
            this.startStopHandler();
            break;
          }
      }
    }
  },
  /**
     * Создание разметки слайдера
     */
  _createStructure: function (options = null) {
    this.options = options;
    // this.container = document;
    if (!this.container) {
      throw Error('Не найден элемент с id ="carousel"');
    }

    let slide;
    let indicator;
    let a;

    this.slidesCount = this.options ? this.options.slidesCount : 0;
    this.slider = document.createElement('ul');
    this.slider.classList.add('slides');

    if (this.options.displayElements.indicators === true) {
      this.indicators = document.createElement('div');
      this.indicators.classList.add('indicators');
    }

    if (this.options.displayElements.controls === true) {
      this.controls = document.createElement('div');
      this.controls.classList.add('controls');
    }

    // Creating slides and indicators
    for (let iSlide = 0; iSlide < this.slidesCount; iSlide++) {
      slide = document.createElement('li');
      indicator = document.createElement('span');
      a = document.createElement('a');
      a.setAttribute('href', '#');
      a.setAttribute('class', 'slides__item-link');
      a.innerHTML = 'slide №' + (iSlide + 1).toString();

      slide.classList.add('slide');
      slide.appendChild(a);
      this.slider.appendChild(slide);
      if (iSlide === this.options.startSlideNum) {
        slide.classList.add('slide-active');
        this.prevIndicator = indicator;
      }

      if (this.options.displayElements.indicators === true) {
        indicator.classList.add('indicators__item');
        indicator.setAttribute('data-slide-to', iSlide);
        this.indicators.appendChild(indicator);
      }
    }

    // Controls
    let control = null;

    if (this.options.displayElements.controls === true) {
      const sc = {
        'controls__prev': 'fas fa-chevron-left',
        'controls__next': 'fas fa-chevron-right',
        'controls__pause': 'fas fa-pause'
      };

      for (const [attrKey, attrValue] of Object.entries(sc)) {
        control = document.createElement('div');
        control.setAttribute('class', 'controls__item ' + attrKey);
        i = document.createElement('i');
        i.setAttribute('class', attrValue);
        control.appendChild(i);
        this.controls.appendChild(control);
      };
    }

    let caruselWrapper = document.createElement('div');
    caruselWrapper.setAttribute('class', 'carousel__container');
    let slidersWrapper = document.createElement('div');
    slidersWrapper.setAttribute('class', 'slides__container');
    caruselWrapper.appendChild(slidersWrapper);

    this.container.appendChild(caruselWrapper);
    slidersWrapper.appendChild(this.slider);
    if (this.options.displayElements.indicators) {
      caruselWrapper.appendChild(this.indicators);
    }
    if (this.options.displayElements.controls) {
      caruselWrapper.appendChild(this.controls);
      this.pauseButton = this.container.querySelector('.controls__pause');
      this.pauseButton.setAttribute('id', 'pause');

      this.nextButton = this.container.querySelector('.controls__next');
      this.nextButton.setAttribute('id', 'next');

      this.prevButton = this.container.querySelector('.controls__prev');
      this.prevButton.setAttribute('id', 'prev');
    }
    this.slides = this.container.querySelectorAll('.slide');
    this._setupListeners();
  }
}


const carusel = new Carusel()
carusel.init({
  isPlaying: true,
  timeOut: 1000,
  slideChangeEffect: null, // пока не реализовано
  slidesCount: 6,
  startSlideNum: 0, //0-based

  displayElements: {
    controls: true,
    indicators: true
  },
  handleEvents: {
    mouse: true,
    kbd: true,
    swipe: true
  }
});

// console.log(carusel)

