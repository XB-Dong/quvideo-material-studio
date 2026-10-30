# P11-BRAND

- taskId: P11-BRAND
- rootTaskId: P11-BRAND
- waveId: P1.1
- roundId: assigned_at_dispatch
- status: prepared_not_dispatched
- role: Frontend
- baseCommit: e485792839d6c3af1a6587a8964f983250366b39
- baseCommitMeaning: P1 sealed preparation anchor; refresh exact integrated SHA at authorized dispatch
- specVersion: P1.1-1.0.0
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
- cumulativeRepairCount: 0_preparation_only
- sameRootCauseReassessmentAfter: 2_unsuccessful_repairs

## Context and authorization

Read AGENTS.md, CONSTITUTION.md, docs/agents/PROTOCOL.md, docs/waves/P1.1/PLAN.md, ROLES.md, CONTEXT-MAP.md, ACCEPTANCE.md, state.json and specs/p1.1/{requirements,design,effects,assets,ci-mail}.md. This preparation packet is not execution authorization. Leader refreshes precise base before dispatch.

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
