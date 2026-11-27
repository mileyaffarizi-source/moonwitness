# BLUEPRINT-A-L-L-A-H — FLAGSHIP LANDING, DIVINE CORPUS & KNOWLEDGE

**Document ID:** MW-BP-ALLAH-001 · **Version:** 1.0.0  
**Priority:** P0 — flagship public identity and knowledge experience  
**Parent:** BLUEPRINT-APPLICATIONS.MD · **Narrative:** BLUEPRINT-NARATION.MD · **Tasks:** tasks.json

## 1. Mission

apps/A-L-L-A-H is the flagship public landing and knowledge experience for:

**A-L-L-A-H.COM — EMPIRE OF THE LIGHT**

Exact recorded taglines:
- SUNSHINE BELONG
- FIND LIGHT IN DARKNESS
- HOW U REMIND ME

The experience brings together a public landing page, Divine Corpus, ontology, law and government knowledge. It must distinguish source classes and authority rather than collapsing every document into one undifferentiated AI knowledge base.

## 2. Knowledge architecture — separate epistemic layers

At minimum, preserve distinct collections and source types:

1. **Divine/primary corpus:** original source text, language, edition/manuscript/recension where applicable, canonical structure and provenance.
2. **Translations:** derivative texts with translator, language, edition, source version and review status.
3. **Commentary and interpretation:** attributed commentary, scholarly works, historical context and competing interpretations.
4. **Research and comparative knowledge:** analysis, citations, hypotheses and editorial conclusions clearly labeled.
5. **Human law:** constitution, statutes, regulations, decrees, court decisions, agency regulations, official gazettes and other jurisdiction-specific legal sources.
6. **Government knowledge:** official policies, public data, administrative guidance, institutional records and government publications.
7. **Ontology:** concepts and relationships that connect these collections without erasing their different authority, provenance or interpretive status.

Do not treat a translation as the original corpus. Do not treat commentary as primary text. Do not treat a government webpage as legislation. Do not treat a legal summary as binding law. Do not imply that human legal systems and divine/religious source corpora have interchangeable authority.

## 3. Source registry and provenance

Each source record includes immutable source ID; source class; title; author/issuer/tradition when known; language; edition/version; publication/creation date; jurisdiction and effective dates for legal material; source URI/archive; retrieval timestamp; source checksum; structure locator (book/chapter/verse/section/article/page/paragraph as relevant); rights/access classification; source quality and verification state.

Preserve exact source text and source snapshots where permitted. A changed URL or amended law must create a new version and relation, not overwrite prior content.

## 4. Ontology and knowledge graph

Represent concepts, entities, authorities, places, events, legal instruments, corpus passages, translations, commentaries, claims and relationships.

Every relation records type, source/target, assertion source, author/agent, date, jurisdiction/time context, status (proposed/asserted/disputed/verified per review policy), evidence and revision. AI-extracted relations remain proposed until reviewed. Avoid an ontology that silently encodes one theological or legal interpretation as universal truth.

## 5. Legal knowledge requirements

For legal content, track jurisdiction, issuing authority, instrument type, enactment/publication date, commencement/effective date, amendments, repeal/supersession, court interpretation and source location. Show whether a document is current, historical, amended, repealed or uncertain. Never claim current law solely from an undated cached copy.

Legal retrieval must cite the source and relevant section/article, distinguish primary law from commentary, identify jurisdiction/date and communicate uncertainty. This system is a research/knowledge aid, not a substitute for qualified legal advice.

## 6. Corpus search and AI

Search must be source-aware, language-aware and version-aware. AI answers should:
- cite exact corpus/source locators;
- distinguish quotation from paraphrase and interpretation;
- show source edition/translation;
- identify conflicting or differing interpretations;
- abstain when evidence is missing or source quality is unclear;
- never fabricate a verse, article, quotation or legal status;
- never present generated ontology edges as established fact without review.

Provide reproducible retrieval logs and evaluation datasets. Preserve the source passages used to produce an answer, subject to rights/privacy constraints.

## 7. Public landing and experience

The flagship landing page should communicate the authored brand clearly, provide a memorable but restrained visual identity and route users into corpus, ontology, law and government knowledge spaces. It should not make unsupported theological/legal claims or suggest endorsement by a government/authority.

