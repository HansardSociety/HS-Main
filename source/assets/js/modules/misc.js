import smoothScroll from 'smooth-scroll';

////////////////////////////////////////////////////////////
//  Smooth scroll
//  https://github.com/cferdinandi/smooth-scroll
////////////////////////////////////////////////////////////

const bannerScroll = new smoothScroll('.banner__scroll', {
  offset: 64,
  speed: 600
});

export { bannerScroll }
