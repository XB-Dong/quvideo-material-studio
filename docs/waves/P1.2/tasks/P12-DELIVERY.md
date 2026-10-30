# P12-DELIVERY

- taskId: P12-DELIVERY
- rootTaskId: P12-DELIVERY
- waveId: P1.2
- roundId: P12-R1
- status: ready_after_dependencies
- role: Leader
- baseCommit: 33170a5ae33cc63882f73c329dbd88eda6f5e70c
- baseCommitMeaning: authorized P12-R1 source baseline; later integration SHA recorded separately
- specVersion: P1.2-1.0.0
- requirementIds: P12-DEL-01
- dependencies: P12-ACCEPT, P12-REVIEW
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

Integrate exact source, run full CI, sign report/rollback/AI effort/provenance and package source.

## Allowed write paths

- shared root CI/Compose/docs/state/notices
- integration and external source archive

## Observable acceptance

All required checks/gates passed on named source; preserve source/evidence and stop, no next wave or mail work.

## Handoff and limits

Use handoffs/TEMPLATE.md. All product installs/build/tests/runtime in containers after preparation gates and authorized dispatch. Preserve protected API/query/session logic, upload version/controller/blob handling, submission locks/epoch and server-owned task stages. Native chooser/Link action never waits for animation. No private snapshots, no mail work, no root lock/CI shared writes without recorded ownership, no public deployment/exam submission/next wave. Actual model unknown=null; retain failures under this rootTaskId.
