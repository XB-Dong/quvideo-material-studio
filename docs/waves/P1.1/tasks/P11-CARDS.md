# P11-CARDS

- taskId: P11-CARDS
- rootTaskId: P11-CARDS
- waveId: P1.1
- roundId: P11-R1
- status: completed
- role: Frontend
- baseCommit: c1d3efc8b5710e1f99c0d45e09c7023aa95b99ef
- baseCommitMeaning: authorized execution source baseline; record later integrated SHAs separately
- specVersion: P1.1-1.0.1
- requirementIds: P11-CARD-01, P11-AUTO-01, P11-REG-01
- dependencies: P11-SCENE
- runtimeDependencies: none
- requestedModel: inherit_current_session
- requestedReasoningEffort: inherit_current_session
- actualProvider: null
- actualModel: null
- actualReasoningEffort: null
- modelVerificationStatus: not_verified
- focusedCheckInMinutes: 60_to_90
- cumulativeRepairCount: 1
- sameRootCauseReassessmentAfter: 2_unsuccessful_repairs

## Context and authorization

Read AGENTS.md, CONSTITUTION.md, docs/agents/PROTOCOL.md, docs/waves/P1.1/PLAN.md, ROLES.md, CONTEXT-MAP.md, ACCEPTANCE.md, state.json and specs/p1.1/{requirements,design,effects,assets,ci-mail}.md. User explicitly started P1.1 on 2026-10-30. Execute only when Leader dispatches this task; source baseline is the exact baseCommit above.

## Goal

Remove standalone gallery and migrate4 effects into actual stable-ID Link cards; normal Orbit/border continuous, unchanged business metadata.

## Allowed write paths

- frontend/src/components/catalog.tsx
- frontend/src/components/creative/
- frontend/src/app/globals.css
- frontend/src/components/studio.tsx (visual only)
- frontend/src/components/history.tsx (visual only)
- own behavior tests

## Observable acceptance

Click/Tab Enter/first touch navigate directly, no classification cross-talk, no gallery leftovers or manual controls, current visual data fetched from Java.

## Handoff and limits

Use docs/waves/P1.1/handoffs/TEMPLATE.md. All product install/build/test/runtime commands in containers after authorization. Keep P0 protected API/query/session code and data unchanged; no global-mail setting, real-email send, credentials in Git, public deployment or automatic next wave. Single file owner; stop and transfer before touching shared paths.
