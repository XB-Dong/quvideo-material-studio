# P11-CI-MAIL

- taskId: P11-CI-MAIL
- rootTaskId: P11-CI-MAIL
- waveId: P1.1
- roundId: P11-R1
- status: waiting_mailbox_connection
- role: Leader
- baseCommit: c1d3efc8b5710e1f99c0d45e09c7023aa95b99ef
- baseCommitMeaning: authorized execution source baseline; record later integrated SHAs separately
- specVersion: P1.1-1.0.0
- requirementIds: P11-MAIL-01
- dependencies: P11-BASE
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

Read AGENTS.md, CONSTITUTION.md, docs/agents/PROTOCOL.md, docs/waves/P1.1/PLAN.md, ROLES.md, CONTEXT-MAP.md, ACCEPTANCE.md, state.json and specs/p1.1/{requirements,design,effects,assets,ci-mail}.md. User explicitly started P1.1 on 2026-10-30. Execute only when Leader dispatches this task; source baseline is the exact baseCommit above.

## Goal

Verify actual receiving mailbox and preview repository-only Actions predicate, apply reversible scoped archive/label rule, preserve real CI.

## Allowed write paths

- .github/workflows/
- docs/waves/P1.1/evidence/
- README.md
- confirmed mailbox filter configuration (execution only)

## Observable acceptance

Sanitized positive/negative matching and active-rule evidence; other repositories, PR/security mail and account settings unaffected; finish before first remote push.

## Handoff and limits

Use docs/waves/P1.1/handoffs/TEMPLATE.md. All product install/build/test/runtime commands in containers after authorization. Keep P0 protected API/query/session code and data unchanged; no global-mail setting, real-email send, credentials in Git, public deployment or automatic next wave. Single file owner; stop and transfer before touching shared paths.
