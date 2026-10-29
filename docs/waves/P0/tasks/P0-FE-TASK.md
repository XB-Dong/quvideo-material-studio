# P0-FE-TASK

- waveId: P0
- roundId: assigned at dispatch
- taskId: P0-FE-TASK
- rootTaskId: P0-FE-TASK
- role: Frontend
- status: completed
- baseCommit: 0d2627243e1a8e86eb33f5f975d202cf56d135b3
- baseCommitMeaning: preparation specification anchor; Leader must rebase packet to exact integrated SHA and record revision before dispatch
- specVersion: 1.0.0
- requirementIds: R-04, R-05, R-07, R-08, R-09, R-11
- dependencies: P0-FE-CATALOG
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

Implement independent upload/submission/task/query state, personal history, per-task polling and image preview. Contract fixtures permit parallel work before backend integration but never count as Java verification.

## Required context

Read AGENTS.md, CONSTITUTION.md, docs/agents/PROTOCOL.md, docs/agents/MEMORY.md, docs/waves/P0/PLAN.md, docs/waves/P0/state.json, specs/api.yaml, specs/architecture.md, specs/data-model.md, specs/task-lifecycle.md, specs/frontend-state.md, specs/ui.md and specs/acceptance.md. Read your role definition in docs/agents/. P0 execution is authorized by user start and decision 0005; dispatch still requires an exact base commit.

## Allowed write paths

- frontend/src/

Do not edit other paths or another worker's files. Shared dependencies, contracts, migration numbers, Compose and CI need recorded Leader ownership transfer even if a broad directory appears above. Read-only access to relevant repository code is allowed.

## Acceptance

- FE-01 through FE-06 using deferred promises and fake timers.
- 202 unlocks submission; unknown POST outcome does not auto-retry; GET errors never become execution failure.
- Terminal version guard, user epoch cleanup, no polling when all tasks end, mount/unmount cleanup and accessible modal.

## Handoff

Use docs/waves/P0/handoffs/TEMPLATE.md. Include exact implementation/tested SHA, changed paths, requirement mapping, actual commands/environment/timestamps/results, evidence, failed checks and limits. Preserve rootTaskId and cumulative repairs. Stop at scope/budget boundary and hand off; do not begin later tasks without assignment.
