# AI Development Workflow

Last updated: 2026-09-29

## Purpose

This file defines a token-efficient, risk-aware workflow for AI-assisted development in Codex.

The workflow optimizes five things:

1. **Model routing** — use the lowest-cost capable model.
2. **Effort routing** — use the lowest reasoning effort that reliably completes the task.
3. **Context routing** — read only the files and evidence needed for the current task.
4. **Validation routing** — validate according to risk instead of blindly running everything.
5. **Human/AI routing** — let the developer perform deterministic, low-reasoning work when that saves AI tokens.

The governing principle is:

> **Right model → right effort → right context → smallest complete change → risk-based validation.**

The objective is NOT to minimize tokens at all costs.

The objective is to minimize **wasted** tokens while keeping important code, financial logic, authentication, persistence, migrations, and security changes trustworthy.

---

# 1. Project Development Queue

The project-specific development queue lives in:

`docs/project-records/PROJECT_TASKS.md`

After bootstrap, this file should answer:

- What task is next?
- Which Codex model should I select?
- Which effort should I select?
- What files should Codex inspect?
- What should remain untouched?
- What validation is required?
- Should validation be run by Codex, the developer, or both?
- What exact implementation prompt should I paste?

The developer should normally open `docs/project-records/PROJECT_TASKS.md`, find the first `READY`
task, select the recommended Codex setting, and copy only that task's
`Implementation Prompt`. If none is `READY`, follow the empty-queue rule in
Section 25.

---

# 2. Sources of Truth

When available, use these sources in this order:

1. `AGENTS.md`
2. `docs/project-records/AI_DEVELOPMENT_WORKFLOW_V2.md` for workflow and routing rules
3. `REQUIREMENTS.md`
4. `docs/project-records/DECISION.md`
5. `SESSION.md` when present
6. `docs/project-records/PROJECT_TASKS.md`
7. `MENTORING.md`
8. Project history/operational evidence such as `docs/project-records/MODERNIZATION_WORKLOG.md`
9. Relevant architecture, security, development, testing, and deployment docs
10. Relevant source code and tests

Do not repeatedly reconstruct project state from the whole repository.

Do not reopen decisions already recorded in `docs/project-records/DECISION.md` unless current evidence shows they are invalid.

---

# 3. Current Codex Model Policy

## Primary models

Use the GPT-6 family for all newly created or re-routed work:

- `GPT-6 Luna` for economical, predictable execution,
- `GPT-6 Sol` as the balanced software-engineering default,
- `GPT-6 Astra` only for genuinely difficult unresolved reasoning.

Every active/future task must name exact phase-specific model and effort
combinations. Use `Low` or `Medium` normally; `High`, `Extra High`, and `Max`
are exceptional and require a concrete justification.

Historical routing on `DONE` or `CANCELLED` tasks is an execution record. Do
not rewrite it when the model policy changes.

## Availability fallback

Fallback is availability-based, not history-based:

```text
GPT-6 Luna unavailable → GPT-5.6 Luna
GPT-6 Sol unavailable  → GPT-5.6 Sol
```

Do not route new work to GPT-5.6 merely because completed tasks used it. There
is no routine Astra fallback; if Astra is unavailable, continue with targeted
Sol analysis or stop and record the unresolved escalation need.

---

# 4. Model Roles

## GPT-6 Luna

Use aggressively for clear, bounded, predictable work: localized changes,
established CRUD patterns, straightforward UI/styling, tests, documentation,
formatting, repetitive edits, simple transformations, and mechanical
refactors. Prefer `GPT-6 Luna · Low` for highly mechanical work and
`GPT-6 Luna · Medium` for ordinary scoped implementation.

Do not select Luna solely to save usage when correctness depends on unresolved
architecture, security boundaries, financial or transactional invariants,
migrations, concurrency, data integrity, or complex state transitions.

## GPT-6 Sol

Use as the primary engineering reasoning model and balanced default for task
planning, decomposition, multi-file coordination, non-trivial features,
business/domain logic, debugging, API/data-model coordination, stateful work,
schema changes, migrations, authentication/authorization, and repository-level
judgment.

