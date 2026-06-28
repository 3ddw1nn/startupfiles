# FounderFile

Guided business setup, document preparation, and compliance tracking for solo founders.

FounderFile is a guided business-formation web app for solo founders who match Edward's near-term situation:

- California-based solo founder.
- Starting as a sole proprietor under their own legal name.
- Needs a city business license first.
- May accept early payments through Stripe as a sole proprietor.
- Wants document preparation, online-form walkthroughs, compliance checklists, and a clean path to forming a California LLC later.

The first internal use case is Edward setting up Whale Tales Labs:

- Phase 0: Edward operates under his own legal name as a sole proprietor, gets an Irvine business license, uses Stripe with SSN if needed, and avoids DBA/FBN unless using a separate business name.
- Phase 1: Form `Whale Tales Labs LLC` when revenue, risk, customer payments, contracts, contractors, user data, advertiser money, hardware/preorders, or seriousness justify the California LLC cost.
- Later only if needed: consider Delaware C-Corp if fundraising, stock/options, or investor-readiness becomes relevant.

Public footer/legal-operator rule:

- During Phase 0, public footer and terms should identify the operator as `Edward Lee`, not Whale Tales Labs.
- Example Phase 0 footer: `© 2026 Edward Lee. FounderFile.`
- After `Whale Tales Labs LLC` is formed, public footer/operator language can switch to `FounderFile is a product of Whale Tales Labs LLC.`
- Do not publicly present Whale Tales Labs as the seller, operator, or company before a DBA/FBN is filed or the LLC is formed.

## Planning Docs

- [Product Foundation Plan](docs/PRODUCT_FOUNDATION_PLAN.md)
- [Implementation Roadmap](docs/IMPLEMENTATION_ROADMAP.md)
- [Business Formation Domain Plan](docs/BUSINESS_FORMATION_DOMAIN_PLAN.md)
- [Tech Stack And Architecture](docs/TECH_STACK_AND_ARCHITECTURE.md)
- [Convex Data Model](docs/CONVEX_DATA_MODEL.md)
- [Auth, Email, And Deployment Plan](docs/AUTH_EMAIL_DEPLOYMENT_PLAN.md)

## Source Context

This project is based on:

- `/Users/edward/code/project-templates/PROJECT_FOUNDATION_PLAYBOOK.md`
- `/Users/edward/incorporation`

## App Scaffold

The repository now includes the first implementation pass:

- `apps/web`: Next.js App Router scaffold with public pages, auth placeholders, dashboard routes, and admin placeholders.
- `packages/shared`: Shared site metadata and navigation config.
- `convex`: Reserved backend directory for the upcoming Convex schema and functions.
- Root workspace files for `pnpm`, Turbo, and TypeScript.

## Current Status

Phase 1 scaffold is in progress:

- Public marketing pages are implemented.
- Dashboard and admin shells are implemented.
- Auth, Convex data, rule engine logic, and document generation are still pending.

## Local Setup

1. Install dependencies with `pnpm install`.
2. Run `npx convex dev --once` once to create the local Convex deployment config if `.env.local` does not exist yet.
3. Start both services with `pnpm dev`.
4. Open the Next.js app from the local URL shown in the terminal.

## Email Testing

For the current Resend sandbox-style setup, FounderFile defaults to:

- `RESEND_FROM_EMAIL=FounderFile <onboarding@resend.dev>`

That lets password reset emails use Resend's testing sender before a custom domain is configured.
