# Contributing Guide

Thank you for your interest in contributing to AquaPump! This guide will help you get started.

## Code of Conduct

Be respectful, inclusive, and professional. We're all here to build something great together.

## Getting Started

### 1. Fork and Clone

```bash
# Fork the repository on GitHub
# Clone your fork
git clone https://github.com/your-username/aquapump.git
cd aquapump

# Add upstream remote
git remote add upstream https://github.com/original-org/aquapump.git
```

### 2. Set Up Development Environment

```bash
# Install dependencies
bun install

# Copy environment file
cp .env.example .env

# Configure your environment variables
# Edit .env with your values

# Start development server
bun run start-web
```

### 3. Create a Branch

```bash
# Update main branch
git checkout main
git pull upstream main

# Create feature branch
git checkout -b feature/your-feature-name
# or
git checkout -b fix/your-bug-fix
```

## Development Workflow

### Code Style

We use:
- **TypeScript** (strict mode)
- **ESLint** for linting
- **Prettier** for formatting (if configured)

### TypeScript Guidelines

```typescript
// ✅ Good: Explicit types
interface Pump {
  id: string;
  name: string;
  status: 'online' | 'offline' | 'maintenance';
}

const pump: Pump = {
  id: '123',
  name: 'Pump A',
  status: 'online'
};

// ❌ Bad: Implicit any
const pump = {
  id: '123',
  name: 'Pump A',
  status: 'online'
};
```

### Component Guidelines

```typescript
// ✅ Good: Functional component with TypeScript
import { View, Text } from 'react-native';

interface Props {
  title: string;
  onPress?: () => void;
}

export function MyComponent({ title, onPress }: Props) {
  return (
    <View>
      <Text>{title}</Text>
    </View>
  );
}

// ❌ Bad: No types, no clear structure
export function MyComponent(props) {
  return <View><Text>{props.title}</Text></View>;
}
```

### State Management

**Use Context for app-level state:**

```typescript
import createContextHook from '@nkzw/create-context-hook';

export const [ThemeProvider, useTheme] = createContextHook(() => {
  const [isDark, setIsDark] = useState(false);
  
  return {
    isDark,
    toggleTheme: () => setIsDark(!isDark)
  };
});
```

**Use React Query for server state:**

```typescript
import { trpc } from '@/lib/trpc';

function PumpsList() {
  const { data, isLoading } = trpc.pumps.list.useQuery();
  
  if (isLoading) return <Text>Loading...</Text>;
  
  return <View>{/* Render pumps */}</View>;
}
```

### File Organization

```
components/
├── MyComponent.tsx       # Component file
└── MyComponent.test.tsx  # Tests (future)

backend/trpc/routes/
├── feature/
│   ├── list/
│   │   └── route.ts
│   ├── get/
│   │   └── route.ts
│   └── create/
│       └── route.ts
```

### Naming Conventions

- **Components**: PascalCase (`MyComponent.tsx`)
- **Hooks**: camelCase starting with `use` (`useMyHook.ts`)
- **Utils**: camelCase (`myUtil.ts`)
- **Constants**: UPPER_SNAKE_CASE (`MAX_VALUE`)
- **Types/Interfaces**: PascalCase (`MyType`, `MyInterface`)

## Making Changes

### 1. Write Code

Follow the guidelines above and maintain consistency with existing code.

### 2. Test Locally

```bash
# Start dev server
bun run start-web

# Check for TypeScript errors
bunx tsc --noEmit

# Run linter
bun run lint

# Test on different platforms
# - Web browser (desktop)
# - Mobile responsive view
# - Actual mobile device (Expo Go)
```

### 3. Commit Changes

Use conventional commits:

```bash
# Format: <type>(<scope>): <subject>

git commit -m "feat(pumps): add pump deletion feature"
git commit -m "fix(navigation): resolve header alignment issue"
git commit -m "docs(api): update API reference"
git commit -m "chore(deps): update dependencies"
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting)
- `refactor`: Code refactoring
- `perf`: Performance improvements
- `test`: Adding tests
- `chore`: Maintenance tasks

**Scopes** (optional):
- `pumps`, `navigation`, `chatbot`, `theme`, `api`, etc.

### 4. Push Changes

```bash
git push origin feature/your-feature-name
```

### 5. Create Pull Request

1. Go to GitHub
2. Click "New Pull Request"
3. Select your branch
4. Fill out the PR template:

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
How you tested these changes

## Screenshots
If applicable

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-reviewed code
- [ ] Commented complex code
- [ ] Updated documentation
- [ ] No new warnings
- [ ] Tested on multiple platforms
```

