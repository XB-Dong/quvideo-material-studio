# P2-AUDIT

- taskId: P2-AUDIT
- rootTaskId: P2-AUDIT
- waveId: P2
- role: Reviewer
- status: not_dispatched
- baseCommit: 8c9f91af73d0ad5203162b504856b9f02b2990d6
- baseCommitMeaning: Preparation product reference only; Leader must replace with current exact integrated SHA and verify ownership/dependencies before authorized dispatch
- specVersion: P2-1.0.0
- requirementIds: R-13.9, OPEN-01, P2-PROV-01, P2-OPEN-01
- dependencies: P2-BASE
- runtimeDependencies: P2-BE-USER
- budgetMinutes: 45 (bounded estimate, not measured effort)
- cumulativeRepairCount: 0
- rootTaskIdOnRepair: keep original; reassess after two unsuccessful same-cause repairs
- requestedModel/Reasoning: inherit_current_session
- actualProvider/Model/Reasoning: null

## Authorization and context

The user explicitly started P2 on2026-10-30. Execution within this packet is authorized without further questions. Read AGENTS, CONSTITUTION, docs/agents/PROTOCOL, P2 PLAN/ROLES/CONTEXT-MAP/ACCEPTANCE/REQUIREMENTS-MATRIX/state and specs/p2/{delivery,identity}. Preparation packets do not authorize work. After explicit start the Leader refreshes exact SHA/ownership/dependencies before dispatch. The user requires autonomous decisions with no follow-up questions during P2 execution.

## Goal and observable acceptance

Use the released Backend slot. Read-only audit code/account boundaries, third-party source/licenses, candidate tree and all reachable refs/history disclosure. Distinguish exam distribution from future public release; report exact locations/triggers and safe dispositions without editing product or history.

Use every mapped clause's observable criterion in requirement-checklist.json and applicable P2 acceptance gate. No unverified pass claims. Exact API/data/account behavior is frozen in specs/p2/identity.md before consumers implement.

## Allowed write paths

- docs/waves/P2/reviews/provenance-review.md
- docs/waves/P2/reviews/implementation-review.md
- docs/waves/P2/handoffs/reviewer.md

## Safeguards

One owner per concurrent file. Root dependencies/CI/Compose/specs/numbering remain Leader-owned unless explicitly transferred. Preserve old business tests and session/upload/submission/terminal semantics, approved visuals, all required checks and failed evidence. App build/install/test/runtime and capture tools run only in containers after authorized execution. No real credentials/uploads/cookie snapshots in Git. Never use public release or exam submission as an implied task step.

## Handoff

Write the assigned handoff under docs/waves/P2/handoffs/ with exact base and implementation SHA, changed paths, spec/requirement IDs, real commands/environment/time/exit codes, evidence references, failures/findings/limits and next steps. Reviewer only writes assigned review files. Leader integrates and signs final completion.
