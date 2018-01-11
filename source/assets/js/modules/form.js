const form = (() => {
  var form = document.querySelector(".form")
  var formAction = form.getAttribute("action")

  function sendData() {
    var request = new XMLHttpRequest()
    var formData = new FormData(form) // bind FormData obj and form elem

    // Success
    request.addEventListener("load", function(event) {
      console.log(request.response)
    })

    // Error
    request.addEventListener("error", function(event) {
      console.log("ERROR!!")
    })

    // Request
    request.open("POST", "http://httpbin.org/post")

    // Send form data
    request.send(formData)

    // console.log()
  }

  form.addEventListener("submit", function(event) {
    event.preventDefault()

    sendData()

  })
})()

export { form }
