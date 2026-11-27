# Architecture change process

**Task:** GOV-002  
**Companion:** [ADR template](../adr/ADR-TEMPLATE.md) · [Decision register](../adr/decision-register.md)

## When an ADR is required

Create an ADR before implementing a material change to:
- platform/app/package boundaries or dependency direction;
- runtime, framework, database, ORM or deployment topology;
- identity, authorization, secret handling or privileged execution;
- public/internal API or event contracts;
- data source of truth, Odoo integration or migration/cutover;
- task-registry authority, status/dependency/claim semantics;
- release/rollback policy or security posture;
- canon, editorial authority, rights or restricted content.

Routine implementation within an accepted contract does not need a new ADR.

## Required sequence

1. **Observe:** inspect current code/config, docs, task and evidence. Label unknowns; do not assume empty or production-ready.
2. **Frame:** identify owner, consumers, source of truth, trust boundary, dependency impact and rollback.
3. **Compare:** consider at least one viable alternative and the option to defer. Avoid fake alternatives added to satisfy a template.
4. **Draft:** use the ADR template; link task IDs and affected blueprints/packages.
5. **Review:** obtain the authorized domain/platform owner and security/data/legal review when relevant. Approval must name the exact decision/scope.
6. **Record:** update the decision register and cross-references in the same PR.
7. **Implement:** only after acceptance, unless an explicitly reversible spike is approved and labeled as such.
8. **Verify:** tests, CI, migration, compatibility and operational evidence are linked. Update the task registry atomically.
9. **Supersede:** create a new ADR for material reversal; preserve the old record and rationale.

## Precedence and conflict handling

Use the governance precedence order. A specialist blueprint, task, PR description or agent response cannot weaken a higher-level platform law. When sources conflict:
- pause only the conflicting scope;
- preserve unaffected work;
- describe the conflict and affected files/tasks;
- prepare an ADR or clarification request;
- do not resolve it by deleting a dependency or silently rewriting source documents.

## Approval integrity

- A GitHub merge is evidence of code integration, not automatically evidence of domain/security approval.
- A task owner's prompt to “continue” is not blanket approval for future production, destructive, financial, identity or canon actions.
- AI may prepare an approval packet but cannot act as the human approver.
- Approval binds to the exact ADR version and scope. Material changes require renewed review.
