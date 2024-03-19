export interface Movie {
  imdbID: string;
  title: string;
  poster: string;
  year: string;
  country: string;
  runtime: string;
  imdbRating: string;
  plot: string;
  actors: string;
  director: string;
  writer: string;
  genre: string;
  type: "movie" | "series";
  awards: string;
  ratings: Array<Record<string, string>>;
  userRating: number;
  response: string;
}

export interface ListedMovie {
  imdbID: string;
  imdbRating: number;
  poster: string;
  ratings: Array<Record<string, string>>;
  runtime: number;
  title: string;
  type: "movie" | "series";
  year: string;
  userRating?: number;
}

export interface SearchMovie {
  poster: string;
  title: string;
  type: "movie" | "series";
  year: string;
  imdbID: string;
}

export interface MovieDetailsViewProps {
  selectedId: string;
  onCloseMovie: () => void;
  onAddWatchlisted: (movie: ListedMovie) => void;
  onAddRated: (movie: ListedMovie) => void;
  onDeleteWatchlisted: (id: string) => void;
  watchlisted: ListedMovie[];
  rated: ListedMovie[];
  isLargeScreen: boolean;
  isMobileScreen: boolean;
}

export interface MovieListProps {
  movies: SearchMovie[];
  onSelectMovie: (x: string) => void;
  isSearchResult: boolean;
  onDeleteWatchlisted?: (x: string) => void;
  isRemovable?: boolean;
  isUsrRatingVisible?: boolean;
}

export interface MoviePreviewProps {
  movie: SearchMovie | ListedMovie;
  onDeleteWatchlisted?: (x: string) => void;
  isRemovable: boolean;
  isUsrRatingVisible: boolean;
  onSelectMovie: (x: string) => void;
  isSearchResult: boolean;
}

export interface MoviesSummaryProps {
  title: string;
  numMovies: number;
  isUsrRatingVisible: boolean;
}
