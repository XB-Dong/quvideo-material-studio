# P11-ACCEPT

- taskId: P11-ACCEPT
- rootTaskId: P11-ACCEPT
- waveId: P1.1
- roundId: P11-R1
- status: completed
- role: Acceptance
- baseCommit: c1d3efc8b5710e1f99c0d45e09c7023aa95b99ef
- baseCommitMeaning: authorized execution source baseline; record later integrated SHAs separately
- specVersion: P1.1-1.0.1
- requirementIds: P11-QUALITY-01, P11-REG-01
- dependencies: P11-BASE
- runtimeDependencies: P11-CARDS
- requestedModel: inherit_current_session
- requestedReasoningEffort: inherit_current_session
- actualProvider: null
- actualModel: null
- actualReasoningEffort: null
- modelVerificationStatus: not_verified
- focusedCheckInMinutes: 60_to_90
- cumulativeRepairCount: 3
- sameRootCauseReassessmentAfter: 2_unsuccessful_repairs

## Context and authorization

Read AGENTS.md, CONSTITUTION.md, docs/agents/PROTOCOL.md, docs/waves/P1.1/PLAN.md, ROLES.md, CONTEXT-MAP.md, ACCEPTANCE.md, state.json and specs/p1.1/{requirements,design,effects,assets,ci-mail}.md. User explicitly started P1.1 on 2026-10-30. Execute only when Leader dispatches this task; source baseline is the exact baseCommit above.

## Goal

Independently verify default dynamics, all-image per-request budgets, true background/coarse, card navigation and P0 business; audit scoped-mail evidence.

Visual and business verification may start when P11-CARDS is integrated. The latest user instruction defers P11-CI-MAIL, which no longer blocks sign-off. Preserve all existing technical/comfort checks and mark mail deferred, not solved.

## Allowed write paths

- tests/p1.1/
- explicitly transferred shared measurement helpers
- docs/waves/P1.1/evidence/acceptance/
- docs/waves/P1.1/handoffs/acceptance.md

## Observable acceptance

Independent G02 and exact-source raw reports, preserve failures, no product fixes by test author and no fixture substituted for default software visibility.

## Handoff and limits

Use docs/waves/P1.1/handoffs/TEMPLATE.md. All product install/build/test/runtime commands in containers after authorization. Keep P0 protected API/query/session code and data unchanged; no global-mail setting, real-email send, credentials in Git, public deployment or automatic next wave. Single file owner; stop and transfer before touching shared paths.
