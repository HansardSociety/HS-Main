const form = (() => {
  var form = document.querySelector(".form")
  var formMain = form.querySelector(".form__main")
  var formConf = form.querySelector(".form__confirmation")
  var formName = form.getAttribute("name")
  var formAction = form.getAttribute("action")
  var submitBtn = form.querySelector("button[type=submit]")
  var fields = form.querySelectorAll("input[class^=form]:not(.e-hidden)")

  function sendData() {
    var request = new XMLHttpRequest()

    // Turn data object into array of URL-encoded key/ val pairs
    var formData = []
    for (let field of fields) {
      var name = field.getAttribute("name")
      var val = field.value

      formData.push(`${ encodeURIComponent(name)}=${encodeURIComponent(val) }`)
    }

    // Add form-name for Netlify
    formData.push(`form-name=${ encodeURIComponent(formName) }`)

    // Combine pairs into string and replace %-encoded spaces with "+"
    formData = `${ formData.join("&").replace(/%20/g, "+") }`

    // Success
    request.addEventListener("load", function(e) {
      formMain.style.display = "none"
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

    sendData()
  })
})()

export { form }

