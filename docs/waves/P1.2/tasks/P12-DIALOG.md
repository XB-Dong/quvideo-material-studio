# P12-DIALOG

- taskId: P12-DIALOG
- rootTaskId: P12-DIALOG
- waveId: P1.2
- roundId: P12-R1
- status: ready_after_dependencies
- role: Frontend
- baseCommit: 33170a5ae33cc63882f73c329dbd88eda6f5e70c
- baseCommitMeaning: authorized P12-R1 source baseline; later integration SHA recorded separately
- specVersion: P1.2-1.0.0
- requirementIds: P12-DIALOG-01, P12-STATE-01, P12-A11Y-01
- dependencies: P12-HISTORY
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

Read AGENTS, CONSTITUTION, docs/agents/PROTOCOL, P1.2 PLAN/ROLES/CONTEXT-MAP/ACCEPTANCE/state and specs/p1.2. Preparation only; not execution authorization. Final P1.1 CI is prerequisite. The user authorized automatic start after preparation review/data checks pass; no further confirmation is required. Leader refreshes the precise reachable SHA and owner before dispatch.

## Goal

Complete native dialogs/result zoom and route loading/error/not-found/global-safe fallback.

## Allowed write paths

- frontend/src/components/{shell,history}.tsx (visual only)
- frontend/src/app/{loading,error,not-found,global-error}.tsx
- frontend/src/components/motion/
- page-scoped styles/own tests

## Observable acceptance

ESC/focus/session/unmount immediately clear private visuals; loading/404/error semantic paths remain direct.

## Handoff and limits

Use handoffs/TEMPLATE.md. All product installs/build/tests/runtime in containers after preparation gates and authorized dispatch. Preserve protected API/query/session logic, upload version/controller/blob handling, submission locks/epoch and server-owned task stages. Native chooser/Link action never waits for animation. No private snapshots, no mail work, no root lock/CI shared writes without recorded ownership, no public deployment/exam submission/next wave. Actual model unknown=null; retain failures under this rootTaskId.