Prefer `GPT-6 Sol · Low` for clearly specified implementation that still needs
strong coding judgment. Prefer `GPT-6 Sol · Medium` for architecture,
meaningful cross-layer work, high-integrity logic, feature decomposition,
security-sensitive work, migration reasoning, and difficult debugging.

## GPT-6 Astra

Treat Astra as an escalation model. Start with `GPT-6 Astra · Low` only for
fundamental architecture, difficult system-wide failures, competing
architectural constraints, security-critical redesign, subtle transactional or
concurrency correctness, unresolved migration/data-integrity problems, or
behavior that targeted Sol analysis cannot safely resolve.

Use `GPT-6 Astra · Medium` only if Low is insufficient. Use High or above only
exceptionally. A task's size, file count, or importance is not by itself a
reason to use Astra.

---

# 5. Recommended Model + Effort Matrix

| Task type | Reasoning / planning | Implementation | Validation / cleanup |
|---|---|---|---|
| Docs, formatting, tiny UI/style, known-behavior tests | `GPT-6 Luna · Low` | `GPT-6 Luna · Low` | `GPT-6 Luna · Low` |
| Mechanical multi-file edit or established pattern | `GPT-6 Luna · Low` | `GPT-6 Luna · Medium` | `GPT-6 Luna · Low` |
| Normal scoped feature with settled architecture | `GPT-6 Sol · Low` | `GPT-6 Luna · Medium` | `GPT-6 Luna · Low` |
| Moderately cross-layer implementation | `GPT-6 Sol · Medium` | `GPT-6 Sol · Low` | `GPT-6 Luna · Low` |
| Stateful/domain/API/data-model coordination | `GPT-6 Sol · Medium` | `GPT-6 Sol · Low/Medium` | `GPT-6 Sol · Low` |
| Financial, auth, security, migration, transactional, or data-integrity work | `GPT-6 Sol · Medium` | `GPT-6 Sol · Medium` | `GPT-6 Sol · Low/Medium` |
| Architecture or difficult diagnosis | `GPT-6 Sol · Medium` | Route after the decision | `GPT-6 Sol · Low` |
| Unresolved architecture/security/transactional conflict after targeted Sol work | `GPT-6 Astra · Low`, then Medium if justified | De-escalate to Sol or Luna | `GPT-6 Sol · Low` |

When model switching is impractical, use `GPT-6 Sol · Low` or `Medium` as the
one-model fallback. Do not use Astra merely to avoid switching, and do not use
Luna as the fallback for high-integrity domain logic.

---

# 6. Effort Routing

## Low

Default for clearly specified implementation, routine debugging, predictable
edits, tests, documentation, and straightforward agent execution.

## Medium

Use for normal architectural reasoning, meaningful cross-layer/stateful/domain
work, difficult debugging, feature decomposition, migrations, security, and
important planning.

## High

Use only when Medium has proven insufficient or the reasoning is unusually
difficult. Record why.

## Extra High / Max

Exceptional only. Never assign automatically because a task is large.

---

# 7. Escalation and De-escalation

Start with Sol for difficult work; escalate only on evidence such as materially
conflicting requirements, an unresolved security/data-integrity invariant,
unknown behavior after targeted investigation, or repeated targeted failures
with different plausible causes.

If escalation requires manually changing the Codex model:

> **STOP and tell the developer the exact model + effort to switch to. Do not continue until the developer switches it.**

Separate reasoning from execution whenever that avoids carrying expensive
reasoning through routine work:

```text
Reasoning / planning: GPT-6 Sol · Medium
Escalation: GPT-6 Astra · Low, only if the documented constraints cannot be reconciled
Implementation after decision: GPT-6 Luna · Medium or GPT-6 Sol · Low
Validation / cleanup: GPT-6 Luna · Low
```

After Astra resolves a decision, de-escalate implementation, testing, cleanup,
and documentation to Sol or Luna whenever practical.

---

# 8. Token Hotspots

For a normal coding task, the largest token consumers are usually:

