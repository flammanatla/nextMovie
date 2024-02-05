"use client";

import { useState } from "react";

import {
  faStar as faStarSolid,
  faBookmark as faBookmarkSolid,
} from "@fortawesome/free-solid-svg-icons";
import { faStar, faBookmark } from "@fortawesome/free-regular-svg-icons";

import { useMovies } from "./hooks/useMovies.js";
import { useLocalStorageState } from "./hooks/useLocalStorageState.js";
import { useMediaQuery } from "./hooks/useMediaQuery.js";

import { NoSsr } from "./components/NoSsr.jsx";
import Loader from "./components/Loader.jsx";
import Search from "./components/Search.jsx";
import NavBtn from "./components/NavBtn.jsx";
import MovieDetailsView from "./components/MovieDetailsView.jsx";
import { MoviesList, MoviesSummary } from "./components/MoviesList.jsx";

export default function Home() {
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState(null);

  const { movies, isLoading, error } = useMovies(query);
  const [watchlisted, setWatchlisted] = useLocalStorageState([], "watchlisted");
  const [rated, setRated] = useLocalStorageState([], "rated");

  const [panelOpened, setPanelOpened] = useState({
    watchlisted: true,
    rated: false,
  });

  const [previousPanelOpened, setPreviousPanelOpened] = useState({});

  function handleQuery(query) {
    setQuery(query);
    // watchlisted is a default opened panel,
    // therefore we unselect it when query is entered, and select it back when query is emptied
    setPanelOpened({ watchlisted: !query, rated: false });

    if (!isLargeScreen) {
      setSelectedId(null);
    }
  }

  function handleSelectMovie(id) {
    setSelectedId((selectedId) => (id === selectedId ? null : id));

    if (!isLargeScreen) {
      setPreviousPanelOpened(panelOpened);
      setPanelOpened({ watchlisted: false, rated: false });
    }
  }

  function handleCloseMovie() {
    setSelectedId(null);

    if (!isLargeScreen) {
      setPanelOpened(previousPanelOpened);
    }
  }

  function handleNavBtn(type) {
    setSelectedId(null);
    setQuery("");

    if (type === "Ratings") {
      setPanelOpened({ watchlisted: false, rated: true });
    }

    if (type === "Watchlist") {
      setPanelOpened({ watchlisted: true, rated: false });
    }
  }

  function handleAddWatchlisted(movie) {
    setWatchlisted((watchlisted) => [...watchlisted, movie]);
  }

  function handleAddRated(movie) {
    // filter out movie in case if it is already in the list, and add it again
    setRated((rated) => [
      ...rated.filter((ratedMovie) => ratedMovie.imdbID !== movie.imdbID),
      movie,
    ]);
  }

  function handleDeletedWatchlisted(id) {
    setWatchlisted((watchlisted) =>
      watchlisted.filter((movie) => movie.imdbID !== id)
    );
  }

  // warning - if you update these numbers, you should also update them in _mixin.scss
  const isMobileScreen = useMediaQuery("(max-width: 500px)");
  const isMediumScreen = useMediaQuery("(max-width: 960px)") && !isMobileScreen;
  const isLargeScreen = useMediaQuery("(min-width: 960px)");

  const showRatingsList = panelOpened.rated && !query;
  const showWatchlist = panelOpened.watchlisted && !query;
  const showMovieDetails = !!selectedId;
  const showSearchResults =
    !!query &&
    !showRatingsList &&
    !showWatchlist &&
    (!isLargeScreen ? !selectedId : true);
  const showMovieDetailsPlaceholder = isLargeScreen && !showMovieDetails;

  // console.log({ isLargeScreen, isMediumScreen, isMobileScreen });

  return (
    <>
      <nav className="nav-bar">
        <Logo isMobileScreen={isMobileScreen} />
        <Search
          isShrinked={!isLargeScreen}
          query={query}
          setQuery={handleQuery}
        />

        <NavBtn
          name={"Ratings"}
          onNavBar={handleNavBtn}
          isActive={panelOpened.rated}
          icon={rated.length > 0 ? faStarSolid : faStar}
        />

        <NavBtn
          name={"Watchlist"}
          onNavBar={handleNavBtn}
          isActive={panelOpened.watchlisted}
          icon={watchlisted.length > 0 ? faBookmarkSolid : faBookmark}
        />
      </nav>

      <main className="main">
        {showSearchResults && (
          <div className="box">
            {isLoading && <Loader />}
            {error && <ErrorMessage message={error} />}
            {!isLoading && !error && (
              <MoviesList
                movies={movies}
                onSelectMovie={handleSelectMovie}
                isSearchResult={true}
              />
            )}
          </div>
        )}
        {showWatchlist && (
          <div className="box">
            <MoviesSummary
              title={"Watchlisted Movies"}
              movies={watchlisted}
              isUsrRatingVisible={false}
            />
            <MoviesList
              movies={watchlisted}
              onDeleteWatchlisted={handleDeletedWatchlisted}
              onSelectMovie={handleSelectMovie}
              isRemovable={true}
              isUsrRatingVisible={false}
            />
          </div>
        )}
        {showRatingsList && (
          <div className="box">
            <MoviesSummary
              title={"Rated Movies"}
              movies={rated}
              isUsrRatingVisible={true}
            />
            <MoviesList
              movies={rated}
              onSelectMovie={handleSelectMovie}
              isRemovable={false}
              isUsrRatingVisible={true}
            />
          </div>
        )}
        {showMovieDetails && (
          <div className="box">
            <MovieDetailsView
              selectedId={selectedId}
              onCloseMovie={handleCloseMovie}
              onAddWatchlisted={handleAddWatchlisted}
              onDeleteWatchlisted={handleDeletedWatchlisted}
              onAddRated={handleAddRated}
              watchlisted={watchlisted}
              rated={rated}
              isLargeScreen={isLargeScreen}
              isMediumScreen={isMediumScreen}
              isMobileScreen={isMobileScreen}
            />
          </div>
        )}
        {showMovieDetailsPlaceholder && <div className="box" />}
      </main>
    </>
  );
}

function ErrorMessage({ message }) {
  return (
    <p className="error">
      <span style={{ marginRight: "15px" }}>❌</span>
      {message}
    </p>
  );
}

function Logo({ isMobileScreen }) {
  const svgPath =
    "img/nextMovie_logo" + (isMobileScreen ? "_mob" : "") + ".svg";

  return (
    <a href="/" id="logo-link">
      <img src={svgPath} alt="Logo" className="header__logo" />
    </a>
  );
}
