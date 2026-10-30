# P12-REVIEW

- taskId: P12-REVIEW
- rootTaskId: P12-REVIEW
- waveId: P1.2
- roundId: P12-R1
- status: ready_after_dependencies
- role: Reviewer
- baseCommit: 33170a5ae33cc63882f73c329dbd88eda6f5e70c
- baseCommitMeaning: authorized P12-R1 source baseline; later integration SHA recorded separately
- specVersion: P1.2-1.0.0
- requirementIds: P12-HOME-01, P12-QUALITY-01
- dependencies: P12-ROUTE
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

Review actual intermediate/final subpages and action sequences, with homepage regression baseline.

## Allowed write paths

- assigned docs/waves/P1.2/reviews/ artifact only

## Observable acceptance

Each page/dialog/boundary each5dimensions>=4/5; no static-only sign-off, no source/product edits.

## Handoff and limits

Use handoffs/TEMPLATE.md. All product installs/build/tests/runtime in containers after preparation gates and authorized dispatch. Preserve protected API/query/session logic, upload version/controller/blob handling, submission locks/epoch and server-owned task stages. Native chooser/Link action never waits for animation. No private snapshots, no mail work, no root lock/CI shared writes without recorded ownership, no public deployment/exam submission/next wave. Actual model unknown=null; retain failures under this rootTaskId.
