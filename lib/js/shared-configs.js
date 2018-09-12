const path = require("path")
const yaml = require("js-yaml")
const fsx = require("fs-extra")

const sharedConfigs = () => {
  try {

  /* =Core
  ***************************************************************************/

  const siteData = yaml.safeLoad(fsx.readFileSync(
    path.join(__dirname, "../../data/hs/universal/5mkIBy6FCEk8GkOGKEQKi4.yaml"
  ), "utf8"), null, {
    schema: "JSON_SCHEMA"
  })

  const deSym = (data) => {
    const str = JSON.stringify(data).replace(/\{":/g, '{"').replace(/\,":/g, ',"')
    return JSON.parse(str)
  }

  const config = deSym(siteData[":site_config"])
  const colorGroups = config["colorGroups"]
  const categories = config["categories"]

  /* =SCSS
  ***************************************************************************/

  const sassify = (varName, data) => {
    return `$${ varName }:${
      JSON.stringify(data)
        .replace(/"/g, "")
        .replace(/{/g, "(")
        .replace(/}/g, ")")
        .replace(/\[/g, "(")
        .replace(/\]/g, ")")
    };`
  }

  // Convert to SCSS var list
  const colorVarsSCSS = `$colorGroups:${
    JSON.stringify(colorGroups)
      .replace(/"/g, "")
      .replace(/{/g, "(")
      .replace(/}/g, ")")
  };`

  var categoryColors = config["categories"]
  Object.keys(categoryColors).map(function(key, index) {
    categoryColors[key] = {
      name: categoryColors[key]["name"],
      color: categoryColors[key]["color"]
    }
  });

  // Create colorGroups
  fsx.writeFileSync(path.join(__dirname, "../../source/assets/css/config/cfg-colors.scss"), sassify("colorGroups", colorGroups))

  // Create categoryColors
  fsx.writeFileSync(path.join(__dirname, "../../source/assets/css/config/cfg-category-colors.scss"), sassify("categoryColors", categoryColors))

  /* =Scripts
  ***************************************************************************/

  fsx.writeFileSync(path.join(__dirname, "../../source/assets/js/shared-config.json"), JSON.stringify(config))

  } catch (e) {
    console.log(e)
  }
}

module.exports = sharedConfigs()
