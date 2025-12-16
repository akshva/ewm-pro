# ♻️ E-Waste Awareness — AI Quiz

A simple interactive website that teaches e-waste recycling using AI-generated quiz questions and eco-friendly tips.

![Project Screenshot](img.png)

## 🚀 Features
- AI-generated multiple-choice quiz questions  
- Scoreboard (correct / attempted)  
- Explanation + eco tips for every question  
- Eco-Bot chatbot to ask recycling questions  
- Clean UI built with HTML, CSS, Bootstrap  

## 🛠 Tech Used
- Frontend: HTML, CSS, JavaScript, Bootstrap  
- Backend: Node.js + Express  
- AI: Google Gemini 1.5 Flash API  

<<<<<<< HEAD
## 📁 Project Structure
```
ewaste-2/
├── backend/          # Node.js Express server
│   ├── server.js     # Main server file
│   ├── utils/
│   │   └── genai.js  # Google Gemini AI integration
│   └── .env          # Environment variables (API key)
└── frontend/         # Static HTML/CSS/JS
    ├── index.html
    ├── main.js
    └── styles.css
```

## 🚀 Quick Start

### Prerequisites
- Node.js installed (v14 or higher)
- Google Gemini API key ([Get one here](https://makersuite.google.com/app/apikey))

### Step 1: Set up the Backend

1. **Navigate to the backend folder:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create a `.env` file** in the `backend` folder with your API key:
   ```env
   GOOGLE_API_KEY=your_api_key_here
   PORT=3000
   ```

4. **Start the backend server:**
   ```bash
   npm start
   ```
   
   You should see: `Backend running at http://localhost:3000`

### Step 2: Open the Frontend

1. **Open `frontend/index.html` in your web browser**
   - Simply double-click the file, or
   - Right-click → "Open with" → Choose your browser
   - Or use a local server (e.g., VS Code Live Server extension)

2. **Start using the quiz!**
   - Click "New Question" to generate AI-powered quiz questions
   - Answer questions and track your score
   - Use the Eco-Bot to ask recycling questions

### Troubleshooting

- **"Failed to get question" error?** 
  - Make sure the backend server is running
  - Check that `GOOGLE_API_KEY` is set correctly in `backend/.env`
  - Check the browser console (F12) for detailed error messages

- **Backend won't start?**
  - Ensure Node.js is installed: `node --version`
  - Install dependencies: `cd backend && npm install`
  - Check if port 3000 is already in use
=======

>>>>>>> 074740bc585e117f13ae22d4a10019036710dc1a
