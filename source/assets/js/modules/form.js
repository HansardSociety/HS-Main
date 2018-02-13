/*		=Send data
  ========================================================================== */

function sendData(formData, endpointURL) {
  var formElem = formData
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
  request.open("POST", endpointURL)

  // Header
  request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded")

  // Send
  request.send(formData)
}

/*		=Validate
  ========================================================================== */

function validateFields(getFormElem, sendFormData) {
  var formFields = getFormElem.querySelectorAll("[class^=form__field]:not(.e-hidden)")
  var fieldsArr = Array.prototype.slice.call(formFields)
  var fieldsPass = fieldsArr.every(field => field.validity.valid)

  if (fieldsPass){
    var formData = getFormElem

    return sendFormData

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
  var forms = document.querySelectorAll(".form[data-netlify]")

  for (let form of forms) {
    var submitBtn = form.querySelector("button[type=submit]")

    this.form.on("submit", function(e) {
      e.preventDefault()

      var formElem = this.form

      validateFields(formElem, sendData(formElem, "/"))
    })
  }
})()

/*		=Braintree checkout form
  ========================================================================== */

import braintree from "braintree-web"

/*		=Options
  ---------------------------------------- */

var checkoutStyles = {
  "input": {
    "font-size": "16px"
  },
  "input.invalid": {
    "color": "red"
  },
  "input.valid": {
    "color": "green"
  }
}

var paymentFields = {
  number: {
    selector: "#card-number",
    placeholder: "41111 1111 1111 1111"
  },
  cvv: {
    selector: "#cvv",
    placeholder: "123"
  },
  expirationDate: {
    selector: "#expiration-date",
    placeholder: "10 / 2019"
  }
}

const braintreeCheckout = (() => {
  var form = document.querySelector("#payment-form");

  if (form) {
    var submit = form.querySelector("button[type=submit]");

    /*		=Set up client
      ---------------------------------------- */

    braintree.client.create({
      authorization: "sandbox_99kwdtcc_gqg8v5627nfqvf2y"
    }, clientDidCreate)


    /*		=Client instance
      ---------------------------------------- */

    function clientDidCreate(clientErr, clientInstance) {

      if (clientErr) {
        console.error(clientErr);
        return;
      }

      braintree.hostedFields.create({
        client: clientInstance,
        styles: checkoutStyles,
        fields: paymentFields
      }, hostedFieldsDidCreate)
    }

    /*		=Hosted fields instance
      ---------------------------------------- */

    function hostedFieldsDidCreate(hostedErr, hostedInstance) {

      if (hostedErr) {
        console.error(hostedErr)
        return
      }

      submit.removeAttribute("disabled")

      form.addEventListener("submit", function (event) {
        event.preventDefault()

        var customFormDataSerialized = $(this).serializeArray()

        function objectifyForm(formArray) {//serialize data function
          var returnArray = {}

          for (var i = 0; i < formArray.length; i++) {
            returnArray[formArray[i]["name"]] = formArray[i]["value"]
          }

          return returnArray
        }

        var customFormDataObj = objectifyForm(customFormDataSerialized)

        hostedInstance.tokenize(function (tokenizeErr, payload) {

          if (tokenizeErr) {
            console.error(tokenizeErr)
            return
          }

          console.log("SUCCESS!!!!!!!!!!!!!!!!!")
        })
      }, false)
    }
  }
})()

export { netlifyForms, braintreeCheckout }

