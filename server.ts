import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;
const DATA_FILE = path.join(__dirname, 'suggestions.json');

app.use(express.json());

// Initialize suggestions file if it doesn't exist
if (!fs.existsSync(DATA_FILE)) {
  fs.writeFileSync(DATA_FILE, JSON.stringify([], null, 2));
}

// Endpoint to submit a suggestion
app.post('/api/suggestions', (req, res) => {
  const { type, description } = req.body;

  if (!type || !description) {
    return res.status(400).json({ error: 'Type and description are required' });
  }

  const suggestions = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
  const newSuggestion = {
    id: Date.now(),
    type,
    description,
    createdAt: new Date().toISOString(),
  };

  suggestions.push(newSuggestion);
  fs.writeFileSync(DATA_FILE, JSON.stringify(suggestions, null, 2));

  res.status(201).json(newSuggestion);
});

// Endpoint to get all suggestions (protected by a simple mock token)
app.get('/api/suggestions', (req, res) => {
  const authHeader = req.headers.authorization;
  if (authHeader !== 'Bearer mock-google-token') {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const suggestions = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
  res.json(suggestions);
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
