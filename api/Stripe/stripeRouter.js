const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Parent = require('./stripeModel');

//endpoint to subscribe a user to the service
router.post('/:id', async (req, res) => {
  //we already created and verified the payment method on the frontend
  const { email, payment_method } = req.body;

  //we create a stripe customer
  const customer = await stripe.customers.create({
    payment_method: payment_method,
    email: email,
    invoice_settings: {
      default_payment_method: payment_method,
    },
  });
  //we subscribe the customer to our plan
  const subscription = await stripe.subscriptions.create({
    customer: customer.id,
    items: [{ plan: 'price_1HXCpBGxs2Ay8GnvgSWZowcx' }],
    expand: ['latest_invoice.payment_intent'],
  });

  const oldSubData = await Parent.getSubData(req.params.id);
  console.log(oldSubData);
  const { sub_id, stripe_id, subscribed } = oldSubData;
  console.log(subscribed);
  if (stripe_id && sub_id && subscribed === true) {
    res.status(400).json({
      message: 'an active subscription already exists for that customer',
    });
  } else {
    const status = subscription['latest_invoice']['payment_intent']['status'];
    const client_secret =
      subscription['latest_invoice']['payment_intent']['client_secret'];

    const newSubData = await Parent.newSub(
      req.params.id,
      customer.id,
      subscription.id
    );

    console.log(newSubData);

    res.json({ client_secret: client_secret, status: status });
  }
});

router.post('/:id/confirmed', async (req, res) => {
  console.log('subscription confirmed for user', req.params.id);
  //const subData = await Parent.getSubData(req.params.id);
  Parent.confirmSub(req.params.id)
    .then((response) => {
      console.log(response);
      res.status(200).json({
        message: 'subscribed',
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
});

//update default payment method for a user
router.post('/:id/update', async (req, res) => {
  const subData = await Parent.getSubData(req.params.id);

  const paymentMethod = await stripe.paymentMethods.attach(
    req.body.payment_method,
    { customer: subData.stripe_id }
  );
  console.log(paymentMethod);
  const customer = await stripe.customers.update(subData.stripe_id, {
    invoice_settings: {
      default_payment_method: req.body.payment_method,
    },
  });
  console.log(customer);
  res.status(200).json({ message: 'updated payment method' });
});

router.post('/:id/cancel', async (req, res) => {
  const subData = await Parent.getSubData(req.params.id);

  const deleted = await stripe.subscriptions.del(subData.sub_id);

  console.log(deleted);

  const newSubData = await Parent.cancelSub(req.params.id);

  console.log(newSubData[0]);

  //right now this endpoint just deletes the subscription immediately
  //for production you can replace the above code with the following
  /*
    await stripe.subscriptions.update(subData.sub_id, {cancel_at_period_end: true});
  */
  //at the end of the billing cycle a customer.subscription.deleted event will trigger
  //we can use the webhooks route below to handle removing the data
  //we can recieve that event from stripe and then delete the sub dat

  res.status(200).json({
    message: 'subscription cancelled',
    subscribed: newSubData[0],
  });
});

router.post('/webhooks', (req, res) => {
  const event = req.body;
  //console.log(event.data.object.amount, event.type, event.data.object.customer);
  switch (event.type) {
    case 'invoice.payment_succeeded': {
      const customer = event['data']['object']['customer'];
      const amount = event['data']['object']['amount'];
      console.log(`Invoice Payment of ${amount} Successful for ${customer}`);
      break;
    }
    case 'invoice.payment_failed': {
      //logic here to unsubscribe a user object in the db and send a message
      const stripeId = event.data.object.customer;
      const parentId = Parent.getParentByStripeID(stripeId);
      console.log(
        `payment failed for user with id: ${parentId} and stripe_id: ${stripeId}`
      );
      Parent.cancelSub(parentId)
        .then((response) => {
          console.log(response);
          console.log(
            `subscription removed from db for user with id: ${parentId} and stripe_id: ${stripeId}`
          );
        })
        .catch((err) => {
          console.log(`
                  error removing subscription from db for user with id: ${parentId} and stripe_id: ${stripeId},
                  error_message: ${err}
                `);
        });
      break;
    }
    case 'customer.subscription.deleted': {
      const stripeId = event.data.object.customer;
      const parentId = Parent.getParentByStripeID(stripeId);
      Parent.cancelSub(parentId);
      break;
    }
    default:
      return res.status(400).end();
  }
  res.json({ recieved: true });
});
module.exports = router;
