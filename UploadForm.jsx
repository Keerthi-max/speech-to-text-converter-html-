import React, { useState } from 'react';
import axios from 'axios';

export default function UploadForm({ apiBase = 'http://localhost:4000', onSuccess }) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!file) return alert('Select a file');

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
      alert('Upload or transcription failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-3">
      <input
        type="file"
        accept="audio/*"
        onChange={(e) => setFile(e.target.files[0])}
        className="block"
      />
      <button
        type="submit"
        className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-60"
        disabled={loading}
      >
        {loading ? 'Transcribing...' : 'Upload & Transcribe'}
      </button>
    </form>
  );
}