1. source/test inspection,
2. implementation planning,
3. code generation,
4. debugging failed validation,
5. browser/manual acceptance when delegated to the agent.

A successful validation command itself is usually inexpensive compared with the reasoning needed to diagnose a failure.

Therefore:

> **Do not optimize by deleting validation first. Optimize by preventing unnecessary inspection, repeated planning, oversized implementation scope, and AI-driven green-path validation.**

---

# 9. Risk-Based Validation Policy

Validation is NOT all-or-nothing.

Each task must receive a `Validation Tier`.

## V0 — No automated validation required

Allowed only for changes that cannot change application behavior.

Examples:

- prose-only documentation,
- comments,
- spelling,
- non-functional README changes.

Recommended check:

```text
Developer manually reviews diff.
Optional: git diff --check
```

Do NOT use V0 for executable configuration, dependency files, code, schemas, auth, persistence, or financial logic.

---

## V1 — Lightweight validation

Use for low-risk local changes.

Examples:

- CSS-only changes,
- simple presentation-only UI changes,
- small static content changes in application code,
- mechanical changes with no business logic.

Typical validation:

- relevant formatter/linter or type-check,
- build when appropriate,
- manual visual check.

Prefer the developer to run these commands manually.

---

## V2 — Targeted validation

Default for ordinary feature work.

Examples:

- CRUD,
- form validation,
- normal API/service work,
- state management,
- ordinary component logic,
- straightforward queries.

Typical validation:

- tests directly related to changed behavior,
- relevant type-check/lint,
- relevant build.

Do not automatically run the entire project test suite unless the change has broad reach.

---

## V3 — Full relevant validation

Required for high-risk changes.

Examples:

- financial calculations,
- payment scheduling,
- reconciliation,
- authentication/authorization,
- user ownership/UID scoping,
- persistence behavior,
- database/Firestore schema changes,
- migrations,
- data integrity,
- security,
- cross-layer changes that can silently corrupt behavior.

Typical validation:

1. targeted tests first,
2. full relevant backend/frontend suite,
3. build/type-check,
4. manual acceptance where appropriate.

Do not skip validation merely to save tokens.

---

## V4 — Acceptance / environment validation

Use when correctness depends on a real user session, browser, environment, external account, or cloud configuration.

Examples:

- Firebase sign-in,
- protected routes,
- responsive UI,
- browser console/network behavior,
- deployment,
- cloud credentials/configuration,
- external integration acceptance.

Prefer the **developer** to perform this validation manually unless agent-operated acceptance is specifically valuable.

---

# 10. Validation Executor

Every task must specify one:

- `DEVELOPER`
- `CODEX`
- `HYBRID`

## DEVELOPER

Preferred when validation is deterministic and easy to run locally.

Examples:

```text
npm run type-check
npm run lint
npm run build
pytest tests/test_specific_feature.py
git diff --check
git status --short
```

Workflow:

1. Codex implements the change.
2. Codex gives the exact validation commands.
3. Developer runs them.
4. If all pass, developer reports only:

```text
VALIDATION PASS — Txxx
```

5. If a command fails, developer provides only:
   - failing command,
   - first/root failure,
   - minimal relevant traceback/output.

Do NOT paste thousands of lines of logs.

This is the preferred token-saving mode for green-path validation.

---

## CODEX

Use when:

- validation requires Codex to iterate rapidly,
- the task is test-driven and failures are expected,
- manual execution would be significantly slower,
- the agent must inspect intermediate output to complete implementation.

Codex should still run targeted validation before broad validation.

---

## HYBRID

Recommended for higher-risk tasks.

Example:

```text
Codex:
- runs targeted tests while implementing.

Developer:
- runs full suite,
- browser acceptance,
- cloud/account checks,
- final smoke test.
```

This balances reliability and token savings.

---

# 11. Manual-First Token-Saving Policy

The following work should normally be performed manually by the developer when practical.

## A. Run successful deterministic validation

Let the developer run:

- unit tests,
- lint,
- type-check,
- build,
- formatting checks,
- `git diff --check`,
- `git status`.

If they pass, do not send the output back to Codex.

