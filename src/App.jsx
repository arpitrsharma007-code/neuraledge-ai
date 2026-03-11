console.log("KEY:", import.meta.env.VITE_ANTHROPIC_API_KEY)
import { useState, useEffect, useRef } from "react";

const MODEL = "claude-sonnet-4-20250514";

const PHASES = [
  { id: 0, name: "Brief Intake",        color: "#06B6D4", icon: "📋" },
  { id: 1, name: "Business Discovery",  color: "#F59E0B", icon: "🔍" },
  { id: 2, name: "Automation QA",       color: "#DC2626", icon: "🦅" },
  { id: 3, name: "Opportunity Mapping", color: "#8B5CF6", icon: "🗺️" },
  { id: 4, name: "Strategy Build",      color: "#10B981", icon: "⚙️" },
  { id: 5, name: "Final Report",        color: "#0EA5E9", icon: "📄" },
];

const AGENTS = [
  {
    id:"nathan", name:"Nathan Cross", emoji:"📋", title:"Client Onboarding Specialist",
    phase:0, parallel:false, color:"#06B6D4", creds:"8 yrs • Ex-Deloitte, Accenture • 500+ client onboardings",
    prompt:`You are Nathan Cross, Client Onboarding Specialist at NeuralEdge AI. Your job: take ANY raw input — messy notes, emails, bullet points, half-sentences — and convert it into a clean, structured brief that other specialist agents can work from efficiently.

Output EXACTLY this format (no preamble):

**COMPANY:** [Name | Industry | Team size | Est. revenue if mentioned]
**CURRENT TOOLS:** [Every tool/software mentioned]
**KEY PROCESSES:** [Top 3–5 processes, most manual/painful first]
**PAIN POINTS:** [Ranked by severity — most painful first]
**AUTOMATION GOALS:** [What they want to achieve]
**BUDGET:** [Monthly budget | One-time capacity | "Not specified" if missing]
**ADDITIONAL CONTEXT:** [Anything else relevant]

If info is missing, write "Not specified". Never invent facts. Max 300 words.`
  },
  {
    id:"maya", name:"Maya Chen", emoji:"🤝", title:"Business Intake Director",
    phase:1, parallel:false, color:"#F59E0B", creds:"12 yrs • Ex-McKinsey, Deloitte • 200+ SMB transformations",
    prompt:`You are Maya Chen, Business Intake Director at NeuralEdge AI. 12 years in business transformation. Ex-McKinsey Operations, Deloitte Digital.

Given the structured client brief, produce:

**BUSINESS PROFILE** — Snapshot in 3 sentences (stage, market position, competitive context)

**AUTOMATION READINESS SCORE** — X/10 with specific justification (team size, tools maturity, budget, process clarity)

**TOP 5 MANUAL PROCESSES** — Most automation-worthy. For each: process name + estimated hours wasted per week

**QUICK WINS** — 2–3 automations achievable in under 2 weeks, near-zero cost. Be specific.

**RISK FACTORS** — Top 3 reasons automation could fail for THIS specific company

Real numbers. No generic advice. Max 320 words.`
  },
  {
    id:"raj", name:"Raj Malhotra", emoji:"⚙️", title:"Operations Analyst",
    phase:1, parallel:false, color:"#8B5CF6", creds:"15 yrs • Ex-SAP, IBM • 80+ enterprise process automations",
    prompt:`You are Raj Malhotra, Operations Analyst at NeuralEdge AI. 15 years in process engineering. Ex-SAP implementation lead, IBM GBS.

Given the brief and Maya's assessment, produce:

**PROCESS MAP** — Top 3 processes: Input → Steps → Output → Pain point at each step

**AUTOMATION MATRIX** — For each process: Effort (Low/Med/High) | Impact (Low/Med/High) | Priority (Must/Should/Nice)

**INTEGRATION COMPLEXITY** — How well do current tools connect? Critical gaps?

**DATA QUALITY** — Is data clean enough for automation? What needs fixing first?

**TIME SAVINGS ESTIMATE** — Hours/week saved per process if automated. Show your math.

Ground everything in their actual tools. Max 320 words.`
  },
  {
    id:"luna", name:"Luna Park", emoji:"📊", title:"Data & Systems Auditor",
    phase:1, parallel:false, color:"#EC4899", creds:"10 yrs • Ex-Palantir, Snowflake • 60+ data infrastructure audits",
    prompt:`You are Luna Park, Data & Systems Auditor at NeuralEdge AI. 10 years in data infrastructure. Ex-Palantir deployment lead, Snowflake solutions architect.

Given the brief and previous assessments, produce:

**TECH STACK AUDIT** — Each tool: automation-friendly ✅ / neutral ⚠️ / blocker ❌

**DATA FLOW MAP** — Where data lives, how it moves between systems, where it leaks or siloes

**UNTAPPED AUTOMATION** — Existing tools with automation features they're NOT using

**TECH DEBT RISKS** — What in current stack will slow automation? What to replace first?

**STACK ADDITIONS** — 2–3 tools they're missing that unlock major automation potential

Specific tool names and integration details only. Max 320 words.`
  },
  {
    id:"victor", name:"Victor Ashworth", emoji:"🦅", title:"Automation QA Director",
    phase:2, parallel:false, color:"#DC2626", creds:"18 yrs • Ex-Gartner, BCG • \"The Axe\" — 400+ strategies reviewed",
    prompt:`You are Victor Ashworth — "The Axe." Automation QA Director at NeuralEdge AI. 18 years. Ex-Gartner Research VP, BCG Senior Advisor. You've reviewed 400+ automation strategies and killed 200+ that would have wasted client budgets.

Review all three Phase 1 outputs:

**SCORECARD:**
• Maya Chen: 🟢 EXCELLENT / 🟡 PASSABLE / 🔴 REJECTED — one sentence + one fix
• Raj Malhotra: 🟢 / 🟡 / 🔴 — one sentence + one fix
• Luna Park: 🟢 / 🟡 / 🔴 — one sentence + one fix

**ALIGNMENT CHECK** — Do all three agree? Any contradictions or critical gaps?

**FATAL FLAWS** — What would kill this in real-world implementation? Be surgical.

**STRATEGY SCORE** — X/100 (below 70 = flag for revision; be honest)

**VERDICT** — ✅ PROCEED | ⚠️ PROCEED WITH FIXES | ❌ INSUFFICIENT DATA

No mercy. No hand-holding. Max 350 words.`
  },
  {
    id:"ops_auto", name:"Alex Torres", emoji:"🔧", title:"Operations Automation Specialist",
    phase:3, parallel:true, color:"#10B981", creds:"9 yrs • Ex-UiPath, Automation Anywhere • 100+ RPA projects",
    prompt:`You are Alex Torres, Operations Automation Specialist at NeuralEdge AI. 9 years in RPA. Ex-UiPath Senior Solutions Architect, Automation Anywhere implementation lead.

Identify the top OPERATIONS automation opportunities for this specific company:

**TOP 3 OPERATIONS AUTOMATIONS:**
For each → Process | Why it matters | Tool (name + price/mo) | Effort to implement | Monthly savings

**48-HOUR QUICK WIN** — One operations automation using free tools only, live within 48 hours

**HIGH-IMPACT BET** — One advanced automation (2–4 weeks, moderate investment) with the highest operations ROI. Explain exactly why.

Real tool names. Real prices. Real numbers. Max 300 words.`
  },
  {
    id:"mkt_auto", name:"Sam Rivera", emoji:"📣", title:"Marketing Automation Specialist",
    phase:3, parallel:true, color:"#F59E0B", creds:"8 yrs • Ex-HubSpot, Marketo • 120+ marketing systems built",
    prompt:`You are Sam Rivera, Marketing Automation Specialist at NeuralEdge AI. 8 years in marketing automation. Ex-HubSpot Partner Solutions Lead, Marketo certified.

Identify top MARKETING automation opportunities:

**TOP 3 MARKETING AUTOMATIONS:**
For each → Workflow | Revenue/time impact | Tool (name + price/mo) | Effort | Monthly value

**48-HOUR QUICK WIN** — One marketing automation live immediately, minimal cost

**AI-POWERED OPPORTUNITY** — One AI/LLM-specific marketing automation with highest revenue impact for this company specifically

Tailored to their industry and current tools. Max 300 words.`
  },
  {
    id:"fin_auto", name:"Jordan Kim", emoji:"💰", title:"Finance Automation Specialist",
    phase:3, parallel:true, color:"#0EA5E9", creds:"11 yrs • Ex-Xero, QuickBooks • 90+ finance automations",
    prompt:`You are Jordan Kim, Finance Automation Specialist at NeuralEdge AI. 11 years in finance process automation. Ex-Xero Partner Program Lead, QuickBooks ProAdvisor.

Identify top FINANCE automation opportunities:

**TOP 3 FINANCE AUTOMATIONS:**
For each → Process | Error reduction/time/cost impact | Tool (name + price) | Effort | Monthly savings

**COMPLIANCE NOTE** — Any automation needing careful handling for tax or audit reasons?

**TODAY'S QUICK WIN** — One finance automation deployable today with existing tools

Scaled to their business model and team size. Max 280 words.`
  },
  {
    id:"sup_auto", name:"Casey Morgan", emoji:"🎧", title:"Support Automation Specialist",
    phase:3, parallel:true, color:"#8B5CF6", creds:"7 yrs • Ex-Zendesk, Intercom • 80+ support systems",
    prompt:`You are Casey Morgan, Customer Support Automation Specialist at NeuralEdge AI. 7 years in support automation. Ex-Zendesk Solutions Engineer, Intercom implementation specialist.

Identify top SUPPORT automation opportunities:

**TOP 3 SUPPORT AUTOMATIONS:**
For each → Process | CSAT/resolution time/cost impact | Tool (name + price) | Effort | Monthly value

**AI CHATBOT VERDICT** — Should they build one? Which tool? Build time + cost? What would it handle?

**24-HOUR QUICK WIN** — One support automation live today

Tailored to their customer base and industry. Max 280 words.`
  },
  {
    id:"hr_auto", name:"Riley Chen", emoji:"👥", title:"HR & Admin Automation Specialist",
    phase:3, parallel:true, color:"#EC4899", creds:"9 yrs • Ex-Workday, BambooHR • 70+ HR automations",
    prompt:`You are Riley Chen, HR & Admin Automation Specialist at NeuralEdge AI. 9 years in HR technology. Ex-Workday implementation consultant, BambooHR partner.

Identify top HR & ADMIN automation opportunities:

**TOP 3 HR/ADMIN AUTOMATIONS:**
For each → Process | Time/compliance/experience impact | Tool (name + price) | Effort | Monthly value

**ONBOARDING AUTOMATION** — Specific opportunity to automate onboarding for their exact company size

**THIS WEEK'S QUICK WIN** — One HR/admin automation implementable this week

Scaled to their team size. Max 280 words.`
  },
  {
    id:"priya", name:"Priya Nair", emoji:"🛠️", title:"AI Tools Specialist",
    phase:4, parallel:false, color:"#10B981", creds:"7 yrs • Ex-Product Hunt, G2 • 1000+ tools evaluated",
    prompt:`You are Priya Nair, AI Tools Specialist at NeuralEdge AI. 7 years evaluating automation tools. Ex-Product Hunt editorial, G2 research analyst. Personally tested 1000+ tools.

Given all Phase 3 automation opportunities, produce the master toolkit:

**FREE TOOLS (start here):** Name | What it automates | Free plan limits

**PAID TOOLS (worth investing):** Name | $X/mo | What it unlocks | Priority: High/Med/Low

**AI-SPECIFIC TOOLS:** LLM/AI tools relevant to this exact business

**INTEGRATION MAP** — How recommended tools connect to each other and existing stack

**TOTAL COST:** Starter level vs. full implementation ($/month)

**START WITH THESE 3** — If only 3 tools, which and in what order

**AVOID THESE** — 2 popular tools NOT right for this company + exact reason

Real prices. Real integrations. Max 380 words.`
  },
  {
    id:"devon", name:"Devon Walsh", emoji:"📈", title:"ROI & Budget Analyst",
    phase:4, parallel:false, color:"#F59E0B", creds:"12 yrs • Ex-Goldman Sachs, Bain • 150+ ROI models built",
    prompt:`You are Devon Walsh, ROI & Budget Analyst at NeuralEdge AI. 12 years in financial modeling for digital transformation. Ex-Goldman Sachs TMT analyst, Bain & Company.

Produce the financial case for this automation strategy:

**TOTAL INVESTMENT:**
• One-time setup: $X
• Monthly recurring: $X/mo
• Hidden costs (training, time): $X
• Year 1 total: $X

**ROI TIMELINE:**
• Month 1–3: Investing $X, returns $X
• Month 4–6: $X saved, break-even approaching
• Month 7–12: $X net positive
• Break-even point: Month X

**SAVINGS MATH:** [Hours/week saved] × [$X/hr cost] × 52 = $X/year

**BUDGET FIT** — Given their stated budget, what's achievable? Minimum viable spend?

**HARD VERDICT** — For every $1 invested → $X returned. Yes or no, and why.

Show all calculations. Conservative estimates only. Max 380 words.`
  },
  {
    id:"kai", name:"Kai Okafor", emoji:"🗓️", title:"Implementation Roadmap Specialist",
    phase:4, parallel:false, color:"#0EA5E9", creds:"10 yrs • Ex-Asana, Monday.com • 200+ roadmaps delivered",
    prompt:`You are Kai Okafor, Implementation Roadmap Specialist at NeuralEdge AI. 10 years in automation delivery. Ex-Asana enterprise team, Monday.com solutions partner.

Produce an executable 90-day implementation plan:

**90-DAY ROADMAP:**
• Week 1–2: Foundation — [specific tasks]
• Week 3–4: Quick wins — [first automations live]
• Month 2: Core automations — [what goes live]
• Month 3: Advanced + optimize — [final phase]

**TOP 10 TASKS** (in order of execution):
Each: Task | Who owns it internally | Tool needed | Time to complete

**DEPENDENCIES** — What must happen before what? Critical path blockers?

**SUCCESS METRICS** — 5 KPIs with specific target values by Month 3

**RISK MITIGATIONS** — For each risk Victor flagged, one specific preventive action

Executable Monday morning. No hand-waving. Max 380 words.`
  },
  {
    id:"aria", name:"Aria Shen", emoji:"📄", title:"Final Report Compiler",
    phase:5, parallel:false, color:"#0EA5E9", creds:"8 yrs • Ex-Deloitte Insights, McKinsey Publishing • 300+ exec reports",
    prompt:`You are Aria Shen, Final Report Compiler at NeuralEdge AI. 8 years in executive communications. Ex-Deloitte Insights editor, McKinsey Publishing. You write reports that get acted on.

Compile the EXECUTIVE AUTOMATION STRATEGY REPORT from all previous outputs:

═══════════════════════════════════════
NEURALEDGE AI — AUTOMATION STRATEGY REPORT
═══════════════════════════════════════

**EXECUTIVE SUMMARY**
[3 sentences: current situation → automation opportunity → clear recommendation]

**TOP 5 AUTOMATION OPPORTUNITIES** (ranked by ROI)
1. [Opportunity] | Saves $X/mo | X days to implement | Priority: HIGH/MED/LOW
(repeat for 2–5)

**RECOMMENDED TOOL STACK** (top 5 tools only)
[Tool name] | $X/mo | Handles: [what]
Total stack cost: $X/month

**FINANCIAL PROJECTION**
• Year 1 investment: $X
• Break-even: Month X
• Year 1 net return: $X
• ROI multiple: Xx

**90-DAY ACTION PLAN** (top 5 only)
1. [Action] — [Owner] — [Deadline]
(repeat for 2–5)

**THE ONE THING**
If this company does ONE automation this month: [exact action] → because [quantified reason]

═══════════════════════════════════════

Sharp. Confident. Client-ready. Worth the invoice. Max 500 words.`
  },
];

