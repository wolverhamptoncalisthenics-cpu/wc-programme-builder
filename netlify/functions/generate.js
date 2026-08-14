// This function runs on Netlify's servers, never in the visitor's browser.
// Your Anthropic API key stays here — set it in Netlify as an environment
// variable named ANTHROPIC_API_KEY (Site settings > Environment variables).
// It is never sent to, or visible from, the person using the app.

export async function handler(event) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method not allowed" };
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        error:
          "No ANTHROPIC_API_KEY set on the server. Add it under Site settings > Environment variables in Netlify.",
      }),
    };
  }

  try {
    const { system, messages } = JSON.parse(event.body);

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-5",
        max_tokens: 1200,
        system,
        messages,
      }),
    });

    const data = await response.json();

    return {
      statusCode: response.ok ? 200 : response.status,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
}