No visual depiction of Allah, Prophet Muhammad or Isa/Jesus. Preserve allowed names and textual references only in authored context. Do not create representational substitutes, avatars, silhouettes or generated embodiments.

## 8. Governance and editorial review

Separate source acquisition, transcription, translation, commentary, research annotation, ontology assertion, AI summary and publication. Each has an owner and approval state. High-impact interpretations and legal status updates require human expert/editorial review. Keep disagreements and source variants visible rather than deleting them.

## 9. Data/security boundaries

Public material may be indexed according to rights. Restricted/private sources require access control and retention policy. Do not expose private notes, personal data, privileged government material or licensed sources beyond permitted use. API enforces access; public search indexing must exclude protected records.

## 10. Required deliverables

Brand/landing experience, corpus taxonomy, source schema, versioned text storage, translation lineage, legal instrument model, jurisdiction/time model, ontology schema, citation engine, retrieval/evaluation suite, editorial workflow, rights policy and restriction tests.

## 11. Task ownership and definition of done

Tasks ALLAH-* in tasks.json. Done means users can discover the flagship experience, retrieve source-grounded corpus/legal/government content with precise citations and version/jurisdiction context, inspect ontology provenance and distinguish original sources from translations/commentary/generated analysis.


## 12. Claim, citation and epistemic status contract

A knowledge claim is a separate record from its source. Each claim includes immutable ID, exact proposition, claim class, subject/predicate/object where applicable, source references and exact locators, language/edition/jurisdiction/time, author/annotator, extraction method, counter-evidence, review state, confidence rationale and revision history.

Required classes include direct quotation, source-derived paraphrase, scholarly/editorial interpretation, legal statement, historical assertion, hypothesis, inference, disputed statement, AI-generated summary and unknown. A source citation does not automatically verify the claim; reviewers assess whether the source actually supports that proposition and in which context.

Citation resolution must identify source version/checksum, section/page/verse/article locator, translation lineage and retrieval date. If the source has changed or the locator no longer resolves, mark the citation stale and prevent the answer from claiming current verification.

## 13. Legal currency and jurisdiction resolver

Legal records need jurisdiction hierarchy, issuing authority, instrument number/type, official publication, publication date, commencement/effective range, amendments, repeals/supersession, transitional provisions, authoritative source link and retrieval/verification time. Legal currentness is a computed answer for a specific jurisdiction/date, never a single boolean stored without context.

Where instruments conflict or status cannot be established, surface the conflict and source set. Do not infer that a bill, guidance note, court summary or unofficial translation has the same force as enacted primary law. AI retrieval must not suppress amendments/repeals or present a summary as binding text.

## 14. Ingestion, extraction and review pipeline

Source onboarding: **candidate → rights/classification review → source identity check → immutable capture/locator → parse/OCR where necessary → checksum/quality validation → human review → publishable / restricted / rejected**.

Parsing preserves the original bytes or permitted source snapshot separately from normalized extracted text. Each extracted passage stores parser/version, page/section locator, extraction confidence, correction history and source checksum. OCR/transcription errors remain correctable annotations; they must not overwrite source material.

AI may suggest metadata, translations, entities, relations and summaries. Each suggestion enters a proposal queue and cannot become an approved claim, canonical relation or published answer until its required human review passes.

## 15. Ontology governance and retrieval policy

Ontology terms have stable concept ID, preferred label, aliases, definition, type, source lineage, authority class, language, scope, status and curator. Edges have relation type, direction, evidence, time/jurisdiction context, reviewer and status. Similar names or semantic similarity may suggest candidates but cannot merge entities or establish historical/religious/legal identity.

Retrieval filters by source class, language, edition/version, jurisdiction, effective date, access classification and review state. Ranking metadata must not cause a low-authority commentary to silently outrank an authoritative primary source where the user asks for primary law/text. Answers include evidence coverage and explicit limitations.

## 16. Evaluation and acceptance

Create versioned evaluation cases for source/edition disambiguation, translation lineage, exact quotation, citation locator resolution, contradictory commentary, amended/repealed law, jurisdiction/date filtering, restricted-source leakage and adversarial prompt injection in source documents. Measure citation precision, claim support, abstention accuracy, stale-source detection and access-control leakage.

**Acceptance:** a user can follow each important statement to a versioned source locator, distinguish primary/derivative/interpretive material, inspect unresolved disagreement and understand why a result is current, historical, disputed or unverified.
