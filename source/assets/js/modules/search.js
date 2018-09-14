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
      },
      attributesForFaceting: ["category"]
    })

    // console.log(config["categories"])

    for (let block of searchBlocks) {

      // Search widget
      search.addWidget(
        instantSearch.widgets.searchBox({
          container: block.querySelector(".search__box"),
          placeholder: "e.g. delegated legislation...",
          autofocus: false,
          queryHook: debounce((query, search) => {
            search(query)
          }, 600)
        })
      )

      // Hits widget
      search.addWidget(
        instantSearch.widgets.infiniteHits({
          container: block.querySelector(".search__results"),
          showMoreLabel: "Load more…",
          templates: {
            empty: "No results",
            item: template("main-card")
          },
        }),
      )

      // Refinement widget 1
      search.addWidget(
        instantSearch.widgets.refinementList({
          container: block.querySelector(".search__filters > .search__filter-1"),
          attributeName: "sub_theme",
          operator: "or",
          templates: {
            header: "<span>Sub-theme:</span>"
          },
        })
      )

      // Refinement widget 2
      search.addWidget(
        instantSearch.widgets.refinementList({
          container: block.querySelector(".search__filters > .search__filter-2"),
          attributeName: "category",
          operator: "or",
          templates: {
            header: "<span>Category:</span>"
          },
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
