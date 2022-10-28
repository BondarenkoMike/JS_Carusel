console.log('Sample JavaScript #6 HW #18.');

function Carousel() {
  this.defaultOptions = {
    carouselID: 'carousel',
    slideClass: 'slide',
    timeOut: 1000,
    isPlaying: true,
    slideChangeEffect: null, // не реализовано
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
  this.options;
  this.container;
  this.timerID = null;

  this.KEYCODE_ARROW_LEFT = 'ArrowLeft'
  this.KEYCODE_ARROW_RIGHT = 'ArrowRight'
  this.KEYCODE_SPACE = 'Space'

  this.prevIndicator = null;
  this.slides;
  this.indicators;
  this.controls;

  this.pauseButton;
  this.prevButton;
  this.nextButton;
  this.slider;
}

Carousel.prototype = {
  /**
   * Инициализация переменных функции из полученных настроек
   */
  _initProps() {
    this.container = document.getElementById(this.options.carouselID);
    this.isPlaying = this.options.isPlaying;
    this.timeOut = this.options.timeOut;
    this.currentSlide = this.options.startSlideNum;
  },

  init(sliderOptions) {
    this.options = { ...this.defaultOptions, ...sliderOptions };
    this._initProps();
    this._createStructure();
    this._gotoSlide(this.currentSlide);

    if (this.isPlaying) {
      this.playSlideShow();
    }
    else this.pauseSlideShow();
  },

  /**
   * Переход к следующему слайду
   */
  _nextSlide() {
    this._gotoSlide(+this.currentSlide + 1);
  },

  /**
   * Переход к предыдущему слайду
   */
  _prevSlide() {
    this._gotoSlide(+this.currentSlide - 1);
  },


  /**
   * Переход к слайду с определённым номером
   * @param slideNum : номер слайда оторый будет сделан активным
   */
  _gotoSlide(slideNum) {
    if ((0 > this.slides.length) || (slideNum > this.slides.length) || !isFinite(slideNum)) {
      throw Error("Значение параметр slideNum не является корректным номером слайда")
    }

    this.slides[this.currentSlide].classList.toggle('slide-active');
    this.currentSlide = (slideNum + this.options.slidesCount) % this.options.slidesCount;
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
  _createFaElement(fa_class) {
    let i = document.createElement('i')
    i.classList.add('fas');
    i.classList.add(fa_class);
    return i.outerHTML;
  },

  /**
   * Запуск слайдшоу
   */
  playSlideShow() {
    if (!this.timerID) {
      this.timerID = setInterval(this._nextSlide.bind(this), this.timeOut);
    }
    this.isPlaying = true;
    this.pauseButton.innerHTML = this._createFaElement('fa-pause');
  },

  /**
   * Остановка слайдшоу. Пауза.
   */
  pauseSlideShow() {
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
  _indicatorsClick(e) {
    let target = e.target;

    if (target.classList.contains('indicators__item')) {
      this._gotoSlide(parseInt(target.dataset.slideTo));
      this.pauseSlideShow();
    }
  },
  /**
   * Обработчик для кнопки "Next"
   */
  _nextSlideHandler() {
    this._nextSlide();
    this.pauseSlideShow();
  },

  /**
   * Обработчик для кнопки "Prev"
   */
  _prevSlideHandler() {
    this._prevSlide();
    this.pauseSlideShow();
  },
  /**
   * Обработчик для кнопки "Play/Pause"
   */
  _startStopHandler() {
    if (this.isPlaying) {
      this.pauseSlideShow();
    }
    else {
      this.playSlideShow();
    }
  },
  /**
   * Назначение обраотчиков событий
   */
  _setupListeners() {
    this.indicators = this.container.querySelector('div.indicators');
    if (this.indicators) {
      this.indicators.addEventListener('click', this._indicatorsClick.bind(this));
    }
    if (this.options.displayElements.controls === true) {
      this.pauseButton.addEventListener('click', this._startStopHandler.bind(this));
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

  },

  /**
     * Обработчик события когда указатель мыши покидает слайдер. 
     */
  _mouseoutHandler() {
    if (this.wasPlaying_beforeMouseOver) this.playSlideShow();
  },

  /**
   * Обработчик события когда указатель мыши проходит над слайдером. 
   */
  _mouseoverHandler() {
    this.wasPlaying_beforeMouseOver = this.isPlaying;
    if (this.wasPlaying_beforeMouseOver) {
      this.pauseSlideShow();
    }
  },
  /**
   * Обработчик управления слайдером с клавиатуры
   */
  _keyPressed(e) {
    if (this.options.handleEvents.kbd === true) {
      switch (e.code) {
        case this.KEYCODE_ARROW_LEFT:
          {
            this._prevSlide();
            this.pauseSlideShow();
            break;
          }
        case this.KEYCODE_ARROW_RIGHT:
          {
            this._nextSlide();
            this.pauseSlideShow();
            break;
          }
        case this.KEYCODE_SPACE:
          {
            this._startStopHandler();
            break;
          }
      }
    }
  },
  /**
     * Создание разметки слайдера
     */
  _createStructure() {
    //    this.options = options;  
    if (!this.container) {
      throw Error(`Не найден элемент с id ="${this.options.carouselID}"`);
    }

    let slide;
    let indicator;
    let a;

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
    for (let iSlide = 0; iSlide < this.options.slidesCount; iSlide++) {
      slide = document.createElement('li');
      indicator = document.createElement('span');
      a = document.createElement('a');
      a.setAttribute('href', '#');
      a.setAttribute('class', 'slides__item-link');
      a.innerHTML = 'slide №' + (iSlide + 1).toString();

      slide.classList.add(this.options.slideClass);
      slide.appendChild(a);
      this.slider.appendChild(slide);
      if (iSlide === this.options.startSlideNum) {
        slide.classList.add('slide-active');
        this.prevIndicator = indicator;
      }

      if (this.options.displayElements.indicators === true) {
        indicator.classList.add('indicators__item');
        indicator.dataset.slideTo = iSlide;
        this.indicators.appendChild(indicator);
      }
    }

    // Controls
    let control = i = null;
    let caruselWrapper = document.createElement('div');
    let slidersWrapper = document.createElement('div');

    caruselWrapper.setAttribute('class', 'carousel__container');
    slidersWrapper.setAttribute('class', 'slides__container');
    caruselWrapper.appendChild(slidersWrapper);
    this.container.appendChild(caruselWrapper);
    slidersWrapper.appendChild(this.slider);

    if (this.options.displayElements.indicators === true) {
      caruselWrapper.appendChild(this.indicators);
    }

    if (this.options.displayElements.controls === true) {
      const controlsAttr = [
        { id: 'prev', cls: 'controls__prev', intElemCls: 'fa-chevron-left' },
        { id: 'next', cls: 'controls__next', intElemCls: 'fa-chevron-right' },
        { id: 'pause', cls: 'controls__pause', intElemCls: 'fa-pause' }
      ];
      for (const attrValues of controlsAttr) {
        control = document.createElement('div');
        control.setAttribute('id', attrValues.id);
        control.setAttribute('class', 'controls__item ' + attrValues.cls);
        control.innerHTML = this._createFaElement(attrValues.intElemCls)
        this.controls.appendChild(control);
      }

      caruselWrapper.appendChild(this.controls);
      this.pauseButton = this.container.querySelector('.controls__pause');
      this.nextButton = this.container.querySelector('.controls__next');
      this.prevButton = this.container.querySelector('.controls__prev');
    }
    this.slides = this.container.querySelectorAll('.' + this.options.slideClass);
    this._setupListeners();
  }
};
Carousel.prototype.constructor = Carousel;