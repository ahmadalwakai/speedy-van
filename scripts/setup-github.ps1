# GitHub Repository Setup Script for Speedy Van (PowerShell)
# This script automates the initial GitHub configuration

param(
    [switch]$SkipChecks
)

# Set error action preference
$ErrorActionPreference = "Stop"

Write-Host "🚀 Setting up GitHub repository for Speedy Van..." -ForegroundColor Blue

# Function to print colored output
function Write-Status {
    param([string]$Message)
    Write-Host "[INFO] $Message" -ForegroundColor Blue
}

function Write-Success {
    param([string]$Message)
    Write-Host "[SUCCESS] $Message" -ForegroundColor Green
}

function Write-Warning {
    param([string]$Message)
    Write-Host "[WARNING] $Message" -ForegroundColor Yellow
}

function Write-Error {
    param([string]$Message)
    Write-Host "[ERROR] $Message" -ForegroundColor Red
}

# Check if gh CLI is installed
if (-not (Get-Command gh -ErrorAction SilentlyContinue)) {
    Write-Error "GitHub CLI (gh) is not installed. Please install it first:"
    Write-Host "  https://cli.github.com/" -ForegroundColor Cyan
    exit 1
}

# Check if user is authenticated
try {
    gh auth status | Out-Null
} catch {
    Write-Error "Not authenticated with GitHub. Please run 'gh auth login' first."
    exit 1
}

# Get repository information
try {
    $repoOwner = gh repo view --json owner --jq .owner.login
    $repoName = gh repo view --json name --jq .name
    $repoFullName = "$repoOwner/$repoName"
} catch {
    Write-Error "Could not get repository information. Are you in a git repository?"
    exit 1
}

Write-Status "Configuring repository: $repoFullName"

# 1. Set default branch to main
Write-Status "Setting default branch to 'main'..."
try {
    gh repo edit --default-branch main | Out-Null
    Write-Success "Default branch set to 'main'"
} catch {
    Write-Warning "Could not set default branch (might already be set)"
}

# 2. Update repository description and topics
Write-Status "Updating repository description and topics..."
try {
    gh repo edit --description "Speedy Van - Professional van delivery and logistics platform" --add-topic "van-delivery,logistics,nextjs,typescript,prisma,postgresql,stripe" | Out-Null
    Write-Success "Repository description and topics updated"
} catch {
    Write-Warning "Could not update repository description"
}

# 3. Create labels
Write-Status "Creating repository labels..."
$labelsFile = ".github/labels.yml"
if (Test-Path $labelsFile) {
    $labels = Get-Content $labelsFile -Raw | ConvertFrom-Yaml
    foreach ($label in $labels.labels) {
        Write-Status "Creating label: $($label.name)"
        try {
            gh label create $label.name --color $label.color --description $label.description | Out-Null
            Write-Success "Label '$($label.name)' created"
        } catch {
            Write-Warning "Label '$($label.name)' already exists or could not be created"
        }
    }
} else {
    Write-Warning "Labels file not found: $labelsFile"
}

# 4. Set up branch protection (requires manual intervention)
Write-Status "Branch protection setup requires manual configuration:"
Write-Host ""
Write-Host "Please navigate to: https://github.com/$repoFullName/settings/branches" -ForegroundColor Cyan
Write-Host "Add a rule for the 'main' branch with these settings:" -ForegroundColor White
Write-Host "  ✅ Require a pull request before merging" -ForegroundColor Green
Write-Host "  ✅ Require approvals: 1-2 reviewers" -ForegroundColor Green
Write-Host "  ✅ Require review from Code Owners" -ForegroundColor Green
Write-Host "  ✅ Dismiss stale reviews on new commits" -ForegroundColor Green
Write-Host "  ✅ Restrict who can push (no one - merge via PR only)" -ForegroundColor Green
Write-Host "  ✅ Require status checks to pass (after first CI run)" -ForegroundColor Green
Write-Host ""

