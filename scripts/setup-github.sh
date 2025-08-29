#!/bin/bash

# GitHub Repository Setup Script for Speedy Van
# This script automates the initial GitHub configuration

set -e

echo "🚀 Setting up GitHub repository for Speedy Van..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if gh CLI is installed
if ! command -v gh &> /dev/null; then
    print_error "GitHub CLI (gh) is not installed. Please install it first:"
    echo "  https://cli.github.com/"
    exit 1
fi

# Check if user is authenticated
if ! gh auth status &> /dev/null; then
    print_error "Not authenticated with GitHub. Please run 'gh auth login' first."
    exit 1
fi

# Get repository information
REPO_OWNER=$(gh repo view --json owner --jq .owner.login)
REPO_NAME=$(gh repo view --json name --jq .name)
REPO_FULL_NAME="$REPO_OWNER/$REPO_NAME"

print_status "Configuring repository: $REPO_FULL_NAME"

# 1. Set default branch to main
print_status "Setting default branch to 'main'..."
if gh repo edit --default-branch main; then
    print_success "Default branch set to 'main'"
else
    print_warning "Could not set default branch (might already be set)"
fi

# 2. Update repository description and topics
print_status "Updating repository description and topics..."
if gh repo edit \
    --description "Speedy Van - Professional van delivery and logistics platform" \
    --add-topic "van-delivery,logistics,nextjs,typescript,prisma,postgresql,stripe"; then
    print_success "Repository description and topics updated"
else
    print_warning "Could not update repository description"
fi

# 3. Create labels
print_status "Creating repository labels..."
while IFS= read -r line; do
    if [[ $line =~ ^[[:space:]]*-[[:space:]]*name:[[:space:]]*\"([^\"]+)\" ]]; then
        label_name="${BASH_REMATCH[1]}"
        if [[ $line =~ color:[[:space:]]*\"([^\"]+)\" ]]; then
            color="${BASH_REMATCH[1]}"
            if [[ $line =~ description:[[:space:]]*\"([^\"]+)\" ]]; then
                description="${BASH_REMATCH[1]}"
                print_status "Creating label: $label_name"
                if gh label create "$label_name" --color "$color" --description "$description" &> /dev/null; then
                    print_success "Label '$label_name' created"
                else
                    print_warning "Label '$label_name' already exists or could not be created"
                fi
            fi
        fi
    fi
done < .github/labels.yml

# 4. Set up branch protection (requires manual intervention)
print_status "Branch protection setup requires manual configuration:"
echo ""
echo "Please navigate to: https://github.com/$REPO_FULL_NAME/settings/branches"
echo "Add a rule for the 'main' branch with these settings:"
echo "  ✅ Require a pull request before merging"
echo "  ✅ Require approvals: 1-2 reviewers"
echo "  ✅ Require review from Code Owners"
echo "  ✅ Dismiss stale reviews on new commits"
echo "  ✅ Restrict who can push (no one - merge via PR only)"
echo "  ✅ Require status checks to pass (after first CI run)"
echo ""

# 5. Create environments (requires manual intervention)
print_status "Environment setup requires manual configuration:"
echo ""
echo "Please navigate to: https://github.com/$REPO_FULL_NAME/settings/environments"
echo "Create these environments:"
echo ""
echo "  Staging Environment:"
echo "    - Protection rules: Required reviewers (1)"
echo "    - Wait timer: 0 minutes"
echo ""
echo "  Production Environment:"
echo "    - Protection rules: Required reviewers (2)"
echo "    - Wait timer: 5 minutes (optional)"
echo ""

# 6. Set up secrets (requires manual intervention)
print_status "Secrets setup requires manual configuration:"
echo ""
echo "Please add these secrets in Settings → Secrets and variables → Actions:"
echo ""
echo "Repository Secrets:"
echo "  AGENT_GITHUB_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxx"
echo ""
echo "Environment Secrets (in each environment):"
echo "  DATABASE_URL=postgresql://..."
echo "  NEXTAUTH_SECRET=..."
echo "  STRIPE_SECRET_KEY=..."
echo "  PUSHER_APP_ID=..."
echo "  THESMSWORKS_KEY=..."
echo "  OPENAI_API_KEY=..."
echo "  NEXT_PUBLIC_MAPBOX_TOKEN=..."
echo "  NEXT_PUBLIC_API_URL=..."
echo ""

# 7. Enable security features
print_status "Enabling security features..."
echo ""
echo "Please enable these features in Settings → Security & analysis:"
echo "  ✅ Secret scanning"
echo "  ✅ Push protection (if available)"
echo "  ✅ Dependabot alerts"
echo "  ✅ Code scanning (CodeQL)"
echo ""

# 8. Configure Actions permissions
print_status "Configuring Actions permissions..."
echo ""
echo "Please configure in Settings → Actions → General:"
echo "  ✅ Workflow permissions: Read repository contents"
echo "  ✅ Allow GitHub Actions to create and approve PRs: Off"
echo ""

# 9. Check current status
print_status "Checking current repository status..."
echo ""
echo "Current repository information:"
gh repo view --json name,description,defaultBranchRef,topics,isPrivate,hasIssues,hasWiki,hasProjects

echo ""
print_success "GitHub repository setup script completed!"
echo ""
print_status "Next steps:"
echo "1. Complete the manual configurations listed above"
echo "2. Push this configuration to trigger the first CI run"
echo "3. After successful CI, configure required status checks"
echo "4. Test the workflow with a sample pull request"
echo ""
print_status "For detailed instructions, see: GITHUB_SETUP_README.md"
