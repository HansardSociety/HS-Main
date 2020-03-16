const checkoutForms = document.querySelectorAll(".form--checkout");

module.exports = (function () {
  const checkoutFormsData = {};

  checkoutForms.forEach((form, i) => {
    const fields = form.querySelectorAll(".form__field");
    const checkoutFormId = `checkout-form-${ i }`;
    const productItemElem = form.querySelector('[data-name="itemName"]');

    checkoutFormsData[checkoutFormId] = {
      id: checkoutFormId,
      type: form.dataset.checkoutType,

      clientReferenceId: `${ new Date().getTime() }`,

      itemName: productItemElem.dataset.itemName,
      itemSKU: productItemElem.dataset.itemSku,
      itemPrice: Number(productItemElem.dataset.itemPrice),
      itemQuantity: 1,

      customerFirstName: "",
      customerSurname: "",
      customerEmail: "",

      shippingAddressLine1: "",
      shippingAddressLine2: "",
      shippingAddressLine3: "",
      shippingAddressPostcode: "",
      shippingAddressCountry: "",

      shippingRate: {
        uk: {
          rate: Number(productItemElem.dataset.itemShippingRateUk),
          sku: productItemElem.dataset.itemShippingSkuUk,
          selected: false
        },
        europe: {
          rate: Number(productItemElem.dataset.itemShippingRateEurope),
          sku: productItemElem.dataset.itemShippingSkuEurope,
          selected: false
        },
        worldZone1: {
          rate: Number(productItemElem.dataset.itemShippingRateWorldZone1),
          sku: productItemElem.dataset.itemShippingSkuWorldZone1,
          selected: false
        },
        worldZone2: {
          rate: Number(productItemElem.dataset.itemShippingRateWorldZone2),
          sku: productItemElem.dataset.itemShippingSkuWorldZone2,
          selected: false
        }
      },

      checkoutTotal: productItemElem.dataset.itemPrice,
      checkoutSuccessUrl: productItemElem.dataset.itemCheckoutSuccessUrl,
      checkoutCancelledUrl: productItemElem.dataset.itemCheckoutCancelledUrl
    };

    // Set to pass to stripe to identify correct form
    form.dataset.checkoutFormId = checkoutFormId;

    // Get form data by ID
    let formData = checkoutFormsData[checkoutFormId];

    fields.forEach(field => {

      field.addEventListener("change", function(e) {
        setValues(field);
      });

      window.addEventListener("load", function(e) {
        setValues(field);
      });

      function setValues (field) {

        if (field.dataset.name !== "clientReferenceId") {
          formData[field.dataset.name] = field.value.replace(/"/g, "&quot;"); // Set values and make safe
        } else {
          field.value = formData.clientReferenceId;
        }

        // Review item quantity and total
        if (field.dataset.name === "itemQuantity") {
          let shippingRate = 0;
          if (formData.shippingRate.uk.selected) shippingRate = formData.shippingRate.uk.rate;
          if (formData.shippingRate.europe.selected) shippingRate = formData.shippingRate.europe.rate;
          if (formData.shippingRate.worldZone1.selected) shippingRate = formData.shippingRate.worldZone1.rate;
          if (formData.shippingRate.worldZone2.selected) shippingRate = formData.shippingRate.worldZone2.rate;

          if (formData.itemQuantity > 1) form.classList.add("JS-shipping-multiple");
          else form.classList.remove("JS-shipping-multiple")

          formData.checkoutTotal = (parseFloat(formData.itemPrice) * parseFloat(formData.itemQuantity)) + parseFloat(shippingRate);
          form.querySelector("#review-item-quantity").innerHTML = formData.itemQuantity;
          form.querySelector("#review-checkout-total").innerHTML = formData.checkoutTotal;
          form.querySelector("input[name=checkout-total]").value = formData.checkoutTotal;
        }

        // Review first name
        if (field.dataset.name === "customerFirstName") {
          form.querySelector("#review-customer-first-name").innerHTML = formData.customerFirstName;
        }

        // Review surname
        if (field.dataset.name === "customerSurname") {
          form.querySelector("#review-customer-surname").innerHTML = formData.customerSurname;
        }

        // Review email
        if (field.dataset.name === "customerEmail") {
          form.querySelector("#review-customer-email").innerHTML = formData.customerEmail;
        }

        // Review shipping address and rates
        if (formData.type === "shipping") {
          if (field.dataset.name && field.dataset.name.indexOf("shippingAddress") > -1) {

            let reviewShippingAddress = [
              formData.shippingAddressLine1,
              formData.shippingAddressLine2,
              formData.shippingAddressLine3,
              formData.shippingAddressPostcode,
              formData.shippingAddressCountry
            ].filter(i => i != "").join(", ");

            form.querySelector("#review-shipping-address").innerHTML = reviewShippingAddress;
          }

          // Set UK vs international rates.
          if (field.dataset.name === "shippingAddressCountry") {
            let checkoutSubTotal = parseFloat(formData.itemPrice) * parseFloat(formData.itemQuantity);

            const options = field.querySelectorAll("option");
            options.forEach(function (opt) {

              if (opt.selected) {
                if (!opt.value) {
                  //  do nothing…
                } else if (!opt.dataset.zone) {
                  formData.shippingRate.uk.selected = true;
                  formData.shippingRate.europe.selected = false;
                  formData.shippingRate.worldZone1.selected = false;
                  formData.shippingRate.worldZone2.selected = false;

                  formData.checkoutTotal = checkoutSubTotal + parseFloat(formData.shippingRate.uk.rate);

                } else if (opt.dataset.zone === "0") {
                  formData.shippingRate.uk.selected = false;
                  formData.shippingRate.europe.selected = true;
                  formData.shippingRate.worldZone1.selected = false;
                  formData.shippingRate.worldZone2.selected = false;

                  formData.checkoutTotal = checkoutSubTotal + parseFloat(formData.shippingRate.europe.rate);

                } else if (opt.dataset.zone === "1") {
                  formData.shippingRate.uk.selected = false;
                  formData.shippingRate.europe.selected = false;
                  formData.shippingRate.worldZone1.selected = true;
                  formData.shippingRate.worldZone2.selected = false;

                  formData.checkoutTotal = checkoutSubTotal + parseFloat(formData.shippingRate.worldZone1.rate);

                } else {
                  formData.shippingRate.uk.selected = false;
                  formData.shippingRate.europe.selected = false;
                  formData.shippingRate.worldZone1.selected = false;
                  formData.shippingRate.worldZone2.selected = true;

                  formData.checkoutTotal = checkoutSubTotal + parseFloat(formData.shippingRate.worldZone2.rate);
                }
              }
            });

            form.querySelector("input[name=checkout-total]").value = formData.checkoutTotal;
            form.querySelector("#review-checkout-total").innerHTML = formData.checkoutTotal;
          }
        }
      }
    });
  });

  return checkoutFormsData;
})();
