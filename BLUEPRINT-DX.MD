# BLUEPRINT-DX — DEVELOPER EXPERIENCE WORKBENCH

**Document ID:** MW-BP-DX-001 · **Version:** 1.0.0  
**Priority:** P0 — first product/workstream to establish the implementation factory  
**Parent:** BLUEPRINT-APPLICATIONS.MD · **Governance:** BLUEPRINT-RULES-GOVERN-CONTRACT.MD · **Tasks:** tasks.json

## 1. Mission

apps/dx is the developer desktop/control tower used to build, test, coordinate, review and deploy the entire Living Platform. It is the first implementation priority because the ecosystem has many independently owned app domains and will be built by human developers and multiple AI workers.

DX is not merely a code editor, a chat window or a clone of an existing AI coding product. It is a governed engineering workspace that connects local repositories, AI coding agents, tasks, Git, tests, packages, CI and deployment.

**Main promise:** any authorized developer can see what should be built next, assign it to an appropriate local/remote agent, inspect every change and verify the result.

## 2. Product modules

1. **Universe/Project Switcher:** repository, product/app, environment, branch and worktree context.
2. **Task Control Center:** reads the canonical tasks.json; shows dependency-ready, claimed, blocked, review and done tasks.
3. **Agent Fleet:** provider/CLI/local-model adapters; capabilities, concurrency, cost/time budget and current work.
4. **Worktree Manager:** isolated Git worktrees/branches, ownership paths, dirty-state protection and cleanup review.
5. **Context Builder:** gives an agent only the relevant blueprint, task, dependencies, files and contracts.
6. **Execution Room:** process state, tool calls, tests, logs, artifacts, token/cost metadata and cancellation.
7. **Diff & Review:** changed files, diff, static checks, test evidence, risk classification and human approval.
8. **Package/Architecture Explorer:** app inventory, package graph, contract map, dependency cycles and ownership.
9. **Build/Test Matrix:** commands and results per app/package with environment and commit identity.
10. **Release/Deployment Console:** preview, CI, staging and production gates; production requires human approval.
11. **Secrets/Identity Integration:** obtains short-lived scoped credentials; never displays or stores vault contents in task context.
12. **Knowledge/Docs Explorer:** links decisions, ADRs, relevant blueprints and progress reports.

## 3. Execution architecture

Separate the desktop UI from the privileged local execution process:

- **DX Desktop UI:** shows state and sends typed requests to a local daemon.
- **DX Local Daemon:** owns workspace discovery, Git worktrees, file access, terminal/process execution, test runner and local agent adapters.
- **Agent Adapter Layer:** invokes configured coding agents/LLM runtimes through explicit adapters. No single vendor is required.
- **Task Coordinator:** claims tasks, validates dependencies, leases and file ownership, and commits state changes.
- **Policy Engine:** authorizes filesystem/process/network operations, environment access and destructive commands.
- **Remote Integrations:** GitHub, CI, artifact registry and approved deployment APIs.

The local daemon is a privileged component. It must bind to loopback or an authenticated local IPC transport, validate caller origin/identity, use per-operation permissions, reject arbitrary remote invocation and provide a kill switch.

## 4. Central tasks.json behavior

tasks.json is the canonical repository execution plan and status ledger unless an ADR explicitly changes the source of truth. DX must:
- parse and validate schema/version/unique IDs/dependency DAG;
- calculate dependency readiness without changing task meaning;
- atomically claim a task with agent ID, lease, worktree/branch and owned paths;
- prevent two workers from claiming overlapping exclusive paths;
- refresh the latest branch/blob before every update;
- use optimistic concurrency/compare-and-swap and retry after conflicts;
- patch only the claimed task, preserving unrelated records;
- record evidence, blockers and changed paths;
- require acceptance criteria and verification evidence before done;
- never invent test output, completion time or status.

Because tasks.json is a large shared file, updates must go through one serialized registry writer/coordinator. Local file locks protect one machine; GitHub/remote compare-and-swap protects cross-machine updates. A stale full-file overwrite is forbidden.

## 5. Agent execution safety

