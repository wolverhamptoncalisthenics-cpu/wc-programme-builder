// Creates a Stripe Checkout session for a paid goal and hands back the
// URL to send the person to. Stripe hosts the actual payment page
// itself — no card details ever touch this app or its servers.

import Stripe from "stripe";

export async function handler(event) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method not allowed" };
  }

  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Missing STRIPE_SECRET_KEY environment variable in Netlify." }),
    };
  }

  try {
    const { goalId, userId, userEmail } = JSON.parse(event.body);
    if (!goalId || !userId) {
      return { statusCode: 400, body: JSON.stringify({ error: "Missing goalId or userId" }) };
    }

    // Each paid goal needs a matching Stripe Price ID set as an
    // environment variable — see README for how to create these in
    // your Stripe dashboard.
    const envKey = `STRIPE_PRICE_${goalId.toUpperCase().replace(/-/g, "_")}`;
    const priceId = process.env[envKey];
    if (!priceId) {
      return {
        statusCode: 500,
        body: JSON.stringify({
          error: `Missing ${envKey} environment variable in Netlify. Set it to the Stripe Price ID for this goal.`,
        }),
      };
    }

    const stripe = new Stripe(secretKey);
    const siteUrl = process.env.URL || "";

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [{ price: priceId, quantity: 1 }],
      client_reference_id: userId,
      customer_email: userEmail,
      metadata: { goalId, userId },
      success_url: `${siteUrl}/?checkout_session_id={CHECKOUT_SESSION_ID}#app`,
      cancel_url: `${siteUrl}/#app`,
    });

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url: session.url }),
    };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
}
