import { useEffect } from "react";

import { useKey } from "../hooks/useKey";
import { useMovieDetails } from "../hooks/useMovieDetails";

import StarRating from "./StarRating";
import Loader from "./Loader";

import { ListedMovie, MovieDetailsViewProps } from "./Movie.types";

export default function MovieDetailsView({
  selectedId,
  onCloseMovie,
  onAddWatchlisted,
  onDeleteWatchlisted,
  onAddRated,
  watchlisted,
  rated,
  isLargeScreen,
  isMobileScreen,
}: MovieDetailsViewProps): JSX.Element {
  const { movie, isLoading } = useMovieDetails(selectedId);

  const isWatchlisted = watchlisted
    .map((movie: ListedMovie) => movie.imdbID)
    .includes(selectedId);

  const isRated = rated
    .map((movie: ListedMovie) => movie.imdbID)
    .includes(selectedId);

  const watchedUserRating = rated.find(
    (movie: ListedMovie) => movie.imdbID === selectedId
  )?.userRating;

  useKey("Escape", onCloseMovie);

  useEffect(
    function () {
      if (!movie?.title) return;
      document.title = `Movie | ${title}`;

      return function () {
        document.title = "nextMovie";
      };
    },
    [movie?.title]
  );

  // adding movie to the condition, because in dev mode MovieDeatilsView is rendered twice
  // and fetching data is aborted after first fetch
  if (isLoading || !movie) {
    return <Loader />;
  }

  const {
    title,
    poster,
    year,
    country,
    runtime,
    imdbRating,
    plot,
    actors,
    director,
    writer,
    genre,
    type,
    awards,
    ratings,
  } = movie;

  function handleAddRating(rating: number) {
    const newRatedMovie: ListedMovie = {
      imdbID: selectedId,
      title,
      year,
      poster,
      type,
      ratings,
      imdbRating: Number(imdbRating),
      runtime: Number(runtime.split(" ").at(0)),
      userRating: rating,
    };

    onAddRated(newRatedMovie);
  }

  function handleAddToWatchlist() {
    const newWatchlistedMovie: ListedMovie = {
      imdbID: selectedId,
      title,
      year,
      poster,
      ratings,
      type,
      imdbRating: Number(imdbRating),
      runtime: Number(runtime.split(" ").at(0)),
    };

    onAddWatchlisted(newWatchlistedMovie);
  }

  function handleRemoveFromWatchlist() {
    onDeleteWatchlisted(selectedId);
  }

  return (
    <div className="details">
      {!isLargeScreen && (
        <button className="btn-back" onClick={onCloseMovie}>
          &larr;
        </button>
      )}
      <img src={poster} alt={`Poster of ${title} movie`} />
      <section className="overview">
        <div className="overview__info">
          <h2>{title}</h2>
          <p>{year}</p>
          <p className="labels">
            {genre.split(",").map((label) => (
              <label className="label" key={label}>
                {label.toLowerCase()}
              </label>
            ))}
          </p>
          <ul>
            <li key="Runtime">Runtime: {runtime}</li>
            <li key="Writer">Writer: {writer}</li>
            <li key="Director">Director: {director}</li>
            <li key="Actors">Stars: {actors}</li>
            <li key="Country">Country: {country}</li>
          </ul>
        </div>

        <div>
          <h3>PLOT</h3>
          <p>{plot}</p>
        </div>

        <div className="overview__rating">
          <StarRating
            maxRating={10}
            size={20}
            onSetRating={handleAddRating}
            defaultRating={isRated ? watchedUserRating : 0}
            onAddWatchlisted={handleAddToWatchlist}
            onDeleteWatchlisted={handleRemoveFromWatchlist}
            isWatchlisted={isWatchlisted}
            isShrinked={isMobileScreen}
          />
        </div>
        <div className="awards">
          <h3>AWARDS</h3>
          <p>{awards}</p>
          <div className="labels">
            {movie.ratings
              .map((rating) => {
                if (rating.Source.includes("Internet Movie Database")) {
                  return `IMDB: ${rating.Value}`;
                } else if (rating.Source.includes("Rotten")) {
                  return `Rotten Tomatoes: ${rating.Value}`;
                } else if (rating.Source.includes("Metacritic")) {
                  return `Metacritic: ${rating.Value}`;
                } else {
                  return ``;
                }
              })
              .map((parsedRating) => (
                <label className="label" key={parsedRating}>
                  {parsedRating}
                </label>
              ))}
          </div>
        </div>
      </section>
    </div>
  );
}
