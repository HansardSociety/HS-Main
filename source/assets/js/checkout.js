import braintree from "braintree-web"

var form = document.querySelector("#payment-form");
var submit = form.querySelector("button[type=submit]");

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

/*		=Set up client
  ========================================================================== */

braintree.client.create({
  authorization: "sandbox_99kwdtcc_gqg8v5627nfqvf2y"
}, clientDidCreate)

/*		=Client instance
  ========================================================================== */

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
  ========================================================================== */

function hostedFieldsDidCreate(hostedErr, hostedInstance) {

  if (hostedErr) {
    console.error(hostedErr);
    return;
  }

  submit.removeAttribute("disabled")

  form.addEventListener("submit", function(event) {
    event.preventDefault();

    hostedInstance.tokenize(function(tokenizeErr, payload) {

      if (tokenizeErr) {
        console.error(tokenizeErr);
        return;
      }

      console.log("Nonce: " + payload.nonce)
    })
  }, false)
}
