import React, { useState, useRef } from 'react';
import axios from 'axios';

export default function Recorder({ apiBase = 'http://localhost:4000', onSuccess }) {
  const [rec, setRec] = useState(false);
  const [loading, setLoading] = useState(false);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);

  const start = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mr = new MediaRecorder(stream);
      mediaRecorderRef.current = mr;
      chunksRef.current = [];
      mr.ondataavailable = (e) => chunksRef.current.push(e.data);
      mr.onstop = async () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        const file = new File([blob], `recording-${Date.now()}.webm`, { type: 'audio/webm' });
        const form = new FormData();
        form.append('file', file);
        setLoading(true);
        try {
          const res = await axios.post(`${apiBase}/api/transcribe`, form, {
            headers: { 'Content-Type': 'multipart/form-data' },
            timeout: 120000
          });
          if (res.data) {
            alert('Transcribed successfully');
            if (onSuccess) onSuccess(res.data.doc || res.data);
          }
        } catch (err) {
          console.error(err);
          alert('Upload/transcription failed');
        } finally {
          setLoading(false);
        }
      };
      mr.start();
      setRec(true);
    } catch (err) {
      alert('Microphone permission denied or not available');
    }
  };

  const stop = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    setRec(false);
  };

  return (
    <div className="space-y-3">
      <div>
        {!rec ? (
          <button onClick={start} className="px-4 py-2 bg-green-600 text-white rounded">
            Start Recording
          </button>
        ) : (
          <button onClick={stop} className="px-4 py-2 bg-red-600 text-white rounded">
            Stop Recording
          </button>
        )}
      </div>
      {loading && <div>Transcribing recording...</div>}
    </div>
  );
}