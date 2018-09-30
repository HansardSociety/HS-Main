import Chartist from "chartist"
import "chartist-plugin-legend"

const charts = () => {
  const elems = document.querySelectorAll(".chart")

  for (let chart of elems) {
    const chartObj = JSON.parse(chart.querySelector(".chart__template").innerHTML)
    const chartContainer = chart.querySelector(".chart__container")
    const chartLegend = chart.querySelector(".chart__legend")

    const data = chartObj.data
    const options = chartObj.options
    const plugins = chartObj.plugins
    const styles = chartObj.styles

    if (plugins) {
      if (plugins.legend) {
        options.plugins = [
          Chartist.plugins.legend({
            legendNames: plugins.legend,
            position: chartLegend
          })
        ]
      }
    }

    const axisX = options.axisX
    const axisY = options.axisY

    if (axisX || axisY) {
      // DOUBLE CHECK DEFAULT E.G. STEP AXES FOR X AND Y

      let axes = Object.assign({}, { axisX: axisX }, { axisY: axisY })

      Object.keys(axes).map(key => {
        if (axes[key] == null) {
          delete axes[key]

        } else {
          if (axes[key].type) {

            if (axes[key].type === "Chartist.FixedScaleAxis") {
              axes[key].type = Chartist.FixedScaleAxis

            } else if (axes[key].type === "Chartist.StepAxis") {
              axes[key].type = Chartist.StepAxis

            } else {
              axes[key].type = Chartist.AutoScaleAxis
            }
          }
        }
      })
    }

    return new Chartist.Bar(chartContainer, data, options)
      .on("draw", data => {
        if (data.type === "bar") {
          if (styles) {
            data.element.attr({
              style: `stroke-width: ${styles.strokeWidth ? styles.strokeWidth : "0.25rem"};`
            })
          }
        }
      })
  }
}

const renderCharts = (() => {
  document.addEventListener("DOMContentLoaded", charts())
})()

export { renderCharts }
