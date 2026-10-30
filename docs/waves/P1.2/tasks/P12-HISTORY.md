# P12-HISTORY

- taskId: P12-HISTORY
- rootTaskId: P12-HISTORY
- waveId: P1.2
- roundId: assigned_at_authorized_dispatch
- status: prepared_not_dispatched
- role: Frontend
- baseCommit: a7cdcdfe4a0dd38db1763b436ed67c6cedf76d76
- baseCommitMeaning: preparation source anchor; replace with exact final P1.1/next integrated SHA at authorized dispatch
- specVersion: P1.2-1.0.0
- requirementIds: P12-SCENE-01, P12-TASK-01, P12-STATE-01
- dependencies: P12-STUDIO
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

Animate embedded and standalone records by stable IDs/real server state, capped list layout and empty/query states.

## Allowed write paths

- frontend/src/components/history.tsx (visual only)
- frontend/src/components/motion/
- page-scoped styles/own tests

## Observable acceptance

Independent multi-task states, no refetch celebration/reorder, existing terminal and active tracking unchanged.

## Handoff and limits

Use handoffs/TEMPLATE.md. All product installs/build/tests/runtime in containers after preparation gates and authorized dispatch. Preserve protected API/query/session logic, upload version/controller/blob handling, submission locks/epoch and server-owned task stages. Native chooser/Link action never waits for animation. No private snapshots, no mail work, no root lock/CI shared writes without recorded ownership, no public deployment/exam submission/next wave. Actual model unknown=null; retain failures under this rootTaskId.
