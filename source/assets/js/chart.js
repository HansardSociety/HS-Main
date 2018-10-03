import Chart from "chart.js"
import "chartjs-plugin-deferred"
import "chartjs-plugin-annotation"

import siteConfig from "./shared-config.json"

/* =Settings
 ***************************************************************************/

/*  =Styles
 *****************************************/

// Colors
const colors = siteConfig.color_groups

const lightGrey = colors["grey"]["1"]
const midGrey = colors["grey"]["1"]
const grey = colors["grey"]["3"]
const black = colors.black["1"]

const white = colors["white"]["1"]
const offWhite = colors["white"]["3"]

const brandGreen = colors["brand-green"]["2"]

// Fonts
const ff01 = "'Avenir-Roman', 'Helvetica', 'Arial', 'sans-serif'"
const ff02 = "'Avenir-Heavy', 'Helvetica', 'Arial', 'sans-serif'"

// Strokes
const strokeWidth = 3
const dashes = [6, 3]

// Sizes
const rem100 = 18
const rem150 = 18 * 1.5
const rem75 = rem100 * .75
const rem675 = rem100 * .675
const rem50 = rem100 * .5

/* =Global config
 ***************************************************************************/

const cfg = Chart.defaults.global

// Core
cfg.defaultFontFamily = ff01;
cfg.defaultFontSize = rem675;
cfg.defaultFontColor = black;

// Animations
cfg.animation.duration = 800

// Interactions
cfg.hover.mode = "nearest"
cfg.hover.intersect = true

// Layout
cfg.layout.padding = 0

// Legend
cfg.legend.position = "bottom"
cfg.legend.labels.boxWidth = rem150

// Responsive
cfg.responsive = true
cfg.maintainAspectRatio = false

// Tooltips
cfg.tooltips.backgroundColor = black
cfg.tooltips.bodySpacing = 4
cfg.tooltips.caretSize = 0
cfg.tooltips.cornerRadius = 8
cfg.tooltips.xPadding = rem50
cfg.tooltips.yPadding = rem50
cfg.tooltips.multiKeyBackground = white
cfg.tooltips.borderColor = white
cfg.tooltips.titleMarginBottom = rem50
cfg.tooltips.bodyFontSize = rem675
cfg.tooltips.bodyFontColor = white

/* =Plugins
 ***************************************************************************/

cfg.plugins.deferred = {
  enabled: true,
  xOffset: "50%",
  delay: 250
}

/*  =Points
 *****************************************/

// Point styles
const pointStyles = [
  "circle",
  "cross",
  "crossRot",
  "dash",
  "line",
  "rect",
  "rectRounded",
  "rectRot",
  "star",
  "triangle"
]

/* =Scale defaults
 ***************************************************************************/

// Linear
Chart.scaleService.updateScaleDefaults("linear", {
  gridLines: {
    color: midGrey,
    zeroLineColor: midGrey
  },
  ticks: {
    beginAtZero: true
  },
  scaleLabel: {
    fontColor: grey,
    fontFamily: ff02
  }
});

/* =Helpers
 ***************************************************************************/

function hexToRGB(hex, alpha) {
  var r = parseInt(hex.slice(1, 3), 16),
      g = parseInt(hex.slice(3, 5), 16),
      b = parseInt(hex.slice(5, 7), 16);

  if (alpha) {
      return "rgba(" + r + ", " + g + ", " + b + ", " + alpha + ")";
  } else {
      return "rgb(" + r + ", " + g + ", " + b + ")";
  }
}

/* =Charts
 ***************************************************************************/

