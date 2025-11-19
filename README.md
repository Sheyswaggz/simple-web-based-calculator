# Simple Web-Based Calculator

A responsive, accessible web-based calculator for basic arithmetic operations with full keyboard support.

## Features

- Basic arithmetic operations (addition, subtraction, multiplication, division)
- Decimal number support
- Clear function
- Responsive design
- Full keyboard input support
- Enhanced accessibility with ARIA attributes and screen reader support
- Visual feedback for keyboard interactions

## Browser Compatibility

The calculator is fully compatible with all modern web browsers and has been extensively tested to ensure consistent functionality and appearance across platforms.

### Supported Browsers

| Browser | Minimum Version | Status |
|---------|----------------|--------|
| Google Chrome | 57+ | ✅ Fully Supported |
| Mozilla Firefox | 52+ | ✅ Fully Supported |
| Apple Safari | 10.1+ | ✅ Fully Supported |
| Microsoft Edge | 16+ | ✅ Fully Supported |

### Testing Methodology

The calculator has undergone comprehensive cross-browser compatibility testing including:

- **Manual Testing**: Interactive testing of all calculator features across browsers
- **Automated Testing**: Jest test suite execution in each browser environment
- **Visual Testing**: Screenshot comparison to ensure consistent rendering
- **Performance Testing**: Response time measurements using browser DevTools
- **Accessibility Testing**: Screen reader and keyboard navigation verification

All tests were conducted on multiple operating systems (Windows, macOS, Linux, iOS) and device types (desktop, tablet, mobile) to ensure broad compatibility.

### Test Results

For detailed test results, including:
- Complete compatibility matrix
- Performance benchmarks
- Screenshots from each browser
- Accessibility testing results
- Known issues and limitations

Please refer to [BROWSER_COMPATIBILITY.md](BROWSER_COMPATIBILITY.md)

### Key Compatibility Highlights

- ✅ **100% pass rate** across all tested browsers
- ✅ **No vendor prefixes required** - all CSS features fully supported
- ✅ **Response times < 100ms** in all browsers
- ✅ **Zero console errors** in any browser
- ✅ **Full accessibility support** across all platforms

## Keyboard Shortcuts

The calculator supports full keyboard operation for efficient use:

| Key | Function |
|-----|----------|
| `0-9` | Input digits |
| `+` | Addition operation |
| `-` | Subtraction operation |
| `*` | Multiplication operation |
| `/` | Division operation |
| `Enter` or `=` | Calculate result |
| `Escape` | Clear calculator |
| `.` (Period) | Input decimal point |
| `Tab` | Navigate between buttons |

### Accessibility Features

- **Screen Reader Support**: All interactive elements have descriptive ARIA labels
- **Keyboard Navigation**: Full keyboard access to all calculator functions
- **Live Regions**: Calculation results are announced to screen readers
- **Focus Indicators**: Clear visual indicators show which element has keyboard focus
- **Skip Links**: Quick navigation to main content

## Getting Started

### Prerequisites

- Node.js >= 18.0.0
- npm

### Installation

## CI/CD Pipeline

The calculator application uses GitHub Actions for continuous integration and continuous deployment, ensuring code quality and automated deployments.

### Overview

The CI/CD pipeline consists of three automated workflows:

1. **CI Workflow** - Runs tests, linting, and security scans on every push and pull request
2. **Deployment Workflow** - Builds and deploys to production on main branch merges
3. **Preview Workflow** - Deploys PR previews to GitHub Pages for testing

### CI Workflow

[![CI Pipeline](https://github.com/YOUR_USERNAME/YOUR_REPO/actions/workflows/ci.yml/badge.svg)](https://github.com/YOUR_USERNAME/YOUR_REPO/actions/workflows/ci.yml)
[![codecov](https://codecov.io/gh/YOUR_USERNAME/YOUR_REPO/branch/main/graph/badge.svg)](https://codecov.io/gh/YOUR_USERNAME/YOUR_REPO)

**Triggers:**
- Push to `main` or `develop` branches
- Pull requests to `main` branch

**Steps:**
1. Checkout code
2. Setup Node.js environment with dependency caching
3. Install dependencies (`npm ci`)
4. Run ESLint for code quality checks
5. Execute Jest test suite with coverage reporting
6. Upload coverage reports to Codecov
7. Build Docker image with Buildx
8. Run Trivy security scan for vulnerabilities
9. Upload security scan results to GitHub Security tab

**Caching:** Dependencies are cached using GitHub Actions cache to speed up builds.

### Deployment Workflow

[![Deploy to Production](https://github.com/YOUR_USERNAME/YOUR_REPO/actions/workflows/deploy.yml/badge.svg)](https://github.com/YOUR_USERNAME/YOUR_REPO/actions/workflows/deploy.yml)

**Triggers:**
- Push to `main` branch (automatic)
- Manual workflow dispatch with optional health check skip

**Environments:**
- **Production**: `https://calculator.example.com`

**Steps:**
1. Build multi-platform Docker image (linux/amd64, linux/arm64)
2. Push image to GitHub Container Registry (ghcr.io)
3. Tag image with commit SHA, branch name, timestamp, and `latest`
4. Configure kubectl with cluster credentials
5. Update Kubernetes deployment with new image
6. Wait for rollout to complete (timeout: 10 minutes)
7. Verify health check endpoint (30 attempts with 10s intervals)
8. Send Slack notification with deployment status

**Rollback:**
- Automatic rollback triggered on deployment failure
- Reverts to previous deployment revision
- Rollback status verified before completion

**Health Check:**
- Endpoint: `https://calculator.example.com/health`
- Expected response: HTTP 200
- Can be skipped via manual workflow dispatch input

### PR Preview Workflow

**Triggers:**
- Pull request opened, synchronized, or reopened
- Manual workflow dispatch

**Steps:**
1. Run linting and tests
2. Build static site with calculator files
3. Create preview metadata (PR number, commit SHA, build time)
4. Deploy to GitHub Pages at `https://YOUR_USERNAME.github.io/YOUR_REPO/pr-{PR_NUMBER}`
5. Post comment on PR with preview URL and deployment details
6. Update deployment status check

**Preview Features:**
- Isolated preview environment per PR
- Automatic updates on new commits
- 7-day retention period
- Direct links to preview, workflow run, and commit

### Required GitHub Secrets

Configure the following secrets in your repository settings:

| Secret | Description | Required For |
|--------|-------------|--------------|
| `KUBE_CONFIG` | Base64-encoded Kubernetes config file | Deployment workflow |
| `SLACK_WEBHOOK` | Slack webhook URL for notifications | Deployment workflow |
| `GITHUB_TOKEN` | Automatically provided by GitHub Actions | All workflows |

**Setting up KUBE_CONFIG:**