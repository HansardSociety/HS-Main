import instantSearch from "instantsearch.js/dist/instantsearch"

const algoliaSearch = (() =>

  // Need to initiate after DOM loaded to return "containers"
  document.addEventListener("DOMContentLoaded", function() {

    // Options
    const search = instantSearch({
      appId: "AJC8ZDIWBJ",
      apiKey: "66a9759f27ae50a3c41abf7b82181a11",
      indexName: "Main_Search_DB",
      routing: true
    });

    // Search widget
    search.addWidget(
      instantSearch.widgets.searchBox({
        container: "#search-box",
        placeholder: "Search for pages"
      })
    );

    // Hites widget
    search.addWidget(
      instantSearch.widgets.hits({
        container: "#hits",
        templates: {
          empty: "No results",
          item: "<em>Hit {{objectID}}</em>: {{{_highlightResult.name.value}}}"
        }
      })
    );

    search.start();
  })
)()

export { algoliaSearch }