Send only:

```text
PASS
```

or:

```text
VALIDATION PASS — T015
```

---

## B. Browser/manual acceptance

Prefer the developer for:

- sign-in/sign-out,
- responsive layout inspection,
- basic visual verification,
- checking browser console,
- checking network requests,
- verifying route protection,
- confirming user-facing behavior.

Only ask Codex to inspect the browser when the visual/browser problem itself requires AI reasoning.

---

## C. Firebase/cloud/account operations

Keep these developer-operated:

- Firebase Console setup,
- credentials,
- secrets,
- account configuration,
- deployment approval,
- production data inspection,
- billing/account operations.

Codex can give instructions but should not repeatedly inspect these environments unless required.

---

## D. Git actions

Prefer the developer to perform:

```text
git status
git diff
git add
git commit
git push
```

Codex may suggest the commit message.

Do not ask Codex to reread a massive `git diff` when the developer can review it directly.

---

## E. Log reduction

Before giving a failure to Codex:

1. identify the failing command,
2. keep the first/root error,
3. include only nearby context,
4. omit repeated/cascading failures.

Bad:

```text
3,000 lines of terminal output
```

Good:

```text
Command:
pytest tests/test_payments.py

First failure:
test_reconcile_paid_debt

Error:
<20-50 relevant lines>
```

---

## F. Large dataset reduction

Do not give the model whole datasets to understand structure.

Prefer:

- schema,
- row count,
- null counts,
- representative rows,
- failing records,
- aggregate statistics.

---

## G. Visual checks

For ordinary UI changes, the developer can manually check:

- spacing,
- clipping,
- responsive behavior,
- text overflow,
- obvious alignment,
- whether scrolling is excessive.

Use AI vision only when critique, redesign judgment, or a difficult visual bug is the task.

---

# 12. Work Codex Should NOT Be Replaced For

Do not move high-value reasoning to the developer merely to save tokens if Codex is helping with:

- architecture,
- difficult debugging,
- unfamiliar code,
- financial correctness,
- auth/security reasoning,
- data-integrity design,
- migrations,
- complex refactors,
- generating regression tests after a bug,
- cross-layer root-cause analysis.

Token savings are useful only when they do not create substantially more human effort or future debugging cost.

---

# 13. Context Routing

Normal implementation should read only:

1. `docs/project-records/PROJECT_TASKS.md` Quick Queue,
2. the current `READY` task,
3. dependency details only when needed,
4. files listed under `Inspect First`,
5. additional files only when evidence requires expansion.

Do NOT reread the whole:

- repository,
- `docs/project-records/PROJECT_TASKS.md`,
- handoff,
- README,
- decisions log,
- test suite

for every task.

Start narrow.

Expand only when necessary.

---

# 14. Source Inspection Token Rules

Source/test inspection is often the largest avoidable input-token cost.

For every task:

- provide exact paths,
- prefer specific symbols/functions when known,
- inspect relevant tests before unrelated implementations,
- do not open generated/vendor/dependency files,
- do not inspect large files from top to bottom when a relevant function/section is known,
- use search to locate the symbol before reading surrounding code,
- stop inspecting once enough context exists to implement safely.

If the developer already knows the relevant files, record them in `docs/project-records/PROJECT_TASKS.md` before the implementation session.

---

# 15. Planning Token Rules

Reduce planning cost by storing in every task:

- Objective,
- Dependencies,
- Inspect First,
- Do Not Modify,
- Acceptance Criteria,
- Validation Tier,
- Validation Executor.

The implementation session should not redesign the task unless new evidence invalidates the plan.

For routine tasks:

> Plan briefly, then implement.

For architecture/debugging tasks:

> Spend tokens reasoning because incorrect decisions cause expensive rework.

---

# 16. Implementation Token Rules

During implementation:

- patch only necessary sections,
- do not rewrite entire files unnecessarily,
- do not refactor unrelated code,
- reuse existing project patterns,
- do not add dependencies unless necessary,
- do not generate long explanations while coding,
- do not implement future tasks,
- do not “clean up” unrelated issues discovered along the way.

