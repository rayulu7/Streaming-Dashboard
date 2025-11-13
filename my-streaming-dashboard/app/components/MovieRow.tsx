"use client";

import Link from "next/link";
import { useMemo } from "react";
import MovieCard from "./MovieCard";
import { MovieSummary } from "@/types/movie";

type MovieRowProps = {
  title: string;
  movies: MovieSummary[];
  href?: string;
};

export default function MovieRow({ title, movies, href }: MovieRowProps) {
  if (movies.length === 0) {
    return null;
  }

  const sliderId = useMemo(
    () =>
      `slider-${title
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-_]/g, "")}`,
    [title],
  );

  return (
    <section aria-labelledby={sliderId} className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 id={sliderId} className="text-2xl font-semibold">
          {title}
        </h2>
        <Link
          href={href ?? "/movies"}
          className="text-sm text-neutral-400 transition hover:text-white focus-visible:text-white"
        >
          View all
        </Link>
      </div>

      <div className="no-scrollbar flex gap-4 overflow-x-auto pb-2">
        {movies.map((movie) => (
          <div
            key={movie.id}
            className="min-w-[160px] max-w-[200px] shrink-0 scroll-mr-4"
          >
            <MovieCard movie={movie} />
          </div>
        ))}
      </div>
    </section>
  );
}

