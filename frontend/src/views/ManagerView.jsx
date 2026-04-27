import React, { useState } from 'react';
import IncidentCard from '../components/IncidentCard';

export default function ManagerView({ incidents }) {
  const [briefingModal, setBriefingModal] = useState(null);
  const [loadingBriefing, setLoadingBriefing] = useState(false);

  const active = incidents.filter((i) => i.status === 'active');
  const resolved = incidents.filter((i) => i.status === 'resolved');

  const handleResolve = async (id) => {
    await fetch(`/api/incidents/${id}/resolve`, { method: 'PATCH' });
  };

  const handleBriefing = async (id) => {
    setLoadingBriefing(true);
    try {
      const res = await fetch(`/api/briefing/${id}`, { method: 'POST' });
      const data = await res.json();
      setBriefingModal(data);
    } catch (err) {
      console.error('Briefing failed', err);
    } finally {
      setLoadingBriefing(false);
    }
  };

  return (
    <div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {[
          { label: 'Total', val: incidents.length, clr: 'text-white', bdr: 'border-crisis-border' },
          { label: 'Active', val: active.length, clr: 'text-red-400', bdr: 'border-red-500/20' },
          { label: 'Resolved', val: resolved.length, clr: 'text-emerald-400', bdr: 'border-emerald-500/20' },
          { label: '911 Flagged', val: incidents.filter((i) => i.notify_911).length, clr: 'text-orange-400', bdr: 'border-orange-500/20' },
        ].map((s) => (
          <div key={s.label} className={`p-4 rounded-xl bg-crisis-surface border ${s.bdr}`}>
            <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">{s.label}</p>
            <p className={`text-3xl font-bold mt-1 ${s.clr}`}>{s.val}</p>
          </div>
        ))}
      </div>

      <h3 className="text-sm font-semibold text-slate-300 mb-3">All Incidents</h3>

      {incidents.length === 0 ? (
        <div className="text-center py-16">
          <span className="text-4xl block mb-3">📊</span>
          <p className="text-slate-400 text-sm">No incidents yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {incidents.map((inc) => (
            <IncidentCard key={inc.id} incident={inc} onResolve={handleResolve} onBriefing={handleBriefing} showStaffInstructions />
          ))}
        </div>
      )}

      {briefingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 modal-backdrop" style={{ backgroundColor: 'rgba(0,0,0,0.7)' }} onClick={() => setBriefingModal(null)}>
          <div className="bg-crisis-surface border border-crisis-border rounded-2xl max-w-lg w-full max-h-[80vh] overflow-y-auto p-6 animate-slide-up" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-white">📋 911 Briefing</h3>
              <button id="close-briefing-modal" onClick={() => setBriefingModal(null)} className="w-8 h-8 rounded-lg bg-slate-700 hover:bg-slate-600 flex items-center justify-center text-slate-400">✕</button>
            </div>
            <div className="mb-3 flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-500/20 text-red-400 border border-red-500/30">{briefingModal.type}</span>
              <span className="text-sm text-slate-400">{briefingModal.room}</span>
            </div>
            <div className="p-4 rounded-lg bg-crisis-bg border border-crisis-border">
              <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-line">{briefingModal.briefing || 'No briefing available.'}</p>
            </div>
            <button onClick={() => setBriefingModal(null)} className="mt-4 w-full py-2.5 rounded-lg text-sm font-semibold bg-crisis-border text-slate-300 hover:bg-slate-600 transition-colors">Close</button>
          </div>
        </div>
      )}

      {loadingBriefing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}>
          <div className="bg-crisis-surface border border-crisis-border rounded-2xl p-8 text-center animate-fade-in">
            <svg className="animate-spin h-10 w-10 text-orange-400 mx-auto mb-4" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            <p className="text-sm text-slate-300">Generating briefing via Gemini AI...</p>
          </div>
        </div>
      )}
    </div>
  );
}
