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

      /* =Core
       ***************************************************************************/

      const searchFilter = block.dataset.searchFilter
      const searchType = block.dataset.searchMainAttr
      const isThemeSearch = searchType == "theme"
      const isCategorySearch = searchType == "category"

      var searchFilterParam = ""

      // Search filter params
      if (isThemeSearch) searchFilterParam = `theme.lvl0:"${searchFilter}"`
      if (isCategorySearch) searchFilterParam = `category.lvl0:"${searchFilter}"`

      // Search widget
      search.addWidget(
        instantSearch.widgets.configure({
          hitsPerPage: 6,
          filters: searchFilterParam
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

      /* =Refinement
       ***************************************************************************/

      /*  =Widget fn
       *****************************************/

      const refinementWidget = opts => {
        let {
          container,
          attributeName,
          heading,
          transformItemData,
          transformItems
        } = opts

        const refinementListOpts = {
          container: block.querySelector(container),
          attributeName: attributeName,
          sortBy: ["name:asc"],
          operator: "or",
          templates: {
            header: `<span>${ heading }:</span>`,
            item: template("checkbox")
          }
        }

        if (transformItemData) {
          Object.assign(refinementListOpts, {
            transformData: { item: transformItemData }
          })
        }

        if (transformItems) {
          Object.assign(refinementListOpts, { transformItems })
        }

        search.addWidget(instantSearch.widgets.refinementList(refinementListOpts))
      }

      /*  =Theme search
       *****************************************/

      if (isThemeSearch) {

        // Sub-themes
        refinementWidget({
          container: ".search__filter-1",
          attributeName: "theme.lvl1",
          heading: "Sub-theme",
          transformItemData: i => {
            i.label = i.value.split(">").pop()
            return i
          },
          transformItems: items => items.filter(
            i => i.value.includes(searchFilter)
          )
        })

        // Categories
        refinementWidget({
          container: ".search__filter-2",
          attributeName: "category.lvl0",
          heading: "Category"
        })
      }

      /*  =Category search
       *****************************************/

      if (isCategorySearch) {

        // Sub-category
        refinementWidget({
          container: ".search__filter-1",
          attributeName: "category.lvl1",
          heading: "Category",
          transformItemData: i => {
            i.label = i.value.split(">").pop()
            return i
          }
        })

        // Themes
        refinementWidget({
          container: ".search__filter-2",
          attributeName: "theme.lvl0",
          heading: "Theme",
        })
      }

      /* =Sorting
       ***************************************************************************/

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

      /* =Clear
       ***************************************************************************/

      search.addWidget(
        instantSearch.widgets.clearAll({
          container: block.querySelector(".search__clear-inner"),
          clearsQuery: true,
          templates: {
            link: "<span class='search__clear-link'>Clear filters<span>"
          }
        })
      )


      /* =Lazy-load images
       ***************************************************************************/

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
