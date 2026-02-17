# CI/CD Setup Guide — GitHub Actions + Azure App Service

## What is CI/CD?

**CI/CD** stands for **Continuous Integration / Continuous Deployment**:
- **CI (Continuous Integration)**: Automatically build and test your code every time you push changes
- **CD (Continuous Deployment)**: Automatically deploy the built code to production (Azure)

**Without CI/CD**: You manually run `dotnet publish`, zip the files, and run `az webapp deployment` every time you want to update the live site.

**With CI/CD**: You just merge a Pull Request on GitHub → everything happens automatically in ~2-3 minutes.

---

## Architecture

```
┌─────────────┐     ┌──────────────┐     ┌─────────────────┐     ┌──────────────────┐
│  Developer   │────▶│  GitHub Repo │────▶│ GitHub Actions   │────▶│ Azure App Service │
│  (you)       │     │  (dev→main)  │     │ (build + deploy) │     │ (live site)       │
└─────────────┘     └──────────────┘     └─────────────────┘     └──────────────────┘
   git push            PR merge             automatic               auto-updated
   to dev              to main              ~2-3 min                zero downtime
```

---

## Branch Strategy

```
dev (your daily work) ──▶ Pull Request ──▶ main (production) ──▶ Auto-deploy to Azure
```

| Branch | Purpose | Who pushes here | Deploys? |
|--------|---------|----------------|----------|
| `dev` | Development (default branch) | You, freely | No |
| `main` | Production | Only via PR merge | Yes — triggers GitHub Actions |

**Why two branches?**
- Prevents accidental deployments — you can push broken code to `dev` without affecting production
- Pull Requests give you a chance to review changes before they go live
- You can see the full diff of what's about to be deployed

---

## What We Set Up (Step by Step)

### Step 1: Created `dev` Branch

```bash
git checkout -b dev        # Create new branch from main
git push -u origin dev     # Push to GitHub
```

**What this did**: Created a separate branch for daily development. Your `main` branch is now only for production-ready code.

**On GitHub**: Settings → General → Default branch → changed to `dev`. This means:
- `git clone` checks out `dev` by default
- New PRs target `dev` by default

### Step 2: Protected `main` Branch

**On GitHub**: Settings → Branches → Branch protection rule for `main`:
- ✅ "Require a pull request before merging"

**What this did**: Nobody (including you) can push directly to `main`. All changes must go through a Pull Request. This prevents accidental deployments.

### Step 3: Created GitHub Actions Workflow File

**File**: `.github/workflows/deploy.yml`

```yaml
name: Deploy to Azure App Service

on:
  push:
    branches: [main]    # ← Only runs when code is pushed to main (via PR merge)

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest    # ← GitHub provides a free Linux VM to run this

    steps:
      - name: Checkout code                    # ← Downloads your repo code
        uses: actions/checkout@v4

      - name: Setup Node.js                    # ← Installs Node.js (for React build)
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
          cache-dependency-path: northwind-client/package-lock.json

      - name: Setup .NET 8                     # ← Installs .NET SDK (for API build)
        uses: actions/setup-dotnet@v4
        with:
          dotnet-version: 8.0.x

      - name: Publish (builds API + React)     # ← Compiles everything
        run: dotnet publish NorthwindApi/NorthwindApi.csproj -c Release -o ./publish

      - name: Login to Azure                   # ← Authenticates with your Azure account
        uses: azure/login@v2
        with:
          creds: ${{ secrets.AZURE_CREDENTIALS }}    # ← Reads secret from GitHub

      - name: Deploy to Azure                  # ← Uploads to Azure App Service
        uses: azure/webapps-deploy@v3
        with:
          app-name: efcore-northwind-app-mahi
          package: ./publish
```

**How each step works**:

| Step | What it does | Equivalent local command |
|------|-------------|------------------------|
| Checkout | Downloads repo code | `git clone` |
| Setup Node.js | Installs Node 20 | You already have Node installed locally |
| Setup .NET 8 | Installs .NET SDK | You already have .NET installed locally |
| Publish | Builds API + React | `dotnet publish -c Release -o ./publish` |
| Login to Azure | Authenticates | `az login` |
| Deploy | Uploads to Azure | `az webapp deployment source config-zip ...` |

**Key concept**: GitHub provides a **free virtual machine** (Ubuntu Linux) that runs these steps for you. It starts fresh every time — no leftover files from previous runs.

### Step 4: Created Azure Service Principal

```bash
az ad sp create-for-rbac \
  --name "github-deploy" \
  --role contributor \
  --scopes /subscriptions/0861626d-20e8-42bb-aaae-9df4ed3c6e72/resourceGroups/rg-efcore-app \
  --sdk-auth
```

**What is a Service Principal?**
- It's like a "robot account" in Azure — an identity that GitHub Actions uses to deploy on your behalf
- It has limited permissions (only `contributor` role on the `rg-efcore-app` resource group)
- It cannot access anything outside your resource group

**What `--role contributor` means**:
- Can create/update/delete resources within the resource group
- Cannot manage billing, subscriptions, or other resource groups
- This is the **least privilege** needed for deployment

**The command output** was a JSON object like:
```json
{
  "clientId": "xxxx-xxxx-xxxx",
  "clientSecret": "xxxx",
  "subscriptionId": "0861626d-...",
  "tenantId": "xxxx-xxxx-xxxx",
  ...
}
```

### Step 5: Added GitHub Secret

**On GitHub**: Settings → Secrets and variables → Actions → New repository secret

| Field | Value |
|-------|-------|
| Name | `AZURE_CREDENTIALS` |
| Value | The JSON output from Step 4 |

