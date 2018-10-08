import Chart from "chart.js"

import "chartjs-plugin-labels"
import "chartjs-plugin-annotation"
import "chartjs-plugin-datalabels"

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
const strokeWidth = 2
const dashes = [6, 3]

// Sizes
const rem100 = 18
const rem150 = 18 * 1.5
const rem125 = 18 * 1.25
const rem075 = rem100 * .75
const rem0675 = rem100 * .675
const rem050 = rem100 * .5
const rem025 = rem100 * .25

/* =Global config
 ***************************************************************************/

const def = Chart.defaults.global

// Core
def.defaultFontFamily = ff01;
def.defaultFontSize = rem0675;
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
def.tooltips.xPadding = rem050
def.tooltips.yPadding = rem050
def.tooltips.multiKeyBackground = white
def.tooltips.borderColor = white
def.tooltips.titleMarginBottom = rem050
def.tooltips.bodyFontSize = rem0675
def.tooltips.bodyFontColor = white

/* =Global plugins
 ***************************************************************************/

/*  =Deferred
 *****************************************/

def.plugins.deferred = false
def.plugins.labels = false

/*  =Labels/ Data labels
 *****************************************/

def.plugins.datalabels = false

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
  elems.forEach((ctx, ctxIndex) => {
    const chartCanvas = ctx.querySelector(".chart__canvas").getContext("2d")
    const chartConfig = JSON.parse(ctx.querySelector(".chart__config").innerHTML)

    const type = chartConfig.type
    const data = chartConfig.data
    const options = chartConfig.options

    const isBar = type === "bar"
    const isDoughnut = type === "doughnut"
    const isHorizontalBar = type === "horizontalBar"
    const isPie = type === "pie"
    const isLine = type === "line"

    /* =Datasets
     ***************************************************************************/

    /*  =Dataset colors: helpers
     *****************************************/

    // Modify colors
    const modCol = col => {
      if (col.match(/#f|#e/)) return chroma(col).darken(2).saturate(2).hex()
      return chroma(col).saturate(1.5).hex()
    }

    // Brewer colors
    const brewerColors = palette => {
      var evenColors = []
      var oddColors = []

      chroma.brewer[palette].forEach((hex, i) => i % 2
        ? evenColors.push(modCol(hex))
        : oddColors.unshift(modCol(hex)))

      return evenColors.reverse().concat(oddColors)
    }

    // Color scale
    const colorScale = options => {

      // Defaults
      let {
        palette = [brandGreen, lightGrey], // set default scale if incorrect
        order = "shuffle", // shuffle, scale
        range = 5
      } = options

      var scale = []
      var evenColors = []
      var oddColors = []

      let colors = chroma
        .scale(palette)
        .mode("lab")
        .colors(range)

      if (order = "scale") { // Scale
        colors.forEach(col => scale.push(chroma(col).saturate(1.5).hex()))
      } else { // shuffle
        colors.forEach((col, i) => i % 2
          ? evenColors.push(chroma(col).saturate(1.5).hex())
          : oddColors.unshift(chroma(col).saturate(1.5).hex()))
        evenColors.reverse().concat(oddColors)
          .forEach(col => scale.push(chroma(col).saturate(1.5).hex()))
      }

      return scale
    }

    for (let [datasetIndex, dataset] of data.datasets.entries()) {
      const isDatasetBar = dataset.type && dataset.type === "bar"
      const isDatasetDoughnut = dataset.type && dataset.type === "doughnut"
      const isDatasetHorizontalBar = dataset.type && dataset.type === "horizontalBar"
      const isDatasetLine = dataset.type && dataset.type === "line"
      const isDatasetPie = dataset.type && dataset.type === "pie"

      /*  =Dataset: Set colors
      *****************************************/

      if (chartConfig.customConfig && chartConfig.customConfig.colors) {
        for (let colorConfig of chartConfig.customConfig.colors) {
          if (!dataset.backgroundColor) {
            for (let [datasetIdIndex, datasetID] of colorConfig.datasetIDs.entries()) {
              if (datasetID == dataset.datasetID) {
                if (isDatasetLine || isDatasetBar || isDatasetHorizontalBar) {
                  if (colorConfig.palette.constructor === String) {
                    dataset.backgroundColor = brewerColors(colorConfig.palette)[datasetIdIndex]
                    break
                  } else {
                    dataset.backgroundColor = colorScale({ palette: colorConfig.palette })
                    break
                  }
                } else {
                  if (colorConfig.palette.constructor === String) {
                    dataset.backgroundColor = brewerColors(colorConfig.palette)
                    break
                  } else {
                    dataset.backgroundColor = colorScale(colorConfig.palette)
                    break
                  }
                }
              }
            }
          }
        }
      }

      /*  =Dataset: Apply colors
      *****************************************/

      dataset.borderWidth = strokeWidth
      dataset.hoverBackgroundColor = dataset.backgroundColor

      // If no border is defined add one to == bgc
      if (dataset.backgroundColor && !dataset.borderColor) {
        if (isDatasetDoughnut || isDatasetPie) {
          dataset.borderColor = white
          dataset.hoverBorderColor = white
        } else {
          dataset.borderColor = dataset.backgroundColor
          dataset.hoverBorderColor = dataset.backgroundColor
        }
      }

      // Set dataset defaults
      if (isDatasetLine) {
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
    }

    /* =Options
     ***************************************************************************/

    // Aspect ratio
    if (options && options.aspectRatio) options.maintainAspectRatio = true

    /*  =Options: Tooltips
     *****************************************/

    // General
    options.tooltips = {}
    options.tooltips.mode = "nearest"
    options.tooltips.position = "average"

    /*  =Options: Line / horizontal bar
     *****************************************/

    if (isLine || isHorizontalBar) {

      // Tooltips
      options.tooltips.callbacks = {
        title: () => {}, // hide title
        label: (item, data) => {
          const isDatasetBar = data.datasets[item.datasetIndex].type === "bar"
          const isDatasetDoughnut = data.datasets[item.datasetIndex].type === "doughnut"
          const isDatasetHorizontalBar = data.datasets[item.datasetIndex].type === "horizontalBar"
          const isDatasetLine = data.datasets[item.datasetIndex].type === "line"
          const isDatasetPie = data.datasets[item.datasetIndex].type === "pie"

          var tooltipText

          if (isDatasetHorizontalBar && item.yLabel) {
            tooltipText = item.yLabel

          } else {
            let datasetItem = data.datasets[item.datasetIndex]

            if (datasetItem.data[item.index].x) {
              tooltipText = ` ${datasetItem.label} (${datasetItem.data[item.index].x}: ${datasetItem.data[item.index].y})`
            } {
              tooltipText = ` ${datasetItem.label} (${datasetItem.data[item.index]})`
            }
          }

          console.log(
            "****************** TOOLTIP LABEL ******************",
            "\nITEM =>", item,
            "\nDATA =>", data
          )

          return tooltipText
        },
        labelColor: (item, chart) => {
          const isDatasetBar = data.datasets[item.datasetIndex].type === "bar"
          const isDatasetDoughnut = data.datasets[item.datasetIndex].type === "doughnut"
          const isDatasetHorizontalBar = data.datasets[item.datasetIndex].type === "horizontalBar"
          const isDatasetLine = data.datasets[item.datasetIndex].type === "line"
          const isDatasetPie = data.datasets[item.datasetIndex].type === "pie"

          let datasetItem = chart.data.datasets[item.datasetIndex]
          let backgroundColor

          console.log(
            "****************** TOOLTIP LABEL COLOR ******************",
            "\nITEM =>", item,
            "\nDATA =>", data,
            "\nDATASET ITEM =>", datasetItem.backgroundColor[item.index],
          )

          if (datasetItem.backgroundColor.constructor === String) {
            backgroundColor = datasetItem.backgroundColor
          } else {
            backgroundColor = datasetItem.backgroundColor[item.index]
          }

          return {
            backgroundColor: backgroundColor,
          }
        }
      }

      // Grid lines
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

    /*  =Options: Doughnut
     *****************************************/

    if (isDoughnut || isPie) {
      if (isDoughnut) options.cutoutPercentage = 25 // Cutout
      options.rotation = (-0.5 * Math.PI) * 180

      // Allow padding for labels overflow
      options.layout = {}
      options.layout.padding = {
        top: rem050,
        right: rem050,
        bottom: rem050,
        left: rem050
      }

      // Tooltips: Doughnut
      options.tooltips.callbacks = {
        title: (item, data) => {
          const dataset = data.datasets[item[0].datasetIndex]
          if (dataset.label) return dataset.label
          return false
        },
        label: (item, data) => {
          const dataset = data.datasets[item.datasetIndex]
          const value = dataset.data[item.index]
          const label = data.labels[item.index]

          let total = dataset.data.reduce((a, b) => a + b, 0)
          const percent = `${((value / total) * 100).toFixed(1)}`.replace(".0", "")

          return ` ${label}: ${value} (${percent}%)`
        }
      }
    }

    /*  =Options: Gridlines
     *****************************************/

    // Scales loop
    if (options.scales) {
      // const scales = axes => axes.forEach((axis, index) => {

      //   // Show/modify scaleLabel if defined
      //   if (axis.scaleLabel && axis.scaleLabel.labelString) {
      //     axis.scaleLabel.display = true
      //     axis.scaleLabel.labelString = `← ${axis.scaleLabel.labelString} →`
      //   }

      //   // Unless defined, don't draw grid border for scales > 0
      //   if (index >= 1 && axis.gridLines && !axis.gridLines.drawBorder) {
      //     axis.gridLines.drawBorder = false
      //   } else {
      //     axis.gridLines.drawBorder = true
      //   }
      // })

      // scales(options.scales.xAxes)
      // scales(options.scales.yAxes)
    }

    /* =Options: Plugins
     ***************************************************************************/

    options.plugins = {}

    /*  =Plugins: Annotation
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
          annotation.label.fontSize = rem0675
          annotation.label.xPadding = rem050
          annotation.label.yPadding = rem050
          annotation.label.cornerRadius = 8
          annotation.label.borderWidth = 0
        }
      })
    }

    /* =Plugins: Bars
     ***************************************************************************/

    if (isBar || isHorizontalBar) {

      // options.plugins.datalabels = {
      //   display: context => {
      //     if (context.dataset.data[context.dataIndex] === 0) return false
      //     else return true
      //   },
      //   anchor: "center",
      //   color: white,
      //   font: {
      //     size: rem0675,
      //     family: ff02
      //   },
      //   textAlign: "center"
      // }
    }

    /*  =Plugins: Doughnut
     *****************************************/

    if (isDoughnut || isPie) {
      options.plugins.labels = {
        render: "percentage",
        fontFamily: ff02,
        fontSize: rem075,
        fontColor: white,
        textShadow: true
      }

      // Data labels
      options.plugins.datalabels = {
        display: context => {
          if (context.dataset.data[context.dataIndex] === 0) return false
          else return true
        },
        backgroundColor: context => {
          return context.dataset.backgroundColor
        },
        anchor: "end",
        color: white,
        borderColor: white,
        borderRadius: 25,
        borderWidth: strokeWidth,
        font: {
          size: rem0675,
          family: ff02
        },
        textAlign: "center",
        padding: {
          top: rem025,
          right: rem050,
          bottom: rem025,
          left: rem050
        }
      }
    }

    new Chart(chartCanvas, chartConfig)
  })
}

document.addEventListener("DOMContentLoaded", () => renderCharts())

/* =TODOs
 ***************************************************************************/

/**
 * [x] Tooltip font size
 * [ ] Rotate nner doughnut
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
 * [x] Aut color palette
 * [x] Labels plugin
 * [ ] MUST add dataset type to all nested datasets regardless - good practice
 * [ ] Cleanup color functions/palettes
 * [ ] How to use section in post, eg. turn off legends
 * [ ] Note: Padding always light to dark
 * [ ] Set chart__container width/height (contentful?)
 * [ ] Merge tooltips configs
 * [ ] Create all possible charts
 * [ ] Auto-populate nested charts
 */

/* =Schema
 ***************************************************************************/

/**
 *  chartConfig: {
 *    data: {
 *      datasets: [
 *        {
 *          data:
 *        }
 *      ]
 *   }
 * }
 */
