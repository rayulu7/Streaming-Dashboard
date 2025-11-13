import HeroBanner from "./components/HeroBanner";
import MovieRow from "./components/MovieRow";
import { getMoviesByCategory } from "@/lib/tmdb";

export default async function HomePage() {
  const [trending, nowPlaying, topRated, upcoming] = await Promise.all([
    getMoviesByCategory("trending"),
    getMoviesByCategory("now_playing"),
    getMoviesByCategory("top_rated"),
    getMoviesByCategory("upcoming"),
  ]);

  const heroMovie =
    trending[0] ?? nowPlaying[0] ?? topRated[0] ?? upcoming[0] ?? null;

  return (
    <main className="space-y-12 pb-16">
      <HeroBanner movie={heroMovie} />

      <section className="space-y-12 px-6 md:px-12">
        {trending.length > 0 && (
          <MovieRow
            title="Trending This Week"
            movies={trending}
            href="/movies?category=trending"
          />
        )}
        {nowPlaying.length > 0 && (
          <MovieRow
            title="Now Playing"
            movies={nowPlaying}
            href="/movies?category=now-playing"
          />
        )}
        {topRated.length > 0 && (
          <MovieRow
            title="Top Rated"
            movies={topRated}
            href="/movies?category=top-rated"
          />
        )}
        {upcoming.length > 0 && (
          <MovieRow
            title="Coming Soon"
            movies={upcoming}
            href="/movies?category=upcoming"
          />
        )}
      </section>
    </main>
  );
}

