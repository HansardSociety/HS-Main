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

// Title
def.title.display = true
def.title.text = "Cite as: Hansard Society"
def.title.position = "bottom"
def.title.fontColor = midGrey

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

    const customAnnotations = chartConfig.customConfig.annotations

    /* =Options
     ***************************************************************************/

    // Aspect ratio
    if (options && options.aspectRatio) options.maintainAspectRatio = true

    /*  =Helpers
     *****************************************/

    const calculatePercentage = (dataArr, itemVal) => {
      let total = dataArr.reduce((a, b) => a + b, 0)
      const pc = ((itemVal / total) * 100).toFixed(1)
      return `${pc}`.replace(".0", "")
    }

    /*  =Tooltips
     *****************************************/

    options.tooltips = {}
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
          const pcStr = calculatePercentage(datasetItem.data, value)

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

    /*  =Scales
     *****************************************/

    if (isBar) {
      if (options.scales.xAxes) {
        // =HERE
      }

    }

    /*  =Misc
     *****************************************/

    if (isDoughnut) {
      options.cutoutPercentage = 10
      options.rotation = Math.PI * 2 * .5
    }

    /* =Plugins
     ***************************************************************************/

    options.plugins = {}

    /*  =Helpers
     *****************************************/

    const isAnnotationConfig = (datasetItem, configKey, configVal) => {
      let result = false
      const runcheck = customAnnotations.filter(annotationConfig => {
        return annotationConfig.datasetIDs.filter(id => {
          return id === datasetItem.datasetID
        }) && annotationConfig[configKey] === configVal
      })
      if (runcheck.length >= 1) result = true
      return result
    }

    const getAnnotationConfig = datasetItem => {
      let result = false
      let config
      const runcheck = customAnnotations.filter(annotationConfig => {
        config = annotationConfig
        if (annotationConfig.datasetIDs) {
          return annotationConfig.datasetIDs.filter(id => {
            return id === datasetItem.datasetID
          })
        }
      })
      if (runcheck.length >= 1) result = config
      return result
    }

    /*  =Annotation
     *****************************************/

    options.annotation = {}
    options.annotation.annotations = []

    if (customAnnotations) {
      let axesAnnotations = customAnnotations.filter(i => {
        const isLineVertical = i.type === "axisLineVertical"
        const isLineHorizontal = i.type === "axisLineHorizontal"
        const isBox = i.type === "axisBox"

        return isLineVertical || isLineHorizontal || isBox
      })

      if (axesAnnotations && axesAnnotations.length >= 1) {
        axesAnnotations.forEach(i => {
          let config = {}
          const isLineVertical = i.type === "axisLineVertical"
          const isLineHorizontal = i.type === "axisLineHorizontal"
          const isBox = i.type === "axisBox"

          if (isLineVertical || isLineHorizontal) {
            config = {
              scaleID: i.axisID,
              type: "line",
              value: i.position,
              mode: i.type === "axisLineVertical" ? "vertical" : "horizontal",
              borderColor: "#e22828",
              borderWidth: 2,
              borderDash: dashes,
            }

            if (i.label) {
              config.label = i.label
              config.label.enabled = true,
              config.label.fontSize = rem0675,
              config.label.fontFamily = ff01,
              config.label.fontStyle = "normal",
              config.label.xPadding = rem025,
              config.label.yPadding = rem0125,
              config.label.backgroundColor = black,
              config.label.cornerRadius = 2
              config.label.borderWidth = 0
            }
            console.log(config)

          } else if (isBox) {
            config = {
              xScaleID: i.xAxisID,
              yScaleID: i.yAxisID,
              type: "box",
              backgroundColor: hexToRGBA("#3dc438", 0.25)
            }

            if (i.xPosition) {
              config.xMin = i.xPosition[0]
              config.xMax = i.xPosition[1]
            }

            if (i.yPosition) {
              // FINISH
            }
          }

          options.annotation.annotations.push(config)
        })
      }
    }

    // if (options.annotation && options.annotation.annotations) {
    //   const annotations = options.annotation.annotations

    //   annotations.forEach(annotation => {
    //     if (annotation.label && annotation.label.content) {
    //       annotation.label.enabled = true
    //       annotation.label.backgroundColor = black
    //       annotation.label.fontColor = white
    //       annotation.label.fontWeight = "normal"
    //       annotation.label.fontFamily = ff01
    //       annotation.label.fontSize = rem0675
    //       annotation.label.xPadding = rem050
    //       annotation.label.yPadding = rem050
    //       annotation.label.cornerRadius = 8
    //       annotation.label.borderWidth = 0
    //     }
    //   })
    // } // END: options.annotation

    /*  =Labels
     *****************************************/

    if (isDoughnut) {
      options.plugins.labels = {
        arc: true,
        fontFamily: ff01,
        fontSize: rem075,
        fontColor: item => {
          let color = white
          let annotation = isAnnotationConfig(item.dataset, "fontColor", "black")
          if (annotation) color = annotation.fontColor
          return color
        },
        render: item => {
          let labelText = ""

          // Annotations
          if (customAnnotations) {
            if (isAnnotationConfig(item.dataset, "type", "radialTitle") && item.index === 0) {
              labelText = `${item.dataset.label}`
            }
            if (isAnnotationConfig(item.dataset, "type", "numericLabel")) labelText = item.value
          }
          return labelText
        }
      }
    }

    /*  =Datalabels
     *****************************************/

    // Data labels
    options.plugins.datalabels = {
      display: context => {
        if (context.dataset.data[context.dataIndex] === 0) return false
        return true
      },
      align: "center",
      borderColor: white,
      font: {
        size: rem0675,
        family: ff02
      },
      formatter: (value, context) => {
        const isDatasetBar = context.dataset.type === "bar"
        const isDatasetDoughnut = context.dataset.type === "doughnut"
        const isDatasetHorizontalBar = context.dataset.type === "horizontalBar"
        const isDatasetLine = context.dataset.type === "line"
        const isDatasetPie = context.dataset.type === "pie"
        const isDatasetPolarArea = context.dataset.type === "polarArea"

        let labelText = ""

        // Percentage
        if (isDatasetDoughnut || isDatasetPie) {
          const pcStr = calculatePercentage(context.dataset.data, value)

          if (getAnnotationConfig(context.dataset).type === "percentageValueLabel") {
            labelText = `${pcStr}% (${value})`
          } else {
            labelText = `${pcStr}%`
          }
        } else if (isDatasetBar || isDatasetHorizontalBar) {
          labelText = value
        }

        return labelText
      }
    }

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
        colors.forEach(col => scale.push(chroma(col).saturate(1).hex()))
      } else { // shuffle
        colors.forEach((col, i) => i % 2
          ? evenColors.push(chroma(col).saturate(1).hex())
          : oddColors.unshift(chroma(col).saturate(1).hex()))
        evenColors.reverse().concat(oddColors)
          .forEach(col => scale.push(chroma(col).saturate(1).hex()))
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

      const customConfig = chartConfig.customConfig

      let annotationConfig
      if (customConfig.annotations) annotationConfig = getAnnotationConfig(dataset)

      /*  =Dataset: Set colors
      *****************************************/

      dataset.backgroundColor = dataset.backgroundColor
      dataset.hoverBackgroundColor = dataset.backgroundColor
      dataset.hoverBorderColor = dataset.backgroundColor

      if (customConfig && customConfig.colors) {
        if (!dataset.backgroundColor) {
          for (let colorConfig of customConfig.colors) {
            for (let [datasetIdIndex, datasetID] of colorConfig.datasetIDs.entries()) {
              if (datasetID === dataset.datasetID) {
                const isPaletteString = colorConfig.palette.constructor === String
                let selectColorPalette

                if (isPaletteString) selectColorPalette = brewerColors({ // Brewer
                  palette: colorConfig.palette,
                  order: colorConfig.order })
                else {
                  if (colorConfig.order === "scale") {
                    selectColorPalette = colorScale({ // Scale
                      palette: colorConfig.palette,
                      order: colorConfig.order,
                      range: colorConfig.range })
                  } else {
                    selectColorPalette = colorConfig.palette
                  }
                }

                if (!colorConfig.incrementalColors && (isDatasetBar || isDatasetHorizontalBar || isDatasetLine)) {
                  dataset.backgroundColor = selectColorPalette[datasetIdIndex]
                  break
                } else {
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

      /*  =Datalabels: Datasets
       *****************************************/

      dataset.datalabels = {}
      dataset.datalabels.font = {}
      dataset.datalabels.color = white

      if (isDatasetDoughnut && annotationConfig.type === "radialTitle") {
        dataset.datalabels.padding = rem0125
        dataset.datalabels.backgroundColor = context => {
          return context.dataset.backgroundColor
        }
        dataset.datalabels.anchor = "end"
        dataset.datalabels.font.size = rem0675

      } else if (isDatasetPie
        && (annotationConfig.type === "percentageLabel"
          || annotationConfig.type === "percentageValueLabel")) {

        if (annotationConfig.fontSize === "large") dataset.datalabels.font.size = rem100
        if (annotationConfig.fontSize === "medium") dataset.datalabels.font.size = rem075
        if (annotationConfig.fontSize === "small") dataset.datalabels.font.size = rem0675
        if (annotationConfig.color === "black") dataset.datalabels.color = black
      }

      /*  =Dataset: Apply colors
      *****************************************/

      dataset.borderWidth = strokeWidth

      // If no border is defined add one to == bgc
      if (dataset.backgroundColor && !dataset.borderColor) {
        if (isDatasetDoughnut) {
          dataset.borderColor = hexToRGBA(black, 0.8)
          dataset.hoverBorderColor = hexToRGBA(black, 0.8)
          dataset.borderWidth = strokeWidth
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
        if (!dataset.pointBackgroundColor) dataset.pointBackgroundColor = dataset.backgroundColor
        if (!dataset.pointHoverBackgroundColor) dataset.pointHoverBackgroundColor = dataset.backgroundColor
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
 * [ ] Chekc if getAnnotationConfig works on multiple annotation configs
 * [ ] Parent char always takes priority on gridLine styles
 * [ ] Must set either BGC or custoConfig color for chart to render
 * [ ]
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
 * incrementalColors -> boolean
 * percentageLabel, valueLabel, percentageValueLabel
 */
