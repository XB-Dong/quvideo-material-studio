# P12-ROUTE

- taskId: P12-ROUTE
- rootTaskId: P12-ROUTE
- waveId: P1.2
- roundId: P12-R1
- status: ready_after_dependencies
- role: Frontend
- baseCommit: 33170a5ae33cc63882f73c329dbd88eda6f5e70c
- baseCommitMeaning: authorized P12-R1 source baseline; later integration SHA recorded separately
- specVersion: P1.2-1.0.1
- requirementIds: P12-HOME-01, P12-ROUTE-01
- dependencies: P12-FOUND
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

Read AGENTS, CONSTITUTION, docs/agents/PROTOCOL, P1.2 PLAN/ROLES/CONTEXT-MAP/ACCEPTANCE/state and specs/p1.2. Execution is authorized after the preparation seal at71bccc5; the verified P1.1 CI base is a7cdcdf. The user authorized automatic start after preparation review/data checks pass; no further confirmation is required. Leader refreshes the precise reachable SHA and owner before dispatch.

## Goal

Connect real Link navigation, public-cover native transitions and CSS entry/fallback.

## Allowed write paths

- frontend/src/app/template.tsx
- frontend/src/components/{catalog,shell,creative/showcase}.tsx (visual routing only)
- frontend/src/components/motion/route-surface.tsx
- page-scoped styles/own tests

## Observable acceptance

Immediate navigation, no private/root snapshot, fast repeated/back/forward/modified click and fallback correct.

## Handoff and limits

Use handoffs/TEMPLATE.md. All product installs/build/tests/runtime in containers after preparation gates and authorized dispatch. Preserve protected API/query/session logic, upload version/controller/blob handling, submission locks/epoch and server-owned task stages. Native chooser/Link action never waits for animation. No private snapshots, no mail work, no root lock/CI shared writes without recorded ownership, no public deployment/exam submission/next wave. Actual model unknown=null; retain failures under this rootTaskId.
