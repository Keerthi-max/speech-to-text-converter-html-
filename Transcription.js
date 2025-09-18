const mongoose = require('mongoose');

const TranscriptionSchema = new mongoose.Schema({
  filename: { type: String, required: true },
  originalName: { type: String },
  text: { type: String, required: true },
  durationSeconds: { type: Number },
  createdAt: { type: Date, default: Date.now },
  provider: { type: String, default: 'openai-whisper' }
});

module.exports = mongoose.model('Transcription', TranscriptionSchema);