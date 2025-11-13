export interface MovieSummary {
  id: number;
  title: string;
  overview: string;
  posterUrl: string | null;
  backdropUrl: string | null;
  releaseDate: string | null;
  voteAverage: number;
  genreIds: number[];
  genreNames: string[];
}

export interface MovieDetail extends MovieSummary {
  tagline: string | null;
  runtime: number | null;
  status: string | null;
  homepage: string | null;
  spokenLanguages: string[];
  productionCountries: string[];
}

