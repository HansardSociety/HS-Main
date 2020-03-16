import checkout from "./checkout";

function stripe (checkoutFormId) {
  const stripe = Stripe("pk_test_84iL7ExH74LfSp6ME6O2IOAx");
  const checkoutData = checkout[checkoutFormId];

  const clientReferenceId = checkoutData.clientReferenceId;

  let items = [
    {
      sku: checkoutData.itemSKU,
      quantity: Number(checkoutData.itemQuantity) || 1
    }
  ];

  if (checkoutData.type === "shipping") {
    if (checkoutData.shippingRate.uk.selected) {
      items.push({
        sku: checkoutData.shippingRate.uk.sku,
        quantity: 1
      });
    } else if (checkoutData.shippingRate.europe.selected) {
      items.push({
        sku: checkoutData.shippingRate.europe.sku,
        quantity: 1
      });
    } else if (checkoutData.shippingRate.worldZone1.selected) {
      items.push({
        sku: checkoutData.shippingRate.worldZone1.sku,
        quantity: 1
      });
    } else {
      items.push({
        sku: checkoutData.shippingRate.worldZone2.sku,
        quantity: 1
      });
    }
  }

  stripe.redirectToCheckout({
    items,
    clientReferenceId, // unique session ID
    customerEmail: checkoutData.customerEmail || "",

    // Do not rely on the redirect to the successUrl for fulfilling
    // purchases, customers may not always reach the success_url after
    // a successful payment.
    // Instead use one of the strategies described in
    // https://stripe.com/docs/payments/checkout/fulfillment
    successUrl: checkoutData.checkoutSuccessUrl,
    cancelUrl: checkoutData.checkoutCancelledUrl
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
