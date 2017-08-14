import smoothScroll from 'smooth-scroll';

// Banner height
const bannerHeight = (() => {
  const vhFull = Math.max(window.innerHeight);
  const vhSemi = Math.max(window.innerHeight * .6666);
  const bannerFull = document.querySelector('.banner--full');
  const bannerSemi = document.querySelector('.banner--semi');

  if (bannerFull) bannerFull.style.height = `${ vhFull }px`;
  if (bannerSemi) bannerSemi.style.height = `${ vhSemi }px`;
})();

//  Smooth scroll
//  https://github.com/cferdinandi/smooth-scroll
const smoothScrolling = new smoothScroll('a[href^="#"]', {
  offset: 64,
  speed: 600
});

export { smoothScrolling, bannerHeight }
