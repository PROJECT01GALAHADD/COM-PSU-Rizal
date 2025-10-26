# Alignment Log

A running log of decisions, fixes, and integrations to coordinate humans and LLMs.

## 2025-10-07

- **Middleware header types**
  - File: `middleware.ts`
  - Change: ensured `headers.set` only receives strings, removed duplicate `x-user-type` set.
  - Result: fixed TS2345 and stabilized edge middleware typing.

- **Dialog prop serialization**
  - File: `components/examples-dialog.tsx`
  - Change: added `onOpenChangeAction` (preferred) while keeping `onOpenChange` for back-compat; internal `handleOpenChange` selects action if present.
  - Result: satisfied client component serializability rule.

- **About page rewrite**
  - File: `app/about/page.tsx`
  - Change: replaced COM marketing with PSU Rizal platform intro, features, and CTAs.
  - Result: on-brand About page that explains the platform.

- **Header nav fix**
  - File: `components/site-header.tsx`
  - Change: restored a clean `SiteHeader()` and added "About" to desktop/mobile nav; kept CTAs.
  - Result: consistent navigation with About route.

- **Legal pages stubs**
  - Files: `app/privacy-policy/page.tsx`, `app/acceptable-use/page.tsx`
  - Change: added placeholders to satisfy footer links.
  - Result: no dead links in footer; ready for policy content.

- **Prettier for Markdown**
  - Files: `.vscode/settings.json`, `.prettierrc`
  - Change: configured Prettier to format `.md` and enabled format-on-save.
  - Result: consistent docs formatting.

- **Package manager guidance**
  - Decision: use pnpm (lockfile present, scripts use pnpm).
  - Result: eliminated npm warnings about pnpm config keys.

## Pending / In Progress

- **Admin page TypeScript cleanup**: `app/admin/page.tsx` (handler types, invalid assignments, chart types)
- **Auth props alignment**: `AuthForm` and `SocialLogin` signatures vs usages in `/login`, `/signup`
- **UI forwardRef types**: verify `components/ui/button.tsx`, `components/ui/badge.tsx` if ref errors persist locally
- **DB wiring**: Supabase first (SSL, clients), then NocoDB scope via API bridge

## Notes

- Templates under `templates/` are excluded from analysis and used only as reference resources.
- Use `pnpm` for all dependency operations.
