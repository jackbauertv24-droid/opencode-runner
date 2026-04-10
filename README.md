# OpenCode GitHub Actions Runner

Run OpenCode in non-interactive mode with GitHub Actions. Supports custom API endpoints, keys, and models.

## Features

- **Multiple Trigger Types**: Issue/PR comments, scheduled tasks, PR events, manual dispatch, push events
- **Custom Endpoints**: OpenAI-compatible, Anthropic, or any custom API
- **Flexible Configuration**: Inline config via secrets or file-based config
- **Multiple Providers**: Support for multiple endpoints simultaneously

## Quick Start

### 1. Clone or Fork This Repository

```bash
gh repo clone jackbauertv24-droid/opencode-runner
```

### 2. Configure Secrets

Go to **Settings → Secrets and variables → Actions** and add:

| Secret | Description | Example |
|--------|-------------|---------|
| `OPENCODE_CONFIG` | JSON config with custom endpoints | See [opencode.example.json](opencode.example.json) |
| `CUSTOM_API_KEY` | Your API key (name matches provider ID) | `sk-...` |

### 3. Optionally Configure Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `DEFAULT_MODEL` | Default model to use | `custom-provider/model-name` |
| `DEFAULT_AGENT` | Default agent | `build` |

### 4. Trigger OpenCode

Depending on the workflow:
- **Issue/PR Comments**: Add `/opencode` or `/oc` in comments
- **Scheduled**: Runs automatically based on cron schedule
- **PR Events**: Automatically reviews new/updated PRs
- **Manual**: Trigger from Actions UI with custom inputs
- **Push**: Automatically analyzes pushed code

## Workflows

### opencode.yml
**Triggers**: Issue comments, PR review comments  
**Usage**: Mention `/opencode` or `/oc` in any comment

### opencode-scheduled.yml
**Triggers**: Scheduled (cron), manual dispatch  
**Usage**: Automated tasks on schedule or manual trigger with prompt input

### opencode-pr.yml
**Triggers**: PR opened, synchronized, reopened  
**Usage**: Automatic PR review

### opencode-manual.yml
**Triggers**: Manual dispatch  
**Inputs**: 
- `prompt` - Task to execute
- `model` - Model override
- `endpoint_type` - Endpoint type selection
- `custom_baseurl` - Custom base URL override
- `agent` - Agent selection (build/plan)

### opencode-push.yml
**Triggers**: Push to main/master/develop  
**Usage**: Automatic code analysis on pushes

## Configuration Examples

### OpenAI-Compatible Endpoint

```json
{
  "provider": {
    "my-custom-api": {
      "npm": "@ai-sdk/openai-compatible",
      "options": {
        "baseURL": "https://your-api.example.com/v1"
      },
      "models": {
        "gpt-4": { "name": "GPT-4" }
      }
    }
  }
}
```

Secret: `MY_CUSTOM_API_API_KEY`

### Anthropic Endpoint

```json
{
  "provider": {
    "my-anthropic": {
      "options": {
        "baseURL": "https://your-proxy.example.com"
      }
    }
  },
  "model": "my-anthropic/claude-sonnet-4-20250514"
}
```

Secret: `MY_ANTHROPIC_API_KEY`

### Multiple Endpoints

```json
{
  "provider": {
    "ollama-remote": {
      "npm": "@ai-sdk/openai-compatible",
      "options": {
        "baseURL": "http://server:11434/v1"
      },
      "models": {
        "llama3": { "name": "Llama 3" }
      }
    },
    "vllm-server": {
      "npm": "@ai-sdk/openai-compatible",
      "options": {
        "baseURL": "http://vllm:8000/v1"
      },
      "models": {
        "mistral": { "name": "Mistral" }
      }
    }
  }
}
```

Secrets: `OLLAMA_REMOTE_API_KEY`, `VLLM_SERVER_API_KEY`

## API Key Naming Convention

The secret name must match your provider ID:
- Provider ID: `my-custom-api`
- Secret name: `MY_CUSTOM_API_API_KEY`

Convert provider ID to uppercase, replace hyphens with underscores, append `_API_KEY`.

## Documentation

- [OpenCode Docs](https://opencode.ai/docs)
- [GitHub Integration](https://opencode.ai/docs/github)
- [Providers](https://opencode.ai/docs/providers)
- [Config](https://opencode.ai/docs/config)

## License

MIT