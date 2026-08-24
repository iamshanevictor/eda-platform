# EDA Platform Project Tasks

Last reconciled: 2026-08-24 (Asia/Manila)

Workflow: `AI_DEVELOPMENT_WORKFLOW_V2.md`

## Migration Basis

This task library migrates the active roadmap recorded in `MODERNIZATION_WORKLOG.md`; it does not restart the project. No earlier `PROJECT_TASKS.md` or task IDs existed, so IDs below were assigned once to the preserved phase history. Repository history and targeted source inspection establish that Phases 0 and 1 are complete, and that the Phase 2 repository implementation is merged. Remaining Phase 2 cloud/security acceptance is isolated as T004 instead of reopening T003.

Evidence boundaries used for this reconciliation:

- `MODERNIZATION_WORKLOG.md` for approved decisions, completed work, validation, and deferred phases.
- `README.md`, `package.json`, `.github/workflows/ci.yml`, and the last eight commits for current runtime and merge state.
- Targeted analysis, data-access, report, security, and migration files only.
- No claim is made that an unrecorded cloud action is complete. Cloud gates without recorded evidence remain unfinished.

## Status Rules

- `DONE`: implementation and required recorded validation are complete. Do not reopen without contrary evidence.
- `READY`: the single next required, unblocked task. Do not implement it during workflow migration.
- `PLANNED`: valid future work blocked by dependencies.

## Quick Queue

| ID | Status | Model | Effort | Validation | Executor | Task | Depends On |
|---|---|---|---|---|---|---|---|
| T001 | DONE | GPT-5.6 Terra | High | V2 | HYBRID | Recover baseline and establish quality gates | — |
| T002 | DONE | GPT-5.6 Terra | High | V2 | HYBRID | Migrate to supported Next 16 / React 19 conventions | T001 |
| T003 | DONE | GPT-5.6 Sol | High | V3 | HYBRID | Implement secure anonymous upload and persistence controls | T002 |
| T004 | DONE | GPT-5.6 Sol | High | V4 | HYBRID | Close Phase 2 cloud security gates and record the launch decision | T003 |
| T005 | DONE | GPT-5.6 Terra | Medium | V2 | DEVELOPER | Audit and safely modernize non-framework dependencies | T004 |
| T006 | DONE | GPT-5.6 Sol | High | V3 | HYBRID | Specify statistical semantics and golden cases | T005 |
| T007 | DONE | GPT-5.6 Sol | Medium | V3 | HYBRID | Correct type inference and summary statistics | T006 |
| T008 | DONE | GPT-5.6 Sol | High | V3 | HYBRID | Correct correlation alignment and deterministic sampling | T007 |
| T009 | DONE | GPT-5.6 Sol | Extra High | V0 | DEVELOPER | Design the row-oriented storage and processing migration | T008 |
| T010 | DONE | GPT-5.6 Sol | Extra High | V3 | HYBRID | Implement the approved storage migration safely | T009 |
| T011 | DONE | GPT-5.6 Terra | High | V3 | HYBRID | Move pagination and consumers to bounded data access | T010 |
| T012 | DONE | GPT-5.6 Terra | Medium | V2 | DEVELOPER | Adopt print-first reports and remove raster PDF dependencies | T011 |
| T013 | DONE | GPT-5.6 Terra | High | V4 | DEVELOPER | Complete bounded performance, accessibility, and responsive UX | T012 |
| T014 | DONE | GPT-5.6 Sol | Medium | V4 | HYBRID | Complete release documentation and controlled production readiness | T013 |

No task is `READY`: the requested development range is complete. Production
launch remains a separate developer-controlled decision after the deferred
manual/cloud checklist; it is not silently promoted or enabled.

## Completed Work

# T001 — Recover Baseline and Establish Quality Gates

Status: `DONE`

## Recommended Codex Setting

**Model:** `GPT-5.6 Terra`

**Effort:** `High`

**Use:** `GPT-5.6 Terra · High`

## Why This Setting

Historical cross-file framework recovery and test characterization required moderate debugging. No rerun is needed.

## Escalation Path

Historical only. If current evidence invalidates the baseline across architecture or security boundaries, stop and request `GPT-5.6 Sol · High` before creating a new corrective task.

## Objective

Restore a reproducible runtime, quality commands, characterization tests, and CI.

## Dependencies

- None.

## Inspect First

- `MODERNIZATION_WORKLOG.md` Phase 0 history
- `package.json`
- `.github/workflows/ci.yml`

## Likely Files to Modify

- None; task is complete.

## Do Not Modify

- Do not recreate the old broken dependency baseline.

## Acceptance Criteria

- [x] Clean install, lint, type-check, tests, and build were recorded passing.
- [x] Characterization tests and CI workflow exist.
- [x] Work is merged into `master` history.

## Validation Strategy

**Tier:** `V2`

**Executor:** `HYBRID`

### Codex validation

- Historical evidence review only.

### Developer validation

- No rerun required without contrary evidence.

### Failure reporting

If contrary evidence appears, report only the failing command and first/root error and create a corrective task.

## Implementation Prompt

```text
T001 is complete. Do not reimplement it. Use its completion notes only as dependency evidence.
```

## Completion Notes

Completed 2026-08-04. Phase 0 commits and exact local validation are recorded in `MODERNIZATION_WORKLOG.md`; the workflow is now configured to run on pushes to `master`.

# T002 — Migrate to Supported Next 16 / React 19 Conventions

Status: `DONE`

## Recommended Codex Setting

**Model:** `GPT-5.6 Terra`

**Effort:** `High`

**Use:** `GPT-5.6 Terra · High`

## Why This Setting

Historical framework migration crossed configuration and runtime boundaries but followed a clear compatibility target.

## Escalation Path

Historical only. A future major framework migration must be a new task routed to `GPT-5.6 Sol · Extra High` if it requires architectural changes.

## Objective

Move the recovered baseline to supported Next 16 and React 19 conventions without product behavior changes.

## Dependencies

- T001.

## Inspect First

- `MODERNIZATION_WORKLOG.md` Phase 1 history
- `package.json`
- `proxy.ts`
- `next.config.ts`

## Likely Files to Modify

- None; task is complete.

## Do Not Modify

- Do not restore deprecated middleware or custom Webpack behavior.

## Acceptance Criteria

- [x] Next 16 / React 19 compatibility group is installed and locked.
- [x] Native lint and proxy conventions are adopted.
- [x] Local quality suite and build were recorded passing.

## Validation Strategy

**Tier:** `V2`

**Executor:** `HYBRID`

### Codex validation

- Historical evidence review only.

### Developer validation

- No rerun required without contrary evidence.

### Failure reporting

If contrary evidence appears, report only the failing command and first/root error and create a corrective task.

## Implementation Prompt

```text
T002 is complete. Do not reimplement it. Use its completion notes only as dependency evidence.
```

## Completion Notes

Completed 2026-08-04 and merged. The current manifest uses Next `16.2.11`, React `19.2.8`, and the repository uses the supported `proxy.ts` convention.

# T003 — Implement Secure Anonymous Upload and Persistence Controls

Status: `DONE`

## Recommended Codex Setting

**Model:** `GPT-5.6 Sol`

**Effort:** `High`

**Use:** `GPT-5.6 Sol · High`

## Why This Setting

Authentication, RLS, quotas, retention, secret separation, and bounded persistence are security and data-integrity work.

## Escalation Path

Historical only. A newly discovered architectural flaw or destructive recovery requirement must become a new task at `GPT-5.6 Sol · Extra High`.

## Objective

Implement and merge the repository side of owner-isolated anonymous uploads, RLS, quotas, retention, cleanup, Turnstile, and fail-closed behavior.

## Dependencies

- T002.

## Inspect First

