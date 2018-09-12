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

    for (let block of searchBlocks) {

      // // Refinement widget
      // search.addWidget(
      //   instantsearch.widgets.refinementList({
      //     container: "#refinement-list",
      //     attributeName: "sub-themes"
      //   })
      // )

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

      // Hites widget
      search.addWidget(
        instantSearch.widgets.hits({
          container: block.querySelector(".JS-search-results"),
          templates: {
            empty: "No results",
            item: template("main-card")
          }
        })
      )

      // Lazy load images
      search.on("render", function () {
        const images = block.querySelectorAll("img")

        for (let img of images) {
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
