# ClaimsAI — Product Requirements Document

**Product**: AI-Powered Car Insurance Claims Assessment
**Author**: Mohamed Elsayed · **Date**: May 2026 · **Status**: DRAFT v1

---

## 1. Vision & Problem Statement

Car insurance claims processing is slow, inconsistent, and expensive. A single claim takes an adjuster **25–40 minutes** to review photos, assess damage, and generate an estimate. This creates three failures:

1. **Speed** — Policyholders wait 3–7 days for assessment, increasing churn and dissatisfaction.
2. **Consistency** — Two adjusters reviewing identical photos produce estimates varying 15–30%.
3. **Cost** — Senior adjusters at $65–85/hr spend most of their time on routine assessments.

**ClaimsAI** uses computer vision to analyze damage photos, classify severity, and generate cost estimates in under 5 seconds. It does not replace human judgment — every AI output passes through a **human verification checkpoint** before reaching a decision-maker.

**Users**: Claims Agents (process claims daily, verify AI findings, adjust estimates) and Senior Adjusters (approve/reject with full case context).

### Workflow Scope

```
BEFORE (assumed complete)          OUR SCOPE                           AFTER (out of scope)
─────────────────────────          ─────────                           ────────────────────
Policyholder reports claim    →    AI-assisted damage assessment   →   Repair shop process
Agent gathers policy info     →    AI-generated cost estimate      →   Price negotiation
Photos/videos submitted       →    Agent verification & adjustment →   Final inspection
                                   Senior adjuster approval/auth   →   Claim closure
```

---

## 2. User Stories

### P0 — Core Flow (MVP)
| # | As a... | I want to... | So that... |
|---|---------|-------------|------------|
| 1 | Claims Agent | upload damage photos with guided angle requirements | the AI receives complete visual coverage for accurate detection |
| 2 | Claims Agent | run AI analysis and see real-time processing stages | I understand what the model is doing and trust the output |
| 3 | Claims Agent | view each AI finding overlaid on the source photo with a bounding box | I verify against evidence, not rubber-stamp |
| 4 | Claims Agent | confirm or flag individual findings | I maintain oversight and can escalate edge cases |
| 5 | Claims Agent | edit AI-generated cost estimates and add missing line items | the estimate reflects my judgment, not just the model |
| 6 | Sr. Adjuster | review the full case file and approve or reject with logged reasoning | decisions have full audit trail and rejections return to the agent for amendment |

### P1 — Trust & Efficiency
| # | As a... | I want to... | So that... |
|---|---------|-------------|------------|
| 7 | Claims Agent | see confidence scores and severity per damage area | I focus review on low-confidence items first |
| 8 | Claims Agent | verify coverage type and deductible before processing | I don't waste time on ineligible claims |
| 9 | Ops Lead | see aggregate metrics (time, accuracy, volume) | I can measure ROI |

**Post-MVP backlog**: batch processing, model retraining from agent corrections, fraud signal detection.

**Prioritization rationale**: P0 features form the minimum loop to process one claim end-to-end (upload → AI assess → human verify → estimate → approve). P1 adds trust signals that reduce agent cognitive load but aren't blocking. Fraud detection is deferred because it requires a separate labeled dataset and a different human workflow (legal/compliance, not claims agents).

---

## 3. Key Features & AI Integration

### AI Damage Assessment

**Model approach**: Multimodal vision-language model (e.g., GPT-4o Vision). Chosen over traditional CV (ResNet/EfficientNet) because it generalizes across vehicle types without labeled training data at launch, handles zero-shot classification, and produces natural-language reasoning — making output interpretable for non-ML users. Tradeoff: higher per-inference cost and latency (~3s vs ~0.5s); at current claims volume, acceptable. *(The prototype mocks this AI pipeline with simulated responses matching the production output schema.)*

**Input**: 2–6 guided photos (front, rear, sides, close-up, VIN). **Output**: detected damage areas with bounding box coordinates, damage type/severity classification, confidence scores, and recommended repair actions. The model cross-references detections against make/model-specific repair cost databases to generate line-item estimates.

### Human-AI Verification Loop

This is the product's core design decision. The agent reviews each AI finding individually:

- **View Detection** — Opens the source photo with the AI's bounding box, severity label, and confidence. The agent sees *what* was detected and *where*.
- **Confirm / Flag** — Confirms validated findings; flags disagreements for escalation. Flagged items are logged for model improvement — every correction is a training data point.

Agents can edit cost estimates inline, add line items the AI missed, and remove incorrect ones. Modified estimates are marked "Agent Adjusted."

---

## 4. Success Metrics

| Tier | Metric | Baseline | Target (90-day) |
|------|--------|----------|-----------------|
| Primary | Avg. assessment time | 32 min | < 5 min |
| Primary | Estimate variance | ±25% | ±10% |
| Primary | Agent throughput | 12 claims/day | 40+/day |
| Quality | AI detection accuracy (agent confirm rate) | — | ≥ 92% |
| Quality | False negative rate (AI misses) | — | < 3% |
| Business | Cost per assessment | — | 40% reduction |
| Business | Dispute rate | — | 20% reduction |
| Business | Adjuster review time per claim | ~15 min | < 5 min |

**Kill criterion**: If agent flag rate exceeds **25%** after 30 days of production use, we pause deployment and retrain. Threshold set before launch, not after results.

---

## 5. Eval Design

**Eval set**: 1,000 historical claims stratified by severity and vehicle type. 200-case holdout unseen during development. Scored on four weighted dimensions: detection completeness (0.4), severity accuracy (0.3), cost estimate accuracy (0.2), false positive rate (0.1). **Ship threshold**: weighted ≥ 4.0. **Floor**: any dimension below 3.0 → stop and retrain. No vehicle subgroup below 3.5. **Not measured in v1**: fraud detection, video input performance, agent adoption. Full eval rubric available on request.

---

## 6. Risks

| Risk | Mitigation |
|------|------------|
| AI misses structural damage not visible in photos | Mandatory agent review checkpoint; structural flags trigger in-person inspection |
| Agents over-trust AI and rubber-stamp findings | "View Detection" required before confirm; audit sampling of confirm-without-viewing |
| Model accuracy degrades as new vehicle models release | Quarterly eval refresh; drift detection via agent flag-rate monitoring |
| Incorrect estimate financially harms policyholder (bias across vehicle types/damage patterns) | Per-subgroup eval floors (no vehicle category below 3.5); all AI assessments carry disclaimer — final liability rests with the signing adjuster |

---

*ClaimsAI cuts assessment time by 84% and eliminates estimate inconsistency — without removing the human judgment that makes the decision defensible.*
