# OpenCode GitHub Actions Runner

A multi-agent AI system that runs on GitHub Actions to continuously improve a target project.

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
| **Product Owner** | Research, plan, create issues | Volcengine Ark | Daily 9am UTC + Manual |
| **Coder** | Implement solutions, create PRs | Tencent GLM-5 | Issue created/labeled |
| **Tester** | Review code, test, approve PRs | Baidu Qianfan | PR opened/updated |

## Continuous Improvement Loop

```
1. Product Owner analyzes codebase daily
   ↓
2. Creates well-defined issues
   ↓
3. Coder picks up issues and implements
   ↓
4. Tester reviews PRs for quality
   ↓
5. Approved PRs merge
   ↓
6. Product Owner analyzes improvements
   ↓
   (loop continues)
```

## Architecture

### Directory Structure

```
opencode-runner/
├── .github/
│   ├── workflows/
│   │   ├── product-owner.yml    # PO orchestration
│   │   ├── coder.yml             # Coder orchestration
│   │   ├── tester.yml            # Tester orchestration
│   │   ├── coordinator.yml       # State & limits
│   │   └── opencode-manual.yml   # Manual testing
│   ├── agent-prompts/
│   │   ├── product-owner.md      # PO system prompt
│   │   ├── coder.md              # Coder system prompt
│   │   └── tester.md             # Tester system prompt
│   └── AGENT_CONFIG.yml          # Configuration
│
├── project/                       # ← TARGET PROJECT
│   ├── src/                       # Agents create code here
│   ├── tests/                     # Agents create tests here
│   └── README.md                  # Project documentation
│
├── opencode.json                  # Provider config
└── README.md                      # This file
```

### Path Constraints

**CRITICAL**: Agents are restricted to the `project/` directory.

| Agent | Allowed Paths | Forbidden Paths |
|-------|---------------|-----------------|
| Product Owner | Read `project/` | Modify any files |
| Coder | Modify `project/src/`, `project/tests/`, `project/docs/` | `.github/`, `opencode.json`, root files |
| Tester | Read `project/` | Modify any files |

## Workflows

### 1. Product Owner (`product-owner.yml`)

**Triggers:**
- Scheduled: Daily at 9am UTC
- Manual: `workflow_dispatch` with focus area input

**Responsibilities:**
- Analyze `project/` codebase
- Identify improvements (performance, security, features, tech debt)
- Create issues with clear acceptance criteria
- Prioritize using MoSCoW (P1-P3)

**Rate Limits:**
- Max 5 issues per day
- Max 2 issues per run

**Manual Trigger:**
```bash
gh workflow run product-owner.yml \
  -f focus_area="performance" \
  -f priority="P2-important"
```

### 2. Coder (`coder.yml`)

**Triggers:**
- Issue labeled with `approved`
- Manual: `workflow_dispatch` with issue number

**Responsibilities:**
- Implement issue solutions
- Follow code standards
- Write tests
- Create pull requests

**Safeguards:**
- Path validation (only `project/` allowed)
- Max 500 lines per PR
- Tests required for new functions

**Manual Trigger:**
```bash
gh workflow run coder.yml -f issue_number=42
```

### 3. Tester (`tester.yml`)

**Triggers:**
- Pull request opened/synchronized/reopened

**Responsibilities:**
- Review code quality
- Run tests
- Check security, performance
- Post review comments

**Auto-Approve:**
- Small PRs (<50 lines, <5 files)
- All checks pass
- Tester auto-approves

**Human Review Required:**
- Medium PRs (50-200 lines)
- Large PRs (>200 lines)
- P1-critical issues

### 4. Coordinator (`coordinator.yml`)

**Triggers:**
- Scheduled: Daily at midnight UTC
- Manual: `workflow_dispatch`

**Responsibilities:**
- Daily activity reports
- Rate limit enforcement
- Branch cleanup
- Stale issue management

## Safeguards

### Owner-Only Triggers
All workflows verify `github.actor == 'jackbauertv24-droid'`.

### Rate Limits
| Resource | Limit | Alert At |
|----------|-------|----------|
| Issues per day | 5 | 80% |
| PRs per day | 10 | 80% |

