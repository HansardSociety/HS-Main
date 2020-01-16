const algoliasearch = require("algoliasearch");
const chunk = require("lodash.chunk");

const records = require("./search-records");

const client = algoliasearch("AJC8ZDIWBJ", "66a9759f27ae50a3c41abf7b82181a11");

const pages = client.initIndex("pages");
const pagesByDate = client.initIndex("pages_by_date");
const pagesByPopularity = client.initIndex("pages_by_popularity");

const opts = {
  attrs: {
    core: [
      "unordered(title)",
      "unordered(description)",
      "unordered(theme)",
      "unordered(theme.lvl0)",
      "unordered(theme.lvl1)",
      "unordered(category)",
      "unordered(category.lvl0)",
      "unordered(category.lvl1)"
    ]
  },
  facets: {
    core: [
      "category",
      "category.lvl0",
      "category.lvl1",
      "theme",
      "theme.lvl0",
      "theme.lvl1"
    ]
  },
  ranking: {
    dateDesc: ["desc(date)"]
  },
  replicas: [
    "pages_by_date",
    "pages_by_popularity"
  ]
}

/**
 * =Core DB
************************************************************/

// Pages
pages.setSettings({
  searchableAttributes: opts.attrs.core,
  attributesForFaceting: opts.facets.core,
  replicas: opts.replicas
});

// ...by date
pagesByDate.setSettings({
  searchableAttributes: opts.attrs.core,
  attributesForFaceting: opts.facets.core,
  ranking: opts.ranking.dateDesc
});

// ...by popularity
pagesByPopularity.setSettings({
  searchableAttributes: opts.attrs.core,
  attributesForFaceting: opts.facets.core
});

console.log(records);

const chunks = chunk(records, 1000);
chunks.map(batch => pages.addObjects(batch));
