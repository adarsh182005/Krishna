const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const router = express.Router();
const Order = require('../models/Order'); // Assuming you have an Order model
const auth = require('../middleware/auth'); // Your auth middleware

// Create payment intent
router.post('/create-payment-intent', auth, async (req, res) => {
  try {
    const { amount, orderId, items } = req.body;
    
    // Validate the amount by calculating from cart items
    const calculatedAmount = items.reduce((total, item) => {
      return total + (item.price * item.quantity);
    }, 0);
    
    if (Math.abs(amount - calculatedAmount) > 0.01) {
      return res.status(400).json({ error: 'Amount mismatch' });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to paise (smallest currency unit)
      currency: 'inr',
      metadata: {
        orderId: orderId,
        userId: req.user.id,
        items: JSON.stringify(items.map(item => ({
          id: item.id,
          name: item.name,
          quantity: item.quantity,
          price: item.price
        })))
      },
      automatic_payment_methods: {
        enabled: true,
      },
    });

    res.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id
    });

  } catch (error) {
    console.error('Payment intent creation failed:', error);
    res.status(500).json({ error: 'Payment processing failed' });
  }
});

// Confirm payment and update order
router.post('/confirm-payment', auth, async (req, res) => {
  try {
    const { paymentIntentId, orderId } = req.body;
    
    // Retrieve payment intent from Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    
    if (paymentIntent.status === 'succeeded') {
      // Update order status in your database
      const order = await Order.findByIdAndUpdate(
        orderId,
        {
          paymentStatus: 'completed',
          paymentIntentId: paymentIntentId,
          status: 'confirmed',
          paidAt: new Date()
        },
        { new: true }
      );

      if (!order) {
        return res.status(404).json({ error: 'Order not found' });
      }

      res.json({
        success: true,
        message: 'Payment confirmed successfully',
        order: order
      });
    } else {
      res.status(400).json({
        error: 'Payment not completed',
        status: paymentIntent.status
      });
    }

  } catch (error) {
    console.error('Payment confirmation failed:', error);
    res.status(500).json({ error: 'Payment confirmation failed' });
  }
});

// Webhook to handle Stripe events
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object;
      console.log('PaymentIntent succeeded:', paymentIntent.id);
      
      // Update order status
      try {
        await Order.findOneAndUpdate(
          { paymentIntentId: paymentIntent.id },
          { 
            paymentStatus: 'completed',
            status: 'confirmed',
            paidAt: new Date()
          }
        );
      } catch (error) {
        console.error('Failed to update order after payment success:', error);
      }
      break;

    case 'payment_intent.payment_failed':
      const failedPayment = event.data.object;
      console.log('PaymentIntent failed:', failedPayment.id);
      
      // Update order status to failed
      try {
        await Order.findOneAndUpdate(
          { paymentIntentId: failedPayment.id },
          { 
            paymentStatus: 'failed',
            status: 'payment_failed'
          }
        );
      } catch (error) {
        console.error('Failed to update order after payment failure:', error);
      }
      break;

    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.json({ received: true });
});

// Get payment status
router.get('/status/:paymentIntentId', auth, async (req, res) => {
  try {
    const paymentIntent = await stripe.paymentIntents.retrieve(req.params.paymentIntentId);
    res.json({
      status: paymentIntent.status,
      amount: paymentIntent.amount / 100, // Convert back to rupees
      currency: paymentIntent.currency
    });
  } catch (error) {
    console.error('Failed to retrieve payment status:', error);
    res.status(500).json({ error: 'Failed to retrieve payment status' });
  }
});

module.exports = router;