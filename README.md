# OpenCode GitHub Actions Runner

Run [OpenCode](https://opencode.ai) in non-interactive mode with GitHub Actions using your own API endpoint and model.

## Project Overview

This repository provides a GitHub Actions workflow that runs OpenCode (an AI coding assistant) in non-interactive mode. It allows you to:

- Use **any OpenAI-compatible API endpoint** (Volces Ark, local LLMs, custom proxies, etc.)
- Run OpenCode **automatically** via GitHub Actions
- Keep your **API keys secure** in GitHub Secrets

## How It Works

```
┌─────────────────────────────────────────────────────────────┐
│                    GitHub Repository                         │
│                                                              │
│  ┌─────────────────┐    ┌─────────────────┐                │
│  │  opencode.json  │    │  workflow yml   │                │
│  │  (config file)  │    │  (instructions) │                │
│  └─────────────────┘    └─────────────────┘                │
│         │                       │                           │
│         │ defines                │ uses                     │
│         ▼                       ▼                           │
│  ┌─────────────────┐    ┌─────────────────┐                │
│  │ Provider Config │    │ OpenCode CLI    │                │
│  │ - baseURL       │    │ opencode run    │                │
│  │ - model name    │    │                 │                │
│  └─────────────────┘    └─────────────────┘                │
│                                 │                           │
└─────────────────────────────────│───────────────────────────┘
                                  │
                                  │ calls with API key
                                  ▼
                    ┌─────────────────────────┐
                    │    Your API Endpoint    │
                    │  (Volces Ark, etc.)     │
                    └─────────────────────────┘
```

## File Structure

```
opencode-runner/
├── .github/
│   └── workflows/
│       └── opencode-manual.yml   # GitHub Actions workflow
├── opencode.json                  # OpenCode configuration
└── README.md                      # This file
```

## Current Setup

| Component | Value |
|-----------|-------|
| **Provider** | Volces Ark Coding |
| **API Endpoint** | `https://ark.cn-beijing.volces.com/api/coding/v3` |
| **Model** | `ark-code-latest` |
| **API Key Secret** | `VOLCES_ARK_API_KEY` |

## Usage

### Step 1: Trigger the Workflow

1. Go to your repository on GitHub
2. Click the **Actions** tab
3. Select **opencode-manual** from the left sidebar
4. Click **Run workflow** button (top right)
5. Fill in the inputs:
   - **prompt**: Your task/question (required)
   - **model**: Model to use (default: `volces-ark/ark-code-latest`)
   - **agent**: Agent type (default: `build`)
6. Click **Run workflow**

### Step 2: View Results

1. Click on the running workflow
2. Click on the **opencode** job
3. Expand **Run OpenCode** step
4. See the model's response

### Example

```
Input:
  prompt: "Explain what this repository does"

Output:
  This repository provides a GitHub Actions workflow that runs 
  OpenCode in non-interactive mode with custom API endpoints...
```

## Configuration

### Changing the API Endpoint

Edit `opencode.json`:

```json
{
  "$schema": "https://opencode.ai/config.json",
  "provider": {
    "my-provider": {
      "npm": "@ai-sdk/openai-compatible",
      "name": "My Custom Provider",
      "options": {
        "baseURL": "https://your-api.example.com/v1",
        "apiKey": "{env:MY_PROVIDER_API_KEY}"
      },
      "models": {
        "your-model": { "name": "Your Model Name" }
      }
    }
  },
  "model": "my-provider/your-model"
}
```

### Setting the API Key Secret

1. Go to **Settings → Secrets and variables → Actions**
2. Click **New repository secret**
3. Name: `MY_PROVIDER_API_KEY` (must match `{env:XXX}` in config)
4. Value: Your API key
5. Click **Add secret**

### API Key Naming Rule

The secret name must match the `apiKey` field in `opencode.json`:

| In config `apiKey` | Secret name |
|--------------------|-------------|
| `{env:VOLCES_ARK_API_KEY}` | `VOLCES_ARK_API_KEY` |
| `{env:MY_PROVIDER_API_KEY}` | `MY_PROVIDER_API_KEY` |

## Example Configurations

### OpenAI

```json
{
  "provider": {
    "openai": {
      "npm": "@ai-sdk/openai-compatible",
      "options": {
        "baseURL": "https://api.openai.com/v1",
        "apiKey": "{env:OPENAI_API_KEY}"
      },
      "models": { "gpt-4o": { "name": "GPT-4o" } }
    }
  },
  "model": "openai/gpt-4o"
}
```

Secret: `OPENAI_API_KEY`

### Local Ollama Server

```json
{
  "provider": {
    "ollama": {
      "npm": "@ai-sdk/openai-compatible",
      "options": {
        "baseURL": "http://your-server:11434/v1"
      },
      "models": { "llama3": { "name": "Llama 3" } }
    }
  },
  "model": "ollama/llama3"
}
```

Note: Ollama may not require an API key for local servers.

### Anthropic

```json
{
  "provider": {
    "anthropic": {
      "options": {
        "baseURL": "https://api.anthropic.com",
        "apiKey": "{env:ANTHROPIC_API_KEY}"
      },
      "models": { "claude-sonnet-4-20250514": {} }
    }
  },
  "model": "anthropic/claude-sonnet-4-20250514"
}
```

Secret: `ANTHROPIC_API_KEY`

## Security

### What's Stored Where

| Data | Location | Visible? |
|------|----------|----------|
| API endpoint URL | `opencode.json` (repo) | ✅ Yes (public) |
| Model name | `opencode.json` (repo) | ✅ Yes (public) |
| API key | GitHub Secrets | ❌ No (encrypted) |
| API key in logs | GitHub Actions | ❌ No (masked as `***`) |

### Best Practices

1. **Never commit API keys** to git
2. **Always use GitHub Secrets** for sensitive data
3. **Rotate keys** if you suspect exposure
4. **Review workflow logs** before sharing

## Troubleshooting

### "Failed to parse JSON"

- Ensure `opencode.json` is valid JSON (use a validator)
- Check for missing quotes, commas, or brackets

### "API key invalid"

- Verify the secret name matches `{env:XXX}` in config
- Check if the API key is correct in GitHub Secrets
- Test your API endpoint directly with curl

### "Model not found"

- Verify the model name matches your provider's available models
- Check the `models` section in `opencode.json`

## Documentation

- [OpenCode Documentation](https://opencode.ai/docs)
- [OpenCode Providers](https://opencode.ai/docs/providers)
- [OpenCode Configuration](https://opencode.ai/docs/config)
- [GitHub Actions Secrets](https://docs.github.com/en/actions/security-guides/encrypted-secrets)

## License

MIT