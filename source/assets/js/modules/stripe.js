import checkout from "./checkout";

function stripe () {
  var stripe = Stripe("pk_test_84iL7ExH74LfSp6ME6O2IOAx");
  var SKU = "sku_F49veL6MiEjy2k";

  stripe.redirectToCheckout({
    items: [
      {
        sku: SKU,
        quantity: Number(checkout.itemQuantity) || 1
      },
      {
        sku: "sku_FPB6kZly3hl8BQ",
        quantity: 1
      }
    ],

    customerEmail: checkout.customerEmail || "",




    // Do not rely on the redirect to the successUrl for fulfilling
    // purchases, customers may not always reach the success_url after
    // a successful payment.
    // Instead use one of the strategies described in
    // https://stripe.com/docs/payments/checkout/fulfillment
    successUrl: "https://www.hansardsociety.org.uk/success",
    cancelUrl: "https://www.hansardsociety.org.uk/canceled",
  })
  .then(function (result) {
    if (result.error) {
      // If `redirectToCheckout` fails due to a browser or network
      // error, display the localized error message to your customer.
      var displayError = document.getElementById("error-message");
      displayError.textContent = result.error.message;
    }
  });
};

export { stripe }
