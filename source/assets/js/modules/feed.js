import InfiniteScroll from "infinite-scroll"

const feed = document.querySelector(".feed")
const container = feed.querySelector(".feed__items")

const feedPages = [
  "page-1.html",
  "page-2.html",
  "page-3.html"
]

function feedPagePath() {
  const slug = feedPages[this.loadCount];

  if (slug) return "/blog/feed/" + slug
}

const feedScroll = (() => {
  const infScroll = new InfiniteScroll(container, {
    path: feedPagePath,
    append: ".feed-item",
    button: ".view-more-button",
    scrollThreshold: false,
    status: ".page-load-status"
  })
})()

export { feedScroll }
