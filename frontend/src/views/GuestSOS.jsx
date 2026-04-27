import React, { useState } from 'react';

const QUICK_FILL = [
  {
    label: '🔥 Fire — Room 304',
    room: 'Room 304',
    description: 'Smoke coming from under the bathroom door',
  },
  {
    label: '🏥 Medical — Room 712',
    room: 'Room 712',
    description: 'Guest collapsed, not breathing',
  },
  {
    label: '🔒 Security — Room 101',
    room: 'Room 101',
    description: 'Suspicious person trying to break in',
  },
];

export default function GuestSOS() {
  const [room, setRoom] = useState('');
  const [description, setDescription] = useState('');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (!room.trim() || !description.trim()) {
      setError('Please fill in both room number and description.');
      return;
    }

    setSending(true);
    setError('');
    setSent(false);
    setResult(null);

    try {
      const res = await fetch('/api/sos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ room: room.trim(), description: description.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed');

      setResult(data);
      setSent(true);
      setRoom('');
      setDescription('');
    } catch (err) {
      setError(err.message || 'Failed to send SOS. Please try again.');
    } finally {
      setSending(false);
    }
  };

  const handleQuickFill = (q) => {
    setRoom(q.room);
    setDescription(q.description);
    setSent(false);
    setResult(null);
    setError('');
  };

  return (
    <div className="max-w-lg mx-auto">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 mb-3">
          <span className="text-3xl">🚨</span>
        </div>
        <h2 className="text-2xl font-bold text-white mb-1">Emergency SOS</h2>
        <p className="text-sm text-slate-400">
          Report an emergency. Help is on the way.
        </p>
      </div>

      {/* Quick-fill scenario buttons */}
      <div className="mb-6">
        <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-2">
          Quick Scenarios (Demo)
        </p>
        <div className="flex flex-col gap-2">
          {QUICK_FILL.map((q, i) => (
            <button
              key={i}
              id={`quickfill-${i}`}
              onClick={() => handleQuickFill(q)}
              className="text-left px-4 py-2.5 rounded-lg text-sm bg-crisis-surface border border-crisis-border hover:border-slate-500 transition-colors text-slate-300"
            >
              {q.label}
            </button>
          ))}
        </div>
      </div>

      {/* Form */}
      <div className="space-y-4 mb-6">
        <div>
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
            Room Number
          </label>
          <input
            id="sos-room"
            type="text"
            placeholder="e.g. Room 304"
            value={room}
            onChange={(e) => setRoom(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-crisis-surface border border-crisis-border text-white placeholder-slate-500 focus:outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/20 transition-all text-sm"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
            What's Happening?
          </label>
          <textarea
            id="sos-description"
            placeholder="Describe the emergency..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className="w-full px-4 py-3 rounded-xl bg-crisis-surface border border-crisis-border text-white placeholder-slate-500 focus:outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/20 transition-all text-sm resize-none"
          />
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm animate-fade-in">
          {error}
        </div>
      )}

      {/* SOS Button */}
      <button
        id="sos-send"
        onClick={handleSubmit}
        disabled={sending}
        className={`sos-glow w-full py-5 rounded-2xl text-white font-black text-xl uppercase tracking-wider transition-all ${
          sending
            ? 'bg-red-800 cursor-wait opacity-70'
            : 'bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 cursor-pointer'
        }`}
      >
        {sending ? (
          <span className="flex items-center justify-center gap-3">
            <svg
              className="animate-spin h-6 w-6"
              viewBox="0 0 24 24"
              fill="none"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
            Sending SOS...
          </span>
        ) : (
          '🚨 SEND SOS'
        )}
      </button>

      {/* Success + Triage Result */}
      {sent && result && (
        <div className="mt-6 animate-slide-up">
          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 mb-4">
            <p className="text-emerald-400 font-semibold text-sm flex items-center gap-2">
              <span className="text-lg">✅</span> SOS Sent — Help is on the way
            </p>
            <p className="text-xs text-slate-400 mt-1">
              Incident ID: {result.id}
            </p>
          </div>

          {/* Guest instructions */}
          {result.guest_instructions && (
            <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
              <p className="text-[11px] font-semibold text-blue-400 uppercase tracking-wider mb-2">
                What You Should Do Now
              </p>
              <p className="text-sm text-slate-300 leading-relaxed">
                {result.guest_instructions}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
