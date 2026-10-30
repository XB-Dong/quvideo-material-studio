# P11-BRAND

- taskId: P11-BRAND
- rootTaskId: P11-BRAND
- waveId: P1.1
- roundId: P11-R1
- status: completed
- role: Frontend
- baseCommit: c1d3efc8b5710e1f99c0d45e09c7023aa95b99ef
- baseCommitMeaning: authorized execution source baseline; record later integrated SHAs separately
- specVersion: P1.1-1.0.1
- requirementIds: P11-BRAND-01, P11-AUTO-01, P11-REG-01
- dependencies: P11-BASE
- runtimeDependencies: none
- requestedModel: inherit_current_session
- requestedReasoningEffort: inherit_current_session
- actualProvider: null
- actualModel: null
- actualReasoningEffort: null
- modelVerificationStatus: not_verified
- focusedCheckInMinutes: 60_to_90
- cumulativeRepairCount: 0
- sameRootCauseReassessmentAfter: 2_unsuccessful_repairs

## Context and authorization

Read AGENTS.md, CONSTITUTION.md, docs/agents/PROTOCOL.md, docs/waves/P1.1/PLAN.md, ROLES.md, CONTEXT-MAP.md, ACCEPTANCE.md, state.json and specs/p1.1/{requirements,design,effects,assets,ci-mail}.md. User explicitly started P1.1 on 2026-10-30. Execute only when Leader dispatches this task; source baseline is the exact baseCommit above.

## Goal

Rename visible brand, remove controls and old static-preference influence, keep automatic policy and identity/query lifetime.

## Allowed write paths

- frontend/src/components/shell.tsx
- frontend/src/app/layout.tsx
- frontend/public/icon.svg
- frontend/src/components/motion/
- frontend/src/components/providers.tsx (motion wrapper only)
- frontend/src/components/motion.test.tsx

## Observable acceptance

No visible old brand/control or hidden substitute; legacy visual key true still normal dynamic; no session reset.

## Handoff and limits

Use docs/waves/P1.1/handoffs/TEMPLATE.md. All product install/build/test/runtime commands in containers after authorization. Keep P0 protected API/query/session code and data unchanged; no global-mail setting, real-email send, credentials in Git, public deployment or automatic next wave. Single file owner; stop and transfer before touching shared paths.
