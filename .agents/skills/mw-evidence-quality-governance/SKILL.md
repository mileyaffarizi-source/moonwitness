---
name: mw-evidence-quality-governance
description: Verify implementation truth, tests, progress documentation, source provenance, canon and release readiness for MoonWitness.
---

# Evidence, quality and governance

## Use when
Changing tests/CI/docs/wiki/progress reports, measuring completion, publishing research/narrative assets or preparing a release.

## Read first
[Governance contract](../../../BLUEPRINT-RULES-GOVERN-CONTRACT.MD), the owning blueprint and the exact task's acceptance criteria. Do not mirror all blueprint prose into progress documents.

## Evidence rules
- Separate target design, implemented code, tested behavior and production operation. Never present one as proof of another.
- Record evidence with commit/environment, command, result, date/version and scope. Mark untested, mocked, stale or partial evidence explicitly.
- A task is complete only when every acceptance criterion is satisfied and evidence is linked. Green CI proves only the jobs it actually ran.
- Keep docs navigable and concise: overview → decision/source → implementation → verification → remaining gaps. Prefer links to canonical documents over copied specifications.
- For claims/research, preserve source, edition/version, exact quotation boundaries, provenance and confidence. Distinguish fact, interpretation, hypothesis and disputed claim.
- For asset publication, verify source/license, creator, version, target use and approval. Unknown rights means do not publish.
- Preserve canon and authorship. Never create visual depictions of Allah, Prophet Muhammad or Isa/Jesus. Escalate ambiguous identity or restricted content for human review.
- Record unresolved work honestly; do not silently delete tasks or lower acceptance criteria to improve completion statistics.

## Release check
Review diff, frozen install, lint/format/typecheck/build where configured, targeted tests, integration/security/accessibility checks applicable to the change, migration/rollback impact, secrets, dependencies, artifact identity and deployment approval. Report what was not run.
