// Checks a submitted access code against an environment variable on
// Netlify's servers — the code itself never ships to the browser, so
// people can't just view-source or inspect the page to find it.
//
// For each paid goal, set an environment variable in Netlify named:
//   UNLOCK_CODE_<GOAL_ID>
// where <GOAL_ID> is the goal's id from src/App.jsx, uppercased with
// hyphens replaced by underscores. For example, the goal id
// "first-strict-pull-up" needs a variable named:
//   UNLOCK_CODE_FIRST_STRICT_PULL_UP
// and "press-handstand" needs:
//   UNLOCK_CODE_PRESS_HANDSTAND
//
// Set the value to whatever code you want people to enter after they
// pay (e.g. "PULLUP2026"). You can change these any time in Netlify
// without redeploying the app.

export async function handler(event) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method not allowed" };
  }

  try {
    const { goalId, code } = JSON.parse(event.body);
    if (!goalId || !code) {
      return { statusCode: 400, body: JSON.stringify({ valid: false }) };
    }

    const envKey = `UNLOCK_CODE_${goalId.toUpperCase().replace(/-/g, "_")}`;
    const expected = process.env[envKey];

    const valid = Boolean(expected) && code.trim() === expected.trim();

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ valid }),
    };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ valid: false, error: err.message }) };
  }
}