Record unrelated discoveries as candidates. Create a future task only when the
evidence and approval rules in Section 25 are satisfied.

---

# 17. Debugging Token Rules

Failed validation can become the largest token sink.

Use this process:

```text
Failure
  ↓
Identify first/root failure
  ↓
Inspect only related code/test
  ↓
Form one or a small number of hypotheses
  ↓
Apply targeted fix
  ↓
Run targeted validation
  ↓
Broaden validation only after targeted pass
```

Do not:

```text
run full suite
→ get many errors
→ read every error
→ inspect whole repository
→ make broad speculative changes
```

Escalate model/effort only after the task's escalation condition is met.

---

# 18. Output Token Rules

Routine implementation output should contain only:

```text
Completed:
<1-3 sentences>

Files changed:
- ...

Validation:
<what Codex ran, or commands for developer to run>

Manual action:
<only if needed>

Commit:
<one concise message>

Task state:
<Txxx awaiting validation / done>
```

Do not request:

- line-by-line explanations,
- long architectural essays,
- repeated code dumps,
- full file contents,
- verbose summaries,

unless learning or review is the purpose of the task.

---

# 19. Task Size Rules

Each task should normally represent one meaningful Git commit.

Good:

- implement transaction deletion,
- add monthly aggregation,
- fix paid-debt reconciliation,
- add regression test for a confirmed bug,
- add one dashboard feature.

Too broad:

- finish frontend,
- build backend,
- improve everything.

Too narrow:

- add one import,
- rename one local variable,

unless the change is independently meaningful.

A large high-reasoning task should be decomposed when possible:

```text
T030 Diagnose financial mismatch
GPT-6 Sol · Medium (escalate to GPT-6 Astra · Low only if unresolved)

T031 Implement confirmed fix
GPT-6 Sol · Low

T032 Add regression test
GPT-6 Luna · Low
```

---

# 20. Required `docs/project-records/PROJECT_TASKS.md` Quick Queue

Use:

````md
| ID | Status | Model | Effort | Validation | Executor | Task | Depends On |
|---|---|---|---|---|---|---|---|
| T001 | DONE | GPT-5.6 Terra | Medium | V2 | HYBRID | historical task | — |
| T002 | READY | GPT-6 Luna | Medium | V1 | DEVELOPER | predictable implementation | T001 |
| T003 | PLANNED | GPT-6 Sol | Medium | V3 | HYBRID | high-integrity feature | T002 |
```

For new tasks, `Model` and `Effort` summarize the implementation route, or the
reasoning route when the task is decision-only. The task body remains
authoritative for phase-specific routing. Use `READY`, `PLANNED`, `BLOCKED`,
and `DEFERRED` as defined by the project ledger; normally only one task is
`READY`.

---

# 21. Required Task Structure

Every task in `docs/project-records/PROJECT_TASKS.md` must contain:

```md
# Txxx — Task Name

Status: `READY`

## Why This Task Exists

<explicit owner request, verified defect, approved finding/change, or other recognized evidence>

## Objective

<one outcome>

## Dependencies

- ...

## Relevant Requirements

- ...

## Relevant Decisions / ADRs

- ...

## Inspect First

- ...

## Likely Files to Modify

- ...

## Do Not Modify

- ...

## Acceptance Criteria

- [ ] ...

## Recommended Codex Routing

**Reasoning / Planning:** `GPT-6 Sol · Low`

Why: <one concise sentence>

**Implementation:** `GPT-6 Luna · Medium`

Why: <one concise sentence>

**Validation / Cleanup:** `GPT-6 Luna · Low`

**Escalate implementation to:** `GPT-6 Sol · Medium`

ONLY IF:

- <concrete condition>

**Escalate reasoning to:** `GPT-6 Astra · Low`

ONLY IF:

- <concrete condition after targeted Sol analysis>

**Routing confidence:** `HIGH | MEDIUM | LOW`

## Validation Strategy

**Tier:** `V2`

**Executor:** `DEVELOPER`

### Codex validation
- <only checks Codex should run, if any>

