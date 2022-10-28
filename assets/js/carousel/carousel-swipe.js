

function SwipeCarousel() {
  Carousel.apply(this, arguments);
}
SwipeCarousel.prototype = Object.create(Carousel.prototype);
SwipeCarousel.prototype.constructor = SwipeCarousel;


SwipeCarousel.prototype._swipeStart = function (ev) {
  this.swipeStartX = this.swipeEndX = ev.targetTouches[0].clientX;
  this.swipeStartY = this.swipeEndY = ev.targetTouches[0].clientY;
  this.swipeEndX = this.swipeStartX;
  this.swipeEndY = this.swipeStartY;
}

SwipeCarousel.prototype._swipeEnd = function (ev) {
  this.swipeEndX = ev.changedTouches[0].clientX;
  this.swipeEndY = ev.changedTouches[0].clientY;
  console.log("swipe end");
  if (Math.abs(this.swipeStartX - this.swipeEndX) > 30) {
    if (this.swipeStartX > this.swipeEndX) this.nextSlide(); else this.prevSlide();
  }
  if (this.isPlaying) {
    this._pauseSlideShow();
  }
}

SwipeCarousel.prototype._setupListeners = function () {
  Carousel.prototype._setupListeners.apply(this);
  console.log("SwipeCarousel.initListeners");
  if (this.options.handleEvents.swipe === true) {
    this.slider.addEventListener('touchstart', this._swipeStart.bind(this)); // let wasPlaying =options.isPlaying;
    this.slider.addEventListener('touchend', this._swipeEnd.bind(this)); //pauseSlideShow  }
  }
}