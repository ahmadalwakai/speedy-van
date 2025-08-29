# GitHub Repository Setup Guide

This document outlines the complete GitHub repository configuration for Speedy Van, including security measures, CI/CD pipelines, and workflow automation.

## 🚀 Quick Setup Commands

### 1. Repository Settings
```bash
# Set default branch to main
gh repo edit --default-branch main

# Update repository description and topics
gh repo edit --description "Speedy Van - Professional van delivery and logistics platform" --add-topic "van-delivery,logistics,nextjs,typescript,prisma"
```

### 2. Branch Protection Rules
Navigate to: `Settings → Branches → Add rule` for `main` branch:

**Required Settings:**
- ✅ Require a pull request before merging
- ✅ Require approvals: 1-2 reviewers
- ✅ Require review from Code Owners
- ✅ Dismiss stale reviews on new commits
- ✅ Restrict who can push (no one - merge via PR only)

**Optional Settings:**
- ✅ Require signed commits
- ✅ Require linear history
- ✅ Require status checks to pass

### 3. Environments Setup
Create environments in `Settings → Environments`:

**Staging Environment:**
- Protection rules: Required reviewers (1)
- Wait timer: 0 minutes

**Production Environment:**
- Protection rules: Required reviewers (2)
- Wait timer: 5 minutes (optional)

## 🔐 Secrets Configuration

### Repository Secrets
Add these in `Settings → Secrets and variables → Actions`:

```bash
# GitHub Actions Token (Fine-grained PAT)
AGENT_GITHUB_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxx
```

**Permissions for AGENT_GITHUB_TOKEN:**
- Repository permissions: Contents (Read and write)
- Repository permissions: Pull requests (Read and write)
- Repository permissions: Issues (Read and write)

### Environment Secrets
Add these in each environment (`staging`/`production`):

```bash
# Database
DATABASE_URL=postgresql://...

# Authentication
NEXTAUTH_SECRET=...
NEXTAUTH_URL=...

# External Services
STRIPE_SECRET_KEY=...
PUSHER_APP_ID=...
THESMSWORKS_KEY=...
OPENAI_API_KEY=...

# Frontend Config
NEXT_PUBLIC_MAPBOX_TOKEN=...
NEXT_PUBLIC_API_URL=...
```

## 🏷️ Labels Setup

Run this command to create all labels:

```bash
# Install labeler action
gh extension install actions/labeler

# Apply labels from configuration
gh actions run labeler.yml
```

Or manually create key labels:
```bash
gh label create "needs-review" --color ff6a00 --description "Needs review from maintainers"
gh label create "agent" --color 00e0ff --description "Agent-authored changes"
gh label create "security" --color d93f0b --description "Security-related changes"
gh label create "ci" --color 1d76db --description "CI/CD pipeline changes"
```

## 🔄 Workflow Configuration

### Required Status Checks
After the first successful CI run, go to `Settings → Branches → main` and add these as required status checks:

1. **Main CI Pipeline** - `Main CI Pipeline`
2. **CodeQL** - `CodeQL`
3. **Deny Sensitive Files** - `Deny Sensitive Files`
4. **Conventional Commits Check** - `Conventional Commits Check`

### Workflow Permissions
In `Settings → Actions → General`:
- **Workflow permissions**: Read repository contents
- **Allow GitHub Actions to create and approve PRs**: Off

## 📋 Pull Request Process

### Template Usage
All PRs will automatically use the template with checkboxes for:
- [ ] Scope is minimal
- [ ] Breaking changes explained
- [ ] Environment variables updated
- [ ] Database schema changes documented
- [ ] Local testing completed
- [ ] Mobile responsiveness tested
- [ ] Security impact assessed

### Review Process
1. **Automated Checks**: All workflows must pass
2. **Code Owner Review**: Required for critical paths
3. **Human Review**: At least 1-2 reviewers
4. **Security Scan**: CodeQL analysis completed

## 🚨 Security Measures

### Secret Scanning
- **Secret scanning**: Enabled
- **Push protection**: Enabled (if available)
- **Dependabot alerts**: Enabled

### File Restrictions
The following files are automatically blocked:
- `.env*` (except `.env.example`)
- `*.local`
- `*.backup`
- `*.log`
- `*.db`
- `env.production`

### Code Quality Gates
- Conventional commit format required
- Branch naming conventions enforced
- Sensitive file detection
- Security audit on dependencies

## 🔧 Maintenance

### Weekly Tasks
- Review Dependabot PRs
- Check CodeQL security alerts
- Review workflow performance

### Monthly Tasks
- Update GitHub Actions
- Review and update labels
- Audit environment secrets

### Quarterly Tasks
- Review branch protection rules
- Update CODEOWNERS if needed
- Review security policy

## 📚 Additional Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [CodeQL Documentation](https://codeql.github.com/docs/)
- [Dependabot Documentation](https://docs.github.com/en/code-security/dependabot)
- [Branch Protection Rules](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/defining-the-mergeability-of-pull-requests/about-protected-branches)

## 🆘 Troubleshooting

### Common Issues

**Workflow Fails on Sensitive Files:**
```bash
# Remove sensitive files from git tracking
git rm --cached .env.local
git rm --cached env.production
git commit -m "chore: remove sensitive files"
```

**Branch Protection Blocks Push:**
- Create a feature branch from main
- Make changes and push to feature branch
- Create pull request to merge back to main

**CodeQL Analysis Fails:**
- Check for build errors
- Ensure all dependencies are properly installed
- Verify Node.js version compatibility

## 📞 Support

For GitHub configuration issues:
- Check GitHub Actions logs
- Review workflow permissions
- Verify secrets are properly configured
- Contact repository administrators

---

**Last Updated**: $(date)
**Maintainer**: @ahmad-alwakai
