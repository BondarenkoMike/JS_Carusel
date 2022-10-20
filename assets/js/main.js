//const { Exception } = require("sass");

const options = {
  slidesCount: 5,
  isPlaying: false,
  timeOut: 1000,
  slideChangeEffect: null,
  startSlideNum: 2 //0-based
}

console.log('Sample JavaScript #6 HW #18.');
let prevIndicator = null;
let timerID = null;
let i = 0;
var slides;
//var indicators = document.querySelectorAll('.indicators');
const timeOut = options ? options.timeOut : 1000;
let slidesCount = options.slidesCount;// slides.length;
let isPlaying = options ? options.isPlaying : false;
let currentSlide = options ? options.startSlideNum : 0;
createStructure(options);

var pauseButton = document.querySelector('#pause');
var prevButton = document.querySelector('#prev');
var nextButton = document.querySelector('#next');

slides = document.querySelectorAll('.slide');

/**
 * Переход к слайду с определённым номером
 * @param slideNum : номер слайда оторый будет сделан активным
 */
const gotoSlide = (slideNum) => {

  if (!isFinite(slideNum)) {
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
  timerID = setInterval(nextSlide, timeOut);
  isPlaying = true;
  pauseButton.innerHTML = createFaElement('fa-pause');
}
/**
 * Остановка слайдшоу. Пауза.
 */
function pauseSlideShow() {
  clearInterval(timerID);
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
  indicators.addEventListener('click', indicatorsClick);
  pauseButton.addEventListener('click', startStopHandler);
  nextButton.addEventListener('click', nextSlideHandler);
  prevButton.addEventListener('click', prevSlideHandler);
}

function createStructure(options = null) {
  let d = document;
  let slidesCount = options ? options.slidesCount : 0;
  let slides = d.createElement('ul');
  slides.classList.add('slides');
  let indicators = d.createElement('div');
  indicators.classList.add('indicators');
  let controls = d.createElement('div');
  controls.classList.add('controls');
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
    slides.appendChild(slide);

    indicator.classList.add('indicators__item');
    indicator.setAttribute('data-slide-to', iSlide);

    if (iSlide === options.startSlideNum) {
      slide.classList.add('slide-active');
      prevIndicator = indicator;
    }
    indicators.appendChild(indicator);
  }

  // Controls
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

  let c = d.getElementById('carousel');
  if (c) {
    let coruselWrapper = d.createElement('div');
    coruselWrapper.setAttribute('class', 'carousel__container');
    let slidersWrapper = d.createElement('div');
    slidersWrapper.setAttribute('class', 'slides__container');
    coruselWrapper.appendChild(slidersWrapper);

    c.appendChild(coruselWrapper);
    slidersWrapper.appendChild(slides);
    coruselWrapper.appendChild(indicators);
    coruselWrapper.appendChild(controls);
  }

  document.querySelector('.controls__pause').setAttribute('id', 'pause');
  document.querySelector('.controls__next').setAttribute('id', 'next');
  document.querySelector('.controls__prev').setAttribute('id', 'prev');
}

setupListeners()

if (options.isPlaying) {
  gotoSlide(currentSlide);
  timerID = setInterval(nextSlide, options.timeOut);
}
else {
  pauseSlideShow();
}
