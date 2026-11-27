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
