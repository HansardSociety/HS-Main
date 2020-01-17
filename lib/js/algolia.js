const fsx = require("fs-extra");
const chunk = require("lodash.chunk");
//
const algoliasearch = require("algoliasearch");
const client = algoliasearch("AJC8ZDIWBJ", "66a9759f27ae50a3c41abf7b82181a11");
const pages = client.initIndex("pages");
const pagesByDate = client.initIndex("pages_by_date");
const pagesByPopularity = client.initIndex("pages_by_popularity");
//
const records = require("./search-records");
//
const ENV = process.env.NODE_ENV;

/**
 * =Map records
************************************************************/

records.map(function (record) {
  /**
   * {
   *   keywords: {
   *     <score>: [
   *       <keywords>
   *     ]
   *   }
   * }
   */
  let scoreObj = {};

  record.keywords.map(function (origKwObj, index) {
    // If score object with same score exists, add score and kw to array...
    if (scoreObj[origKwObj.score]) {
      scoreObj[origKwObj.score].push(origKwObj.keyword);
    // ...Create new score array
    } else {
      scoreObj[origKwObj.score] = [];
      scoreObj[origKwObj.score].push(origKwObj.keyword);
    }
  });

  // Order by score...
  if (Object.keys(scoreObj).length) {
    const keywordsByScore = {};

    const sortByScore = Object.keys(scoreObj).sort(function (a, b) {
      a = parseFloat(a);
      b = parseFloat(b);

      if (a > b) return -1;
      if (a < b) return 1;

      return 0;
    })

    sortByScore.forEach(function (score, index) {
      keywordsByScore[`set${ index }`] = {
        score: parseFloat(score),
        words: scoreObj[score]
      }
    });

    record.keywords = keywordsByScore;
  }
});


fsx.writeFileSync(
  `./build/${ ENV }/db/search.json`,
  JSON.stringify(records)
);

/**
 * =Set algolia search options
************************************************************/

// Create keyword sets equal to max number of keywords = 30.
const keywordAttrs = [];
[...Array(31)].map(function (kw, i) {
  keywordAttrs.push(`keywords.set${ i }.words`);
});

const opts = {
  attrs: {
    core: [
      "unordered(title)",
      "unordered(description)",
      "unordered(theme)",
      "unordered(theme.lvl0)",
      "unordered(theme.lvl1)",
      ...keywordAttrs,
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
    dateDesc: [
      "desc(date)"
    ]
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

const chunks = chunk(records, 1000);
chunks.map(batch => pages.addObjects(batch));
