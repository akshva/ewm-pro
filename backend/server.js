// backend/server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { generateText } = require('./utils/genai'); // updated AI wrapper

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// PROMPT TO GENERATE QUIZ QUESTION IN JSON FORMAT
function quizPrompt(topic = "e-waste recycling") {
  return `
Generate ONE multiple-choice question about ${topic}.

Return STRICT JSON ONLY like this:

{
  "question": ".....",
  "options": ["A", "B", "C", "D"],
  "answer": "A",
  "explanation": "short explanation",
  "tip": "short actionable recycling tip"
}

DO NOT add anything outside the JSON block.
`;
}

// ----------------------- API ROUTES ----------------------- //

// 📌 Generate a quiz question
app.post("/api/generate-quiz", async (req, res) => {
  try {
    const topic = req.body.topic || "e-waste recycling";

    const prompt = quizPrompt(topic);
    const aiText = await generateText(prompt); // now returns plain text

    let parsed;

    try {
      parsed = JSON.parse(aiText.trim());
    } catch (err) {
      // attempt to extract JSON if the model adds extra text
      const match = aiText.match(/\{[\s\S]*\}/);
      if (match) {
        parsed = JSON.parse(match[0]);
      } else {
        return res.json({ ok: false, error: "AI did not return valid JSON", raw: aiText });
      }
    }

    res.json({ ok: true, data: parsed });
  } catch (error) {
    console.error("QUIZ ERROR:", error);
    res.status(500).json({ ok: false, error: error.message });
  }
});

// 📌 Generate explanation for a question or concept
app.post("/api/explain", async (req, res) => {
  try {
    const { text } = req.body;
    const prompt = `Explain this in 2–3 simple sentences and give 2 eco-friendly tips:\n\n${text}`;

    const aiText = await generateText(prompt);

    res.json({ ok: true, explanation: aiText });
  } catch (error) {
    console.error("EXPLAIN ERROR:", error);
    res.status(500).json({ ok: false, error: error.message });
  }
});

// 📌 Eco-Bot Chat
app.post("/api/ask", async (req, res) => {
  try {
    const { question } = req.body;

    const prompt = `
You are an eco-friendly assistant.
Answer briefly (2–4 lines) and include one actionable recycling tip.
Question: ${question}
`;

    const aiText = await generateText(prompt);

    res.json({ ok: true, answer: aiText });
  } catch (error) {
    console.error("ASK ERROR:", error);
    res.status(500).json({ ok: false, error: error.message });
  }
});

// ----------------------- START SERVER ----------------------- //

app.listen(port, () => {
  console.log(`Backend running at http://localhost:${port}`);
});
