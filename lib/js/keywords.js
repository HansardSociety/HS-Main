const fsx = require("fs-extra");
const yaml = require("js-yaml");
const vfile = require("to-vfile")
const retext = require("retext")
const pos = require("retext-pos")
const keywords = require("retext-keywords")
const toString = require("nlcst-to-string")
//
const ENV = process.env.NODE_ENV;
let searchDb = require(`../../build/${ ENV }/db/search.json`);
//
const childPagesDir = "./data/hs/child_page";
const childPagesFileNames = fsx.readdirSync(childPagesDir);
const landingPagesDir = "./data/hs/landing_page";
const landingPagesFileNames = fsx.readdirSync(landingPagesDir);


let allPages = [];

function stringify(value) {
  return toString(value)
}

/**
 * =Compile search data
************************************************************/

function compileSearchData (dir, fileNames, callback) {
  fileNames.map(function(path) {
    const cfulFile = fsx.readFileSync(`${ dir }/${ path }`, "utf8");
    const cfulDataYaml = yaml.safeLoad(cfulFile);
    const cfulDataJson = JSON.stringify(cfulDataYaml);
    const cfulDataObj = JSON.parse(cfulDataJson);

    let pageObj = {
      id: cfulDataObj[":ID"],
      keywords: [],
      keyphrases: []
    };

    if (cfulDataObj[":TYPE"] === "child_page") {
      retext()
        .use(pos)
        .use(keywords)
        .process(cfulDataObj[":copy"], done);
    }

    function done (err, file) {
      if (err) throw err;

      // Keywords
      file.data.keywords.map(function (keyword) {
        keyword = toString(keyword.matches[0].node);
        pageObj.keywords.push(keyword);
      })

      // Keyphrases
      file.data.keyphrases.map(function (phrase) {
        phrase = phrase.matches[0].nodes.map(val => toString(val)).join("");
        pageObj.keyphrases.push(phrase);
      })
    }

    allPages.push(pageObj)
  });
}

compileSearchData(childPagesDir, childPagesFileNames);

/**
 * =Map new search database
************************************************************/

allPages.map(function (page) {
  searchDb.map(function (dbItem) {
    if (dbItem.objectID === page.id) {
      if (dbItem.keywords === null) dbItem.keywords = [];
      dbItem.keywords = [
        ...dbItem.keywords,
        ...page.keywords,
        ...page.keyphrases
      ];
    }
  });
});

console.log(searchDb);