- `MODERNIZATION_WORKLOG.md` Phase 2 history
- `app/api/uploads/route.ts`
- `supabase/migrations/20260804000100_phase_2_security.sql`
- `supabase/migrations/20260805000100_phase_2_fix_upload_expiry_reference.sql`

## Likely Files to Modify

- None; repository implementation is complete.

## Do Not Modify

- Do not weaken RLS, grants, quotas, retention, Turnstile, or the upload kill switch.

## Acceptance Criteria

- [x] External AI/chat functionality and dependency were removed.
- [x] Secure upload route and forward migrations are merged.
- [x] Local lint, type-check, 22 tests, build, and diff check were recorded passing.
- [x] A cloud upload, owner read, cross-session denial, redirect, unauthenticated empty state, and production kill switch were recorded verified.

## Validation Strategy

**Tier:** `V3`

**Executor:** `HYBRID`

### Codex validation

- Historical test and migration evidence review only.

### Developer validation

- Remaining environment gates are T004, not a reason to reopen T003.

### Failure reporting

If a security regression appears, report only the failing check and first/root error, disable uploads, and create a corrective task.

## Implementation Prompt

```text
T003 repository implementation is complete. Do not reimplement it. Proceed only through T004 for remaining cloud acceptance.
```

## Completion Notes

Merged to `master` as `983b7c0`. Remaining cloud cleanup, quota/expiry/cron acceptance, monitoring, and launch approval are tracked separately in T004.

## Active and Planned Work

# T004 — Close Phase 2 Cloud Security Gates and Record the Launch Decision

Status: `DONE`

## Recommended Codex Setting

**Model:** `GPT-5.6 Sol`

**Effort:** `High`

**Use:** `GPT-5.6 Sol · High`

## Why This Setting

This is a high-value authentication, authorization, persistence, retention, and production-safety checkpoint. Most actions are developer-operated, while Codex reviews concise evidence and updates project state.

## Escalation Path

Escalate to `GPT-5.6 Sol · Extra High` only if validation exposes an unexplained cross-layer security/data-integrity failure, a destructive migration or recovery requirement, or two targeted diagnostic attempts fail. Stop and request the exact setting before continuing.

## Objective

Complete the recorded Phase 2 environment checks, remove temporary preview exposure, keep production fail-closed unless launch is explicitly approved, and record evidence without changing application code.

## Dependencies

- T003.

## Inspect First

- `supabase/PHASE_2_DEPLOYMENT.md`
- `MODERNIZATION_WORKLOG.md` sections `Phase 2 cloud checkpoint in progress`, `first successful cloud upload`, and `session-isolation closeout`
- `README.md` sections `Database and Auth setup` and `Security operations`

## Likely Files to Modify

- `MODERNIZATION_WORKLOG.md`
- `PROJECT_TASKS.md`
- `README.md` only if verified operational guidance changed

## Do Not Modify

- Application source, migrations, package manifests, or lockfile.
- RLS policies, grants, retention, quotas, or cleanup functions except through a separately approved corrective task.
- Production `UPLOADS_ENABLED=false` unless the developer explicitly approves launch after all gates pass.
- Secrets or credential values in repository files or evidence.

## Acceptance Criteria

- [x] Owner persistence, exact 24-hour expiry, immediate expiry hiding, service-role-only RPC access, one active cron job, and recent successful cleanup executions are verified; active-dataset quota and the final physical-removal query are explicit release blockers.
- [x] Monitoring and current edge/bot/firewall revalidation are recorded as release blockers; production remains disabled.
- [x] Both temporary preview hostnames are removed from Turnstile and the Preview `UPLOADS_ENABLED=true` override is removed after testing.
- [x] The earlier production HTTP 503 evidence is retained and a keep-disabled decision is recorded; a current final 503 recheck remains a release blocker.
- [x] Groq is removed from source and Vercel; provider-side credential revocation is recorded as an outstanding owner action without disclosing a secret.
- [x] `MODERNIZATION_WORKLOG.md` reflects `master` rather than the merged Phase 2 branch.
- [x] T004 records concise evidence and the explicit keep-production-disabled decision.

## Validation Strategy

**Tier:** `V4`

**Executor:** `HYBRID`

### Codex validation

- Review only the developer's concise results against `supabase/PHASE_2_DEPLOYMENT.md`.
- Inspect repository documentation changes with `git diff --check` if Codex edits them.
- Do not operate production accounts, credentials, or cloud consoles.

### Developer validation

- Perform the separate-session, quota, expiry, cron, RPC/grant, monitoring, Turnstile-hostname, and Vercel-variable checks in the linked test/preview environment.
- After preview cleanup, run:
  `Invoke-WebRequest -Method Post -Uri 'https://eda-platform.vercel.app/api/uploads' -ContentType 'text/csv' -Body ([string]::Join([Environment]::NewLine, @('a','1'))) -SkipHttpErrorCheck | Select-Object StatusCode, Headers, Content`
- Confirm status `503`, `Cache-Control: no-store`, and `Retry-After: 300` while production remains disabled.
- `git diff --check`
- `git status --short`

### Failure reporting

If validation fails, report only the failing check/command, the first/root failure, and whether uploads are disabled. Never paste secrets or broad cloud logs.

## Implementation Prompt

```text
Read AI_DEVELOPMENT_WORKFLOW_V2.md and follow the repository documentation.

Implement task T004: Close Phase 2 Cloud Security Gates and Record the Launch Decision.

CODEX ROUTING

Use:
GPT-5.6 Sol · High

Why:
This is authentication, authorization, persistence, retention, and production-safety acceptance.

Escalate to:
GPT-5.6 Sol · Extra High

ONLY IF:
- an unexplained cross-layer security/data-integrity failure appears,
- destructive migration/recovery becomes necessary, or
- two targeted diagnostic attempts fail.

If escalation is required, STOP and tell me which Codex setting to select. Do not continue until I switch the model.

OBJECTIVE

Complete and record the remaining Phase 2 cloud gates, remove temporary preview exposure, and keep production uploads disabled unless I explicitly approve launch.

CONTEXT BOUNDARY

Inspect first:
- supabase/PHASE_2_DEPLOYMENT.md
- the three final Phase 2 cloud entries in MODERNIZATION_WORKLOG.md
- README.md security operations

Do not scan the entire repository. Expand context only when current evidence requires it.

REQUIREMENTS

- Have me perform all cloud-console, credential, browser-session, linked-database, and production checks.
- Review only concise evidence for quota, expiry, cleanup, grants/RPCs, cron, monitoring, edge controls, preview cleanup, and production 503 behavior.
- Do not expose secrets.
- Update only project-state documentation after evidence is confirmed.

DO NOT MODIFY

- application source, migrations, dependencies, RLS, quotas, retention, or cleanup logic
- production UPLOADS_ENABLED without my explicit approval

ACCEPTANCE CRITERIA

- every listed cloud gate has concise evidence or an explicit unresolved blocker
- temporary preview hostnames and the Preview upload override are removed after testing
- the production kill switch is reconfirmed unless launch is explicitly approved
- the worklog reflects master and the true Phase 2 state

VALIDATION ROUTING

Tier:
V4

Executor:
HYBRID

- Do not operate my cloud accounts.
- Review the targeted evidence I provide.
- Give me exact remaining manual checks.
- Run only git diff --check for documentation edits.

IMPLEMENTATION

1. Inspect only the listed context first.
2. Ask for only the next required concise evidence while continuing any repository-only review.
3. Preserve fail-closed controls.
4. Do not implement later tasks.

OUTPUT

Keep the final response concise: state changed, files changed, evidence reviewed, remaining manual actions, one commit message, and task status.

PROJECT STATE

If validation is confirmed, mark T004 DONE, promote T005 to READY, reassess its routing, and update the worklog. If validation is pending, leave T004 READY and do not promote or implement T005.
```

