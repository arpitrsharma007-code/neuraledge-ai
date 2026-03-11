# ⚡ NeuralEdge AI — Automation Strategy Engine

> **14 AI agents. 6 phases. One complete automation strategy — in minutes.**

🌐 **Live Demo:** [neuraledge-ai.vercel.app](https://neuraledge-ai.vercel.app)

---

## What is NeuralEdge AI?

NeuralEdge AI is an autonomous multi-agent system that analyzes any business and produces a complete, actionable AI automation strategy — the kind that used to cost $5,000 from a consulting firm.

Paste a client brief (messy notes, emails, bullet points — anything). 14 specialized AI agents run in sequence and parallel, audit each other's work, and deliver a PDF-ready executive report with:

- Top automation opportunities ranked by ROI
- Specific tool recommendations with real prices
- Full 90-day implementation roadmap
- Budget and break-even analysis
- Domain-specific strategies for Ops, Marketing, Finance, Support & HR

---

## The 14-Agent Pipeline

```
📋 Phase 0 — Brief Intake
   └── Nathan Cross (Client Onboarding) — sanitizes any raw input into a structured brief

🔍 Phase 1 — Business Discovery
   ├── Maya Chen (Business Intake Director) — automation readiness + quick wins
   ├── Raj Malhotra (Operations Analyst) — process mapping + time savings
   └── Luna Park (Data & Systems Auditor) — tech stack audit + integration gaps

🦅 Phase 2 — Automation QA
   └── Victor Ashworth "The Axe" — brutally reviews Phase 1, scores 1–100, sends back if weak

🗺️ Phase 3 — Opportunity Mapping (runs in parallel)
   ├── Alex Torres — Operations automation
   ├── Sam Rivera — Marketing automation
   ├── Jordan Kim — Finance automation
   ├── Casey Morgan — Customer Support automation
   └── Riley Chen — HR & Admin automation

⚙️ Phase 4 — Strategy Build
   ├── Priya Nair (AI Tools Specialist) — master toolkit with free + paid tools
   ├── Devon Walsh (ROI & Budget Analyst) — full financial model + break-even
   └── Kai Okafor (Implementation Roadmap) — 90-day executable plan

📄 Phase 5 — Final Report
   └── Aria Shen — compiles everything into a client-ready executive PDF
```

---

## Features

- ⚡ **Fully autonomous** — agents pass context to each other automatically
- 🔄 **QA revision loops** — Victor rejects weak work and agents redo it
- 💾 **Persistent campaigns** — all analyses saved across sessions
- 📝 **Revision mode** — re-run any campaign with updated client notes, saves as new version
- 📄 **PDF export** — one-click branded report ready to deliver to clients
- 💡 **Demo mode** — built-in Sharma Textiles example to test instantly

---

## Tech Stack

| Layer | Tech |
|---|---|
| Frontend | React + Vite |
| AI | Claude Sonnet (Anthropic API) |
| Streaming | Server-sent events |
| Storage | window.storage (persistent) |
| Deployment | Vercel |

---

## Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/arpitrsharma007-code/neuraledge-ai.git
cd neuraledge-ai
npm install
```

### 2. Add your API key

Create a `.env` file in the root:

```
VITE_ANTHROPIC_API_KEY=sk-ant-your-key-here
```

Get your key at [console.anthropic.com](https://console.anthropic.com)

### 3. Run locally

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

### 4. Deploy to Vercel

```bash
vercel --prod
```

Add `VITE_ANTHROPIC_API_KEY` in Vercel → Project Settings → Environment Variables.

---

## Cost Per Analysis

Using Claude Sonnet at $3/$15 per million tokens:

| | Cost |
|---|---|
| Single campaign (14 agents) | ~$0.50 |
| 10 campaigns | ~$5.00 |
| 100 campaigns | ~$50.00 |

Charge clients $25–$150 per report. **Margin: ~99%.**

---

## Use Cases

- **Freelancers** — deliver AI strategy reports to SMB clients on Fiverr/Upwork
- **Agencies** — white-label automation consulting at scale
- **Consultants** — replace manual strategy decks with AI-generated reports
- **Founders** — analyze your own business for automation opportunities

---

## Built By

**Arpit Sharma** — Solo founder, vibe coder, building AI products for India.

- 🐦 Twitter: [@arpitrsharma007](https://twitter.com)
- 💼 GitHub: [@arpitrsharma007-code](https://github.com/arpitrsharma007-code)
- 🌐 Agency: [NeuralEdge AI](https://neuraledge-ai.vercel.app)

---

## License

MIT — free to use, modify, and build on.

---

*Built with Claude API · Deployed on Vercel · Part of the NeuralEdge AI product suite*
