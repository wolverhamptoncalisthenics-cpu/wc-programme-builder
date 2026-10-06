// Called directly by the coach dashboard right after a programme is
// saved and marked "ready". Emails the person whose programme it is,
// letting them know it's waiting for them.

import { getTransporter } from "./lib/gmail.js";

export async function handler(event) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method not allowed" };
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

    const transporter = getTransporter();
    await transporter.sendMail({
      from: `Wolverhampton Calisthenics <${process.env.GMAIL_USER}>`,
      to: clientEmail,
      subject: "Your programme is ready!",
      html: emailBody,
    });

    return { statusCode: 200, body: JSON.stringify({ sent: true }) };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
}
