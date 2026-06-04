# Interview Prep Guide — Scale AI PM Take-Home

*Your secret weapon. This is not a document you submit — it's what you internalize before you present.*

---

## Part 1: Presentation Script (7 minutes)

Rehearse this until it feels natural. Don't memorize word-for-word — memorize the *structure* and hit the key phrases.

---

### Opening — The Problem (60 seconds)

> "The assignment asks us to improve the car insurance claims assessment process. I started by understanding what actually happens today.
>
> A policyholder submits photos of their damaged car. Then a claims agent manually reviews every photo, estimates what's wrong, looks up repair costs, and writes an estimate. A senior adjuster then reviews that estimate before authorizing repairs.
>
> This manual process takes **25 to 40 minutes per claim**. Two adjusters reviewing the same photos produce estimates that vary by **15 to 30 percent**. And the people doing this routine work are senior adjusters billing at **65 to 85 dollars an hour**.
>
> The problem isn't that humans are bad at this — it's that the work is slow, inconsistent, and expensive for what it is."

**Why this works:** You're showing you understood the existing workflow before proposing a solution. The three numbers (time, variance, cost) give the panel something concrete to hold onto.

---

### Your Scope Decision (60 seconds)

> "Before I designed anything, I mapped the full claims lifecycle and drew a clear line around what we're building and what we're not.
>
> *(Show the scope diagram from the PRD)*
>
> Everything to the left — the policyholder reporting the accident, submitting photos — that already happens. We don't rebuild it. Everything to the right — repair shop negotiations, final inspections — that stays as-is too.
>
> Our product sits in the middle: **AI-assisted damage assessment, cost estimation, and approval**. That's the bottleneck, and that's where the money is."

**Why this works:** The panel sees hundreds of candidates who try to boil the ocean. You're showing you can scope.

---

### The Solution — What ClaimsAI Does (90 seconds)

> "ClaimsAI does three things:
>
> **First**, it analyzes damage photos using a multimodal vision model — think GPT-4o Vision. In about 3 seconds, it detects damage areas, classifies severity, and generates an itemized cost estimate. That replaces 32 minutes of manual work.
>
> **Second** — and this is the most important design decision — **every AI output goes through a human verification checkpoint**. The agent doesn't just see a verdict. They click 'View Detection' and see the actual photo with a bounding box showing exactly what the AI found and where. Then they confirm or flag each finding individually.
>
> **Third**, the agent can edit the cost estimate — adjust numbers, add line items the AI missed, remove incorrect ones. The final estimate reflects human judgment, not just the model.
>
> Then a senior adjuster reviews the full case file — AI findings, agent notes, flagged items — and approves or rejects with logged reasoning."

**Why this works:** You're walking through the exact flow your prototype demonstrates. The panel can follow along.

---

### The Human-AI Loop — Your Differentiator (60 seconds)

> "I want to zoom in on the human checkpoint because it's the core design decision.
>
> The easy version of this product would be: AI runs, agent clicks approve, done. But that creates a rubber-stamping problem — the agent trusts the AI because it's faster, not because they verified it.
>
> So I added a constraint: **you have to view the AI's detection on the photo before you can confirm it**. The agent sees the bounding box, the severity label, the confidence score. They're verifying against evidence, not just accepting a number.
>
> When an agent flags a finding, that becomes a labeled training data point. Every human correction makes the model better over time. The human isn't just a checkpoint — they're part of the feedback loop."

**Why this works:** This is what Scale AI evaluates on. They build AI products. They know the rubber-stamp problem. You're showing you designed *around* it.

---

### Metrics & Kill Criterion (60 seconds)

> "I defined success metrics at three levels: primary, quality, and business.
>
> The headline number: assessment time drops from **32 minutes to under 5**. Agent throughput goes from 12 claims per day to over 40.
>
> For AI quality, I'm targeting **92% detection accuracy** — meaning agents confirm 92 out of 100 AI findings. Below that, the override burden eats into the time savings.
>
> And I set a **kill criterion before launch**: if the agent flag rate exceeds 25% after 30 days, we pause and retrain. We don't tune-and-hope. We stop. That threshold was set before seeing any results — because if you set the bar after seeing the numbers, you don't have an eval, you have a story."

