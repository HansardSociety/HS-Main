import dropin from "braintree-web"

const button = document.querySelector('#dropin-submit-button');

dropin.create({
  authorization: "sandbox_99kwdtcc_gqg8v5627nfqvf2y",
  container: "#dropin-container",
  card: {
    overrides: {
      // fields:
    }
  }
}, function(createErr, instance) {
  button.addEventListener("click"), function() {
    instance.requestPaymentMethod(function(requestPaymentMethodErr, payload) {
      // Submit payload.nonce to server...
    })
  }
})
