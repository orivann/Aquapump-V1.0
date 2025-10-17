# AquaPump Project Structure

## Overview

This document explains the complete project structure, organization, and conventions. The project follows best practices for an Expo + React Native application with a Node.js backend.

## Directory Structure

```
aquapump/
├── app/                          # Expo Router pages (MUST stay at root)
│   ├── _layout.tsx              # Root layout with providers
│   ├── index.tsx                # Home page (/)
│   ├── pumps.tsx                # Pumps catalog page (/pumps)
│   └── +not-found.tsx           # 404 page
│
├── src/                         # Source code (organized by feature)
│   ├── components/              # React Native components
│   │   ├── Navigation.tsx       # Global navigation bar
│   │   ├── Hero.tsx             # Hero section
│   │   ├── About.tsx            # About section
│   │   ├── Technology.tsx       # Technology features section
│   │   ├── Products.tsx         # Products carousel
│   │   ├── Contact.tsx          # Contact form
│   │   └── Chatbot.tsx          # AI chatbot component
│   │
│   ├── contexts/                # React Context providers
│   │   ├── ThemeContext.tsx     # Theme (light/dark mode) state
│   │   └── LanguageContext.tsx  # Language (en/he) and RTL state
│   │
│   ├── config/                  # Application configuration
│   │   ├── theme.ts             # Theme definitions (colors, spacing, shadows)
│   │   └── translations.ts      # i18n translations (en/he)
│   │
│   └── lib/                     # Utilities and external integrations
│       ├── trpc.ts              # tRPC client setup
│       ├── hooks/               # Custom React hooks
│       │   └── useScrollAnimation.ts
│       └── supabase/            # Supabase integration
│           ├── client.ts        # Frontend Supabase client
│           └── types.ts         # Database type definitions
│
├── backend/                     # Node.js backend
│   ├── hono.ts                  # Hono server entry point
│   ├── services/                # Business logic services
│   │   └── supabase.ts          # Backend Supabase admin client
│   └── trpc/                    # tRPC API
│       ├── app-router.ts        # Main tRPC router
│       ├── create-context.ts    # tRPC context creation
│       └── routes/              # API route procedures
│           ├── example/
│           │   └── hi/route.ts
│           └── pumps/           # Pumps API
│               ├── list/route.ts
│               ├── get/route.ts
│               ├── create/route.ts
│               ├── update/route.ts
│               ├── delete/route.ts
│               └── logs/route.ts
│
├── assets/                      # Static assets
│   └── images/                  # App icons and images
│       ├── icon.png
│       ├── favicon.png
│       ├── splash-icon.png
│       └── adaptive-icon.png
│
├── docs/                        # Project documentation
│   ├── INDEX.md                 # Documentation index
│   ├── getting-started.md       # Quick start guide
│   ├── architecture.md          # System architecture
│   ├── api.md                   # API documentation
│   ├── deployment.md            # Deployment guide
│   ├── gitops.md                # GitOps workflow
│   ├── wsl-setup.md             # WSL-specific setup
│   └── contributing.md          # Contributing guidelines
│
├── infra/                       # Infrastructure as Code
│   ├── helm/                    # Helm charts
│   │   └── aquapump/
│   │       ├── Chart.yaml
│   │       ├── values.yaml
│   │       ├── values-dev.yaml
│   │       ├── values-staging.yaml
│   │       └── templates/
│   ├── argocd/                  # Argo CD configurations
│   │   ├── application.yaml
│   │   ├── application-staging.yaml
│   │   ├── application-dev.yaml
│   │   └── appproject.yaml
│   ├── Dockerfile               # Container build file
│   └── .dockerignore
│
├── scripts/                     # Automation scripts
│   ├── deploy-helm.sh           # Helm deployment script
│   ├── setup-argocd.sh          # Argo CD setup
│   ├── local-dev.sh             # Local development helper
│   ├── health-check.sh          # Health check script
│   ├── logs.sh                  # View logs
│   └── rollback.sh              # Rollback deployments
│
├── .github/                     # GitHub configurations
│   └── workflows/               # GitHub Actions
│       ├── main.yml             # Main CI/CD workflow
│       └── gitops-deploy.yaml   # GitOps deployment
│
├── .env                         # Environment variables (local)
├── .env.example                 # Environment variables template
├── .env.production              # Production environment variables
├── .gitignore                   # Git ignore rules
├── package.json                 # Node.js dependencies
├── bun.lock                     # Bun lockfile
├── tsconfig.json                # TypeScript configuration
├── app.json                     # Expo configuration
├── eslint.config.js             # ESLint configuration
├── Dockerfile                   # Main Dockerfile
├── docker-compose.yml           # Development compose
├── docker-compose.prod.yml      # Production compose
├── healthcheck.js               # Health check endpoint
├── README.md                    # Project README
├── DOCUMENTATION.md             # Documentation guide
└── PROJECT_STRUCTURE.md         # This file
```

## Key Conventions

### 1. Import Paths

The project uses TypeScript path mapping with `@/` prefix:

```typescript
// Import from src/
import { useTheme } from '@/src/contexts/ThemeContext';
import { translations } from '@/src/config/translations';
import Navigation from '@/src/components/Navigation';

// Import from backend/
import { createContext } from '@/backend/trpc/create-context';
import type { Database } from '@/src/lib/supabase/types';

// Import from assets/
import logo from '@/assets/images/icon.png';
```

### 2. Component Organization

All React components live in `src/components/`:

- Use named exports for utility functions
- Default export the main component
- Memoize components with `React.memo()` when appropriate
- Co-locate component-specific types in the same file

### 3. Context Providers

Application-wide state management using React Context:

- **ThemeContext**: Manages light/dark mode
- **LanguageContext**: Manages language (en/he) and RTL