# 5. Create environments (requires manual intervention)
Write-Status "Environment setup requires manual configuration:"
Write-Host ""
Write-Host "Please navigate to: https://github.com/$repoFullName/settings/environments" -ForegroundColor Cyan
Write-Host "Create these environments:" -ForegroundColor White
Write-Host ""
Write-Host "  Staging Environment:" -ForegroundColor Yellow
Write-Host "    - Protection rules: Required reviewers (1)" -ForegroundColor White
Write-Host "    - Wait timer: 0 minutes" -ForegroundColor White
Write-Host ""
Write-Host "  Production Environment:" -ForegroundColor Yellow
Write-Host "    - Protection rules: Required reviewers (2)" -ForegroundColor White
Write-Host "    - Wait timer: 5 minutes (optional)" -ForegroundColor White
Write-Host ""

# 6. Set up secrets (requires manual intervention)
Write-Status "Secrets setup requires manual configuration:"
Write-Host ""
Write-Host "Please add these secrets in Settings → Secrets and variables → Actions:" -ForegroundColor Cyan
Write-Host ""
Write-Host "Repository Secrets:" -ForegroundColor Yellow
Write-Host "  AGENT_GITHUB_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxx" -ForegroundColor White
Write-Host ""
Write-Host "Environment Secrets (in each environment):" -ForegroundColor Yellow
Write-Host "  DATABASE_URL=postgresql://..." -ForegroundColor White
Write-Host "  NEXTAUTH_SECRET=..." -ForegroundColor White
Write-Host "  STRIPE_SECRET_KEY=..." -ForegroundColor White
Write-Host "  PUSHER_APP_ID=..." -ForegroundColor White
Write-Host "  THESMSWORKS_KEY=..." -ForegroundColor White
Write-Host "  OPENAI_API_KEY=..." -ForegroundColor White
Write-Host "  NEXT_PUBLIC_MAPBOX_TOKEN=..." -ForegroundColor White
Write-Host "  NEXT_PUBLIC_API_URL=..." -ForegroundColor White
Write-Host ""

# 7. Enable security features
Write-Status "Enabling security features..."
Write-Host ""
Write-Host "Please enable these features in Settings → Security & analysis:" -ForegroundColor Cyan
Write-Host "  ✅ Secret scanning" -ForegroundColor Green
Write-Host "  ✅ Push protection (if available)" -ForegroundColor Green
Write-Host "  ✅ Dependabot alerts" -ForegroundColor Green
Write-Host "  ✅ Code scanning (CodeQL)" -ForegroundColor Green
Write-Host ""

# 8. Configure Actions permissions
Write-Status "Configuring Actions permissions..."
Write-Host ""
Write-Host "Please configure in Settings → Actions → General:" -ForegroundColor Cyan
Write-Host "  ✅ Workflow permissions: Read repository contents" -ForegroundColor Green
Write-Host "  ✅ Allow GitHub Actions to create and approve PRs: Off" -ForegroundColor Green
Write-Host ""

# 9. Check current status
Write-Status "Checking current repository status..."
Write-Host ""
Write-Host "Current repository information:" -ForegroundColor White
try {
    gh repo view --json name,description,defaultBranchRef,topics,isPrivate,hasIssues,hasWiki,hasProjects
} catch {
    Write-Warning "Could not get repository information"
}

Write-Host ""
Write-Success "GitHub repository setup script completed!"
Write-Host ""
Write-Status "Next steps:"
Write-Host "1. Complete the manual configurations listed above" -ForegroundColor White
Write-Host "2. Push this configuration to trigger the first CI run" -ForegroundColor White
Write-Host "3. After successful CI, configure required status checks" -ForegroundColor White
Write-Host "4. Test the workflow with a sample pull request" -ForegroundColor White
Write-Host ""
Write-Status "For detailed instructions, see: GITHUB_SETUP_README.md"

# Note: PowerShell doesn't have built-in YAML parsing, so labels creation might need manual intervention
Write-Host ""
Write-Warning "Note: PowerShell doesn't have built-in YAML parsing."
Write-Host "Please create labels manually using the GitHub web interface or run the bash script in WSL/Git Bash."
