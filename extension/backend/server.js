// server.js — LiquiSight backend using Google Gemini with safe fallbacks
const path = require("path");
require("dotenv").config({
  path: path.resolve(__dirname, "..", "..", ".env"),
});
const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// Accept any of these env var names as the key
const GOOGLE_API_KEY =
  process.env.GOOGLE_API_KEY ||      // main
  process.env.GEMINI_API_KEY ||      // fallback 1
  process.env.LIQUISIGHT_API_KEY;    // fallback 2

function fallbackReply(message) {
  return (
    "LiquiSight (fallback mode): I couldn't reach the Gemini API just now, " +
    "so this is a generic but consistent response for the demo.\n\n" +
    "You asked:\n\"" +
    message +
    "\"\n\n" +
    "In the full version, I would call Google's Gemini model to analyze market context " +
    "and any charts/tickers you’re looking at on screen."
  );
}

// Chat endpoint used by the Chrome extension popup
app.post("/api/chat", async (req, res) => {
  const { message } = req.body || {};
  if (!message) {
    return res.status(400).json({ reply: "No message provided" });
  }

  // If there's no key at all, immediately return fallback (still HTTP 200)
  if (!GOOGLE_API_KEY) {
    console.warn("No Gemini API key set. Responding with offline fallback.");
    return res.json({ reply: fallbackReply(message) });
  }

  try {
    const url =
  "https://generativelanguage.googleapis.com/v1/models/" +
  "gemini-1.5-flash-latest:generateContent?key=" +
  GOOGLE_API_KEY;
    const body = {
      contents: [
        {
          parts: [
            {
              text:
                "You are LiquiSight, an AI financial copilot. " +
                "Be concise and clear. Do NOT give direct financial advice; " +
                "speak in educational / informational terms only.\n\n" +
                "User message:\n" +
                message
            }
          ]
        }
      ]
    };

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });

    // If Gemini returns error (401, 403, 429, 5xx...), log it but still return 200 to the extension
    if (!response.ok) {
      const errText = await response.text();
      console.error("Gemini HTTP error:", response.status, errText);
      return res.json({ reply: fallbackReply(message) });
    }

    const data = await response.json();

    const reply =
      data.candidates?.[0]?.content?.parts
        ?.map((p) => p.text || "")
        .join(" ")
        .trim() || fallbackReply(message);

    return res.json({ reply });
  } catch (err) {
    console.error("Gemini call threw error:", err);
    // Never send 500 to the extension: always return a fallback message
    return res.json({ reply: fallbackReply(message) });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`LiquiSight backend running on http://localhost:${PORT}`);
  if (!GOOGLE_API_KEY) {
    console.log("No API key configured. Running in offline fallback mode.");
  }
});