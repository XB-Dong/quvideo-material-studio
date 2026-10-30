# P2 final source lifecycle diagnosis

- rootTaskId: P2-VERIFY (unchanged)
- findingId: P2-FINAL-03
- waveId: P2
- specVersion: P2-1.0.0
- baseCommit: 111fe8a57202a8794cbfe9bc7eac6dcf27308944
- requirements: R-08.d, R-11.a, R-12.a, R-12.d, ACC.c, ACC.d
- dependencies: original P2 implementation and accepted candidate110; mandatory final CI41046555176 failed, no next-wave authorization
- budgetMinutes: 30 for bounded diagnosis; reassess after two unsuccessful repairs for the same root cause
- runtimeLease: Acceptance only, isolated p2-cleanroom3302; no production3000 changes
- ownerTransfer: Acceptance uniquely owns tests/p1.1/visual.mjs for telemetry and scenario cleanup; tests/p2 remains Acceptance. Frontend reads product lifecycle source only until a concrete product finding is assigned. Leader owns shared docs/state/CI/integration.

## Observed failure

Final-source CI passed frontend and backend, failed the P1.1 visual offscreen scenario with expected0/actual1, then reduced-motion scenario with offscreen hero retained after the earlier throw. Actual before-reduce audit shows Orbit0, pendingRAF1; reduced-motion samples show RAF0. Do not label this an Orbit leak or an infrastructure failure without matching source/actual callback evidence.

## Required approach

Read preserved log/artifact and capture native pointer target, viewport/scroll/hero geometry, observer/render delivery and RAF source. Keep original600ms checkpoint and original Orbit0/globalRAF0 assertions. Put viewport/scroll restoration in finally so a failed scenario cannot contaminate the next check. If native compositor delivery or accidental background pointer input is proven, correct only the observable setup; one normal viewport screenshot with animations allowed may provide an actual render in this visual-only harness. Do not synthesize visibility/IO events, force capabilities, disable motion, broaden thresholds or skip CI. Do not blindly rerun remote CI.

## Handoff

Provide exact implementation SHA, source/telemetry before and after, actual commands/environment/time/exit, retained failure, case cleanup evidence, unchanged assertions and any limitations. Author cannot call self-check independent review. Leader accepts/rejects based on evidence, integrates and verifies actual affected checks, then runs normal required full CI. Any product change requires a separate explicit file owner transfer, behavior tests and fresh affected runtime evidence. Source111 and its six files are withdrawn pending this check; final exact source/hash must be regenerated after accepted fixes.

## Formal owner extension and accepted local result

Leader explicitly extended Acceptance ownership of tests/p1.1/visual.mjs to the formal native setup repair. Real visible footer/A pointer is trusted and Ink-excluded, cardActive0; one ordinary viewport render precedes the unchanged600ms assertion clock. This is an explicit trigger/render prerequisite change, not an assertion after a failed checkpoint or performance comparison with the earlier undelivered setup. Native IO false, Orbit0/globalRAF0 are required directly; finally restores viewport/top with a normal render. Full local6/6 exit0 at formal source1cdd5b8807bb34d3e49996ef7967c0482db3b3a9, integratedbecb7ee, independently source-reviewed. Original local600ms diagnosis did not reproduce CI; remote pointer cause is not fully recorded. Source mapping and local trustedMAIN input support the setup contamination, not a proven product leak. Full remoteCI remains required and all old checks/budgets remain.
