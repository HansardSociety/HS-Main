const checkoutForms = document.querySelectorAll(".form--checkout");

module.exports = (function () {
  let orderInfo = {};

  checkoutForms.forEach(form => {
    const fields = form.querySelectorAll(".form__field");

    fields.forEach(field => {
      field.addEventListener("change", function(e) {
        orderInfo[this.dataset.name] = this.value.replace(/"/g, "&quot;");

        console.log(orderInfo);
      })
    });
  });

  return orderInfo;
})();