const renderCharts = () => {
  const elems = document.querySelectorAll(".chart")

  for (let ctx of elems) {
    const chartCanvas = ctx.querySelector(".chart__canvas").getContext("2d")
    const chartObj = JSON.parse(ctx.querySelector(".chart__template").innerHTML)

    const type = chartObj.type
    const data = chartObj.data
    const options = chartObj.options

    /*  =Options
     *****************************************/

    // Aspect ratio
    if (options.aspectRatio) options.maintainAspectRatio = true

    // Tooltips
    options.tooltips = {}
    options.tooltips.mode = "nearest"
    options.tooltips.position = "nearest"
    options.tooltips.callbacks = {
      title: () => {}, // hide title
      label: (items, data) => {
        let item = data.datasets[items.datasetIndex]

        if (item.data[items.index].x) {
          return ` ${item.label} (${item.data[items.index].x}: ${item.data[items.index].y})`
        }
        return ` ${item.label} (${item.data[items.index]})`
      },
      labelColor: (items, chart) => {
        let item = chart.data.datasets[items.datasetIndex]
        return {
          backgroundColor: item.backgroundColor
        }
      }
    }

    /*  =Chart types
     *****************************************/

    const isHorizontalBar = type === "horizontalBar"
    const isLine = type === "line"

    if (isHorizontalBar || isLine) {
      const gridLines = (axes, dashed) => axes.forEach(axis => {
        if (!axis.gridLines) {
          let gridCfg = {
            display: true,
            color: offWhite
          }
          dashed === "dashed"
            ? axis.gridLines = Object.assign({}, gridCfg, { borderDash: dashes })
            : axis.gridLines = gridCfg
        }
      })

      gridLines(options.scales.xAxes)
      gridLines(options.scales.yAxes, "dashed")
    }

    // Scales loop
    if (options.scales) {
      const scales = axes => axes.forEach((axis, index) => {

        // Show/modify scaleLabel if defined
        if (axis.scaleLabel && axis.scaleLabel.labelString) {
          axis.scaleLabel.display = true
          axis.scaleLabel.labelString = `← ${axis.scaleLabel.labelString} →`
        }

        // Unless defined, don't draw grid border for scales > 0
        if (index >= 1 && axis.gridLines && !axis.gridLines.drawBorder) {
          axis.gridLines.drawBorder = false

        } else {
          axis.gridLines.drawBorder = true
        }
      })

      scales(options.scales.xAxes)
      scales(options.scales.yAxes)
    }

    /*  =Datasets
     *****************************************/

    for (let dataset of data.datasets) {
      dataset.borderWidth = strokeWidth

      // If no border is defined add one to == bgc
      if (dataset.backgroundColor && !dataset.borderColor) {
        dataset.borderColor = dataset.backgroundColor
      }

      // Set dataset type defaults
      if (dataset.type && dataset.type === "line") {
        if (!dataset.pointBackgroundColor) dataset.pointBackgroundColor = white
        if (!dataset.pointHoverBackgroundColor) dataset.pointHoverBackgroundColor = white
        if (!dataset.pointRadius) dataset.pointRadius = 5
        if (!dataset.pointHoverRadius) dataset.pointHoverRadius = 7
        if (!dataset.pointHitRadius) dataset.pointHitRadius = 10

        // Only set backgroundColor and/or fill
        if (!dataset.fill) dataset.fill = false
        else {
          dataset.fill = true
          dataset.backgroundColor = hexToRGB(dataset.backgroundColor, 0.125)
        }
      }
    }

    /*  =Plugins
     *****************************************/

    options.annotation = {
      annotations: [
        {
          type: "line",
          mode: "horizontal",
          scaleID: "y-monthly-sis",
          value: 100,
          borderColor: "red",
          borderWidth: 2
        }
      ]
    }

    new Chart(chartCanvas, chartObj)
  }
}

document.addEventListener("DOMContentLoaded", () => renderCharts())

/**
 * TODOs:
 * [x] Tooltip font size
 * [x] Grid font size
 * [x] Base grid-line style
 * [x] Axes label color grey
 * [ ] Create common config templates
 * [ ] JSON GUI editor
 * [ ] Show scale label if specified
 * [ ] Position secondary axes
 * [ ] Vreate DO NOT AMEND JSON options
 * [ ] Border skipped
 * [ ] Avg line
 * [ ] Aut color palette
 * [ ] Labels plugin
 */
