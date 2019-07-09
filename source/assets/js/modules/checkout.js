const checkoutForms = document.querySelectorAll(".form--checkout");

module.exports = (function () {
  let orderInfo = {
    itemName: "",
    itemQuantity: 1,

    customerFirstName: "",
    customerFirstSurname: "",
    customerEmail: "",

    shippingAddressLine1: "",
    shippingAddressLine2: "",
    shippingAddressLine3: "",
    shippingAddressPostcode: "",
    shippingAddressCountry: "",

    priceItem: ""
  };

  checkoutForms.forEach(form => {
    const fields = form.querySelectorAll(".form__field");

    fields.forEach(field => {
      if (field.dataset.name === "itemName") {
        orderInfo[field.dataset.name] = field.value;
      }

      field.addEventListener("change", function(e) {
        orderInfo[this.dataset.name] = this.value.replace(/"/g, "&quot;");
      })
    });
  });

  return orderInfo;
})();
