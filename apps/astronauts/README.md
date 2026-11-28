# Astronauts — Go Machine Control Plane

**Status:** Architecture/planning anchor only. No executable Controller or Edge Agent is present yet.

Read the root [BLUEPRINT-ASTRONAUTS.MD](../../BLUEPRINT-ASTRONAUTS.MD), [sixteen-app topology](../../BLUEPRINT-APPLICATIONS.MD), and tasks AST-001 through AST-014 in [tasks.json](../../tasks.json).

Target: one Go module producing two independently deployed binaries: a Controller service and an outbound-only Edge Agent. The Controller dispatches only signed, exact-scope typed jobs after API authorization. The Edge Agent runs only reviewed local capabilities; arbitrary shell, unrestricted filesystem access and Docker socket exposure are forbidden.

**No deployment, host enrollment or production machine execution is authorized by this README.**
