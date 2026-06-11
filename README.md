# Xeno CRM — AI-Powered Customer Engagement Platform

> Built as a take-home assignment for Xeno's Product Engineering role.
> Live Demo: [xeno-crm-nu.vercel.app](https://xeno-crm-nu.vercel.app)
> GitHub: [github.com/niraj2908/xeno-crm](https://github.com/niraj2908/xeno-crm)

---

## What is this?

Xeno CRM is a mini version of Xeno's core product — an AI-powered customer relationship and campaign management platform built for D2C and e-commerce brands.

It lets you:
- Import customers and orders
- Create audience segments using **natural language** or a **visual rule builder**
- Generate **WhatsApp campaigns** using AI
- Track campaign performance with **AI-generated insights**

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14 (App Router), TypeScript, Tailwind CSS |
| UI Components | Shadcn UI, Lucide Icons, Recharts |
| Backend | Next.js API Routes |
| Database | PostgreSQL (Prisma ORM, hosted on Neon/Prisma Cloud) |
| AI Model | **Llama 3.3 70B** via Groq API |
| Deployment | Vercel |

### Why Llama 3.3 70B via Groq?
- **Free tier** with generous limits — no credit card needed
- **Sub-second response times** — faster than GPT-4
- **Meta's best open-source model** — comparable quality to GPT-4o
- Same OpenAI-compatible API format — easy to swap providers

---

## Features

### 1. Dashboard
- Real-time stats: Total Customers, Revenue, Active Campaigns, Avg Order Value
- Revenue trend chart (last 6 months)
- Channel performance bars (WhatsApp, Email, SMS, Push)
- AI Campaign Assistant — generate WhatsApp messages directly from dashboard
- Recent campaigns table

### 2. Customer Management
- View all customers with total spend, order count, last order date
- Search and filter in real time
- CSV import — drag and drop any CSV with name, email, phone columns

### 3. AI-Powered Segmentation ⭐ (Key Feature)

This is the most Xeno-like feature. Two ways to create segments:

#### Option A — Visual Rule Builder
Build conditions like a real CRM:
Total Spend (₹)     greater than (>)    10000
AND
Days Since Last Order   greater than (>)    60
- Supports AND / OR logic between conditions
- Add unlimited conditions
- Live preview shows matching customers instantly with their spend, order count, and days since last order

#### Option B — AI Natural Language
Type in plain English:

"Customers who spent over ₹10000 but haven't ordered in 90 days"
AI (Llama 3.3 70B) converts this to structured rules:
```json
{
  "rules": [
    { "field": "totalSpend", "op": "gt", "value": 10000 },
    { "field": "daysSinceLastOrder", "op": "gt", "value": 90 }
  ]
}
```
Then automatically previews matching customers.

**Why this matters:** This is exactly how real marketing managers think. They don't write SQL — they describe audiences in plain English. Our AI bridges that gap.

#### How we created segments — step by step:
1. Go to Segments → Create Segment
2. Enter a name like "High Value At-Risk"
3. Choose Rule Builder or AI Natural Language
4. Add conditions:
   - Total Spend > ₹10000
   - AND Days Since Last Order > 60
5. Click "Preview Matching Customers" — see live results
6. Click "Save Segment"

### 4. Campaign Generator ⭐ (Key Feature)

#### How to create a campaign:
1. Go to Campaigns → New Campaign
2. Enter campaign name: "Summer Win-Back"
3. Select segment: "High Value At-Risk" (8 customers)
4. Enter goal: "Win back inactive customers with 20% discount"
5. Click **Generate** — AI writes the WhatsApp message:
Hey! 👋 We miss you! Enjoy 20% OFF on your next order.
Use code BACK20 at checkout. Limited time only! 🛍️
6. Edit if needed, then click **Launch Campaign**
7. Delivery simulation runs: Sent → Delivered → Read → Clicked

#### Earlier (Manual) Approach vs Our AI Approach:

| Without AI | With AI |
|-----------|---------|
| Marketing team writes messages manually | Type your goal, AI writes the message |
| Takes hours to craft copy | Takes 3 seconds |
| Inconsistent tone and quality | Optimized for WhatsApp engagement |
| Hard to personalize per segment | Each segment gets tailored messaging |

### 5. Analytics
- Bar chart comparing Delivery %, Read %, Click % across campaigns
- Campaign performance table with all metrics
- **AI Insight Button** — click to get a 2-line AI-generated analysis like:
  > "The High Value segment achieved 34% CTR, 2x higher than your average — consider increasing budget for this audience."

### 6. Orders
- View all orders with customer name, amount, date
- CSV import support (columns: email, amount, date)

### 7. Settings
- Dark/Light mode toggle
- Language selection (English, Hindi, Tamil, Telugu, Marathi, Bengali)
- Timezone and currency settings
- Notification preferences (Email, WhatsApp, Campaign alerts)
- AI model selection and campaign tone settings

---

## Database Schema
Customer
├── id, name, email, phone, createdAt
└── → Orders (1:many)
└── → SegmentMembers (many:many via Segment)
Order
├── id, customerId, amount, createdAt
└── → Customer
Segment
├── id, name, description, rules (JSON), createdAt
├── → SegmentMembers
└── → Campaigns
Campaign
├── id, name, segmentId, message, status, stats (JSON), createdAt
└── → Segment
---

## AI Architecture
User Input (natural language)
↓
POST /api/ai/parse-segment
↓
Groq API (Llama 3.3 70B)
↓
Structured JSON rules
↓
POST /api/segments/preview
↓
Filter customers from PostgreSQL
↓
Live preview with count + customer list

Campaign Goal (user input)
↓
POST /api/ai/draft-campaign
↓
Groq API (Llama 3.3 70B)
↓
WhatsApp message (<160 chars, emoji, CTA)
↓
User edits → Launch → Stats simulation

---

## Tradeoffs I Made

| Decision | Reason |
|----------|--------|
| No separate backend service | Next.js API routes are a real backend. Separate service adds deployment complexity with zero demo value. In production I'd split the campaign delivery service for webhook handling and retries. |
| Simulated delivery stats | Real WhatsApp delivery requires Meta Business API approval (weeks). Simulation shows the UX flow accurately. In production this would use webhooks. |
| Groq instead of OpenAI | Free tier, faster, same quality for this use case. Production would evaluate based on cost/latency/accuracy tradeoffs. |
| No authentication | Out of scope for this assignment. Production would use NextAuth with Google OAuth. |

---

## Local Setup

```bash
git clone https://github.com/niraj2908/xeno-crm.git
cd xeno-crm
npm install

# Add environment variables
cp .env.example .env
# Fill in DATABASE_URL and OPENAI_API_KEY (Groq key)

# Setup database
npx prisma migrate dev
npx ts-node prisma/seed.ts

# Run
npm run dev
```

---

## What I Would Build Next

1. Real WhatsApp delivery via Meta Business API with webhook callbacks
2. Multi-variant A/B testing for campaign messages
3. Cohort analysis — track customers across multiple campaigns
4. Authentication with NextAuth
5. Campaign scheduling — send at optimal times
6. More segment fields — city, device, referral source

---

## About

Built by Niraj Kumar Singh for Xeno's Product Engineering internship assignment.

The goal was to demonstrate product thinking, AI integration, and full-stack engineering — not just CRUD.

> "I wanted segmentation to resemble how real marketers define audiences. Instead of hardcoded segments, users can create dynamic audiences using flexible business rules combined with natural language AI."
