# Arsy — Rust Telecom Protocol Services

**Status:** Architecture/planning anchor only. No executable protocol server is present yet.

Read the root [BLUEPRINT-ARSY.MD](../../BLUEPRINT-ARSY.MD), [sixteen-app topology](../../BLUEPRINT-APPLICATIONS.MD), and tasks ARS-001 through ARS-014 in [tasks.json](../../tasks.json).

Target services: RADIUS AAA for existing PPPoE NAS/BRAS/BNG, TR-069/CWMP ACS and Syslog ingestion/normalization. Arsy does not terminate PPPoE, own subscriber entitlements/billing, maintain OSS network inventory or create OSS incidents. Protocol operations use API-issued policy/approval contracts and an app-owned, bounded protocol-session store.

**No production NAS/CPE endpoint, subscriber credential or network configuration is authorized by this README.**
