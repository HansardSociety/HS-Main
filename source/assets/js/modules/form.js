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

  /*		=URL encoded
    ---------------------------------------- */

  } else if (isURL) {

    // Turn data object into array of URL-encoded key/ val pairs
    var formData = []
    for (let field of formFields) {
      var fieldName = field.getAttribute("name")
      var fieldVal = field.value

      formData.push(`${encodeURIComponent(fieldName)}=${encodeURIComponent(fieldVal)}`)
    }

    // Add form-name for Netlify
    formData.push(`form-name=${encodeURIComponent(formName)}`)

    // Combine pairs into string and replace %-encoded spaces with "+"
    formData = `${formData.join("&").replace(/%20/g, "+")}`

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
  XHR.send(JSON.stringify({ formData }))
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
        sendData(formElem, "/")
      })
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
    placeholder: "4111 1111 1111 1111"
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
    var submitBtn = form.querySelector("button[type=submit]");

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

      submitBtn.removeAttribute("disabled")

      form.addEventListener("submit", function(event) {
        event.preventDefault()

        var productID = form.querySelector("[name=item]").getAttribute("data-product-id")

        hostedInstance.tokenize(function(tokenizeErr, payload) {

          // Error
          if (tokenizeErr) {
            console.error(tokenizeErr)
            return
          }

          // Success
          var metaData = {
            "payment-method-nonce": payload.nonce,
            "product-id": productID
          }

          sendData(submitBtn.form, {
            metaData: metaData,
            postURL: "http://localhost:3000/checkout",
            dataType: "json"
          })
        })
      }, false)
    }
  }
})()

/*		=Payment state
  ========================================================================== */

const paymentState = (() => {
  var paymentForms = document.querySelectorAll(".form--payment")

  for (let form of paymentForms) {
    var productPage = form.querySelector("[data-form-page=product]")
    var formHead = form.querySelector(".form__head")

    // Form head
    var qtyHeadElem = form.querySelector("[data-product-qty]")
    var totalHeadElem = form.querySelector("[data-product-total]")
    var priceHeadElem = form.querySelector("[data-product-price]")
    var priceHeadVal = priceHeadElem.getAttribute("data-product-price") / 1

    // Form qty input
    var qtyElem = productPage.querySelector(".form__qty")
    var qtyInput = qtyElem.querySelector("input")
    var qtyAdd = qtyElem.querySelector(".form__qty-add")
    var qtyRemove = qtyElem.querySelector(".form__qty-remove")

    qtyAdd.addEventListener("click", function() {
      var val = qtyInput.value / 1
      var valNew = val + 1

      qtyInput.value = valNew

      qtyHeadElem.setAttribute("data-product-qty", valNew)
      qtyHeadElem.innerText = valNew

      var totalPrice = (priceHeadVal * valNew).toFixed(2)
      totalHeadElem.setAttribute("data-product-total", totalPrice)
      totalHeadElem.innerText = totalPrice
    })

    qtyRemove.addEventListener("click", function () {
      var val = qtyInput.value / 1
      var valNew = val - 1

      if (val >= 2) {
        qtyInput.value = valNew

        qtyHeadElem.setAttribute("data-product-qty", valNew)
        qtyHeadElem.innerText = valNew

        var totalPrice = (priceHeadVal * valNew).toFixed(2)
        totalHeadElem.setAttribute("data-product-total", totalPrice)
        totalHeadElem.innerText = totalPrice
      }
    })
  }
})()

export { netlifyForms, braintreeCheckout, paymentState }

