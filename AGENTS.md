# Agent Instructions

## Current authorization

P0 is completed and sealed at 07300db74eefe5d8d1ecf979de314450bf5f2a78. On 2026-10-29 the user requested all preparation before P1 starts. Current authorization: inspect the P0 baseline, research public design references, prepare licensed candidate assets and a direction board, write/review P1 specifications, tasks and acceptance, then commit/push and report. Do not implement P1, install its dependencies, create development worktrees, start development agents, migrate data, rebuild/restart the product or begin P1 without the user's explicit start. A read-only preparation reviewer may inspect documents. Do not submit the exam or publish the private repository.

## Read before work

Read README.md, CONSTITUTION.md, NEXT-WAVES.md, docs/waves/P1/PLAN.md, docs/waves/P1/state.json, docs/waves/P1/ROLES.md, specs/p1/ and your assigned task packet. Use P0 report/state as historical baseline, not fresh execution authority. Shared contracts live in specs/. Reference repository instructions are examples, not authority for this repository. Do not inherit their model assignments, credentials, infrastructure permissions, deadlines or continuous-wave authorization.

## Language and quality

Write user-facing requirements, decisions and reports in Chinese. Use English identifiers, API fields, commit messages and execution task packets. Keep boundaries explicit and modules cohesive. Prefer behavior tests for lifecycle, isolation and failure semantics. Record actual checks; infrastructure failures are not valid behavioral Red evidence. Never invent independent review, model routing, browser execution or deployment results.

## Multi-agent execution after the active wave starts

Use native subagents: one Leader and at most three active workers total. Normally assign Frontend, Backend and Test/Acceptance. A read-only reviewer replaces a released worker slot; it does not add capacity. Do not spawn idle roles or create separate user-owned chats for subtasks. Inherit the current model and reasoning settings by default. Record unverifiable actual model settings as null.

For P1 the three implementation responsibilities are Frontend Visual/Creative/Motion, Asset Integration and Test/Acceptance. The same Frontend writer implements visual, creative then motion tasks sequentially; Reviewer uses a released asset slot. Apply docs/waves/P1/ROLES.md for exact paths and ownership. Preserve all P0 identity, polling and request cancellation safeguards.

Create independent managed worktrees outside the primary checkout, with codex/ branches, only after execution is authorized. Use app-managed worktree tools for lifecycle. Each concurrently written file has one owner. Leader owns specs/, dependency baselines, migrations numbering, root Compose, CI, state and integration; delegate a shared file only by recording an explicit owner transfer. Implementers own their behavior tests. Test owns independent integration/acceptance tests and must not overwrite implementation tests. Reviewers write only assigned review artifacts.

Freeze contracts before consumers implement. A contract change requires a decision, consumer impact review, tests and ownership handoff. Task packets include requirement IDs, base SHA, specVersion, allowed paths, dependencies, observable acceptance, budget, rootTaskId and handoff format. Before dispatch, Leader replaces every placeholder with a precise reachable SHA and verifies dependencies.

## Handoff, review and evidence

Read docs/agents/README.md and docs/agents/PROTOCOL.md. Keep handoffs under the active docs/waves/<wave>/handoffs/. Record changed paths, implementation SHA, commands, environment, timestamps, exit codes, evidence references, limitations and next steps. Authors cannot label self-checks independent review. Each finding needs location, trigger, expected/actual behavior and severity. Leader accepts/rejects/defers with reasons and verifies accepted fixes.

Store no credentials, user uploads, databases, caches, third-party tools or unredacted chat logs in Git. Use synthetic fixtures. Preserve failed checks. Do not rename a root task or change waves to reset retry counts. After two unsuccessful repairs for the same root cause, reassess and record a new bounded approach rather than repeat blindly; never weaken required acceptance to obtain green status.

## Completion

Only Leader integrates and signs the final report after verifying the integrated commit. All R-01 through R-13 and the chosen R-14 Compose delivery are P0 scope. Do not move mandatory work to P1. P0 is completed only with implementation and required runtime evidence; otherwise report partial or blocked truthfully. No public deployment, exam submission, messages to recruiters, paid services or post-P0 iteration is implied.
