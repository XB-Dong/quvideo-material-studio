# P1-DELIVERY

- taskId: P1-DELIVERY
- rootTaskId: P1-DELIVERY
- waveId: P1
- roundId: assigned_at_dispatch
- status: prepared_not_dispatched
- role: Leader
- baseCommit: 07300db74eefe5d8d1ecf979de314450bf5f2a78
- baseCommitMeaning: P0 sealed preparation anchor; Leader replaces with exact active integrated commit and records revision before dispatch
- specVersion: P1-1.1.0
- requirementIds: P1-CREATIVE-01, P1-REVIEW-01, P1-DEL-01, P1-REG-01
- dependencies: P1-REVIEW, P1-ACCEPT
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

Run final integrated CI/clean Compose, confirm baseline protections, license/asset inventory and actual performance; issue truthful acceptance/report commits, source archive and rollback instructions, then stop.

## Allowed write paths

- README.md
- THIRD-PARTY-NOTICES.md
- docs/
- specs/p1/
- .github/workflows/
- compose.yaml
- compose.test.yaml

Write only assigned paths. Shared dependencies/CI/contracts need recorded Leader ownership transfer. Do not edit protected P0 API/query/session/submission generation logic to accommodate animation. A broad test directory does not authorize rewriting existing tests to conceal failure. Read-only relevant source access is allowed.

## Acceptance

- All mandatory P1 matrix items and P0 regressions have actual evidence, unresolved blocking/major findings prevent completed.
- Explain any budget adjustment with measurements and reasons; never claim implementation from preparation board.
- No automatic next wave, public deployment or exam submission.

## Handoff

Use docs/waves/P1/handoffs/TEMPLATE.md. Include exact implementation/tested SHA, changed paths, requirement mapping, environment, commands/operations, times, exit codes, source/asset metadata, failed checks, findings and limits. Preserve rootTaskId and cumulative repairs. No unsupported runtime/model claims.

## Required dual gate

Collect separate Reviewer aesthetics and Acceptance comfort signoffs for the exact integrated implementation. Confirm all seven effects demonstrated, full notices retained, no open blocking/major, initial plus deferred JS measured and rollback/reupgrade verified. Preparation review is not product acceptance.
