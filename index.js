require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const transcribeRoute = require('./routes/transcribe');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

app.use('/api/transcribe', transcribeRoute);

// DB connect
(async function () {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/speechtotext';
    await mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('MongoDB connected');
    app.listen(PORT, () => console.log(`Server listening on http://localhost:${PORT}`));
  } catch (err) {
    console.error('Failed to connect DB', err);
    process.exit(1);
  }
})();