**Why this works:** The kill criterion line is the single most Scale AI-aligned thing you can say. It shows you think about failure before success.

---

### Close (30 seconds)

> "ClaimsAI cuts assessment time by 84% and eliminates estimate inconsistency — without removing the human judgment that makes the decision defensible.
>
> I'll open it up for questions."

---

## Part 2: Every Decision Explained in Plain Language

If they ask "why did you do X?", here's your answer for each major decision.

| Decision | Why | In your words |
|----------|-----|---------------|
| **Multimodal LLM over traditional CV** | Generalizes without needing thousands of labeled training images at launch. Also produces natural language reasoning, not just bounding boxes. | "We need to ship fast with zero labeled data. A fine-tuned ResNet would be more accurate eventually, but it needs months of labeling first. GPT-4o Vision gets us to 90%+ out of the box." |
| **Human checkpoint required** | Insurance is a regulated, high-stakes domain. An incorrect estimate can financially harm a policyholder. | "In insurance, the cost of a wrong AI decision is real — someone gets underpaid. The human checkpoint isn't a nice-to-have, it's a liability shield." |
| **View Detection before confirm** | Prevents rubber-stamping. Forces the agent to look at evidence. | "If the agent can confirm without looking at the photo, they will. We made viewing the detection mandatory so the confirmation is meaningful." |
| **Editable cost estimates** | The AI can't see everything (e.g., airbag deployment isn't visible in exterior photos). Agents need to add what the AI misses. | "Photos only show the outside. Structural damage, airbag deployment, fluid leaks — the agent has to add those. That's why the estimate is editable." |
| **Agent + Adjuster (two roles)** | Separation of duties. The person who builds the case shouldn't be the person who approves it. | "Same reason a bank teller can't approve their own loan. The agent builds the case, the adjuster validates it." |
| **Confidence scores shown to agent** | Low-confidence items need more scrutiny. High-confidence items can be reviewed faster. | "It tells the agent where to spend their time. If the AI is 95% confident, a quick look is fine. At 60%, look harder." |
| **Coverage check before processing** | Don't waste time assessing damage for a policy that doesn't cover it. | "First thing an agent checks in real life. If the policy doesn't cover collision damage, there's no point running the AI." |
| **Guided photo requirements** | The AI needs specific angles. Without guidance, agents upload random shots and the model underperforms. | "Garbage in, garbage out. We tell them exactly which angles we need so the model gets good input." |
| **Kill criterion at 25% flag rate** | If 1 in 4 AI findings is wrong, the agent spends more time correcting than the AI saves. Net negative. | "Below 75% accuracy, the tool makes agents slower, not faster. That's the line where we pause." |
| **Fraud detection deferred** | Different data, different model, different human workflow (legal/compliance, not claims agents). | "Fraud requires labeled fraud examples, which we don't have yet. It also needs a completely different review flow — compliance, not claims agents." |

---

## Part 3: Q&A Bank

### Product Questions

**Q: "How did you prioritize what went into MVP vs. what you cut?"**
> "P0 is the minimum loop to process one claim end-to-end: upload, AI assessment, human verification, cost estimate, approval. If any piece is missing, you can't process a single claim. P1 adds trust signals like confidence scores — useful but not blocking. Everything else requires different data or different users."

**Q: "What happens when an adjuster rejects a claim?"**
> "The claim returns to the agent with the adjuster's comments logged. The agent can amend the assessment and resubmit, or escalate to a human-only review track. Every action is timestamped."

**Q: "Why is this agent-facing and not policyholder-facing?"**
> "Two reasons. First, the assignment scopes us to the assessment and approval workflow — that's an internal process. Second, putting AI damage assessment in front of policyholders creates a trust and liability problem we're not ready to solve in v1. Agents are trained professionals; they can interpret AI output responsibly."

