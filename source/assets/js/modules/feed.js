import InfiniteScroll from "infinite-scroll"

const feed = document.querySelector(".feed")

const infScroll = new InfiniteScroll(feed, {
  path: ".some-path"
})
