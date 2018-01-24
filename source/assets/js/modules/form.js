const form = (() => {

  /*		=Send data
    ========================================================================== */

  function sendData(name, fields, confirmation) {
    var request = new XMLHttpRequest()

    // Turn data object into array of URL-encoded key/ val pairs
    var formData = []
    for (let field of fields) {
      var name = field.getAttribute("name")
      var val = field.value

      formData.push(`${ encodeURIComponent(name)}=${ encodeURIComponent(val) }`)
    }

    // Add form-name for Netlify
    formData.push(`form-name=${ encodeURIComponent(name) }`)

    // Combine pairs into string and replace %-encoded spaces with "+"
    formData = `${ formData.join("&").replace(/%20/g, "+") }`

    // Success
    request.addEventListener("load", function(e) {
      confirmation.style.display = "block"
      confirmation.style.opacity = "1"
    })

    // Error
    request.addEventListener("error", function(e) {
      console.log("ERROR!!")
    })

    // Request
    request.open("POST", "/")

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
      var formConf = this.form.querySelector(".form__confirmation")
      var formFields = this.form.querySelectorAll("[class^=form__field]:not(.e-hidden)")
      var formName = this.form.getAttribute("name")

      var fieldsArr = Array.prototype.slice.call(formFields)
      var fieldsPass = fieldsArr.every(field => field.validity.valid)

      e.preventDefault()

      // Validate
      if (fieldsPass){
        sendData(formName, formFields, formConf)

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

