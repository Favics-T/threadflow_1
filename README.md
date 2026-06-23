bash

cat > /mnt/user-data/outputs/README.md << 'EOF'
# ThreadFlow AI

> AI-powered operations manager for fashion houses and custom tailoring studios.

Built for the **RIL June Innovation Workshop Series Hackathon Showcase**
Theme: *AI Agents for Everyday Productivity* · Port Harcourt, Nigeria · June 26, 2026

---

## The Problem

Fashion house managers are drowning in operational chaos they cannot see. Customer orders arrive through Instagram DMs, WhatsApp messages, and websites and disappear into someone's notes. Studios that do use tools like Trello or Notion end up with data scattered across platforms that never talk to each other. Tailors get assigned work through verbal check-ins. Fabric gets cut before anyone confirms stock levels. Performance is measured by gut feeling. The result is missed deadlines, wasted materials, and broken client trust, not because the team lacks skill, but because the operation has no intelligence holding it together.

## The Solution

ThreadFlow AI is a fashion studio operations platform with an agentic intelligence layer. It centralises client data, fabric inventory, and tailor workloads — then layers AI agents on top that reason across all three to make decisions, not just display dashboards.

**The manager's job shifts from data collector to decision approver.**

---

## AI Agent Features

### Morning Brief Agent
One command replaces four manual checks. The agent autonomously calls fabric stock, tailor workload, and order status tools — synthesises them into a prioritised daily action list. Available for today, this week, and last month.

### Delivery Date Intelligence
The flagship feature. Given an order, the agent reasons across three live data sources fabric availability, garment complexity from client measurements, and tailor workload hours — to produce a delivery estimate with a visible reasoning chain. No single dashboard page can produce this output.

### AI-Drafted Client Replies
When a client asks for a status update, the agent finds their order, calculates the current delivery estimate, and drafts a professional reply grounded in real data. The reply is staged for manager approval before anything is sent.

### Staff Assignment Agent
The agent reads all tailor workloads and proposes assignments for new orders based on current capacity — with visible reasoning for every recommendation.

### Platform Order Intake
Connect Instagram, WhatsApp, Facebook, Twitter, and your business website. ThreadFlow captures incoming orders and client messages from every channel automatically, flags unread messages, and surfaces high-priority enquiries.
Assign roles to tailors, quality control based on workload available

---

## Demo Flow (4 beats)

1. **Brief Me** → Morning Brief Agent synthesises overnight studio data into a prioritised action list
2. **Delivery estimate** → Ask "When will Adaeze's order be ready?" — agent reasons across fabric, measurements, and tailor load live
3. **Client reply** → Agent drafts an approval-gated WhatsApp-style reply based on real order data
4. **Orders page** → Incoming Instagram and website orders with AI Reply and Assign Tailor actions

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 15 (App Router), TypeScript |
| Styling | Tailwind CSS v4, Material Symbols Outlined |
| Database | Supabase (PostgreSQL) |
| AI | Claude API (`claude-sonnet-4-6`) via `@ai-sdk/anthropic` |
| Agent Framework | Vercel AI SDK (`generateText`, `tool`, `stopWhen`) |
| Deployment | Vercel |

---

## Agent Architecture

```
Manager prompt
      ↓
ThreadFlow Agent (Claude Sonnet via Vercel AI SDK)
      ↓ calls tools:
  ┌─────────────────────────────────┐
  │  find_client                    │
  │  get_order_status               │
  │  check_fabric_stock             │
  │  reserve_material               │
  │  flag_low_stock                 │
  │  get_tailor_workload            │
  │  check_order_inputs             │
  │  calculate_delivery_estimate    │
  │  draft_client_reply             │
  └─────────────────────────────────┘
      ↓
  Supabase (single source of truth)
```

Every tool call is logged to `activity_log` and rendered as a visible reasoning chain in the UI 
---

## Project Structure

```
threadflow/
├── app/
│   ├── dashboard/          # Main dashboard with stat cards and approval gate
│   ├── clients/            # Client directory with measurements and order history
│   ├── orders/             # Platform connections and incoming order management
│   ├── inventory/          # Fabric inventory (coming soon)
│   ├── tailors/            # Workforce tracker with live load data
│   ├── agent/              # AI Agent page with CommandBar and reasoning chain
│   └── api/
│       ├── agent/          # Main agent route (9 tools)
│       └── agent/morning-brief/  # Morning brief endpoint
├── components/
│   ├── layout/             # Sidebar, TopNav
│   ├── dashboard/          # StatCards, OrdersTable, ActivityLog, ApprovalGate, MorningBriefWidget
│   ├── clients/            # ClientList, ClientDetail, MeasurementsEditor, OrderCard, Drawers
│   └── orders/             # PlatformConnections, IncomingOrders
└── lib/
    ├── supabase/            # Server client wrapper
    └── tools/               # All 9 agent tools
```

---

## Database Schema

```sql
clients          -- id, name, phone, measurements (jsonb), created_at
tailors          -- id, name, current_load_hours
fabric_inventory -- id, material_name, yards_available
orders           -- id, client_id, tailor_id, fabric_id, yards_required,
                 --   status, delivery_estimate, garment_type, image_url,
                 --   notes, created_at
activity_log     -- id, tool_name, input (jsonb), output (jsonb), created_at
```

---

## Getting Started

### Prerequisites
- Node.js 18+
- Supabase account
- Anthropic API key

### Setup

```bash
# Install dependencies
npm install

# Add environment variables
cp .env.example .env.local
# Fill in SUPABASE_URL, SUPABASE_ANON_KEY, ANTHROPIC_API_KEY

# Run database migrations
# (paste schema SQL into Supabase SQL Editor)

# Start development server
npm run dev
```

### Environment Variables

```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
ANTHROPIC_API_KEY=sk-ant-...
```

---

## Key Design Decisions

**Why Claude over other models?** Single import swap from Gemini — and Claude's tool-calling with visible reasoning steps is the core of the demo.

**Why Vercel AI SDK over n8n?** Direct API construction avoids the "box-connecting" perception risk with technical judges and gives full control over the agent's reasoning loop.

**Why approval-gated actions?** Any client-facing action the agent proposes is staged for human review before execution. The manager stays in control; the agent does the cognitive labour.

**Why visible reasoning chains?** The reasoning chain UI — showing every tool call and result — is what separates "AI agent" from "fancy search box" in the eyes of judges who understand the technology.

---

## Built By

Taiwo · Solo developer · Fashion-tech builder


---

*ThreadFlow doesn't give managers more data to look at — it gives them fewer decisions to make.*
