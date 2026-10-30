# P11-ASSET

- taskId: P11-ASSET
- rootTaskId: P11-ASSET
- waveId: P1.1
- roundId: assigned_at_dispatch
- status: prepared_not_dispatched
- role: Asset
- baseCommit: e485792839d6c3af1a6587a8964f983250366b39
- baseCommitMeaning: P1 sealed preparation anchor; refresh exact integrated SHA at authorized dispatch
- specVersion: P1.1-1.0.0
- requirementIds: P11-INK-01, P11-QUALITY-01
- dependencies: P11-BASE
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

Read AGENTS.md, CONSTITUTION.md, docs/agents/PROTOCOL.md, docs/waves/P1.1/PLAN.md, ROLES.md, CONTEXT-MAP.md, ACCEPTANCE.md, state.json and specs/p1.1/{requirements,design,effects,assets,ci-mail}.md. This preparation packet is not execution authorization. Leader refreshes precise base before dispatch.

## Goal

Create local cold-light ink derivative from verified public-domain painting and original brand-independent background resource; retain exact source/crop/encoding provenance.

## Allowed write paths

- frontend/public/ink/
- assets/p1.1/
- docs/waves/P1.1/evidence/assets/
- docs/waves/P1.1/handoffs/asset.md

## Observable acceptance

Target64KiB/max80KiB master, readable clear/fog states, reproducible container conversion, no old JPEG/PNG/Java/SQL modification.

## Handoff and limits

Use docs/waves/P1.1/handoffs/TEMPLATE.md. All product install/build/test/runtime commands in containers after authorization. Keep P0 protected API/query/session code and data unchanged; no global-mail setting, real-email send, credentials in Git, public deployment or automatic next wave. Single file owner; stop and transfer before touching shared paths.