// ─── PDF EXPORT ───
function exportPDF(company, outputs) {
  const agentSections = AGENTS.map(a => {
    const out = outputs[a.id];
    if (!out) return '';
    return `
      <div class="agent-section">
        <div class="agent-header">
          <span class="agent-emoji">${a.emoji}</span>
          <div>
            <div class="agent-name">${a.name} — ${a.title}</div>
            <div class="agent-creds">${a.creds}</div>
          </div>
          <div class="phase-badge">Phase ${a.phase}</div>
        </div>
        <div class="agent-body">${out.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br/>')}</div>
      </div>`;
  }).join('');

  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8"/>
  <title>NeuralEdge — ${company} Automation Strategy</title>
  <style>
    * { margin:0; padding:0; box-sizing:border-box; }
    body { font-family: 'Segoe UI', Arial, sans-serif; background:#fff; color:#1a1a2e; font-size:11px; line-height:1.7; }
    .cover { background:linear-gradient(135deg,#0f0c29,#302b63,#24243e); color:#fff; padding:60px 50px; min-height:220px; }
    .cover-logo { font-size:11px; font-weight:800; letter-spacing:0.2em; color:rgba(255,255,255,0.4); margin-bottom:20px; }
    .cover-title { font-size:32px; font-weight:900; margin-bottom:8px; }
    .cover-sub { font-size:14px; color:rgba(255,255,255,0.5); margin-bottom:24px; }
    .cover-meta { display:flex; gap:24px; flex-wrap:wrap; }
    .cover-meta-item { font-size:10px; color:rgba(255,255,255,0.4); }
    .cover-meta-item strong { color:#a78bfa; display:block; font-size:13px; margin-bottom:2px; }
    .content { padding:32px 40px; }
    .agent-section { margin-bottom:28px; border:1px solid #e5e7eb; border-radius:10px; overflow:hidden; page-break-inside:avoid; }
    .agent-header { background:#f8f7ff; padding:12px 16px; display:flex; align-items:flex-start; gap:12px; border-bottom:1px solid #e5e7eb; }
    .agent-emoji { font-size:20px; flex-shrink:0; }
    .agent-name { font-size:12px; font-weight:800; color:#4c1d95; }
    .agent-creds { font-size:9px; color:#9ca3af; margin-top:2px; }
    .phase-badge { margin-left:auto; font-size:8px; font-weight:700; padding:3px 8px; background:#ede9fe; color:#7c3aed; border-radius:4px; white-space:nowrap; }
    .agent-body { padding:14px 16px; font-size:10.5px; color:#374151; line-height:1.8; }
    .agent-body strong { color:#1e1b4b; font-weight:700; }
    .final-report { background:linear-gradient(135deg,#f0f9ff,#ede9fe); border:2px solid #7c3aed; }
    .final-report .agent-header { background:linear-gradient(135deg,#4c1d95,#1e40af); }
    .final-report .agent-name { color:#fff; }
    .final-report .agent-creds { color:rgba(255,255,255,0.5); }
    .final-report .phase-badge { background:rgba(255,255,255,0.15); color:#fff; }
    .final-report .agent-body { font-size:11px; color:#1e1b4b; }
    .footer { margin-top:32px; padding-top:16px; border-top:1px solid #e5e7eb; text-align:center; font-size:9px; color:#9ca3af; }
    @media print { body{-webkit-print-color-adjust:exact;print-color-adjust:exact;} }
  </style>
</head>
<body>
  <div class="cover">
    <div class="cover-logo">NEURALEDGE AI — AUTOMATION STRATEGY REPORT</div>
    <div class="cover-title">${company}</div>
    <div class="cover-sub">AI Automation Strategy — 14 Agent Analysis</div>
    <div class="cover-meta">
      <div class="cover-meta-item"><strong>${new Date().toLocaleDateString('en-GB',{day:'numeric',month:'long',year:'numeric'})}</strong>Date</div>
      <div class="cover-meta-item"><strong>14 Agents</strong>Analysis Depth</div>
      <div class="cover-meta-item"><strong>6 Phases</strong>Coverage</div>
      <div class="cover-meta-item"><strong>NeuralEdge AI</strong>Powered By</div>
    </div>
  </div>
  <div class="content">
    ${agentSections}
    <div class="footer">Generated by NeuralEdge AI Automation Engine · neuraledge.ai · Confidential — prepared for ${company}</div>
  </div>
</body>
</html>`;

  const win = window.open('', '_blank');
  win.document.write(html);
  win.document.close();
  setTimeout(() => { win.focus(); win.print(); }, 500);
}

// ─── STORAGE ───
async function saveCampaigns(data) {
  try { await window.storage.set('ne_campaigns_v2', JSON.stringify(data)); } catch {}
}
async function fetchCampaigns() {
  try {
    const r = await window.storage.get('ne_campaigns_v2');
    return r ? JSON.parse(r.value) : [];
  } catch { return []; }
}

// ─── CONTEXT BUILDER ───
const P3 = ['ops_auto','mkt_auto','fin_auto','sup_auto','hr_auto'];

function buildMessage(agentId, rawInput, outputs, revNotes) {
  const rev = revNotes ? `\n\n⚠️ REVISION REQUEST FROM CLIENT:\n${revNotes}` : '';
  const brief = outputs['nathan'] ? `STRUCTURED CLIENT BRIEF (prepared by Nathan Cross):\n${outputs['nathan']}${rev}` : `RAW CLIENT INPUT:\n${rawInput}${rev}`;

  if (agentId === 'nathan') return `Please structure this raw client input into the required brief format:\n\n${rawInput}${rev}`;
  if (agentId === 'maya') return `${brief}\n\nAssess this business for automation potential.`;
  if (agentId === 'raj') return `${brief}\n\n${outputs['maya'] ? `MAYA CHEN'S ASSESSMENT:\n${outputs['maya']}\n\n` : ''}Map processes and build the automation matrix.`;
  if (agentId === 'luna') return `${brief}\n\n${outputs['maya'] ? `MAYA CHEN:\n${outputs['maya']}\n\n` : ''}${outputs['raj'] ? `RAJ MALHOTRA:\n${outputs['raj']}\n\n` : ''}Audit the tech stack.`;
  if (agentId === 'victor') return `${brief}\n\nMAYA CHEN (Business Intake):\n${outputs['maya']||''}\n\n---\n\nRAJ MALHOTRA (Operations):\n${outputs['raj']||''}\n\n---\n\nLUNA PARK (Data Audit):\n${outputs['luna']||''}\n\nReview all three and give your verdict.`;

  if (P3.includes(agentId)) return `${brief}\n\nVICTOR ASHWORTH QA CONTEXT:\n${outputs['victor']||''}\n\nIdentify your domain's top automation opportunities.`;

  if (agentId === 'priya') {
    const p3out = P3.map(id => outputs[id] ? `${id.toUpperCase()}:\n${outputs[id]}` : '').filter(Boolean).join('\n\n---\n\n');
    return `${brief}\n\n${p3out}\n\nBuild the master tools recommendation.`;
  }
  if (agentId === 'devon') {
    const p3out = P3.map(id => outputs[id]||'').filter(Boolean).join('\n\n');
    return `${brief}\n\nALL IDENTIFIED OPPORTUNITIES:\n${p3out}\n\nTOOLS RECOMMENDATION:\n${outputs['priya']||''}\n\nBuild the ROI model.`;
  }
  if (agentId === 'kai') return `${brief}\n\nVICTOR QA:\n${outputs['victor']||''}\n\nTOOLS:\n${outputs['priya']||''}\n\nROI/BUDGET:\n${outputs['devon']||''}\n\nBuild the implementation roadmap.`;

  if (agentId === 'aria') {
    const all = AGENTS.filter(a => a.id !== 'aria')
      .map(a => outputs[a.id] ? `${a.name.toUpperCase()} — ${a.title}:\n${outputs[a.id]}` : '')
      .filter(Boolean).join('\n\n═══\n\n');
    return `${brief}\n\n${all}\n\nCompile the final executive report.`;
  }
  return brief;
}

// ─── STREAM ───
async function streamAgent(agent, userMsg, onChunk, signal) {
  const res = await fetch("/api/v1/messages", {
    method: "POST",
    signal,
    headers: {
      "Content-Type": "application/json",
      "x-api-key": import.meta.env.VITE_ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01",
      "anthropic-dangerous-direct-browser-access": "true",
    },
    body: JSON.stringify({
      model: MODEL, max_tokens: 900, stream: true,
      system: agent.prompt,
      messages: [{ role: "user", content: userMsg }]
    })
  });
  if (!res.ok) throw new Error(`API ${res.status}`);
  const reader = res.body.getReader();
  const dec = new TextDecoder();
  let buf = '', full = '';
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buf += dec.decode(value, { stream: true });
    const lines = buf.split('\n'); buf = lines.pop() || '';
    for (const line of lines) {
      if (!line.startsWith('data: ')) continue;
      const d = line.slice(6).trim();
      if (d === '[DONE]') return full;
      try {
        const p = JSON.parse(d);
        if (p.type === 'content_block_delta' && p.delta?.text) {
          full += p.delta.text; onChunk(full);
        }
      } catch {}
    }
  }
  return full;
}

// ─── RUNNER ───
const RUN_ORDER = [
  { phase: 0, agents: ['nathan'], parallel: false },
  { phase: 1, agents: ['maya','raj','luna'], parallel: false },
  { phase: 2, agents: ['victor'], parallel: false },
  { phase: 3, agents: P3, parallel: true },
  { phase: 4, agents: ['priya','devon','kai'], parallel: false },
  { phase: 5, agents: ['aria'], parallel: false },
];

async function runPipeline(rawInput, revNotes, initOutputs, cbs, signal) {
  const { onStart, onChunk, onDone, onPhase, onErr } = cbs;
  const outputs = { ...initOutputs };
  for (const { phase, agents, parallel } of RUN_ORDER) {
    onPhase(phase);
    if (parallel) {
      await Promise.all(agents.map(async id => {
        const agent = AGENTS.find(a => a.id === id); if (!agent) return;
        onStart(id);
        try {
          const msg = buildMessage(id, rawInput, outputs, revNotes);
          const final = await streamAgent(agent, msg, t => onChunk(id, t), signal);
          outputs[id] = final; onDone(id, final);
        } catch(e) { if (e.name !== 'AbortError') onErr(id); }
      }));
    } else {
      for (const id of agents) {
        const agent = AGENTS.find(a => a.id === id); if (!agent) continue;
        onStart(id);
        try {
          const msg = buildMessage(id, rawInput, outputs, revNotes);
          const final = await streamAgent(agent, msg, t => onChunk(id, t), signal);
          outputs[id] = final; onDone(id, final);
        } catch(e) {
          if (e.name !== 'AbortError') onErr(id);
          return outputs;
        }
      }
    }
  }
  return outputs;
}

// ─── AGENT CHIP ───
function AgentChip({ agent, status, active, onClick }) {
  const ph = PHASES.find(p => p.id === agent.phase);
  const col = agent.color;
  const isRun = status === 'running';
  const isDone = status === 'done';
  const isErr = status === 'error';
  return (
    <div onClick={onClick} style={{
      padding: '8px 10px', borderRadius: 9, cursor: isDone ? 'pointer' : 'default',
      border: `1px solid ${active ? col : isRun ? col + '55' : 'rgba(255,255,255,0.05)'}`,
      background: active ? col + '15' : isRun ? col + '08' : 'rgba(255,255,255,0.02)',
      transition: 'all 0.2s', position: 'relative', overflow: 'hidden',
    }}>
      {isRun && <div style={{ position:'absolute', top:0, left:0, right:0, height:1, background:`linear-gradient(90deg, transparent, ${col}, transparent)`, animation:'shimmer 1.5s infinite' }} />}
      <div style={{ display:'flex', alignItems:'center', gap:6 }}>
        <span style={{ fontSize:14 }}>{agent.emoji}</span>
        <div style={{ flex:1, minWidth:0 }}>
          <div style={{ fontSize:10.5, fontWeight:700, color: isDone ? col : isRun ? col : 'rgba(255,255,255,0.4)', fontFamily:'IBM Plex Mono, monospace' }}>{agent.name}</div>
          <div style={{ fontSize:8.5, color:'rgba(255,255,255,0.2)', marginTop:1, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{agent.title}</div>
        </div>
        <div style={{ width:6, height:6, borderRadius:'50%', flexShrink:0,
          background: isDone ? '#10B981' : isRun ? col : isErr ? '#DC2626' : 'rgba(255,255,255,0.1)',
          boxShadow: isRun ? `0 0 6px ${col}` : isDone ? '0 0 6px #10B981' : 'none',
          animation: isRun ? 'pulse 1s infinite' : 'none'
        }} />
      </div>
    </div>
  );
}

// ─── OUTPUT VIEWER ───
function OutputViewer({ agent, content }) {
  if (!agent || !content) return null;
  return (
    <div style={{ padding:14, borderRadius:10, background:'rgba(255,255,255,0.02)', border:`1px solid ${agent.color}30`, animation:'fadeIn 0.3s ease' }}>
      <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:10 }}>
        <span style={{ fontSize:16 }}>{agent.emoji}</span>
        <div>
          <div style={{ fontSize:12, fontWeight:800, color:agent.color, fontFamily:'IBM Plex Mono, monospace' }}>{agent.name}</div>
          <div style={{ fontSize:9, color:'rgba(255,255,255,0.25)' }}>{agent.creds}</div>
        </div>
      </div>
      <div style={{ fontSize:11.5, lineHeight:1.7, color:'rgba(255,255,255,0.75)', whiteSpace:'pre-wrap', fontFamily:'IBM Plex Mono, monospace' }}>
        {content.split('\n').map((line, i) => {
          const isBold = line.startsWith('**') && line.includes('**', 2);
          if (isBold) {
            const clean = line.replace(/\*\*/g, '');
            return <div key={i} style={{ fontWeight:700, color:'#fff', marginTop: i > 0 ? 10 : 0 }}>{clean}</div>;
          }
          return <div key={i} style={{ opacity: line.trim() === '' ? 0.3 : 1 }}>{line || ' '}</div>;
        })}
      </div>
    </div>
  );
}

// ─── MAIN APP ───
export default function App() {
  const [view, setView] = useState('new');
  const [campaigns, setCampaigns] = useState([]);
  const [running, setRunning] = useState(false);
  const [curPhase, setCurPhase] = useState(-1);
  const [statuses, setStatuses] = useState({});
  const [liveOutputs, setLiveOutputs] = useState({});
  const [selAgent, setSelAgent] = useState(null);
  const [done, setDone] = useState(false);
  const [rawInput, setRawInput] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [revModal, setRevModal] = useState(null); // campaign to revise
  const [revNotes, setRevNotes] = useState('');
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [selectedVersion, setSelectedVersion] = useState(0);
  const abortRef = useRef(null);

  useEffect(() => { fetchCampaigns().then(setCampaigns); }, []);

  const reset = () => {
    setRunning(false); setCurPhase(-1); setStatuses({}); setLiveOutputs({});
    setSelAgent(null); setDone(false); setRawInput(''); setCompanyName('');
    setRevModal(null); setRevNotes(''); setSelectedCampaign(null); setSelectedVersion(0);
  };

  const startRun = async (inputText, notes = '', prevOutputs = {}, existingCampaignId = null) => {
    if (!inputText.trim()) return;
    setRunning(true); setDone(false); setStatuses({}); setLiveOutputs({ ...prevOutputs });
    setSelAgent(null); setView('new');
    abortRef.current = new AbortController();

    const callbacks = {
      onStart: id => setStatuses(s => ({ ...s, [id]: 'running' })),
      onChunk: (id, t) => setLiveOutputs(o => ({ ...o, [id]: t })),
      onDone: (id, t) => { setStatuses(s => ({ ...s, [id]: 'done' })); setLiveOutputs(o => ({ ...o, [id]: t })); },
      onPhase: p => setCurPhase(p),
      onErr: id => setStatuses(s => ({ ...s, [id]: 'error' })),
    };

    try {
      const finalOutputs = await runPipeline(inputText, notes, prevOutputs, callbacks, abortRef.current.signal);
      setDone(true);
      const version = { timestamp: new Date().toISOString(), label: notes ? `Revision` : 'Original', rawInput: inputText, revisionNotes: notes, outputs: finalOutputs };
      let updated;
      if (existingCampaignId) {
        updated = campaigns.map(c => c.id === existingCampaignId ? { ...c, versions: [...c.versions, version] } : c);
      } else {
        const newCamp = { id: Date.now().toString(), company: companyName.trim() || 'Unnamed Company', createdAt: new Date().toISOString(), versions: [version] };
        updated = [newCamp, ...campaigns];
      }
      setCampaigns(updated);
      await saveCampaigns(updated);
    } catch(e) {
      if (e.name !== 'AbortError') console.error(e);
    } finally {
      setRunning(false);
    }
  };

  const stop = () => { abortRef.current?.abort(); setRunning(false); };

  // ─── VIEW: NEW ANALYSIS ───
  const renderNew = () => (
    <div>
      {!running && !done && (
        <div style={{ maxWidth: 680, margin: '0 auto' }}>
          <div style={{ marginBottom: 28 }}>
            <div style={{ fontSize: 22, fontWeight: 800, color: '#fff', marginBottom: 6, fontFamily:'Space Grotesk, sans-serif' }}>New Automation Analysis</div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)' }}>Paste anything — emails, notes, bullet points. Nathan will clean it up.</div>
          </div>
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.35)', letterSpacing:'0.1em', display:'block', marginBottom: 6 }}>CLIENT / COMPANY NAME</label>
            <input value={companyName} onChange={e => setCompanyName(e.target.value)}
              placeholder="e.g. Sharma Textiles, Riya's Salon..." style={{
                width:'100%', padding:'10px 14px', borderRadius:8, border:'1px solid rgba(255,255,255,0.08)',
                background:'rgba(255,255,255,0.03)', color:'#fff', fontSize:13, fontFamily:'inherit', boxSizing:'border-box'
              }} />
          </div>
          <div style={{ marginBottom: 20 }}>
            <label style={{ fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.35)', letterSpacing:'0.1em', display:'block', marginBottom: 6 }}>RAW CLIENT BRIEF</label>
            <textarea value={rawInput} onChange={e => setRawInput(e.target.value)}
              placeholder={`Paste anything here. Examples:\n\n"We run a 12-person accounting firm. We use QuickBooks, Excel and Gmail. Our biggest issue is that we manually send invoices and follow up on payments. We also spend 4 hours a week on payroll. Budget is around $500/month."\n\nOr paste a client email, WhatsApp message, meeting notes — Nathan will structure it.`}
              rows={10} style={{
                width:'100%', padding:'14px', borderRadius:8, border:'1px solid rgba(255,255,255,0.08)',
                background:'rgba(255,255,255,0.03)', color:'rgba(255,255,255,0.8)', fontSize:12,
                fontFamily:'IBM Plex Mono, monospace', lineHeight:1.7, resize:'vertical', boxSizing:'border-box'
              }} />
          </div>
          <button onClick={() => {
            setCompanyName("Sharma Textiles Pvt Ltd");
            setRawInput(`Company: Sharma Textiles Pvt Ltd
Industry: Textile manufacturing & wholesale
Team size: 28 people
Location: Surat, Gujarat

Current tools: WhatsApp, Excel, Tally ERP, Gmail, Google Sheets, manual invoicing

Biggest pain points:
- We manually create and send invoices in Tally then email PDFs to 200+ clients — takes 2 people full time
- Follow up on payment dues is done by calling clients on WhatsApp manually — very embarrassing and time consuming
- Our stock/inventory is tracked in Excel and goes out of sync constantly
- New vendor onboarding takes 1-2 weeks because documents are collected manually over WhatsApp
- We spend every Monday morning doing weekly sales reporting — 3 hours just copy-pasting data into Excel

Monthly revenue: approx ₹45 lakhs
Budget for automation: ₹20,000-30,000/month ($250-350)
Goal: reduce manual admin work, speed up collections, get real-time inventory visibility`);
          }} style={{
            padding:'8px 16px', borderRadius:7, border:'1px solid rgba(6,182,212,0.3)', background:'rgba(6,182,212,0.07)',
            color:'#06B6D4', fontSize:11, fontWeight:700, cursor:'pointer', fontFamily:'inherit', marginBottom:12, display:'block'
          }}>
            💡 Load Demo: Sharma Textiles (Fiverr Portfolio Example)
          </button>

          <button onClick={() => startRun(rawInput)} disabled={!rawInput.trim()} style={{
            padding:'12px 32px', borderRadius:9, border:'none', cursor: rawInput.trim() ? 'pointer' : 'not-allowed',
            background: rawInput.trim() ? 'linear-gradient(135deg, #8B5CF6, #06B6D4)' : 'rgba(255,255,255,0.05)',
            color: rawInput.trim() ? '#fff' : 'rgba(255,255,255,0.2)', fontSize:13, fontWeight:700, fontFamily:'inherit',
            transition:'all 0.2s'
          }}>
            ⚡ Run 14-Agent Analysis
          </button>
        </div>
      )}

      {(running || done) && (
        <div>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:16 }}>
            <div>
              <div style={{ fontSize:15, fontWeight:800, color:'#fff', fontFamily:'Space Grotesk, sans-serif' }}>
                {running ? '⚡ Agents Running...' : '✅ Analysis Complete'}
              </div>
              {companyName && <div style={{ fontSize:11, color:'rgba(255,255,255,0.3)', marginTop:2 }}>{companyName}</div>}
            </div>
            <div style={{ display:'flex', gap:8 }}>
              {running && <button onClick={stop} style={{ padding:'6px 14px', borderRadius:7, border:'1px solid rgba(220,38,38,0.3)', background:'rgba(220,38,38,0.08)', color:'#FCA5A5', fontSize:11, fontWeight:700, cursor:'pointer', fontFamily:'inherit' }}>■ Stop</button>}
              {done && <button onClick={() => exportPDF(companyName || 'Client', liveOutputs)} style={{ padding:'6px 14px', borderRadius:7, border:'none', background:'linear-gradient(135deg, #10B981, #06B6D4)', color:'#fff', fontSize:11, fontWeight:700, cursor:'pointer', fontFamily:'inherit' }}>📄 Export PDF</button>}
              {done && <button onClick={reset} style={{ padding:'6px 14px', borderRadius:7, border:'none', background:'linear-gradient(135deg, #8B5CF6, #06B6D4)', color:'#fff', fontSize:11, fontWeight:700, cursor:'pointer', fontFamily:'inherit' }}>+ New Analysis</button>}
            </div>
          </div>

          {/* Phase progress */}
          <div style={{ display:'flex', gap:4, marginBottom:16, flexWrap:'wrap' }}>
            {PHASES.map(p => {
              const state = p.id < curPhase ? 'done' : p.id === curPhase ? 'active' : 'idle';
              return (
                <div key={p.id} style={{
                  padding:'4px 10px', borderRadius:5, fontSize:9, fontWeight:700, letterSpacing:'0.08em',
                  background: state === 'active' ? p.color + '22' : state === 'done' ? 'rgba(16,185,129,0.1)' : 'rgba(255,255,255,0.03)',
                  color: state === 'active' ? p.color : state === 'done' ? '#10B981' : 'rgba(255,255,255,0.2)',
                  border: `1px solid ${state === 'active' ? p.color + '44' : state === 'done' ? 'rgba(16,185,129,0.2)' : 'rgba(255,255,255,0.04)'}`,
                  transition:'all 0.3s'
                }}>
                  {state === 'done' ? '✓ ' : state === 'active' ? '● ' : ''}{p.icon} {p.name.toUpperCase()}
                </div>
              );
            })}
          </div>

          {/* Agent grid by phase */}
          {PHASES.map(p => {
            const pa = AGENTS.filter(a => a.phase === p.id);
            const anyActive = pa.some(a => statuses[a.id]);
            if (!anyActive && curPhase < p.id) return null;
            return (
              <div key={p.id} style={{ marginBottom: 14 }}>
                <div style={{ fontSize:8, fontWeight:700, color:p.color, letterSpacing:'0.1em', marginBottom:6, opacity:0.7 }}>
                  {p.icon} PHASE {p.id}: {p.name.toUpperCase()}
                </div>
                <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(195px, 1fr))', gap:5 }}>
                  {pa.map(a => (
                    <AgentChip key={a.id} agent={a} status={statuses[a.id]||'idle'} active={selAgent===a.id}
                      onClick={() => liveOutputs[a.id] && setSelAgent(selAgent===a.id ? null : a.id)} />
                  ))}
                </div>
              </div>
            );
          })}

          {/* Output viewer */}
          {selAgent && liveOutputs[selAgent] && (
            <div style={{ marginTop: 14 }}>
              <OutputViewer agent={AGENTS.find(a => a.id === selAgent)} content={liveOutputs[selAgent]} />
            </div>
          )}

          {/* Final report spotlight */}
          {done && liveOutputs['aria'] && (
            <div style={{ marginTop:16, padding:16, borderRadius:12, background:'linear-gradient(135deg, rgba(6,182,212,0.05), rgba(139,92,246,0.05))', border:'1px solid rgba(6,182,212,0.15)' }}>
              <div style={{ fontSize:11, fontWeight:800, color:'#06B6D4', marginBottom:10, fontFamily:'Space Grotesk, sans-serif' }}>📄 FINAL EXECUTIVE REPORT — {companyName || 'Client'}</div>
              <div style={{ fontSize:11.5, lineHeight:1.8, color:'rgba(255,255,255,0.75)', whiteSpace:'pre-wrap', fontFamily:'IBM Plex Mono, monospace' }}>
                {liveOutputs['aria'].split('\n').map((line, i) => {
                  if (line.startsWith('**') && line.endsWith('**')) return <div key={i} style={{ fontWeight:700, color:'#06B6D4', marginTop:10 }}>{line.replace(/\*\*/g,'')}</div>;
                  if (line.startsWith('═')) return <div key={i} style={{ color:'rgba(6,182,212,0.3)', letterSpacing:2 }}>{line}</div>;
                  return <div key={i}>{line||' '}</div>;
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );

  // ─── VIEW: CAMPAIGNS ───
  const renderCampaigns = () => (
    <div>
      <div style={{ fontSize:18, fontWeight:800, color:'#fff', marginBottom:20, fontFamily:'Space Grotesk, sans-serif' }}>
        Saved Campaigns <span style={{ fontSize:12, color:'rgba(255,255,255,0.3)', fontWeight:400, marginLeft:8 }}>{campaigns.length} total</span>
      </div>

      {campaigns.length === 0 && (
        <div style={{ padding:32, textAlign:'center', color:'rgba(255,255,255,0.2)', fontSize:13 }}>
          No campaigns yet. Run your first analysis to get started.
        </div>
      )}

      {campaigns.map(c => (
        <div key={c.id} style={{ marginBottom:10, padding:14, borderRadius:10, border:'1px solid rgba(255,255,255,0.06)', background:'rgba(255,255,255,0.02)', cursor:'pointer' }}
          onClick={() => { setSelectedCampaign(c); setSelectedVersion(c.versions.length - 1); }}>
          <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between' }}>
            <div>
              <div style={{ fontSize:14, fontWeight:700, color:'#fff' }}>{c.company}</div>
              <div style={{ fontSize:10, color:'rgba(255,255,255,0.25)', marginTop:3 }}>
                {new Date(c.createdAt).toLocaleDateString('en-GB', { day:'numeric', month:'short', year:'numeric' })}
                {' · '}{c.versions.length} version{c.versions.length > 1 ? 's' : ''}
              </div>
              <div style={{ display:'flex', gap:4, marginTop:6, flexWrap:'wrap' }}>
                {c.versions.map((v, vi) => (
                  <span key={vi} style={{ fontSize:8, padding:'2px 7px', borderRadius:4,
                    background: vi === c.versions.length-1 ? 'rgba(139,92,246,0.2)' : 'rgba(255,255,255,0.05)',
                    color: vi === c.versions.length-1 ? '#C084FC' : 'rgba(255,255,255,0.3)',
                    fontWeight:700
                  }}>v{vi+1} {v.label}</span>
                ))}
              </div>
            </div>
            <div style={{ display:'flex', gap:6 }}>
              <button onClick={e => { e.stopPropagation(); setRevModal(c); setRevNotes(''); }} style={{
                padding:'5px 12px', borderRadius:6, border:'1px solid rgba(139,92,246,0.3)', background:'rgba(139,92,246,0.08)',
                color:'#C084FC', fontSize:10, fontWeight:700, cursor:'pointer', fontFamily:'inherit'
              }}>🔄 Revise</button>
              <button onClick={e => { e.stopPropagation(); setSelectedCampaign(c); setSelectedVersion(c.versions.length-1); }} style={{
                padding:'5px 12px', borderRadius:6, border:'1px solid rgba(255,255,255,0.08)', background:'rgba(255,255,255,0.03)',
                color:'rgba(255,255,255,0.5)', fontSize:10, fontWeight:700, cursor:'pointer', fontFamily:'inherit'
              }}>View →</button>
            </div>
          </div>
        </div>
      ))}

      {/* Campaign detail panel */}
      {selectedCampaign && (
        <div style={{ position:'fixed', top:0, right:0, bottom:0, width:'55vw', background:'#0A0A14', borderLeft:'1px solid rgba(255,255,255,0.07)', overflowY:'auto', padding:24, zIndex:100 }}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:20 }}>
            <div>
              <div style={{ fontSize:16, fontWeight:800, color:'#fff', fontFamily:'Space Grotesk, sans-serif' }}>{selectedCampaign.company}</div>
              <div style={{ display:'flex', gap:5, marginTop:6 }}>
                {selectedCampaign.versions.map((v, vi) => (
                  <button key={vi} onClick={() => setSelectedVersion(vi)} style={{
                    padding:'3px 9px', borderRadius:5, border: `1px solid ${vi===selectedVersion ? '#8B5CF6' : 'rgba(255,255,255,0.08)'}`,
                    background: vi===selectedVersion ? 'rgba(139,92,246,0.15)' : 'rgba(255,255,255,0.03)',
                    color: vi===selectedVersion ? '#C084FC' : 'rgba(255,255,255,0.3)',
                    fontSize:9, fontWeight:700, cursor:'pointer', fontFamily:'inherit'
                  }}>v{vi+1} {v.label}</button>
                ))}
              </div>
            </div>
            <div style={{display:'flex',gap:6}}>
              <button onClick={() => exportPDF(selectedCampaign.company, selectedCampaign.versions[selectedVersion]?.outputs||{})} style={{ padding:'6px 12px', borderRadius:7, border:'none', background:'linear-gradient(135deg,#10B981,#06B6D4)', color:'#fff', fontSize:11, fontWeight:700, cursor:'pointer', fontFamily:'inherit' }}>📄 Export PDF</button>
              <button onClick={() => setSelectedCampaign(null)} style={{ padding:'6px 12px', borderRadius:7, border:'1px solid rgba(255,255,255,0.1)', background:'rgba(255,255,255,0.04)', color:'rgba(255,255,255,0.5)', fontSize:11, cursor:'pointer', fontFamily:'inherit' }}>✕ Close</button>
            </div>
          </div>

          {selectedCampaign.versions[selectedVersion]?.revisionNotes && (
            <div style={{ padding:10, borderRadius:8, background:'rgba(139,92,246,0.08)', border:'1px solid rgba(139,92,246,0.2)', marginBottom:14 }}>
              <div style={{ fontSize:9, fontWeight:700, color:'#C084FC', marginBottom:4 }}>🔄 REVISION NOTES</div>
              <div style={{ fontSize:11, color:'rgba(255,255,255,0.5)' }}>{selectedCampaign.versions[selectedVersion].revisionNotes}</div>
            </div>
          )}

          {AGENTS.map(a => {
            const out = selectedCampaign.versions[selectedVersion]?.outputs?.[a.id];
            if (!out) return null;
            return (
              <div key={a.id} style={{ marginBottom:10 }}>
                <div style={{ fontSize:9, fontWeight:700, color:a.color, letterSpacing:'0.08em', marginBottom:5, opacity:0.7 }}>
                  {a.emoji} {a.name.toUpperCase()} — {a.title.toUpperCase()}
                </div>
                <div style={{ padding:12, borderRadius:9, background:'rgba(255,255,255,0.02)', border:`1px solid ${a.color}20`, fontSize:11, lineHeight:1.7, color:'rgba(255,255,255,0.65)', whiteSpace:'pre-wrap', fontFamily:'IBM Plex Mono, monospace' }}>
                  {out}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );

  // ─── VIEW: DASHBOARD ───
  const renderDash = () => {
    const total = campaigns.length;
    const revisions = campaigns.reduce((acc, c) => acc + c.versions.length - 1, 0);
    return (
      <div>
        <div style={{ fontSize:22, fontWeight:800, color:'#fff', marginBottom:6, fontFamily:'Space Grotesk, sans-serif' }}>Welcome back, Arpit 👋</div>
        <div style={{ fontSize:12, color:'rgba(255,255,255,0.3)', marginBottom:28 }}>NeuralEdge AI Automation Engine — 14 Agents · 6 Phases</div>

        <div style={{ display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:10, marginBottom:24 }}>
          {[
            { label:'Campaigns Run', value:total, color:'#8B5CF6' },
            { label:'Revisions', value:revisions, color:'#F59E0B' },
            { label:'AI Agents', value:14, color:'#06B6D4' },
          ].map(s => (
            <div key={s.label} style={{ padding:16, borderRadius:10, border:`1px solid ${s.color}22`, background:`${s.color}08` }}>
              <div style={{ fontSize:28, fontWeight:800, color:s.color, fontFamily:'Space Grotesk, sans-serif' }}>{s.value}</div>
              <div style={{ fontSize:10, color:'rgba(255,255,255,0.3)', marginTop:3, fontWeight:600 }}>{s.label}</div>
            </div>
          ))}
        </div>

        <div style={{ marginBottom:14 }}>
          <div style={{ fontSize:11, fontWeight:700, color:'rgba(255,255,255,0.3)', letterSpacing:'0.1em', marginBottom:10 }}>AGENT PIPELINE</div>
          {PHASES.map(p => (
            <div key={p.id} style={{ display:'flex', alignItems:'center', gap:8, padding:'8px 12px', borderRadius:7, marginBottom:4, background:'rgba(255,255,255,0.02)', border:'1px solid rgba(255,255,255,0.04)' }}>
              <span style={{ fontSize:12 }}>{p.icon}</span>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:11, fontWeight:700, color:'rgba(255,255,255,0.5)' }}>Phase {p.id}: {p.name}</div>
                <div style={{ fontSize:9, color:'rgba(255,255,255,0.2)', marginTop:1 }}>
                  {AGENTS.filter(a => a.phase === p.id).map(a => a.name).join(' · ')}
                </div>
              </div>
              <div style={{ fontSize:9, padding:'2px 8px', borderRadius:4, background:`${p.color}15`, color:p.color, fontWeight:700 }}>
                {AGENTS.filter(a => a.phase === p.id).length} agent{AGENTS.filter(a => a.phase === p.id).length > 1 ? 's' : ''}
              </div>
            </div>
          ))}
        </div>

        <button onClick={() => setView('new')} style={{
          padding:'11px 24px', borderRadius:9, border:'none', background:'linear-gradient(135deg, #8B5CF6, #06B6D4)',
          color:'#fff', fontSize:13, fontWeight:700, cursor:'pointer', fontFamily:'inherit'
        }}>⚡ New Analysis →</button>
      </div>
    );
  };

  // ─── REVISION MODAL ───
  const renderRevModal = () => {
    if (!revModal) return null;
    return (
      <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.7)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:200 }}>
        <div style={{ width:520, padding:24, borderRadius:14, background:'#0E0E1A', border:'1px solid rgba(139,92,246,0.3)' }}>
          <div style={{ fontSize:15, fontWeight:800, color:'#fff', marginBottom:4, fontFamily:'Space Grotesk, sans-serif' }}>🔄 Revise Campaign</div>
          <div style={{ fontSize:11, color:'rgba(255,255,255,0.3)', marginBottom:16 }}>{revModal.company} · Adding version {revModal.versions.length + 1}</div>
          <div style={{ padding:10, borderRadius:8, background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.06)', marginBottom:14 }}>
            <div style={{ fontSize:9, fontWeight:700, color:'rgba(255,255,255,0.3)', marginBottom:5 }}>ORIGINAL BRIEF</div>
            <div style={{ fontSize:10, color:'rgba(255,255,255,0.4)', fontFamily:'IBM Plex Mono, monospace', maxHeight:80, overflowY:'auto', lineHeight:1.6 }}>
              {revModal.versions[0].rawInput}
            </div>
          </div>
          <label style={{ fontSize:9, fontWeight:700, color:'rgba(255,255,255,0.35)', letterSpacing:'0.1em', display:'block', marginBottom:6 }}>
            WHAT CHANGED? (revision notes)
          </label>
          <textarea value={revNotes} onChange={e => setRevNotes(e.target.value)}
            placeholder="e.g. Client increased budget to $800/month. They also mentioned they want to focus on e-commerce automation specifically. Ignore the HR section."
            rows={4} style={{
              width:'100%', padding:12, borderRadius:8, border:'1px solid rgba(255,255,255,0.08)',
              background:'rgba(255,255,255,0.03)', color:'rgba(255,255,255,0.8)', fontSize:12,
              fontFamily:'IBM Plex Mono, monospace', lineHeight:1.6, resize:'vertical', boxSizing:'border-box', marginBottom:14
            }} />
          <div style={{ display:'flex', gap:8, justifyContent:'flex-end' }}>
            <button onClick={() => setRevModal(null)} style={{ padding:'8px 16px', borderRadius:7, border:'1px solid rgba(255,255,255,0.1)', background:'transparent', color:'rgba(255,255,255,0.4)', fontSize:11, fontWeight:700, cursor:'pointer', fontFamily:'inherit' }}>Cancel</button>
            <button onClick={() => {
              const orig = revModal.versions[0];
              setCompanyName(revModal.company);
              setRevModal(null);
              startRun(orig.rawInput, revNotes, {}, revModal.id);
            }} style={{ padding:'8px 20px', borderRadius:7, border:'none', background:'linear-gradient(135deg, #8B5CF6, #06B6D4)', color:'#fff', fontSize:11, fontWeight:700, cursor:'pointer', fontFamily:'inherit' }}>
              ⚡ Re-run Analysis
            </button>
          </div>
        </div>
      </div>
    );
  };

  const NAV = [
    { id:'dashboard', icon:'⚡', label:'Dashboard' },
    { id:'new', icon:'＋', label:'New Analysis' },
    { id:'campaigns', icon:'📁', label:'Campaigns' },
  ];

  return (
    <div style={{ minHeight:'100vh', background:'#06060B', color:'#fff', fontFamily:"'Instrument Sans', system-ui, sans-serif", display:'flex' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Sans:wght@400;500;600;700;800&family=IBM+Plex+Mono:wght@400;500;700&family=Space+Grotesk:wght@700;800&display=swap');
        @keyframes shimmer{0%{transform:translateX(-100%)}100%{transform:translateX(200%)}}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:.3}}
        @keyframes fadeIn{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}
        input,textarea,button{outline:none}
        ::-webkit-scrollbar{width:3px}::-webkit-scrollbar-track{background:transparent}::-webkit-scrollbar-thumb{background:rgba(255,255,255,0.06);border-radius:10px}
      `}</style>

      {/* Sidebar */}
      <div style={{ width:190, flexShrink:0, borderRight:'1px solid rgba(255,255,255,0.04)', display:'flex', flexDirection:'column', background:'rgba(255,255,255,0.005)' }}>
        <div style={{ padding:'16px 14px 14px', borderBottom:'1px solid rgba(255,255,255,0.04)' }}>
          <div style={{ display:'flex', alignItems:'center', gap:8 }}>
            <div style={{ width:30, height:30, borderRadius:8, background:'linear-gradient(135deg, #8B5CF6, #06B6D4)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:13 }}>⚡</div>
            <div>
              <div style={{ fontWeight:800, fontSize:13, background:'linear-gradient(135deg, #C084FC, #06B6D4)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', fontFamily:'Space Grotesk, sans-serif' }}>NeuralEdge</div>
              <div style={{ fontSize:7, color:'rgba(255,255,255,0.15)', fontWeight:700, letterSpacing:'0.14em' }}>AI ENGINE v2</div>
            </div>
          </div>
        </div>
        <div style={{ padding:'9px 6px', flex:1 }}>
          {NAV.map(n => (
            <button key={n.id} onClick={() => { setView(n.id); if(n.id !== 'campaigns') setSelectedCampaign(null); }} style={{
              display:'flex', alignItems:'center', gap:7, width:'100%', padding:'7px 9px', borderRadius:7, border:'none',
              background: view===n.id ? 'rgba(139,92,246,0.1)' : 'transparent',
              color: view===n.id ? '#C084FC' : 'rgba(255,255,255,0.28)',
              fontSize:11.5, fontWeight: view===n.id ? 700 : 500, cursor:'pointer', fontFamily:'inherit', marginBottom:1, textAlign:'left',
            }}><span style={{ width:15, textAlign:'center', fontSize:11 }}>{n.icon}</span>{n.label}</button>
          ))}
        </div>
        <div style={{ padding:'10px 12px', borderBottom:'1px solid rgba(255,255,255,0.04)' }}>
          <div style={{ fontSize:8, fontWeight:700, color:'rgba(255,255,255,0.15)', letterSpacing:'0.1em', marginBottom:5 }}>AGENT STATUS</div>
          <div style={{ fontSize:9, color:'rgba(255,255,255,0.25)' }}>
            {running ? <span style={{ color:'#06B6D4' }}>● {Object.values(statuses).filter(s => s==='running').length} running</span> : `${Object.values(statuses).filter(s => s==='done').length}/14 done`}
          </div>
        </div>
        <div style={{ padding:'10px 12px' }}>
          <div style={{ display:'flex', alignItems:'center', gap:6 }}>
            <div style={{ width:22, height:22, borderRadius:5, background:'linear-gradient(135deg, #F59E0B, #EC4899)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:9, fontWeight:800 }}>A</div>
            <div>
              <div style={{ fontSize:10, fontWeight:700, color:'rgba(255,255,255,0.5)' }}>Arpit</div>
              <div style={{ fontSize:7, color:'rgba(255,255,255,0.15)' }}>Agency Founder</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div style={{ flex:1, padding:'22px 28px', overflowY:'auto', maxHeight:'100vh' }}>
        {view === 'dashboard' && renderDash()}
        {view === 'new' && renderNew()}
        {view === 'campaigns' && renderCampaigns()}
      </div>

      {renderRevModal()}
    </div>
  );
}
