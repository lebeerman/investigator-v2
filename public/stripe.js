const stripePublicKey = 'pk_test_gYLnHPOaf3nkKsCk9TH37qEa';
const stripe = Stripe(stripePublicKey);
const card = buildCard();
document.querySelector('#payment-form').addEventListener('submit', paymentFormHandler);

function buildCard() {
  const card = stripe
    .elements()
    .create('card', {
      style: {
        base: {
          color: '#6363a3',
          fontFamily: "'Helvetica Neue', Helvetica, sans-serif",
          fontSmoothing: 'antialiased',
          fontSize: '18px',
          '::placeholder': {
            color: '#abc3db'
          }
        },
        invalid: {
          color: '#fa755a',
          iconColor: '#fa755a'
        }
      }
    });
  card.mount('#card-element');
  card.addEventListener('change', creditCardChangeHandler);

  return card;
}

function paymentFormHandler(event) {
  event.preventDefault();

  stripe.createToken(card).then(result => {
    result.error
      ? (document.querySelector('#card-errors').textContent = result.error.message)
      : stripeTokenHandler(result.token, event.target);
      // Converts sensitive card data to a single-use token that you can safely pass to your server to charge the user.
  });
}

function stripeTokenHandler(token, form) {
  const hiddenInput = document.createElement('input');
  // Building the hidden Token item (encrypted CC info) that get's posted to stripe
  hiddenInput.setAttribute('type', 'hidden');
  hiddenInput.setAttribute('name', 'stripeToken');
  hiddenInput.setAttribute('value', token.id);

  form.appendChild(hiddenInput);
  form.submit();
}

function creditCardChangeHandler(event) {
  const $errors = document.querySelector('#card-errors');
  event.error ? ($errors.textContent = event.error.message) : ($errors.textContent = '');
}
