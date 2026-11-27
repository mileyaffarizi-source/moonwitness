# Change inventory

**Audit date:** 2026-11-27  
**Repository:** `mileyaffarizi-source/moonwitness`  
**Current main:** `16937bd804f2d2977227a5badc04648dc9170e55`  
**Task:** GOV-001

## Attributed commit history

| UTC | Commit | Change |
|---|---|---|
| 2026-11-27 12:51:36 | `d4aa217c69f093a5375778d56babfcb62e6f6206` | Added the master Living Platform blueprint |
| 2026-11-27 13:14:18 | `573d25fd2d2d7f02727dbc069c6b349af8bb94de` | Added specialist blueprints and centralized 120-task registry |
| 2026-11-27 13:52:07 | `e1786dd295dcee886e28d3d3feafdb3752d3401` | Expanded to fourteen app surfaces and 234 task records |
| 2026-11-27 14:04:05 | `d79f28e1df2bf862bae381642428c6fb4afe48d1` | Added initial repository implementation audit |
| 2026-11-27 14:06:43 | `449d64b63c552820d9a1b10784e26833179c6c36` | Added Node.js/pnpm monorepo foundation, workspace, shared TS baseline and checks |
| 2026-11-27 14:07:18 | `089fe9d2737a57263a34704f19cb57a3919eaedb` | Fixed CI tool setup order so pnpm exists before pnpm cache setup |
| 2026-11-27 14:21:32 | `b38c888e51490b936f9d7b02a8274c7cc7c8d7e1` | Added root AGENTS.md and nine focused skills |
| 2026-11-27 14:22:10 | `37491f61ba89137a50bfaf860c2215656ede877e` | Added tests/validation for skill metadata and index |
| 2026-11-27 14:23:19 | `c1c604801e4bbde982a44689aac7b6c48b1978ee` | Merged PR #1: repository foundation and agent standards |
| 2026-11-27 14:28:46 | `ea2ddb19ebc4a4a62e456d24e18ea93c84852821` | Added 14-app inventory, materialization baseline, package audit and dependency graph |
| 2026-11-27 14:29:16 | `5a7b2d084d377a82b9deddd567e8c0fa411ff305` | Recorded APP-001/PKG-001 evidence and review states |
| 2026-11-27 14:30:22 | `16937bd804f2d2977227a5badc04648dc9170e55` | Merged PR #2: application and package prerequisite audits |

## Merged pull requests

### PR #1 — Repository foundation and agent standards

- URL: https://github.com/mileyaffarizi-source/moonwitness/pull/1
- Status: merged
- Merge commit: `c1c604801e4bbde982a44689aac7b6c48b1978ee`
- Diff: 26 files, 609 additions, 0 deletions
- Includes root manifests, workspace/lockfile, CI, ADR, repository scripts, `AGENTS.md`, nine skill files, skill index and tests.
- CI: pass on PR head and merged main.

### PR #2 — Application and package prerequisite audits

- URL: https://github.com/mileyaffarizi-source/moonwitness/pull/2
- Status: merged
- Merge commit: `16937bd804f2d2977227a5badc04648dc9170e55`
- Diff: 5 files, 229 additions, 7 deletions
- Includes four architecture audit outputs and a minimal task-ledger update.
- APP-001 and PKG-001 remain `in_review`; merge was not used as a substitute for their outstanding verification.
- CI: pass on PR head.

## Change scope and preservation

- Blueprint/task-registry expansion predates the repository engineering foundation.
- Foundation changes were additive; no app/source implementation was deleted or overwritten.
- The only existing task records changed in PR #2 are APP-001 and PKG-001 (review status/evidence and declared report ownership).
- No task was removed, task dependency was bypassed, or task marked done as part of PR #2.
- No application source, database, infrastructure resource, secret, external system or user data was changed.

## Audit method and limitations

The inventory uses GitHub's remote commit list, refs, recursive tree, pull request metadata and workflow run records. It does not expose workstation-local uncommitted changes or non-Git systems. Commit attribution is based on the author/committer metadata GitHub returns; this report does not infer an individual human identity from a shared repository account.
