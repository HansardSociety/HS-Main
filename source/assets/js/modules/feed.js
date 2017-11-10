import InfiniteScroll from "infinite-scroll"

const infiniteFeed = (() => {
  const feed = document.querySelector(".feed")

  if (feed) {
    const container = feed.querySelector(".feed__items")
    const feedStatus = feed.querySelector(".feed__status")
    const feedLoad = feed.querySelector(".feed__load")

    const feedCategory = feed.getAttribute("data-feed-category")
    const initialCount = feed.getAttribute("data-feed-count")
    var feedTotal = feed.getAttribute("data-feed-total")
    const dedupe = feed.getAttribute("data-feed-dedupe") == "true"

    if (initialCount === feedTotal) {
      feedStatus.style.display = "none"
      feedLoad.style.display = "none"

    } else {
      var initialPagesCount = initialCount / 3
      if (dedupe) initialPagesCount = initialPagesCount + 2

      feedTotal = feedTotal - 1

      var feedPages = []
      for (let i = initialPagesCount; i < feedTotal; i++) {
        var pageNo = i + 1

        feedPages.push(`page-${ pageNo }.html`)
      }

      console.log(feedTotal)

      function feedPagePath() {
        const slug = feedPages[this.loadCount]

        if (slug) return `/${ feedCategory.replace("::", "/") }/feed/${ slug }`
      }

      const infScroll = new InfiniteScroll(container, {
        path: feedPagePath,
        history: false,
        append: ".feed-item",
        button: feedLoad,
        scrollThreshold: false,
        status: feedStatus
      })
    }
  }
})()

export { infiniteFeed }
