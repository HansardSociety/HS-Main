const algoliasearch = require("algoliasearch")
const chunk = require("lodash.chunk")

const records = require("../../build/preview/db/search.json")

const client = algoliasearch("AJC8ZDIWBJ", "66a9759f27ae50a3c41abf7b82181a11")

const pages = client.initIndex("pages")
const pagesByDate = client.initIndex("pages_by_date")

const opts = {
  attrs: {
    core: [
      "unordered(title)",
      "unordered(description)",
      "unordered(theme)",
      "unordered(sub_theme)",
      "unordered(category)",
      "unordered(sub_category)"
    ]
  },
  facets: {
    core: [
      "category",
      "sub_category",
      "theme",
      "sub_theme",
      "sub_theme_orig"
    ]
  },
  ranking: {
    dateDesc: ["desc(date)"]
  },
  replicas: [
    "pages_by_date"
  ]
}

/* =Core DB
 ***************************************************************************/

// Pages
pages.setSettings({
  searchableAttributes: opts.attrs.core,
  attributesForFaceting: opts.facets.core,
  replicas: opts.replicas
})

// ...by date
pagesByDate.setSettings({
  searchableAttributes: opts.attrs.core,
  attributesForFaceting: opts.facets.core,
  ranking: opts.ranking.dateDesc
})

const chunks = chunk(records, 1000)
chunks.map(batch => pages.addObjects(batch))
