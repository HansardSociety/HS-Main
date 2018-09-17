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
      indexName: "Main_Search_DB_By_Date",
      routing: true,
      searchParameters: {
        hitsPerPage: 6
      },
      attributesForFaceting: ["category", "sub_category", "theme", "sub_theme"]
    })

    for (let block of searchBlocks) {

      var searchFilters = ""

      if (!block.dataset.searchCategory) {
        searchFilters = `theme:'${block.dataset.searchTheme}'`
      }

      search.searchParameters.filters = searchFilters;

      /*  =Core
       *****************************************/

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
            empty: "...",
            item: template("main-card")
          },
        }),
      )

      /*  =Refinement
       *****************************************/

      // Refinement widget 1
      search.addWidget(
        instantSearch.widgets.refinementList({
          container: block.querySelector(".search__filters > .search__filter-1"),
          attributeName: "sub_theme",
          sortBy: ["name:asc"],
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
          sortBy: ["name:asc"],
          operator: "or",
          templates: {
            header: "<span>Category:</span>"
          },
        })
      )

      // Sort
      search.addWidget(
        instantSearch.widgets.sortBySelector({
          container: block.querySelector(".search__sort-select"),
          indices: [
            { name: "Main_Search_DB_By_Date", label: "Date (desc)" },
            { name: "Main_Search_DB", label: "Relevance" }
          ]
        })
      )

      // Clear
      search.addWidget(
        instantSearch.widgets.clearAll({
          container: block.querySelector(".search__clear-inner"),
          clearsQuery: true,
          templates: {
            link: "<span class='search__clear-link'>Reset all<span>"
          }
        })
      )

      /*  =Laxy load
       *****************************************/

      search.on("render", function (q) {
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
