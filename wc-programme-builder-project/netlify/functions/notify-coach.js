// Called directly by the app right after a submission is saved to the
// database. Sends you and Tim an email via your Gmail account.

import { getTransporter } from "./lib/gmail.js";

export async function handler(event) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method not allowed" };
  }

  const notifyEmail = process.env.COACH_NOTIFY_EMAIL;
  if (!notifyEmail) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Missing COACH_NOTIFY_EMAIL environment variable in Netlify." }),
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

    const transporter = getTransporter();
    await transporter.sendMail({
      from: `Wolverhampton Calisthenics <${process.env.GMAIL_USER}>`,
      to: notifyEmail,
      subject: `New submission: ${goalLabel}`,
      html: emailBody,
    });

    return { statusCode: 200, body: JSON.stringify({ sent: true }) };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
}
