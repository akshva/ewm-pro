// backend/utils/genai.js
const axios = require("axios");

const API_KEY = process.env.GOOGLE_API_KEY;

async function generateText(prompt) {
  const url = `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${API_KEY}`;

  const body = {
    contents: [
      {
        parts: [{ text: prompt }]
      }
    ]
  };

  const resp = await axios.post(url, body, {
    headers: { "Content-Type": "application/json" }
  });

  return resp.data.candidates?.[0]?.content?.parts?.[0]?.text || "";
}

module.exports = { generateText };
