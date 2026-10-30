# P2-DOCS

- taskId: P2-DOCS
- rootTaskId: P2-DOCS
- waveId: P2
- role: Leader
- status: not_dispatched
- baseCommit: 7bbfd027758002cc519fc889cea3c8a2b5233717
- baseCommitMeaning: Preparation product reference only; Leader must replace with current exact integrated SHA and verify ownership/dependencies before authorized dispatch
- specVersion: P2-1.0.0
- requirementIds: R-01.d, R-06.d, R-10.c, R-13.1, R-13.2, R-13.3, R-13.4, R-13.5, R-13.7
- dependencies: P2-BASE
- runtimeDependencies: P2-BE-USER, P2-FE-USER, P2-AUDIT
- budgetMinutes: 60 (bounded estimate, not measured effort)
- cumulativeRepairCount: 0
- rootTaskIdOnRepair: keep original; reassess after two unsuccessful same-cause repairs
- requestedModel/Reasoning: inherit_current_session
- actualProvider/Model/Reasoning: null

## Authorization and context

Preparation only. The user has not started P2. Read AGENTS, CONSTITUTION, docs/agents/PROTOCOL, P2 PLAN/ROLES/CONTEXT-MAP/ACCEPTANCE/REQUIREMENTS-MATRIX/state and specs/p2/{delivery,identity}. Preparation packets do not authorize work. After explicit start the Leader refreshes exact SHA/ownership/dependencies before dispatch. The user requires autonomous decisions with no follow-up questions during P2 execution.

## Goal and observable acceptance

Produce one evaluator-friendly entry, accurate versions/API/account behavior, container commands and demos. Separate estimates from measured intervals and historical evidence. Apply provenance dispositions with explicit ownership; no broad relicensing.

Use every mapped clause's observable criterion in requirement-checklist.json and applicable P2 acceptance gate. No unverified pass claims. Exact API/data/account behavior is frozen in specs/p2/identity.md before consumers implement.

## Allowed write paths

- README.md
- docs/submission/**
- docs/audit/effort.md
- THIRD-PARTY-NOTICES.md
- LICENSE (after provenance disposition)
- specs/api.yaml
- externalDeliveryRoot/candidate/<exact-sourceSHA>/source-candidate.zip and entries/manifest (Leader, before VERIFY)

## Safeguards

One owner per concurrent file. Root dependencies/CI/Compose/specs/numbering remain Leader-owned unless explicitly transferred. Preserve old business tests and session/upload/submission/terminal semantics, approved visuals, all required checks and failed evidence. App build/install/test/runtime and capture tools run only in containers after authorized execution. No real credentials/uploads/cookie snapshots in Git. Never use public release or exam submission as an implied task step.

## Handoff

Write the assigned handoff under docs/waves/P2/handoffs/ with exact base and implementation SHA, changed paths, spec/requirement IDs, real commands/environment/time/exit codes, evidence references, failures/findings/limits and next steps. Reviewer only writes assigned review files. Leader integrates and signs final completion.

## Candidate ZIP before verification

At the end of DOCS and before VERIFY, Leader produces the exact frozen candidate ZIP plus entries/manifest at externalDeliveryRoot/candidate/<40-character-sourceSHA>/source-candidate.zip. Source SHA is frozen before this step; no final SEAL dependency is required for Acceptance to obtain its candidate.
