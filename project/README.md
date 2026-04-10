# Project

This directory contains the target project that AI agents maintain and improve.

## AI Agent Team

This project is continuously improved by an AI agent team:

| Agent | Role | Model |
|-------|------|-------|
| **Product Owner** | Research, plan, create issues | Volcengine Ark |
| **Coder** | Implement solutions, create PRs | Tencent GLM-5 |
| **Tester** | Review code, test, provide feedback | Baidu Qianfan |

## How It Works

1. **Product Owner** analyzes the codebase daily and creates issues
2. **Coder** picks up issues and implements solutions
3. **Tester** reviews PRs and ensures quality
4. Loop continues for continuous improvement

## Project Structure

```
project/
├── src/           # Source code
├── tests/         # Test files
├── docs/          # Documentation
├── package.json   # Project configuration & dependencies
├── jest.config.js # Test runner configuration
└── .gitignore     # Git ignore patterns
```

## Setup

```bash
# Install dependencies
npm install

# Run the application
npm start

# Run tests
npm test

# Run tests with coverage
npm run test:coverage
```

## Constraints

AI agents are **restricted** to this directory:
- ✅ Can modify: `project/src/`, `project/tests/`, `project/docs/`
- ❌ Cannot modify: `.github/`, `opencode.json`, root files

---

*This project is maintained by AI agents as part of the opencode-runner system.*