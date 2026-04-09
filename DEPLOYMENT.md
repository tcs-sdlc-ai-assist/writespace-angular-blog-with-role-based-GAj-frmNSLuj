# Deployment Guide — Vercel

This guide covers deploying the **WriteSpace** Angular application to [Vercel](https://vercel.com).

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Project Configuration](#project-configuration)
3. [vercel.json Configuration](#verceljson-configuration)
4. [angular.json Output Path](#angularjson-output-path)
5. [Build Command & Output Directory](#build-command--output-directory)
6. [SPA Rewrite Rules](#spa-rewrite-rules)
7. [Environment Setup](#environment-setup)
8. [Deploying to Vercel](#deploying-to-vercel)
9. [Troubleshooting](#troubleshooting)

---

## Prerequisites

Before deploying, ensure you have the following:

- **Node.js** >= 18.x installed locally
- **Angular CLI** >= 17.x (`npm install -g @angular/cli`)
- A **Vercel account** — sign up at [vercel.com](https://vercel.com)
- **Vercel CLI** installed globally (optional but recommended):
  ```bash
  npm install -g vercel
  ```
- The project builds successfully locally:
  ```bash
  ng build
  ```
- A Git repository (GitHub, GitLab, or Bitbucket) connected to Vercel, or willingness to deploy via the CLI

---

## Project Configuration

The WriteSpace project is a standalone Angular 17+ application. Key configuration files relevant to deployment:

| File             | Purpose                                      |
| ---------------- | -------------------------------------------- |
| `angular.json`   | Angular workspace config (build output path) |
| `vercel.json`    | Vercel platform configuration                |
| `package.json`   | Dependencies and build scripts               |
| `tsconfig.json`  | TypeScript compiler options                  |

---

## vercel.json Configuration

Create a `vercel.json` file in the project root with the following content:

```json
{
  "version": 2,
  "buildCommand": "ng build",
  "outputDirectory": "dist/writespace/browser",
  "framework": null,
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ],
  "headers": [
    {
      "source": "/assets/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    },
    {
      "source": "/(.*).js",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    },
    {
      "source": "/(.*).css",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ]
}
```

### Configuration Breakdown

| Property           | Description                                                                                                                                                   |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `version`          | Vercel platform version. Always use `2`.                                                                                                                      |
| `buildCommand`     | The command Vercel runs to build the project. Uses Angular CLI's `ng build` which triggers a production build by default.                                      |
| `outputDirectory`  | The directory containing the built static files. Angular 17+ outputs to `dist/<project-name>/browser` when using the application builder.                     |
| `framework`        | Set to `null` to prevent Vercel from auto-detecting and applying its own framework preset. We manage the build configuration explicitly.                       |
| `rewrites`         | URL rewrite rules. The catch-all rule sends every request to `index.html`, enabling Angular's client-side router to handle all routes.                         |
| `headers`          | Custom HTTP response headers. We set aggressive caching for static assets (JS, CSS, images) since Angular uses content-hashed filenames for cache busting.     |

---

## angular.json Output Path

In `angular.json`, the build output path is configured under the `architect.build` section:

```json
{
  "projects": {
    "writespace": {
      "architect": {
        "build": {
          "builder": "@angular-devkit/build-angular:application",
          "options": {
            "outputPath": "dist/writespace"
          }
        }
      }
    }
  }
}
```

With Angular 17+'s `application` builder, the production build outputs files to:

```
dist/writespace/browser/
```

This is the directory structure after running `ng build`:

```
dist/
└── writespace/
    └── browser/
        ├── index.html
        ├── main-[hash].js
        ├── polyfills-[hash].js
        ├── styles-[hash].css
        └── assets/
            └── ...
```

> **Important:** The `outputDirectory` in `vercel.json` must match this path exactly: `dist/writespace/browser`. If you rename the project in `angular.json`, update `vercel.json` accordingly.

---

## Build Command & Output Directory

| Setting            | Value                       |
| ------------------ | --------------------------- |
| **Build Command**  | `ng build`                  |
| **Output Directory** | `dist/writespace/browser` |
| **Install Command** | `npm install` (default)    |
| **Node.js Version** | 18.x or 20.x              |

### What `ng build` Does

- Compiles TypeScript to JavaScript
- Performs Ahead-of-Time (AOT) compilation
- Tree-shakes unused code
- Minifies and bundles JavaScript and CSS
- Generates content-hashed filenames for cache busting
- Outputs everything to `dist/writespace/browser/`

If you have a custom build script in `package.json`, you can reference it instead:

```json
{
  "scripts": {
    "build": "ng build"
  }
}
```

Vercel will automatically run `npm run build` if no `buildCommand` is specified in `vercel.json`, but being explicit is recommended.

---

## SPA Rewrite Rules

Angular is a Single Page Application (SPA). The Angular Router handles navigation on the client side. Without rewrite rules, navigating directly to a route like `/blog/my-post` would result in a **404** because Vercel looks for a file at that path and finds none.

The rewrite rule in `vercel.json` solves this:

```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

### How It Works

1. A user navigates to `https://yourapp.vercel.app/blog/my-post`
2. Vercel checks if a static file exists at `/blog/my-post` — it does not
3. The rewrite rule catches the request and serves `/index.html` instead
4. Angular bootstraps in the browser and the Angular Router reads the URL
5. The Router matches `/blog/my-post` to the correct component and renders it

### Important Notes

- **Static assets are served directly.** Vercel serves files that physically exist (JS, CSS, images) before applying rewrites. Your assets will not be affected.
- **This is a rewrite, not a redirect.** The URL in the browser stays the same — the user sees `/blog/my-post`, not `/index.html`.
- **API proxying:** If your app calls an external API and you want to proxy requests through Vercel, add specific rewrites _before_ the catch-all:

  ```json
  {
    "rewrites": [
      {
        "source": "/api/(.*)",
        "destination": "https://your-api-server.com/api/$1"
      },
      {
        "source": "/(.*)",
        "destination": "/index.html"
      }
    ]
  }
  ```

---

## Environment Setup

### Setting Environment Variables on Vercel

1. Go to your project on the [Vercel Dashboard](https://vercel.com/dashboard)
2. Navigate to **Settings** → **Environment Variables**
3. Add your variables for the appropriate environments (Production, Preview, Development)

Common environment variables for WriteSpace:

| Variable                  | Description                    | Example                              |
| ------------------------- | ------------------------------ | ------------------------------------ |
| `NG_APP_API_URL`          | Backend API base URL           | `https://api.writespace.com`         |
| `NG_APP_ENV`              | Environment identifier         | `production`                         |

### Using Environment Variables in Angular

Angular uses `src/environments/` files for build-time configuration:

- `src/environments/environment.ts` — development defaults
- `src/environments/environment.prod.ts` — production values

```typescript
// src/environments/environment.prod.ts
export const environment = {
  production: true,
  apiUrl: 'https://api.writespace.com'
};
```

To inject Vercel environment variables at build time, update the `buildCommand` in `vercel.json` to use a custom script that writes environment values before building:

```json
{
  "buildCommand": "node scripts/set-env.js && ng build"
}
```

Alternatively, use Angular's `fileReplacements` in `angular.json` (already configured by default) to swap environment files during production builds.

### Setting the Node.js Version

Specify the Node.js version in your Vercel project settings or add an `.nvmrc` file:

```
20
```

Or set it in `package.json`:

```json
{
  "engines": {
    "node": ">=18.0.0"
  }
}
```

---

## Deploying to Vercel

### Option 1: Git Integration (Recommended)

1. Push your code to a Git repository (GitHub, GitLab, or Bitbucket)
2. Go to [vercel.com/new](https://vercel.com/new)
3. Import your repository
4. Vercel auto-detects the settings from `vercel.json`. Verify:
   - **Build Command:** `ng build`
   - **Output Directory:** `dist/writespace/browser`
   - **Install Command:** `npm install`
5. Click **Deploy**

Every subsequent push to the `main` branch triggers a production deployment. Pull requests get preview deployments automatically.

### Option 2: Vercel CLI

```bash
# Login to Vercel
vercel login

# Deploy from the project root (preview deployment)
vercel

# Deploy to production
vercel --prod
```

### Option 3: Manual Build + Deploy

```bash
# Build locally
ng build

# Deploy the output directory
vercel deploy dist/writespace/browser --prod
```

---

## Troubleshooting

### 404 Errors on Page Refresh or Direct Navigation

**Symptom:** Navigating directly to a route (e.g., `/dashboard`) returns a 404 page.

**Cause:** Vercel is looking for a static file at that path and not falling back to `index.html`.

**Solution:** Ensure the `rewrites` rule exists in `vercel.json`:

```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

Also verify that `framework` is set to `null` in `vercel.json`. If Vercel auto-detects Angular, it may apply its own routing rules that conflict with your configuration.

---

### Build Failures: "ng: command not found"

**Symptom:** The build fails with `ng: command not found` or `sh: ng: not found`.

**Cause:** The Angular CLI is not available in the build environment.

**Solution:** Ensure `@angular/cli` is listed in `devDependencies` in `package.json`:

```json
{
  "devDependencies": {
    "@angular/cli": "^17.0.0"
  }
}
```

Alternatively, use `npx` in the build command:

```json
{
  "buildCommand": "npx ng build"
}
```

---

### Build Failures: Output Directory Not Found

**Symptom:** Vercel reports that the output directory is empty or does not exist.

**Cause:** The `outputDirectory` in `vercel.json` does not match the actual build output path.

**Solution:**

1. Run `ng build` locally and check the output path
2. For Angular 17+ with the `application` builder, the output is `dist/writespace/browser`
3. For older Angular versions using the `browser` builder, the output is `dist/writespace` (no `/browser` subdirectory)
4. Update `vercel.json` to match:

```json
{
  "outputDirectory": "dist/writespace/browser"
}
```

---

### Build Failures: Out of Memory

**Symptom:** Build fails with `JavaScript heap out of memory`.

**Solution:** Increase the Node.js memory limit in the build command:

```json
{
  "buildCommand": "node --max-old-space-size=8192 ./node_modules/@angular/cli/bin/ng build"
}
```

---

### Routing Works Locally but Not on Vercel

**Symptom:** Angular routing works with `ng serve` but breaks on Vercel.

**Cause:** `ng serve` has a built-in fallback to `index.html`. Vercel requires explicit rewrite rules.

**Solution:** Confirm the rewrite rule is in `vercel.json` and redeploy. If you recently added the rule, Vercel may be serving a cached version. Trigger a new deployment:

```bash
vercel --prod --force
```

---

### Assets Not Loading (Images, Fonts, Icons)

**Symptom:** Static assets return 404 after deployment.

**Cause:** Asset paths are incorrect or assets are not included in the build output.

**Solution:**

1. Verify assets are listed in `angular.json` under `architect.build.options.assets`:

   ```json
   {
     "assets": [
       "src/favicon.ico",
       "src/assets"
     ]
   }
   ```

2. Use root-relative paths in templates: `/assets/images/logo.png` (not `assets/images/logo.png` or `../assets/...`)

3. Check that the `<base href="/">` tag is present in `src/index.html`

---

### Environment Variables Not Available at Runtime

**Symptom:** `environment.apiUrl` is `undefined` or has the wrong value in production.

**Cause:** Angular replaces environment files at **build time**, not runtime. Vercel environment variables set in the dashboard are only available during the build process.

**Solution:**

- Use a pre-build script to write Vercel environment variables into Angular's environment files before `ng build` runs
- Or use Angular's `APP_INITIALIZER` to fetch configuration from a `/assets/config.json` file that you generate during the build step

---

### Preview Deployments Using Wrong Environment

**Symptom:** Preview deployments (from pull requests) use production API endpoints.

**Solution:** In Vercel's environment variable settings, set different values for **Production** vs. **Preview** environments. Vercel scopes environment variables by deployment type.

---

## Quick Reference

```bash
# Install dependencies
npm install

# Run locally
ng serve

# Build for production
ng build

# Deploy to Vercel (CLI)
vercel --prod

# Check build output
ls -la dist/writespace/browser/
```

| Item               | Value                       |
| ------------------ | --------------------------- |
| Build Command      | `ng build`                  |
| Output Directory   | `dist/writespace/browser`   |
| Install Command    | `npm install`               |
| Node.js Version    | 18.x or 20.x               |
| Framework Override | `null` (in `vercel.json`)   |
| SPA Rewrite        | `/(.*) → /index.html`      |