import instantSearch from "instantsearch.js"

const search = instantSearch({
  appID: "AJC8ZDIWBJ",
  apiKey: "66a9759f27ae50a3c41abf7b82181a11",
  indexName: "Main_Search_DB",
  routing: true
})

export default search.start()