A task's prompt is not an authorization grant. Enforce:
- allowlisted repository/worktree roots;
- explicit read/write paths and denied paths;
- per-task command/tool allowlists;
- network access policy;
- no ambient production secrets;
- ephemeral process environment;
- configurable CPU/RAM/time/output budgets;
- process tree termination and cancellation;
- no Docker socket or host root by default;
- human approval for destructive Git, production deployment, schema changes or external side effects;
- audit of task, agent, worktree, command class, result and approver.

Never run an untrusted repository script with unrestricted host privileges. Use container/VM sandboxing when threat model requires it. Separate trusted agent adapter code from untrusted model-generated commands.

## 6. Editor strategy

Do not build a complete code editor from scratch as phase one. Build the DX control plane first and integrate existing editors through extension/protocol APIs. A VS Code-compatible extension can expose task context, agent status, diff review and commands inside the editor. Keep the extension thin; privileged filesystem/process operations remain in the local daemon.

A dedicated editor fork or embedded IDE is a later ADR requiring licensing, update, extension compatibility, security, terminal and remote-workspace analysis.

## 7. Task scheduling and orchestration

Support dependency-aware scheduling, worker leases, heartbeat, retry classification, cancellation, manual priority, concurrency by provider/resource, per-task budgets and human gates. Do not start dependency-blocked tasks. Do not parallelize tasks sharing a lockfile, central registry, ORM registry, composition root, shared token map or route registry.

Each agent receives a bounded context pack and produces a structured completion report:
- task ID and claim/lease;
- repo/branch/worktree/commit;
- changed paths;
- commands and exit codes;
- test evidence;
- security/data impact;
- screenshots or recordings where relevant;
- incomplete criteria and blockers;
- proposed status.

DX itself validates evidence; agent self-report alone is insufficient.

## 8. Technology decisions

Preferred direction, subject to proof of concept:
- Node.js + TypeScript for orchestration adapters and workspace tooling.
- pnpm/Turborepo as the project workspace system.
- A desktop shell such as Tauri 2 may be evaluated for a small native footprint, with narrowly scoped capabilities. Do not grant broad filesystem or shell permissions to every webview.
- VS Code Extension API integration before editor forking.
- SQLite may be used for local cache/queue metadata, but tasks.json on the repository remains the canonical shared plan.
- Local daemon uses a typed IPC/API and explicit permission model.
- Provider adapters support local models, coding CLIs and approved remote services without hard-coding one vendor.

## 9. UX design

DX is an engineering cockpit, not the same visual environment as the public RockSoul landing page. Use high-density developer information, real-time run panels, graph visualization, terminal/diff surfaces, alert semantics and rapid navigation. It can use the platform's anime/game visual DNA selectively, but code, diffs, test failures and logs must remain easy to inspect.

## 10. Required milestones

**DX-0 — Task reader:** schema validation, task graph, filters and dependency readiness.  
**DX-1 — Safe claim coordinator:** atomic lease and conflict prevention.  
**DX-2 — Worktree runner:** isolated branch/worktree and bounded command execution.  
**DX-3 — One agent adapter:** execute a single P0 task end-to-end with evidence.  
**DX-4 — Multi-agent orchestration:** concurrency, locks, cancellation and retry.  
**DX-5 — Review/evidence:** diff, tests, acceptance checks and human review.  
**DX-6 — GitHub/CI:** branch, commit, checks and issue/PR links.  
**DX-7 — Deployment integration:** staging first, production approval mandatory.

## 11. Required deliverables

Threat model, app architecture, task schema validator, task coordinator, lease/lock algorithm, local daemon, sandbox policy, agent adapter interface, worktree manager, execution UI, diff/review surface, test evidence model, VS Code integration and operations runbook.

## 12. Task ownership

Tasks DX-* in tasks.json. DX is the first implementation workstream; do not wait for all 14 frontends before building its task-reading and safe-orchestration foundation.

## 13. Definition of done

DX can safely read and validate the central registry, claim one ready task atomically, create a protected worktree, run one approved local agent in a bounded environment, collect real command/test evidence, show a reviewable diff and update only that task without losing other updates. This is the minimum useful DX vertical slice.