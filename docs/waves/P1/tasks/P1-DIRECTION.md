# P1-DIRECTION

- taskId: P1-DIRECTION
- rootTaskId: P1-DIRECTION
- waveId: P1
- roundId: assigned_at_dispatch
- status: prepared_not_dispatched
- role: Leader
- baseCommit: 07300db74eefe5d8d1ecf979de314450bf5f2a78
- baseCommitMeaning: P0 sealed preparation anchor; Leader replaces with exact active integrated commit and records revision before dispatch
- specVersion: P1-1.1.0
- requirementIds: P1-CREATIVE-01, P1-REVIEW-01, P1-VIS-01, P1-VIS-02, P1-MOTION-01, P1-UX-01
- dependencies: P1-BASE
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

Reconfirm source-specific licensing and selected visual direction, resolve any browser/source availability issue, freeze tokens/motion/asset mapping and record one owner per shared file.

## Allowed write paths

- specs/p1/
- docs/waves/P1/references/
- docs/waves/P1/state.json

Write only assigned paths. Shared dependencies/CI/contracts need recorded Leader ownership transfer. Do not edit protected P0 API/query/session/submission generation logic to accommodate animation. A broad test directory does not authorize rewriting existing tests to conceal failure. Read-only relevant source access is allowed.

## Acceptance

- Direction board and specifications agree on blue-violet hierarchy, source credit and full page scope.
- Selected photo pages/license and manifest match actual production candidates.
- No redundant per-component approval is required within the user-started approved direction.

## Handoff

Use docs/waves/P1/handoffs/TEMPLATE.md. Include exact implementation/tested SHA, changed paths, requirement mapping, environment, commands/operations, times, exit codes, source/asset metadata, failed checks, findings and limits. Preserve rootTaskId and cumulative repairs. No unsupported runtime/model claims.

## Direction freeze

Freeze seven placements in specs/p1/react-bits.md, static-first layouts, two active systems/one WebGL maximum, lazy-load and fallback controls. Reviewer aesthetics and Acceptance comfort require separate signoffs; all seven must be demonstrable in normal desktop mode. Threshold changes require measured evidence and recorded specification revision.
