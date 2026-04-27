import React from 'react';

const TYPE_COLORS = {
  FIRE: 'bg-red-500/20 text-red-400 border-red-500/30',
  MEDICAL: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  SECURITY: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  STRUCTURAL: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
};

const TYPE_ICONS = {
  FIRE: '🔥',
  MEDICAL: '🏥',
  SECURITY: '🔒',
  STRUCTURAL: '🏗️',
};

function severityColor(sev) {
  if (sev <= 2) return 'bg-emerald-500';
  if (sev === 3) return 'bg-yellow-500';
  return 'bg-red-500';
}

function severityTextColor(sev) {
  if (sev <= 2) return 'text-emerald-400';
  if (sev === 3) return 'text-yellow-400';
  return 'text-red-400';
}

function timeAgo(isoStr) {
  if (!isoStr) return '—';
  const diff = Date.now() - new Date(isoStr).getTime();
  const secs = Math.floor(diff / 1000);
  if (secs < 60) return `${secs}s ago`;
  const mins = Math.floor(secs / 60);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  return `${hrs}h ago`;
}

export default function IncidentCard({
  incident,
  onResolve,
  onBriefing,
  showStaffInstructions = false,
  showBriefing = false,
  compact = false,
}) {
  const {
    id,
    type,
    severity,
    room,
    description,
    zone,
    status,
    notify_911,
    staff_instructions,
    guest_instructions,
    briefing,
    timestamps,
  } = incident;

  const typeStyle = TYPE_COLORS[type] || TYPE_COLORS.SECURITY;
  const typeIcon = TYPE_ICONS[type] || '⚠️';

  return (
    <div
      className={`animate-fade-in rounded-xl border transition-all duration-300 ${
        status === 'resolved'
          ? 'border-crisis-border/50 bg-crisis-surface/30 opacity-60'
          : 'border-crisis-border bg-crisis-surface hover:border-slate-500/50'
      } ${compact ? 'p-3' : 'p-4'}`}
    >
      {/* Top row: type badge + severity + room + time */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2 flex-wrap">
          <span
            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border ${typeStyle}`}
          >
            <span>{typeIcon}</span>
            {type}
          </span>
          {notify_911 && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-500/20 text-red-400 border border-red-500/30">
              🚨 911
            </span>
          )}
          {status === 'resolved' && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              ✓ Resolved
            </span>
          )}
        </div>
        <span className="text-[11px] text-slate-500 whitespace-nowrap">
          {timeAgo(timestamps?.sos_received)}
        </span>
      </div>

      {/* Room + Zone */}
      <div className="flex items-center gap-3 mb-2">
        <span className="text-sm font-bold text-white">{room}</span>
        <span className="text-xs text-slate-400">• {zone}</span>
      </div>

      {/* Description */}
      <p className="text-sm text-slate-300 mb-3 leading-relaxed">
        {description}
      </p>

      {/* Severity bar */}
      <div className="mb-3">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[11px] text-slate-400 font-medium">
            Severity
          </span>
          <span
            className={`text-xs font-bold ${severityTextColor(severity)}`}
          >
            {severity}/5
          </span>
        </div>
        <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full severity-bar ${severityColor(severity)}`}
            style={{ width: `${(severity / 5) * 100}%` }}
          />
        </div>
      </div>

      {/* Staff instructions */}
      {showStaffInstructions && staff_instructions && (
        <div className="mt-3 p-3 rounded-lg bg-blue-500/5 border border-blue-500/20">
          <p className="text-[11px] font-semibold text-blue-400 mb-1 uppercase tracking-wider">
            Staff Instructions
          </p>
          <p className="text-xs text-slate-300 leading-relaxed">
            {staff_instructions}
          </p>
        </div>
      )}

      {/* Briefing */}
      {showBriefing && briefing && (
        <div className="mt-3 p-3 rounded-lg bg-orange-500/5 border border-orange-500/20">
          <p className="text-[11px] font-semibold text-orange-400 mb-1 uppercase tracking-wider">
            Responder Briefing
          </p>
          <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-line">
            {briefing}
          </p>
        </div>
      )}

      {/* Actions */}
      {(onResolve || onBriefing) && status !== 'resolved' && (
        <div className="flex gap-2 mt-4">
          {onResolve && (
            <button
              id={`resolve-${id}`}
              onClick={() => onResolve(id)}
              className="flex-1 py-2 px-3 rounded-lg text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 transition-colors"
            >
              ✓ Mark Resolved
            </button>
          )}
          {onBriefing && (
            <button
              id={`briefing-${id}`}
              onClick={() => onBriefing(id)}
              className="flex-1 py-2 px-3 rounded-lg text-xs font-semibold bg-orange-500/10 text-orange-400 border border-orange-500/20 hover:bg-orange-500/20 transition-colors"
            >
              📋 Generate Briefing
            </button>
          )}
        </div>
      )}
    </div>
  );
}
