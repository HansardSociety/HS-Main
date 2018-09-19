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
      indexName: "pages",
      routing: true
    })

    for (let block of searchBlocks) {

      /*  =Core
       *****************************************/

      const searchTheme = block.dataset.searchTheme

      // Search widget
      search.addWidget(
        instantSearch.widgets.configure({
          hitsPerPage: 6,
          filters: `theme.lvl0:"${searchTheme}"`
        })
      )

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
            empty: "",
            item: template("main-card")
          },
        }),
      )

      /*  =Refinement
       *****************************************/

      // Refinement widget 1
      search.addWidget(
        instantSearch.widgets.refinementList({
          container: block.querySelector(".search__filter-1"),
          attributeName: "theme.lvl1",
          transformData: {
            item: i => {
              i.label = i.value.split(">").pop()
              return i
            }
          },
          transformItems: items => items.filter(
            i => i.value.includes(searchTheme)
          ),
          sortBy: ["name:asc"],
          operator: "or",
          templates: {
            header: "<span>Sub-theme:</span>",
            item: template("checkbox")
          },
        })
      )

      // Refinement widget 2
      search.addWidget(
        instantSearch.widgets.refinementList({
          container: block.querySelector(".search__filter-2"),
          attributeName: "category.lvl0",
          sortBy: ["name:asc"],
          operator: "or",
          templates: {
            header: "<span>Category:</span>",
            item: template("checkbox")
          },
        })
      )

      // Sort
      search.addWidget(
        instantSearch.widgets.sortBySelector({
          container: block.querySelector(".search__sort-select"),
          indices: [
            {
              name: "pages_by_date",
              label: "Date (desc)"
            }, {
              name: "pages",
              label: "Relevance"
            }
          ]
        })
      )

      // Clear
      search.addWidget(
        instantSearch.widgets.clearAll({
          container: block.querySelector(".search__clear-inner"),
          clearsQuery: true,
          templates: {
            link: "<span class='search__clear-link'>Clear filters<span>"
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
