import React from 'react';

export default function TranscriptionList({ items = [] }) {
  if (!items.length) {
    return <div className="text-sm text-gray-500">No transcriptions yet.</div>;
  }
  return (
    <div className="space-y-3">
      {items.map((it) => (
        <div key={it._id || it.filename || Math.random()} className="p-3 border rounded">
          <div className="text-xs text-gray-500">{it.originalName || it.filename}</div>
          <div className="mt-2 whitespace-pre-wrap">{it.text}</div>
          <div className="text-xs text-gray-400 mt-2">{new Date(it.createdAt || Date.now()).toLocaleString()}</div>
        </div>
      ))}
    </div>
  );
}