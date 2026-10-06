// Sends email through your own Gmail account, using an "App Password"
// rather than your normal login password (Google requires this for
// any app sending on your behalf). See README for how to set one up.
//
// Requires two environment variables in Netlify:
//   GMAIL_USER          — your Gmail address, e.g. wolverhamptoncalisthenics@gmail.com
//   GMAIL_APP_PASSWORD  — the 16-character app password from Google

import nodemailer from "nodemailer";

export function getTransporter() {
  const user = process.env.GMAIL_USER;
  const pass = process.env.GMAIL_APP_PASSWORD;

  if (!user || !pass) {
    throw new Error("Missing GMAIL_USER or GMAIL_APP_PASSWORD environment variable in Netlify.");
  }

  return nodemailer.createTransport({
    service: "gmail",
    auth: { user, pass },
  });
}
