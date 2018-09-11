import instantSearch from "instantsearch.js/dist/instantsearch"

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
      routing: true
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
          placeholder: "Search for pages"
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

      search.start()
    }
  })
)()

export { algoliaSearch }
