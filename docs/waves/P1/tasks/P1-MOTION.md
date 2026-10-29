# P1-MOTION

- taskId: P1-MOTION
- rootTaskId: P1-MOTION
- waveId: P1
- roundId: assigned_at_dispatch
- status: prepared_not_dispatched
- role: Frontend Visual/Creative/Motion
- baseCommit: 07300db74eefe5d8d1ecf979de314450bf5f2a78
- baseCommitMeaning: P0 sealed preparation anchor; Leader replaces with exact active integrated commit and records revision before dispatch
- specVersion: P1-1.2.0
- requirementIds: P1-CREATIVE-01, P1-REVIEW-01, P1-MOTION-01, P1-MOTION-02, P1-QUALITY-01, P1-REG-01
- dependencies: P1-CREATIVE
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

Same frontend writer adds M01-M10 sequentially after creative handoff and coordinates the seven components with ordinary interaction feedback. Add isolated motion preference provider, system-reduce and persistent manual static mode; use configured Motion/CSS with no duplicated business state.

## Allowed write paths

- frontend/src/app/globals.css
- frontend/src/styles/
- frontend/src/components/catalog.tsx
- frontend/src/components/studio.tsx
- frontend/src/components/history.tsx
- frontend/src/components/shell.tsx
- frontend/src/components/providers.tsx
- frontend/src/components/motion/
- frontend/src/components/creative/
- frontend/src/components/react-bits/ (adaptations only, retain source notices)
- frontend/src/components/*.test.tsx
- frontend/src/lib/*.test.tsx

Write only assigned paths. Shared dependencies/CI/contracts need recorded Leader ownership transfer. Do not edit protected P0 API/query/session/submission generation logic to accommodate animation. A broad test directory does not authorize rewriting existing tests to conceal failure. Read-only relevant source access is allowed.

## Acceptance

- Rapid open/close/Esc/route and identity changes clean all timers/listeners/requests without waiting for exit animations.
- Repeated polling version does not replay card entrance; query failure stays separate; task status comes only from Java.
- New preference/cancel/focus/image-fallback tests plus original16 tests pass; record browser motion and bundle evidence.

## Handoff

Use docs/waves/P1/handoffs/TEMPLATE.md. Include exact implementation/tested SHA, changed paths, requirement mapping, environment, commands/operations, times, exit codes, source/asset metadata, failed checks, findings and limits. Preserve rootTaskId and cumulative repairs. No unsupported runtime/model claims.
