# P1-ACCEPT

- taskId: P1-ACCEPT
- rootTaskId: P1-ACCEPT
- waveId: P1
- roundId: assigned_at_dispatch
- status: prepared_not_dispatched
- role: Test/Acceptance
- baseCommit: 07300db74eefe5d8d1ecf979de314450bf5f2a78
- baseCommitMeaning: P0 sealed preparation anchor; Leader replaces with exact active integrated commit and records revision before dispatch
- specVersion: P1-1.1.0
- requirementIds: P1-CREATIVE-01, P1-REVIEW-01, P1-VIS-01, P1-VIS-02, P1-MOTION-01, P1-MOTION-02, P1-UX-01, P1-QUALITY-01, P1-REG-01, P1-DEL-01
- dependencies: P1-BASE
- runtimeDependencies: P1-ASSET, P1-CREATIVE, P1-MOTION (test design may begin earlier)
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

Design independent acceptance early; run against the integrated asset/motion version only after runtime dependencies complete. Verify full workflows, reduced/static modes, performance/contrast, upgrade/rollback and original P0 protections.

## Allowed write paths

- tests/p1/
- docs/waves/P1/evidence/acceptance/
- docs/waves/P1/handoffs/acceptance.md

Write only assigned paths. Shared dependencies/CI/contracts need recorded Leader ownership transfer. Do not edit protected P0 API/query/session/submission generation logic to accommodate animation. A broad test directory does not authorize rewriting existing tests to conceal failure. Read-only relevant source access is allowed.

## Acceptance

- No user-visible effect/component names, technical annotations, parameters or hover/mouse-experience instructions. Name gallery tabs by image subject; retain necessary actions, state/errors, accessibility labels and motion controls. Technical mappings belong only in development documents.

- RB01–RB07 and V/U/M/A/P/R/D cases in ACCEPTANCE are linked to actual tested commits; new tests do not replace original12Java/16frontend/8API.
- Independently sign every comfort gate, including readable text, native cursor/focus, unblocked actions/scroll, no flashing, preference and context-loss cleanup, concurrency, total performance and full P0 regression. An aesthetics score cannot override a failed comfort gate.
- Browser evidence covers actual seven effects and motion/keyboard/mobile and cannot be substituted by JSDOM screenshots.
- Record same-condition repeated baseline/final values; distinguish measured/unverified branches and report defects without editing product.

## Handoff

Use docs/waves/P1/handoffs/TEMPLATE.md. Include exact implementation/tested SHA, changed paths, requirement mapping, environment, commands/operations, times, exit codes, source/asset metadata, failed checks, findings and limits. Preserve rootTaskId and cumulative repairs. No unsupported runtime/model claims.
