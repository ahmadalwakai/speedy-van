# Speedy Van - Professional Moving Services Platform

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-20.12.2-green.svg)](https://nodejs.org/)
[![pnpm](https://img.shields.io/badge/pnpm-10.13.1-orange.svg)](https://pnpm.io/)

A comprehensive monorepo for Speedy Van's professional moving services platform, featuring web applications, admin dashboards, driver portals, and customer management systems.

## 🚚 About Speedy Van

Speedy Van provides professional moving services across the UK, offering:
- **Furniture & Appliance Moving** - Expert handling of delicate items
- **Student Relocation** - Affordable campus-to-campus services
- **Business & Office Moving** - Minimal downtime corporate solutions
- **Custom Moving Solutions** - Tailored services for unique needs

## 🏗️ Architecture

This project is built as a **monorepo** using modern web technologies:

- **Frontend**: Next.js 14 with App Router, React 18, TypeScript
- **UI Framework**: Chakra UI with custom design system
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js with role-based access control
- **Payments**: Stripe integration
- **Real-time**: Pusher for live updates and chat
- **Maps**: Mapbox for location services
- **Testing**: Playwright E2E tests, Jest unit tests

## 📁 Project Structure

```
speedy-van/
├── apps/
│   └── web/                    # Main Next.js application
│       ├── src/
│       │   ├── app/           # App Router pages and API routes
│       │   │   ├── (public)/  # Public-facing pages
│       │   │   ├── (admin)/   # Admin portal routes
│       │   │   ├── (driver-portal)/ # Driver portal routes
│       │   │   ├── (customer-portal)/ # Customer portal routes
│       │   │   └── api/       # API endpoints
│       │   ├── components/    # Reusable React components
│       │   ├── lib/           # Utility functions and services
│       │   ├── types/         # TypeScript type definitions
│       │   ├── data/          # Static data and constants
│       │   └── theme/         # Chakra UI theme configuration
│       ├── prisma/            # Database schema and migrations
│       ├── tests/             # Test files
│       └── public/            # Static assets
├── scripts/                    # Build and utility scripts
├── docs/                      # Documentation and reports
└── .github/                   # GitHub Actions workflows
```

## 🚀 Getting Started

### Prerequisites

- **Node.js**: 20.12.2 (see `.nvmrc`)
- **Package Manager**: pnpm (enabled via Corepack)
- **Database**: PostgreSQL instance
- **Git**: For version control

### Installation

1. **Clone the repository**
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

The application will be available at [http://localhost:3000](http://localhost:3000)

## 🛠️ Development

### Available Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start development server |
| `pnpm build` | Build for production |
| `pnpm start` | Start production server |
| `pnpm test` | Run Playwright E2E tests |
| `pnpm test:unit` | Run Jest unit tests |
| `pnpm test:ui` | Run Playwright tests with UI |
| `pnpm lint` | Run ESLint |
| `pnpm prisma:generate` | Generate Prisma client |
| `pnpm prisma:migrate` | Run database migrations |

### Development Workflow

1. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes** following the [coding standards](CONTRIBUTING.md)

3. **Run tests** to ensure everything works
   ```bash
   pnpm test:all
   ```

4. **Submit a pull request** following the [contribution guidelines](CONTRIBUTING.md)

## 🧪 Testing

### E2E Testing
- **Framework**: Playwright
- **Coverage**: Critical user workflows, admin functions, driver operations
- **Performance**: Strict loading time requirements
- **Run**: `pnpm test:e2e`

### Unit Testing
- **Framework**: Jest + React Testing Library
- **Coverage**: Components, utilities, services
- **Run**: `pnpm test:unit`

### Test Structure
```
tests/
├── e2e/           # End-to-end tests
├── unit/          # Unit tests
└── integration/   # Integration tests
```

## 🔐 Security

- **Authentication**: NextAuth.js with role-based access
- **Password Security**: bcrypt hashing
- **Input Validation**: Zod schema validation
- **API Security**: Rate limiting, CORS protection
- **Environment Variables**: Secure secret management

## 📊 Monitoring & Performance

- **Error Tracking**: Sentry integration
- **Performance**: Lighthouse CI, bundle analysis
- **Real-time**: Pusher for live updates
- **Logging**: Structured logging with environment-based levels

## 🌐 Deployment

### Production Environment
- **Hosting**: Render (see `render.yaml`)
- **Database**: Neon PostgreSQL
- **CDN**: Static asset optimization
- **SSL**: Automatic HTTPS

### Environment Variables
Required environment variables are documented in `env.example`. Key variables include:
- Database connection strings
- API keys (Stripe, Mapbox, Pusher)
- Authentication secrets
- Service endpoints

## 📚 Documentation

- **[Contributing Guide](CONTRIBUTING.md)** - How to contribute to the project
- **[API Documentation](apps/web/PORTAL_APIS.md)** - API endpoints and contracts
- **[Database Schema](apps/web/prisma/schema.prisma)** - Database structure
- **[Component Library](apps/web/DESIGN_SYSTEM.md)** - UI component documentation

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details on:
- Code standards and style
- Testing requirements
- Pull request process
- Security guidelines

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: Check the docs folder and README files
- **Issues**: Use GitHub Issues for bug reports and feature requests
- **Security**: Email security@speedy-van.co.uk for security issues
- **General**: Contact support@speedy-van.co.uk

## 🏆 Acknowledgments

- **Next.js Team** for the excellent framework
- **Chakra UI** for the component library
- **Prisma** for the database toolkit
- **Playwright** for testing tools
- **All contributors** who help improve Speedy Van

---

**Speedy Van** - Professional Moving Services Across the UK 🚚

*Built with ❤️ using modern web technologies*

