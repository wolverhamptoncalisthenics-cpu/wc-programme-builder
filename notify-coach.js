// Called directly by the app right after a submission is saved to the
// database. Sends you and Tim an email via Resend.

export async function handler(event) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method not allowed" };
  }

  const resendApiKey = process.env.RESEND_API_KEY;
  const notifyEmail = process.env.COACH_NOTIFY_EMAIL;

  if (!resendApiKey || !notifyEmail) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Missing RESEND_API_KEY or COACH_NOTIFY_EMAIL environment variable in Netlify.",
      }),
    };
  }

  try {
    const { submitterEmail, goalLabel, level, days, equipment, limitations } = JSON.parse(
      event.body
    );

    const emailBody = `
      <h2>New programme submission</h2>
      <p><strong>From:</strong> ${submitterEmail || "Unknown"}</p>
      <p><strong>Goal:</strong> ${goalLabel}</p>
      <p><strong>Level:</strong> ${level}</p>
      <p><strong>Days per week:</strong> ${days}</p>
      <p><strong>Equipment:</strong> ${(equipment || []).join(", ")}</p>
      ${limitations ? `<p><strong>Notes:</strong> ${limitations}</p>` : ""}
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
        subject: `New submission: ${goalLabel}`,
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