**What is a GitHub Secret?**
- An **encrypted** key-value store in your GitHub repo
- The workflow reads it with `${{ secrets.AZURE_CREDENTIALS }}`
- **Security**: Even on public repos, secrets are:
  - Never visible to anyone (even you can't read the value back)
  - Never printed in logs (GitHub auto-masks with `***`)
  - Not available to forks
  - Only accessible by workflows running in your repo

---

## How a Deployment Works (End to End)

Here's exactly what happens when you deploy:

```
1. You push code to `dev` branch
   └── Nothing happens (no deployment)

2. You create a Pull Request: dev → main
   └── GitHub shows the diff of all changes

3. You click "Merge Pull Request"
   └── GitHub merges dev into main
   └── This triggers the workflow (because `on: push: branches: [main]`)

4. GitHub Actions starts a fresh Ubuntu VM
   └── Runs each step in deploy.yml sequentially
   └── Step 1: Downloads your code
   └── Step 2-3: Installs Node.js + .NET
   └── Step 4: Runs `dotnet publish` which:
       ├── Compiles C# API code
       ├── Runs `npm install` in northwind-client/
       ├── Runs `npm run build` (creates React production bundle)
       └── Copies React dist/ files to wwwroot/
   └── Step 5: Logs into Azure using service principal
   └── Step 6: Deploys the publish folder to App Service

5. Azure App Service restarts with new code
   └── Site is live at https://efcore-northwind-app-mahi.azurewebsites.net
```

**Total time**: ~2-3 minutes from PR merge to live site.

---

## Daily Workflow

### Making Changes and Deploying

```bash
# 1. Make sure you're on dev branch
git checkout dev

# 2. Make your code changes
#    (edit files, add features, fix bugs)

# 3. Stage and commit
git add .
git commit -m "describe your changes"

# 4. Push to GitHub
git push origin dev

# 5. Go to GitHub → your repo → "Compare & pull request"
#    (or: Pull requests → New pull request → base: main ← compare: dev)

# 6. Click "Create pull request"
#    - Review the diff to confirm changes look correct

# 7. Click "Merge pull request" → "Confirm merge"
#    - This triggers the deployment

# 8. Go to "Actions" tab to watch the build progress
#    - Green checkmark = success
#    - Red X = failed (click to see error logs)

# 9. After merge, sync your local dev branch:
git pull origin main
```

### If You Make Multiple Commits Before Deploying

```bash
git checkout dev

# Commit 1
git add . && git commit -m "add new feature"
git push origin dev

# Commit 2
git add . && git commit -m "fix bug in feature"
git push origin dev

# Commit 3
git add . && git commit -m "update styles"
git push origin dev

# When ready to deploy — create ONE PR with all 3 commits
# GitHub → Pull requests → New → dev → main
# All 3 commits deploy together as a batch
```

---

## Monitoring & Troubleshooting

### Checking Build Status

1. Go to GitHub repo → **Actions** tab
2. You'll see a list of all workflow runs:
   - 🟢 Green checkmark = successful deployment
   - 🔴 Red X = build or deploy failed
   - 🟡 Yellow dot = currently running

### If a Build Fails

1. Click on the failed run in the Actions tab
2. Click on the `build-and-deploy` job
3. Expand the failed step (it will have a red X)
4. Read the error message — common issues:
   - **npm install fails**: A package dependency issue in React
   - **dotnet publish fails**: C# compilation error
   - **Azure login fails**: `AZURE_CREDENTIALS` secret is wrong or expired
   - **Deploy fails**: Azure App Service issue

### Re-running a Failed Build

1. Go to the failed run in Actions tab
2. Click **"Re-run all jobs"** (top right)
3. Useful when the failure was transient (network timeout, Azure hiccup)

### Checking Azure App Service Logs

```bash
# Stream live logs
az webapp log tail --name efcore-northwind-app-mahi --resource-group rg-efcore-app

# Enable detailed logging
az webapp log config --name efcore-northwind-app-mahi --resource-group rg-efcore-app --application-logging filesystem --level Error
```

---

## Key Concepts Glossary

| Term | What it means |
|------|--------------|
| **GitHub Actions** | GitHub's built-in CI/CD service — runs automated tasks (build, test, deploy) |
| **Workflow** | A YAML file (`.github/workflows/deploy.yml`) that defines what to automate |
| **Job** | A group of steps that run on the same virtual machine |
| **Step** | A single task within a job (e.g., "install Node.js", "run dotnet publish") |
| **Runner** | The virtual machine that executes your workflow (GitHub provides free Ubuntu VMs) |
| **Trigger** | The event that starts the workflow (`on: push: branches: [main]`) |
| **Secret** | Encrypted credential stored in GitHub (e.g., Azure service principal JSON) |
| **Service Principal** | A "robot account" in Azure with limited permissions for automated deployment |
| **Pull Request (PR)** | A request to merge code from one branch into another — allows review before merging |
| **Branch Protection** | GitHub rule that prevents direct pushes to a branch (requires PR) |

---

## Files Created/Modified

| File | What it does |
|------|-------------|
| `.github/workflows/deploy.yml` | GitHub Actions workflow — auto-builds and deploys on PR merge to main |
| `NorthwindApi/Program.cs` | Updated SPA serving to work in both dev (Vite dist/) and production (wwwroot/) |
| `.gitignore` | Added `publish/`, `deploy.zip`, `.claude/`, `nul` to ignore list |

---

## Security Summary

| What | How it's secured |
|------|-----------------|
| Azure credentials | Stored as GitHub Secret (encrypted, never visible, auto-masked in logs) |
| Service principal scope | Limited to `rg-efcore-app` resource group only (can't access other resources) |
| Branch protection | `main` requires PR — no accidental deployments from direct pushes |
| Public repo | Secrets are NOT accessible to forks or public viewers |
| Connection string | Stored in Azure App Service config (not in code or GitHub) |
