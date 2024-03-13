"use client";

import { useEffect, useState } from "react";

import {
  faStar as faStarSolid,
  faBookmark as faBookmarkSolid,
} from "@fortawesome/free-solid-svg-icons";
import { faStar, faBookmark } from "@fortawesome/free-regular-svg-icons";

import { useMovies } from "./hooks/useMovies";
import { useLocalStorageState } from "./hooks/useLocalStorageState";
import { useMediaQuery } from "./hooks/useMediaQuery";
import { useURLParams } from "./hooks/useURLParams";
import { useSelectedId } from "./hooks/useSelectedId";
import { useDebouncer } from "./hooks/useDebouncer";

import Loader from "./components/Loader";
import Search from "./components/Search";
import NavBtn from "./components/NavBtn";
import PaginationBtns from "./components/PaginationBtns";
import MovieDetailsView from "./components/MovieDetailsView";
import { MoviesList, MoviesSummary } from "./components/MoviesList";

import { MINIMAL_QUERY_LENGTH } from "./utils/config";

export default function Home() {
  const [query, setQuery] = useURLParams("search", "");
  const debouncedQuery = useDebouncer(query);
  const [currentPage, setCurrentPage] = useURLParams("page", null);
  const [selectedId, setSelectedId] = useSelectedId();
  const { movies, isLoading, error, totalSearchResults } = useMovies(
    debouncedQuery,
    currentPage
  );
  const [watchlisted, setWatchlisted] = useLocalStorageState("watchlisted", []);
  const [rated, setRated] = useLocalStorageState("rated", []);

  type panelOpenedTypes = {
    watchlisted: boolean;
    rated: boolean;
  };

  const [panelOpened, setPanelOpened] = useState<panelOpenedTypes>({
    watchlisted: true,
    rated: false,
  });

  // if user open application using link like /?search=harry&page=1,
  // both panels should be closed
  useEffect(() => {
    const initialSearchQuery =
      new URLSearchParams(window.location.search).get("search") || "";
    setPanelOpened({ watchlisted: !initialSearchQuery, rated: false });
  }, []);

  const [previousPanelOpened, setPreviousPanelOpened] = useState({});

  function handleQuery(newQuery) {
    // watchlisted is a default opened panel,
    // therefore we unselect it when query is entered, and select it back when query is emptied
    setPanelOpened({ watchlisted: !newQuery, rated: false });

    setQuery(newQuery);
    setCurrentPage(newQuery.length < MINIMAL_QUERY_LENGTH ? null : 1);

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
    setCurrentPage(null);

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
  //const isMediumScreen = useMediaQuery("(max-width: 960px)") && !isMobileScreen;
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
            <PaginationBtns
              totalSearchResults={totalSearchResults}
              currentPage={Number(currentPage)}
              onPageNavigation={(nextPage) => setCurrentPage(nextPage)}
              isLoading={isLoading}
            />
          </div>
        )}
        {showWatchlist && (
          <div className="box">
            <MoviesSummary
              title={"Watchlisted Movies"}
              numMovies={watchlisted.length}
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
              numMovies={rated.length}
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
              isMobileScreen={isMobileScreen}
            />
            <div className="copyright">
              &copy; Copyright by
              <a href="https://www.linkedin.com/in/nataliia-moroz-11391135/">
                Nataliia Moroz
              </a>
            </div>
          </div>
        )}
        {showMovieDetailsPlaceholder && <div className="box" />}
      </main>
    </>
  );
}

const ErrorMessage = ({ message }: { message: string }): JSX.Element => {
  return (
    <p className="error">
      <span style={{ marginRight: "15px" }}>❌</span>
      {message}
    </p>
  );
};

const Logo = ({ isMobileScreen }: { isMobileScreen: boolean }): JSX.Element => {
  const svgPath =
    "img/nextMovie_logo" + (isMobileScreen ? "_mob" : "") + ".svg";

  return (
    <a href="/" id="logo-link">
      <img src={svgPath} alt="Logo" className="header__logo" />
    </a>
  );
};
