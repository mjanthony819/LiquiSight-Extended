// server.js  — LiquiSight backend using Google Gemini
require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;

if (!GOOGLE_API_KEY) {
  console.warn("⚠️ GOOGLE_API_KEY is missing from .env");
}

// Chat endpoint called by the Chrome extension popup
app.post("/api/chat", async (req, res) => {
  const { message } = req.body || {};
  if (!message) {
    return res.status(400).json({ reply: "No message provided" });
  }

  try {
    const url =
      "https://generativelanguage.googleapis.com/v1beta/models/" +
      "gemini-1.5-flash-latest:generateContent?key=" +
      GOOGLE_API_KEY;

    const body = {
      contents: [
        {
          parts: [
            {
              text:
                "You are LiquiSight, an AI financial copilot. " +
                "Be concise and clear. You are NOT giving financial advice, " +
                "only educational insights.\n\nUser: " +
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

    if (!response.ok) {
      const errText = await response.text();
      console.error("Gemini error:", response.status, errText);
      return res
        .status(500)
        .json({ reply: "Gemini API error: " + response.status });
    }

    const data = await response.json();

    const reply =
      data.candidates?.[0]?.content?.parts
        ?.map((p) => p.text || "")
        .join(" ")
        .trim() || "I couldn't generate a response right now.";

    res.json({ reply });
  } catch (err) {
    console.error("Backend error:", err);
    res
      .status(500)
      .json({ reply: "Backend error while calling Google Gemini API." });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`LiquiSight backend running on http://localhost:${PORT}`);
});