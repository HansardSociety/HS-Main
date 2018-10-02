import Chart from "chart.js"
import siteConfig from "./shared-config.json"

/*	=Settings
  ========================================================================== */

/*	=Styles
  ---------------------------------------- */

// Colors
const colors = siteConfig.color_groups
const black = colors.black["1"]
const lightGrey = colors["grey"]["1"]
const grey = colors["grey"]["3"]
const white = colors["white"]["1"]
const offWhite = colors["white"]["2"]
const brandGreen = colors["brand-green"]["2"]

// Fonts
const ff01 = "'Avenir-Roman', 'Helvetica', 'Arial', 'sans-serif'"
const ff02 = "'Avenir-Heavy', 'Helvetica', 'Arial', 'sans-serif'"

// Strokes
const strokeWidth = 6

// Sizes
const rem100 = 18
const rem150 = 18 * 1.5
const rem75 = rem100 * .75
const rem675 = rem100 * .675
const rem50 = rem100 * .5

/* =Global config
 ***************************************************************************/

const cfg = Chart.defaults

// Core
cfg.global.defaultFontFamily = ff01;
cfg.global.defaultFontSize = rem675;
cfg.global.defaultFontColor = black;

// Elements
cfg.global.elements.rectangle.backgroundColor = offWhite

// Layout
cfg.global.layout.padding = 0

// Legend
cfg.global.legend.position = "bottom"
cfg.global.legend.labels.boxWidth = rem150

// Responsive
cfg.global.responsive = true
cfg.global.maintainAspectRatio = false

// Scale
cfg.scale.gridLines.color = lightGrey
cfg.scale.scaleLabel.fontColor = "red"

// Tooltips
cfg.global.tooltips.backgroundColor = black
cfg.global.tooltips.bodySpacing = 4
cfg.global.tooltips.caretSize = 0
cfg.global.tooltips.cornerRadius = 8
cfg.global.tooltips.xPadding = rem50
cfg.global.tooltips.yPadding = rem50
cfg.global.tooltips.multiKeyBackground = white
cfg.global.tooltips.titleMarginBottom = rem50
cfg.global.tooltips.bodyFontSize = rem675
cfg.global.tooltips.bodyFontColor = white

/* =Scale defaults
 ***************************************************************************/

// Linear
Chart.scaleService.updateScaleDefaults("linear", {
  gridLines: {
    drawTicks: true,
    zeroLineWidth: 2
  },
  ticks: {
    beginaAtZero: true,
    fontColor: grey,
  },
  scaleLabel: {
    fontColor: grey,
    fontFamily: ff02
  }
});

/* =Charts
 ***************************************************************************/

const renderCharts = () => {
  const elems = document.querySelectorAll(".chart")

  for (let ctx of elems) {
    const chartCanvas = ctx.querySelector(".chart__canvas").getContext("2d")
    const chartObj = JSON.parse(ctx.querySelector(".chart__template").innerHTML)

    const data = chartObj.data
    const options = chartObj.options

    /*  =Core
     *****************************************/

    if (options.aspectRatio) options.maintainAspectRatio = true

    /*  =Options
     *****************************************/

    // Tooltips
    options.tooltips = {}
    options.tooltips.callbacks = {
      label: (items, data) => {
        let item = data.datasets[items.datasetIndex]
        return ` ${item.label} (${item.data[items.index]})`
      },
      labelColor: (items, chart) => {
        let item = chart.data.datasets[items.datasetIndex]
        return {
          borderColor: white,
          backgroundColor: item.backgroundColor
        }
      }
    }

    options.borderSkipped = "left"

    /*  =Datasets
     *****************************************/

    for (let dataset of data.datasets) {
      // dataset.borderWidth = strokeWidth
      if (dataset.backgroundColor && !dataset.borderColor) dataset.borderColor = dataset.backgroundColor
    }

    new Chart(chartCanvas, chartObj)
  }
}

document.addEventListener("DOMContentLoaded", () => renderCharts())

/**
 * TODOs:
 * [x] Tooltip font size
 * [ ] Grid font size
 * [ ] Base grid-line style
 * [ ] Axes label color grey
 * [ ] Create common config templates
 * [ ] JSON GUI editor
 */