## Completion Notes

Evidence recorded 2026-08-24:

- Phase 2 is merged on `master` at `983b7c0`.
- Vercel initially contained separate Sensitive `UPLOADS_ENABLED` entries for Preview and Production. Preview runtime was confirmed enabled; the Preview entry was then removed, while the Production entry was left unchanged.
- Turnstile initially contained the production hostname and two temporary Vercel preview hostnames. Both preview hostnames were removed after validation; the production hostname remains.
- Both allowlisted previews load `/upload` and complete Turnstile. Preview 2 contains the current Phase 2 closeout copy and is the selected validation deployment; Preview 1 is an older build.
- Preview 2 accepted the generated three-record smoke CSV, redirected freshly to `/data`, and displayed dataset ID 36 with its analysis. The effective Preview upload setting and deployed owner write/read path are confirmed.
- Dataset 36 has a non-null owner and an exact one-day creation-to-expiry interval. Exactly one `purge-expired-demo-data` cron job is active at `5 * * * *`, and its five latest hourly executions succeeded.
- After only disposable dataset 36 was deliberately expired, its owner UI immediately hid it and rendered the empty private workspace without an error, confirming pre-cleanup expiry enforcement.

Closed 2026-08-24 under the keep-production-disabled path. Active-dataset quota, the final physical-removal query for disposable dataset 36, remaining grant revalidation, monitoring/edge review, provider-side credential revocation, and a current production 503 check remain explicit release blockers for T014; they do not block offline development. T005 is promoted to `READY`.

# T005 — Audit and Safely Modernize Non-Framework Dependencies

Status: `DONE`

## Recommended Codex Setting

**Model:** `GPT-5.6 Terra`

**Effort:** `Medium`

**Use:** `GPT-5.6 Terra · Medium`

## Why This Setting

This is ordinary dependency maintenance with clear boundaries and deterministic validation.

## Escalation Path

Escalate to `GPT-5.6 Sol · Medium` only if compatible upgrades force an unfamiliar data/auth API migration or unresolved peer-dependency conflicts survive two targeted attempts. Stop before switching.

## Objective

Audit current direct dependencies, remove only proven-unused packages, and apply a conservative compatible upgrade set without changing framework, CSS, reporting, database, or product behavior.

## Dependencies

- T004.

## Inspect First

- `package.json`
- relevant direct-import matches under `app/`, `components/`, and `lib/`
- `package-lock.json` only for packages selected for change

## Likely Files to Modify

- `package.json`
- `package-lock.json`
- minimal compatibility call sites only when required by an approved upgrade

## Do Not Modify

- Next, React, TypeScript, Node/npm policy, Tailwind major version, or PDF/reporting dependencies.
- Supabase schema/migrations, analysis formulas, UI redesign, or unrelated source.
- Do not use `--force` or `--legacy-peer-deps`.

## Acceptance Criteria

- [ ] Each removed dependency has import/usage evidence showing it is unused.
- [ ] Each upgraded dependency is compatible with the current Next 16 / React 19 group.
- [ ] Lockfile is reproducible with npm only and no force flags.
- [ ] No intentional application behavior changes.
- [ ] Deferred major or risky upgrades are recorded rather than forced into this task.

## Validation Strategy

**Tier:** `V2`

**Executor:** `DEVELOPER`

### Codex validation

- Inspect targeted manifests/imports and the final dependency diff only.
- Do not run broad green-path validation.

### Developer validation

- `npm ci`
- `npm run lint`
- `npm run typecheck`
- `npm test`
- `npm run build`
- `npm audit --omit=dev`
- `git diff --check`

### Failure reporting

Report only the failing command and first/root error. For audit findings, report package/advisory identity without the full audit log.

## Implementation Prompt

```text
Read AI_DEVELOPMENT_WORKFLOW_V2.md and follow the repository documentation.

Implement task T005: Audit and Safely Modernize Non-Framework Dependencies.

CODEX ROUTING
Use: GPT-5.6 Terra · Medium
Why: this is bounded dependency maintenance.
Escalate to: GPT-5.6 Sol · Medium
ONLY IF:
- a required upgrade forces an unfamiliar auth/data API migration, or
- two targeted attempts cannot resolve a peer-dependency conflict.
If escalation is required, STOP and tell me which Codex setting to select.

OBJECTIVE
Apply the smallest conservative non-framework dependency cleanup/upgrade set.

CONTEXT BOUNDARY
Inspect first:
- package.json
- direct import matches under app/, components/, and lib/
- only selected package sections in package-lock.json
Do not scan the entire repository.

REQUIREMENTS
- prove a package unused before removing it
- preserve the Next 16 / React 19 compatibility group
- use npm only; no force flags
- record deferred risky majors

DO NOT MODIFY
- Next/React/TypeScript/Node policy, Tailwind major, PDF/report flow
- schema, migrations, statistical behavior, or unrelated UI

ACCEPTANCE CRITERIA
- reproducible lockfile
- compatible direct dependencies
- no intentional behavior change

VALIDATION ROUTING
Tier: V2
Executor: DEVELOPER
- Do not run broad validation yourself.
- Give me exactly: npm ci; npm run lint; npm run typecheck; npm test; npm run build; npm audit --omit=dev; git diff --check.
- Leave T005 awaiting validation until I report success.

IMPLEMENTATION
Inspect narrowly, make one reviewable dependency commit, and do not implement later tasks.

OUTPUT
Return only completed change, files, developer commands, manual actions, one commit message, and task state.

PROJECT STATE
On confirmed validation, mark T005 DONE and promote T006. Otherwise do not promote it.
```

## Completion Notes

Completed 2026-08-24. Updated only compatible dependency ranges, kept framework
and ecosystem majors fixed, and removed raster-PDF packages in T012. The
production-only audit reports four high transitive advisories in the current
Next.js dependency tree with no available npm fix; no unsafe forced upgrade was
performed.

# T006 — Specify Statistical Semantics and Golden Cases

Status: `DONE`

## Recommended Codex Setting

**Model:** `GPT-5.6 Sol`

**Effort:** `High`

**Use:** `GPT-5.6 Sol · High`

## Why This Setting

Statistical definitions are high-leverage data-integrity decisions; the current code intentionally preserves known ambiguous or incorrect behavior.

## Escalation Path

Escalate to `GPT-5.6 Sol · Extra High` only if requirements conflict materially, reference methods cannot be reconciled, or the definition work expands into a storage/processing architecture decision. Stop before continuing.

## Objective

Record precise statistical semantics and representative golden cases before changing production formulas.

## Dependencies

- T005.

## Inspect First

- `README.md` section `Known analysis behavior`
- `MODERNIZATION_WORKLOG.md` Phase 4 scope
- `lib/analysis/analyzeDataset.test.ts`
- relevant functions in `lib/analysis/analyzeDataset.ts`
- `app/actions/generateReport.ts` insight calculations

## Likely Files to Modify

- `DECISION.md` (create because no decision record currently exists)
- `lib/analysis/analyzeDataset.test.ts` for explicit golden/characterization cases that still pass before implementation
- `PROJECT_TASKS.md` only for state transition

## Do Not Modify

- Production analysis formulas, persistence schema, UI, upload limits, or report rendering.
- Do not silently choose sample versus population deviation or a quantile method without recording it.

## Acceptance Criteria

- [ ] Definitions cover missing values, mixed columns, numeric/boolean/date/text inference, standard deviation, quantiles, constant columns, pairwise correlation rows, rounding, deterministic sampling, and full-total versus sample-based results.
- [ ] Golden inputs and expected results cover edge and mixed-type cases.
- [ ] Current historical behavior versus intended behavior is explicit.
- [ ] No production algorithm changes occur.

## Validation Strategy

