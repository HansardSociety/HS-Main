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
const rem0125 = rem100 * .125

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
def.legend.position = "top"
def.legend.labels.boxWidth = rem150
def.legend.labels.usePointStyle = true

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
      if (col.match(/#f|#e/)) return chroma(col).darken(2).saturate(1.5).hex()
      return chroma(col).saturate(1.5).hex()
    }

    // Brewer colors
    const brewerColors = options => {
      let colors
      let evenColors = []
      let oddColors = []
      let {
        palette = "Spectral",
        order = "shuffle" // shuffle, scale, static
      } = options

      if (order === "shuffle") {
        chroma.brewer[palette].forEach((hex, i) => i % 2
          ? evenColors.push(modCol(hex))
          : oddColors.unshift(modCol(hex)))
        colors = evenColors.reverse().concat(oddColors)
      } else {
        colors = chroma.brewer[palette]
      }

      return colors
    }

    // Color scale
    const colorScale = options => {

      // Defaults
      let {
        palette = [brandGreen, lightGrey], // set default scale if incorrect
        order = "shuffle", // shuffle, scale, static
        range = 5
      } = options

      var scale = []
      var evenColors = []
      var oddColors = []

      let colors = chroma
        .scale(palette)
        .mode("lab")
        .colors(range)

      if (order === "scale") { // Scale
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

    /*  =Datasets
     *****************************************/

    for (let dataset of data.datasets) {
      if (!dataset.type) dataset.type = chartConfig.type
      const isDatasetBar = dataset.type && dataset.type === "bar"
      const isDatasetDoughnut = dataset.type && dataset.type === "doughnut"
      const isDatasetHorizontalBar = dataset.type && dataset.type === "horizontalBar"
      const isDatasetLine = dataset.type && dataset.type === "line"
      const isDatasetPie = dataset.type && dataset.type === "pie"

      /*  =Dataset: Set colors
      *****************************************/

      const customConfig = chartConfig.customConfig

      if (customConfig && customConfig.colors) {
        if (!dataset.backgroundColor) {
          for (let colorConfig of customConfig.colors) {
            for (let [datasetIdIndex, datasetID] of colorConfig.datasetIDs.entries()) {
              if (datasetID === dataset.datasetID) {
                const isPaletteString = colorConfig.palette.constructor === String
                const isPaletteStatic = colorConfig.palette === "static"
                let selectColorPalette

                if (isPaletteString) selectColorPalette = brewerColors({ // Brewer
                    palette: colorConfig.palette,
                    order: colorConfig.order })
                else if (isPaletteStatic) // Static
                  selectColorPalette = colorConfig.palette
                else selectColorPalette = colorScale({ // Scale
                  palette: colorConfig.palette,
                  order: colorConfig.order,
                  range: colorConfig.range })

                if (isDatasetBar || isDatasetHorizontalBar || isDatasetLine) {

                  dataset.backgroundColor = selectColorPalette[datasetIdIndex]
                  break

                  // const isUniqueType = data.datasets.filter(i => i.type === dataset.type).length === 1
                  // if (isUniqueType) {
                  //   dataset.backgroundColor = selectColorPalette
                  //   break
                  // } else {
                  //   dataset.backgroundColor = selectColorPalette[datasetIdIndex]
                  //   break
                  // }
                } else {
                  const zerosInDataset = dataset.data.filter(i => i !== 0).length

                  console.log(dataset.type, selectColorPalette)

                  dataset.backgroundColor = selectColorPalette
                  break
                }
              }
            } // END loop: => colorConfig.datasetIDs
          } // END loop: customConfig.colors
        } else {
          dataset.backgroundColor = dataset.backgroundColor
        }
      }

      /*  =Dataset: Apply colors
      *****************************************/

      dataset.borderWidth = strokeWidth
      dataset.hoverBackgroundColor = dataset.backgroundColor

      // If no border is defined add one to == bgc
      if (dataset.backgroundColor && !dataset.borderColor) {
        if (isDatasetDoughnut) {
          dataset.borderColor = hexToRGBA(black, 0.8)
          dataset.hoverBorderColor = hexToRGBA(black, 0.8)
        } else if (isDatasetPie) {
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

    /*  =Tooltips
     *****************************************/

    options.tooltips = {}
    options.tooltips.mode = "nearest"
    options.tooltips.position = "nearest"

    options.tooltips.callbacks = {
      title: (item, data) => {
        const datasetItem = data.datasets[item[0].datasetIndex]
        const isDatasetDoughnut = datasetItem.type === "doughnut"
        const isDatasetPie = datasetItem.type === "pie"

        let title = false
        if ((isDatasetPie || isDatasetDoughnut) && datasetItem.label) title = datasetItem.label
        return title
      }, // END: => callbacks
      label: (item, data) => {
        const datasetItem = data.datasets[item.datasetIndex]
        const isDatasetHorizontalBar = datasetItem.type === "horizontalBar"
        const isDatasetPie = datasetItem.type === "pie"
        const isDatasetDoughnut = datasetItem.type === "doughnut"

        var tooltipText

        if (isDatasetHorizontalBar && item.yLabel) { // Horizontal bar
          tooltipText = ` ${item.yLabel}`

        } else if (isDatasetDoughnut || isDatasetPie) { // Doughnut or Pie
          const value = datasetItem.data[item.index]
          const label = data.labels[item.index]

          let total = datasetItem.data.reduce((a, b) => a + b, 0)
          const pc = ((value / total) * 100).toFixed(1)
          const pcStr = `${pc}`.replace(".0", "")

          tooltipText = ` ${label}: ${value} (${pcStr}%)`

        } else { // Line
          const itemLabel = datasetItem.label
          const itemIndex = datasetItem.data[item.index]

          if (datasetItem.data[item.index].x) tooltipText = ` ${itemLabel} (${itemIndex.x}: ${itemIndex.y})`
          else tooltipText = ` ${itemLabel} (${itemIndex})`
        }

        return tooltipText
      }, // END: => label
      labelColor: (item, chart) => {
        const datasetItem = chart.data.datasets[item.datasetIndex]
        const isBgcString = datasetItem.backgroundColor.constructor === String
        let backgroundColor

        if (isBgcString) backgroundColor = datasetItem.backgroundColor
        else backgroundColor = datasetItem.backgroundColor[item.index]
        return { backgroundColor: backgroundColor }
      } // END: => labelColor
    } // END: options.tooltips.tooltips

    /*  =Misc
     *****************************************/

    if (isDoughnut) {
      options.cutoutPercentage = 25
      options.rotation = Math.PI * 2 * .5
    }

    /* =Plugins
     ***************************************************************************/

    options.plugins = {}

    /*  =Annotation
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
    } // END: options.annotation

    /* =Labels
     ***************************************************************************/

    const isAnnotationConfig = (item, configKey, configVal) => {
      let result = false
      const runcheck = chartConfig.customConfig.annotations.filter(annotationConfig => {
        return annotationConfig.datasetIDs.filter(id => {
          return id === item.dataset.datasetID
        }) && annotationConfig[configKey] === configVal
      })
      if (runcheck.length >= 1) result = true
      return result
    }

    options.plugins.labels = {
      fontFamily: ff02,
      fontSize: isPie ? rem125 : rem0675,
      fontColor: item => {
        let color = white
        if (isAnnotationConfig(item, "fontColor", "black")) color = black
        return color
      },
      render: item => {
        let labelText = ""

        // Annotations
        if (chartConfig.customConfig.annotations) {
          if (isAnnotationConfig(item, "type", "radialTitle") && item.index === 0) {
            labelText = item.dataset.label
          }
          if (isAnnotationConfig(item, "type", "numericLabel")) labelText = item.value
        }
        return labelText
      }
    }

    // TODO: Create dataset specific labels
    if (isDoughnut) options.plugins.labels.arc = true

    /*  =Datalabels
     *****************************************/

    // Data labels
    options.plugins.datalabels = {
      display: context => {
        if (context.dataset.data[context.dataIndex] === 0) return false
        return true
      },
      align: "center",
      color: white,
      borderColor: white,
      font: {
        size: rem0675,
        family: ff02
      },
      formatter: (value, context) => {
        if (context.dataset.type === "doughnut" || context.dataset.type === "pie") {
          let total = context.dataset.data.reduce((a, b) => a + b, 0)
          const pc = ((value / total) * 100).toFixed(1)
          const pcStr = `${pc}`.replace(".0", "")

          return `${pcStr}%`
        }
        return ""
      }
    }

    if (isDoughnut || isPie) {
      options.plugins.datalabels.padding = isPie ? rem025 : rem0125
      options.plugins.datalabels.borderColor = white
      options.plugins.datalabels.backgroundColor = context => {
        return context.dataset.backgroundColor
      }
      options.plugins.datalabels.anchor = "end"
      options.plugins.datalabels.borderColor = white
      options.plugins.datalabels.borderWidth = isPie ? 1 : 0
    }

    new Chart(chartCanvas, chartConfig)
  })
}

document.addEventListener("DOMContentLoaded", () => renderCharts())

/* =TODOs
 ***************************************************************************/

/**
 * [x] Tooltip font size
 * [x] Grid font size
 * [x] Base grid-line style
 * [x] Axes label color grey
 * [ ] Create common config templates
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
 * [ ] Nested doughnut must share color palette
 * [ ] Add min-width for eg. departments chart
 * [ ] Create dataset-specific override of labels plugin
 * [ ] Make sure Brewer palettes have enough colours for large datasets
 * [ ] Make both chart row HTML the same
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
 * radialTitle, value
 */
