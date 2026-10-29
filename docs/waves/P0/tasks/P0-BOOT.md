# P0-BOOT

- waveId: P0
- roundId: assigned at dispatch
- taskId: P0-BOOT
- rootTaskId: P0-BOOT
- role: Leader
- status: in_progress
- baseCommit: 0d2627243e1a8e86eb33f5f975d202cf56d135b3
- baseCommitMeaning: preparation specification anchor; Leader must rebase packet to exact integrated SHA and record revision before dispatch
- specVersion: 1.0.0
- requirementIds: R-01, R-12, R-14
- dependencies: none; explicit P0 start remains mandatory
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

Resolve and pin compatible patch versions, create minimal buildable applications and migration framework, wire same-origin proxy and container health checks, implement real push/PR CI and container test entry points.

## Required context

Read AGENTS.md, CONSTITUTION.md, docs/agents/PROTOCOL.md, docs/agents/MEMORY.md, docs/waves/P0/PLAN.md, docs/waves/P0/state.json, specs/api.yaml, specs/architecture.md, specs/data-model.md, specs/task-lifecycle.md, specs/frontend-state.md, specs/ui.md and specs/acceptance.md. Read your role definition in docs/agents/. P0 execution is authorized by user start and decision 0005; dispatch still requires an exact base commit.

## Allowed write paths

- frontend/src/ (minimal bootstrap only; transfer ownership before R1)
- backend/src/ (minimal bootstrap only; transfer ownership before R1)
- frontend/package.json
- frontend/package-lock.json
- frontend/tsconfig.json
- frontend/eslint.config.*
- frontend/Dockerfile
- backend/pom.xml
- backend/Dockerfile
- backend/src/main/resources/db/migration/
- compose.yaml
- compose.test.yaml
- .github/workflows/ci.yml
- .env.example

Do not edit other paths or another worker's files. Shared dependencies, contracts, migration numbers, Compose and CI need recorded Leader ownership transfer even if a broad directory appears above. Read-only access to relevant repository code is allowed.

## Acceptance

- Build both applications and run lint/typecheck/basic Java tests inside containers.
- Start MySQL and migrations with synthetic seeds; record exact image versions and dependency locks.
- Do not claim that skeleton health proves business acceptance. No floating latest or skipped final checks.

## Handoff

Use docs/waves/P0/handoffs/TEMPLATE.md. Include exact implementation/tested SHA, changed paths, requirement mapping, actual commands/environment/timestamps/results, evidence, failed checks and limits. Preserve rootTaskId and cumulative repairs. Stop at scope/budget boundary and hand off; do not begin later tasks without assignment.
