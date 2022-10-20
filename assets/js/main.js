//const { Exception } = require("sass");
(function () {
  let options;
  const KEYCODE_ARROW_LEFT = 'ArrowLeft'
  const KEYCODE_ARROW_RIGHT = 'ArrowRight'
  const KEYCODE_SPACE = 'Space'

  console.log('Sample JavaScript #6 HW #18.');
  let prevIndicator = null;
  let timerID = null;
  let i = 0;
  let swipeStartX, swipeStartY, swipeEndX, swipeEndY
  //let wasPlaying_beforeMouseOver = options.isPlaying;
  let slides;
  let indicators;
  let controls;

  let timeOut;
  let slidesCount
  let isPlaying;
  let currentSlide;

  var pauseButton;
  var prevButton;
  var nextButton;
  var slider;



  /**
   * Переход к слайду с определённым номером
   * @param slideNum : номер слайда оторый будет сделан активным
   */
  const gotoSlide = (slideNum) => {

    if ((slideNum < slides.count) || !isFinite(slideNum)) {
      throw Error("Значение параметр slideNum не является корректным номером слайда")
    }
    slides[currentSlide].classList.toggle('slide-active');
    currentSlide = (slideNum + slidesCount) % slidesCount;
    slides[currentSlide].classList.toggle('slide-active');

    prevIndicator = document.querySelector('.indicators__item-active');
    if (prevIndicator !== null) {
      prevIndicator.classList.remove('indicators__item-active');
    }
    prevIndicator = document.querySelector(`.indicators__item[data-slide-to='${currentSlide}']`);
    prevIndicator.classList.add('indicators__item-active');

  }

  /**
   * Переход к следующему слайду
   */
  function nextSlide() {
    gotoSlide(currentSlide + 1);
  };
  /**
   * Переход к предыдущему слайду
   */
  function prevSlide() {
    gotoSlide(currentSlide - 1);
  };
  /***
   * Создание элемента управления
   */
  function createFaElement(fa_class) {
    let i = document.createElement('i')
    i.classList.add('fas');
    i.classList.add(fa_class);
    return i.outerHTML;
  }
  /**
   * Запуск слайдшоу
   */
  function playSlideShow() {
    if (!timerID) {
      timerID = setInterval(nextSlide, timeOut);
    }
    isPlaying = true;
    pauseButton.innerHTML = createFaElement('fa-pause');
  }

  /**
   * Остановка слайдшоу. Пауза.
   */
  function pauseSlideShow() {
    clearInterval(timerID);
    timerID = null;
    isPlaying = false;
    pauseButton.innerHTML = createFaElement('fa-play');
  }


  /**
   * Обработчик нажатия на индикатор слайда. Переход к соответствующему слайду.  
   * 
   * @param e Событие родительского элемента индикаторов
   */
  function indicatorsClick(e) {
    let target = e.target;

    if (target.classList.contains('indicators__item')) {
      gotoSlide(parseInt(target.getAttribute("data-slide-to")));
      pauseSlideShow();
    }
  }

  /**
   * Обработчик для кнопки "Play/Pause"
   */
  function startStopHandler() {
    if (isPlaying) {
      pauseSlideShow();
    }
    else {
      playSlideShow();
    }
  }
  /**
   * Обработчик для кнопки "Next"
   */
  function nextSlideHandler() {
    nextSlide();
    pauseSlideShow();
  }

  /**
   * Обработчик для кнопки "Prev"
   */
  function prevSlideHandler() {
    prevSlide();
    pauseSlideShow();
  }

  /**
   * Назначение обраотчиков событий
   */
  function setupListeners() {
    let indicators = document.querySelector('div.indicators');
    if (indicators) {
      indicators.addEventListener('click', indicatorsClick);
    }
    if (options.displayElements.controls === true) {
      pauseButton.addEventListener('click', startStopHandler);
      nextButton.addEventListener('click', nextSlideHandler);
      prevButton.addEventListener('click', prevSlideHandler);
    }
    if (options.handleEvents.mouse === true) {
      slider.addEventListener('mouseout', mouseoutHandler); // let wasPlaying =options.isPlaying;
      slider.addEventListener('mouseover', mouseoverHandler); //pauseSlideShow
    }

    if (options.handleEvents.kbd === true) {
      document.addEventListener('keydown', keyPressed); // let wasPlaying =options.isPlaying;    
    }

    if (options.handleEvents.swipe) {
      slider.addEventListener('touchstart', swipeStart); // let wasPlaying =options.isPlaying;
      slider.addEventListener('touchend', swipeEnd); //pauseSlideShow  }
    }
  }

  function swipeStart(ev) {
    swipeStartX = ev.targetTouches[0].clientX;
    swipeStartY = ev.targetTouches[0].clientY;
    swipeEndX = swipeStartX;
    swipeEndY = swipeStartY;

    //console.log(ev);
  }

  function swipeEnd(ev) {

    console.log(ev);
    swipeEndX = ev.changedTouches[0].clientX;
    swipeEndY = ev.changedTouches[0].clientY;
    if (Math.abs(swipeStartX - swipeEndX) > 10) {
      if (swipeStartX > swipeEndX) nextSlide(); else prevSlide();
    }
  }


  /**
   * Обработчик события когда указатель мыши покидает слайдер. 
   */
  function mouseoutHandler() {
    if (wasPlaying_beforeMouseOver) playSlideShow();
  }
  /**
   * Обработчик события когда указатель мыши проходит над слайдером. 
   */
  function mouseoverHandler() {
    wasPlaying_beforeMouseOver = isPlaying;
    if (wasPlaying_beforeMouseOver) {
      pauseSlideShow();
    }
  }
  /**
   * Обработчик управления слайдером с клавиатуры
   */
  function keyPressed(e) {
    console.log(e.code);
    switch (e.code) {
      case KEYCODE_ARROW_LEFT:
        {
          prevSlide();
          break;
        }
      case KEYCODE_ARROW_RIGHT:
        {
          nextSlide();
          break;
        }
      case KEYCODE_SPACE:
        {
          startStopHandler();
          break;
        }
    }

  }

  /**
   * Создание разметки слайдера
   */
  function createStructure(options = null) {
    let d = document;
    let slidesCount = options ? options.slidesCount : 0;
    slider = d.createElement('ul');
    slider.classList.add('slides');

    if (options.displayElements.indicators === true) {
      indicators = d.createElement('div');
      indicators.classList.add('indicators');
    }

    if (options.displayElements.controls === true) {
      controls = d.createElement('div');
      controls.classList.add('controls');
    }

    let slide;
    let indicator;
    let a;
    // Creating slides and indicators
    for (let iSlide = 0; iSlide < slidesCount; iSlide++) {
      slide = d.createElement('li');
      indicator = d.createElement('span');
      a = d.createElement('a');
      a.setAttribute('href', '#');
      a.setAttribute('class', 'slides__item-link');
      a.innerHTML = 'slide №' + (iSlide + 1).toString();

      slide.classList.add('slide');

      slide.appendChild(a);
      slider.appendChild(slide);
      if (iSlide === options.startSlideNum) {
        slide.classList.add('slide-active');
        prevIndicator = indicator;
      }

      if (options.displayElements.indicators) {
        indicator.classList.add('indicators__item');
        indicator.setAttribute('data-slide-to', iSlide);
        indicators.appendChild(indicator);
      }
    }

    // Controls
    if (options.displayElements.controls === true) {
      const sc = {
        'controls__prev': 'fas fa-chevron-left',
        'controls__next': 'fas fa-chevron-right',
        'controls__pause': 'fas fa-pause'
      };

      let control = null;
      let i = null;
      for (const [attrKey, attrValue] of Object.entries(sc)) {
        control = d.createElement('div');
        control.setAttribute('class', 'controls__item ' + attrKey);
        i = d.createElement('i');
        i.setAttribute('class', attrValue);
        control.appendChild(i);
        controls.appendChild(control);
      };
    }

    let c = d.getElementById('carousel');
    if (c) {
      let caruselWrapper = d.createElement('div');
      caruselWrapper.setAttribute('class', 'carousel__container');
      let slidersWrapper = d.createElement('div');
      slidersWrapper.setAttribute('class', 'slides__container');
      caruselWrapper.appendChild(slidersWrapper);

      c.appendChild(caruselWrapper);
      slidersWrapper.appendChild(slider);
      if (options.displayElements.indicators) {
        caruselWrapper.appendChild(indicators);
      }
      if (options.displayElements.controls) {
        caruselWrapper.appendChild(controls);
        pauseButton = document.querySelector('.controls__pause');
        pauseButton.setAttribute('id', 'pause');

        nextButton = document.querySelector('.controls__next');
        nextButton.setAttribute('id', 'next');

        prevButton = document.querySelector('.controls__prev');
        prevButton.setAttribute('id', 'prev');
      }

    }
    else {
      throw Error('Не найден элемент с id ="carousel"');
    }
  }
  function init(sliderOptions) {
    if (sliderOptions) { options = sliderOptions };

    timeOut = options ? options.timeOut : 1000;
    slidesCount = options ? options.slidesCount : 2;
    isPlaying = (options && options.isPlaying === true) ? true : false;
    currentSlide = options ? options.startSlideNum : 0;

<<<<<<< HEAD
    createStructure(options);
    slides = document.querySelectorAll('.slide');

    setupListeners();

    if (isPlaying) {
      gotoSlide(currentSlide);
      timerID = setInterval(nextSlide, options.timeOut);
    }
    else
      pauseSlideShow();
  }

  init({
    isPlaying: true,
    timeOut: 1000,
    slideChangeEffect: null, // пока не реализовано
    slidesCount: 6,
    startSlideNum: 2, //0-based

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
}());

