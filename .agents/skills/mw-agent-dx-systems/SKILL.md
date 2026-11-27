---
name: mw-agent-dx-systems
description: Design safe Agent and DX orchestration, tool contracts, coding-agent workers, context packs and local execution.
---

# Agent and DX systems

## Use when
Building `apps/agent` or `apps/dx`, agent/tool/workflow registries, local coding-agent adapters, task schedulers or worktree runners.

## Read first
[Agent blueprint](../../../BLUEPRINT-AGENT.MD) or [DX blueprint](../../../BLUEPRINT-DX.MD), whichever owns the task. Read both only for a genuine integration.

## Boundary
- Agent is the shared model/agent/workflow runtime. DX is the engineering control tower and local execution workbench.
- Task prompts are not permission grants. API validates identity and authorizes every business mutation.
- Agents use typed, allowlisted API capabilities; never direct business DB credentials, arbitrary SQL, unrestricted shell, host filesystem, Docker socket or cloud-admin access.
- DX local daemon is privileged: loopback/authenticated IPC, explicit per-operation permissions, workspace allowlist, process/output/time budgets, cancellation and audit.
- Use isolated worktrees and exclusive path ownership. Serialize edits to task registry, lockfile, composition roots and global registries.
- Context packs contain only task, dependencies, relevant docs, allowed paths and necessary contracts. Do not dump the entire repository into model context.
- Prefer deterministic code/workflows over LLM calls where the outcome is predictable.

## Required contracts
Every tool/workflow declares typed input/output, actor source, capability/risk tier, idempotency, timeout, retry/cancel behavior, output size/redaction, audit fields and test/evaluation path. Consequential or destructive actions require approval bound to the exact target and payload.

## Proof
Verify persisted effects independently. A model saying “success” is not evidence of a completed workflow.
