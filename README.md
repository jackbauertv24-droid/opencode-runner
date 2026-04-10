# OpenCode GitHub Actions Runner

Run OpenCode in non-interactive mode with GitHub Actions. Supports custom API endpoints, keys, and models.

## Features

- **Multiple Trigger Types**: Issue/PR comments, scheduled tasks, PR events, manual dispatch, push events
- **Custom Endpoints**: OpenAI-compatible, Anthropic, or any custom API
- **Simple Configuration**: Config file in repo, only API keys in secrets

## Quick Start

### 1. Clone or Fork This Repository

```bash
gh repo clone jackbauertv24-droid/opencode-runner
```

### 2. Configure API Key Secret

Go to **Settings → Secrets and variables → Actions → New repository secret**:

| Secret | Description |
|--------|-------------|
| `VOLCES_ARK_API_KEY` | Your Volces Ark API key |

### 3. Customize opencode.json (Optional)

Edit `opencode.json` in the repo root to change provider/model:

```json
{
  "$schema": "https://opencode.ai/config.json",
  "provider": {
    "your-provider": {
      "npm": "@ai-sdk/openai-compatible",
      "name": "Your Provider Name",
      "options": {
        "baseURL": "https://your-api.example.com/v1"
      },
      "models": {
        "your-model": { "name": "Your Model" }
      }
    }
  },
  "model": "your-provider/your-model"
}
```

### 4. Trigger OpenCode

- **Issue/PR Comments**: Add `/opencode` or `/oc` in comments
- **Scheduled**: Runs automatically based on cron schedule
- **PR Events**: Automatically reviews new/updated PRs
- **Manual**: Trigger from Actions UI with custom inputs
- **Push**: Automatically analyzes pushed code

## API Key Naming Convention

The secret name must match your provider ID in `opencode.json`:

| Provider ID in config | Secret name |
|-----------------------|-------------|
| `volces-ark` | `VOLCES_ARK_API_KEY` |
| `my-custom-api` | `MY_CUSTOM_API_API_KEY` |
| `ollama-remote` | `OLLAMA_REMOTE_API_KEY` |

**Rule**: Convert provider ID to uppercase, replace hyphens with underscores, append `_API_KEY`.

## Workflows

| Workflow | Trigger | Purpose |
|----------|---------|---------|
| `opencode.yml` | `/opencode` or `/oc` in comments | Respond to issue/PR comments |
| `opencode-scheduled.yml` | Cron schedule | Automated periodic tasks |
| `opencode-pr.yml` | PR open/sync/reopen | Auto-review PRs |
| `opencode-manual.yml` | Manual dispatch | Trigger from Actions UI |
| `opencode-push.yml` | Push to main/master/develop | Analyze pushed code |

## Configuration Examples

### OpenAI-Compatible Endpoint

```json
{
  "provider": {
    "my-api": {
      "npm": "@ai-sdk/openai-compatible",
      "options": { "baseURL": "https://api.example.com/v1" },
      "models": { "gpt-4": { "name": "GPT-4" } }
    }
  },
  "model": "my-api/gpt-4"
}
```
Secret: `MY_API_API_KEY`

### Anthropic Endpoint

```json
{
  "provider": {
    "my-anthropic": {
      "options": { "baseURL": "https://your-proxy.example.com" }
    }
  },
  "model": "my-anthropic/claude-sonnet-4-20250514"
}
```
Secret: `MY_ANTHROPIC_API_KEY`

### Multiple Providers

```json
{
  "provider": {
    "openai": { "npm": "@ai-sdk/openai-compatible", "options": { "baseURL": "https://api.openai.com/v1" }, "models": { "gpt-4o": {} } },
    "anthropic": { "options": { "baseURL": "https://api.anthropic.com" }, "models": { "claude-sonnet-4-20250514": {} } }
  },
  "model": "openai/gpt-4o"
}
```
Secrets: `OPENAI_API_KEY`, `ANTHROPIC_API_KEY`

## Documentation

- [OpenCode Docs](https://opencode.ai/docs)
- [GitHub Integration](https://opencode.ai/docs/github)
- [Providers](https://opencode.ai/docs/providers)
- [Config](https://opencode.ai/config.json)

## License

MIT