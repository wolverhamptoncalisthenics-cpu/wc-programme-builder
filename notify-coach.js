// Called automatically by a Supabase Database Webhook whenever a new
// row is inserted into the "submissions" table. Looks up who
// submitted it, then emails you and Tim via Resend.
//
// This runs server-side and fires even if the person closes their
// browser right after submitting — more reliable than triggering the
// email from the app itself.

export async function handler(event) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method not allowed" };
  }

  // Optional shared-secret check so random requests from the internet
  // can't trigger fake emails. Set WEBHOOK_SECRET in Netlify and add
  // the same value as a header in the Supabase webhook config to use
  // this — safe to leave both unset while you're just testing.
  const expectedSecret = process.env.WEBHOOK_SECRET;
  if (expectedSecret) {
    const providedSecret = event.headers["x-webhook-secret"];
    if (providedSecret !== expectedSecret) {
      return { statusCode: 401, body: "Unauthorized" };
    }
  }

  const resendApiKey = process.env.RESEND_API_KEY;
  const notifyEmail = process.env.COACH_NOTIFY_EMAIL;
  const supabaseUrl = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!resendApiKey || !notifyEmail) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Missing RESEND_API_KEY or COACH_NOTIFY_EMAIL environment variable in Netlify.",
      }),
    };
  }

  try {
    const payload = JSON.parse(event.body);
    const submission = payload.record; // Supabase sends the new row here

    // Look up the submitter's email using the service role key, which
    // can read any row regardless of row-level security. This key is
    // secret — it stays server-side and is never sent to the browser.
    let submitterEmail = "Unknown";
    if (supabaseUrl && serviceRoleKey && submission.user_id) {
      const profileRes = await fetch(
        `${supabaseUrl}/rest/v1/profiles?id=eq.${submission.user_id}&select=email`,
        {
          headers: {
            apikey: serviceRoleKey,
            Authorization: `Bearer ${serviceRoleKey}`,
          },
        }
      );
      const profiles = await profileRes.json();
      if (profiles?.[0]?.email) submitterEmail = profiles[0].email;
    }

    const emailBody = `
      <h2>New programme submission</h2>
      <p><strong>From:</strong> ${submitterEmail}</p>
      <p><strong>Goal:</strong> ${submission.goal_label}</p>
      <p><strong>Level:</strong> ${submission.level}</p>
      <p><strong>Days per week:</strong> ${submission.days}</p>
      <p><strong>Equipment:</strong> ${(submission.equipment || []).join(", ")}</p>
      ${submission.limitations ? `<p><strong>Notes:</strong> ${submission.limitations}</p>` : ""}
      <p>Log into the coach dashboard to build their programme.</p>
    `;

    const sendRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        // Resend's shared testing address — swap for your own verified
        // domain address once you've set one up in Resend, see README.
        from: "Wolverhampton Calisthenics <onboarding@resend.dev>",
        to: notifyEmail,
        subject: `New submission: ${submission.goal_label}`,
        html: emailBody,
      }),
    });

    if (!sendRes.ok) {
      const errText = await sendRes.text();
      return { statusCode: 500, body: JSON.stringify({ error: errText }) };
    }

    return { statusCode: 200, body: JSON.stringify({ sent: true }) };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
}
