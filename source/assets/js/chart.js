import Chart from "chart.js"
import siteConfig from "./shared-config.json"

/*	=Settings
  ========================================================================== */

/*	=Styles
  ---------------------------------------- */

// Colors
const colors = siteConfig.color_groups
const black01 = colors.black["1"]
const black02 = colors.black["2"]
const black03 = colors.black["3"]
const grey01 = colors["grey"]["1"]
const grey02 = colors["grey"]["2"]
const grey03 = colors["grey"]["3"]
const purple = colors["purple"]["2"]
const transparent = "rgba(0, 0, 0, 0)"
const white01 = colors["white"]["1"]
const white02 = colors["white"]["2"]
const white03 = colors["white"]["3"]

// Fonts
const ff01 = "'Avenir-Roman'"
const ff02 = "'Avenir-Heavy'"

// Sizes
const rem100 = 18
const rem75 = rem100 * .75
const rem50 = rem100 * .5

/* =Global config
 ***************************************************************************/

const cfg = Chart.defaults.global

// Core
cfg.defaultFontFamily = ff01;
cfg.defaultFontSize = rem75;
cfg.defaultFontColor = black01;

// Elements
cfg.responsive = true
cfg.maintainAspectRatio = false

// Layout
cfg.layout.padding = 0

// Legend
cfg.legend.labels.boxWidth = rem75
cfg.legend.fontColor = grey03
cfg.legend.position = "bottom"

// Tootips
cfg.tooltips.backgroundColor = black01
cfg.tooltips.bodySpacing = 4
cfg.tooltips.caretSize = 0
cfg.tooltips.cornerRadius = 8
cfg.tooltips.xPadding = rem50
cfg.tooltips.yPadding = rem50
cfg.tooltips.multiKeyBackground = white01
cfg.tooltips.titleMarginBottom = rem50

/* =Defaults
 ***************************************************************************/

Chart.scaleService.updateScaleDefaults("linear", {
  scaleLabel: {
    fontColor: grey03,
    fontFamily: ff02
  }
});

console.log(cfg)

/* =Charts
 ***************************************************************************/

const renderCharts = () => {
  const elems = document.querySelectorAll(".chart")

  for (let ctx of elems) {
    const chartCanvas = ctx.querySelector(".chart__canvas").getContext("2d")
    const cfgChart = JSON.parse(ctx.querySelector(".chart__template").innerHTML)

    return new Chart(chartCanvas, cfgChart)
  }
}

document.addEventListener("DOMContentLoaded", () => renderCharts())

/**
 * TODOs:
 * [ ] Base grid-line style
 * [ ] Add axes IDs to datasets
 * [ ] Axes label color grey
 * [ ] Create common config templates
 * [ ] JSON GUI editor
 */
