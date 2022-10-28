import SwipeCarousel from "./carousel/carousel-swipe.js";
import Carousel from "./carousel/carousel.js";

const carusel = new Carousel({
  isPlaying: true,          // стартовое состояние
  timeOut: 1000,
  slideChangeEffect: null,  // не реализовано
  slidesCount: 6,
  startSlideNum: 0,         //0-based
  // Отображение элементов
  displayElements: {
    controls: true,
    indicators: true
  },
  // Обработка событий
  handleEvents: {
    mouse: true,
    kbd: true,
    swipe: true
  }
});
carusel.init();