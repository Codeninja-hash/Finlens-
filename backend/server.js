const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const authMiddleware = require('./src/middleware/auth');
const authController = require('./src/controllers/authController');
const analyzeController = require('./src/controllers/analyzeController');
const compareController = require('./src/controllers/compareController');
const toolsController = require('./src/controllers/toolsController');
const { seedDatabase } = require('./src/data/seedData');
const db = require('./src/config/db');

const app = express();
const PORT = process.env.PORT || 5000;

// Setup upload directory
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const upload = multer({
  dest: uploadsDir,
  limits: { fileSize: 6 * 1024 * 1024 }
});

app.use(cors());
app.use(express.json());
app.use(authMiddleware);

// Seed on bootstrap
seedDatabase();

// Authentication
app.post('/api/auth/register', authController.register);
app.post('/api/auth/login', authController.login);

// Analysis routes
app.post('/api/analyze/text', analyzeController.analyzeText);
app.post('/api/analyze/manual', analyzeController.analyzeManual);
app.post('/api/analyze/ocr', upload.single('image'), analyzeController.analyzeOCR);

// Comparison
app.post('/api/compare', compareController.compareOffers);

// Interactive tools
app.post('/api/tools/credit-card', toolsController.simulateCreditCard);
app.post('/api/tools/bnpl', toolsController.simulateBNPL);
app.post('/api/tools/subscriptions', toolsController.calculateSubscriptions);
app.post('/api/tools/opportunity-cost', toolsController.calculateOpportunity);
app.post('/api/tools/quiz-score', toolsController.recordQuizScore);

// History management
app.get('/api/history', (req, res) => {
  try {
    const rows = db.prepare('SELECT * FROM analyses ORDER BY created_at DESC LIMIT 50').all();
    const parsed = rows.map(r => ({
      ...r,
      detected_patterns: JSON.parse(r.detected_patterns || '[]'),
      calculation_breakdown: JSON.parse(r.calculation_breakdown || '{}')
    }));
    res.json(parsed);
  } catch (err) {
    res.status(500).json({ error: 'Could not fetch history.' });
  }
});

app.delete('/api/history/:id', (req, res) => {
  try {
    db.prepare('DELETE FROM analyses WHERE id = ?').run(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete record.' });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'operational', timestamp: new Date().toISOString() });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`[FinLens Backend] Online on port ${PORT}`);
});