**Tier:** `V3`

**Executor:** `HYBRID`

### Codex validation

- Run `npm test -- lib/analysis/analyzeDataset.test.ts` only if test cases change.
- Check decisions against existing consumers and identify conflicts without editing them.

### Developer validation

- Review the statistical decisions and golden expected values.
- `npm test -- lib/analysis/analyzeDataset.test.ts`
- `git diff --check`

### Failure reporting

Report only the disputed definition or first failing golden case with its minimal input and expected/actual value.

## Implementation Prompt

```text
Read AI_DEVELOPMENT_WORKFLOW_V2.md and follow the repository documentation.

Implement task T006: Specify Statistical Semantics and Golden Cases.

CODEX ROUTING
Use: GPT-5.6 Sol · High
Why: statistical definitions are data-integrity decisions.
Escalate to: GPT-5.6 Sol · Extra High
ONLY IF requirements conflict, reference methods cannot be reconciled, or storage architecture becomes necessary.
If escalation is required, STOP and tell me which setting to select.

OBJECTIVE
Specify intended analysis semantics and golden cases without changing production formulas.

CONTEXT BOUNDARY
Inspect first:
- README.md known behavior
- MODERNIZATION_WORKLOG.md Phase 4
- lib/analysis/analyzeDataset.test.ts
- only relevant functions in lib/analysis/analyzeDataset.ts
- app/actions/generateReport.ts insight calculations
Do not scan the entire repository.

REQUIREMENTS
- define type inference, missingness, standard deviation, quantiles, correlation alignment, constants, rounding, deterministic sampling, and total-vs-sample semantics
- distinguish current characterization from intended behavior
- create DECISION.md because it is absent

DO NOT MODIFY
- production formulas, persistence, upload limits, UI, or reporting

ACCEPTANCE CRITERIA
- decisions and golden cases are explicit, reviewable, and sufficient for T007/T008
- existing tests remain green

VALIDATION ROUTING
Tier: V3
Executor: HYBRID
- Run only the targeted analysis test if tests change.
- Give me the same targeted command and git diff --check.
- Ask me to approve the statistical definitions.

IMPLEMENTATION
Make the smallest documentation/test-fixture change and do not implement T007 or later work.

OUTPUT
Keep the response concise with files, targeted validation, developer checks, one commit message, and state.

PROJECT STATE
Promote T007 only after validation and decision approval are confirmed.
```

## Completion Notes

Completed 2026-08-24. The authoritative statistical, missing-value, rounding,
correlation, and sampling contract is recorded in `DECISION.md` and covered by
golden/edge tests.

# T007 — Correct Type Inference and Summary Statistics

Status: `DONE`

## Recommended Codex Setting

**Model:** `GPT-5.6 Sol`

**Effort:** `Medium`

**Use:** `GPT-5.6 Sol · Medium`

## Why This Setting

The definitions will be settled by T006, but implementation still changes user-visible statistical/data-integrity behavior.

## Escalation Path

Escalate to `GPT-5.6 Sol · High` if mixed-type behavior cannot match the approved semantics, report consumers require incompatible changes, or two targeted implementations fail golden cases.

## Objective

Implement approved type inference, missing-value handling, and summary-statistic semantics with regression tests.

## Dependencies

- T006.

## Inspect First

- `DECISION.md` statistical decision
- `lib/analysis/analyzeDataset.test.ts`
- relevant column loop in `lib/analysis/analyzeDataset.ts`
- `components/AnalysisResults.tsx`
- `app/actions/generateReport.ts` only where semantics are consumed

## Likely Files to Modify

- `lib/analysis/analyzeDataset.ts`
- `lib/analysis/analyzeDataset.test.ts`
- minimal display/report types or labels if required by approved semantics

## Do Not Modify

- Correlation algorithm or sampling; those belong to T008.
- Upload/storage schema, quotas, auth, reports layout, or unrelated charts.

## Acceptance Criteria

- [ ] Type inference uses the approved evidence rule rather than only the first non-empty value.
- [ ] Native and textual booleans follow the approved behavior.
- [ ] Numeric, date, empty, and mixed columns match the golden cases.
- [ ] Standard deviation and quantiles match the recorded method and rounding.
- [ ] Missing counts and denominators are correct.
- [ ] Regression tests replace only superseded characterization expectations.

## Validation Strategy

**Tier:** `V3`

**Executor:** `HYBRID`

### Codex validation

- `npm test -- lib/analysis/analyzeDataset.test.ts`
- Iterate only on the first targeted failure.

### Developer validation

- `npm run lint`
- `npm run typecheck`
- `npm test`
- `npm run build`
- Manually compare two documented golden CSV examples with displayed results.
- `git diff --check`

### Failure reporting

Report only the first failing case, minimal input, and expected/actual statistic.

## Implementation Prompt

```text
Read AI_DEVELOPMENT_WORKFLOW_V2.md and follow the repository documentation.

Implement task T007: Correct Type Inference and Summary Statistics.

CODEX ROUTING
Use: GPT-5.6 Sol · Medium
Why: scoped implementation of approved statistical semantics still carries data-integrity risk.
Escalate to: GPT-5.6 Sol · High
ONLY IF mixed-type behavior conflicts with the decision, consumers require incompatible changes, or two targeted attempts fail.
If escalation is required, STOP and request the setting.

OBJECTIVE
Implement the approved inference, missingness, deviation, and quantile behavior with regression tests.

CONTEXT BOUNDARY
Inspect first:
- DECISION.md statistical decision
- lib/analysis/analyzeDataset.test.ts
- the relevant column loop in lib/analysis/analyzeDataset.ts
- components/AnalysisResults.tsx
- app/actions/generateReport.ts only if required
Do not scan the repository.

REQUIREMENTS
- match every approved golden case
- preserve rounding and bounded execution
- replace only obsolete characterization expectations

DO NOT MODIFY
- correlation/sampling, persistence, auth, quotas, report layout, unrelated charts

ACCEPTANCE CRITERIA
- approved inference and summary results are exact
- targeted regressions cover edge cases

VALIDATION ROUTING
Tier: V3
Executor: HYBRID
- Run npm test -- lib/analysis/analyzeDataset.test.ts.
- I will run lint, typecheck, full tests, build, two manual golden examples, and git diff --check.

IMPLEMENTATION
Patch only necessary symbols, preserve unrelated behavior, and do not implement T008.

OUTPUT
Return concise completion, files, targeted validation, my commands, one commit message, and state.

PROJECT STATE
Promote T008 only after full validation success.
```

## Completion Notes

Completed 2026-08-24. Whole-column Boolean/numeric/strict-ISO inference and
R-7/population summary statistics replaced the historical characterization
behavior; targeted and full tests pass.

# T008 — Correct Correlation Alignment and Deterministic Sampling

Status: `DONE`

## Recommended Codex Setting

**Model:** `GPT-5.6 Sol`

**Effort:** `High`

**Use:** `GPT-5.6 Sol · High`

## Why This Setting

Pairwise row alignment and sampling affect statistical correctness across analysis, charts, and reports.

## Escalation Path

Escalate to `GPT-5.6 Sol · Extra High` if correctness conflicts with the processing deadline/correlation cap, deterministic sampling requires storage architecture changes, or two targeted attempts fail.

## Objective

Implement row-aligned pairwise correlation and the approved deterministic bounded sampling method, then update consumers/tests consistently.

## Dependencies

- T007.

## Inspect First

- `DECISION.md` statistical decision
- correlation tests and function in `lib/analysis/analyzeDataset.test.ts` and `lib/analysis/analyzeDataset.ts`
- `app/actions/getDatasetData.ts` sampling function
- correlation consumers in `components/AdvancedCharts.tsx`, `components/charts/CorrelationHeatmap.tsx`, and `app/actions/generateReport.ts`

