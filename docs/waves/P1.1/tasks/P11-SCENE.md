# P11-SCENE

- taskId: P11-SCENE
- rootTaskId: P11-SCENE
- waveId: P1.1
- roundId: P11-R1
- status: prepared_not_dispatched
- role: Frontend
- baseCommit: c1d3efc8b5710e1f99c0d45e09c7023aa95b99ef
- baseCommitMeaning: authorized execution source baseline; record later integrated SHAs separately
- specVersion: P1.1-1.0.0
- requirementIds: P11-INK-01, P11-EDGE-01, P11-QUALITY-01
- dependencies: P11-BRAND, P11-ASSET
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

Read AGENTS.md, CONSTITUTION.md, docs/agents/PROTOCOL.md, docs/waves/P1.1/PLAN.md, ROLES.md, CONTEXT-MAP.md, ACCEPTANCE.md, state.json and specs/p1.1/{requirements,design,effects,assets,ci-mail}.md. User explicitly started P1.1 on 2026-10-30. Execute only when Leader dispatches this task; source baseline is the exact baseCommit above.

## Goal

Implement clear/fog trail and at least3 distinguishable dynamic borders, with visible software 2D/CSS/SVG base paths and optional single-GPU enhancement.

## Allowed write paths

- frontend/src/components/creative/
- frontend/src/components/react-bits/
- frontend/src/app/globals.css
- frontend/src/components/* own visual behavior tests

## Observable acceptance

Real default-driver dynamic evidence, bounded resources, no overlay blocking, source/adaptation license preserved; no UI effect annotations.

## Handoff and limits

Use docs/waves/P1.1/handoffs/TEMPLATE.md. All product install/build/test/runtime commands in containers after authorization. Keep P0 protected API/query/session code and data unchanged; no global-mail setting, real-email send, credentials in Git, public deployment or automatic next wave. Single file owner; stop and transfer before touching shared paths.
