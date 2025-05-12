# Migration to Monorepo

This document explains how to migrate from separate package.json files in the frontend and backend directories to a monorepo structure using npm workspaces.

## Migration Steps

### 1. Update Root Package.json

The root package.json has been updated to use npm workspaces:

```json
{
  "name": "tutorial-learning-platform",
  "version": "1.0.0",
  "description": "Full stack tutorial learning platform",
  "private": true,
  "workspaces": [
    "frontend",
    "backend"
  ],
  "scripts": {
    "start": "concurrently \"npm run server\" \"npm run client\"",
    "server": "npm run dev --workspace=backend",
    "client": "npm run dev --workspace=frontend",
    "build": "npm run build --workspace=frontend",
    "build:all": "npm run build --workspaces",
    "lint": "npm run lint --workspaces",
    "install:backend": "npm install --workspace=backend",
    "install:frontend": "npm install --workspace=frontend"
  }
}
```

### 2. Update Workspace Package.json Files

Frontend and backend package.json files were simplified to include only unique dependencies not shared with the root.

#### Frontend package.json

```json
{
  "name": "frontend",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "lint": "eslint .",
    "preview": "vite preview"
  },
  "dependencies": {
    "lucide-react": "^0.344.0"
  },
  "devDependencies": {
    "@eslint/js": "^9.9.1",
    "autoprefixer": "^10.4.18",
    "eslint-plugin-react-hooks": "^5.1.0-rc.0",
    "eslint-plugin-react-refresh": "^0.4.11",
    "globals": "^15.9.0",
    "postcss": "^8.4.35",
    "tailwindcss": "^3.4.1",
    "typescript-eslint": "^8.3.0"
  }
}
```

#### Backend package.json

```json
{
  "name": "backend",
  "version": "1.0.0",
  "description": "Backend for Tutorial Learning Platform",
  "main": "dist/server.js",
  "scripts": {
    "start": "node dist/server.js",
    "dev": "nodemon src/server.ts",
    "build": "tsc",
    "lint": "eslint . --ext .ts",
    "test": "jest"
  },
  "dependencies": {
    "cloudinary": "^1.41.0",
    "express-validator": "^7.0.1",
    "multer": "^1.4.5-lts.1"
  },
  "devDependencies": {
    "@types/multer": "^1.4.9",
    "@typescript-eslint/eslint-plugin": "^6.9.1",
    "@typescript-eslint/parser": "^6.9.1",
    "jest": "^29.7.0"
  }
}
```

### 3. Clean and Reinstall Dependencies

To migrate an existing project:

1. Delete all node_modules folders:
```bash
rm -rf node_modules
rm -rf frontend/node_modules
rm -rf backend/node_modules
```

2. Delete package-lock.json files:
```bash
rm package-lock.json
rm frontend/package-lock.json
rm backend/package-lock.json
```

3. Install all dependencies at the root level:
```bash
npm install
```

### 4. Benefits of Monorepo

- Single package-lock.json file
- Shared dependencies between frontend and backend
- No duplicate dependencies
- Consistent versions across projects
- Simplified dependency management
- Easier to maintain and update
- Better development workflow with npm workspaces

### 5. Common Issues and Solutions

#### Dependency Hoisting

Npm workspaces use dependency hoisting, where dependencies are installed at the root level. If you need a specific version of a package only for a specific workspace, install it directly:

```bash
npm install package-name@version --workspace=frontend
```

#### Package Version Conflicts

If there are version conflicts, you can specify the exact version needed in the workspace's package.json:

```json
{
  "dependencies": {
    "package-name": "1.0.0"
  },
  "resolutions": {
    "package-name": "1.0.0"
  }
}
```

#### TypeScript Path Resolution

If you're using TypeScript paths to reference modules across workspaces, update your tsconfig.json:

```json
{
  "compilerOptions": {
    "paths": {
      "@shared/*": ["../shared/*"]
    }
  }
}
``` 