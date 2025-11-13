import { cache } from "react";
import { MovieDetail, MovieSummary } from "@/types/movie";

const TMDB_API_BASE_URL = "https://api.themoviedb.org/3";
const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p";

type SearchParams = Record<string, string | number | boolean | undefined>;

type TMDBMovieListResponse = {
  results: TMDBMovie[];
};

type TMDBMovie = {
  id: number;
  title?: string;
  name?: string;
  overview?: string;
  poster_path?: string | null;
  backdrop_path?: string | null;
  release_date?: string | null;
  first_air_date?: string | null;
  genre_ids?: number[];
  genres?: Array<{ id: number; name: string }>;
  vote_average?: number;
};

type TMDBMovieDetail = TMDBMovie & {
  runtime?: number | null;
  homepage?: string | null;
  status?: string | null;
  tagline?: string | null;
  spoken_languages?: Array<{ english_name?: string; name?: string }>;
  production_countries?: Array<{ name: string }>;
};

type TMDBGenreResponse = {
  genres: Array<{
    id: number;
    name: string;
  }>;
};

export type MovieCategory =
  | "trending"
  | "popular"
  | "top_rated"
  | "now_playing"
  | "upcoming";

const categoryEndpoints: Record<MovieCategory, string> = {
  trending: "trending/movie/week",
  popular: "movie/popular",
  top_rated: "movie/top_rated",
  now_playing: "movie/now_playing",
  upcoming: "movie/upcoming",
};

function getApiKey(): string {
  const apiKey = process.env.TMDB_API_KEY;
  if (!apiKey) {
    throw new Error(
      "TMDB_API_KEY environment variable is not set. Add it to your .env.local file.",
    );
  }
  return apiKey;
}

function buildImageUrl(
  path: string | null | undefined,
  size: "w342" | "w500" | "w780" | "w1280" | "original" = "w500",
): string | null {
  if (!path) {
    return null;
  }
  return `${TMDB_IMAGE_BASE_URL}/${size}${path}`;
}

async function fetchFromTMDB<T>(
  endpoint: string,
  params: SearchParams = {},
): Promise<T> {
  const url = new URL(`${TMDB_API_BASE_URL}/${endpoint}`);
  const apiKey = getApiKey();

  url.searchParams.set("api_key", apiKey);
  if (!endpoint.startsWith("trending")) {
    url.searchParams.set("language", "en-US");
    url.searchParams.set("include_adult", "false");
  }

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      url.searchParams.set(key, String(value));
    }
  });

  const response = await fetch(url.toString(), {
    headers: {
      "Content-Type": "application/json",
    },
    next: {
      revalidate: 60,
    },
  });

  if (!response.ok) {
    throw new Error(
      `TMDB request failed: ${response.status} ${response.statusText}`,
    );
  }

  return (await response.json()) as T;
}

const getGenreDictionary = cache(async () => {
  const data = await fetchFromTMDB<TMDBGenreResponse>("genre/movie/list");
  return data.genres.reduce<Record<number, string>>((acc, genre) => {
    acc[genre.id] = genre.name;
    return acc;
  }, {});
});

function toMovieSummary(
  movie: TMDBMovie,
  genreDictionary: Record<number, string>,
): MovieSummary {
  const genreIds =
    movie.genre_ids ??
    (Array.isArray(movie.genres) ? movie.genres.map((genre) => genre.id) : []) ??
    [];

  const genreNamesFromIds = genreIds
    .map((genreId) => genreDictionary[genreId])
    .filter((name): name is string => Boolean(name));

  const fallbackGenreNames = Array.isArray(movie.genres)
    ? movie.genres.map((genre) => genre.name).filter(Boolean)
    : [];

  const genreNames =
    genreNamesFromIds.length > 0 ? genreNamesFromIds : fallbackGenreNames;

  return {
    id: movie.id,
    title: movie.title ?? movie.name ?? "Untitled",
    overview: movie.overview ?? "",
    posterUrl: buildImageUrl(movie.poster_path, "w500"),
    backdropUrl: buildImageUrl(movie.backdrop_path, "w1280"),
    releaseDate: movie.release_date ?? movie.first_air_date ?? null,
    voteAverage: movie.vote_average ?? 0,
    genreIds,
    genreNames,
  };
}

export const getMoviesByCategory = cache(
  async (category: MovieCategory): Promise<MovieSummary[]> => {
    const endpoint = categoryEndpoints[category];
    const genreDictionary = await getGenreDictionary();
    const data = await fetchFromTMDB<TMDBMovieListResponse>(endpoint);
    return data.results
      .filter((movie) => movie.poster_path)
      .map((movie) => toMovieSummary(movie, genreDictionary));
  },
);

export const getMovieDetail = cache(
  async (movieId: string): Promise<MovieDetail> => {
    const genreDictionary = await getGenreDictionary();
    const data = await fetchFromTMDB<TMDBMovieDetail>(`movie/${movieId}`, {
      append_to_response: "videos,images,credits",
    });

    const summary = toMovieSummary(data, genreDictionary);

    return {
      ...summary,
      tagline: data.tagline ?? null,
      runtime: data.runtime ?? null,
      status: data.status ?? null,
      homepage: data.homepage ?? null,
      spokenLanguages:
        data.spoken_languages
          ?.map((language) => language.english_name ?? language.name)
          .filter((value): value is string => Boolean(value)) ?? [],
      productionCountries:
        data.production_countries?.map((country) => country.name) ?? [],
    };
  },
);

export const getMovieRecommendations = cache(
  async (movieId: string): Promise<MovieSummary[]> => {
    const genreDictionary = await getGenreDictionary();
    const data = await fetchFromTMDB<TMDBMovieListResponse>(
      `movie/${movieId}/recommendations`,
    );
    return data.results
      .filter((movie) => movie.poster_path)
      .map((movie) => toMovieSummary(movie, genreDictionary));
  },
);

