# P1-BASE

- taskId: P1-BASE
- rootTaskId: P1-BASE
- waveId: P1
- roundId: assigned_at_dispatch
- status: prepared_not_dispatched
- role: Leader
- baseCommit: 07300db74eefe5d8d1ecf979de314450bf5f2a78
- baseCommitMeaning: P0 sealed preparation anchor; Leader replaces with exact active integrated commit and records revision before dispatch
- specVersion: P1-1.2.0
- requirementIds: P1-QUALITY-01, P1-REG-01, P1-DEL-01
- dependencies: none except explicit user P1 start
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

After explicit P1 start, revalidate the exact P0 source baseline in containers, record comparable bundle/network/performance baselines, verify and lock candidate Motion14.7.1/OGL1.0.11 without unrelated upgrades. Verify the seven TS-CSS registry sources against recorded hashes/upstream revision, preserve MIT + Commons Clause terms, and record source/adapter provenance.

## Allowed write paths

- frontend/package.json
- frontend/package-lock.json
- docs/waves/P1/evidence/
- docs/waves/P1/state.json

Write only assigned paths. Shared dependencies/CI/contracts need recorded Leader ownership transfer. Do not edit protected P0 API/query/session/submission generation logic to accommodate animation. A broad test directory does not authorize rewriting existing tests to conceal failure. Read-only relevant source access is allowed.

## Acceptance

- All P0 checks remain executable; baseline measurements contain environment, conditions and raw values.
- Motion/OGL peer metadata does not count as runtime proof; install/test in containers and lock exact versions, including all actual imports. Record total initial and lazy creative JS, not only the first route.
- Do not equate registry hashes with the recorded GitHub SHA without content comparison; retain full source copyright/license for vendored components.
- Do not change product behavior while collecting baseline.

## Handoff

Use docs/waves/P1/handoffs/TEMPLATE.md. Include exact implementation/tested SHA, changed paths, requirement mapping, environment, commands/operations, times, exit codes, source/asset metadata, failed checks, findings and limits. Preserve rootTaskId and cumulative repairs. No unsupported runtime/model claims.
