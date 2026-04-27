import React from 'react';

const ROLES = ['Guest', 'Staff', 'Manager', 'Responder'];

const ROLE_ICONS = {
  Guest: '🧑',
  Staff: '👷',
  Manager: '📊',
  Responder: '🚒',
};

const ROLE_DESCRIPTIONS = {
  Guest: 'Send SOS',
  Staff: 'Task Feed',
  Manager: 'Overview',
  Responder: 'Briefings',
};

export default function RoleSwitcher({ role, setRole }) {
  return (
    <div className="flex justify-center border-t border-crisis-border bg-crisis-surface/50">
      {ROLES.map((r) => (
        <button
          key={r}
          id={`role-${r.toLowerCase()}`}
          onClick={() => setRole(r)}
          className={`
            flex-1 max-w-[140px] py-2.5 px-3 text-center transition-all duration-200 relative
            ${
              role === r
                ? 'text-white'
                : 'text-slate-400 hover:text-slate-200'
            }
          `}
        >
          <div className="text-base">{ROLE_ICONS[r]}</div>
          <div className="text-xs font-semibold mt-0.5">{r}</div>
          <div className="text-[10px] text-slate-500 leading-tight">
            {ROLE_DESCRIPTIONS[r]}
          </div>
          {role === r && (
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-10 h-0.5 bg-gradient-to-r from-red-500 to-orange-500 rounded-full" />
          )}
        </button>
      ))}
    </div>
  );
}
