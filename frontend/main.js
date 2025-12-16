// frontend/main.js
const API_ROOT = 'http://localhost:3000/api';

let currentQuestion = null;

function setScoreboard(correctInc = 0, attemptedInc = 0) {
  const s = JSON.parse(localStorage.getItem('ewaste_score') || '{"correct":0,"attempted":0}');
  s.correct += correctInc;
  s.attempted += attemptedInc;
  localStorage.setItem('ewaste_score', JSON.stringify(s));
  document.getElementById('scoreBoard').innerText = `${s.correct} correct / ${s.attempted} attempted`;
}

function resetScore() {
  localStorage.setItem('ewaste_score', JSON.stringify({correct:0,attempted:0}));
  setScoreboard(0,0);
}

async function newQuestion() {
  document.getElementById('questionText').innerText = 'Loading question…';
  document.getElementById('options').innerHTML = '';
  document.getElementById('feedback').innerHTML = '';

  try {
    const resp = await fetch(`${API_ROOT}/generate-quiz`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ topic: 'e-waste recycling' })
    });
    
    const json = await resp.json();
    
    if (!resp.ok) {
      const errorMsg = json.error || `HTTP error! status: ${resp.status}`;
      throw new Error(errorMsg);
    }
    if (!json.ok) {
      const errorMsg = json.error || 'Unknown error';
      document.getElementById('questionText').innerText = `Failed to get question: ${errorMsg}`;
      console.error('Quiz API error:', json);
      return;
    }
    
    const data = json.data;
    currentQuestion = data;
    document.getElementById('questionText').innerText = data.question;
    const optionsDiv = document.getElementById('options');
    optionsDiv.innerHTML = '';
    (data.options || []).forEach((opt, i) => {
      const li = document.createElement('button');
      li.className = 'list-group-item list-group-item-action';
      li.innerText = `${String.fromCharCode(65+i)}. ${opt}`;
      li.onclick = () => checkAnswer(String.fromCharCode(65+i));
      optionsDiv.appendChild(li);
    });
  } catch (error) {
    document.getElementById('questionText').innerText = `Failed to get question: ${error.message}`;
    console.error('Fetch error:', error);
  }
}

function checkAnswer(selected) {
  if (!currentQuestion) return;
  const correct = currentQuestion.answer;
  const feedback = document.getElementById('feedback');
  if (selected === correct) {
    feedback.innerHTML = `<div class="alert alert-success">Correct! ✅</div><div class="small text-muted">${currentQuestion.explanation || ''}</div>`;
    setScoreboard(1,1);
  } else {
    feedback.innerHTML = `<div class="alert alert-danger">Wrong — correct: ${correct}</div><div class="small text-muted">${currentQuestion.explanation || ''}</div>`;
    setScoreboard(0,1);
  }
}

async function showExplanation() {
  if (!currentQuestion) return alert("Get a question first");

  const resp = await fetch(`${API_ROOT}/explain`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text: currentQuestion.question })
  });

  const json = await resp.json();

  const tipList = document.getElementById("tipList");
  tipList.innerHTML = "";

  // Clean AI explanation text
  const text = json.explanation
    .replace(/\*\*/g, "")       // remove **bold**
    .replace(/\n/g, " ")        // remove newlines
    .replace(/Eco[- ]?friendly tips:?/gi, "") // remove "eco-friendly tips" headers
    .trim();

  // Extract bullet/numbered tips
  // Works for: "1. ... 2. ..." OR "- ... - ..." OR "• ..." etc.
  const tips = text
    .split(/(?:\d+\.\s+|[-•]\s+)/)  // split by: 1. OR - text OR • text
    .map(t => t.trim())
    .filter(t => t.length > 5);     // remove empty items

  // If Gemini returned the explanation first then the tips,
  // first item is usually the explanation – remove it.
  if (tips.length > 2) {
    tips.shift(); // remove explanation part
  }

  // show only 2 tips to keep UI clean
  const finalTips = tips.slice(0, 2);

  finalTips.forEach(t => {
    tipList.innerHTML += `<li>${t}</li>`;
  });
}


async function askBot() {
  const q = document.getElementById('chatInput').value;
  if (!q) return;
  document.getElementById('chatAnswer').innerText = 'Thinking…';
  const resp = await fetch(`${API_ROOT}/ask`, {
    method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ question: q })
  });
  const json = await resp.json();
  if (json.ok) document.getElementById('chatAnswer').innerText = json.answer;
  else document.getElementById('chatAnswer').innerText = 'Error: ' + json.error;
}

document.getElementById('newQuestionBtn').addEventListener('click', newQuestion);
document.getElementById('showExplanationBtn').addEventListener('click', showExplanation);
document.getElementById('askBtn').addEventListener('click', askBot);
document.getElementById('resetScoreBtn').addEventListener('click', () => { resetScore(); });

// initial
document.addEventListener('DOMContentLoaded', () => {
  const facts = [
    'Only 20% of e-waste is formally recycled globally.',
    'Batteries and screens are hazardous components—don’t throw them in regular trash.',
    'Recycling recovers valuable metals like gold, silver, and copper.'
  ];
  const factsList = document.getElementById('factsList');
  facts.forEach(f => {
    const li = document.createElement('li'); li.innerText = f; factsList.appendChild(li);
  });
  // load scoreboard
  if (!localStorage.getItem('ewaste_score')) resetScore();
  else {
    const s = JSON.parse(localStorage.getItem('ewaste_score'));
    document.getElementById('scoreBoard').innerText = `${s.correct} correct / ${s.attempted} attempted`;
  }
});