**Q: "How would you handle a totaled vehicle?"**
> "A total loss is a severity classification the model should detect — when damage exceeds 70-80% of the vehicle's value. In v1, the model flags it as 'Severe' and the agent escalates. In v2, we'd add a specific 'total loss' classification with a different downstream workflow — salvage assessment, not repair estimate."

**Q: "What's your go-to-market? How do you roll this out?"**
> "Pilot with one insurance company, one region, one vehicle category. Shadow mode first — AI runs alongside the manual process but doesn't replace it. We compare AI output to human output for 30 days. If the eval passes, we move to assisted mode where agents use the tool with the manual process as fallback. Full deployment only after the kill criterion is cleared."

**Q: "What would you build differently with unlimited resources?"**
> "Three things: First, a fine-tuned domain-specific model instead of a general multimodal LLM — higher accuracy, lower latency, lower cost per inference. Second, video input support — walk-around videos give much better coverage than 6 static photos. Third, a continuous learning pipeline where every agent correction automatically triggers model fine-tuning, not just quarterly retraining."

---

### Technical Questions

**Q: "Why GPT-4o Vision instead of a fine-tuned model?"**
> "Cold start problem. A fine-tuned model needs thousands of labeled car damage images before it's useful. GPT-4o Vision works out of the box — zero labeled data at launch. The tradeoff is 3 seconds per inference instead of half a second, and higher cost per call. At 40 claims per day, that's 2 extra minutes per agent — not a blocker. As we collect labeled data from agent corrections, we can fine-tune a purpose-built model later and bring down cost and latency."

**Q: "How do you measure false negatives? If the AI misses something and the agent also misses it, you'd never know."**
> "Two mechanisms. First, agent corrections — when an agent adds a line item the AI missed, we log it as a false negative. Second, a quarterly audit where a senior adjuster manually reviews 100 random cases end-to-end. That gives us both real-world data and ground truth."

**Q: "What's your annotation strategy for building training data?"**
> "Every agent interaction is an annotation event. Confirms are positive labels, flags are negative labels, added line items are false negatives. Over 90 days of production use at 40 claims per day, we generate roughly 3,600 labeled claims — enough to fine-tune a domain-specific model."

**Q: "How do you handle confidence calibration?"**
> "We track whether the model's confidence scores actually predict agent behavior. If the model says 95% confidence but agents flag that finding 20% of the time, the confidence is miscalibrated. We monitor the correlation between predicted confidence and actual confirmation rate weekly."

**Q: "What about data privacy with the photos?"**
> "All photos stay within the insurance company's infrastructure. In a production deployment, the AI runs either on-premise or in a private cloud environment. Photos are never used to train the base model — only the fine-tuned domain model with the customer's explicit agreement."

---

### Metrics Questions

**Q: "Why 92% as your accuracy target?"**
> "It's the threshold where the time savings still hold. Each AI finding takes an agent about 30 seconds to review. An override — when the agent flags and manually corrects — takes about 3 minutes. At 92% accuracy, 8% of findings need override, which adds roughly 1 minute per claim. Below 92%, the override burden starts eating into the 27-minute time savings. It's a net-positive calculation, not an arbitrary number."

**Q: "Your throughput target jumps from 12 to 40+ claims per day. That's 3x. How?"**
> "The math: today, a claim takes 32 minutes of active agent work. At 8 hours per shift, that's about 15 claims max. With ClaimsAI, AI assessment takes 3 seconds, agent verification takes about 2 minutes (30 seconds × 4-6 findings), and cost review takes 1 minute. Call it 4 minutes per claim. At 8 hours, that's 120 theoretically — I'm saying 40 because context-switching, breaks, and complex cases eat the rest. It's conservative."

