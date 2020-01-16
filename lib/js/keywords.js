const fsx = require("fs-extra");
const yaml = require("js-yaml");
const vfile = require("to-vfile");
const retext = require("retext");
const remark = require("remark");
const pos = require("retext-pos");
const keywords = require("retext-keywords");
const toString = require("nlcst-to-string");
const striptags = require("striptags");
const stripMarkdown = require("strip-markdown");
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

    let pageObj = {
      id: cfulDataObj[":ID"],
      keywords: []
    };

    const keywordsOptions = {
      maximum: 20
    };

    let mergedKeywordsPhrases = [];
    let copy = "";

    if (cfulDataObj[":TYPE"] === "child_page") {
      copy = cfulDataObj[":title"] + "\n\n" + cfulDataObj[":introduction"] + "\n\n" + cfulDataObj[":copy"];
    }


    /**
     * =Process keywords
    ************************************************************/

    remark()
      .use(stripMarkdown)
      .process(copy, function (err, file) {
        copy = String(file)
          .replace(blacklistRegEx, "")
          .replace(/\n/g, "\n\n")
          .replace(/\n\n+/g, "\n\n");

        retext()
          .use(pos)
          .use(keywords, keywordsOptions)
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
        mergedKeywordsPhrases.push(scoreObj);
      });

      // Keyphrases
      file.data.keyphrases.map(function (phrase, index) {
        word = phrase.matches[0].nodes.map(val => toString(val)).join("").toLowerCase();
        let scoreObj = {};
        scoreObj = {
          keyword: word,
          score: phrase.score * 100
        };
        mergedKeywordsPhrases.push(scoreObj);
      });
    }

    /**
     * =Merge and push keywords to allPages
    ************************************************************/

    mergedKeywordsPhrases = sortByScore(deDupe(mergedKeywordsPhrases)); // Sort and de-duplicate
    pageObj.keywords = mergedKeywordsPhrases.slice(0, 20); // Limit to top 20
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

/**
 * =Map new search database
************************************************************/

allPages.map(function (page) {
  searchDb.map(function (dbItem) {
    if (dbItem.objectID === page.id) {

      if (dbItem.keywords === null) {
        dbItem.keywords = [];
      } else {
        dbItem.keywords.map(function (keyword) {
          return {
            keyword,
            score: 100
          }
        });
      }

      dbItem.keywords = [
        ...dbItem.keywords,
        ...page.keywords
      ];
    }
  });
});

// console.log(JSON.stringify(allPages))
fsx.writeFileSync("./_search.json", JSON.stringify(allPages))

// let plp = [];
// for (i = 0; i < 20; i++) {
//   plp.push(`Hello ${i}`);
// }
// console.log(plp)

// console.log(JSON.stringify(searchDb));

