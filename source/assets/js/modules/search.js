import instantSearch from "instantsearch.js/dist/instantsearch"
import Blazy from "blazy"
import debounce from "lodash/debounce"

const blazy = new Blazy

function template(templateName) {
  return document.querySelector(`#search-template-${templateName}`).innerHTML;
}

const algoliaSearch = (() =>

  // Need to initiate after DOM loaded to return "containers"
  document.addEventListener("DOMContentLoaded", function() {

    const searchBlocks = document.querySelectorAll(".search")

    // Options
    const search = instantSearch({
      appId: "AJC8ZDIWBJ",
      apiKey: "66a9759f27ae50a3c41abf7b82181a11",
      indexName: "Main_Search_DB",
      routing: true,
      searchParameters: {
        hitsPerPage: 6
      }
    })

    // console.log(config["categories"])

    for (let block of searchBlocks) {

      // Search widget
      search.addWidget(
        instantSearch.widgets.searchBox({
          container: block.querySelector(".JS-search-input"),
          placeholder: "Search for pages",
          autofocus: false,
          queryHook: debounce((query, search) => {
            search(query)
          }, 600)
        })
      )

      // Hits widget
      search.addWidget(
        instantSearch.widgets.infiniteHits({
          container: block.querySelector(".JS-search-results"),
          showMoreLabel: "Load more…",
          templates: {
            empty: "No results",
            item: template("main-card")
          }
        })
      )

      // Refinement widget
      search.addWidget(
        instantSearch.widgets.refinementList({
          container: block.querySelector(".JS-search-filters"),
          attributeName: "category",
          operator: "and",
          templates: {
            header: "<h5>{{{category}}}</h5>"
          }
        })
      )

      // Lazy load images
      search.on("render", function () {
        const cards = block.querySelectorAll(".main-card")

        for (let card of cards) {
          const img = card.querySelector("img")

          if (img.classList.contains("b-loaded")) {
            // do nothing
          } else {
            blazy.load(img);
          }
        }
      })

      search.start()
    }
  })
)()

export { algoliaSearch }