### Developer validation
- `<command>`
- `<command>`
- <manual check>

### Failure reporting
If validation fails, report only the failing command and first/root error.

## Implementation Prompt

```text
...
```

## Completion Notes

Pending.
````

---

# 22. Required Implementation Prompt

Every task's `Implementation Prompt` should use this structure:

```text
Read docs/project-records/AI_DEVELOPMENT_WORKFLOW_V2.md and obey the repository source-of-truth hierarchy.

Implement task <TASK_ID>: <TASK_NAME>.

CODEX ROUTING

Reasoning / Planning: <exact model> · <exact effort>
Implementation: <exact model> · <exact effort>
Validation / Cleanup: <exact model> · <exact effort>
Escalate implementation to: <exact model> · <exact effort>
ONLY IF: <specific condition>
Escalate reasoning to: <exact model> · <exact effort>
ONLY IF: <specific condition after targeted analysis>
Routing confidence: <HIGH | MEDIUM | LOW>

If escalation is required, STOP and tell me which Codex setting to select.
Do not continue until I switch the model.

OBJECTIVE

<one clear outcome>

CONTEXT BOUNDARY

Inspect first:
- <file>
- <file>

Do not scan the entire repository.
Expand context only when current evidence requires it.

REQUIREMENTS

- Follow the task's Relevant Requirements and Relevant Decisions / ADRs.
- ...

DO NOT MODIFY

- ...

ACCEPTANCE CRITERIA

- ...

VALIDATION ROUTING

Tier:
<V0 | V1 | V2 | V3 | V4>

Executor:
<DEVELOPER | CODEX | HYBRID>

If Executor is DEVELOPER:
- Do not run broad validation yourself.
- After implementation, give me only the exact commands/checks I need to run.
- Leave the task awaiting validation.
- Do not mark it DONE until I report validation success.

If Executor is CODEX:
- Run targeted validation first.
- Broaden only when required by the task's validation tier.

If Executor is HYBRID:
- Run the listed targeted checks.
- Give me the full-suite/manual acceptance steps to perform myself.

IMPLEMENTATION

1. Inspect only the listed context first.
2. Make the smallest complete change.
3. Preserve unrelated behavior.
4. Reuse existing patterns.
5. Add/update relevant tests where required.
6. Do not implement later tasks.

OUTPUT

Keep the final response concise:
- completed change,
- changed files,
- validation run or developer validation commands,
- manual actions,
- one suggested commit message,
- task status.

PROJECT STATE

If validation is already confirmed:
- mark this task DONE,
- promote the next unblocked task to READY,
- re-evaluate its exact model, effort, validation tier, and executor,
- update SESSION.md only when it exists or repository convention requires it,
- update docs/project-records/DECISION.md only for a genuine long-lived decision.

If developer validation is still pending:
- do NOT mark the task DONE,
- do NOT promote the next task,
- wait for validation confirmation.

Do not implement the next task.
Do not create a Git commit unless repository instructions explicitly permit it.
```

---

# 23. Validation Completion Prompt

When the developer manually runs validation and everything passes, use this tiny follow-up:

```text
VALIDATION PASS — <TASK_ID>.

Update project state only:
- mark <TASK_ID> DONE,
- add concise validation evidence,
- promote the next eligible task to READY,
- re-evaluate its model, effort, validation tier, and executor,
- update SESSION.md only when it exists or repository convention requires it,
- suggest one commit message.

Do not change application code.
Do not implement the next task.
```

This follow-up should be intentionally small.

---

# 24. Failed Validation Prompt

If manual validation fails, do NOT paste all output.

Use:

```text
VALIDATION FAIL — <TASK_ID>

Command:
<command>

First/root failure:
<minimal error/traceback>

Investigate only this failure first.
Do not rerun the full suite until the targeted failure passes.
Follow the task's escalation rule if the root cause exceeds the current model.
```

---

# 25. Empty Queue and Future-Work Intake

If no task is `READY` and the documented roadmap is complete, do not invent
work. Report that planned work is complete and stop unless there is evidence for
a new task.

