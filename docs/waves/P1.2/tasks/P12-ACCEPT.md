# P12-ACCEPT

- taskId: P12-ACCEPT
- rootTaskId: P12-ACCEPT
- waveId: P1.2
- roundId: assigned_at_authorized_dispatch
- status: prepared_not_dispatched
- role: Acceptance
- baseCommit: a7cdcdfe4a0dd38db1763b436ed67c6cedf76d76
- baseCommitMeaning: preparation source anchor; replace with exact final P1.1/next integrated SHA at authorized dispatch
- specVersion: P1.2-1.0.0
- requirementIds: P12-UPLOAD-01, P12-TASK-01, P12-A11Y-01, P12-PERF-01
- dependencies: P12-BASE
- runtimeDependencies: P12-DIALOG
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

Independently verify all motions, immediate chooser/navigation, original business, per-page budgets and lifecycle.

## Allowed write paths

- tests/p1.2/
- docs/waves/P1.2/evidence/acceptance/
- docs/waves/P1.2/handoffs/acceptance.md

## Observable acceptance

Real default-driver/coarse/keyboard/native background plus protected31/15/8; retain all failed evidence, no product fixes.

## Handoff and limits

Use handoffs/TEMPLATE.md. All product installs/build/tests/runtime in containers after preparation gates and authorized dispatch. Preserve protected API/query/session logic, upload version/controller/blob handling, submission locks/epoch and server-owned task stages. Native chooser/Link action never waits for animation. No private snapshots, no mail work, no root lock/CI shared writes without recorded ownership, no public deployment/exam submission/next wave. Actual model unknown=null; retain failures under this rootTaskId.
