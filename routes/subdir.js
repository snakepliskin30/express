import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

router.get('^/$|/index(.html)?', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'views', 'subdir', 'index.html'));
});

router.get('/test(.html)?', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'views', 'subdir', 'test.html'));
});

export default router;