When the owner requests a new feature, bug fix, redesign, migration,
enhancement, or optimization that no existing task covers, do not bypass the
task system. Before implementation:

1. Re-scan the relevant Markdown workflow instructions and current project
   state. Read `SESSION.md` only when present.
2. Read relevant requirements and decisions/ADRs. Use documentation first;
   inspect targeted code only when the task contract cannot be made safe
   without it.
3. Identify the latest task ID and continue the sequence without reusing or
   rewriting historical IDs.
4. Create one cohesive, independently testable task, or decompose meaningful
   phases such as decision, migration foundation, domain/backend, frontend,
   cutover, and acceptance. Do not create artificial microtasks.
5. Set the first executable task to `READY`, dependent work to `PLANNED`,
   externally constrained work to `BLOCKED`, and intentionally postponed work
   to `DEFERRED`.
6. Record requirements, decisions, dependencies, risks, boundaries, acceptance,
   validation, phase-specific routing, escalation conditions, routing
   confidence, and an implementation prompt before implementation begins.
7. Update only canonical state documents required by repository convention.
   Change `docs/project-records/DECISION.md` only for a genuine long-lived decision and requirements
   documentation only when an approved product requirement changes.

A task must originate from evidence: an explicit owner request, verified
defect, approved audit finding, approved architectural change, or another
repository-recognized reason. A completed queue is not permission to bypass
planning, and an empty queue is not a reason to manufacture work.

For a feature with a genuine unresolved architecture choice, prefer a decision
task routed to `GPT-6 Sol · Medium` with `GPT-6 Astra · Low` escalation, followed
by a separately routed implementation task. Keep them together when separation
would add process without meaningful clarity or safety.

---

# 26. Bootstrap Rule

If `docs/project-records/PROJECT_TASKS.md` does not exist, create it before normal development.

Recommended starting setting:

> `GPT-6 Sol · Medium`

The bootstrap is a high-leverage planning task. Spending more reasoning once can save repeated planning later.

During bootstrap:

1. read project documentation,
2. inspect repository structure,
3. inspect representative/architecturally important files only,
4. identify completed work,
5. identify remaining requirements,
6. identify blockers/dependencies,
7. create meaningful one-commit-sized tasks,
8. assign exact model,
9. assign exact effort,
10. assign validation tier,
11. assign validation executor,
12. define escalation,
13. create exact implementation prompt,
14. save `docs/project-records/PROJECT_TASKS.md`.

Do not implement application code during bootstrap.

---

# 27. Bootstrap Prompt

