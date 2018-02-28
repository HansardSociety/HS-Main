const algoliasearch = require("algoliasearch")
const chunk = require("lodash.chunk")

const client = algoliasearch("AJC8ZDIWBJ", "66a9759f27ae50a3c41abf7b82181a11")
const index = client.initIndex("exp_SearchDB")

const records = require("../../build/exp/db/search.json")

const chunks = chunk(records, 1000)

chunks.map(batch => index.addObjects(batch))
