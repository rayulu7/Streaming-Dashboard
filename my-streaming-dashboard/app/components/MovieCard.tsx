"use client";

import Link from "next/link";
import Image from "next/image";
import { MovieSummary } from "@/types/movie";

type MovieCardProps = {
  movie: MovieSummary;
  highlight?: boolean;
};

export default function MovieCard({
  movie,
  highlight = false,
}: MovieCardProps) {
  const releaseYear = movie.releaseDate
    ? new Date(movie.releaseDate).getFullYear()
    : null;

  return (
    <Link
      href={`/movie/${movie.id}`}
      className={`group relative block overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-lg transition focus:outline-none focus-visible:ring-2 focus-visible:ring-white/80 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-900 hover:-translate-y-1 hover:shadow-2xl ${
        highlight ? "p-5" : "p-3"
      }`}
    >
      <div className="relative aspect-[2/3] w-full overflow-hidden rounded-xl bg-neutral-900">
        {movie.posterUrl ? (
          <Image
            src={movie.posterUrl}
            alt={`${movie.title} poster`}
            fill
            sizes="(max-width: 768px) 60vw, (max-width: 1200px) 25vw, 15vw"
            className="object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-neutral-800 text-sm text-neutral-400">
            No artwork
          </div>
        )}
      </div>

      <div className="mt-4 space-y-2">
        <h3 className="text-lg font-semibold leading-tight text-white line-clamp-2">
          {movie.title}
        </h3>
        <p className="text-sm text-neutral-400">
          {releaseYear ?? "TBA"} •{" "}
          {movie.genreNames.slice(0, 2).join(", ") || "Genre TBA"}
        </p>
        <p className="text-xs text-amber-300">
          ⭐ {movie.voteAverage.toFixed(1)}/10
        </p>
      </div>
    </Link>
  );
}