## Likely Files to Modify

- `lib/analysis/analyzeDataset.ts`
- `lib/analysis/analyzeDataset.test.ts`
- `app/actions/getDatasetData.ts`
- a small pure sampling helper/test if extraction is needed
- minimal consumers only if the approved output contract changes

## Do Not Modify

- Storage schema/migrations, auth/security limits, report layout, or unrelated chart styling.
- Do not raise the 30-numeric-column cap or processing deadline.

## Acceptance Criteria

- [ ] Each correlation pair uses only rows where both values are valid.
- [ ] Empty/constant/insufficient pairs follow the approved result semantics.
- [ ] Matrix symmetry, diagonal behavior, rounding, and the 30-column cap are tested.
- [ ] Sampling is deterministic/reproducible under the approved key/seed and does not use random comparator sorting.
- [ ] Totals are not incorrectly inferred from samples.

## Validation Strategy

**Tier:** `V3`

**Executor:** `HYBRID`

### Codex validation

- `npm test -- lib/analysis/analyzeDataset.test.ts`
- Run a new targeted sampling test file if created.

### Developer validation

- `npm run lint`
- `npm run typecheck`
- `npm test`
- `npm run build`
- Manually check one missing-pair correlation fixture and repeated sampling stability.
- `git diff --check`

### Failure reporting

Report only the first failing pair/sample fixture and minimal expected/actual output.

## Implementation Prompt

```text
Read AI_DEVELOPMENT_WORKFLOW_V2.md and follow the repository documentation.

Implement task T008: Correct Correlation Alignment and Deterministic Sampling.

CODEX ROUTING
Use: GPT-5.6 Sol · High
Why: this is cross-consumer statistical data-integrity work.
Escalate to: GPT-5.6 Sol · Extra High
ONLY IF deadline/cap constraints conflict with correctness, storage architecture is required, or two targeted attempts fail.
If escalation is required, STOP and request the setting.

OBJECTIVE
Implement row-aligned correlations and approved deterministic bounded sampling.

CONTEXT BOUNDARY
Inspect first:
- DECISION.md statistical decision
- correlation symbols/tests in lib/analysis/analyzeDataset.ts and .test.ts
- sampling symbols in app/actions/getDatasetData.ts
- only named correlation consumers
Do not scan the repository.

REQUIREMENTS
- preserve row pairing
- handle constants/insufficient pairs as decided
- keep matrix/cap/rounding invariants
- replace random comparator sampling with deterministic bounded sampling
- keep total and sample semantics separate

DO NOT MODIFY
- storage schema, security limits, auth, report layout, unrelated styling

ACCEPTANCE CRITERIA
- golden correlation and sampling cases pass
- cap and deadline safeguards remain

VALIDATION ROUTING
Tier: V3
Executor: HYBRID
- Run targeted analysis and sampling tests.
- I will run lint, typecheck, full tests, build, manual fixtures, and git diff --check.

IMPLEMENTATION
Make the smallest complete change, add regressions, and do not implement T009.

OUTPUT
Return concise completion, files, targeted checks, my commands, one commit message, and state.

PROJECT STATE
Promote T009 only after full validation success.
```

## Completion Notes

Completed 2026-08-24. Correlations are row-aligned, pairwise-complete,
symmetric, and deterministic; invalid/constant pairs return zero and sampling
uses deterministic evenly spaced row indexes.

# T009 — Design the Row-Oriented Storage and Processing Migration

Status: `DONE`

## Recommended Codex Setting

**Model:** `GPT-5.6 Sol`

**Effort:** `Extra High`

**Use:** `GPT-5.6 Sol · Extra High`

## Why This Setting

Replacing single-row JSONB storage is a major architecture/migration decision involving ownership, retention, quotas, reporting, performance, rollback, and existing data.

## Escalation Path

Escalate to `GPT-5.6 Sol · Max` only if a concrete design remains unresolved after comparing at least two viable designs against measured constraints, or preservation/rollback requirements materially conflict.

## Objective

Produce an approved, implementation-ready migration design for bounded row-oriented or object-backed storage and processing; do not change runtime code or schema.

## Dependencies

- T008.

## Inspect First

- `README.md` runtime flow, limits, and known JSONB constraint
- `MODERNIZATION_WORKLOG.md` Phase 4/5 storage scope
- relevant dataset table/function definitions in `supabase/migrations/20260804000100_phase_2_security.sql`
- data reads in `app/actions/getDatasetData.ts`, `app/actions/generateReport.ts`, and `app/api/uploads/route.ts`
- `supabase/PHASE_2_DEPLOYMENT.md` recovery constraints

## Likely Files to Modify

- `DECISION.md`
- a focused migration design document under `supabase/`
- `PROJECT_TASKS.md` only for state transition

## Do Not Modify

- Application code, migrations, package manifests, cloud state, or current RLS.
- Do not delete or rewrite existing data.

## Acceptance Criteria

- [ ] At least two viable storage/processing designs are compared against the 2 MiB/10k-row/500k-cell envelope and future expansion.
- [ ] The chosen design defines schema/objects, ownership/RLS, quotas, retention/cleanup, transactional boundaries, pagination, sampling, analysis/report reads, indexes, and cost limits.
- [ ] Forward migration, backfill, verification, rollback/roll-forward, coexistence, and old-client behavior are explicit.
- [ ] T010 and T011 can execute without reopening architecture.

## Validation Strategy

**Tier:** `V0`

**Executor:** `DEVELOPER`

### Codex validation

- Reason through invariants and check referenced code/schema boundaries only.
- Do not run application validation for a prose-only design task.

### Developer validation

- Manually approve the chosen architecture and operational tradeoffs.
- `git diff --check`

### Failure reporting

Report only the disputed invariant, missing evidence, or unresolved design choice.

## Implementation Prompt

```text
Read AI_DEVELOPMENT_WORKFLOW_V2.md and follow the repository documentation.

Implement task T009: Design the Row-Oriented Storage and Processing Migration.

CODEX ROUTING
Use: GPT-5.6 Sol · Extra High
Why: this is a major persistence and data-integrity migration design.
Escalate to: GPT-5.6 Sol · Max
ONLY IF two concrete viable designs remain unresolved against measured constraints or preservation/rollback requirements conflict.
If escalation is required, STOP and request the setting.

OBJECTIVE
Create an approved implementation-ready storage/processing migration design without changing runtime code or schema.

CONTEXT BOUNDARY
Inspect first:
- README.md runtime flow/limits
- MODERNIZATION_WORKLOG.md Phase 4/5 scope
- relevant dataset schema/functions in the Phase 2 migration
- data reads in getDatasetData, generateReport, and uploads route
- Phase 2 recovery guidance
Do not scan the repository.

REQUIREMENTS
- compare at least two designs
- define ownership, RLS, quotas, retention, transactions, pagination, sampling, reporting, indexes, costs
- define forward/backfill/verification/rollback/coexistence
- preserve existing data

DO NOT MODIFY
- runtime code, schema/migrations, packages, cloud state, RLS

ACCEPTANCE CRITERIA
- the design fully bounds T010/T011 and is explicitly approved

VALIDATION ROUTING
Tier: V0
Executor: DEVELOPER
- Do not run application validation.
- Give me a focused design-review checklist and git diff --check.

IMPLEMENTATION
Update only decision/design documentation. Do not implement the migration.

OUTPUT
Return only decision summary, files, manual review, one commit message, and state.

PROJECT STATE
Promote T010 only after I approve the design.
```

## Completion Notes

Completed 2026-08-24. `DECISION.md` and
`supabase/ROW_STORAGE_DEPLOYMENT.md` record the row table, authoritative count,
RLS/grants, atomic write, backfill, deployment, and recovery design.

# T010 — Implement the Approved Storage Migration Safely

