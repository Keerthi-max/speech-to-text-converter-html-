const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const FormData = require('form-data');
const axios = require('axios');
const Transcription = require('../models/Transcription');

const uploadDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const ts = Date.now();
    cb(null, `${ts}-${file.originalname}`);
  }
});
const upload = multer({ storage });

router.post('/', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

    const filePath = req.file.path;
    const openaiKey = process.env.OPENAI_API_KEY;
    if (!openaiKey) {
      return res.status(500).json({ error: 'OpenAI API key not configured on server.' });
    }

    const form = new FormData();
    form.append('file', fs.createReadStream(filePath));
    form.append('model', 'whisper-1');

    const response = await axios.post('https://api.openai.com/v1/audio/transcriptions', form, {
      headers: {
        ...form.getHeaders(),
        Authorization: `Bearer ${openaiKey}`
      },
      maxBodyLength: Infinity
    });

    const transcriptionText = response.data.text || '';

    const doc = new Transcription({
      filename: req.file.filename,
      originalName: req.file.originalname,
      text: transcriptionText,
      provider: 'openai-whisper'
    });
    await doc.save();

    res.json({
      message: 'Transcribed',
      transcription: transcriptionText,
      doc
    });
  } catch (err) {
    console.error('Transcription error', err?.response?.data || err.message || err);
    res.status(500).json({ error: 'Transcription failed', details: err?.response?.data || err.message });
  }
});

router.get('/list', async (req, res) => {
  try {
    const items = await Transcription.find().sort({ createdAt: -1 }).limit(50);
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch' });
  }
});

module.exports = router;