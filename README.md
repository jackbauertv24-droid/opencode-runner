# OpenCode GitHub Actions Runner

A multi-agent AI system that runs on GitHub Actions to continuously improve a target project.

> **Status**: Development - Scheduled jobs temporarily disabled. Use manual triggers.

## System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│           OPENCODE-RUNNER (Orchestration Layer)                 │
│                                                                 │
│   Workflows & Prompts          Target Project (project/)        │
│   .github/workflows/    ──▶    Agents work HERE                 │
│   .github/agent-prompts/        • Create code                   │
│                                • Write tests                    │
│                                • Documentation                  │
│                                                                 │
│   ┌───────────────┐  ┌───────────────┐  ┌───────────────┐      │
│   │ PRODUCT OWNER │  │    CODER      │  │    TESTER     │      │
│   │  (Volcengine) │  │   (Tencent)   │  │    (Baidu)    │      │
│   └───────────────┘  └───────────────┘  └───────────────┘      │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## AI Agent Team

| Agent | Role | Model | Trigger |
|-------|------|-------|---------|
| **Product Owner** | Research, plan, create issues | Volcengine Ark | Manual only |
| **Coder** | Implement solutions, create PRs | Tencent GLM-5 | Manual only |
| **Tester** | Review code, test, approve PRs | Baidu Qianfan | Manual only |
| **Coordinator** | Daily reports, cleanup | - | Manual only |

## Workflow

```
1. [Manual] Run Product Owner → Creates issues with priority labels
   ↓
2. [Human] Review & add 'approved' label to issues
   ↓
3. [Manual] Run Coder → Implements issue, creates PR
   ↓
4. [Manual] Run Tester → Reviews PR, adds approved/changes-requested label
   ↓
5. [Human] Merge approved PRs
   ↓
   (repeat)
```

## Label System

See `.github/LABEL_SYSTEM.md` for full documentation.

### Priority Labels (Issues)
| Label | Description |
|-------|-------------|
| `P1-critical` | Security, breaking bugs |
| `P2-important` | Features, improvements |
| `P3-nice-to-have` | Minor enhancements |

### State Labels (Issues)
| Label | Description | Set By | Clear By |
|-------|-------------|--------|----------|
| `approved` | Ready for Coder | Human | PR merged |
| `in-progress` | Coder working | Coder start | PR created |
| `blocked` | Cannot proceed | Human | When unblocked |

### State Labels (PRs)
| Label | Description | Set By | Clear By |
|-------|-------------|--------|----------|
| `needs-review` | Tester review needed | Coder | Tester done |
| `approved` | Tester approved | Tester | PR merged |
| `changes-requested` | Needs fixes | Tester | Coder fixes |

## Directory Structure

```
opencode-runner/
├── .github/
│   ├── workflows/
│   │   ├── product-owner.yml    # PO workflow (manual)
│   │   ├── coder.yml            # Coder workflow (manual)
│   │   ├── tester.yml           # Tester workflow (manual)
│   │   ├── coordinator.yml      # State & limits (manual)
│   │   └── opencode-manual.yml  # Manual testing
│   ├── agent-prompts/
│   │   ├── product-owner.md     # PO system prompt
│   │   ├── coder.md             # Coder system prompt
│   │   └── tester.md            # Tester system prompt
│   ├── LABEL_SYSTEM.md          # Label documentation
│   └── AGENT_CONFIG.yml         # Configuration
│
├── project/                      # ← TARGET PROJECT
│   ├── src/                      # Agents create code here
│   ├── tests/                    # Agents create tests here
│   ├── docs/                     # Documentation
│   ├── package.json              # Node.js config (created by Coder)
│   └── README.md                 # Project docs
│
├── opencode.json                 # Provider config
└── README.md                     # This file
```

## Path Constraints

**CRITICAL**: Agents are restricted to the `project/` directory.

| Agent | Allowed | Forbidden |
|-------|---------|-----------|
| Product Owner | Read `project/` | Modify any files |
| Coder | Modify `project/*` | `.github/`, `opencode.json` |
| Tester | Read `project/` | Modify any files |

## Usage

### Run Product Owner
```bash
gh workflow run product-owner.yml -f focus_area="performance"
```

### Run Coder
```bash
gh workflow run coder.yml -f issue_number=3
```

### Run Tester
```bash
gh workflow run tester.yml -f pr_number=5
```

### Manual Testing
```bash
gh workflow run opencode-manual.yml \
  -f prompt="Add a hello world function" \
  -f model="volcengine-ark/ark-code-latest"
```

## Secrets

| Secret | Provider | Agent |
|--------|----------|-------|
| `VOLCENGINE_ARK_API_KEY` | Volcengine Ark | Product Owner, Tester |
| `TENCENT_CODING_PLAN_API_KEY` | Tencent | Coder |
| `BAIDU_QIANFAN_API_KEY` | Baidu Qianfan | Tester |

## Current Progress

### Completed
- [x] Set up GitHub Actions runner with OpenCode
- [x] Configure 3 AI providers (Volcengine, Tencent, Baidu)
- [x] Implement Product Owner agent
- [x] Implement Coder agent
- [x] Implement Tester agent
- [x] Create label system (P1-P3, approved, needs-review, etc.)
- [x] Issue #1: Create project directories (src, tests, docs) - MERGED

### In Progress
- [ ] Issue #3: Add project configuration files
- [ ] Issue #2: Initialize basic project structure

### Known Issues
- Baidu Qianfan is slow with long prompts - use concise prompts
- Tester workflow needs `workflow_dispatch` only (schedule disabled)

## Safeguards

- **Owner-only triggers**: `github.actor == 'jackbauertv24-droid'`
- **Path validation**: Only `project/` changes allowed
- **Rate limits**: Max 5 issues/day, 10 PRs/day
- **Label safety**: Labels only cleared after successful actions

## Security

- API keys stored in GitHub Secrets (encrypted)
- Secrets masked in logs as `***`
- Agent paths restricted to `project/`
- No keys in git history or workflow files

## Documentation

- [Label System](.github/LABEL_SYSTEM.md) - Label flow documentation
- [OpenCode Docs](https://opencode.ai/docs)
- [GitHub Actions Workflows](https://docs.github.com/en/actions/using-workflows)

## License

MIT