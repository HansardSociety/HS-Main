const algoliasearch = require("algoliasearch")
const chunk = require("lodash.chunk")

const client = algoliasearch("AJC8ZDIWBJ", "66a9759f27ae50a3c41abf7b82181a11")
const index = client.initIndex("pages")

const records = require("../../build/preview/db/search.json")

index.setSettings({
  replicas: [
    "pages_by_date"
  ]
})

const chunks = chunk(records, 1000)

// TODO: add err function
chunks.map(batch => index.addObjects(batch))
