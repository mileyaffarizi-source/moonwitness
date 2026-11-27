# DX-001 — Local coding workflow and execution environment audit

**Audit date:** 2026-11-27  
**Repository:** mileyaffarizi-source/moonwitness  
**Audited main commit:** c00130d889f259c2b246c0e4cd6a6b8ce2016932  
**Task status:** in_review — remote workflow verified; user workstation inspection remains unavailable.

## 1. Executive finding

The repository-side engineering workflow is repeatable: Node.js/pnpm are pinned, GitHub Actions installs with a frozen lockfile, repository checks and Node tests run, and changes have been delivered through isolated Git branches and pull requests.

This connected GitHub session does **not** expose the user's workstation, shell, installed coding-agent executables, local Git worktrees, provider credentials, Docker daemon or local model endpoints. These are recorded as unknown rather than inferred from past discussions or from the assistant's own execution sandbox.

DX should reuse the verified GitHub/CI flow and keep agent providers behind an adapter interface. No local coding CLI or model provider should be invoked until its actual executable, version, capabilities and permission boundary are inspected on the target machine.

## 2. Verified repository-side workflow

| Capability | Evidence | Current result |
|---|---|---|
| Canonical task source | tasks.json | 234 task records; sole task ledger |
| Dependency validation | scripts/tasks/task-registry.mjs | Implemented; duplicate/missing dependencies, self-edges and cycles rejected |
| Readiness calculation | calculateReadiness() in task registry module | Read-only; reports dependency, approval and active-path blockers |
| CLI validation | node scripts/tasks/task-registry.mjs [tasks.json] | Exit 0 valid, 1 invalid registry, 2 read/parse/runtime error |
| Runtime pin | .nvmrc, root package.json | Node.js 22.14.0 |
| Package manager | root package.json, CI action | pnpm 10.8.1 |
| Reproducible install | .github/workflows/ci.yml | pnpm install --frozen-lockfile passed |
| Repository validation/tests | GitHub Actions | Passed on main commit c00130d889f259c2b246c0e4cd6a6b8ce2016932, run 46020198447 |
| Remote Git workflow | Connected GitHub repository interface | Branch creation, file/tree/commit writes, PR open/merge and Actions status reads were exercised |
| Local worktree execution | No user workstation connection | Not verified; no local process was launched |

The current GitHub workflow is safe for code/document changes under review. It is not an autonomous local coding-agent executor and does not provide a user-host terminal.

## 3. Local environment — not accessible from this audit

The following must remain unknown until inspected on the target workstation:

- OS version, architecture, active shell, terminal/editor and environment manager.
- Local Git version/configuration, configured remotes, existing worktrees, dirty state and branch protection behavior.
- Installed coding CLIs and versions (for example Codex, Claude Code, Gemini CLI, OpenCode, Aider or Goose).
- Model/API providers, endpoint reachability, model identifiers, rate limits and concurrency quotas.
- Python/uv, Node/corepack/pnpm, Docker/Compose, browser automation, MCP and queue/runtime installations.
- Available RAM/CPU/disk, network/egress restrictions, sandbox features and process-tree cancellation.
- Credential presence, credential scopes and secret-manager integration.

No environment variables, tokens, credential files, SSH private keys, browser profiles or secret values were read. Their presence and validity are unknown.

## 4. Reuse policy

1. Continue to use tasks.json as the only canonical task plan.
2. Use one branch/PR per coherent change until a tested local worktree coordinator exists.
3. Use the read-only validator to calculate task readiness; never let the validator mutate or claim tasks.
4. Keep Node 22.14.0 and pnpm 10.8.1 as repository contracts until a deliberate, CI-verified update.
5. Add provider adapters only after DX has an approved execution boundary and the local audit verifies actual installed executables.
6. Do not store credentials in task records, prompts, logs, CLI output or adapter manifests.
7. A provider being discussed or documented is not proof that it is installed, authenticated, available or safe to execute.

## 5. Recommended adapter inventory sequence

1. **Host discovery:** OS/shell/architecture and allowlisted executable/version detection; no credential or environment-variable dumping.
2. **Git capability:** inspect current repository, dirty state, branch/worktree support and safe worktree lifecycle.
3. **Coding CLI discovery:** detect executable, version, supported non-interactive mode, workspace restrictions, permission controls, output format, cancellation and exit codes.
4. **Model provider verification:** use a minimal authenticated, non-sensitive capability probe only after a secret reference and network policy are approved; never print key material.
5. **Execution policy:** define path allowlists, command allowlists, time/output/resource limits, network/secret isolation and kill switch before any agent is invoked.
6. **Adapter selection:** choose one provider for a controlled proof of concept; avoid multi-provider orchestration until one adapter produces verifiable evidence.

## 6. Current blockers and hand-offs

- **DX-001:** workstation facts and provider capabilities remain unverified; owner must run a safe host inventory or connect an approved local execution adapter.
- **DX-002:** remains blocked by DX-001 and GOV-010. The privileged daemon threat model must not be skipped.
- **DX-003:** task reader work remains blocked by DX-002, although the underlying read-only validator/readiness logic is implemented under GOV-008.
- **GOV-010:** remains blocked by trusted actor context, capability contracts and database ownership governance. This audit does not inspect production databases or approve privileged operations.

## 7. Safe workstation inventory commands

Run only on the intended developer workstation. These commands report executable locations and versions; they do not print environment variables or credential contents.

### PowerShell

~~~powershell
$tools = 'git','node','corepack','pnpm','python','uv','docker','gh','codex','claude','gemini','opencode','aider','goose','n8n'
foreach ($tool in $tools) {
  $cmd = Get-Command $tool -ErrorAction SilentlyContinue
  if ($cmd) { Write-Output ("{0}{1}FOUND{1}{2}" -f $tool,[char]9,$cmd.Source) }
  else { Write-Output ("{0}{1}NOT_FOUND" -f $tool,[char]9) }
}
git --version
node --version
corepack --version
pnpm --version
~~~

### Bash

~~~bash
for tool in git node corepack pnpm python uv docker gh codex claude gemini opencode aider goose n8n; do
  if command -v "$tool" >/dev/null 2>&1; then
    printf '%s\tFOUND\t%s\n' "$tool" "$(command -v "$tool")"
  else
    printf '%s\tNOT_FOUND\n' "$tool"
  fi
done
git --version
node --version
corepack --version
pnpm --version
~~~

Do not append env, printenv, set, credential dumps or full shell histories to an audit report.

## 8. Completion decision

The GitHub repository workflow and pinned CI runtime are verified. The local coding environment and provider capabilities are not. DX-001 therefore remains in_review with a precise limitation; marking it done would incorrectly imply that the target workstation and installed agents were inspected.
