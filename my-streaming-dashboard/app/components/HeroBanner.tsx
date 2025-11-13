import Image from "next/image";
import { MovieSummary } from "@/types/movie";
import MovieCard from "./MovieCard";

type HeroBannerProps = {
  movie: MovieSummary | null;
};

export default function HeroBanner({ movie }: HeroBannerProps) {
  if (!movie) {
    return (
      <section className="relative isolate px-6 py-20 text-center lg:px-8">
        <div className="mx-auto max-w-3xl space-y-6">
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
            Discover your next favorite show.
          </h1>
          <p className="text-lg leading-7 text-neutral-300">
            Curated picks from across streaming platforms, tailored to your
            taste. Explore trending titles, exclusive releases, and hidden gems.
          </p>
        </div>
      </section>
    );
  }

  const releaseYear = movie.releaseDate
    ? new Date(movie.releaseDate).getFullYear()
    : null;

  return (
    <section className="relative isolate overflow-hidden rounded-3xl border border-white/10 bg-neutral-900/40 px-6 py-20 shadow-2xl md:mx-12 md:px-16">
      {movie.backdropUrl && (
        <div className="absolute inset-0 -z-10">
          <Image
            src={movie.backdropUrl}
            alt={`${movie.title} backdrop`}
            fill
            priority
            className="object-cover opacity-60"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-neutral-950 via-neutral-950/70 to-transparent" />
        </div>
      )}

      <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-[2fr,1fr]">
        <div className="space-y-6">
          <p className="text-sm uppercase tracking-[0.4em] text-amber-400">
            Spotlight
          </p>
          <h1 className="text-5xl font-bold leading-tight text-white sm:text-6xl">
            {movie.title}
          </h1>
          <p className="max-w-3xl text-lg text-neutral-200">
            {movie.overview || "No overview available for this title just yet."}
          </p>
          <div className="flex flex-wrap gap-3 text-sm text-neutral-200">
            {releaseYear && (
              <span className="rounded-full border border-neutral-700/70 px-3 py-1">
                {releaseYear}
              </span>
            )}
            <span className="rounded-full border border-neutral-700/70 px-3 py-1">
              Rating {movie.voteAverage.toFixed(1)}/10
            </span>
            {movie.genreNames.slice(0, 3).map((pill) => (
              <span
                key={pill}
                className="rounded-full border border-neutral-700/70 px-3 py-1"
              >
                {pill}
              </span>
            ))}
          </div>
          <div className="flex flex-wrap gap-4">
            <button className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-black transition hover:bg-neutral-200">
              Watch now
            </button>
            <button className="rounded-full border border-white/30 px-6 py-3 text-sm font-semibold text-white transition hover:border-white/60">
              Add to watchlist
            </button>
          </div>
        </div>

        <div className="mx-auto w-full max-w-sm">
          <MovieCard movie={movie} highlight />
        </div>
      </div>
    </section>
  );
}

