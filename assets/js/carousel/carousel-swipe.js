import Carousel from './carousel.js';
class SwipeCarousel extends Carousel {

  _swipeStart(ev) {
    this.swipeStartX = this.swipeEndX = ev.targetTouches[0].clientX;
    this.swipeStartY = this.swipeEndY = ev.targetTouches[0].clientY;
    this.swipeEndX = this.swipeStartX;
    this.swipeEndY = this.swipeStartY;
  }

  _swipeEnd(ev) {
    this.swipeEndX = ev.changedTouches[0].clientX;
    this.swipeEndY = ev.changedTouches[0].clientY;
    if (Math.abs(this.swipeStartX - this.swipeEndX) > 30) {
      if (this.swipeStartX > this.swipeEndX) this.nextSlide(); else this.prevSlide();
    }
    if (this.isPlaying) {
      this._pauseSlideShow();
    }
  }

  _setupListeners() {
    super._setupListeners();
    if (this.options.handleEvents.swipe === true) {
      this.slider.addEventListener('touchstart', this._swipeStart.bind(this)); // let wasPlaying =options.isPlaying;
      this.slider.addEventListener('touchend', this._swipeEnd.bind(this)); //pauseSlideShow  }
    }
  }
}

export default SwipeCarousel;
