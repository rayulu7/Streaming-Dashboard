import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import MovieRow from "@/app/components/MovieRow";
import {
  getMovieDetail,
  getMovieRecommendations,
  getMoviesByCategory,
} from "@/lib/tmdb";

type MovieDetailPageProps = {
  params: {
    id: string;
  };
};

export async function generateMetadata({
  params,
}: MovieDetailPageProps): Promise<Metadata> {
  try {
    const movie = await getMovieDetail(params.id);
    return {
      title: `${movie.title} | My Streaming Dashboard`,
      description: movie.overview || movie.tagline || undefined,
    };
  } catch {
    return {
      title: "Movie not found | My Streaming Dashboard",
    };
  }
}

function formatRuntime(runtime: number | null): string | null {
  if (!runtime) return null;
  const hours = Math.floor(runtime / 60);
  const minutes = runtime % 60;
  if (hours === 0) return `${minutes}m`;
  if (minutes === 0) return `${hours}h`;
  return `${hours}h ${minutes}m`;
}

export default async function MovieDetailPage({
  params,
}: MovieDetailPageProps) {
  const movie = await getMovieDetail(params.id).catch(() => null);

  if (!movie) {
    notFound();
  }

  const [recommendations, trending] = await Promise.all([
    getMovieRecommendations(params.id),
    getMoviesByCategory("trending"),
  ]);

  const releaseDate = movie.releaseDate
    ? new Date(movie.releaseDate).toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : null;

  return (
    <article className="mx-auto flex max-w-6xl flex-col gap-12 px-6 pb-16 md:px-12">
      <Link
        href="/"
        className="text-sm text-neutral-400 transition hover:text-white"
      >
        ← Back to dashboard
      </Link>

      <div className="grid gap-10 lg:grid-cols-[2fr,1fr]">
        <div className="space-y-6">
          <div className="relative aspect-video overflow-hidden rounded-3xl border border-white/10 bg-neutral-900">
            {movie.backdropUrl ? (
              <Image
                src={movie.backdropUrl}
                alt={`${movie.title} backdrop`}
                fill
                sizes="(max-width: 1024px) 100vw, 60vw"
                className="object-cover"
                priority
              />
            ) : (
              <div className="flex h-full items-center justify-center bg-neutral-800 text-neutral-400">
                No backdrop available
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/40 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 space-y-3">
              <h1 className="text-4xl font-bold md:text-5xl">{movie.title}</h1>
              {movie.tagline && (
                <p className="text-lg italic text-neutral-300">
                  “{movie.tagline}”
                </p>
              )}
            </div>
          </div>

          <div className="grid gap-8 rounded-3xl border border-white/10 bg-white/5 p-8 shadow-lg lg:grid-cols-[2fr,1fr]">
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold">Overview</h2>
              <p className="leading-relaxed text-neutral-200">
                {movie.overview || "No synopsis available yet for this title."}
              </p>

              <div className="flex flex-wrap gap-3 text-sm text-neutral-200">
                {releaseDate && (
                  <span className="rounded-full border border-white/20 px-3 py-1">
                    Released {releaseDate}
                  </span>
                )}
                {movie.runtime && (
                  <span className="rounded-full border border-white/20 px-3 py-1">
                    Runtime {formatRuntime(movie.runtime)}
                  </span>
                )}
                <span className="rounded-full border border-white/20 px-3 py-1">
                  Rating {movie.voteAverage.toFixed(1)}/10
                </span>
              </div>
            </div>

            <div className="space-y-3 text-sm text-neutral-200">
              <div>
                <p className="font-semibold uppercase tracking-[0.25em] text-neutral-400">
                  Genres
                </p>
                <p>{movie.genreNames.join(", ") || "TBA"}</p>
              </div>
              <div>
                <p className="font-semibold uppercase tracking-[0.25em] text-neutral-400">
                  Spoken languages
                </p>
                <p>{movie.spokenLanguages.join(", ") || "TBA"}</p>
              </div>
              <div>
                <p className="font-semibold uppercase tracking-[0.25em] text-neutral-400">
                  Production countries
                </p>
                <p>{movie.productionCountries.join(", ") || "TBA"}</p>
              </div>
              {movie.status && (
                <div>
                  <p className="font-semibold uppercase tracking-[0.25em] text-neutral-400">
                    Status
                  </p>
                  <p>{movie.status}</p>
                </div>
              )}
              {movie.homepage && (
                <div>
                  <p className="font-semibold uppercase tracking-[0.25em] text-neutral-400">
                    Official site
                  </p>
                  <Link
                    href={movie.homepage}
                    className="text-amber-300 hover:text-amber-200"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Visit site →
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        <aside className="space-y-6">
          <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-6">
            <h2 className="text-xl font-semibold">Poster</h2>
            <div className="mt-4">
              {movie.posterUrl ? (
                <Image
                  src={movie.posterUrl}
                  alt={`${movie.title} poster`}
                  width={400}
                  height={600}
                  className="w-full rounded-2xl border border-white/10 object-cover"
                  priority
                />
              ) : (
                <div className="flex aspect-[2/3] items-center justify-center rounded-2xl border border-dashed border-white/20 text-neutral-400">
                  Poster unavailable
                </div>
              )}
            </div>
          </div>

          <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-6">
            <h2 className="text-xl font-semibold">Trending now</h2>
            <ul className="mt-4 space-y-2 text-sm text-neutral-300">
              {trending.slice(0, 6).map((entry) => (
                <li key={entry.id}>
                  <Link
                    href={`/movie/${entry.id}`}
                    className="transition hover:text-white hover:underline"
                  >
                    {entry.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>

      {recommendations.length > 0 && (
        <div className="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-lg">
          <MovieRow title="Recommended for you" movies={recommendations} />
        </div>
      )}
    </article>
  );
}