Status: `DONE`

## Recommended Codex Setting

**Model:** `GPT-5.6 Sol`

**Effort:** `Extra High`

**Use:** `GPT-5.6 Sol · Extra High`

## Why This Setting

This is a major, security-sensitive persistence migration with existing-data, RLS, cleanup, and rollback risk.

## Escalation Path

Escalate to `GPT-5.6 Sol · Max` only if the approved design cannot preserve a discovered production invariant, two targeted migration attempts fail for different root causes, or safe roll-forward/rollback cannot be established.

## Objective

Implement the approved forward migration and server write compatibility while preserving existing data and fail-closed security.

## Dependencies

- T009.

## Inspect First

- approved storage decision/design in `DECISION.md` and `supabase/`
- `supabase/migrations/20260804000100_phase_2_security.sql`
- `supabase/migrations/20260805000100_phase_2_fix_upload_expiry_reference.sql`
- `lib/security/retention-migration.test.ts`
- persistence boundary in `app/api/uploads/route.ts`
- `lib/supabase/admin.ts`

## Likely Files to Modify

- a new forward-only migration under `supabase/migrations/`
- `lib/security/retention-migration.test.ts` or a new focused migration-contract test
- `app/api/uploads/route.ts` and a small server persistence helper
- deployment/recovery documentation

## Do Not Modify

- Historical migrations.
- Statistical formulas, UI/report consumers, or production cloud state.
- Do not drop data, weaken RLS/grants, expose service keys, or raise public limits.

## Acceptance Criteria

- [ ] Migration is forward-only, preserves existing rows, and supports the approved coexistence/backfill plan.
- [ ] Owner isolation, least grants, quotas, expiry, cleanup, and service-role-only writes remain enforced.
- [ ] Write path is atomic and bounded.
- [ ] Recovery and verification steps are exact and reviewed.
- [ ] Targeted migration/security tests cover critical SQL contracts.

## Validation Strategy

**Tier:** `V3`

**Executor:** `HYBRID`

### Codex validation

- `npm test -- lib/security/retention-migration.test.ts`
- Additional targeted migration/persistence tests created by the task.

### Developer validation

- Apply and verify on a disposable or reviewed linked schema with a restorable backup; do not start in production.
- `npm run lint`
- `npm run typecheck`
- `npm test`
- `npm run build`
- `git diff --check`
- Perform the approved RLS/grant, preservation, backfill, cleanup, quota, and rollback/roll-forward checklist.

### Failure reporting

Report only the failing command/check, first/root database error, affected migration step, and whether writes are disabled. Never include secrets or broad dumps.

## Implementation Prompt

```text
Read AI_DEVELOPMENT_WORKFLOW_V2.md and follow the repository documentation.

Implement task T010: Implement the Approved Storage Migration Safely.

CODEX ROUTING
Use: GPT-5.6 Sol · Extra High
Why: major security-sensitive persistence migration.
Escalate to: GPT-5.6 Sol · Max
ONLY IF a discovered invariant invalidates the approved design, two targeted migration attempts fail for different causes, or safe recovery cannot be established.
If escalation is required, STOP and request the setting.

OBJECTIVE
Implement the approved forward migration and bounded server write compatibility while preserving data and security.

CONTEXT BOUNDARY
Inspect first:
- approved DECISION.md/storage design
- existing Phase 2 migrations
- retention migration contract test
- upload persistence boundary
- server-only Supabase client
Do not scan the repository.

REQUIREMENTS
- new forward-only migration; never edit history
- preserve/coexist/backfill as approved
- maintain RLS, grants, quotas, expiry, cleanup, atomicity, and limits
- document exact verification and recovery

DO NOT MODIFY
- statistics, UI/report reads, public limits, production cloud state
- do not drop data or expose secrets

ACCEPTANCE CRITERIA
- migration contract and targeted tests pass
- disposable/linked validation preserves all security/data invariants

VALIDATION ROUTING
Tier: V3
Executor: HYBRID
- Run targeted migration/persistence tests.
- I will run full quality commands and the reviewed database checklist in a safe environment.

IMPLEMENTATION
Patch only the approved migration/write boundary, add tests, and do not implement T011.

OUTPUT
Return concise change, files, targeted checks, my commands/manual checklist, one commit message, and state.

PROJECT STATE
Promote T011 only after full and environment validation pass.
```

## Completion Notes

Completed 2026-08-24. Added the forward-only transactional row-storage
migration and contract tests. Linked-database execution is intentionally
deferred; Production uploads remain disabled until its checklist passes.

# T011 — Move Pagination and Consumers to Bounded Data Access

Status: `DONE`

## Recommended Codex Setting

**Model:** `GPT-5.6 Terra`

**Effort:** `High`

**Use:** `GPT-5.6 Terra · High`

## Why This Setting

The architecture is fixed by T009/T010, but implementation crosses server data access, pagination, charts, reports, and UI state.

## Escalation Path

Escalate to `GPT-5.6 Sol · High` if data totals/samples cannot remain consistent, RLS/ownership must change, or two targeted cross-layer attempts fail.

## Objective

Stop fetching complete JSON payloads for pagination/report/chart reads and move all consumers to bounded server data access.

## Dependencies

- T010.

## Inspect First

- approved storage contract
- `app/actions/getDatasetData.ts`
- `app/api/dataset-data/[id]/route.ts`
- `components/OptimizedDatasetTabs.tsx`
- `app/actions/generateReport.ts`
- `components/AdvancedCharts.tsx`

## Likely Files to Modify

- named data actions/API/components
- a focused server data-access helper and tests
- types shared by those consumers

## Do Not Modify

- Schema/migrations approved in T010, auth/RLS/quotas, statistical formulas, report visual redesign, or unrelated components.

## Acceptance Criteria

- [ ] Pagination queries only the requested bounded page and returns authoritative totals.
- [ ] Chart/sample reads are bounded and deterministic according to T008.
- [ ] Reports do not retrieve the entire dataset unless explicitly allowed by the approved bounded contract.
- [ ] Invalid IDs/pages/sizes and cross-owner access remain fail-closed.
- [ ] Loading, empty, expiry, and error states remain correct.

## Validation Strategy

**Tier:** `V3`

**Executor:** `HYBRID`

### Codex validation

- Run new targeted data-access tests first.
- Run existing identifier tests if pagination validation changes.

### Developer validation

- `npm run lint`
- `npm run typecheck`
- `npm test`
- `npm run build`
- Manually verify first/middle/last page, stable sample/chart, report generation, expired data, and cross-session denial.
- Inspect browser network payloads to confirm bounded responses.
- `git diff --check`

### Failure reporting

Report only the failing request/test, first/root error, page/sample parameters, and minimal response metadata.

## Implementation Prompt

```text
Read AI_DEVELOPMENT_WORKFLOW_V2.md and follow the repository documentation.

Implement task T011: Move Pagination and Consumers to Bounded Data Access.

CODEX ROUTING
Use: GPT-5.6 Terra · High
Why: clear architecture, cross-layer implementation.
Escalate to: GPT-5.6 Sol · High
ONLY IF totals/samples cannot remain consistent, ownership/RLS must change, or two targeted attempts fail.
If escalation is required, STOP and request the setting.

OBJECTIVE
Replace whole-payload pagination/report/chart reads with bounded server access.

CONTEXT BOUNDARY
Inspect first:
- approved storage contract
- getDatasetData action and dataset-data route
- OptimizedDatasetTabs
- generateReport action
- AdvancedCharts
Do not scan the repository.

REQUIREMENTS
- bounded page queries with authoritative totals
- deterministic bounded chart/sample reads
- bounded report data
- fail-closed ownership/expiry/input behavior

DO NOT MODIFY
- migrations, RLS/quotas, statistics, report redesign, unrelated UI

ACCEPTANCE CRITERIA
- no consumer fetches full data merely to slice locally
- paging/sample/report behavior and security states are tested

VALIDATION ROUTING
Tier: V3
Executor: HYBRID
- Run targeted data-access tests first.
- I will run full quality commands and manual network/browser/security checks.

IMPLEMENTATION
Use the approved storage boundary, make the smallest cross-layer change, and do not implement T012.

OUTPUT
Return concise change, files, targeted checks, my commands/manual checks, one commit message, and state.

PROJECT STATE
Promote T012 only after full and manual validation pass.
```