Providers are wrapped in `app/_layout.tsx` in this order:
1. QueryClientProvider (React Query)
2. LanguageProvider
3. ThemeProvider

### 4. Configuration Files

- `src/config/theme.ts`: Theme definitions (colors, spacing, shadows)
- `src/config/translations.ts`: All user-facing text in en/he

### 5. Backend Structure

The backend follows a clean architecture:

- **hono.ts**: Entry point, middleware, and routing
- **services/**: Business logic and external integrations
- **trpc/routes/**: API endpoints organized by feature

Each tRPC route is a separate file exporting a procedure:

```typescript
// backend/trpc/routes/pumps/list/route.ts
export const listPumpsProcedure = publicProcedure.query(async () => {
  return await getPumps();
});
```

### 6. Type Safety

- All components use TypeScript with strict mode
- Database types are defined in `src/lib/supabase/types.ts`
- Shared types between frontend and backend use the same source

### 7. Styling

- Use React Native `StyleSheet.create()` for all styles
- Never inline complex styles
- Use theme colors from `ThemeContext`
- Support both light and dark modes

## File Naming Conventions

- Components: PascalCase (e.g., `Navigation.tsx`, `Hero.tsx`)
- Utilities: camelCase (e.g., `useScrollAnimation.ts`, `trpc.ts`)
- Config: kebab-case or camelCase (e.g., `theme.ts`, `translations.ts`)
- Backend routes: lowercase with folders (e.g., `pumps/list/route.ts`)

## Adding New Features

### Adding a New Page

1. Create file in `app/` directory (e.g., `app/about.tsx`)
2. Add route to `app/_layout.tsx` if needed
3. Import components from `src/components/`

### Adding a New Component

1. Create file in `src/components/` (e.g., `src/components/Footer.tsx`)
2. Use proper imports: `@/src/contexts/...`, `@/src/config/...`
3. Export as default
4. Add to relevant page

### Adding a New API Endpoint

1. Create folder in `backend/trpc/routes/` (e.g., `backend/trpc/routes/users/`)
2. Create `route.ts` with procedure:
   ```typescript
   export const listUsersProcedure = publicProcedure.query(async () => {
     // Your logic here
   });
   ```
3. Import and add to `backend/trpc/app-router.ts`:
   ```typescript
   import { listUsersProcedure } from './routes/users/list/route';
   
   export const appRouter = createTRPCRouter({
     users: createTRPCRouter({
       list: listUsersProcedure,
     }),
   });
   ```

### Adding Translations

Edit `src/config/translations.ts`:

```typescript
export const translations = {
  // ... existing translations
  myNewSection: {
    title: { en: 'My Title', he: 'הכותרת שלי' },
    description: { en: 'Description', he: 'תיאור' },
  },
};
```

Use in components:

```typescript
import { useLanguage } from '@/src/contexts/LanguageContext';
import { translations } from '@/src/config/translations';

function MyComponent() {
  const { t } = useLanguage();
  return <Text>{t(translations.myNewSection.title)}</Text>;
}
```

## Environment Variables

### Required for Development

```env
# API Configuration
EXPO_PUBLIC_API_URL=http://localhost:8081/api
EXPO_PUBLIC_RORK_API_BASE_URL=http://localhost:8081
EXPO_PUBLIC_TOOLKIT_URL=https://toolkit.rork.com
EXPO_PUBLIC_AI_CHAT_KEY=your-api-key-here

# Supabase (Optional)
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_KEY=your-service-key

# Backend
NODE_ENV=development
PORT=8081
CORS_ORIGIN=*
```

## Best Practices

### Component Design

- Keep components small and focused
- Extract reusable logic into custom hooks
- Use memoization for expensive computations
- Add accessibility props (`accessibilityRole`, `accessibilityLabel`)

### State Management

- Use `useState` for local component state
- Use Context for global state (theme, language)
- Use React Query for server state
- Never prop drill more than 2 levels

### Performance

- Use `React.memo()` for components that re-render often
- Use `useMemo()` for expensive calculations
- Use `useCallback()` for callbacks passed to children
- Lazy load heavy components

### Code Quality

- Run `bunx tsc --noEmit` before committing
- Follow ESLint rules
- Write meaningful variable and function names
- Add comments for complex logic only

## Testing

- Add `testID` props to components for UI testing
- Use descriptive test IDs (e.g., `testID="navbar-logo"`)
- Components are ready for integration with testing frameworks

## Deployment

See [docs/deployment.md](docs/deployment.md) for detailed deployment instructions using:

- Docker Compose (development)
- Kubernetes + Helm (production)
- Argo CD (GitOps automation)

## Documentation

- Main docs in `docs/` directory
- Start with [docs/INDEX.md](docs/INDEX.md)
- API documentation in [docs/api.md](docs/api.md)
- Architecture overview in [docs/architecture.md](docs/architecture.md)

## Troubleshooting

### Import errors

If you see import errors:
1. Check the path uses `@/src/` or `@/backend/` prefix
2. Verify the file exists at that location
3. Restart TypeScript server in your IDE

### Component not updating

1. Check if proper dependencies in `useEffect`, `useMemo`, `useCallback`
2. Verify Context provider is wrapping the component
3. Check if component is memoized correctly

### Backend errors

1. Check environment variables are set
2. Verify Supabase connection if using database
3. Check tRPC router configuration
4. Review backend logs with `bun run start-web`

## Support

- For bugs or features, open an issue
- For setup help, see [docs/getting-started.md](docs/getting-started.md)
- For contribution guidelines, see [docs/contributing.md](docs/contributing.md)

---

**Last Updated**: 2025-10-17
**Version**: 2.0.0
