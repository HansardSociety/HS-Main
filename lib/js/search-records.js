const fsx = require("fs-extra");
const yaml = require("js-yaml");
const vfile = require("to-vfile");
const retext = require("retext");
const remark = require("remark");
const retextPos = require("retext-pos");
const retextKeywords = require("retext-keywords");
const toString = require("nlcst-to-string");
const stripMarkdown = require("strip-markdown");
//
const ENV = process.env.NODE_ENV;
let searchDb = require(`../../build/${ ENV }/db/search.json`);
// let searchDb = require("../../search.json");
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

const blacklist = [
  "’s",
  "'s",
  "‘",
  "’",
  "'",
  "\\(",
  "\\)"
];

let blacklistRegEx = "";
blacklist.map((v, i) => {
  if (i !== 0) blacklistRegEx += `|${ v }`;
  else blacklistRegEx += v;
});
blacklistRegEx = new RegExp(blacklistRegEx, "g");

function compileSearchData (dir, fileNames, callback) {
  fileNames.map(function(path) {
    const cfulFile = fsx.readFileSync(`${ dir }/${ path }`, "utf8");
    const cfulDataYaml = yaml.safeLoad(cfulFile);
    const cfulDataJson = JSON.stringify(cfulDataYaml);
    const cfulDataObj = JSON.parse(cfulDataJson);

    /**
     * =Set copy (Child vs Landing Page)
    ************************************************************/

    let copy = "";

    if (cfulDataObj[":TYPE"] === "child_page") {
      copy = cfulDataObj[":title"] + "\n\n" + cfulDataObj[":introduction"] + "\n\n" + cfulDataObj[":copy"];
    }
    if (cfulDataObj[":TYPE"] === "landing_page") {
      cfulDataObj[":panels"].map(function (panel) {
        if (panel[":TYPE"] === "panel_content") {
          copy += panel[":title"] + "\n\n" + panel[":copy"] + "\n\n";
        }
      })
    }

    /**
     * =Process keywords
    ************************************************************/

    let mergedKeywordsPhrases = [];
    const keywordsOptions = {
      maximum: 30
    };

    remark()
      .use(stripMarkdown)
      .process(copy, function (err, file) {
        copy = String(file)
          .replace(blacklistRegEx, "")
          .replace(/\n/g, "\n\n")
          .replace(/\n\n+/g, "\n\n");

        retext()
          .use(retextPos)
          .use(retextKeywords, keywordsOptions)
          .process(copy, processKeywordObjects);
      });

    /**
     * =Process keyword objects
    ************************************************************/

    function processKeywordObjects (err, file) {
      if (err) throw err;

      // Keywords
      file.data.keywords.map(function (keyword, index) {
        const word = toString(keyword.matches[0].node).toLowerCase();
        let scoreObj = {};
        scoreObj = {
          keyword: word,
          score: keyword.score * 100
        };

        if (scoreObj.score >= 10) mergedKeywordsPhrases.push(scoreObj);
      });

      // Keyphrases
      file.data.keyphrases.map(function (phrase, index) {
        const word = phrase.matches[0].nodes.map(val => toString(val)).join("").toLowerCase();
        let scoreObj = {};
        scoreObj = {
          keyword: word,
          score: phrase.score * 100
        };

        if (scoreObj.score >= 10) mergedKeywordsPhrases.push(scoreObj);
      });
    }

    /**
     * =Merge and push keywords to allPages
    ************************************************************/

    let pageObj = {
      id: cfulDataObj[":ID"],
      keywords: []
    };

    mergedKeywordsPhrases = sortByScore(deDupe(mergedKeywordsPhrases)); // Sort and de-duplicate
    pageObj.keywords = mergedKeywordsPhrases.slice(0, 30); // Limit to top 30
    allPages.push(pageObj); // Push to allPages
  });
}

function sortByScore (array) {
  array.sort(function (a, b) {
    if (a.score > b.score) return -1;
    if (a.score < b.score) return 1;
    return 0;
  });

  return array;
}

function deDupe (array) {
  let filtered = array.filter(function ({ keyword }) {
    return !this[keyword] && (this[keyword] = keyword)
  }, {});

  return filtered;
}

compileSearchData(childPagesDir, childPagesFileNames);
compileSearchData(landingPagesDir, landingPagesFileNames);

/**
 * =Map new search database
************************************************************/

allPages.map(function (page) {
  searchDb.map(function (searchDbItem) {
    if (searchDbItem.objectID === page.id) {
      let keywords = [];

      if (searchDbItem.keywords !== null) {
        searchDbItem.keywords.map(function (keyword) {
          keywords.push({
            keyword: keyword.toLowerCase(),
            score: 100
          });
        });
      }

      searchDbItem.keywords = [
        ...keywords,
        ...page.keywords
      ];
    }
  });
});

module.exports = searchDb;