```text
Read docs/project-records/AI_DEVELOPMENT_WORKFLOW_V2.md and follow it exactly.

This is a ONE-TIME project planning/bootstrap task.

Use:
GPT-6 Sol · Medium

Do not implement application code.

Read available project documentation in this order:

AGENTS.md
REQUIREMENTS.md
docs/project-records/DECISION.md
SESSION.md
MENTORING.md

Then inspect the repository structure and only representative source files necessary to understand the current implementation.

Create or rebuild docs/project-records/PROJECT_TASKS.md.

For every task determine:

1. Status
2. Exact Codex model
3. Exact effort
4. Escalation condition
5. Dependencies
6. Inspect First files
7. Do Not Modify boundaries
8. Acceptance criteria
9. Validation Tier:
   - V0 no automated validation
   - V1 lightweight
   - V2 targeted
   - V3 full relevant validation
   - V4 real environment/manual acceptance
10. Validation Executor:
   - DEVELOPER
   - CODEX
   - HYBRID
11. Exact developer-run validation commands where appropriate
12. Exact copy-paste Implementation Prompt

MODEL POLICY

Prefer the GPT-6 family.

Use:
- GPT-6 Luna Low/Medium for predictable implementation, tests, docs, styling, and mechanical work.
- GPT-6 Sol Low for scoped work needing stronger engineering judgment.
- GPT-6 Sol Medium for planning, cross-layer/stateful/high-integrity work, security, migrations, and difficult debugging.
- GPT-6 Astra Low only after targeted Sol analysis cannot safely resolve a genuine architectural, security, transactional, concurrency, or data-integrity problem.
- GPT-6 Astra Medium only when Astra Low is insufficient; High or above is exceptional.

Use GPT-5.6 Luna or Sol only as the documented availability fallback.

VALIDATION POLICY

Do not skip validation across the board.

Scale it by risk.

Prefer DEVELOPER-run validation for deterministic green-path commands such as:
- pytest,
- npm test,
- type-check,
- lint,
- build,
- git diff --check,
- visual smoke checks.

Prefer HYBRID validation for:
- financial logic,
- auth/security,
- persistence,
- migrations,
- cross-layer data integrity.

Prefer the developer for:
- browser acceptance,
- Firebase/cloud/account actions,
- credentials,
- deployment confirmation,
- git commit/push,
- ordinary visual checks.

For low-risk docs or non-functional changes, V0/V1 is acceptable.

For each task's prompt, explicitly state what Codex should validate and what I should validate manually.

TOKEN POLICY

Minimize:
- repository-wide scans,
- rereading the entire docs/project-records/PROJECT_TASKS.md,
- huge logs,
- entire datasets,
- full-file rewrites,
- unrelated refactors,
- verbose final explanations,
- broad validation before targeted validation.

Normally only one required task should be READY.

docs/project-records/PROJECT_TASKS.md Quick Queue must include:

| ID | Status | Model | Effort | Validation | Executor | Task | Depends On |

At the end report only:
- task counts by status,
- current READY task,
- exact model + effort,
- validation tier + executor,
- one-sentence routing reason,
- confirmation docs/project-records/PROJECT_TASKS.md was created.

Do not implement the READY task yet.
```

---

# 28. Normal Daily Workflow

```text
Open docs/project-records/PROJECT_TASKS.md
        ↓
Find READY
        ↓
Select exact model + effort
        ↓
Check validation tier + executor
        ↓
Copy only Implementation Prompt
        ↓
Codex implements narrowly
        ↓
If DEVELOPER/HYBRID:
run assigned commands manually
        ↓
PASS → send tiny validation confirmation
FAIL → send only root failure
        ↓
Task becomes DONE
        ↓
Next task becomes READY
        ↓
Commit manually
        ↓
Repeat
```

---

# 29. Practical Token-Saving Priority

Optimize in this order:

## Highest-value savings

1. Prevent whole-repository scans.
2. Prevent repeated reading of large project/handoff documents.
3. Keep tasks small and explicit.
4. Run deterministic green-path validation manually.
5. Give Codex only root errors, not full logs.
6. Use Luna instead of Sol, and Sol instead of Astra, when capability permits.
7. De-escalate after hard reasoning is complete.
8. Avoid agent-driven browser acceptance unless necessary.

## Medium-value savings

9. Avoid whole-file regeneration.
10. Avoid broad refactors during feature work.
11. Use targeted tests before full suites.
12. Reduce large datasets to schemas/samples.
13. Keep SESSION.md concise.
14. Keep implementation summaries short.

## Low-value savings

15. Manually edit tiny task status text.
16. Avoiding a tiny `git status`.
17. Removing every explanatory sentence from prompts.

Do not spend excessive human effort chasing tiny token savings.

---

# 30. What NOT to Sacrifice for Token Savings

Do not skip meaningful validation for:

- financial calculations,
- payment scheduling,
- reconciliation,
- authentication,
- authorization,
- user-scoped persistence,
- security,
- migrations,
- data-integrity changes.

A regression discovered immediately is usually cheaper than a regression rediscovered several tasks later.

For risky tasks:

> **Save tokens around the validation, not by removing the validation.**

That means:

- developer runs deterministic commands,
- Codex only sees failures,
- targeted tests run before full tests,
- browser/cloud checks stay manual,
- successful output is summarized as PASS.

---

# 31. Core Philosophy

The workflow is:

> **Plan broadly once. Execute narrowly many times. Validate according to risk. Route deterministic work to the developer and reasoning work to Codex.**

The goal is not:

> "Use as few tokens as possible."

The goal is:

> **"Spend AI tokens only where AI reasoning adds value."**
