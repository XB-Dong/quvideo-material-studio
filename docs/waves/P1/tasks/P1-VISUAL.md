# P1-VISUAL

- taskId: P1-VISUAL
- rootTaskId: P1-VISUAL
- waveId: P1
- roundId: assigned_at_dispatch
- status: prepared_not_dispatched
- role: Frontend Visual/Creative/Motion
- baseCommit: 07300db74eefe5d8d1ecf979de314450bf5f2a78
- baseCommitMeaning: P0 sealed preparation anchor; Leader replaces with exact active integrated commit and records revision before dispatch
- specVersion: P1-1.2.0
- requirementIds: P1-CREATIVE-01, P1-VIS-01, P1-UX-01, P1-REG-01
- dependencies: P1-BASE, P1-DIRECTION
- requestedModel: inherit_current_session
- requestedReasoningEffort: inherit_current_session
- actualProvider: null
- actualModel: null
- actualReasoningEffort: null
- modelVerificationStatus: not_verified
- contextMode: self_contained_packet_with_scoped_specs
- focusedCheckInMinutes: 60_to_90
- cumulativeRepairCount: 0
- sameRootCauseReassessmentAfter: 2_unsuccessful_repairs
- reviewer: independent_acceptance_or_reviewer_and_Leader_disposition

## Context and authorization

Read AGENTS.md, CONSTITUTION.md, docs/agents/PROTOCOL.md, docs/waves/P1/PLAN.md, docs/waves/P1/ROLES.md, docs/waves/P1/CONTEXT-MAP.md, docs/waves/P1/state.json, docs/waves/P1/ACCEPTANCE.md, specs/p1/requirements.md, specs/p1/design.md, specs/p1/motion.md, specs/p1/assets.md, specs/p1/react-bits.md, plus specs/api.yaml, specs/frontend-state.md and docs/waves/P0/REPORT.md. This packet is preparation, not P1 execution authorization. Verify precise base and ownership before work.

## Goal

Implement light-neutral tokens with restrained blue-violet details, three pages, two dialogs and full interaction states with one frontend writer. Continue to read live Java data and preserve all existing lifecycle rules.

## Allowed write paths

- frontend/src/app/globals.css
- frontend/src/styles/
- frontend/src/components/catalog.tsx
- frontend/src/components/studio.tsx
- frontend/src/components/history.tsx
- frontend/src/components/shell.tsx
- frontend/src/components/visual/
- frontend/src/components/*.test.tsx

Write only assigned paths. Shared dependencies/CI/contracts need recorded Leader ownership transfer. Do not edit protected P0 API/query/session/submission generation logic to accommodate animation. A broad test directory does not authorize rewriting existing tests to conceal failure. Read-only relevant source access is allowed.

## Acceptance

- Use porcelain/white/light-neutral backgrounds, charcoal text and blue-violet fine lines, borders, icons and sparse action accents. No dark theme, page-wide blue-purple wash, neon glow or black Canvas fallback blocks. Verify actual effects and contrast in the light interface.

- No user-visible effect/component names, technical annotations, parameters or hover/mouse-experience instructions. Name gallery tabs by image subject; retain necessary actions, state/errors, accessibility labels and motion controls. Technical mappings belong only in development documents.

- Desktop1280/1440 and375 layouts, contrast, focus, image/error/empty/loading states meet design spec.
- Keep UploadSlot/Maker identity/submission guards, stable task.id and existing query boundaries.
- Run focused tests and full frontend checks in containers; hand off ownership before motion task.

## Handoff

Use docs/waves/P1/handoffs/TEMPLATE.md. Include exact implementation/tested SHA, changed paths, requirement mapping, environment, commands/operations, times, exit codes, source/asset metadata, failed checks, findings and limits. Preserve rootTaskId and cumulative repairs. No unsupported runtime/model claims.

## Creative layout handoff

Prepare the compact hero, plain template grid and four-tab image gallery with static posters and a visible motion toggle. Preserve core flow access and page density; the same writer proceeds to P1-CREATIVE. Do not add continuous decorative background movement.
