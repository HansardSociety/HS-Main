import braintree from "braintree-web"

/*		=Send data
  ========================================================================== */

function sendData(formData, ajaxOpts) {
  var formElem = formData
  var formConfMsg = formData.querySelector(".form__confirmation")
  var formFields = formData.querySelectorAll("[class^=form__field]:not([aria-hidden]):not(div)") // ==> don't include hidden elements and divs, which are used by Braintree
  var formName = formData.getAttribute("name")

  var isJSON = ajaxOpts.dataType == "json"
  var isURL = ajaxOpts.dataType == "url"

  var XHR = new XMLHttpRequest()

  /*		=JSON encoded
    ---------------------------------------- */

  if (isJSON) {
    var formData = {}

    for (let field of formFields) {
      var fieldName = field.getAttribute("name")
      var fieldVal = field.value

      formData[fieldName] = fieldVal
    }

    formData = Object.assign({}, formData, ajaxOpts.metaData)
    formData = JSON.stringify({ formData })

  /*		=URL encoded
    ---------------------------------------- */

  } else if (isURL) {

    // Turn data object into array of URL-encoded key/ val pairs
    var formData = []
    for (let field of formFields) {
      var fieldName = field.getAttribute("name")
      var fieldVal = field.value

      formData.push(`${ encodeURIComponent(fieldName) }=${ encodeURIComponent(fieldVal) }`)
    }

    // Add form-name for Netlify
    formData.push(`form-name=${ encodeURIComponent(formName) }`)

    // Combine pairs into string and replace %-encoded spaces with "+"
    formData = `${ formData.join("&").replace(/%20/g, "+") }`
  }

  // Success
  XHR.addEventListener("load", () => {
    formElem.classList.add("JS-success")
    formElem.parentElement.classList.add("JS-hide-text")
  })

  // Error
  XHR.addEventListener("error", () => {
    formElem.classList.add("JS-error")
    formElem.parentElement.classList.add("JS-hide-text")
  })

  // Request
  XHR.open("POST", ajaxOpts.postURL)

  // Header
  var contentType = isJSON ? "json;charset=UTF-8" : "x-www-form-urlencoded"
  XHR.setRequestHeader("Content-Type", `application/${ contentType }`)

  // Send
  XHR.send(formData)
}

/*		=Validate
  ========================================================================== */

function validateFields(getFormElem, sendFormData) {
  var formFields = getFormElem.querySelectorAll("[class^=form__field]:not(.e-hidden):not(div)")
  var fieldsArr = Array.prototype.slice.call(formFields)
  var fieldsPass = fieldsArr.every(field => field.validity.valid)

  if (fieldsPass) {
    var formData = getFormElem

    sendFormData()

  } else {
    for (let field of formFields) {
      if (!field.validity.valid) {

        field.style.borderColor = "red"
        field.classList.add("JS-error")
      }
    }
  }
}

/*		=Netlify forms
  ========================================================================== */

const netlifyForms = (() => {
  var forms = document.querySelectorAll(".form--netlify")

  for (let form of forms) {
    var submitBtn = form.querySelector("button[type=submit]")

    submitBtn.addEventListener("click", function(e) {
      e.preventDefault()

      var formElem = this.form
      validateFields(formElem, function () {
        sendData(formElem, {
          postURL: "/",
          dataType: "url"
        })
      })
    })
  }
})()

export { netlifyForms }

