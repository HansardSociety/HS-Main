import {toggleClass} from "./core";
import instantSearch from "instantsearch.js/dist/instantsearch";
import Blazy from "blazy";
import debounce from "lodash/debounce";

const blazy = new Blazy;

function template(templateName) {
  return document.querySelector(`#search-template-${templateName}`).innerHTML.replace(/`/g, "");
}

const algoliaSearch = (() => {

  const multiSearch = (search, block) => {

    /* =Core
    ***************************************************************************/

    const searchType = block.dataset.searchMainAttr;
    const searchFilter = block.dataset.searchFilter;
    const isThemeSearch = searchType == "theme";
    const isCategorySearch = searchType == "category";

    let searchFilterParam = "";

    // Filter params
    if (isThemeSearch) searchFilterParam = `theme.lvl0:"${searchFilter}"`;
    if (isCategorySearch) searchFilterParam = `category.lvl0:"${searchFilter}"`;

    /*  =Config
     *****************************************/

    search.addWidget(
      instantSearch.widgets.configure({
        hitsPerPage: 4,
        filters: searchFilterParam
      })
    );

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
    );

    /*  =Hits
     *****************************************/

    // Infinite hits
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
        }
      })
    );

    /* =Filters
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
      } = opts;

      const refinementListOpts = {
        container: block.querySelector(container),
        attributeName: attributeName,
        sortBy: ["name:asc"],
        operator: "or",
        cssClasses: {
          root: "search__filters-root",
          header: "search__filters-header",
          body: "search__filters-body",
          footer: "search__filters-footer",
          list: "search__filters-list",
          item: "search__filters-item",
          active: "search__filters-active",
          label: "search__filters-label",
          checkbox: "search__filters-checkbox",
          count: "search__filters-count"
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

      // Categories
      refinementWidget({
        container: ".search__filter-1",
        attributeName: "category.lvl0",
        heading: "Category"
      });

      // Sub-themes
      refinementWidget({
        container: ".search__filter-2",
        attributeName: "theme.lvl1",
        heading: "Sub-theme",
        transformItemData: i => {
          i.label = i.value.split(">").pop()
          return i
        },
        transformItems: items => items.filter(
          i => i.value.includes(searchFilter)
        )
      });

    } else if (isCategorySearch) {

      /*  =Category search
      *****************************************/

      // Sub-category
      refinementWidget({
        container: ".search__filter-1",
        attributeName: "category.lvl1",
        heading: "Sub-category",
        transformItemData: i => {
          i.label = i.value.split(">").pop()
          return i
        }
      });

      // Themes
      refinementWidget({
        container: ".search__filter-2",
        attributeName: "theme.lvl0",
        heading: "Theme",
      });

    } else {

      /*  =All search
      *****************************************/

      // Category
      refinementWidget({
        container: ".search__filter-1",
        attributeName: "category.lvl0",
        heading: "Category"
      });
    }

    /* =Sorting
    ***************************************************************************/

    search.addWidget(
      instantSearch.widgets.sortBySelector({
        container: block.querySelector(".search__sort-inner"),
        indices: [
          {
            name: "pages",
            label: "Relevance"
          }, {
            name: "pages_by_date",
            label: "Date (desc)"
          }
        ],
        cssClasses: {
          root: "search__sort-root",
          select: "search__sort-select",
          item: "search__sort-item"
        }
      })
    );

    /* =Clear
    ***************************************************************************/

    search.addWidget(
      instantSearch.widgets.clearAll({
        container: block.querySelector(".search__clear-inner"),
        clearsQuery: true,
        templates: {
          link: "<span class='search__clear-link'>Clear search and filters<span>"
        }
      })
    );

    /* =Lazy-load images
    ***************************************************************************/

    search.on("render", function (q) {
      const cards = block.querySelectorAll(".main-card")

      for (let card of cards) {
        const img = card.querySelector("img")

        if (img.classList.contains("b-loaded")) false // do nothing
        else blazy.load(img)
      }
    });

    search.start();
  }

  /* =Init
   ***************************************************************************/

  // Filtered search
  function iSearch (containerElem) {

    return instantSearch({
      appId: "AJC8ZDIWBJ",
      apiKey: "66a9759f27ae50a3c41abf7b82181a11",
      indexName: "pages",
      routing: true,

      searchFunction: function(helper) {
        const searchResultsElem = containerElem.querySelector(".search__results");
        const searchBackElem = containerElem.querySelector(".search__back");

        // Don't display results if query and filters is empty
        if (helper.state.query === "" && Object.keys(helper.state.disjunctiveFacetsRefinements).length === 0) {
          searchResultsElem.style.display = "none";
          searchBackElem.style.display = "none";
        } else {
          searchResultsElem.style.display = "block";
          searchBackElem.style.display = "block";
        }
        helper.search();
      }
    });
  }

  // Need to initiate after DOM loaded to return "containers"
  return document.addEventListener("DOMContentLoaded", function() {
    const siteSearchContainer = document.querySelector("#search-all-nav")
    const filteredSearchContainer = document.querySelector("#search-filtered-main")

    if (siteSearchContainer) multiSearch(iSearch(siteSearchContainer), siteSearchContainer)
    if (filteredSearchContainer) multiSearch(iSearch(filteredSearchContainer), filteredSearchContainer)
  });
})();


/* =Toggle filters
***************************************************************************/

const toggleFilters = (() => {
  for (let block of document.querySelectorAll(".search")) {
    const filterToggle = block.querySelector(".search__toggle-filters")

    filterToggle.addEventListener("click", function () {
      toggleClass(this, "JS-on")

      if (this.classList.contains("JS-on")) this.innerText = "Hide filters"
      else this.innerText = "Show filters"
    })
  }
})();

export { algoliaSearch, toggleFilters }
