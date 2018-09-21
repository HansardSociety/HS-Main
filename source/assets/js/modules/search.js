import instantSearch from "instantsearch.js/dist/instantsearch"
import Blazy from "blazy"
import debounce from "lodash/debounce"

const blazy = new Blazy

function template(templateName) {
  return document.querySelector(`#search-template-${templateName}`).innerHTML;
}

const algoliaSearch = (() => {

  const multiSearch = (search, block) => {

    /* =Core
    ***************************************************************************/

    const searchType = block.dataset.searchMainAttr
    const searchFilter = block.dataset.searchFilter
    const isThemeSearch = searchType == "theme"
    const isCategorySearch = searchType == "category"

    let searchFilterParam = ""

    // Filter params
    if (isThemeSearch) searchFilterParam = `theme.lvl0:"${searchFilter}"`
    if (isCategorySearch) searchFilterParam = `category.lvl0:"${searchFilter}"`

    /*  =Config
     *****************************************/

    search.addWidget(
      instantSearch.widgets.configure({
        hitsPerPage: 6,
        filters: searchFilterParam
      })
    )

    /*  =Search box
     *****************************************/

    search.addWidget(
      instantSearch.widgets.searchBox({
        container: block.querySelector(".search__box"),
        placeholder: "e.g. delegated legislation...",
        autofocus: false,
        cssClasses: {
          root: "search__box-inner",
          input: "search__box-input"
        },
        reset: {
          cssClasses: { root: "search__box-reset" }
        },
        magnifier: {
          cssClasses: { root: "search__box-magnifier" }
        },
        loadingIndicator: {
          cssClasses: { root: "search__box-loading" }
        },
        queryHook: debounce((query, search) => {
          search(query)
        }, 600)
      })
    )

    /*  =Hits
     *****************************************/

    search.addWidget(
      instantSearch.widgets.infiniteHits({
        container: block.querySelector(".search__results"),
        showMoreLabel: "Load more…",
        cssClasses: {
          root: "search__results-inner",
          empty: "search__results-empty",
          item: "search__results-item",
          showmore: "search__results-more",
          showmoreButton: "search__results-more-btn"
        },
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
        cssClasses: {
          root: "search__filter-root",
          header: "search__filter-header",
          body: "search__filter-body",
          footer: "search__filter-footer",
          list: "search__filter-list",
          item: "search__filter-item",
          active: "search__filter-active",
          label: "search__filter-label",
          checkbox: "search__filter-checkbox",
          count: "search__filter-count"
        },
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

    if (isThemeSearch) {

      /*  =Theme search
      *****************************************/

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

    } else if (isCategorySearch) {

      /*  =Category search
      *****************************************/

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

    } else {

      /*  =All search
      *****************************************/

      // Theme
      refinementWidget({
        container: ".search__filter-1",
        attributeName: "theme.lvl0",
        heading: "Theme"
      })

      // Category
      refinementWidget({
        container: ".search__filter-2",
        attributeName: "category.lvl0",
        heading: "Category"
      })
    }

    /* =Sorting
    ***************************************************************************/

    search.addWidget(
      instantSearch.widgets.sortBySelector({
        container: block.querySelector(".search__sort-inner"),
        indices: [
          {
            name: "pages_by_date",
            label: "Date (desc)"
          }, {
            name: "pages",
            label: "Relevance"
          }
        ],
        cssClasses: {
          root: "search__sort-root",
          select: "search__sort-select",
          item: "search__sort-item"
        }
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

  // Filtered search
  const filteredSearch = instantSearch({
    appId: "AJC8ZDIWBJ",
    apiKey: "66a9759f27ae50a3c41abf7b82181a11",
    indexName: "pages",
    routing: true
  })

  const siteSearch = instantSearch({
    appId: "AJC8ZDIWBJ",
    apiKey: "66a9759f27ae50a3c41abf7b82181a11",
    indexName: "pages",
    routing: true
  })

  // Need to initiate after DOM loaded to return "containers"
  return document.addEventListener("DOMContentLoaded", function() {

    multiSearch(siteSearch, document.querySelector("#search-all-nav"))
    multiSearch(filteredSearch, document.querySelector("#search-filtered-main"))
  })
})()

export { algoliaSearch }
