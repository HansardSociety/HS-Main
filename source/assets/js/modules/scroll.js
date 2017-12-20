import SmoothScroll from "smooth-scroll"

/*    Smooth Scroll: https://github.com/cferdinandi/smooth-scroll
  ========================================================================== */

const anchorScroll = (() => {
  const scroll = new SmoothScroll("#arrow", {
    offset: 64,
    speed: 600
  })
})()

export { anchorScroll }
