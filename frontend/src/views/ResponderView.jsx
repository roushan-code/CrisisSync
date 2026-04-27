import React from 'react';

function timeLabel(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

export default function ResponderView({ incidents }) {
  const flagged = incidents.filter((i) => i.notify_911);

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
          <span className="text-xl">🚒</span>
        </div>
        <div>
          <h2 className="text-xl font-bold text-white">Responder Console</h2>
          <p className="text-xs text-slate-400">911-flagged incidents only</p>
        </div>
      </div>

      {flagged.length === 0 ? (
        <div className="text-center py-16">
          <span className="text-4xl block mb-3">✅</span>
          <p className="text-slate-400 text-sm">No 911-flagged incidents at this time.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {flagged.map((inc) => (
            <div key={inc.id} className="animate-fade-in rounded-xl border border-crisis-border bg-crisis-surface p-5">
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-red-500/20 text-red-400 border border-red-500/30">
                    🚨 {inc.type}
                  </span>
                  <span className="text-sm font-bold text-white">{inc.room}</span>
                  <span className="text-xs text-slate-400">{inc.zone}</span>
                </div>
                <span className={`text-xs font-bold ${inc.severity >= 4 ? 'text-red-400' : inc.severity === 3 ? 'text-yellow-400' : 'text-emerald-400'}`}>
                  SEV {inc.severity}/5
                </span>
              </div>

              <p className="text-sm text-slate-300 mb-4">{inc.description}</p>

              {/* Timeline */}
              <div className="mb-4 p-3 rounded-lg bg-crisis-bg border border-crisis-border">
                <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2">Timeline</p>
                <div className="space-y-2">
                  {[
                    { label: 'SOS Received', time: inc.timestamps?.sos_received, icon: '🆘' },
                    { label: 'Triage Completed', time: inc.timestamps?.triage_completed, icon: '🤖' },
                    { label: 'Briefing Generated', time: inc.timestamps?.briefing_generated, icon: '📋' },
                    { label: 'Resolved', time: inc.timestamps?.resolved, icon: '✅' },
                  ].map((step, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <span className="text-sm">{step.icon}</span>
                      <div className={`flex-1 flex items-center justify-between ${step.time ? 'text-slate-300' : 'text-slate-600'}`}>
                        <span className="text-xs">{step.label}</span>
                        <span className="text-xs font-mono">{timeLabel(step.time)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Briefing */}
              {inc.briefing ? (
                <div className="p-4 rounded-lg bg-orange-500/5 border border-orange-500/20">
                  <p className="text-[11px] font-semibold text-orange-400 uppercase tracking-wider mb-2">Responder Briefing</p>
                  <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-line">{inc.briefing}</p>
                </div>
              ) : (
                <div className="p-3 rounded-lg bg-slate-800/50 border border-crisis-border text-center">
                  <p className="text-xs text-slate-500">Briefing not yet generated — request from Manager console</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
