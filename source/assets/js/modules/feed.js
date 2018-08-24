import InfiniteScroll from "infinite-scroll"

const infiniteFeed = (() => {
  const feed = document.querySelector(".JS-feed")

  if (feed) {
    const container = feed.querySelector(".feed__items")
    const feedStatus = feed.querySelector(".feed__status")
    const feedLoad = feed.querySelector(".feed__load")

    const feedCategory = feed.getAttribute("data-feed-category")
    var feedCount = feed.getAttribute("data-feed-count")
    var feedTotal = feed.getAttribute("data-feed-total")
    var feedPageNo = feed.getAttribute("data-feed-page")

    feedCount = Number(feedCount)
    feedTotal = Number(feedTotal)
    feedPageNo = Number(feedPageNo)

    if ((feedPageNo + 1) >= feedTotal) {
      feedStatus.style.display = "none"
      feedLoad.style.display = "none"

    } else {
      var initialPagesCount = feedPageNo

      feedTotal = feedTotal - 1

      var feedPages = []
      for (let i = initialPagesCount; i < feedTotal; i++) {
        var pageNo = i + 1

        feedPages.push(`page-${ pageNo }.html`)
      }

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

      // Enable history for SEO
      infScroll.on("load", function(i) {
        var loadCount = infScroll.loadCount + feedPageNo
        var title = "Page " + loadCount
        var url = `/${ feedCategory.replace("::", "/") }/feed/page-${ loadCount }`

        history.pushState(null, title, url);

        setTimeout(() => {
          const feedItems = feed.querySelectorAll(".feed__menu-item")

          for (let item of feedItems) {
            if (item.classList.contains("JS-active")) {
              item.classList.remove("JS-active")

            } else if (item.innerText == loadCount) {
              item.classList.add("JS-active")
            }
          }
        }, 100);
      });
    }
  }
})()

export { infiniteFeed }
