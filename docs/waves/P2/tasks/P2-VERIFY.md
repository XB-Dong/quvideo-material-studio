# P2-VERIFY

- taskId: P2-VERIFY
- rootTaskId: P2-VERIFY
- waveId: P2
- role: Acceptance
- status: not_dispatched
- baseCommit: 7bbfd027758002cc519fc889cea3c8a2b5233717
- baseCommitMeaning: Preparation product reference only; Leader must replace with current exact integrated SHA and verify ownership/dependencies before authorized dispatch
- specVersion: P2-1.0.0
- requirementIds: R-01, R-02, R-03, R-04, R-05, R-06, R-07, R-08, R-09, R-10, R-11, R-12, R-14, U-01, U-02, U-03, U-04, U-05, U-06, U-07
- dependencies: P2-BE-USER, P2-FE-USER, P2-DOCS, P2-AUDIT
- runtimeDependencies: none
- budgetMinutes: 90 (bounded estimate, not measured effort)
- cumulativeRepairCount: 0
- rootTaskIdOnRepair: keep original; reassess after two unsuccessful same-cause repairs
- requestedModel/Reasoning: inherit_current_session
- actualProvider/Model/Reasoning: null

## Authorization and context

Preparation only. The user has not started P2. Read AGENTS, CONSTITUTION, docs/agents/PROTOCOL, P2 PLAN/ROLES/CONTEXT-MAP/ACCEPTANCE/REQUIREMENTS-MATRIX/state and specs/p2/{delivery,identity}. Preparation packets do not authorize work. After explicit start the Leader refreshes exact SHA/ownership/dependencies before dispatch. The user requires autonomous decisions with no follow-up questions during P2 execution.

## Goal and observable acceptance

Verify all checklist clauses using exact frozen source. Run old/new core and account checks in containers, independent account/guest isolation, stale response/cookie behavior and V3-to-V4 migration. Test Leader's candidate ZIP in a fresh external directory/isolated Compose project+port+empty volumes. Do not stop production3000 or delete existing volumes. Keep browser/performance exclusive; report actual evidence per clause, not only a green job.

Use every mapped clause's observable criterion in requirement-checklist.json and applicable P2 acceptance gate. No unverified pass claims. Exact API/data/account behavior is frozen in specs/p2/identity.md before consumers implement.

## Allowed write paths

- tests/p2/**
- docs/waves/P2/evidence/acceptance/**
- docs/waves/P2/handoffs/acceptance.md

## Safeguards

One owner per concurrent file. Root dependencies/CI/Compose/specs/numbering remain Leader-owned unless explicitly transferred. Preserve old business tests and session/upload/submission/terminal semantics, approved visuals, all required checks and failed evidence. App build/install/test/runtime and capture tools run only in containers after authorized execution. No real credentials/uploads/cookie snapshots in Git. Never use public release or exam submission as an implied task step.

## Handoff

Write the assigned handoff under docs/waves/P2/handoffs/ with exact base and implementation SHA, changed paths, spec/requirement IDs, real commands/environment/time/exit codes, evidence references, failures/findings/limits and next steps. Reviewer only writes assigned review files. Leader integrates and signs final completion.

## Candidate and proxy boundary

Leader supplies frozen candidate ZIP before dispatch. Verify profile PATCH through the frontend same-origin URL including200/400/401/403, error code and cookies, while old GET/POST remain. Bind clean-room findings to this exact archive SHA, not a later final archive.
