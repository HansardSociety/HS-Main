import braintree from "braintree-web"

/*		=Options
  ---------------------------------------- */

var checkoutStyles = {
  "input": {
    "font-size": "18px",
    "font-family": "sans-serif"
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
    placeholder: "eg. 4111 1111 1111 1111"
  },
  cvv: {
    selector: "#cvv",
    placeholder: "eg. 123"
  },
  expirationDate: {
    selector: "#expiration-date",
    placeholder: "eg. 10 / 2019"
  }
}

const braintreeCheckout = () => {
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

        // Product data
        var productName = form.querySelector("[data-product-name]").getAttribute("data-product-name")
          , productID = form.querySelector("[data-product-id]").getAttribute("data-product-id")
          , productPrice = form.querySelector("[data-product-price]").getAttribute("data-product-price")
          , productQty = form.querySelector("[data-product-qty]").getAttribute("data-product-qty")
          , productTotal = form.querySelector("[data-product-total]").getAttribute("data-product-total")

        hostedInstance.tokenize(function(tokenizeErr, payload) {

          // Error
          if (tokenizeErr) {
            console.error(tokenizeErr)
            return
          }

          // Success
          var metaData = {
            "payment-method-nonce": payload.nonce,
            "product-name": productName,
            "product-id": productID,
            "product-price": productPrice,
            "product-qty": productQty,
            "product-total": productTotal
          }

          sendData(submitBtn.form, {
            metaData: metaData,
            postURL: "https://46.101.77.43/checkout",
            dataType: "json"
          })
        })
      }, false)
    }
  }
}

/*		=Payment state
  ========================================================================== */

const paymentState = () => {
  var paymentForms = document.querySelectorAll(".form--payment")

  for (let form of paymentForms) {
    var productPage = form.querySelector("[data-form-page=product]")
    var formHead = form.querySelector(".form__head")

    // Form action buttons => prevent tab between pages
    var formActions = form.querySelectorAll(".form__actions")

    // Form head
    var qtyHeadElem = form.querySelector("[data-product-qty]")
    var totalHeadElem = form.querySelector("[data-product-total]")
    var ppHeadElem = form.querySelector("[data-product-pp]")
    var priceHeadElem = form.querySelector("[data-product-price]")

    // Form qty input
    var qtyElem = productPage.querySelector(".form__qty")
    var qtyInput = qtyElem.querySelector("input")
    var qtyAdd = qtyElem.querySelector(".form__qty-add")
    var qtyRemove = qtyElem.querySelector(".form__qty-remove")

    // Default units
    var ppHeadVal = ppHeadElem.getAttribute("data-product-pp") / 1
    var priceHeadVal = priceHeadElem.getAttribute("data-product-price") / 1
    var qtyHeadVal = qtyHeadElem.getAttribute("data-product-qty") / 1


    /*		=Prevent tab between pages
      ---------------------------------------- */

    for (let action of formActions) {
      var back = action.querySelector(".form__prev")
      var next = action.querySelector(".form__next")

      // Prevent tab to next page
      next.addEventListener("keydown", function(e) {
        if (e.which === 9 && !e.shiftKey) {
          e.preventDefault()
        }
      })
    }

    /*		=Quantity add/remove
      ---------------------------------------- */

    // Force quantity reset in case of cache
    qtyInput.value = 1

    qtyAdd.addEventListener("click", function() {
      var val = qtyInput.value / 1
      var valNew = val + 1

      qtyInput.value = valNew

      qtyHeadElem.setAttribute("data-product-qty", valNew)
      qtyHeadElem.innerText = valNew

      // Reset vars
      qtyHeadVal = qtyHeadElem.getAttribute("data-product-qty") / 1
      ppHeadVal = ppHeadElem.getAttribute("data-product-pp") / 1

      var totalPrice = (priceHeadVal * qtyHeadVal + ppHeadVal).toFixed(2)
      totalHeadElem.setAttribute("data-product-total", totalPrice)
      totalHeadElem.innerText = totalPrice
    })

    qtyRemove.addEventListener("click", function() {
      var val = qtyInput.value / 1
      var valNew = val - 1

      if (val >= 2) {
        qtyInput.value = valNew

        qtyHeadElem.setAttribute("data-product-qty", valNew)
        qtyHeadElem.innerText = valNew

        // Reset vars
        qtyHeadVal = qtyHeadElem.getAttribute("data-product-qty") / 1
        ppHeadVal = ppHeadElem.getAttribute("data-product-pp") / 1

        var totalPrice = (priceHeadVal * qtyHeadVal + ppHeadVal).toFixed(2)
        totalHeadElem.setAttribute("data-product-total", totalPrice)
        totalHeadElem.innerText = totalPrice
      }
    })

    /*		=Shipping rate
      ---------------------------------------- */

    var countrySelect = form.querySelector("[name=shipping-country]")
    var britishIslesCodes = ["GB", "GG", "IM", "JE"]

    // Ensure defaults to "-- select country --"
    var defaultOpt = "-- select a country --"
    countrySelect.value = defaultOpt

    // Set shipping rates
    countrySelect.addEventListener("change", function(el) {
      var selected = this.options[this.selectedIndex]
      var selectedCountryCode = selected.getAttribute("data-country-code")
      var totalPrice = totalHeadElem.getAttribute("data-product-total") / 1

      if (britishIslesCodes.indexOf(selectedCountryCode) > -1) {
        ppHeadVal = ppHeadElem.getAttribute("data-product-pp-uk") / 1

      } else {

        ppHeadVal = ppHeadElem.getAttribute("data-product-pp-intl") / 1
      }

      qtyHeadVal = qtyHeadElem.getAttribute("data-product-qty") / 1 // reset var for p&p

      var totalPriceWithPP = ((qtyHeadVal * priceHeadVal) + ppHeadVal).toFixed(2)

      // Set p&p head vals
      ppHeadVal = ppHeadVal.toFixed(2)
      ppHeadElem.innerText = ppHeadVal
      ppHeadElem.setAttribute("data-product-pp", ppHeadVal)

      // Reset total vals
      totalHeadElem.setAttribute("data-product-total", totalPriceWithPP)
      totalHeadElem.innerText = totalPriceWithPP
    })
  }
}

braintreeCheckout()
paymentState()
