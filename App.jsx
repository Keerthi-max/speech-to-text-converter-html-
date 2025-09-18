import React, { useState, useEffect } from 'react';
import UploadForm from './components/UploadForm';
import Recorder from './components/Recorder';
import TranscriptionList from './components/TranscriptionList';
import axios from 'axios';

export default function App() {
  const [transcriptions, setTranscriptions] = useState([]);
  const API = import.meta.env.VITE_API_URL || 'http://localhost:4000';

  const fetchTranscriptions = async () => {
    try {
      const res = await axios.get(`${API}/api/transcribe/list`).catch(() => null);
      if (res && res.data) setTranscriptions(res.data);
    } catch (err) {
      console.log('fetch error', err);
    }
  };

  useEffect(() => {
    fetchTranscriptions();
  }, []);

  const onNewTranscription = (doc) => setTranscriptions((s) => [doc, ...s]);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">Speech-to-Text</h1>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="p-4 bg-white rounded shadow">
            <h2 className="font-semibold mb-2">Upload audio file</h2>
            <UploadForm apiBase={API} onSuccess={onNewTranscription} />
          </div>

          <div className="p-4 bg-white rounded shadow">
            <h2 className="font-semibold mb-2">Record audio</h2>
            <Recorder apiBase={API} onSuccess={onNewTranscription} />
          </div>
        </div>

        <div className="p-4 bg-white rounded shadow">
          <h2 className="font-semibold mb-2">Transcriptions</h2>
          <TranscriptionList items={transcriptions} />
        </div>
      </div>
    </div>
  );
}