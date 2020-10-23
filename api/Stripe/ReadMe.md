## Stripe Documentation

Here is the general full stack flow for our stripe implementation

## Create a new subscription
    - On the front end the user will fill out a form with an email, card num, exp date, and CCV
        - on submission a request is sent to stripes api to create a payment method using the info provided
        -if the card is declined we let the user know
        - We then make a request to the backend sending the new payment method
    - On the backend the payment method is recieved and two more calls to stripes api are made
        - the first call creates a stripe customer object using the payment method object
        - the next call creates a subscription object using the new customer object
        - we store the customer-id and subscription-id in our database for later use
        - respond to the front end with the subscription object's status and a client secret
    - Back on the front end we recieved a response from our API and check the status
        - if the status is 'requires action' we make another call to stripes api attaching our client secret to verify the card payment
        - this call will render a new iframe to get further verification from the customer
        - once the customer verifies their payment or if the status is not 'requires action' then the subscription was created and we make one more call to our backend
    - On the back end again we simply change the user's subscription boolean in our db to true
    - We respond with a success message and then we're all done!

## Update Default Payment Method
    - On the front the user fills out the same card info form
        - a call to the stripe api is made and a payment object is created
        - the payment method is sent to the backend
    - On the backend we recieve the payment method and call stripes api
        - we use the customer id from the db and the payment method from the request 
        - we call the stripe api to change the customers default payment method to the new payment method
        -now all future charges with that customer will use the new payment method
    - If successful we send a success message for the front end to display

## Cancel Subscription
    - We send a request to the backend
    - On the backend we retrieve the users subscription-id and customer-id from our db
    - We then call stripes api to cancel that subscription
    - We delete the subscription data from our db
    - Finally we send a success message back to the front end

## Webhooks
    - The backend has an endpoint that can respond to events that happen on our stripe account
    - Right now there are only three webhooks we are listening for
        - invoice.payment_succeeded: we just log the response
        - invoice.payment_failed: we delete the customers sub data
        - customer.subscription.deleted: we delete the customers sub data
    

### Initial set up
    - login to stripe and find the keys under api keys in the dashboard and add them to your .env file
    - stripe has a bunch of test card numbers you can use in their docs
    - to test webhooks you need to download the stripe cli and login

### Some helpful links in the stripe docs
    https://stripe.com/docs/testing
    https://stripe.com/docs/billing/subscriptions/overview#incomplete
    https://stripe.com/docs/billing/subscriptions/fixed-price
    https://stripe.com/docs/webhooks

### What still needs to be done
    - global state for subscription status
    - live webhooks need to be set up in the stripe dashboard
    - styling for the manage stripe account forms
    - backend middleware to restrict routes for non subscribed users
    - more test coverage front and back
    - more webhooks can be implemented if you want to add more functionality
    - more card cases should be tested and handled