## Completion Notes

Completed 2026-08-24. Data preview uses ordered 100-row pages, charts use a
deterministic sample capped at 1,000 rows, and reports consume only metadata and
stored analysis. Browser/network and owner-expiry acceptance is deferred.

# T012 — Adopt Print-First Reports and Remove Raster PDF Dependencies

Status: `DONE`

## Recommended Codex Setting

**Model:** `GPT-5.6 Terra`

**Effort:** `Medium`

**Use:** `GPT-5.6 Terra · Medium`

## Why This Setting

The product decision is already recorded: use searchable/selectable browser Print to PDF and remove the raster path. This is normal scoped UI/dependency work.

## Escalation Path

Escalate to `GPT-5.6 Terra · High` if print pagination requires coordinated changes across report data, templates, and browser-specific layout or two targeted fixes fail.

## Objective

Remove html2canvas/jsPDF export, retain an accessible print-first report flow, and remove only the dependencies made unused.

## Dependencies

- T011.

## Inspect First

- `MODERNIZATION_WORKLOG.md` PDF product decision
- `README.md` Reports section
- `components/ReportGenerator.tsx`
- `components/ReportTemplate.tsx`
- print rules in `app/globals.css`
- relevant dependency entries in `package.json`

## Likely Files to Modify

- `components/ReportGenerator.tsx`
- `components/ReportTemplate.tsx`
- `app/globals.css`
- `package.json`
- `package-lock.json`

## Do Not Modify

- Report statistical meanings, persistence/data-access contract, auth/security, unrelated UI, or Tailwind major version.

## Acceptance Criteria

- [ ] Raster/canvas PDF path and UI are removed.
- [ ] Browser print produces paginated A4-friendly, searchable/selectable output.
- [ ] Preview, loading, failure, close, and print actions remain accessible.
- [ ] `html2canvas` and `jspdf` are removed only after imports are gone; `react-to-print` is retained only if still needed.
- [ ] README accurately describes the final behavior.

## Validation Strategy

**Tier:** `V2`

**Executor:** `DEVELOPER`

### Codex validation

- Inspect targeted report/dependency diff only.
- Do not perform routine browser acceptance.

### Developer validation

- `npm ci`
- `npm run lint`
- `npm run typecheck`
- `npm test`
- `npm run build`
- Print/save one short and one multi-page report in a supported browser; confirm selectable text, no clipping, sensible page breaks, and no console error.
- `git diff --check`

### Failure reporting

Report only the failing command or one screenshot/description of the first print-layout defect.

## Implementation Prompt

```text
Read AI_DEVELOPMENT_WORKFLOW_V2.md and follow the repository documentation.

Implement task T012: Adopt Print-First Reports and Remove Raster PDF Dependencies.

CODEX ROUTING
Use: GPT-5.6 Terra · Medium
Why: the product decision is settled and the implementation is scoped.
Escalate to: GPT-5.6 Terra · High
ONLY IF browser print pagination crosses report data/template architecture or two targeted fixes fail.
If escalation is required, STOP and request the setting.

OBJECTIVE
Remove raster PDF generation and deliver accessible browser Print to PDF.

CONTEXT BOUNDARY
Inspect first:
- recorded PDF decision and README Reports section
- ReportGenerator and ReportTemplate
- print rules in globals.css
- only relevant package entries
Do not scan the repository.

REQUIREMENTS
- remove html2canvas/jsPDF code and dependencies
- keep searchable/selectable paginated output
- preserve accessible preview/loading/error/print controls
- retain react-to-print only if used

DO NOT MODIFY
- statistics, data-access contract, auth/security, unrelated UI, Tailwind major

ACCEPTANCE CRITERIA
- clean dependency/import state
- short and multi-page reports print without clipping and retain selectable text

VALIDATION ROUTING
Tier: V2
Executor: DEVELOPER
- Do not run broad validation yourself.
- Give me npm ci, lint, typecheck, tests, build, two print checks, and git diff --check.
- Leave the task awaiting my validation.

IMPLEMENTATION
Make one focused report/dependency change and do not implement T013.

OUTPUT
Return concise change, files, my validation, one commit message, and state.

PROJECT STATE
Promote T013 only after I report validation success.
```

## Completion Notes

Completed 2026-08-24. Removed the canvas/raster export and its two dependencies;
reports use browser Print/Save as PDF with scoped print rules. Short and
multi-page print acceptance is deferred to the developer.

# T013 — Complete Bounded Performance, Accessibility, and Responsive UX

Status: `DONE`

## Recommended Codex Setting

**Model:** `GPT-5.6 Terra`

**Effort:** `High`

**Use:** `GPT-5.6 Terra · High`

## Why This Setting

This is moderate cross-component performance and UX work with real-browser acceptance, after data and report contracts are stable.

## Escalation Path

Escalate to `GPT-5.6 Sol · Medium` if profiling reveals an unfamiliar architectural bottleneck, accessibility fixes conflict with chart-library constraints, or two targeted fixes fail across supported browsers.

## Objective

Profile the bounded envelope and fix only evidenced performance, accessibility, loading/error/empty, and responsive defects required for release.

## Dependencies

- T012.

## Inspect First

- `README.md` limits and browser baseline
- `components/OptimizedDatasetTabs.tsx`
- `components/AdvancedCharts.tsx`
- chart components actually implicated by profiling
- `components/AnalysisResults.tsx`
- `components/ReportGenerator.tsx`
- `app/data/page.tsx` and `app/upload/page.tsx`

## Likely Files to Modify

- Only components/routes with measured or manually reproduced defects
- focused tests where behavior is testable
- `app/globals.css` for scoped responsive/print/accessibility rules

## Do Not Modify

- Storage schema, analysis formulas, auth/RLS/quotas, dependency majors, public limits, or visual redesign without evidence.

## Acceptance Criteria

- [ ] The maximum supported envelope completes within the recorded processing deadline in the agreed test environment or the measured limitation is documented.
- [ ] Charts/tables/reports use bounded data and avoid repeated unnecessary computation.
- [ ] Keyboard focus, labels, headings, status announcements, contrast, and error/empty/loading states are usable.
- [ ] Supported mobile and desktop widths have no material clipping or unusable overflow.
- [ ] No broad aesthetic redesign or unrelated refactor is included.

## Validation Strategy

**Tier:** `V4`

**Executor:** `DEVELOPER`

### Codex validation

- Run only targeted tests needed during implementation.
- Hand deterministic full validation and browser acceptance to the developer.

### Developer validation

- `npm run lint`
- `npm run typecheck`
- `npm test`
- `npm run build`
- Test representative small and maximum-envelope CSVs; record processing time and browser console/network failures only.
- Keyboard-only smoke test and manual checks at 320, 768, 1024, and 1440 CSS pixels in supported browsers.
- Print smoke test after responsive changes.
- `git diff --check`

### Failure reporting

Report only the first reproducible defect, viewport/dataset parameters, and minimal console/network evidence.

## Implementation Prompt

