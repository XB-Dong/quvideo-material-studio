# P1-ASSET

- taskId: P1-ASSET
- rootTaskId: P1-ASSET
- waveId: P1
- roundId: assigned_at_dispatch
- status: prepared_not_dispatched
- role: Asset Integration
- baseCommit: 07300db74eefe5d8d1ecf979de314450bf5f2a78
- baseCommitMeaning: P0 sealed preparation anchor; Leader replaces with exact active integrated commit and records revision before dispatch
- specVersion: P1-1.1.0
- requirementIds: P1-VIS-02, P1-REG-01, P1-DEL-01
- dependencies: P1-BASE, P1-DIRECTION
- requestedModel: inherit_current_session
- requestedReasoningEffort: inherit_current_session
- actualProvider: null
- actualModel: null
- actualReasoningEffort: null
- modelVerificationStatus: not_verified
- contextMode: self_contained_packet_with_scoped_specs
- focusedCheckInMinutes: 60_to_90
- cumulativeRepairCount: 0
- sameRootCauseReassessmentAfter: 2_unsuccessful_repairs
- reviewer: independent_acceptance_or_reviewer_and_Leader_disposition

## Context and authorization

Read AGENTS.md, CONSTITUTION.md, docs/agents/PROTOCOL.md, docs/waves/P1/PLAN.md, docs/waves/P1/ROLES.md, docs/waves/P1/CONTEXT-MAP.md, docs/waves/P1/state.json, docs/waves/P1/ACCEPTANCE.md, specs/p1/requirements.md, specs/p1/design.md, specs/p1/motion.md, specs/p1/assets.md, specs/p1/react-bits.md, plus specs/api.yaml, specs/frontend-state.md and docs/waves/P0/REPORT.md. This packet is preparation, not P1 execution authorization. Verify precise base and ownership before work.

## Goal

Produce licensed local image derivatives with truthful formats and correct framing. Extend allowlist/MIME minimally, add only V3 updating template image keys, retain V1/V2, old images and all historical task bytes.

## Allowed write paths

- backend/src/main/resources/demo/
- backend/src/main/resources/db/migration/V3__p1_visual_assets.sql
- backend/src/main/java/com/quvideo/studio/FilesService.java
- backend/src/main/java/com/quvideo/studio/Api.java (public demo MIME response only; private task-result behavior unchanged)
- backend/scripts/
- backend/src/test/
- docs/waves/P1/evidence/assets/
- docs/waves/P1/evidence/assets/NOTICE-additions.md (Leader integrates root THIRD-PARTY-NOTICES.md)

Write only assigned paths. Shared dependencies/CI/contracts need recorded Leader ownership transfer. Do not edit protected P0 API/query/session/submission generation logic to accommodate animation. A broad test directory does not authorize rewriting existing tests to conceal failure. Read-only relevant source access is allowed.

## Acceptance

- Four JPEG covers and actual PNG results decode and serve correct Content-Type; public demo MIME follows explicit allowed keys. Retain old PNGs and private-result serving behavior.
- Record authors/source/license/hash/dimensions/size, compare old result hashes across upgrade.
- Validate P0 → P1 → matched pre-upgrade DB/file snapshot rollback to P0 → P1 again in containers, including Flyway history/V3 reapplication. No key-only SQL rollback leaving V3 applied; record the restored data window.

## Handoff

Use docs/waves/P1/handoffs/TEMPLATE.md. Include exact implementation/tested SHA, changed paths, requirement mapping, environment, commands/operations, times, exit codes, source/asset metadata, failed checks, findings and limits. Preserve rootTaskId and cumulative repairs. No unsupported runtime/model claims.
