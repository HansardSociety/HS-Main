import smoothScroll from 'smooth-scroll';

////////////////////////////////////////////////////////////
//  Hero image
////////////////////////////////////////////////////////////

const bannerHeight = (() => {
  const screenHeight = window.innerHeight;

  document.querySelector('.banner__image').style.height = `${ screenHeight }px`
})()

////////////////////////////////////////////////////////////
//  Smooth scroll
//  https://github.com/cferdinandi/smooth-scroll
////////////////////////////////////////////////////////////

const bannerScroll = (() => {
  smoothScroll.init({ offset: 64 });
})()

export { bannerHeight, bannerScroll }
