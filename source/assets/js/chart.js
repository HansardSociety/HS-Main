import Chart from "chart.js"
import siteConfig from "./shared-config.json"

/*	=Settings
  ========================================================================== */

/*	=Styles
  ---------------------------------------- */

// Colors
const colors = siteConfig.color_groups
const black = colors.black["1"]
const grey = colors["grey"]["3"]
const white = colors["white"]["1"]
const brandGreen = colors["brand-green"]["2"]

// Fonts
const ff01 = "'Avenir-Roman', 'Helvetica', 'Arial', 'sans-serif'"
const ff02 = "'Avenir-Heavy', 'Helvetica', 'Arial', 'sans-serif'"

// Sizes
const rem100 = 18
const rem75 = rem100 * .75
const rem675 = rem100 * .675
const rem50 = rem100 * .5

/* =Global config
 ***************************************************************************/

const cfg = Chart.defaults.global

// Core
cfg.defaultFontFamily = ff01;
cfg.defaultFontSize = rem75;
cfg.defaultFontColor = black;

// Elements
cfg.elements.rectangle.backgroundColor = brandGreen
cfg.elements.rectangle.borderColor = brandGreen
cfg.elements.rectangle.borderWidth = 2

// Layout
cfg.layout.padding = 0

// Legend
cfg.legend.labels.boxWidth = rem75
cfg.legend.fontColor = grey
cfg.legend.position = "bottom"

// Responsive
cfg.responsive = true
cfg.maintainAspectRatio = false

/*  =Tooltips
 *****************************************/

cfg.tooltips.backgroundColor = black
cfg.tooltips.bodySpacing = 4
cfg.tooltips.caretSize = 0
cfg.tooltips.cornerRadius = 8
cfg.tooltips.xPadding = rem50
cfg.tooltips.yPadding = rem50
cfg.tooltips.multiKeyBackground = white
cfg.tooltips.titleMarginBottom = rem50
cfg.tooltips.bodyFontSize = rem675
cfg.tooltips.bodyFontColor = white

/* =Scale defaults
 ***************************************************************************/

// Linear
Chart.scaleService.updateScaleDefaults("linear", {
  beginaAtZero: true,
  scaleLabel: {
    fontColor: grey,
    fontFamily: ff02
  }
});

// console.log(cfg)

/* =Callbacks
 ***************************************************************************/

const tooltipLabel = (items, data) => {
  console.log(data)
  console.log(items)

  let label = ""


  // tooltipItems.forEach(tooltip => {
  //   label += data.datasets[tooltip.datasetIndex].data[tooltip.index] + " HELLO"
  // })

  // return label
}

/* =Charts
 ***************************************************************************/

const renderCharts = () => {
  const elems = document.querySelectorAll(".chart")

  for (let ctx of elems) {
    const chartCanvas = ctx.querySelector(".chart__canvas").getContext("2d")
    const chartObj = JSON.parse(ctx.querySelector(".chart__template").innerHTML)

    const data = chartObj.data
    const options = chartObj.options

    /*  =User defined helpers
     *****************************************/

    // Options
    if (options.aspectRatio) options.maintainAspectRatio = true

    // Create options tree
    options.tooltips = {}
    options.tooltips.callbacks = {}
    options.tooltips.callbacks.label = (items, data) => tooltipLabel(items, data)

    // Data > Datasets
    for (let set of data.datasets) {

      // if bgc is defined but border isn't, make them the same and override default border
      if (set.backgroundColor && !set.borderColor) {
        set.borderColor = set.backgroundColor
        set.borderWidth = 0
      }
    }

    console.log(chartObj)

    new Chart(chartCanvas, chartObj)
  }
}

document.addEventListener("DOMContentLoaded", () => renderCharts())

/**
 * TODOs:
 * [ ] Tooltip font size
 * [ ] Grid font size
 * [ ] Base grid-line style
 * [ ] Add axes IDs to datasets
 * [ ] Axes label color grey
 * [ ] Create common config templates
 * [ ] JSON GUI editor
 */
