import React, { useState } from 'react';
import IncidentCard from '../components/IncidentCard';

export default function StaffDashboard({ incidents }) {
  const [filter, setFilter] = useState('all'); // all | active | resolved
  const activeIncidents = incidents.filter((i) => i.status === 'active');
  const resolvedIncidents = incidents.filter((i) => i.status === 'resolved');

  const filtered =
    filter === 'active'
      ? activeIncidents
      : filter === 'resolved'
        ? resolvedIncidents
        : incidents;

  const handleResolve = async (id) => {
    try {
      await fetch(`/api/incidents/${id}/resolve`, { method: 'PATCH' });
    } catch (err) {
      console.error('Resolve failed', err);
    }
  };

  return (
    <div>
      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="p-4 rounded-xl bg-crisis-surface border border-crisis-border text-center">
          <p className="text-2xl font-bold text-white">{incidents.length}</p>
          <p className="text-xs text-slate-400 mt-1">Total</p>
        </div>
        <div className="p-4 rounded-xl bg-red-500/5 border border-red-500/20 text-center">
          <p className="text-2xl font-bold text-red-400">
            {activeIncidents.length}
          </p>
          <p className="text-xs text-slate-400 mt-1">Active</p>
        </div>
        <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20 text-center">
          <p className="text-2xl font-bold text-emerald-400">
            {resolvedIncidents.length}
          </p>
          <p className="text-xs text-slate-400 mt-1">Resolved</p>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-4">
        {['all', 'active', 'resolved'].map((f) => (
          <button
            key={f}
            id={`staff-filter-${f}`}
            onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-colors ${
              filter === f
                ? 'bg-crisis-accent text-white'
                : 'bg-crisis-surface text-slate-400 border border-crisis-border hover:text-white'
            }`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* Incident feed */}
      {filtered.length === 0 ? (
        <div className="text-center py-16">
          <span className="text-4xl block mb-3">📡</span>
          <p className="text-slate-400 text-sm">
            No incidents yet. Waiting for SOS reports...
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((incident) => (
            <IncidentCard
              key={incident.id}
              incident={incident}
              onResolve={handleResolve}
              showStaffInstructions
            />
          ))}
        </div>
      )}
    </div>
  );
}
