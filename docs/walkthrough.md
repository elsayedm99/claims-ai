# OS Enhancements — Walkthrough

Summary of all changes made to the PersonalOS based on learnings from the ClaimsAI project.

---

## 1. Project Visibility Framework

**Problem solved:** Enterprise/client projects with NDA-protected content could accidentally be committed to a public repo.

### Changes

| File | What changed |
|---|---|
| [.gitignore](file:///Users/mohamedelsayed/Desktop/OS/personal-os/.gitignore) | Added classification-aware section at the top. CONFIDENTIAL and RESTRICTED project dirs are auto-excluded when `/new-project` appends them. |
| [new-project.md](file:///Users/mohamedelsayed/Desktop/OS/personal-os/.claude/skills/new-project.md) | Added 6th intake question: **Visibility** (PUBLIC / INTERNAL / CONFIDENTIAL / RESTRICTED). Defaults to CONFIDENTIAL for client-facing projects. Auto-creates `.classify` marker file. Auto-appends gitignore rules for CONFIDENTIAL/RESTRICTED projects. Also generates the tech stack brief (template 31) for AI projects. |

### How it works

```
/new-project claims-ai
  → "What is the visibility classification for this project?"
  → User picks CONFIDENTIAL
  → .gitignore updated: Knowledge/claims-ai/ and Tasks/claims-ai/ excluded
  → .classify marker file created in project dir
  → User warned: "⚠️ Project files will not be committed to git."
```

---

## 2. New Field Manual Templates

Four new templates, filling gaps exposed during the ClaimsAI project:

| # | Template | File | Size | Purpose |
|---|---|---|---|---|
| 29 | Project Sanitization Checklist | [29-project-sanitization-checklist.md](file:///Users/mohamedelsayed/Desktop/OS/personal-os/Knowledge/field-manual-templates/29-project-sanitization-checklist.md) | 5.7KB | Pre-sharing content and credential scrub checklist |
| 30 | Project Presentation Brief | [30-project-presentation-brief.md](file:///Users/mohamedelsayed/Desktop/OS/personal-os/Knowledge/field-manual-templates/30-project-presentation-brief.md) | 7.5KB | Structured presentation prep: demo script, Q&A bank, evidence map |
| 31 | Tech Stack & AI Architecture Brief | [31-tech-stack-ai-architecture-brief.md](file:///Users/mohamedelsayed/Desktop/OS/personal-os/Knowledge/field-manual-templates/31-tech-stack-ai-architecture-brief.md) | 14.6KB | PM research artifact for understanding tech options. **NOT an eng spec.** Every section marked PROPOSED with Validation Status tracking. |
| 32 | Codebase Security Pre-Flight | [32-codebase-security-preflight.md](file:///Users/mohamedelsayed/Desktop/OS/personal-os/Knowledge/field-manual-templates/32-codebase-security-preflight.md) | 10.1KB | Technical security audit checklist with runnable terminal commands |

### Template 31 — Key design decision

Per user instruction, template 31 is explicitly framed as a **PM research tool**, not a source of truth:
- ⚠️ Disclaimer at the top: "PM research artifact — NOT an engineering specification"
- Every table has a "Validation Status" column: `PM Proposed → Eng Reviewed → Eng Approved → Decided`
- "How to use this document well" section at the bottom with before/during/after eng sync guidance
- Explicitly says: "Never present this document to a client or stakeholder as a technical specification"

---

## 3. `/security-check` Skill

| File | What it does |
|---|---|
| [security-check.md](file:///Users/mohamedelsayed/Desktop/OS/personal-os/.claude/skills/security-check.md) | One-command security audit: scans for API keys, env files, git history secrets, PII, sensitive files, dependency CVEs, and deployment misconfig. Outputs a pass/fail table with remediation. |
| [_trigger-router.md](file:///Users/mohamedelsayed/Desktop/OS/personal-os/.claude/skills/_trigger-router.md) | Two new trigger rows: (1) auto-runs `/security-check` when user mentions security audit, and (2) auto-runs before sharing a CONFIDENTIAL project externally. |
| [AGENTS.md](file:///Users/mohamedelsayed/Desktop/OS/personal-os/AGENTS.md) | Added `/security-check` to the skills reference list. |

### Usage

```
/security-check /path/to/project

→ Scans 7 categories
→ Outputs structured pass/fail table
→ For any FAIL: exact file, line, pattern + how to fix
→ Ends with ✅ or ⛔ verdict
```

---

## Files Modified (6)

| File | Type |
|---|---|
| [.gitignore](file:///Users/mohamedelsayed/Desktop/OS/personal-os/.gitignore) | Modified — added classification section |
| [new-project.md](file:///Users/mohamedelsayed/Desktop/OS/personal-os/.claude/skills/new-project.md) | Modified — added visibility question + auto-gitignore |
| [_trigger-router.md](file:///Users/mohamedelsayed/Desktop/OS/personal-os/.claude/skills/_trigger-router.md) | Modified — added security-check triggers |
| [AGENTS.md](file:///Users/mohamedelsayed/Desktop/OS/personal-os/AGENTS.md) | Modified — added skill reference |

## Files Created (5)

| File | Type |
|---|---|
| [29-project-sanitization-checklist.md](file:///Users/mohamedelsayed/Desktop/OS/personal-os/Knowledge/field-manual-templates/29-project-sanitization-checklist.md) | New template |
| [30-project-presentation-brief.md](file:///Users/mohamedelsayed/Desktop/OS/personal-os/Knowledge/field-manual-templates/30-project-presentation-brief.md) | New template |
| [31-tech-stack-ai-architecture-brief.md](file:///Users/mohamedelsayed/Desktop/OS/personal-os/Knowledge/field-manual-templates/31-tech-stack-ai-architecture-brief.md) | New template |
| [32-codebase-security-preflight.md](file:///Users/mohamedelsayed/Desktop/OS/personal-os/Knowledge/field-manual-templates/32-codebase-security-preflight.md) | New template |
| [security-check.md](file:///Users/mohamedelsayed/Desktop/OS/personal-os/.claude/skills/security-check.md) | New skill |
