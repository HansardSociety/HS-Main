const stripe = () => {
  var stripe = Stripe('pk_test_84iL7ExH74LfSp6ME6O2IOAx');

  var checkoutButton = document.getElementById('checkout-button-sku_F49veL6MiEjy2k');
  checkoutButton.addEventListener('click', function () {
    // When the customer clicks on the button, redirect
    // them to Checkout.
    stripe.redirectToCheckout({
      items: [{sku: 'sku_F49veL6MiEjy2k', quantity: 1}],

      // Do not rely on the redirect to the successUrl for fulfilling
      // purchases, customers may not always reach the success_url after
      // a successful payment.
      // Instead use one of the strategies described in
      // https://stripe.com/docs/payments/checkout/fulfillment
      successUrl: 'https://www.hansardsociety.org.uk/success',
      cancelUrl: 'https://www.hansardsociety.org.uk/canceled',
    })
    .then(function (result) {
      if (result.error) {
        // If `redirectToCheckout` fails due to a browser or network
        // error, display the localized error message to your customer.
        var displayError = document.getElementById('error-message');
        displayError.textContent = result.error.message;
      }
    });
  });
}

export {stripe}
