// Called when someone lands back on the site after paying. Asks
// Stripe's own servers directly whether that specific session was
// actually paid — never trusts the browser's word for it — then
// records the unlock against their account.

import Stripe from "stripe";

export async function handler(event) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method not allowed" };
  }

  const secretKey = process.env.STRIPE_SECRET_KEY;
  const supabaseUrl = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!secretKey || !supabaseUrl || !serviceRoleKey) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        error:
          "Missing STRIPE_SECRET_KEY, SUPABASE_URL, or SUPABASE_SERVICE_ROLE_KEY environment variable in Netlify.",
      }),
    };
  }

  try {
    const { sessionId } = JSON.parse(event.body);
    if (!sessionId) {
      return { statusCode: 400, body: JSON.stringify({ error: "Missing sessionId" }) };
    }

    const stripe = new Stripe(secretKey);
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== "paid") {
      return {
        statusCode: 200,
        body: JSON.stringify({ unlocked: false, reason: "Payment not completed." }),
      };
    }

    const { goalId, userId } = session.metadata || {};
    if (!goalId || !userId) {
      return { statusCode: 500, body: JSON.stringify({ error: "Session missing metadata." }) };
    }

    // Uses the service role key, which bypasses row-level security —
    // this is the ONLY place in the app allowed to write to
    // unlocked_goals, precisely because it only runs after Stripe
    // itself has confirmed the payment above.
    const upsertRes = await fetch(`${supabaseUrl}/rest/v1/unlocked_goals`, {
      method: "POST",
      headers: {
        apikey: serviceRoleKey,
        Authorization: `Bearer ${serviceRoleKey}`,
        "Content-Type": "application/json",
        Prefer: "resolution=merge-duplicates",
      },
      body: JSON.stringify({
        user_id: userId,
        goal_id: goalId,
        stripe_session_id: sessionId,
      }),
    });

    if (!upsertRes.ok) {
      const errText = await upsertRes.text();
      return { statusCode: 500, body: JSON.stringify({ error: errText }) };
    }

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ unlocked: true, goalId }),
    };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
}
