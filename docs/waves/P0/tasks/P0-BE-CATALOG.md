# P0-BE-CATALOG

- waveId: P0
- roundId: assigned at dispatch
- taskId: P0-BE-CATALOG
- rootTaskId: P0-BE-CATALOG
- role: Backend
- status: prepared_not_dispatched
- baseCommit: abdf231d4c03dfe89fd6617cc459518cbdaddc69
- baseCommitMeaning: preparation specification anchor; Leader must rebase packet to exact integrated SHA and record revision before dispatch
- specVersion: 1.0.0
- requirementIds: R-01, R-02, R-03, R-10
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

Implement Java anonymous session, category/template APIs, seeded original demo assets, validated server storage and authenticated asset media. Leader allocates migration numbers; dependency changes require owner transfer.

## Required context

Read AGENTS.md, CONSTITUTION.md, docs/agents/PROTOCOL.md, docs/agents/MEMORY.md, docs/waves/P0/PLAN.md, docs/waves/P0/state.json, specs/api.yaml, specs/architecture.md, specs/data-model.md, specs/task-lifecycle.md, specs/frontend-state.md, specs/ui.md and specs/acceptance.md. Read your role definition in docs/agents/. P0 execution is authorized by user start and decision 0005; dispatch still requires an exact base commit.

## Allowed write paths

- backend/src/
- backend/src/test/
- backend/Dockerfile

Do not edit other paths or another worker's files. Shared dependencies, contracts, migration numbers, Compose and CI need recorded Leader ownership transfer even if a broad directory appears above. Read-only access to relevant repository code is allowed.

## Acceptance

- BE-05 ownership assertions for asset access/submission and BE-06 multipart validation.
- Template count/types/size rules come from Java; ensure valid fixtures and all demo files are reachable.
- Reject forged or corrupt images and arbitrary storage paths. Token hash only, no-store personal responses.

## Handoff

Use docs/waves/P0/handoffs/TEMPLATE.md. Include exact implementation/tested SHA, changed paths, requirement mapping, actual commands/environment/timestamps/results, evidence, failed checks and limits. Preserve rootTaskId and cumulative repairs. Stop at scope/budget boundary and hand off; do not begin later tasks without assignment.
