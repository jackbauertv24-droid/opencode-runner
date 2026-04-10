# Label System & Flow Documentation

This document defines how labels control the opencode-runner workflow.

## Label Categories

### Priority Labels (Issues)
| Label | Color | Description | When to Use |
|-------|-------|-------------|-------------|
| P1-critical | #B60205 (red) | Security, breaking bugs, data loss | Immediate attention needed |
| P2-important | #D93F0B (orange) | Features, improvements, user pain | High value, planned work |
| P3-nice-to-have | #1D76DB (blue) | Minor enhancements, refactors | Low priority, backlog |

### State Labels (Issues)
| Label | Color | Description | Set By | Clear By |
|-------|-------|-------------|--------|----------|
| approved | #0E8A16 (green) | Ready for Coder | Human review | PR merged (auto) |
| in-progress | #FBCA04 (yellow) | Coder working | Coder (start) | Coder (PR created) |
| blocked | #5319E7 (purple) | Cannot proceed | Human or Coder | When unblocked |

### State Labels (PRs)
| Label | Color | Description | Set By | Clear By |
|-------|-------|-------------|--------|----------|
| needs-review | #FBCA04 (yellow) | Tester review needed | Coder (PR created) | Tester (after comment) |
| approved | #0E8A16 (green) | Tester approved | Tester (review pass) | PR merged (auto) |
| changes-requested | #E99695 (pink) | Needs fixes | Tester (review fail) | Coder (fixes pushed) |

### Type Labels (Issues)
| Label | Color | Description |
|-------|-------|-------------|
| bug | #d73a4a | Something broken |
| enhancement | #a2eeef | New feature request |
| documentation | #0075ca | Docs improvement |
| tech-debt | TBD | Code quality/refactoring |

## Workflow Flow

### Issue Lifecycle

```
[Product Owner creates issue]
  ↓ labels: enhancement + P2-important
[Human reviews]
  ↓ add label: approved
[Coder picks up]
  ↓ add label: in-progress
  ↓ comment: "Starting work on this issue"
[Coder creates PR]
  ↓ remove label: in-progress (from issue)
  ↓ PR gets label: needs-review
  ↓ comment on issue: "PR created: #X"
[Tester reviews PR]
  ↓ remove label: needs-review (from PR)
  ↓ add label: approved or changes-requested (to PR)
  ↓ comment on PR: review summary
[PR merged]
  ↓ Issue auto-closes (via Closes #XXX in PR body)
```

### PR Lifecycle

```
[Coder creates PR]
  ↓ label: needs-review
  ↓ body: "Closes #XXX"
[Tester reviews]
  ↓ comment: review result
  ↓ if pass: remove needs-review, add approved
  ↓ if fail: remove needs-review, add changes-requested
[If approved]
  ↓ Human merges (or future: auto-merge)
  ↓ Issue auto-closes
[If changes-requested]
  ↓ Coder fixes and creates new PR
  ↓ OR updates existing PR
```

## Label Safety Rules

### NEVER clear a label before the dependent action succeeds:
1. **needs-review** → Only clear AFTER Tester posts comment
2. **in-progress** → Only clear AFTER PR is created successfully
3. **approved (issue)** → Never clear manually, auto-cleared on merge

### ALWAYS set labels AFTER action starts:
1. **in-progress** → Set when Coder picks up issue
2. **needs-review** → Set when PR is created
3. **approved (PR)** → Set when Tester approves

## Issue-PR Linking

### Coder MUST:
1. PR body includes `Closes #XXX` (GitHub auto-links)
2. Comment on issue: "Working on this issue"
3. Comment on issue: "PR #XXX ready for review"

### Tester MUST:
1. Comment on PR with review summary
2. No need to comment on issue (PR link is sufficient)

## Tracking Comments

| Actor | Action | Comment Location | Content |
|-------|--------|------------------|---------|
| Product Owner | Create issue | Issue body | Full issue description |
| Coder | Start work | Issue comment | "Starting implementation for issue #XXX" |
| Coder | Create PR | Issue comment | "PR #XXX created: [link]" |
| Coder | Create PR | PR body | "Closes #XXX" + implementation details |
| Tester | Review | PR comment | Review summary + verdict |
| Coordinator | Daily | None (step summary) | Daily stats |
| Coordinator | Stale | Issue comment | "Marked stale due to inactivity" |

## Example Flow

```
Issue #5: "Add user authentication"
  Labels: enhancement, P2-important

→ Human approves
  Labels: enhancement, P2-important, approved

→ Coder picks up (issue #5)
  Comment: "Starting work on issue #5"
  Labels: enhancement, P2-important, approved, in-progress

→ Coder creates PR #10
  PR body: "Closes #5\n\nImplemented auth module..."
  PR labels: needs-review
  Issue comment: "PR #10 ready for review"
  Issue labels: enhancement, P2-important, approved (in-progress removed)

→ Tester reviews PR #10
  PR comment: "## Summary\nGood implementation.\n## Verdict\nAPPROVE"
  PR labels: approved (needs-review removed)

→ Human merges PR #10
  Issue #5 auto-closes
```

## Failure Recovery

If workflow fails mid-way:
- **in-progress** label remains → Issue won't be picked again
- **needs-review** label remains → PR will be reviewed again
- Manual intervention: Clear stuck labels if needed

## Current Labels in Repo

Run `gh label list --repo jackbauertv24-droid/opencode-runner` to see current labels.