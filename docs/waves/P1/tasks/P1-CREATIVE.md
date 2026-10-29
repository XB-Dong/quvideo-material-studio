# P1-CREATIVE

- taskId: P1-CREATIVE
- rootTaskId: P1-CREATIVE
- waveId: P1
- roundId: assigned_at_dispatch
- status: prepared_not_dispatched
- role: Frontend Visual/Creative/Motion
- baseCommit: 07300db74eefe5d8d1ecf979de314450bf5f2a78
- baseCommitMeaning: P0 sealed preparation anchor; Leader replaces with exact active integrated commit and records revision before dispatch
- specVersion: P1-1.1.0
- requirementIds: P1-CREATIVE-01, P1-REVIEW-01, P1-QUALITY-01, P1-REG-01
- dependencies: P1-VISUAL
- requestedModel: inherit_current_session
- requestedReasoningEffort: inherit_current_session
- actualProvider: null
- actualModel: null
- actualReasoningEffort: null
- modelVerificationStatus: not_verified
- contextMode: self_contained_packet_with_scoped_specs
- focusedCheckInMinutes: 60_to_90
- cumulativeRepairCount: 0
- sameRootCauseReassessmentAfter: 2_unsuccessful_repairs
- reviewer: independent_acceptance_or_reviewer_and_Leader_disposition

## Context and authorization

Read AGENTS.md, CONSTITUTION.md, docs/agents/PROTOCOL.md, docs/waves/P1/PLAN.md, docs/waves/P1/ROLES.md, docs/waves/P1/CONTEXT-MAP.md, docs/waves/P1/state.json, docs/waves/P1/ACCEPTANCE.md, specs/p1/requirements.md, specs/p1/design.md, specs/p1/motion.md, specs/p1/assets.md, specs/p1/react-bits.md, plus specs/api.yaml, specs/frontend-state.md and docs/waves/P0/REPORT.md. This packet is preparation, not P1 execution authorization. Verify precise base and ownership before work.

## Goal

Same frontend writer integrates all seven specified TS-CSS React Bits components after visual handoff. Implement purposeful placements, mutually exclusive four-tab effects, lazy static-first rendering and an effect controller for preferences/visibility/pointer/concurrency/performance. Preserve license/copyright/source hashes and record local adaptations.

## Allowed write paths

- frontend/src/app/globals.css
- frontend/src/styles/
- frontend/src/components/catalog.tsx
- frontend/src/components/studio.tsx
- frontend/src/components/history.tsx
- frontend/src/components/shell.tsx
- frontend/src/components/providers.tsx
- frontend/src/components/motion/
- frontend/src/components/react-bits/ (vendored sources, full upstream license and local adaptation log)
- frontend/src/components/creative/
- docs/waves/P1/evidence/creative/
- frontend/src/components/*.test.tsx
- frontend/src/lib/*.test.tsx

Write only assigned paths. Shared dependencies/CI/contracts need recorded Leader ownership transfer. Do not edit protected P0 API/query/session/submission generation logic to accommodate animation. A broad test directory does not authorize rewriting existing tests to conceal failure. Read-only relevant source access is allowed.

## Acceptance

- RB01–RB07 all demonstrable on normal desktop; use only public images, never distort private uploads/results or replace native cursor/focus.
- At most two active motion systems and one allocated/live WebGL context; ownership transfer must dispose/unmount the previous context before creating the next (pausing RAF is insufficient); tabs mount one effect, pause/degrade on idle/offscreen/background/reduce/static/coarse-pointer as specified. Resource cleanup is immediate on unmount or preference changes.
- Source notice and MIT + Commons Clause retained; registry vs commit equivalence explicitly verified or source revision recorded separately. No unreviewed CLI script execution.
- Measure initial JS +35KiB and total added lazy creative JS +120KiB budgets including Motion/OGL/adapters, image +800KiB first viewport budget. Record actual numbers and unresolved risks.
- Implement meaningful controller/cleanup/fallback tests; provide actual component interaction evidence for later independent aesthetics/comfort review. Passing static mode alone is insufficient.

## Handoff

Use docs/waves/P1/handoffs/TEMPLATE.md. Include exact implementation/tested SHA, changed paths, requirement mapping, environment, commands/operations, times, exit codes, source/asset metadata, failed checks, findings and limits. Preserve rootTaskId and cumulative repairs. No unsupported runtime/model claims.
