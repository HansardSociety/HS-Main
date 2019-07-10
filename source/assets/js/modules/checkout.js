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

      itemName: productItemElem.dataset.itemName,
      itemSKU: productItemElem.dataset.itemSku,
      itemQuantity: 1,

      customerFirstName: "",
      customerFirstSurname: "",
      customerEmail: "",

      shippingAddressLine1: "",
      shippingAddressLine2: "",
      shippingAddressLine3: "",
      shippingAddressPostcode: "",
      shippingAddressCountry: "",

      shippingRate: {
        uk: {
          rate: productItemElem.dataset.itemShippingRateUk,
          sku: productItemElem.dataset.itemShippingSkuUk,
          selected: false
        },
        international: {
          rate: productItemElem.dataset.itemShippingRateInternational,
          sku: productItemElem.dataset.itemShippingSkuInternational,
          selected: false
        }
      }
    };

    form.dataset.checkoutFormId = checkoutFormId; // set to pass to stripe to identify correct form

    fields.forEach(field => {
      field.addEventListener("change", function(e) {
        checkoutFormsData[checkoutFormId][this.dataset.name] = this.value.replace(/"/g, "&quot;");

        if (
          checkoutFormsData[checkoutFormId].type === "shipping"
          && this.dataset.name === "shippingAddressCountry"
        ) {

          if (this.value.indexOf("United Kingdom") > -1) {
            checkoutFormsData[checkoutFormId].shippingRate.uk.selected = true;
            checkoutFormsData[checkoutFormId].shippingRate.international.selected = false;

          } else {
            checkoutFormsData[checkoutFormId].shippingRate.uk.selected = false;
            checkoutFormsData[checkoutFormId].shippingRate.international.selected = true;
          }
        }
      })
    });
  });

  console.log(checkoutFormsData);

  return checkoutFormsData;
})();
