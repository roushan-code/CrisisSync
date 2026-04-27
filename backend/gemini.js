// Gemini 1.5 Flash — triage + briefing functions
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

/**
 * Triage an SOS report using Gemini 1.5 Flash.
 * Returns structured JSON: { type, severity, zone, protocol, notify_911, staff_instructions, guest_instructions }
 */
async function triageIncident(room, description) {
  const prompt = `You are a hotel crisis triage AI. Given the following emergency report:
Room: ${room}
Description: ${description}

Respond ONLY in valid JSON (no markdown, no explanation, no code fences). Use this exact schema:
{
  "type": "FIRE" | "MEDICAL" | "SECURITY" | "STRUCTURAL",
  "severity": <number 1-5>,
  "zone": "<string: floor/wing/area of hotel>",
  "protocol": "<string: recommended protocol name>",
  "notify_911": <boolean>,
  "staff_instructions": "<string: what hotel staff should do immediately>",
  "guest_instructions": "<string: what the reporting guest should do>"
}

If unsure, default severity to 3 and notify_911 to false.`;

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text().trim();
    // Strip any accidental code fences
    const cleaned = text.replace(/```json\s*/gi, '').replace(/```\s*/gi, '').trim();
    const parsed = JSON.parse(cleaned);
    return parsed;
  } catch (err) {
    console.error('[Gemini Triage Error]', err.message);
    // Fallback triage if Gemini fails
    return {
      type: 'SECURITY',
      severity: 3,
      zone: `Floor ${room ? room.replace(/\D/g, '').charAt(0) || '1' : '1'}`,
      protocol: 'General Emergency Protocol',
      notify_911: false,
      staff_instructions: 'Investigate the reported room immediately. Ensure guest safety.',
      guest_instructions: 'Stay calm. Move away from the danger if possible. Wait for staff.',
    };
  }
}

/**
 * Generate a 911 responder briefing for a triaged incident.
 */
async function generateBriefing(incident) {
  const prompt = `You are an emergency dispatch briefing generator. Generate a 3-paragraph emergency responder briefing for the following hotel incident. Be concise, factual, and actionable. Do NOT use markdown formatting — return plain text only.

Incident data:
${JSON.stringify(incident, null, 2)}

Paragraph 1: Situation summary (what happened, where, severity).
Paragraph 2: Current status and actions taken by hotel staff.
Paragraph 3: Recommended responder approach and hazards to be aware of.`;

  try {
    const result = await model.generateContent(prompt);
    return result.response.text().trim();
  } catch (err) {
    console.error('[Gemini Briefing Error]', err.message);
    return `EMERGENCY BRIEFING — Incident ${incident.id}\n\nType: ${incident.type} | Severity: ${incident.severity}/5 | Room: ${incident.room}\n\nAn emergency has been reported at the above location. Staff have been dispatched. Exercise standard precautions on arrival.`;
  }
}

module.exports = { triageIncident, generateBriefing };
