# My Streaming Dashboard

A streamlined Netflix/Hulu style dashboard built with Next.js 14 App Router, TypeScript, and Tailwind CSS. The app fetches real-time catalog data from The Movie Database (TMDB) and renders a hero banner, horizontal content rows, and dynamic movie detail pages.

## Quick Start

1. **Install dependencies**
   ```bash
   npm install
   # or
   pnpm install
   # or
   yarn install
   ```

2. **Configure environment variables**
   - Copy `env.example` to `.env.local`
   - Set `TMDB_API_KEY` to a valid TMDB API key
   - Never commit `.env.local`

3. **Run the development server**
   ```bash
   npm run dev
   ```
   Open http://localhost:3000 to explore the dashboard.

4. **Lint & build**
   ```bash
   npm run lint
   npm run build
   npm run start
   ```

## Project Structure

- `app/` – App Router routes and shared layout
  - `components/` – UI building blocks (`Header`, `HeroBanner`, `MovieRow`, `MovieCard`)
  - `movie/[id]/` – Dynamic movie detail route (server component)
- `lib/` – TMDB data fetching utilities (`tmdb.ts`)
- `types/` – Shared TypeScript interfaces
- `public/` – Static assets (add a `favicon.ico` or custom artwork here)
- `env.example` – Sample environment configuration

## Data Layer

All catalog queries are executed server-side via native `fetch()` in `lib/tmdb.ts`. Results are mapped into typed DTOs (`MovieSummary`, `MovieDetail`) before reaching client components. Responses are revalidated every 60 seconds to keep the homepage fresh without hammering the API.

Supported lists:

- Trending this week
- Now playing
- Top rated
- Coming soon (upcoming)
- Per-movie recommendations (detail route)

## Deployment (Vercel)

1. Push this project to a GitHub repository.
2. Create a new Vercel project and import the repo.
3. Add `TMDB_API_KEY` in Vercel → Settings → Environment Variables.
4. Trigger a production build. Next.js will statically optimize pages with on-demand revalidation for TMDB calls.

## Tooling

- Next.js 14 App Router
- React 18 server and client components
- Tailwind CSS for utility-first styling
- TypeScript with path aliases (`@/*`)

## Next Steps

- Replace static headers/buttons with authenticated flows.
- Add caching or edge functions if rate limits become a concern.
- Expand `/movies`, `/series`, and `/my-list` with full filtering and persistence.
- Integrate watch providers (`/movie/{id}/watch/providers`) from TMDB.

Happy streaming!

