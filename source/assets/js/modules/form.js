const form = (() => {

  /*		=Send data
    ========================================================================== */

  function sendData(formData) {
    var formElem = formData
    var formAction = formData.getAttribute("action")
    var formConfMsg = formData.querySelector(".form__confirmation")
    var formFields = formData.querySelectorAll("[class^=form__field]:not(.e-hidden)")
    var formName = formData.getAttribute("name")

    var request = new XMLHttpRequest()

    // Turn data object into array of URL-encoded key/ val pairs
    var formData = []
    for (let field of formFields) {
      var fieldName = field.getAttribute("name")
      var fieldVal = field.value

      formData.push(`${ encodeURIComponent(fieldName)}=${ encodeURIComponent(fieldVal) }`)
    }

    // Add form-name for Netlify
    formData.push(`form-name=${ encodeURIComponent(formName) }`)

    // Combine pairs into string and replace %-encoded spaces with "+"
    formData = `${ formData.join("&").replace(/%20/g, "+") }`

    // Success
    request.addEventListener("load", () => {
      formElem.classList.add("JS-success")
      formElem.parentElement.classList.add("JS-hide-text")
    })

    // Error
    request.addEventListener("error", () => {
      formElem.classList.add("JS-error")
      formElem.parentElement.classList.add("JS-hide-text")
    })

    // Request
    request.open("POST", formAction)

    // Header
    request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded")

    // Send
    request.send(formData)
  }

  /*		=Loop through forms
    ========================================================================== */

  var forms = document.querySelectorAll(".form")

  for (let form of forms) {
    var submitBtn = form.querySelector("button[type=submit]")

    submitBtn.addEventListener("click", function(e) {

      e.preventDefault()

      // Validate
      var formFields = this.form.querySelectorAll("[class^=form__field]:not(.e-hidden)")
      var fieldsArr = Array.prototype.slice.call(formFields)
      var fieldsPass = fieldsArr.every(field => field.validity.valid)

      if (fieldsPass){
        var formData = this.form

        sendData(formData)

      } else {

        for (let field of formFields) {
          if (!field.validity.valid) {
            field.style.borderColor = "red"
            field.classList.add("JS-error")
          }
        }
      }
    })
  }
})()

export { form }

