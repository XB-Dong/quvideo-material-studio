# P2-REVIEW

- taskId: P2-REVIEW
- rootTaskId: P2-REVIEW
- waveId: P2
- role: Reviewer
- status: not_dispatched
- baseCommit: 7bbfd027758002cc519fc889cea3c8a2b5233717
- baseCommitMeaning: Preparation product reference only; Leader must replace with current exact integrated SHA and verify ownership/dependencies before authorized dispatch
- specVersion: P2-1.0.0
- requirementIds: P2-REQ-01, P2-MEDIA-01, P2-PACK-01, P2-TRUTH-01
- dependencies: P2-REPORT
- runtimeDependencies: P2-DOCS, P2-MEDIA
- budgetMinutes: 30 (bounded estimate, not measured effort)
- cumulativeRepairCount: 0
- rootTaskIdOnRepair: keep original; reassess after two unsuccessful same-cause repairs
- requestedModel/Reasoning: inherit_current_session
- actualProvider/Model/Reasoning: null

## Authorization and context

Preparation only. The user has not started P2. Read AGENTS, CONSTITUTION, docs/agents/PROTOCOL, P2 PLAN/ROLES/CONTEXT-MAP/ACCEPTANCE/REQUIREMENTS-MATRIX/state and specs/p2/{delivery,identity}. Preparation packets do not authorize work. After explicit start the Leader refreshes exact SHA/ownership/dependencies before dispatch. The user requires autonomous decisions with no follow-up questions during P2 execution.

## Goal and observable acceptance

Independently read each report row against real source/evidence, inspect candidate archive/entry/readability and play both GIFs completely. Check exact source/CI/package identities, limits, per-file sizes, licensing and historical-scope honesty. Only write assigned review.

Use every mapped clause's observable criterion in requirement-checklist.json and applicable P2 acceptance gate. No unverified pass claims. Exact API/data/account behavior is frozen in specs/p2/identity.md before consumers implement.

## Allowed write paths

- docs/waves/P2/reviews/final-review.md

## Safeguards

One owner per concurrent file. Root dependencies/CI/Compose/specs/numbering remain Leader-owned unless explicitly transferred. Preserve old business tests and session/upload/submission/terminal semantics, approved visuals, all required checks and failed evidence. App build/install/test/runtime and capture tools run only in containers after authorized execution. No real credentials/uploads/cookie snapshots in Git. Never use public release or exam submission as an implied task step.

## Handoff

Write the assigned handoff under docs/waves/P2/handoffs/ with exact base and implementation SHA, changed paths, spec/requirement IDs, real commands/environment/time/exit codes, evidence references, failures/findings/limits and next steps. Reviewer only writes assigned review files. Leader integrates and signs final completion.