## Pull Request Review Process

### What Reviewers Look For

1. **Code Quality**
   - Follows style guidelines
   - Properly typed (TypeScript)
   - Clear variable/function names
   - No unnecessary complexity

2. **Functionality**
   - Works as described
   - Handles edge cases
   - No breaking changes (unless intentional)

3. **Testing**
   - Manually tested
   - Works on web, iOS, Android
   - No console errors

4. **Documentation**
   - Code is commented where needed
   - README/docs updated if needed
   - API changes documented

### Addressing Feedback

```bash
# Make requested changes
git add .
git commit -m "refactor: address review feedback"
git push origin feature/your-feature-name
```

The PR will automatically update.

## Adding New Features

### Backend (tRPC Procedure)

1. Create procedure file:

```typescript
// backend/trpc/routes/pumps/myFeature/route.ts
import { z } from 'zod';
import { protectedProcedure } from '@/backend/trpc/create-context';
import { supabaseAdmin } from '@/backend/services/supabase';

export const myFeatureProcedure = protectedProcedure
  .input(z.object({
    param: z.string()
  }))
  .query(async ({ input }) => {
    const { data, error } = await supabaseAdmin
      .from('table')
      .select('*')
      .eq('field', input.param);
      
    if (error) throw error;
    return data;
  });
```

2. Add to router:

```typescript
// backend/trpc/app-router.ts
import { myFeatureProcedure } from './routes/pumps/myFeature/route';

export const appRouter = router({
  pumps: router({
    myFeature: myFeatureProcedure,
    // ... other procedures
  })
});
```

3. Use in frontend:

```typescript
const { data } = trpc.pumps.myFeature.useQuery({ param: 'value' });
```

### Frontend Component

1. Create component:

```typescript
// components/MyComponent.tsx
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';

interface Props {
  title: string;
}

export function MyComponent({ title }: Props) {
  const { colors } = useTheme();
  
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>
        {title}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600' as const,
  },
});
```

2. Use in pages:

```typescript
// app/index.tsx
import { MyComponent } from '@/components/MyComponent';

export default function HomePage() {
  return <MyComponent title="Hello" />;
}
```

## Documentation

### When to Update Docs

- Adding new features
- Changing APIs
- Updating deployment process
- Fixing bugs (if fix requires explanation)

### Where to Add Docs

- `docs/getting-started.md` - Setup and basics
- `docs/deployment.md` - Deployment changes
- `docs/api.md` - API changes
- `docs/architecture.md` - Architectural changes
- `docs/contributing.md` - Contribution process

### Documentation Style

- Clear and concise
- Code examples included
- Step-by-step instructions
- Screenshots where helpful

## Testing

### Manual Testing Checklist

- [ ] Feature works as expected
- [ ] No console errors
- [ ] Works on web (desktop)
- [ ] Works on web (mobile view)
- [ ] Works on iOS (Expo Go)
- [ ] Works on Android (Expo Go)
- [ ] Dark theme support
- [ ] Light theme support
- [ ] English language
- [ ] Hebrew language (if applicable)

### Future: Automated Testing

We plan to add:
- Unit tests (Jest)
- Component tests (React Native Testing Library)
- E2E tests (Detox)

## Common Issues

### TypeScript Errors

```bash
# Check for errors
bunx tsc --noEmit

# Common fixes:
# - Add type annotations
# - Import types from proper location
# - Use 'as const' for literal types
```

### Expo/Metro Issues

```bash
# Clear cache
rm -rf .expo node_modules
bun install
bun run start-web --clear
```

### Supabase Connection

- Check .env file
- Verify Supabase credentials
- Check database permissions

## Release Process

(Handled by maintainers)

1. Update version in `package.json`
2. Update `CHANGELOG.md`
3. Create Git tag
4. Push to main
5. GitHub Actions builds and deploys

## Getting Help

- **Documentation**: Check [docs/](.)
- **GitHub Issues**: Search existing issues
- **GitHub Discussions**: Ask questions
- **Email**: support@aquapump.com

## Recognition

Contributors will be:
- Listed in `CONTRIBUTORS.md`
- Mentioned in release notes
- Credited in documentation

Thank you for contributing! 🚀
