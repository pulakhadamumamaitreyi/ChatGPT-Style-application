const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const DATA_FILE = path.join(__dirname, 'mock_data.json');
const app = express();
app.use(cors());
app.use(express.json());

let DATA = { sessions: [] };
try {
  const raw = fs.readFileSync(DATA_FILE, 'utf8');
  DATA = JSON.parse(raw);
} catch (err) {
  console.log('No mock_data.json found — starting with empty data');
}

function persist() {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(DATA, null, 2));
  } catch (err) {
    console.error('Failed to persist data', err);
  }
}

function makeDummyAnswer(question) {
  const cols = ['Name', 'Value', 'Notes'];
  const rows = [];
  for (let i = 1; i <= 5; i++) {
    rows.push([`${(question || 'Item').slice(0, 8)}-${i}`, (Math.random() * 100).toFixed(2), `note ${i}`]);
  }
  return {
    id: uuidv4(),
    question,
    description: `Mock answer for: "${question}". Structured tabular data below.`,
    table: { columns: cols, rows },
    createdAt: new Date().toISOString(),
    feedback: { likes: 0, dislikes: 0 }
  };
}


app.post('/api/new-session', (req, res) => {
  const id = uuidv4();
  const title = req.body?.title || `Session ${DATA.sessions.length + 1}`;
  const session = { id, title, createdAt: new Date().toISOString(), messages: [] };
  DATA.sessions.unshift(session);
  persist();
  res.json({ success: true, session });
});


app.get('/api/sessions', (req, res) => {
  const list = DATA.sessions.map(s => ({ id: s.id, title: s.title, createdAt: s.createdAt }));
  res.json({ success: true, sessions: list });
});

app.get('/api/session/:id/history', (req, res) => {
  const id = req.params.id;
  const session = DATA.sessions.find(s => s.id === id);
  if (!session) return res.status(404).json({ success: false, error: 'Session not found' });
  res.json({ success: true, session });
});

app.post('/api/session/:id/ask', (req, res) => {
  const id = req.params.id;
  const { question } = req.body || {};
  const session = DATA.sessions.find(s => s.id === id);
  if (!session) return res.status(404).json({ success: false, error: 'Session not found' });
  const answer = makeDummyAnswer(question || 'No question');
  session.messages.push({ role: 'user', text: question || '', createdAt: new Date().toISOString() });
  session.messages.push({ role: 'assistant', ...answer });
  persist();
  res.json({ success: true, answer });
});

app.post('/api/session/:id/feedback', (req, res) => {
  const id = req.params.id;
  const { answerId, type } = req.body || {};
  const session = DATA.sessions.find(s => s.id === id);
  if (!session) return res.status(404).json({ success: false, error: 'Session not found' });
  const ans = session.messages.find(m => m.id === answerId);
  if (!ans) return res.status(404).json({ success: false, error: 'Answer not found' });
  if (!ans.feedback) ans.feedback = { likes: 0, dislikes: 0 };
  if (type === 'like') ans.feedback.likes++;
  if (type === 'dislike') ans.feedback.dislikes++;
  persist();
  res.json({ success: true, feedback: ans.feedback });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Mock API server running on http://localhost:${PORT}`));