**Q: "Your dispute rate metric — how do you attribute that to ClaimsAI specifically?"**
> "A/B comparison. Claims processed by ClaimsAI vs. a control group processed manually during the same period. Same agent pool, same claim mix. We measure dispute rate on each group separately. The 20% target is an estimate — the actual attribution comes from the controlled comparison."

---

### Edge Cases & Curveballs

**Q: "What if the AI is accurate but agents still don't trust it?"**
> "Trust is built through two things: transparency and track record. The bounding box overlay gives transparency — agents can see the AI's work, not just its verdict. Track record builds over time as agents see the AI being right consistently. In the short term, we'd also show agents their own stats — 'You confirmed 94% of AI findings this week' — so they realize they already trust it."

**Q: "What about adversarial cases — someone submitting fake damage photos?"**
> "That's fraud detection, which we explicitly deferred to post-MVP. But the human checkpoint is a natural defense — an experienced agent can often spot staged damage or pre-existing wear. In v2, we'd add a fraud signal layer that flags statistical anomalies — same damage pattern across multiple claims, photos with metadata inconsistencies, etc."

**Q: "What if repair costs vary significantly by region?"**
> "The cost database is region-specific — labor rates in Manhattan are different from rural Texas. The model's cost estimates cross-reference make, model, year, damage type, AND regional labor rate tables. Agent edits help us calibrate where the database is off."

**Q: "Who's liable if the AI misses structural damage and the policyholder is harmed?"**
> "The signing adjuster. Every AI assessment carries a disclaimer: 'AI-assisted assessment — final liability rests with the signing adjuster.' The AI is a tool, not a decision-maker. This is the same liability model as a doctor using a diagnostic AI — the AI suggests, the human decides and owns the outcome."

---

## Part 4: Scale AI Cultural Signals

Things to say (or weave in naturally) that show you understand how Scale AI thinks:

| Signal | When to use it |
|--------|---------------|
| "We defined the eval before we built the model" | When discussing metrics or quality |
| "Every human correction is a labeled data point" | When discussing the feedback loop |
| "We set the kill criterion before seeing results" | When discussing failure modes |
| "The annotation comes for free from the workflow" | When discussing training data strategy |
| "We measured what we're NOT measuring, not just what we are" | When discussing eval gaps |
| "Shadow mode first, assisted mode second, full deployment third" | When discussing go-to-market |
| "The human isn't just a checkpoint — they're part of the training pipeline" | When discussing human-AI interaction |

---

## Part 5: Things You Don't Need to Know (But Might Worry About)

If they go deep technical and you don't know the answer, here's how to handle it:

> **"That's an engineering decision I'd work through with the MLE. My role is defining what the model needs to do and how we measure whether it's working — the architecture choice is a collaboration."**

This is an honest, PM-appropriate answer. You're not an engineer and they're not hiring you to be one. They're hiring you to:
1. Define the problem clearly ✅ (your PRD does this)
2. Design the human-AI interaction ✅ (your prototype shows this)
3. Know how to measure quality ✅ (your eval section proves this)
4. Make smart scope decisions ✅ (your prioritization shows this)

If they ask about something specific you don't know — transformer architectures, fine-tuning procedures, inference optimization — redirect to the *product* question underneath: "What matters from a product perspective is [latency / accuracy / cost], and here's how I'd measure whether we're hitting that bar."

---

## Quick Reference: Your 5 Strongest Points

If you get lost or nervous, come back to these. Any one of them is a strong answer to almost any question:

1. **"Every AI output passes through a human verification checkpoint."** — Your core design principle.
2. **"We set the kill criterion before seeing results."** — Shows eval rigor.
3. **"The agent sees the bounding box on the photo, not just a verdict."** — Shows you designed for trust.
4. **"Every agent correction is a training data point."** — Shows you understand the data flywheel.
5. **"We scoped to the assessment bottleneck, not the full claims lifecycle."** — Shows discipline.

When in doubt, say one of these. They're all true, they're all impressive, and they all answer the underlying question: *does this person think like a PM who ships reliable AI?*
