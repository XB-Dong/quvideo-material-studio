# P11-REVIEW

- taskId: P11-REVIEW
- rootTaskId: P11-REVIEW
- waveId: P1.1
- roundId: P11-R1
- status: prepared_not_dispatched
- role: Reviewer
- baseCommit: c1d3efc8b5710e1f99c0d45e09c7023aa95b99ef
- baseCommitMeaning: authorized execution source baseline; record later integrated SHAs separately
- specVersion: P1.1-1.0.0
- requirementIds: P11-QUALITY-01, P11-EDGE-01, P11-CARD-01
- dependencies: P11-ASSET
- runtimeDependencies: P11-CARDS
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

Read-only review actual normal-mode moving interface; verify more creative yet usable, light ink aesthetic and functional card integration.

## Allowed write paths

- docs/waves/P1.1/reviews/implementation-review.md

## Observable acceptance

Independent G01 five dimensions each>=4/5, actionable findings and exact-source retest; preparation board is not a product score.

## Handoff and limits

Use docs/waves/P1.1/handoffs/TEMPLATE.md. All product install/build/test/runtime commands in containers after authorization. Keep P0 protected API/query/session code and data unchanged; no global-mail setting, real-email send, credentials in Git, public deployment or automatic next wave. Single file owner; stop and transfer before touching shared paths.
