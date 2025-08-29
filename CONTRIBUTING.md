# Contributing to Speedy Van

Thank you for your interest in contributing to Speedy Van! This document provides guidelines and information for contributors.

## Table of Contents

- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Code Standards](#code-standards)
- [Testing Guidelines](#testing-guidelines)
- [Pull Request Process](#pull-request-process)
- [Code Review Guidelines](#code-review-guidelines)
- [Reporting Issues](#reporting-issues)
- [Security](#security)

## Getting Started

### Prerequisites

- Node.js 20.12.2 (see `.nvmrc`)
- pnpm package manager (enabled via Corepack)
- Git
- PostgreSQL database

### First Time Setup

1. **Fork and clone the repository**
   ```bash
   git clone https://github.com/your-username/speedy-van.git
   cd speedy-van
   ```

2. **Enable Corepack and install dependencies**
   ```bash
   corepack enable
   pnpm install --filter ./apps/web...
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env.local
   # Edit .env.local with your configuration
   ```

4. **Set up the database**
   ```bash
   cd apps/web
   pnpm prisma:generate
   pnpm prisma:migrate
   ```

5. **Start the development server**
   ```bash
   pnpm dev
   ```

## Development Setup

### Project Structure

```
speedy-van/
├── apps/
│   └── web/                    # Main Next.js application
│       ├── src/
│       │   ├── app/           # App Router pages and API routes
│       │   ├── components/    # Reusable React components
│       │   ├── lib/           # Utility functions and services
│       │   ├── types/         # TypeScript type definitions
│       │   └── data/          # Static data and constants
│       ├── prisma/            # Database schema and migrations
│       └── tests/             # Test files
├── scripts/                    # Build and utility scripts
└── docs/                      # Documentation
```

### Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm test` - Run Playwright E2E tests
- `pnpm test:unit` - Run Jest unit tests
- `pnpm lint` - Run ESLint
- `pnpm prisma:generate` - Generate Prisma client
- `pnpm prisma:migrate` - Run database migrations

## Code Standards

### TypeScript

- Use strict TypeScript configuration
- Avoid `any` types - use `unknown` with proper type guards
- Define interfaces for all data structures
- Use proper return types for functions

### React Components

- Use functional components with hooks
- Follow the naming convention: PascalCase for components
- Keep components focused and single-purpose
- Use proper prop types and default values

### Code Style

- Follow ESLint configuration
- Use Prettier for code formatting
- Write meaningful commit messages
- Add JSDoc comments for complex functions

### File Organization

- Group related components in subdirectories
- Use index files for clean imports
- Keep component files under 300 lines
- Separate business logic from UI components

## Testing Guidelines

### Unit Tests

- Write tests for all utility functions
- Test component behavior, not implementation
- Use Jest and React Testing Library
- Aim for >80% code coverage

### E2E Tests

- Test critical user workflows
- Use Playwright for browser automation
- Test across different screen sizes
- Include performance assertions

### Test Naming

- Use descriptive test names
- Follow the pattern: "should [expected behavior] when [condition]"
- Group related tests using `describe` blocks

## Pull Request Process

### Before Submitting

1. **Ensure tests pass**
   ```bash
   pnpm test:all
   pnpm lint
   ```

2. **Update documentation** if needed
3. **Check for console.log statements** and remove them
4. **Verify TypeScript compilation** without errors

### PR Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Unit tests pass
- [ ] E2E tests pass
- [ ] Manual testing completed

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] No console.log statements
- [ ] TypeScript types are proper
```

## Code Review Guidelines

### Review Checklist

- [ ] Code follows project standards
- [ ] Tests are comprehensive
- [ ] No security vulnerabilities
- [ ] Performance considerations addressed
- [ ] Accessibility requirements met
- [ ] Mobile responsiveness maintained

### Review Process

1. **Initial review** by maintainers
2. **Address feedback** and update PR
3. **Final approval** from at least one maintainer
4. **Merge** when all checks pass

## Reporting Issues

### Bug Reports

- Use the issue template
- Include steps to reproduce
- Add error messages and stack traces
- Specify browser/device information

### Feature Requests

- Describe the use case
- Explain expected behavior
- Consider implementation complexity
- Discuss alternatives

## Security

### Reporting Security Issues

- **DO NOT** create public issues for security vulnerabilities
- Email security@speedy-van.co.uk
- Include detailed reproduction steps
- Allow time for investigation and fix

### Security Guidelines

- Never commit secrets or API keys
- Use environment variables for configuration
- Validate all user inputs
- Follow OWASP security guidelines
- Keep dependencies updated

## Getting Help

- Check existing documentation
- Search existing issues
- Join our community discussions
- Contact maintainers for urgent issues

## Recognition

Contributors will be recognized in:
- Project README
- Release notes
- Contributor hall of fame

Thank you for contributing to Speedy Van! 🚚
