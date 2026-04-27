import React, { useState, useEffect, useCallback } from 'react';
import { io } from 'socket.io-client';
import RoleSwitcher from './components/RoleSwitcher';
import GuestSOS from './views/GuestSOS';
import StaffDashboard from './views/StaffDashboard';
import ManagerView from './views/ManagerView';
import ResponderView from './views/ResponderView';

const SOCKET_URL = 'http://localhost:3001';

export default function App() {
  const [role, setRole] = useState('Guest');
  const [incidents, setIncidents] = useState([]);
  const [connected, setConnected] = useState(false);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    // Fetch existing incidents on mount
    fetch('/api/incidents')
      .then((r) => r.json())
      .then(setIncidents)
      .catch(() => {});

    // Connect Socket.io
    const s = io(SOCKET_URL, { transports: ['websocket', 'polling'] });

    s.on('connect', () => setConnected(true));
    s.on('disconnect', () => setConnected(false));

    s.on('new_incident', (incident) => {
      setIncidents((prev) => [incident, ...prev]);
    });

    s.on('incident_updated', (updated) => {
      setIncidents((prev) =>
        prev.map((i) => (i.id === updated.id ? updated : i))
      );
    });

    setSocket(s);
    return () => s.disconnect();
  }, []);

  const renderView = () => {
    switch (role) {
      case 'Guest':
        return <GuestSOS />;
      case 'Staff':
        return <StaffDashboard incidents={incidents} />;
      case 'Manager':
        return <ManagerView incidents={incidents} />;
      case 'Responder':
        return <ResponderView incidents={incidents} />;
      default:
        return <GuestSOS />;
    }
  };

  return (
    <div className="min-h-screen bg-crisis-bg">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-crisis-bg/80 backdrop-blur-xl border-b border-crisis-border">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center">
              <span className="text-white font-black text-sm">CS</span>
            </div>
            <div>
              <h1 className="text-lg font-bold text-white tracking-tight leading-none">
                CrisisSync
              </h1>
              <p className="text-[10px] text-slate-400 font-medium tracking-widest uppercase">
                Crisis Coordination
              </p>
            </div>
          </div>

          {/* Connection status */}
          <div className="flex items-center gap-2 text-xs">
            <div
              className={`w-2 h-2 rounded-full ${
                connected
                  ? 'bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.6)]'
                  : 'bg-red-400 shadow-[0_0_6px_rgba(248,113,113,0.6)]'
              }`}
            />
            <span className={connected ? 'text-emerald-400' : 'text-red-400'}>
              {connected ? 'Connected' : 'Disconnected'}
            </span>
          </div>
        </div>

        <RoleSwitcher role={role} setRole={setRole} />
      </header>

      {/* Main View */}
      <main className="max-w-7xl mx-auto px-4 py-6">{renderView()}</main>
    </div>
  );
}
