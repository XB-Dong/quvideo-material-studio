# Agent Execution Protocol

## Before dispatch

Leader verifies explicit execution authorization for the active wave, reachable exact baseCommit, specVersion, requirementIds, dependencies, allowed paths, budget and reviewer. Preparation task packets are not execution authorization. Replace the preparation baseline with the latest integrated commit if contracts changed and record the revision. Do not dispatch against HEAD as an ambiguous moving label. P0 completion does not start P1.

Use a self-contained packet rather than unbounded chat history. Default to inherited model settings. Record requested settings separately from verified actual routing; unknown actual values are null. One Leader plus three active workers is a hard maximum. Transfer a shared file owner explicitly before editing. Never create separate sidebar chats for internal subtasks.

## Work and handoff

Use isolated app-managed external worktrees and codex/ task branches for concurrent implementation. Keep tools, runtimes and secrets outside Git. An implementer owns focused behavior tests. Independent Test validates integrated behavior and does not rewrite the implementation tests to conceal failures. Reviewer output is read-only with respect to product code.

Handoff fields: taskId, rootTaskId, waveId, baseCommit, implementationCommit, specVersion, changedPaths, requirementIds, commands/operations, environment, start/end timestamps, exitCodes/results, evidenceRefs, limitations, failedChecks, unresolvedFindings, nextSteps. Follow the active wave's handoff template. Evidence must name the actually tested SHA; later edits invalidate affected results.

## Findings and repair

Findings include severity (blocking/major/minor), location, trigger, expected/actual, evidence and verification limits. Leader disposition is accepted/rejected/deferred with a reason and retest reference. Authors cannot claim independent review of their own work.

Track repairs under the original rootTaskId. After two unsuccessful repairs of the same cause, diagnose and propose a bounded different approach; preserve counts. Repeating an unchanged command is not progress. A task may continue after reassessment within scope, but never by deleting acceptance, silently switching models, inventing evidence or extending a user deadline.

## Time and integration

Use the active wave's estimated effort and explicitly confirmed deadline, if any. P0's historical24-hour estimate is not a P1 deadline; P1 estimates10–14 focused hours after the seven-component increment including verification and delivery. Leader records actual start and effort after authorization and adjusts scheduling without deleting mandatory requirements. If time runs out, issue a truthful partial report.

Only Leader integrates. Check precise consumer compatibility, changed paths and task tests before merging. Re-run relevant checks on the integrated commit, then broader required CI/Compose acceptance. Archive completed worktrees using app lifecycle tools only after preserving needed evidence. Leader alone signs final completion; P0 is not started by a preparation review.
