# P0-ACCEPT

- waveId: P0
- roundId: assigned at dispatch
- taskId: P0-ACCEPT
- rootTaskId: P0-ACCEPT
- role: Test/Acceptance
- status: prepared_not_dispatched
- baseCommit: abdf231d4c03dfe89fd6617cc459518cbdaddc69
- baseCommitMeaning: preparation specification anchor; Leader must rebase packet to exact integrated SHA and record revision before dispatch
- specVersion: 1.0.0
- requirementIds: R-01, R-02, R-03, R-04, R-05, R-06, R-07, R-08, R-09, R-10, R-11, R-12, R-14
- dependencies: P0-BOOT
- runtimeAcceptanceDependencies: P0-BE-TASK, P0-FE-TASK (design can start after BOOT; runtime gates wait for both integrated commits)
- requestedModel: inherit current session
- requestedReasoningEffort: inherit current session
- actualProvider: null
- actualModel: null
- actualReasoningEffort: null
- modelVerificationStatus: not_verified
- modelEvidenceRef: null
- contextMode: self-contained task packet plus required specifications
- initialFocusedBudgetMinutes: 90
- cumulativeRepairCount: 0
- sameRootCauseReassessmentAfter: 2 unsuccessful repairs
- reviewer: independent Test/Reviewer plus Leader integration

## Goal

Design independent synthetic acceptance early, then run it against the integrated frontend/backend/MySQL once both task implementations are available. Separate design readiness from runtime dependency satisfaction.

## Required context

Read AGENTS.md, CONSTITUTION.md, docs/agents/PROTOCOL.md, docs/agents/MEMORY.md, docs/waves/P0/PLAN.md, docs/waves/P0/state.json, specs/api.yaml, specs/architecture.md, specs/data-model.md, specs/task-lifecycle.md, specs/frontend-state.md, specs/ui.md and specs/acceptance.md. Read your role definition in docs/agents/. Execution is not authorized by this file.

## Allowed write paths

- tests/
- docs/waves/P0/evidence/
- docs/waves/P0/handoffs/

Do not edit other paths or another worker's files. Shared dependencies, contracts, migration numbers, Compose and CI need recorded Leader ownership transfer even if a broad directory appears above. Read-only access to relevant repository code is allowed.

## Acceptance

- INT-01 through INT-04 and UI-01; reproduce server failure and query outage separately.
- Record dirty/clean volume startup, refresh, close-page, multi-user ownership, restart boundaries and source-proven versus runtime evidence.
- Do not rewrite product/implementer tests. Root CI/Compose changes require Leader ownership transfer.

## Handoff

Use docs/waves/P0/handoffs/TEMPLATE.md. Include exact implementation/tested SHA, changed paths, requirement mapping, actual commands/environment/timestamps/results, evidence, failed checks and limits. Preserve rootTaskId and cumulative repairs. Stop at scope/budget boundary and hand off; do not begin later tasks without assignment.
