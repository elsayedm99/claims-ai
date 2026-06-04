# ClaimsAI — Evaluation Proposal

**How we measure whether the AI is working, and when we stop shipping if it isn't.**

---

## 1. What We're Evaluating

ClaimsAI's AI system produces four distinct outputs. Each requires its own evaluation approach because they fail differently.

| Capability | What the model outputs | How it fails | Who gets hurt |
|---|---|---|---|
| **Damage detection** | Identified damage areas with bounding boxes | Misses a damaged area (false negative) or hallucates one (false positive) | Policyholder (underpaid) or insurer (overpaid) |
| **Severity classification** | Minor / Moderate / Severe per area | Underclassifies (Severe → Minor) or overclassifies | Policyholder (underrepaired) or insurer (overauthorized) |
| **Cost estimation** | Dollar amount per line item (parts + labor) | Estimate too low (policyholder underpaid) or too high (insurer overpays) | Both parties, plus trust in the system |
| **Recommendation** | Natural language repair/inspection guidance | Inappropriate recommendation (e.g., "standard repair" for structural damage) | Policyholder safety; insurer liability |

These are evaluated separately because a model can detect damage correctly but classify severity wrong, or classify severity correctly but estimate cost wrong. A composite score alone would hide which capability is failing.

---

## 2. Eval Set Construction

### 2.1 Benchmark Set

**Size**: 1,000 historical claims.

**Why 1,000**: At 4 damage areas per claim average, this gives us ~4,000 individual detection evaluations. For a 5-category severity classification, we need ~200 examples per category to achieve a ±5% confidence interval at 95% confidence. 1,000 claims, stratified properly, gets us there.

**Stratification axes** (every cell in the matrix must have ≥30 cases):

| Axis | Categories | Why it matters |
|---|---|---|
| **Severity** | Minor, Moderate, Severe | Model must perform across the full range, not just the easy middle |
| **Vehicle type** | Sedan, SUV/Truck, Luxury/Exotic, EV | Body panel geometry, part costs, and repair complexity vary dramatically |
| **Damage location** | Front, Rear, Side, Multi-area | Front impacts have different part density than side impacts |
| **Photo quality** | Good (well-lit, clear), Degraded (dark, blurry, partial) | Real-world photos are messy; eval must reflect this |

**Holdout**: 200 cases (20%) are reserved as a true holdout — never seen during development, tuning, or debugging. These 200 are the final ship-gate evaluation. The remaining 800 are used for development iteration.

**Refresh**: The eval set is rebuilt quarterly from the most recent 90 days of production claims, re-stratified, and re-annotated. Stale eval sets produce stale confidence.

### 2.2 Ground Truth Annotation

Ground truth for car damage assessment is expensive to produce. Our annotation pipeline:

**Annotators**: Licensed adjusters with 5+ years of experience. Not junior agents — the ground truth must reflect expert judgment.

**Per-claim annotation task**:
1. Review all photos. Identify every damage area (part, location, bounding box).
2. Classify each area: damage type + severity.
3. Provide a reference cost estimate using the same repair cost database the AI uses.
4. Write a reference recommendation.

