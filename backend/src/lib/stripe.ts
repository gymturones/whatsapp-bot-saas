// src/lib/stripe.ts

import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-04-10",
});

// Subscription plans
export const SUBSCRIPTION_PLANS = {
  free: {
    id: "free",
    name: "Free",
    price: 0,
    currency: "usd",
    interval: "month" as const,
    features: {
      maxBots: 1,
      maxMessagesPerMonth: 100,
      aiEnabled: false,
      priority: false,
    },
  },
  starter: {
    id: "starter",
    name: "Starter",
    price: 1999, // $19.99
    currency: "usd",
    interval: "month" as const,
    stripePriceId: process.env.STRIPE_STARTER_PRICE_ID,
    features: {
      maxBots: 3,
      maxMessagesPerMonth: 1000,
      aiEnabled: true,
      priority: false,
    },
  },
  pro: {
    id: "pro",
    name: "Pro",
    price: 4999, // $49.99
    currency: "usd",
    interval: "month" as const,
    stripePriceId: process.env.STRIPE_PRO_PRICE_ID,
    features: {
      maxBots: 10,
      maxMessagesPerMonth: 10000,
      aiEnabled: true,
      priority: true,
    },
  },
  business: {
    id: "business",
    name: "Business",
    price: 9999, // $99.99
    currency: "usd",
    interval: "month" as const,
    stripePriceId: process.env.STRIPE_BUSINESS_PRICE_ID,
    features: {
      maxBots: 50,
      maxMessagesPerMonth: 100000,
      aiEnabled: true,
      priority: true,
    },
  },
};

// Create a customer
export async function createStripeCustomer(
  email: string,
  name: string,
  metadata?: Record<string, string>
) {
  const customer = await stripe.customers.create({
    email,
    name,
    metadata,
  });

  return customer;
}

// Create a subscription
export async function createSubscription(
  customerId: string,
  priceId: string,
  metadata?: Record<string, string>
) {
  const subscription = await stripe.subscriptions.create({
    customer: customerId,
    items: [{ price: priceId }],
    payment_behavior: "default_incomplete",
    payment_settings: { save_default_payment_method: "on_subscription" },
    expand: ["latest_invoice.payment_intent"],
    metadata,
  });

  return subscription;
}

// Cancel subscription
export async function cancelSubscription(subscriptionId: string) {
  const subscription = await stripe.subscriptions.del(subscriptionId);
  return subscription;
}

// Update subscription
export async function updateSubscription(
  subscriptionId: string,
  updates: {
    priceId?: string;
    metadata?: Record<string, string>;
  }
) {
  const subscription = await stripe.subscriptions.retrieve(subscriptionId);

  const updatePayload: any = {};

  if (updates.priceId) {
    updatePayload.items = [
      {
        id: subscription.items.data[0].id,
        price: updates.priceId,
      },
    ];
  }

  if (updates.metadata) {
    updatePayload.metadata = updates.metadata;
  }

  const updated = await stripe.subscriptions.update(
    subscriptionId,
    updatePayload
  );

  return updated;
}

// Get subscription
export async function getSubscription(subscriptionId: string) {
  const subscription = await stripe.subscriptions.retrieve(subscriptionId);
  return subscription;
}

// List subscriptions for customer
export async function listCustomerSubscriptions(customerId: string) {
  const subscriptions = await stripe.subscriptions.list({
    customer: customerId,
  });

  return subscriptions.data;
}

// Create payment intent
export async function createPaymentIntent(
  customerId: string,
  amount: number,
  currency: string = "usd",
  metadata?: Record<string, string>
) {
  const paymentIntent = await stripe.paymentIntents.create({
    customer: customerId,
    amount,
    currency,
    automatic_payment_methods: { enabled: true },
    metadata,
  });

  return paymentIntent;
}

// Confirm payment
export async function confirmPayment(paymentIntentId: string) {
  const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
  return paymentIntent;
}

// Webhook event handler
export function getWebhookEvent(
  body: Buffer,
  signature: string
): Stripe.Event | null {
  try {
    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );

    return event;
  } catch (error) {
    console.error("Webhook signature verification failed:", error);
    return null;
  }
}

// Handle subscription updated
export async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  // Update user subscription status in database
  return {
    customerId: subscription.customer,
    subscriptionId: subscription.id,
    status: subscription.status,
    currentPeriodEnd: new Date(subscription.current_period_end * 1000),
    cancelAtPeriodEnd: subscription.cancel_at_period_end,
  };
}

// Handle subscription deleted
export async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  // Update user subscription status in database
  return {
    customerId: subscription.customer,
    subscriptionId: subscription.id,
    status: "cancelled",
  };
}

// Handle payment succeeded
export async function handlePaymentSucceeded(paymentIntent: Stripe.PaymentIntent) {
  return {
    customerId: paymentIntent.customer,
    amount: paymentIntent.amount,
    currency: paymentIntent.currency,
    status: paymentIntent.status,
  };
}

// Get invoice
export async function getInvoice(invoiceId: string) {
  const invoice = await stripe.invoices.retrieve(invoiceId);
  return invoice;
}

// List invoices for customer
export async function listCustomerInvoices(customerId: string) {
  const invoices = await stripe.invoices.list({
    customer: customerId,
  });

  return invoices.data;
}

// Create refund
export async function createRefund(paymentIntentId: string, amount?: number) {
  const refund = await stripe.refunds.create({
    payment_intent: paymentIntentId,
    amount,
  });

  return refund;
}

// Get customer
export async function getCustomer(customerId: string) {
  const customer = await stripe.customers.retrieve(customerId);
  return customer;
}

// Update customer
export async function updateCustomer(
  customerId: string,
  updates: {
    email?: string;
    name?: string;
    metadata?: Record<string, string>;
  }
) {
  const customer = await stripe.customers.update(customerId, updates);
  return customer;
}
