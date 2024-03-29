import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import {
  MovieListProps,
  MoviePreviewProps,
  MoviesSummaryProps,
} from "./Movie.types";

export function MoviesList({
  movies,
  onSelectMovie,
  isSearchResult,
  onDeleteWatchlisted,
  isRemovable = false,
  isUsrRatingVisible = false,
}: MovieListProps): JSX.Element {
  return (
    <ul className="list list-movies">
      {movies.map((movie) => (
        <MoviePreview
          movie={movie}
          key={movie.imdbID}
          onDeleteWatchlisted={onDeleteWatchlisted}
          isRemovable={isRemovable}
          isUsrRatingVisible={isUsrRatingVisible}
          onSelectMovie={onSelectMovie}
          isSearchResult={isSearchResult}
        />
      ))}
    </ul>
  );
}

export function MoviePreview({
  movie,
  onDeleteWatchlisted,
  isRemovable,
  isUsrRatingVisible,
  onSelectMovie,
  isSearchResult,
}: MoviePreviewProps): JSX.Element {
  return (
    <li className="movie" onClick={() => onSelectMovie(movie.imdbID)}>
      <a className="movie__link" href={"#" + movie.imdbID}>
        <img
          className="movie__poster"
          src={movie.poster}
          alt={`${movie.title} poster`}
        />
        <div className="movie__info">
          <h3 className="title">{movie.title}</h3>
          <div>
            <p>{movie.year}</p>
            <p className="text text--darker">{movie.type}</p>
            {isSearchResult === false && "imdbRating" in movie && (
              <p className="text text--darker">
                Imdb Rating: {Number(movie.imdbRating)}
              </p>
            )}
          </div>
        </div>
        <div>
          {isUsrRatingVisible && "userRating" in movie && (
            <button className="user-rating">{movie.userRating}</button>
          )}
          {isRemovable && onDeleteWatchlisted && (
            <button
              className="btn-delete"
              onClick={(e) => {
                onDeleteWatchlisted(movie.imdbID);
                e.stopPropagation();
              }}
            >
              <FontAwesomeIcon icon={faTrash} />
            </button>
          )}
        </div>
      </a>
    </li>
  );
}

export function MoviesSummary({
  title,
  numMovies,
  isUsrRatingVisible,
}: MoviesSummaryProps): JSX.Element {
  return (
    <div className="summary">
      <h2>
        {title} ({numMovies})
      </h2>
      <p>{isUsrRatingVisible && "Your Rating"}</p>
    </div>
  );
}
