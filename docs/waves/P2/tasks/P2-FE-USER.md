# P2-FE-USER

- taskId: P2-FE-USER
- rootTaskId: P2-FE-USER
- waveId: P2
- role: Frontend
- status: not_dispatched
- baseCommit: 8c9f91af73d0ad5203162b504856b9f02b2990d6
- baseCommitMeaning: Preparation product reference only; Leader must replace with current exact integrated SHA and verify ownership/dependencies before authorized dispatch
- specVersion: P2-1.0.0
- requirementIds: U-05, U-06, U-07, R-03.f, R-07, R-08, R-11
- dependencies: P2-BASE
- runtimeDependencies: P2-BE-USER
- budgetMinutes: 120 (bounded estimate, not measured effort)
- cumulativeRepairCount: 0
- rootTaskIdOnRepair: keep original; reassess after two unsuccessful same-cause repairs
- requestedModel/Reasoning: inherit_current_session
- actualProvider/Model/Reasoning: null

## Authorization and context

The user explicitly started P2 on2026-10-30. Execution within this packet is authorized without further questions. Read AGENTS, CONSTITUTION, docs/agents/PROTOCOL, P2 PLAN/ROLES/CONTEXT-MAP/ACCEPTANCE/REQUIREMENTS-MATRIX/state and specs/p2/{delivery,identity}. Preparation packets do not authorize work. After explicit start the Leader refreshes exact SHA/ownership/dependencies before dispatch. The user requires autonomous decisions with no follow-up questions during P2 execution.

## Goal and observable acceptance

Implement explicit guest/login/register/account UI, profile/password and logout. Preserve guest flow and accepted visuals. Persist one global auth mutation lock across modal closure/routes, reconcile unknown outcomes, distinguish AUTH_INVALID from expired session and prevent stale cookie/data/private-view pollution. Add focused behavior tests; preserve original assertions.

Use every mapped clause's observable criterion in requirement-checklist.json and applicable P2 acceptance gate. No unverified pass claims. Exact API/data/account behavior is frozen in specs/p2/identity.md before consumers implement.

## Allowed write paths

- frontend/src/components/providers.tsx
- frontend/src/components/shell.tsx
- frontend/src/components/account/**
- frontend/src/app/account/**
- frontend/src/app/account.css
- frontend/src/app/api/[...path]/route.ts (PATCH export only, Frontend exclusive owner)
- frontend/src/lib/types.ts (identity compatibility transfer only)
- frontend/src/lib/api.ts (auth-error compatibility transfer only)
- frontend/src/lib/session-generation.ts (identity transition transfer only)
- frontend/src/components/account*.test.tsx
- docs/waves/P2/handoffs/frontend.md

## Safeguards

One owner per concurrent file. Root dependencies/CI/Compose/specs/numbering remain Leader-owned unless explicitly transferred. Preserve old business tests and session/upload/submission/terminal semantics, approved visuals, all required checks and failed evidence. App build/install/test/runtime and capture tools run only in containers after authorized execution. No real credentials/uploads/cookie snapshots in Git. Never use public release or exam submission as an implied task step.

## Handoff

Write the assigned handoff under docs/waves/P2/handoffs/ with exact base and implementation SHA, changed paths, spec/requirement IDs, real commands/environment/time/exit codes, evidence references, failures/findings/limits and next steps. Reviewer only writes assigned review files. Leader integrates and signs final completion.

## Frozen proxy ownership

Frontend exclusively adds PATCH export to frontend/src/app/api/[...path]/route.ts via existing lib/proxy. Original GET/POST and generic proxy semantics remain. Acceptance verifies through frontend origin including profile200/400/401/403 and code/cookie pass-through. Preparation changes no product route.
