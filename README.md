# WriteSpace

A modern blogging platform built with Angular 17+ that provides a clean, distraction-free writing and reading experience. Features a public-facing blog with an admin dashboard for content management.

## Features

- **Public Blog** — Browse and read published blog posts with a clean, minimal interface
- **Post Detail View** — Full article pages with formatted content, author info, and publication date
- **Admin Dashboard** — Secure admin panel for managing blog content
- **Post Management** — Create, edit, publish, unpublish, and delete blog posts
- **Rich Text Editing** — Write and format blog posts with a user-friendly editor
- **Authentication** — Login/logout functionality to protect admin routes
- **Local Storage Persistence** — All data persisted in the browser via localStorage (no backend required)
- **Responsive Design** — Fully responsive layout that works on desktop, tablet, and mobile
- **Route Guards** — Protected admin routes that redirect unauthorized users to login

## Tech Stack

| Technology | Purpose |
|---|---|
| **Angular 17+** | Frontend framework with standalone components |
| **TypeScript** | Type-safe JavaScript |
| **CSS** | Custom styling with CSS variables design system |
| **localStorage** | Client-side data persistence |
| **Angular Router** | Client-side routing with lazy loading |
| **Reactive Forms** | Form handling and validation |
| **Vercel** | Deployment and hosting |

## Folder Structure

```
src/
├── app/
│   ├── components/
│   │   ├── admin-dashboard/       # Admin dashboard overview
│   │   ├── admin-layout/          # Layout wrapper for admin pages
│   │   ├── blog-list/             # Public blog listing page
│   │   ├── blog-post/             # Public post detail page
│   │   ├── confirm-dialog/        # Reusable confirmation dialog
│   │   ├── header/                # Public site header/navigation
│   │   ├── login/                 # Admin login page
│   │   ├── post-editor/           # Create/edit post form
│   │   └── post-manager/          # Admin post list management
│   ├── guards/
│   │   └── auth.guard.ts          # Route guard for admin pages
│   ├── models/
│   │   └── post.model.ts          # Post and User type definitions
│   ├── services/
│   │   ├── auth.service.ts        # Authentication service (localStorage)
│   │   └── post.service.ts        # Blog post CRUD service (localStorage)
│   ├── app.component.ts           # Root component
│   ├── app.config.ts              # Application configuration
│   └── app.routes.ts              # Route definitions with lazy loading
├── environments/
│   ├── environment.ts             # Development environment config
│   └── environment.prod.ts        # Production environment config
├── styles.css                     # Global styles and CSS variables
├── index.html                     # HTML entry point
└── main.ts                        # Application bootstrap
```

## Prerequisites

- **Node.js** >= 18.x
- **npm** >= 9.x
- **Angular CLI** >= 17.x

## Setup Instructions

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd writespace
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start the development server**

   ```bash
   ng serve
   ```

4. **Open in browser**

   Navigate to [http://localhost:4200](http://localhost:4200)

## Build Instructions

To create a production build:

```bash
ng build
```

The build artifacts will be output to the `dist/writespace` directory. The production build includes:

- Ahead-of-Time (AOT) compilation
- Tree shaking and dead code elimination
- Minification and bundling

## Deployment (Vercel)

### Automatic Deployment

1. Connect your repository to [Vercel](https://vercel.com)
2. Vercel will auto-detect the Angular framework
3. Ensure the following build settings:
   - **Build Command:** `ng build`
   - **Output Directory:** `dist/writespace/browser`
   - **Install Command:** `npm install`

### Manual Deployment

1. Install the Vercel CLI:

   ```bash
   npm install -g vercel
   ```

2. Build the project:

   ```bash
   ng build
   ```

3. Deploy:

   ```bash
   vercel --prod
   ```

### Vercel Configuration

A `vercel.json` file is included in the project root to handle SPA routing:

```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

## Default Admin Credentials

Use the following credentials to access the admin dashboard at `/admin`:

| Field | Value |
|---|---|
| **Username** | `admin` |
| **Password** | `admin123` |

> ⚠️ **Note:** These credentials are stored client-side and are intended for demonstration purposes only. Change them for any production-like usage.

## Design System

WriteSpace uses a CSS custom properties (variables) design system for consistent theming:

### Colors

| Variable | Purpose |
|---|---|
| `--color-primary` | Primary brand color (links, buttons, accents) |
| `--color-primary-hover` | Hover state for primary elements |
| `--color-bg` | Page background |
| `--color-surface` | Card/component background |
| `--color-text` | Primary text color |
| `--color-text-secondary` | Secondary/muted text |
| `--color-border` | Borders and dividers |
| `--color-danger` | Destructive actions (delete) |
| `--color-success` | Success states (publish) |

### Typography

- **Font Family:** System font stack for optimal performance
- **Headings:** Weighted hierarchy from `h1` (2rem) to `h4` (1.15rem)
- **Body:** 1rem base with 1.6 line height for readability

### Spacing

Consistent spacing scale using `rem` units applied through component styles.

### Components

- **Buttons:** Primary, secondary, danger, and success variants
- **Cards:** Elevated surface containers with subtle borders
- **Forms:** Styled inputs, textareas, and select elements with focus states
- **Dialogs:** Modal overlay with backdrop for confirmations

## Available Scripts

| Command | Description |
|---|---|
| `ng serve` | Start development server on port 4200 |
| `ng build` | Build for production |
| `ng test` | Run unit tests via Karma |
| `ng lint` | Lint the project |
| `ng generate component <name>` | Generate a new component |

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

**Private** — All rights reserved. This project is proprietary and confidential. Unauthorized copying, distribution, or modification is strictly prohibited.