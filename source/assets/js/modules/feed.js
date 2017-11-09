import InfiniteScroll from "infinite-scroll"

const feedScroll = (() => {
  const feed = document.querySelector(".feed")

  if (feed) {
    const container = feed.querySelector(".feed__items")
    const initialCount = feed.getAttribute("data-feed-count")
    const feedTotal = feed.getAttribute("data-feed-total")
    const initialPagesCount = initialCount / 3

    var feedPages = []
    for (let i = initialPagesCount; i < feedTotal; i++) {
      var pageNo = i + 1

      feedPages.push(`page-${ pageNo }.html`)
    }

    console.log(feedPages)

    function feedPagePath() {
      const slug = feedPages[this.loadCount]

      if (slug) return "/blog/feed/" + slug
    }

    const infScroll = new InfiniteScroll(container, {
      path: feedPagePath,
      append: ".feed-item",
      button: ".view-more-button",
      scrollThreshold: false,
      status: ".page-load-status"
    })
  }
})()

export { feedScroll }
