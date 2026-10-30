# P12-BASE

- taskId: P12-BASE
- rootTaskId: P12-BASE
- waveId: P1.2
- roundId: P12-R1
- status: completed
- role: Leader
- baseCommit: 33170a5ae33cc63882f73c329dbd88eda6f5e70c
- baseCommitMeaning: authorized P12-R1 source baseline; later integration SHA recorded separately
- specVersion: P1.2-1.0.1
- requirementIds: P12-PERF-01, P12-DEL-01
- dependencies: none
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

Refresh the final P1.1 exact base; verify React19.3/native transitions and pinned devtypes19.3.0 in containers; freeze baseline and ownership.

## Allowed write paths

- frontend/package.json and package-lock.json (Leader only)
- root CI/Compose and docs/waves/P1.2/evidence/baseline/

## Observable acceptance

Actual APIs/typecheck/build and public-only transition fallback proven before consumers; no service/DB reset. Record navigation, old upload/submission/poll abort+unmount and transition-finished timestamps: native VT must not defer business cleanup until finished. Otherwise choose the complete Link+CSS/WAAPI public-image fallback without changing protected protocols or weakening cancellation assertions.

## Handoff and limits

Use handoffs/TEMPLATE.md. All product installs/build/tests/runtime in containers after preparation gates and authorized dispatch. Preserve protected API/query/session logic, upload version/controller/blob handling, submission locks/epoch and server-owned task stages. Native chooser/Link action never waits for animation. No private snapshots, no mail work, no root lock/CI shared writes without recorded ownership, no public deployment/exam submission/next wave. Actual model unknown=null; retain failures under this rootTaskId.