```text
Read AI_DEVELOPMENT_WORKFLOW_V2.md and follow the repository documentation.

Implement task T013: Complete Bounded Performance, Accessibility, and Responsive UX.

CODEX ROUTING
Use: GPT-5.6 Terra · High
Why: moderate cross-component work based on measured defects.
Escalate to: GPT-5.6 Sol · Medium
ONLY IF profiling reveals an architectural bottleneck, chart constraints conflict with accessibility, or two targeted cross-browser fixes fail.
If escalation is required, STOP and request the setting.

OBJECTIVE
Fix evidenced release-blocking performance, accessibility, state, and responsive defects within the supported envelope.

CONTEXT BOUNDARY
Inspect first:
- README limits/browser baseline
- OptimizedDatasetTabs and AdvancedCharts
- only implicated chart components
- AnalysisResults, ReportGenerator, data/upload pages
Do not inspect unrelated files.

REQUIREMENTS
- measure/reproduce before changing
- preserve bounded data access
- cover keyboard/focus/labels/headings/status/contrast/states
- support 320/768/1024/1440 widths without material clipping

DO NOT MODIFY
- schema, statistics, security, dependency majors, limits, or broad visual design

ACCEPTANCE CRITERIA
- recorded envelope and browser checks pass or have an explicit blocker
- no unrelated refactor

VALIDATION ROUTING
Tier: V4
Executor: DEVELOPER
- Run only targeted tests needed to implement.
- Give me lint, typecheck, full tests, build, performance/browser/keyboard/print checks, and git diff --check.

IMPLEMENTATION
Fix only reproduced defects and do not implement T014.

OUTPUT
Return concise change, files, targeted checks, my acceptance steps, one commit message, and state.

PROJECT STATE
Promote T014 only after I report full validation success.
```

## Completion Notes

Completed 2026-08-24. Bounded chart/page data, authoritative totals, accessible
tabs/toggles/dialogs/statuses/errors, responsive controls, and keyboard-scrollable
correlation output were implemented. Manual viewport, keyboard, and envelope
timing checks are deferred to the developer.

# T014 — Complete Release Documentation and Controlled Production Readiness

Status: `DONE`

## Recommended Codex Setting

**Model:** `GPT-5.6 Sol`

**Effort:** `Medium`

**Use:** `GPT-5.6 Sol · Medium`

## Why This Setting

Most work is documentation and evidence synthesis, but final readiness crosses security, persistence, deployment, monitoring, rollback, and product limits.

## Escalation Path

Escalate to `GPT-5.6 Sol · High` only if release evidence exposes a security/data-integrity conflict, rollback is not safe, or required environment behavior contradicts repository documentation.

## Objective

Make setup, architecture, limits, security/retention, environment classification, deployment/recovery, and release gates accurate, then record a controlled launch or keep-disabled decision.

## Dependencies

- T013.

## Inspect First

- `README.md`
- `MODERNIZATION_WORKLOG.md` current status and deferred risks
- `DECISION.md`
- `supabase/PHASE_2_DEPLOYMENT.md` and the approved storage deployment guide
- `.env.example`
- `.github/workflows/ci.yml`
- `package.json` commands only

## Likely Files to Modify

- `README.md`
- `MODERNIZATION_WORKLOG.md`
- `DECISION.md` only for genuine long-lived decisions
- deployment/recovery guides
- `.env.example` only for names/classification, never values
- `PROJECT_TASKS.md`

## Do Not Modify

- Application code, migrations, dependencies, cloud configuration, credentials, or production data.
- Do not enable production uploads without explicit developer approval and complete evidence.

## Acceptance Criteria

- [ ] Documentation matches implemented architecture, commands, limits, environment variables, retention/security, statistics, reporting, and storage.
- [ ] Deployment, monitoring, incident disablement, rollback/roll-forward, and recovery steps are explicit.
- [ ] CI and full local quality suite pass from a clean install.
- [ ] Environment/browser acceptance and owner-isolation/expiry/cleanup/quotas are reconfirmed.
- [ ] Every deferred risk has an owner/disposition; no stale branch/status text remains.
- [ ] Production launch or keep-disabled decision is explicit and evidence-backed.

## Validation Strategy

**Tier:** `V4`

**Executor:** `HYBRID`

### Codex validation

- Cross-check documentation against only the named source-of-truth files.
- Run `git diff --check` for documentation edits.
- Review concise CI/environment evidence; do not operate cloud accounts.

### Developer validation

- `npm ci`
- `npm run lint`
- `npm run typecheck`
- `npm test`
- `npm run build`
- Confirm the latest `master` CI run succeeds.
- Perform the approved browser, isolation, quota, expiry, cleanup, monitoring, deployment, and rollback checklist.
- `git diff --check`
- `git status --short`

### Failure reporting

Report only the failing command/gate and first/root error. Do not paste secrets, full CI logs, or broad cloud output.

## Implementation Prompt

```text
Read AI_DEVELOPMENT_WORKFLOW_V2.md and follow the repository documentation.

Implement task T014: Complete Release Documentation and Controlled Production Readiness.

CODEX ROUTING
Use: GPT-5.6 Sol · Medium
Why: final evidence synthesis crosses security, persistence, deployment, monitoring, rollback, and product limits.
Escalate to: GPT-5.6 Sol · High
ONLY IF evidence exposes a security/data-integrity conflict, rollback is unsafe, or environment behavior contradicts documentation.
If escalation is required, STOP and request the setting.

OBJECTIVE
Make release documentation accurate and record an evidence-backed launch or keep-disabled decision.

CONTEXT BOUNDARY
Inspect first:
- README.md
- current/deferred sections of MODERNIZATION_WORKLOG.md
- DECISION.md
- deployment/recovery guides
- .env.example, CI workflow, package commands only
Do not scan the repository.

REQUIREMENTS
- document implemented architecture, limits, statistics, reporting, storage, security/retention, environments, monitoring, deployment, incident response, and recovery
- dispose every deferred risk
- never include secrets
- require explicit approval before enabling production uploads

DO NOT MODIFY
- application code, migrations, dependencies, cloud state, credentials, production data

ACCEPTANCE CRITERIA
- docs match reality
- clean local/CI and environment acceptance pass
- launch/keep-disabled decision is explicit

VALIDATION ROUTING
Tier: V4
Executor: HYBRID
- Run git diff --check for doc edits.
- I will run the clean quality suite and all cloud/browser acceptance.
- Review only concise pass/failure evidence.

IMPLEMENTATION
Update only release/project-state documentation. Do not make application or cloud changes.

OUTPUT
Return concise state, files, evidence reviewed, my remaining actions, one commit message, and task state.

PROJECT STATE
Mark T014 DONE only after all required validation and the explicit production decision are recorded. Do not invent another READY task unless new required work is discovered.
```

## Completion Notes

Completed 2026-08-24 under the keep-production-disabled path. Documentation now
matches statistics, row storage, bounded reads, print-first reports, deployment,
recovery, and incident controls. Automated quality gates pass. The developer
explicitly deferred cloud/browser acceptance; those gates remain documented as
launch blockers and Production uploads remain unapproved and disabled. Clean
`npm ci`, lint, type-check, 29/29 tests, production build, and
`git diff --check` passed.

## Validation Completion Prompt

```text
VALIDATION PASS — <TASK_ID>.

Update project state only:
- mark <TASK_ID> DONE,
- add concise validation evidence,
- promote the next eligible task to READY,
- re-evaluate its model, effort, validation tier, and executor,
- update MODERNIZATION_WORKLOG.md,
- update DECISION.md only for a genuine long-lived decision,
- suggest one commit message.

Do not change application code.
Do not implement the next task.
```

## Failed Validation Prompt

```text
VALIDATION FAIL — <TASK_ID>

Command/check:
<command or check>

First/root failure:
<minimal error or evidence>

Investigate only this failure first.
Do not rerun the full suite until the targeted failure passes.
Follow the task's escalation rule if the root cause exceeds the current model.
```
