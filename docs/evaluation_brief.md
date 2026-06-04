# ClaimsAI — Evaluation Brief

**Companion to the PRD and Prototype**
**Mohamed Elsayed · May 2026**

This document maps each evaluation criterion to specific evidence in the prototype ([claims-ai-xi.vercel.app](https://claims-ai-xi.vercel.app/)) and the PRD.

---

## Prototype: Functionality and User Flow

The prototype implements a complete end-to-end claims processing workflow across two user roles and six sequential steps.

### Complete User Flow

```
Dashboard → Claim Info → Photos → AI Analysis → Agent Review → Cost Estimate → Approval → Handoff
```

**Claims Agent path:**

1. **Dashboard** — Searchable claims table with priority indicators, real-time metrics (processing time, accuracy, cost savings), activity feed, and a "New Claim" modal for intake.
2. **Claim Info** (Step 1) — Policy number, vehicle details, coverage type, deductible, and accident description. The agent verifies eligibility before proceeding.
3. **Photos** (Step 2) — Guided upload with a required-angles checklist (front, rear, driver side, passenger side, close-up, VIN plate). This ensures the AI model receives complete visual coverage.
4. **AI Analysis** (Step 3) — One-click "Run AI Analysis" triggers a simulated computer vision pipeline with 5 visible processing stages (uploading → detecting → classifying → cross-referencing repair databases → generating report). Live elapsed timer shows ~3 seconds. Results display per-area damage findings with part, type, severity bar, confidence ring, and repair action.
5. **Agent Review** (Step 4) — The human checkpoint. Each AI finding must be individually **confirmed** or **flagged**. A "View Detection" button opens the photo with the AI's bounding box overlay — but the photo is shown *without* the overlay first (anchoring bias safeguard). Flagged items are escalated. Agent adds freeform notes. At least one finding must be confirmed to proceed.
6. **Cost Estimate** (Step 5) — AI-generated line-item breakdown (parts + labor per damage area). The agent can **edit any value**, **add new line items**, and **remove incorrect ones**. A confidence range bar (±15%) visualizes estimate uncertainty. Modified estimates are marked "Agent Adjusted."
7. **Approval** (Step 6) — As agent: review the full summary and submit for senior review. Status transitions to `pending_approval`.

**Senior Adjuster path:**

1. Toggle role to "Sr. Adjuster" in the header.
2. Open a `pending_approval` claim. Navigate to the Approval step.
3. Review the full case file: AI damage findings (severity-coded chips), agent notes, AI recommendation.
4. **Approve** with optional comments, or **Reject** with a mandatory reason (5 predefined options: insufficient documentation, damage inconsistent with incident, pre-existing damage suspected, coverage exclusion, requires in-person inspection) and mandatory detail text.
5. **Post-decision handoff**: Export Report (print), Send Authorization to repair shop (approved), or Return to Agent for amendment (rejected). Toast confirmation on each action.

### Status Lifecycle

```
new → in_review → assessed → pending_approval → approved
                                               → rejected
```

Each transition is triggered by a specific user action, not by the AI — the human drives every state change.

---

## Prototype: Effective Use of the AI Coding Tool

The entire prototype was built using **Antigravity** (Google DeepMind's agentic AI coding assistant) within a single working session. Specific ways the tool was leveraged:

- **Full-stack scaffolding** — React + Vite project initialized, routed, and deployed to Vercel through Antigravity commands. No manual configuration.
- **Component generation** — All 8 components (AIAssessment, AgentReview, ApprovalPanel, CostEstimate, PhotoGallery, MetricsBanner, StatusBadge, plus the NewClaimModal) were authored and iterated through AI-assisted pair programming.
- **Design system** — An 82KB vanilla CSS design system with glassmorphism, gradient effects, micro-animations, and dark/light tokens — generated and refined iteratively through the AI tool rather than hand-coded from scratch.
- **AI service layer** — The simulated AI pipeline (`aiService.js`) with realistic damage templates, confidence scores, bounding box coordinates, and staged processing delays was designed through conversation with the tool, matching a production-ready output schema.
- **Iterative debugging** — Layout issues (table column alignment, responsive spacing) were diagnosed and fixed through the AI tool's ability to read rendered output, trace CSS inheritance chains, and apply targeted fixes.
- **Deployment pipeline** — Git commits, pushes, and Vercel deployment triggered directly from the AI tool's terminal.

The prototype demonstrates that an AI coding tool can produce a polished, production-quality interactive demo — not just a wireframe — within the time constraints of a take-home assignment.

---

## Prototype: Demonstration of AI Integration Potential

The prototype's AI integration is *structurally production-ready* even though it uses simulated responses:

| Integration Point | Prototype Implementation | Production Path |
|---|---|---|
| **Damage detection** | 3 damage templates with part-specific findings, bounding box coordinates, confidence scores (0.78–0.97) | Swap `aiService.js` for API call to a multimodal vision model (e.g., GPT-4o Vision). Output schema is identical. |
| **Severity classification** | 3-tier classification (Minor / Moderate / Severe) with color-coded UI | Model returns severity per damage area; UI is already wired. |
| **Cost estimation** | Parts + labor per damage area, cross-referenced with templates. ±15% confidence range. | Connect to real repair cost databases with regional labor rates. |
| **Recommendation engine** | Rule-based: structural damage → total loss eval; moderate → standard repair; minor → quick turnaround | LLM-generated natural language recommendations based on full assessment context. |
| **Processing pipeline** | 5-stage progress with real elapsed timing | Map to actual model inference stages. Progress hooks are already abstracted. |

**Key design decision**: The AI service layer (`aiService.js`) is cleanly separated from all UI components. Replacing the mock with a real API requires changing *one file* — no UI refactoring needed. The 262-line service file has clear documentation explaining what each function would do in production.

**Bounding box coordinates** are included in every damage finding (e.g., `{ x: 15, y: 55, w: 45, h: 30 }`), demonstrating that the UI is ready for real computer vision output — including the annotation overlay in the Agent Review step.

---

## PRD: Clarity and Conciseness of Writing

The PRD is 112 lines. Every section earns its space:

| Section | Lines | Purpose |
|---------|-------|---------|
| Vision & Problem Statement | 18 | Three quantified failure modes. One-line product thesis. Scope diagram. |
| User Stories | 22 | 6 P0 stories (minimum end-to-end loop), 3 P1 stories, explicit prioritization rationale. |
| Key Features & AI Integration | 17 | Model choice justified with tradeoffs. Human-AI verification loop detailed. |
| Success Metrics | 12 | 8 tiered KPIs with baselines and 90-day targets. Kill criterion. |
| Eval Design | 3 | Eval set, scoring dimensions, ship/floor thresholds, subgroup equity floor, known gaps. |
| Risks | 8 | 4 risks with specific mitigations. |

**Writing principles applied:**
- No section restates another section.
- Every claim is quantified (e.g., "25–40 minutes," "15–30% variance," "$65–85/hr").
- Technical decisions include the tradeoff, not just the choice (e.g., "higher per-inference cost and latency (~3s vs ~0.5s); at current claims volume, acceptable").
- The scope diagram immediately shows what's *excluded*, not just what's included.

---

## PRD: Alignment with the Prototype Design

Every PRD feature maps 1:1 to a prototype component:

| PRD User Story | Prototype Implementation |
|---|---|
| US1: Upload photos with guided angle requirements | `PhotoGallery.jsx` — 6-angle checklist (front, rear, sides, close-up, VIN) |
| US2: Run AI analysis with real-time processing stages | `AIAssessment.jsx` — 5-stage progress animation with live timer |
| US3: View AI finding overlaid on source photo with bounding box | `AgentReview.jsx` → `AnnotationViewer` modal with bounding box overlay |
| US4: Confirm or flag individual findings | `AgentReview.jsx` — per-finding Confirm / Flag toggles with escalation warning |
| US5: Edit AI-generated cost estimates and add missing line items | `CostEstimate.jsx` — inline editing, add/remove rows, "Agent Adjusted" badge |
| US6: Sr. Adjuster reviews full case file, approves/rejects with logged reasoning | `ApprovalPanel.jsx` — case file view, structured rejection form, handoff actions |
| US7 (P1): Confidence scores and severity per damage area | `ConfidenceRing` SVG component + severity bars in `AIAssessment.jsx` |
| US8 (P1): Verify coverage type and deductible | Step 1 (Claim Info) shows coverage type and deductible |
| US9 (P1): Aggregate metrics | `MetricsBanner.jsx` — 5 KPI cards with improvement percentages |

**The scope diagram** in the PRD exactly matches the prototype's boundaries: the app begins *after* photos are submitted and ends *before* repair shop processes. No prototype feature leaks outside the scoped boundary.

---

## PRD: Strong Product Thinking and Prioritization

### Prioritization Framework

- **P0 (6 stories)** = the minimum loop to process one claim end-to-end. If any P0 feature is removed, you cannot process a single claim. This is the "what breaks if we cut it?" test.
- **P1 (3 stories)** = trust signals (confidence scores, coverage check, metrics) that improve the experience but don't block the core flow.
- **Post-MVP** = batch processing, model retraining from corrections, fraud detection — each explicitly deferred with reasoning (e.g., "fraud detection requires a separate labeled dataset and a different human workflow").

### Scoping Discipline

The PRD's scope diagram is the strongest evidence of product thinking. It explicitly maps:
- **Before** (assumed complete): policyholder reporting, photo submission
- **Our scope**: AI assessment, cost estimation, agent verification, senior approval
- **After** (out of scope): repair shop process, price negotiation, final inspection, claim closure

This shows understanding that shipping a useful product means *not* building the full claims lifecycle.

### Design Decisions with Tradeoffs

Every technical decision in the PRD includes what was *traded away*:
- Multimodal LLM over fine-tuned CV: "generalizes without labeled data at launch" — tradeoff: "higher per-inference cost"
- Human checkpoint required: "adds 2 minutes per claim" — tradeoff acknowledged but justified: "insurance is a regulated, high-stakes domain"
- Fraud detection deferred: "requires a separate labeled dataset and a different human workflow" — not just "we'll do it later"

---

## PRD: Relevant KPIs and Consideration of Ethical Concerns

### KPIs

8 metrics across 3 tiers, each with a baseline and 90-day target:

| Tier | What It Measures | Why It Matters |
|------|-----------------|----------------|
| **Primary** (3) | Assessment time, estimate variance, agent throughput | Direct business value — speed, consistency, capacity |
| **Quality** (2) | AI detection accuracy (agent confirm rate), false negative rate | Model trustworthiness — can agents rely on the AI? |
| **Business** (3) | Cost per assessment, dispute rate, adjuster review time | Unit economics and downstream impact |

**Kill criterion**: "If agent flag rate exceeds 25% after 30 days, we pause and retrain. Threshold set before launch, not after results." This is the most important sentence in the PRD — it shows willingness to stop shipping if quality fails, and it precommits to the bar before seeing data.

### Ethical Concerns

The PRD addresses four specific risks with mitigations:

1. **AI misses structural damage** → Mandatory agent review checkpoint; structural flags trigger in-person inspection.
2. **Agents rubber-stamp AI (automation complacency)** → "View Detection" required before confirm; audit sampling of confirm-without-viewing. *The prototype enforces this*: the AnnotationViewer shows the photo without the bounding box first, requiring an explicit click to reveal the AI's detection.
3. **Model accuracy degrades over time** → Quarterly eval refresh; drift detection via agent flag-rate monitoring.
4. **Incorrect estimates financially harm policyholders (bias across vehicle types)** → Per-subgroup eval floors (no vehicle category below 3.5); AI assessments carry disclaimer — final liability rests with the signing adjuster.

**Eval design** adds another ethical layer: the eval set is stratified by severity *and vehicle type*, with no subgroup allowed to fall below a floor score of 3.5. This directly addresses fairness concerns — the model can't perform well on average by performing poorly on specific vehicle types.

---

## PRD: How AI is Thoughtfully Incorporated — Human ↔ AI Interaction

This is the product's core design thesis: **the AI accelerates, the human decides.**

### The Verification Loop (3 layers)

```
Layer 1: AI generates findings → Agent reviews EACH finding individually (not batch-approve)
Layer 2: Agent edits cost estimate → "Agent Adjusted" badge visible to downstream reviewers
Layer 3: Senior Adjuster reviews full case file → Approve/Reject with logged reasoning
```

No AI output reaches a decision-maker without passing through two human checkpoints (agent + adjuster).

### Anti-Rubber-Stamping Design

The biggest risk in human-AI systems is that the human stops checking. ClaimsAI addresses this architecturally:

1. **View before confirm** — The agent must open the detection overlay to confirm a finding. They can't bulk-approve.
2. **Anchoring bias prevention** — The AnnotationViewer shows the photo *without* the AI overlay first. The agent forms their own impression before seeing the AI's detection. This is a deliberate UX choice to prevent cognitive anchoring.
3. **Flag with escalation** — Flagged findings trigger an escalation warning, creating a low-friction path for disagreement.
4. **Audit trail** — Every confirmation, flag, note, and rejection reason is logged with the reviewer's identity and timestamp.

### The Data Flywheel

Every human interaction generates training signal:
- **Confirm** = positive label for that detection
- **Flag** = negative label (model got it wrong)
- **Added line item** = false negative (model missed something)
- **Edited cost** = cost calibration data

At 40 claims/day, this generates ~3,600 labeled cases in 90 days — enough to fine-tune a domain-specific model and move off the general-purpose LLM.

### AI as Recommendation, Not Decision

The language throughout the prototype and PRD is deliberately suggestive, not directive:
- "AI **Recommendation**" — not "AI Decision"
- "**Recommend** detailed inspection" — not "Requires inspection"
- "**Consider** total loss evaluation" — not "Total loss declared"
- The agent's cost estimate is presented as editable by default, not locked
- The senior adjuster sees "Agent Case File" — the case belongs to the human, not the AI

This framing ensures the AI augments expertise rather than replacing judgment — critical in a regulated domain where a wrong estimate can financially harm a policyholder.

---

*This brief is a companion to the PRD and prototype. It does not repeat their content — it maps each evaluation criterion to the specific evidence that addresses it.*
