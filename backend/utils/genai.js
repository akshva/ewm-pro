// backend/utils/genai.js
const axios = require("axios");

const API_KEY = process.env.GOOGLE_API_KEY;
const MODEL = "gemini-2.5-flash";
const ENDPOINT = `https://generativelanguage.googleapis.com/v1/models/${MODEL}:generateContent`;

if (!API_KEY) {
  throw new Error("GOOGLE_API_KEY is not set in environment variables");
}

// simple delay helper
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function generateText(prompt, retries = 3) {
  const body = {
    contents: [
      {
        parts: [{ text: prompt }]
      }
    ]
  };

  try {
    const res = await axios.post(
      `${ENDPOINT}?key=${API_KEY}`,
      body,
      { headers: { "Content-Type": "application/json" } }
    );

    const text = res.data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
      throw new Error("Empty response from Gemini");
    }

    return text.trim();

  } catch (error) {
    // 🔁 Handle quota exceeded (429)
    if (error.response?.status === 429 && retries > 0) {
      const retryAfter =
        error.response.data?.error?.details?.[0]?.retryDelay?.seconds || 30;

      console.warn(
        `⚠️ Gemini quota exceeded. Retrying in ${retryAfter}s...`
      );

      await sleep(retryAfter * 1000);
      return generateText(prompt, retries - 1);
    }

    // ❌ Any other error → fail fast
    const msg =
      error.response?.data?.error?.message ||
      error.message ||
      "Unknown Gemini API error";

    console.error("❌ GEMINI API ERROR:", msg);
    throw new Error(msg);
  }
}

module.exports = { generateText };
