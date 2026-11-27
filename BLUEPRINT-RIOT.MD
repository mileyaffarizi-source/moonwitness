# BLUEPRINT-RIOT — CREATIVE STUDIO, MEDIA & ISOLATED SECURITY LAB

**Document ID:** MW-BP-RIOT-001 · **Version:** 1.0.0  
**Parent:** BLUEPRINT-APPLICATIONS.MD · **Tasks:** tasks.json

## 1. Mission

apps/riot is an experimental creative/media and security research environment. It combines content production, visual/audio/media experimentation, controlled red-team/blue-team exercises, lab resources and a research archive.

Because its capabilities can carry elevated risk, RIOT must be divided into isolated domains with separate credentials, infrastructure and approvals. It is not a bridge into production infrastructure.

## 2. Product areas

- **Creative Studio:** concepts, briefs, storyboards, visual/audio/video production and versioning.
- **Media/Content Lab:** editing pipelines, asset metadata, publication workflow and distribution approvals.
- **War Equipment Archive:** historical, journalistic, fictional or museum-style catalogue and media archive with provenance and non-operational descriptions.
- **Red Team Lab:** authorized security testing against explicitly scoped lab assets.
- **Blue Team Lab:** detection engineering, telemetry, incident response, defensive validation and recovery exercises.
- **Sandbox Infrastructure:** ephemeral isolated environments with reset/teardown and synthetic data.
- **Research Archive:** reports, lab notes, test evidence, vulnerabilities with responsible handling and remediation status.

## 3. Safety boundary for war-related material

War equipment may be catalogued, researched historically, described editorially, modeled as fictional/nonfunctional props or represented in media. Do not turn this archive into instructions for constructing, acquiring, modifying, targeting or operationally deploying real weapons, ammunition, explosives or other tools of harm. Do not generate actionable targeting or battlefield-use guidance. Any restricted request is blocked and recorded.

## 4. Red-team / blue-team governance

Red-team exercises require written authorization, named owner, exact target scope, allowed techniques, time window, rate limits, contact/escalation, stop conditions and evidence handling. Default scope is an isolated synthetic lab only. Production assets, third-party systems, customer networks and public targets are out of scope unless there is a separate documented authorization and security review.

Do not provide persistence, stealth, evasion or destructive actions outside a bounded authorized test. The lab must have a kill switch, egress controls, reset/restore and audit trail.

Blue-team workflows emphasize detection, alert triage, incident containment simulation, forensics preservation, remediation verification and recovery drills.

## 5. Isolation architecture

Separate creative workloads from security lab workloads. Use separate cloud projects/accounts, networks, service identities, secrets policies, runner pools and storage classifications. Lab runners are ephemeral, least-privileged and destroyed/reset after sessions. No shared production credentials. No privileged Docker socket or unrestricted host mount. Cross-boundary data export is reviewed and logged.

## 6. Creative content governance

Every project has creative owner, source/rights, versions, collaborators, review state and release destination. Generated content is derivative/proposal until human review. Audio/video/images have accessible alternatives and provenance. Apply the creative-canon visual restrictions to all prompts/assets: no visual depiction of Allah, Prophet Muhammad or Isa/Jesus.

## 7. Security findings and disclosure

Record asset, scope, methodology at a safe level, finding, impact, evidence, affected version, owner, remediation, retest and disclosure status. Protect exploit details and sensitive data. Define responsible disclosure and retention policy. Red-team success is not merely tool execution; it includes safe scope adherence and actionable defensive evidence.

## 8. Required deliverables

RIOT charter, lab threat model, authorization templates, target-scope registry, sandbox provider, runner isolation, kill switch, egress policy, red/blue exercise workflow, creative media pipeline, war-archive metadata schema, rights and restricted-content controls, incident runbook.

## 9. Task ownership and definition of done

Tasks RIOT-* in tasks.json. Done means creative and security workloads are isolated, each red-team session is authorized and auditable, lab resources are ephemeral, defensive evidence is reproducible, and the war archive remains non-operational research/media rather than weapon-construction or deployment guidance.