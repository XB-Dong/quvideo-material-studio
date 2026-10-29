# Acceptance Handoff

- taskId/rootTaskId: P0-ACCEPT
- waveId: P0
- baseCommit: 0d2627243e1a8e86eb33f5f975d202cf56d135b3
- specVersion: 1.0.0
- role: Independent Acceptance
- requestedModel/requestedReasoningEffort: inherit current session
- actualProvider/actualModel/actualReasoningEffort: null
- modelVerificationStatus: not_verified
- changedPaths: tests/, docs/waves/P0/evidence/acceptance/bootstrap.md, this handoff
- implementationCommit: suite cfcb9ff0eeb1ac2814f6232b65b36fbf015b3aad, image digest follow-up in Git history
- status: test entry authored; runtime acceptance pending integrated stack

## Interface for integration

Build context tests/, Dockerfile tests/Dockerfile, default CMD python -m unittest -v test_api. Environment BASE_URL=http://frontend:3000, APP_PUBLIC_ORIGIN=http://localhost:3000, TESTED_COMMIT=exact integrated SHA. Use enabled simulation controls and local HTTP cookie mode. Python 3.12.12 slim pinned by digest; no pip dependencies.

## Actual verification and limits

Container build and AST/module/PNG smoke passed. Docker Hub manifest request first failed; image pull then succeeded, no behavioral Red claimed. Full live API suite not_run until Java/frontend/MySQL integrated. Evidence: docs/waves/P0/evidence/acceptance/bootstrap.md. Runtime suite writes only synthetic anonymous demo records and tiny PNG files. Browser interaction, frontend race tests, restart/backup and CI are separate gates.

## Coverage and next steps

R-02/03/04/05/06/08/09/10 through eight independent HTTP test groups, including 202 acceptance before long generation, no-query execution, three failure stages, pagination, immutable terminal reads and foreign task/asset/result access. Read-only GET fault UI behavior remains frontend/manual acceptance. Leader should integrate tests, run api-check against the exact integrated commit, preserve stdout/exit code and return findings for independent investigation. No contract defect identified in this pass; no product files modified.
