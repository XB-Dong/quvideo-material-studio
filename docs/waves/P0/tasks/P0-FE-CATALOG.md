# P0-FE-CATALOG

- waveId: P0
- roundId: assigned at dispatch
- taskId: P0-FE-CATALOG
- rootTaskId: P0-FE-CATALOG
- role: Frontend
- status: completed
- baseCommit: 0d2627243e1a8e86eb33f5f975d202cf56d135b3
- baseCommitMeaning: preparation specification anchor; Leader must rebase packet to exact integrated SHA and record revision before dispatch
- specVersion: 1.0.0
- requirementIds: R-02, R-03, R-10, R-11
- dependencies: P0-BOOT
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

Implement category/cards, detail/upload slots, single coordinated session initialization and identity display. Use live Java in product flows; fixtures only in tests. Match reference layout with responsive accessible controls.

## Required context

Read AGENTS.md, CONSTITUTION.md, docs/agents/PROTOCOL.md, docs/agents/MEMORY.md, docs/waves/P0/PLAN.md, docs/waves/P0/state.json, specs/api.yaml, specs/architecture.md, specs/data-model.md, specs/task-lifecycle.md, specs/frontend-state.md, specs/ui.md and specs/acceptance.md. Read your role definition in docs/agents/. P0 execution is authorized by user start and decision 0005; dispatch still requires an exact base commit.

## Allowed write paths

- frontend/src/
- frontend/public/
- frontend/Dockerfile

Do not edit other paths or another worker's files. Shared dependencies, contracts, migration numbers, Compose and CI need recorded Leader ownership transfer even if a broad directory appears above. Read-only access to relevant repository code is allowed.

## Acceptance

- FE-05 slot replacement/removal and late upload response tests.
- Loading, empty, request failure, missing template, MIME/size/count feedback and focus labels.
- UI-01 initial manual check; do not implement billing, subscriptions, task deletion or password reset.

## Handoff

Use docs/waves/P0/handoffs/TEMPLATE.md. Include exact implementation/tested SHA, changed paths, requirement mapping, actual commands/environment/timestamps/results, evidence, failed checks and limits. Preserve rootTaskId and cumulative repairs. Stop at scope/budget boundary and hand off; do not begin later tasks without assignment.
