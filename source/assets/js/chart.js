import Chart from "chart.js"
import "chartjs-plugin-deferred"
import "chartjs-plugin-annotation"

import chroma from "chroma-js"

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

const def = Chart.defaults.global

// Core
def.defaultFontFamily = ff01;
def.defaultFontSize = rem675;
def.defaultFontColor = black;

// Animations
def.animation.duration = 800

// Interactions
def.hover.mode = "nearest"
def.hover.intersect = true

// Layout
def.layout.padding = 0

// Legend
def.legend.position = "bottom"
def.legend.labels.boxWidth = rem150

// Responsive
def.responsive = true
def.maintainAspectRatio = false

// Tooltips
def.tooltips.backgroundColor = black
def.tooltips.bodySpacing = 4
def.tooltips.caretSize = 0
def.tooltips.cornerRadius = 8
def.tooltips.xPadding = rem50
def.tooltips.yPadding = rem50
def.tooltips.multiKeyBackground = white
def.tooltips.borderColor = white
def.tooltips.titleMarginBottom = rem50
def.tooltips.bodyFontSize = rem675
def.tooltips.bodyFontColor = white

/* =Plugins
 ***************************************************************************/

def.plugins.deferred = {
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

// Hex to RGB
function hexToRGBA(hex, alpha) {
  var r = parseInt(hex.slice(1, 3), 16),
      g = parseInt(hex.slice(3, 5), 16),
      b = parseInt(hex.slice(5, 7), 16);

  return `rgba(${r}, ${g}, ${b}, ${alpha}`
}

/* =Charts
 ***************************************************************************/

const renderCharts = () => {
  const elems = document.querySelectorAll(".chart")

  for (let ctx of elems) {
    const chartCanvas = ctx.querySelector(".chart__canvas").getContext("2d")
    const chartConfig = JSON.parse(ctx.querySelector(".chart__config").innerHTML)

    const type = chartConfig.type
    const data = chartConfig.data
    const options = chartConfig.options

    /*  =Options
     *****************************************/

    // Aspect ratio
    if (options.aspectRatio) options.maintainAspectRatio = true

    // Tooltips
    options.tooltips = {}
    options.tooltips.mode = "x"
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

    const isBar = type === "basr"
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

    // Darken light colors
    const generateColors = palette => {
      var colorPalette = []

      chroma.brewer[palette].forEach((hex, i) => {
        if (i % 2) {
          if (hex.match(/#f|#e/)) colorPalette.push(chroma(hex).darken(1).hex())
          else colorPalette.push(hex)

        } else {
          if (hex.match(/#f|#e/)) colorPalette.unshift(chroma(hex).darken(1).hex())
          else colorPalette.unshift(hex)
        }
      })

      return colorPalette
    }

    data.datasets.forEach((dataset, datasetIndex) => {

      var datasetColor = ""
      chartConfig.colors.forEach(col => {
        if (dataset.type === col.chartType) {
          datasetColor = generateColors(col.palette)[datasetIndex]
        }
      })

      if (!dataset.backgroundColor) dataset.backgroundColor = datasetColor

      dataset.borderWidth = strokeWidth

      dataset.hoverBackgroundColor = dataset.backgroundColor

      // If no border is defined add one to == bgc
      if (dataset.backgroundColor && !dataset.borderColor) {
        dataset.borderColor = dataset.backgroundColor
        dataset.hoverBorderColor = dataset.backgroundColor
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
          dataset.backgroundColor = hexToRGBA(dataset.backgroundColor, 0.125)
        }
      }
    })

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

    new Chart(chartCanvas, chartConfig)
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
 * [x] Show scale label if specified
 * [x] Position secondary axes
 * [ ] Create DO NOT AMEND JSON options
 * [x] Border skipped
 * [ ] Avg line
 * [ ] Aut color palette
 * [ ] Labels plugin
 * [ ] MUST add dataset type to all nested datasets regardless - good practice
 */
