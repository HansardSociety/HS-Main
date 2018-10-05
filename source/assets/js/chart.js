import Chart from "chart.js"

import "chartjs-plugin-deferred"
import "chartjs-plugin-annotation"
import "chartjs-plugin-labels"

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

/* =Global plugins
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

const scalesConfig = {
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
}

Chart.scaleService.updateScaleDefaults("linear", scalesConfig)
Chart.scaleService.updateScaleDefaults("category", scalesConfig)

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

  elems.forEach(ctx => {
    const chartID = ctx.dataset.chartID
    const chartCanvas = ctx.querySelector(".chart__canvas").getContext("2d")
    const chartConfig = JSON.parse(ctx.querySelector(".chart__config").innerHTML)

    const type = chartConfig.type
    const data = chartConfig.data
    const options = chartConfig.options

    const isBar = type === "bar"
    const isDoughnut = type === "doughnut"
    const isHorizontalBar = type === "horizontalBar"
    const isLine = type === "line"

    /*  =Options
     *****************************************/

    // Aspect ratio
    if (options && options.aspectRatio) options.maintainAspectRatio = true

    // Tooltips
    options.tooltips = {}
    options.tooltips.mode = isDoughnut ? "nearest" : "x"
    options.tooltips.position = "nearest"

    // Tooltips: line, horizontalBar
    if (isLine || isHorizontalBar) {
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
    }

    // Tooltips: doughnut
    if (isDoughnut) {
      options.tooltips.callbacks = {
        label: (item, data) => {
          const dataset = data.datasets[item.datasetIndex]
          const label = data.labels[item.index]
          const value = dataset.data[item.index]

          var total = 0
          dataset.data.forEach(item => total += item)
          const percent = Math.round((value / total) * 100)

          return ` ${label}: ${value} (${percent}%)`
        }
      }
    }

    /*  =Chart types
     *****************************************/

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

    // Modify colours
    const modCol = col => {
      if (col.match(/#f|#e/)) return chroma(col).darken(2).saturate(2).hex()
      return chroma(col).saturate(1.5).hex()
    }

    // Brewer colors
    const brewerColors = palette => {
      var evenColors = []
      var oddColors = []

      chroma.brewer[palette].forEach((hex, i) => {
        if (i % 2) evenColors.push(modCol(hex))
        else oddColors.unshift(modCol(hex))
      })

      return evenColors.reverse().concat(oddColors)
    }

    const colorScale = (options) => {

      // Defaults
      let {
        palette = [brandGreen, lightGrey],
        order = "random",
        range = 5,
        colorStops = false
      } = options

      var scale = []
      var evenColors = []
      var oddColors = []

      let colors = chroma
        .scale(palette)
        .domain(colorStops ? colorStops : [0, 100])
        .mode("lab")
        .colors(range)

      if (order === "random") {
        colors.forEach((col, i) => {
          if (i % 2) evenColors.push(chroma(col).saturate(1.5).hex())
          else oddColors.unshift(chroma(col).saturate(1.5).hex())
        })

        evenColors.reverse().concat(oddColors)
          .forEach(col => scale.push(chroma(col).saturate(1.5).hex()))

      } else {
        colors.forEach(col => scale.push(chroma(col).saturate(1.5).hex()))
      }

      return scale
    }

    if (chartConfig.colors) {
      chartConfig.colors.forEach(color => {
        let matchDataset = data.datasets.filter(ds => ds.type === color.chartType)

        matchDataset.forEach((dataset, i) => {
          if (!dataset.backgroundColor) {

            // If colour range is set
            if (Array.isArray(color.palette)) {
              let colorConfig = {}
              if (color.palette) colorConfig.palette = color.palette
              if (color.randomize) colorConfig.randomize = color.randomize
              if (color.range) colorConfig.range = color.range
              if (color.colorStops) colorConfig.colorStops = color.colorStops

              if (matchDataset.length > 1) dataset.backgroundColor = colorScale(colorConfig)[i]
              else dataset.backgroundColor = colorScale(colorConfig)

            } else {
              if (matchDataset.length > 1) dataset.backgroundColor = brewerColors(color.palette)[i]
              else dataset.backgroundColor = brewerColors(color.palette)
            }
          }
        })
      })
    }

    data.datasets.forEach(dataset => {

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

    /*  =Local plugins
     *****************************************/

    if (options.annotation) options.annotation = options.annotation
    if (options.annotation && options.annotation.annotations) {
      const annotations = options.annotation.annotations
      annotations.forEach(annotation => {
        if (annotation.label && annotation.label.content) {
          annotation.label.enabled = true
          annotation.label.backgroundColor = black
          annotation.label.fontColor = white
          annotation.label.fontWeight = "normal"
          annotation.label.fontFamily = ff01
          annotation.label.fontSize = rem675
          annotation.label.xPadding = rem50
          annotation.label.yPadding = rem50
          annotation.label.cornerRadius = 8
          annotation.label.borderWidth = 0
        }
      })
    }

    new Chart(chartCanvas, chartConfig)
  })
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
 * [ ] Separate annotatio box on cful
 * [ ] MUST add dataset type to all nested datasets regardless - good practice
 */