### Path Validation
```yaml
# Validates all changed files are in project/
for file in $CHANGED_FILES; do
  if [[ ! "$file" =~ ^project/ ]]; then
    echo "ERROR: Agent violated path constraint"
    git checkout .
    exit 1
  fi
done
```

### Human Checkpoints
- P1-critical issues → require human label
- PRs > 200 lines → require human review
- Breaking changes → require human approval

## Configuration

### Secrets (Already Configured)
| Secret | Purpose |
|--------|---------|
| `VOLCENGINE_ARK_API_KEY` | Product Owner agent |
| `TENCENT_CODING_PLAN_API_KEY` | Coder agent |
| `BAIDU_QIANFAN_API_KEY` | Tester agent |

### Agent Config (`.github/AGENT_CONFIG.yml`)
```yaml
agents:
  product-owner:
    model: volcengine-ark/ark-code-latest
    schedule: "0 9 * * *"
    max_issues_per_day: 5
    
  coder:
    model: tencent-coding-plan/glm-5
    max_prs_per_day: 10
    
  tester:
    model: baidu-qianfan/qianfan-code-latest
    auto_approve_threshold:
      lines: 50
      files: 5
```

## Usage

### Manual Testing
Use `opencode-manual.yml` for ad-hoc tests:
```bash
gh workflow run opencode-manual.yml \
  -f prompt="Add a hello world function" \
  -f model="volcengine-ark/ark-code-latest"
```

### View Agent Activity
```bash
# Daily report
gh run list --workflow coordinator.yml --limit 1

# Agent runs
gh run list --workflow product-owner.yml
gh run list --workflow coder.yml
gh run list --workflow tester.yml
```

### Check Limits
```bash
gh issue list --state all --search "created:>$(date -u +%Y-%m-%d)"
gh pr list --state all --search "created:>$(date -u +%Y-%m-%d)"
```

## Security

### What's Protected
- ✅ API keys in GitHub Secrets (encrypted)
- ✅ Agent paths restricted to `project/`
- ✅ Owner-only triggers
- ✅ Rate limits prevent runaway behavior
- ✅ Secrets masked in logs as `***`

### What's Public
- ⚠️ Workflow files in `.github/workflows/`
- ⚠️ Agent prompts in `.github/agent-prompts/`
- ⚠️ Configuration in `.github/AGENT_CONFIG.yml`
- ⚠️ Model names and endpoints

### Best Practices
1. **Review agent outputs** before merging
2. **Set appropriate rate limits** for your needs
3. **Monitor costs** via coordinator reports
4. **Rotate API keys** periodically

## Troubleshooting

### Agent created files outside `project/`
This should never happen due to path validation. If it does:
1. The workflow will fail
2. Changes will be reverted
3. Check the logs for validation errors

### Issue not picked up by Coder
- Ensure issue has `approved` label
- Check daily limit hasn't been reached
- Verify issue is well-defined

### PR not auto-approved
- Check PR size (must be <50 lines, <5 files)
- Review Tester agent comments
- Look for issues in the review

### Workflow skipped
- Verify you're the repo owner (`jackbauertv24-droid`)
- Check if daily limits reached
- Review workflow conditions

## Example Flow

**Day 1:**
```
09:00 - Product Owner analyzes project/
       Creates issue #1: "Add error handling"
       Creates issue #2: "Improve test coverage"

09:05 - Coder picks up issue #1
       Implements solution in project/src/
       Creates PR #1

09:10 - Tester reviews PR #1
       Small change (<50 lines)
       Auto-approves ✓

09:15 - PR #1 merged
       Coder picks up issue #2
       Creates PR #2

09:20 - Tester reviews PR #2
       Medium change (150 lines)
       Requests human review

14:00 - Human approves PR #2
       Merged ✓
```

## Documentation

- [OpenCode Documentation](https://opencode.ai/docs)
- [OpenCode Providers](https://opencode.ai/docs/providers)
- [GitHub Actions Workflows](https://docs.github.com/en/actions/using-workflows)

## License

MIT