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
        international: {
          rate: Number(productItemElem.dataset.itemShippingRateInternational),
          sku: productItemElem.dataset.itemShippingSkuInternational,
          selected: false
        }
      },

      checkoutTotal: productItemElem.dataset.itemPrice
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
          formData.checkoutTotal = parseFloat(formData.itemPrice) * parseFloat(formData.itemQuantity);
          form.querySelector("#review-item-quantity").innerHTML = formData.itemQuantity;
          form.querySelector("#review-checkout-total").innerHTML = formData.checkoutTotal;
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
          if (field.dataset.name.indexOf("shippingAddress") > -1) {

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

            if (field.value === "") {
              // do nothing ...

            } else if (field.value.indexOf("United Kingdom") > -1) {
              formData.shippingRate.uk.selected = true;
              formData.shippingRate.international.selected = false;

              formData.checkoutTotal = checkoutSubTotal + parseFloat(formData.shippingRate.uk.rate);

            } else {
              formData.shippingRate.uk.selected = false;
              formData.shippingRate.international.selected = true;

              formData.checkoutTotal = checkoutSubTotal + parseFloat(formData.shippingRate.international.rate);
            }

            form.querySelector("#review-checkout-total").innerHTML = formData.checkoutTotal;
          }
        }
      }
    });
  });

  console.log(checkoutFormsData);
  return checkoutFormsData;
})();
