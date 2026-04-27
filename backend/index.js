// CrisisSync Backend — Express + Socket.io
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
require('dotenv').config();

const store = require('./store');
const { triageIncident, generateBriefing } = require('./gemini');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*', methods: ['GET', 'POST', 'PATCH'] },
});

app.use(cors());
app.use(express.json());

// ---------- REST ROUTES ----------

// POST /api/sos — Guest sends an SOS
app.post('/api/sos', async (req, res) => {
  try {
    const { room, description } = req.body;
    if (!room || !description) {
      return res.status(400).json({ error: 'room and description are required' });
    }

    console.log(`[SOS] Room ${room}: ${description}`);
    const sosTime = new Date().toISOString();

    // Gemini triage
    const triage = await triageIncident(room, description);
    const triageTime = new Date().toISOString();

    // Save to store
    const incident = store.createIncident({
      room,
      description,
      ...triage,
      triage_completed: triageTime,
    });
    // Overwrite sos_received to match actual receipt
    incident.timestamps.sos_received = sosTime;

    // Broadcast
    io.emit('new_incident', incident);
    console.log(`[TRIAGE] ${incident.type} sev-${incident.severity} → ${incident.id}`);

    res.status(201).json(incident);
  } catch (err) {
    console.error('[SOS Error]', err);
    res.status(500).json({ error: 'Failed to process SOS' });
  }
});

// POST /api/briefing/:id — Generate 911 briefing
app.post('/api/briefing/:id', async (req, res) => {
  try {
    const incident = store.getById(req.params.id);
    if (!incident) return res.status(404).json({ error: 'Incident not found' });

    const briefing = await generateBriefing(incident);
    const updated = store.setBriefing(incident.id, briefing);

    io.emit('incident_updated', updated);
    console.log(`[BRIEFING] Generated for ${incident.id}`);

    res.json(updated);
  } catch (err) {
    console.error('[Briefing Error]', err);
    res.status(500).json({ error: 'Failed to generate briefing' });
  }
});

// GET /api/incidents — Return all incidents
app.get('/api/incidents', (req, res) => {
  res.json(store.getAll());
});

// PATCH /api/incidents/:id/resolve — Mark resolved
app.patch('/api/incidents/:id/resolve', (req, res) => {
  const incident = store.resolve(req.params.id);
  if (!incident) return res.status(404).json({ error: 'Incident not found' });

  io.emit('incident_updated', incident);
  console.log(`[RESOLVED] ${incident.id}`);

  res.json(incident);
});

// ---------- SOCKET.IO ----------
io.on('connection', (socket) => {
  console.log(`[WS] Client connected: ${socket.id}`);
  socket.on('disconnect', () => {
    console.log(`[WS] Client disconnected: ${socket.id}`);
  });
});

// ---------- START ----------
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`\n🚨 CrisisSync Backend running on http://localhost:${PORT}`);
  console.log(`   Gemini API Key: ${process.env.GEMINI_API_KEY ? '✅ loaded' : '❌ MISSING'}\n`);
});