**Multi-annotator agreement**: Every claim is annotated by 2 independent annotators. Disagreements on severity or detection are resolved by a third senior annotator. We report inter-annotator agreement (Cohen's κ) alongside model scores — if humans disagree 20% of the time, a model that matches one human 80% of the time is performing at human parity.

**Annotation tool requirements**: Bounding box drawing on photos, structured severity/type dropdowns (not freeform), cost entry matched to the repair database schema.

---

## 3. Scoring Rubric

Each AI output is scored on a 1–5 scale per dimension. The rubric must be specific enough that two evaluators score the same output identically.

### 3.1 Detection Completeness (Weight: 0.4)

*Does the model find all the damage that's actually there?*

| Score | Definition |
|---|---|
| **5** | All damage areas identified. No false negatives. Bounding boxes tightly enclose the damage. |
| **4** | All significant damage areas identified. Minor cosmetic damage (small scratches, chips) may be missed. No structural or safety-relevant damage missed. |
| **3** | Most damage areas identified (≥75%). One moderate-severity area missed, OR bounding boxes are loose but still usable. |
| **2** | Multiple damage areas missed (25–50%). At least one area the agent would need to add manually. |
| **1** | Majority of damage missed, or critical structural damage not detected. Assessment is unreliable. |

**Why highest weight**: A missed detection is the hardest failure for a human to catch. The agent is reviewing what the AI *found* — they're not systematically scanning for what it *missed*. False negatives are more dangerous than false positives in this domain.

### 3.2 Severity Accuracy (Weight: 0.3)

*When the model detects damage, does it classify severity correctly?*

| Score | Definition |
|---|---|
| **5** | All severity classifications match ground truth exactly. |
| **4** | Severity correct within one level (e.g., Minor→Moderate is a near-miss, not a failure). No Severe→Minor or Minor→Severe misclassifications. |
| **3** | Most classifications correct (≥75%). One two-level jump (Severe→Minor or Minor→Severe). |
| **2** | Multiple misclassifications. Systematic bias (e.g., always underclassifies). |
| **1** | Severity classifications are unreliable. Would mislead the agent. |

**Asymmetric concern**: Underclassification (Severe→Minor) is worse than overclassification (Minor→Severe). A missed severity means the repair is underscoped and the policyholder is underpaid. We track directional error separately.

### 3.3 Cost Estimate Accuracy (Weight: 0.2)

*How close is the AI's dollar estimate to the ground truth?*

| Score | Definition |
|---|---|
| **5** | Total estimate within ±5% of ground truth. All line items within ±10%. |
| **4** | Total estimate within ±10%. No individual line item off by more than ±20%. |
| **3** | Total estimate within ±15%. One or two line items significantly off but total is reasonable. |
| **2** | Total estimate off by 15–30%. Agent would need to substantially rework the estimate. |
| **1** | Total estimate off by >30%. Estimate is not useful as a starting point. |

**Why lowest weight among the first three**: The cost estimate is the most editable output — agents can (and are expected to) adjust it. A wrong detection can't be fixed by editing a number.

### 3.4 False Positive Rate (Weight: 0.1)

*How often does the model "detect" damage that isn't there?*

| Score | Definition |
|---|---|
| **5** | Zero false positives. Every detection corresponds to real damage. |
| **4** | ≤1 false positive per claim. Agent can quickly dismiss it. |
| **3** | 2 false positives per claim. Adds review burden but doesn't undermine trust. |
| **2** | 3+ false positives per claim. Agent starts ignoring findings. |
| **1** | More false positives than true positives. System is noise. |

**Why lowest weight**: False positives are annoying but safe — the agent reviews and removes them. False negatives are dangerous because they're invisible. However, a high false positive rate erodes agent trust over time, which is why it's still measured.

### 3.5 Worked Example

> **Claim**: 2022 Toyota Camry, front-end collision. 4 photos.
>
> **Ground truth**: Front bumper (Severe dent, replace, $970), Hood (Moderate scratch, repaint, $400), Left headlight (Severe crack, replace, $630), Grille (Moderate crack, replace, $310). Total: $2,310.
>
> **Model output**: Front bumper (Moderate dent, $650), Hood (Minor scratch, $400), Left headlight (Severe crack, $630). Grille not detected. Total: $1,680.
>
> **Scoring**:
> - Detection: **3** — Grille missed (1 of 4 areas, moderate severity). 75% detection rate.
> - Severity: **3** — Bumper underclassified by 1 level, Hood underclassified by 1 level. No 2-level jumps but systematic underclassification.
> - Cost: **2** — Total off by 27% ($1,680 vs $2,310). Primarily driven by missing the grille entirely.
> - False positives: **5** — No false detections.
> - **Weighted composite**: (3×0.4) + (3×0.3) + (2×0.2) + (5×0.1) = 1.2 + 0.9 + 0.4 + 0.5 = **3.0**
> - **Verdict**: Below ship threshold (4.0). Detection and severity scores need improvement before this model ships.

---

## 4. Ship / Fail Decision Framework

### 4.1 Thresholds

| Gate | Rule | Consequence |
|---|---|---|
| **Ship threshold** | Weighted composite ≥ 4.0 across the full eval set | Model can be deployed to production |
| **Per-dimension floor** | No single dimension below 3.0 | A model with 5.0 detection but 2.5 cost accuracy doesn't ship |
| **Subgroup equity floor** | No vehicle-type subgroup below 3.5 composite | The model can't work great on sedans but fail on trucks |
| **Regression gate** | New model version must score ≥ previous version on every dimension | Prevents trading one capability for another |

### 4.2 Kill Criterion (Production)

**If the agent flag rate exceeds 25% after 30 days of production use, we pause deployment and retrain.**

Why 25%: Each flagged finding costs the agent ~3 minutes (vs. 30 seconds for a confirmed finding). At 25% flag rate with 4 findings per claim, that's 1 flagged finding per claim → 3 extra minutes → the AI is still net-positive on time (saving ~25 minutes). Above 25%, the override burden starts eating into time savings. At 33%, we're break-even. At 50%, the tool makes agents slower.

This threshold is set **before launch, not after seeing results**. If we set it after, we'd rationalize whatever number we saw.

### 4.3 Decision Matrix

```
                        Composite ≥ 4.0          Composite < 4.0
                     ┌─────────────────────┬─────────────────────┐
  All floors pass    │      ✅ SHIP         │    ❌ RETRAIN       │
                     ├─────────────────────┼─────────────────────┤
  Any floor fails    │    ❌ FIX + RE-EVAL  │    ❌ RETRAIN       │
                     └─────────────────────┴─────────────────────┘
```

There is no "ship with known floor failures" option. The floor exists to prevent exactly that rationalization.

---

## 5. Online Evaluation (In-Production Monitoring)

Offline eval tells us the model is *good enough to ship*. Online eval tells us whether it *stays good enough*.

### 5.1 Agent Behavioral Signals

In production, we don't have ground truth — we can't annotate every claim in real-time. Instead, we treat agent behavior as a proxy signal.

| Signal | What it measures | Healthy range | Alert threshold |
|---|---|---|---|
| **Confirm rate** | % of AI findings the agent confirms | 85–95% | < 75% (model is wrong too often) or > 98% (agent is rubber-stamping) |
| **Flag rate** | % of AI findings the agent flags | 5–15% | > 25% (kill criterion) |
| **Edit delta** | Avg. % change between AI estimate and final agent estimate | 5–12% | > 20% (estimates are unreliable) |
| **Time-to-confirm** | Avg. seconds the agent spends reviewing a finding before confirming | 15–45s | < 5s (not reviewing) or > 90s (findings are confusing) |
| **Line items added** | Avg. line items the agent adds per claim | 0.2–0.8 | > 1.5 (model is missing too much) |
| **Line items removed** | Avg. line items the agent removes per claim | 0–0.3 | > 0.8 (too many false positives) |

**Both ends of the range matter.** A 99% confirm rate isn't good — it means agents aren't checking. A 2-second time-to-confirm means they're clicking without looking.

### 5.2 Confidence Calibration

The model reports confidence per finding (e.g., 0.87). A well-calibrated model's confidence should predict agent behavior:

- Findings with 0.95 confidence should be confirmed ~95% of the time
- Findings with 0.70 confidence should be confirmed ~70% of the time

We plot **predicted confidence vs. actual confirm rate** weekly. A perfectly calibrated model produces a diagonal line. A miscalibrated model shows a flat or inverted curve.

**Why this matters**: Agents use confidence scores to allocate attention. If the model says 95% but is wrong 30% of the time, the agent wastes time on the wrong findings.

### 5.3 Drift Detection

Model accuracy degrades over time for two reasons:
1. **Data drift** — New vehicle models, new materials, new damage patterns the model hasn't seen.
2. **Behavioral drift** — Agents change how they use the tool (shortcuts, workarounds).

**Detection method**: Track the 7-day rolling average of each signal in §5.1. Alert if any signal moves outside its healthy range for 3 consecutive days. Flag for investigation if the trend line shows monotonic degradation over 14 days, even within range.

**Response**: When drift is detected, pull the 50 most recent flagged claims. Have a senior adjuster re-annotate them as ground truth. Run the offline eval rubric on those 50 cases. If the score is below the ship threshold, initiate retraining.

---

## 6. Human-AI System Evaluation

Most AI evals measure the model in isolation. But ClaimsAI is a *system* — the output that matters is the human's final decision, not the model's raw output. We need to measure the combined system.

### 6.1 System-Level Metrics

| Metric | What it measures | How to measure |
|---|---|---|
| **End-to-end accuracy** | Does the final approved estimate match what the repair actually cost? | Compare approved estimate to repair shop invoice (available 30–60 days post-approval). |
| **Agent error rate WITH AI** vs. **WITHOUT AI** | Does the AI make agents better or worse? | A/B comparison: same agent pool, half use ClaimsAI, half process manually. Compare final estimate accuracy. |
| **Time-accuracy tradeoff** | Are agents faster AND more accurate, or just faster? | Plot assessment time vs. estimate accuracy for AI-assisted vs. manual claims. |

### 6.2 Anchoring Bias Audit

The biggest risk in human-AI systems: the human's judgment is distorted by seeing the AI's output first.

**Audit method** (quarterly, 100 claims):
1. Select 100 recent claims processed through ClaimsAI.
2. Have a fresh adjuster (who never saw the AI output) independently assess the same photos.
3. Compare the fresh adjuster's assessment to the AI-assisted agent's assessment.
4. If agreement between AI output and AI-assisted agent is >95%, but agreement between fresh adjuster and AI-assisted agent is <80%, anchoring bias is present — the agent is following the AI, not forming independent judgment.

**Response**: If anchoring is detected, strengthen the "view photo first" safeguard in the AnnotationViewer. Consider adding randomized "challenge" findings where the AI deliberately includes a questionable detection to test whether the agent catches it.

### 6.3 Automation Complacency Detection

**Signal**: Track the correlation between `time-to-confirm` and `confidence score`.

- **Healthy pattern**: Agents spend less time on high-confidence findings, more time on low-confidence findings (they're using confidence as a triage signal).
- **Complacency pattern**: Agents spend the same (short) time regardless of confidence (they're confirming everything without checking).
- **Over-reliance pattern**: Agents spend more time on LOW confidence findings but still confirm them at the same rate as high-confidence findings (they're second-guessing themselves but defaulting to the AI).

Report this correlation monthly. If the complacency pattern emerges, consider UX interventions: randomized mandatory "explain your confirmation" prompts, or surfacing the agent's own historical flag rate to make them aware of their reviewing behavior.

---

## 7. Eval Cadence and Governance

### 7.1 Schedule

| When | What | Who decides |
|---|---|---|
| **Pre-launch** | Full 1,000-case offline eval. Ship/fail decision. | PM + ML Lead |
| **Day 1–30** (burn-in) | Daily monitoring of all §5.1 signals. Weekly calibration check. | ML Lead (auto-alerts to PM) |
| **Day 30** | Kill criterion check. If flag rate > 25%, pause. | PM (pre-committed) |
| **Monthly** | Anchoring bias audit (100 claims). Complacency pattern check. | PM + Ops Lead |
| **Quarterly** | Full eval set rebuild. Re-annotate 1,000 new claims. Regression gate for any model updates. End-to-end accuracy check against repair invoices. | PM + ML Lead + Sr. Adjuster |

### 7.2 What We Are NOT Measuring in v1

Documenting what's excluded is as important as documenting what's included. Unmeasured dimensions are unknown risks.

| Not measured | Why deferred | When to add |
|---|---|---|
| **Fraud detection accuracy** | No labeled fraud dataset. Different human workflow (legal/compliance). | v2, after 6 months of production data collection |
| **Video input performance** | v1 is photo-only. Video parsing adds a different model capability. | v2, when video upload is supported |
| **Multi-vehicle incident accuracy** | Eval set is single-vehicle only. Multi-vehicle adds attribution complexity. | v2, after single-vehicle performance is validated |
| **Agent adoption / satisfaction** | Qualitative, not measurable with the current rubric. | Separate user research track, post-launch |
| **Regional cost accuracy** | Eval set uses a single region's cost database. Regional variation not yet tested. | v1.1, when we expand beyond pilot region |
| **Non-English photo metadata** | Eval photos are all English-context. International markets have different signage, plate formats. | v3, international expansion |

---

*The eval is the product. If we can't measure whether the AI is working, we can't ship it. If we can't measure whether it's still working, we can't keep it running.*
