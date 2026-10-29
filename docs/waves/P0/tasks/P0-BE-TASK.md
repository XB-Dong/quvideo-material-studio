# P0-BE-TASK

- waveId: P0
- roundId: assigned at dispatch
- taskId: P0-BE-TASK
- rootTaskId: P0-BE-TASK
- role: Backend
- status: prepared_not_dispatched
- baseCommit: abdf231d4c03dfe89fd6617cc459518cbdaddc69
- baseCommitMeaning: preparation specification anchor; Leader must rebase packet to exact integrated SHA and record revision before dispatch
- specVersion: 1.0.0
- requirementIds: R-01, R-04, R-05, R-06, R-09, R-10
- dependencies: P0-BE-CATALOG
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

Implement transactional task acceptance, snapshots, bounded executor and three observable persistent stages. Add deterministic failure/delay control, read-only detail/history, result media authorization and startup interrupted-task reconciliation.

## Required context

Read AGENTS.md, CONSTITUTION.md, docs/agents/PROTOCOL.md, docs/agents/MEMORY.md, docs/waves/P0/PLAN.md, docs/waves/P0/state.json, specs/api.yaml, specs/architecture.md, specs/data-model.md, specs/task-lifecycle.md, specs/frontend-state.md, specs/ui.md and specs/acceptance.md. Read your role definition in docs/agents/. Execution is not authorized by this file.

## Allowed write paths

- backend/src/
- backend/src/test/

Do not edit other paths or another worker's files. Shared dependencies, contracts, migration numbers, Compose and CI need recorded Leader ownership transfer even if a broad directory appears above. Read-only access to relevant repository code is allowed.

## Acceptance

- BE-01 through BE-05 and BE-07 as applicable, including rollback-never-dispatch and terminal guards.
- Three failAt values stop subsequent handlers; generation does not depend on GET calls.
- Use short DB transactions and deterministic latch/sleeper tests; record real MySQL persistence evidence.

## Handoff

Use docs/waves/P0/handoffs/TEMPLATE.md. Include exact implementation/tested SHA, changed paths, requirement mapping, actual commands/environment/timestamps/results, evidence, failed checks and limits. Preserve rootTaskId and cumulative repairs. Stop at scope/budget boundary and hand off; do not begin later tasks without assignment.
