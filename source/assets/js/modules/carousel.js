import Blazy from 'blazy';

const blazyLoad = new Blazy();

const breakpoints = {
  xs: 480,
  sm: 600,
  md: 960,
  lg: 1280,
  xl: 1920
}

const carousel = (() => {
  new Swiper ('.swiper-container', {

    nextButton: '.carousel__next',
    prevButton: '.carousel__prev',

    direction: 'horizontal',
    loop: false,
    keyboardControl: true,
    preloadImages: false,

    slidesPerView: 3,
    spaceBetween: 9,

    // Lazy-loading
    // lazyLoading: true,
    // lazyLoadingInPrevNext: true,

    breakpoints: {
      599: {
        slidesPerView: 1
      },
      959: {
        slidesPerView: 2
      }
    },

    onSlideChangeStart: function(elem) {
      var activeSlide = document.querySelector('.swiper-slide-active img');
      console.log(elem)

      if (activeSlide.classList.contains('b-loaded')) {
        //do nothing
      } else {
        blazyLoad.load( activeSlide );
      }
    }
  });
})()

export { carousel };
