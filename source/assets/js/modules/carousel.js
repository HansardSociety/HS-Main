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
    }
  });
})()

export { carousel };
