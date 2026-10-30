# P2-SEAL

- taskId: P2-SEAL
- rootTaskId: P2-SEAL
- waveId: P2
- role: Leader
- status: not_dispatched
- baseCommit: 7bbfd027758002cc519fc889cea3c8a2b5233717
- baseCommitMeaning: Preparation product reference only; Leader must replace with current exact integrated SHA and verify ownership/dependencies before authorized dispatch
- specVersion: P2-1.0.0
- requirementIds: P2-PACK-01, SUB.a, SUB.b, SUB.c, SUB.d
- dependencies: P2-REVIEW, P2-VERIFY
- runtimeDependencies: P2-REPORT, P2-MEDIA
- budgetMinutes: 30 (bounded estimate, not measured effort)
- cumulativeRepairCount: 0
- rootTaskIdOnRepair: keep original; reassess after two unsuccessful same-cause repairs
- requestedModel/Reasoning: inherit_current_session
- actualProvider/Model/Reasoning: null

## Authorization and context

Preparation only. The user has not started P2. Read AGENTS, CONSTITUTION, docs/agents/PROTOCOL, P2 PLAN/ROLES/CONTEXT-MAP/ACCEPTANCE/REQUIREMENTS-MATRIX/state and specs/p2/{delivery,identity}. Preparation packets do not authorize work. After explicit start the Leader refreshes exact SHA/ownership/dependencies before dispatch. The user requires autonomous decisions with no follow-up questions during P2 execution.

## Goal and observable acceptance

Resolve all required findings, verify final integrated source and required CI, archive source, inspect/extract/test equivalence and record external SHA256 manifest. Keep attachment count <=6 and each <100000000 bytes. Give usable materials and stop. No exam submission, messages, public visibility changes, history rewriting or paid services.

Use every mapped clause's observable criterion in requirement-checklist.json and applicable P2 acceptance gate. No unverified pass claims. Exact API/data/account behavior is frozen in specs/p2/identity.md before consumers implement.

## Allowed write paths

- root integration and shared delivery documents
- external final ZIP/GIF/submission note/user report/manifest

## Safeguards

One owner per concurrent file. Root dependencies/CI/Compose/specs/numbering remain Leader-owned unless explicitly transferred. Preserve old business tests and session/upload/submission/terminal semantics, approved visuals, all required checks and failed evidence. App build/install/test/runtime and capture tools run only in containers after authorized execution. No real credentials/uploads/cookie snapshots in Git. Never use public release or exam submission as an implied task step.

## Handoff

Write the assigned handoff under docs/waves/P2/handoffs/ with exact base and implementation SHA, changed paths, spec/requirement IDs, real commands/environment/time/exit codes, evidence references, failures/findings/limits and next steps. Reviewer only writes assigned review files. Leader integrates and signs final completion.
