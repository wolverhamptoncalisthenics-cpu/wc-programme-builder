// Called directly by the coach dashboard right after a programme is
// saved and marked "ready". Emails the person whose programme it is,
// letting them know it's waiting for them.

export async function handler(event) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method not allowed" };
  }

  const resendApiKey = process.env.RESEND_API_KEY;

  if (!resendApiKey) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Missing RESEND_API_KEY environment variable in Netlify.",
      }),
    };
  }

  try {
    const { clientEmail, goalLabel } = JSON.parse(event.body);

    if (!clientEmail) {
      return { statusCode: 400, body: JSON.stringify({ error: "Missing clientEmail" }) };
    }

    const siteUrl = process.env.URL || "";

    const emailBody = `
      <h2>Your programme is ready!</h2>
      <p>Your ${goalLabel} programme has been built and is waiting for you.</p>
      <p>Log in to your account to see it${siteUrl ? `: <a href="${siteUrl}">${siteUrl}</a>` : "."}</p>
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
        to: clientEmail,
        subject: "Your programme is ready!",
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
