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
    placeholder: "eg. 4111 1111 1111 1111"
  },
  cvv: {
    selector: "#cvv",
    placeholder: "eg. 123"
  },
  expirationDate: {
    selector: "#expiration-date",
    placeholder: "eg. 10 / 2019"
  },
  postalCode: {
    selector: "#billing-postal-code",
    placeholder: "eg SW1A 0AA"
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

    var customFormDataSerialized = $(this).serializeArray()

    function objectifyForm(formArray) {//serialize data function
      var returnArray = {};
      for (var i = 0; i < formArray.length; i++) {
        returnArray[formArray[i]["name"]] = formArray[i]["value"];
      }
      return returnArray;
    }

    var customFormDataObj = objectifyForm(customFormDataSerialized)

    hostedInstance.tokenize(function(tokenizeErr, payload) {

      if (tokenizeErr) {
        console.error(tokenizeErr);
        return;
      }

      $.ajax({
        type: "POST",
        url: "http://localhost:3000/checkout",
        data: {
          "payment_method_nonce": payload.nonce,
          "product_id": customFormDataObj["item"],
          "amount": customFormDataObj["price"]
        }

      }).done(function (result) {

        if (result.success) {
          console.log("SUCCESS!!")

        } else {
          console.log("ERROR!!", result);
        }
      });
    })
  }, false)
}
