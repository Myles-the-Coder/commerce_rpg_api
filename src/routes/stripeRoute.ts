import { Router, Request, Response } from 'express';
import Stripe from 'stripe';
import { config } from 'dotenv';

config();

const stripe = new Stripe(process.env.STRIPE_KEY as string, {
	apiVersion: '2020-08-27',
	typescript: true,
});

const router = Router();

router.post('/payment', async (req: Request, res: Response): Promise<void> => {
  const {amount} = req.body
  const params: Stripe.PaymentIntentCreateParams = {
    amount,
    currency: 'usd',
    payment_method_types: ['card']
  }
	try {
    const paymentIntent: Stripe.PaymentIntent = await stripe.paymentIntents.create(params)
    res.status(200).json({clientSecret: paymentIntent.client_secret})
	} catch (e: any) {
    res.status(500).json({error: {message: e.message}})
  }
});

export default router;
