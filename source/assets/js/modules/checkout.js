const checkoutForms = document.querySelectorAll(".form--checkout");

module.exports = (function () {
  const checkoutFormsData = {};

  checkoutForms.forEach((form, i) => {
    const fields = form.querySelectorAll(".form__field");
    const checkoutFormId = `checkout-form-${ i }`;

    checkoutFormsData[checkoutFormId] = {
      id: checkoutFormId,
      type: form.dataset.checkoutType,

      itemName: form.querySelector('[data-name="itemName"]').value,
      itemQuantity: 1,

      customerFirstName: "",
      customerFirstSurname: "",
      customerEmail: "",

      shippingAddressLine1: "",
      shippingAddressLine2: "",
      shippingAddressLine3: "",
      shippingAddressPostcode: "",
      shippingAddressCountry: ""
    };

    form.dataset.checkoutFormId = checkoutFormId; // set to pass to stripe to identify correct form

    fields.forEach(field => {
      field.addEventListener("change", function(e) {
        checkoutFormsData[checkoutFormId][this.dataset.name] = this.value.replace(/"/g, "&quot;");
      })
    });
  });

  console.log(checkoutFormsData);

  return checkoutFormsData;
})();
