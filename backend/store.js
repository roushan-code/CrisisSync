// In-memory incident store — resets on server restart
const { v4: uuidv4 } = require('uuid');

const incidents = [];

function createIncident(data) {
  const incident = {
    id: uuidv4(),
    room: data.room,
    description: data.description,
    type: data.type || 'UNKNOWN',
    severity: data.severity || 3,
    zone: data.zone || 'Unknown',
    protocol: data.protocol || '',
    notify_911: data.notify_911 || false,
    staff_instructions: data.staff_instructions || '',
    guest_instructions: data.guest_instructions || '',
    briefing: null,
    status: 'active',
    timestamps: {
      sos_received: new Date().toISOString(),
      triage_completed: data.triage_completed || new Date().toISOString(),
      briefing_generated: null,
      resolved: null,
    },
  };
  incidents.push(incident);
  return incident;
}

function getAll() {
  return incidents;
}

function getById(id) {
  return incidents.find((i) => i.id === id) || null;
}

function resolve(id) {
  const incident = getById(id);
  if (incident) {
    incident.status = 'resolved';
    incident.timestamps.resolved = new Date().toISOString();
  }
  return incident;
}

function setBriefing(id, briefing) {
  const incident = getById(id);
  if (incident) {
    incident.briefing = briefing;
    incident.timestamps.briefing_generated = new Date().toISOString();
  }
  return incident;
}

module.exports = { createIncident, getAll, getById, resolve, setBriefing };
