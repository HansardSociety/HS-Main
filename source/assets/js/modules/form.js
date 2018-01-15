const form = (() => {
  var forms = document.querySelectorAll(".form")

  var formMain
  var formConf
  var formName
  var formAction
  var submitBtn
  var fields

  for (let form of forms) {
    formMain = form.querySelector(".form__main")
    formConf = form.querySelector(".form__confirmation")
    formName = form.getAttribute("name")
    formAction = form.getAttribute("action")
    submitBtn = form.querySelector("button[type=submit]")
    fields = form.querySelectorAll("[class^=form__field]:not(.e-hidden)")
  }

  function sendData() {
    var request = new XMLHttpRequest()

    // Turn data object into array of URL-encoded key/ val pairs
    var formData = []
    for (let field of fields) {
      var name = field.getAttribute("name")
      var val = field.value

      formData.push(`${ encodeURIComponent(name)}=${ encodeURIComponent(val) }`)
    }

    // Add form-name for Netlify
    formData.push(`form-name=${ encodeURIComponent(formName) }`)

    // Combine pairs into string and replace %-encoded spaces with "+"
    formData = `${ formData.join("&").replace(/%20/g, "+") }`

    // Success
    request.addEventListener("load", function(e) {
      // formMain.style.display = "none"
      formConf.style.display = "block"
      formConf.style.opacity = "1"
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

  submitBtn.addEventListener("click", function(e) {
    e.preventDefault()

    var fieldsArr = Array.prototype.slice.call(fields)
    var fieldsPass = fieldsArr.every(field => field.validity.valid)

    if (fieldsPass){
      return sendData()
    } else {
      for (let field of fields) {
        if (!field.validity.valid) {
          field.style.borderColor = "red"
          field.classList.add("JS-error")
        }
      }
    }
  })
})()

export { form }

