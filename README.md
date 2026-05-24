# ClaimsAI — AI-Powered Car Insurance Claims Processing

An intelligent claims processing prototype that demonstrates how AI can automate damage assessment, cost estimation, and approval workflows for car insurance claims.

**🔗 Live Demo: [claims-ai-xi.vercel.app](https://claims-ai-xi.vercel.app/)**

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## 📋 Overview

ClaimsAI streamlines the car insurance claims workflow by integrating AI-powered damage assessment into the claims agent's existing process. The platform automates what was previously a manual, time-consuming review process.

### Core Flow

1. **Claims Dashboard** — View all incoming claims with real-time status tracking and key metrics
2. **Claim Review** — Step-through workflow for processing each claim:
   - **Claim Info** — Review accident and policy details
   - **Photos** — View/upload vehicle damage photos
   - **AI Analysis** — Run AI-powered damage detection and severity classification
   - **Agent Review** — Human checkpoint where the agent confirms or flags AI findings
   - **Cost Estimate** — AI-generated repair cost breakdown with confidence ranges
   - **Approval** — Submit for senior adjuster review and authorization

### Key Features

- **AI Damage Assessment** — Simulated computer vision model that detects damage areas, classifies severity, and provides confidence scores
- **Human-AI Collaboration** — Clear checkpoints where human judgment validates AI output
- **Role-Based Views** — Toggle between Claims Agent and Senior Adjuster perspectives
- **Real-Time Metrics** — Dashboard showing processing time improvements and AI accuracy

## 🛠️ Tech Stack

- **React** (via Vite) — UI framework
- **React Router** — Client-side routing
- **Vanilla CSS** — Custom design system
- **Mock AI Service** — Simulated damage analysis with realistic processing stages

## 📁 Project Structure

```
src/
├── App.jsx                    # Root app with routing and state
├── main.jsx                   # Entry point
├── index.css                  # Design system
├── data/
│   └── mockClaims.js          # Pre-seeded claim data
├── services/
│   └── aiService.js           # Simulated AI analysis
├── pages/
│   ├── Dashboard.jsx          # Claims overview
│   └── ClaimWorkflow.jsx      # Stepped claim processing
├── components/
│   ├── StatusBadge.jsx        # Status indicators
│   ├── MetricsBanner.jsx      # Dashboard metrics
│   ├── PhotoGallery.jsx       # Photo display/upload
│   ├── AIAssessment.jsx       # AI analysis results
│   ├── AgentReview.jsx        # Human review checkpoint
│   ├── CostEstimate.jsx       # Repair cost breakdown
│   └── ApprovalPanel.jsx      # Approval workflow
└── utils/
    └── formatters.js          # Display formatting
```

## 🎯 Demo Walkthrough

1. Open the **Claims Dashboard** to see all pending claims
2. Click on a **New** claim (e.g., CLM-2024-001)
3. Step through **Claim Info** → **Photos** → **AI Analysis**
4. Click **Run AI Analysis** to see the simulated damage assessment
5. In **Agent Review**, confirm or flag each AI finding
6. Review the **Cost Estimate** generated from the assessment
7. **Submit for Senior Review**
8. Toggle to **Sr. Adjuster** role in the header to approve/reject

## 📝 License

## 📝 License

This project is a product prototype for demonstration purposes.
