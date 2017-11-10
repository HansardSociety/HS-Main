import InfiniteScroll from "infinite-scroll"

const infiniteFeed = (() => {
  const feed = document.querySelector(".feed")

  if (feed) {
    const container = feed.querySelector(".feed__items")
    const initialCount = feed.getAttribute("data-feed-count")
    const feedTotal = feed.getAttribute("data-feed-total")
    const dedupe = feed.getAttribute("data-feed-dedupe") == "true"

    var initialPagesCount = initialCount / 3
    if (dedupe) initialPagesCount = initialPagesCount + 2

    var feedPages = []
    for (let i = initialPagesCount; i < feedTotal; i++) {
      var pageNo = i + 1

      feedPages.push(`page-${ pageNo }.html`)
    }

    function feedPagePath() {
      const slug = feedPages[this.loadCount]

      if (slug) return "/blog/feed/" + slug
    }

    const infScroll = new InfiniteScroll(container, {
      path: feedPagePath,
      history: false,
      append: ".feed-item",
      button: ".feed__load",
      scrollThreshold: false,
      status: ".feed__status"
    })
  }
})()

export { infiniteFeed }
