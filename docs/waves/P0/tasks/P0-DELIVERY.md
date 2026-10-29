# P0-DELIVERY

- waveId: P0
- roundId: assigned at dispatch
- taskId: P0-DELIVERY
- rootTaskId: P0-DELIVERY
- role: Leader
- status: prepared_not_dispatched
- baseCommit: 0d2627243e1a8e86eb33f5f975d202cf56d135b3
- baseCommitMeaning: preparation specification anchor; Leader must rebase packet to exact integrated SHA and record revision before dispatch
- specVersion: 1.0.0
- requirementIds: R-12, R-13, R-14
- dependencies: P0-REVIEW, P0-ACCEPT
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

Verify the integrated acceptance commit, close mandatory CI and container gates, document actual commands/versions/effort/AI correction example, validate backup/restore and freeze the truthful final report. Do not submit the exam or publish the private repository.

## Required context

Read AGENTS.md, CONSTITUTION.md, docs/agents/PROTOCOL.md, docs/agents/MEMORY.md, docs/waves/P0/PLAN.md, docs/waves/P0/state.json, specs/api.yaml, specs/architecture.md, specs/data-model.md, specs/task-lifecycle.md, specs/frontend-state.md, specs/ui.md and specs/acceptance.md. Read your role definition in docs/agents/. P0 execution is authorized by user start and decision 0005; dispatch still requires an exact base commit.

## Allowed write paths

- README.md
- THIRD-PARTY-NOTICES.md
- docs/
- specs/
- .github/
- compose.yaml
- compose.test.yaml
- .env.example

Do not edit other paths or another worker's files. Shared dependencies, contracts, migration numbers, Compose and CI need recorded Leader ownership transfer even if a broad directory appears above. Read-only access to relevant repository code is allowed.

## Acceptance

- CI-01 and DOC-01 plus clean Compose run and synthetic backup/restore.
- Separate implementation/tested commit from later report commit. Mark missing evidence not_run or partial.
- Confirm private-source handoff plan with known recipient or produce source archive without secrets/caches; stop at delivery.

## Handoff

Use docs/waves/P0/handoffs/TEMPLATE.md. Include exact implementation/tested SHA, changed paths, requirement mapping, actual commands/environment/timestamps/results, evidence, failed checks and limits. Preserve rootTaskId and cumulative repairs. Stop at scope/budget boundary and hand off; do not begin later tasks without assignment.
