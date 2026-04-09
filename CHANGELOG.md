# Changelog

All notable changes to the **WriteSpace** project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-01-15

### Added

#### Public Landing Page
- Public-facing landing page accessible to all visitors without authentication.
- Featured blog posts displayed on the landing page for discovery.
- Responsive hero section with call-to-action for registration and login.

#### Authentication System
- User login page with email and password validation.
- User registration page with form validation and error feedback.
- localStorage-based session persistence across browser refreshes.
- Automatic redirect to login for unauthenticated users attempting to access protected routes.

#### Role-Based Routing & Guards
- Angular route guards implementing role-based access control.
- Three user roles supported: **Reader**, **Author**, and **Admin**.
- Auth guard preventing unauthenticated access to protected routes.
- Role guard restricting route access based on user role.
- Unauthorized users redirected to `/login` with appropriate messaging.

#### Avatar System
- User avatar selection during registration.
- Avatar display in navigation bar and user profile sections.
- Default avatar fallback for users without a selected avatar.

#### Blog CRUD with Ownership
- Full create, read, update, and delete operations for blog posts.
- Blog post ownership enforcement — only the original author can edit or delete their posts.
- Blog listing page with filtering and sorting capabilities.
- Individual blog post detail view with formatted content display.
- Rich text content support for blog post bodies.

#### Admin Dashboard
- Dedicated admin dashboard accessible only to users with the Admin role.
- Overview statistics including total users, total posts, and recent activity.
- Administrative controls for platform-wide content management.

#### User Management
- Admin-only user management interface for viewing all registered users.
- Ability for admins to view user details and assigned roles.
- User listing with search and filter functionality.

#### Data Persistence & Seed Data
- localStorage-based data persistence layer for all application state.
- Pre-seeded demo data including sample users, blog posts, and roles.
- Automatic seed data initialization on first application load.
- Data service abstraction layer for consistent CRUD operations across entities.

#### Responsive CSS UI
- Fully responsive design supporting mobile, tablet, and desktop viewports.
- Custom CSS styling with consistent design system (colors, typography, spacing).
- Mobile-friendly navigation with collapsible menu.
- Accessible form components with proper labels and focus states.
- Loading states and error feedback for all asynchronous operations.

#### Deployment
- Production build configuration optimized for Vercel deployment.
- Vercel-compatible routing configuration for Angular single-page application.
- Environment-based configuration for development and production builds.

### User Stories

- **SCRUM-14960**: As a visitor, I can view the public landing page and register or log in to access the platform.
- **SCRUM-14961**: As an author, I can create, edit, and delete my own blog posts with full ownership control.
- **SCRUM-14962**: As an admin, I can access the admin dashboard and manage users and content across the platform.