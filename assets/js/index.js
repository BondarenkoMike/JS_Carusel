const carusel = new Carousel()
carusel.init({
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