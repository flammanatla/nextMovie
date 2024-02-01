"use client";

import { useRef, useState } from "react";

import {
  faStar as faStarSolid,
  faBookmark as faBookmarkSolid,
} from "@fortawesome/free-solid-svg-icons";
import { faStar, faBookmark } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { useKey } from "./hooks/useKey.js";
import { useMovies } from "./hooks/useMovies.js";
import { useLocalStorageState } from "./hooks/useLocalStorageState.js";
import useMediaQuery from "./hooks/useMediaQuery.js";

import { NoSsr } from "./components/NoSsr.jsx";
import MovieDetailsView from "./components/MovieDetailsView.jsx";
import Loader from "./components/Loader.jsx";
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

  function handleSelectMovie(id) {
    setSelectedId((selectedId) => (id === selectedId ? null : id));
    if (!isLargeScreen) {
      setPreviousPanelOpened(panelOpened);

      setPanelOpened({ watchlisted: false, rated: false });
    }
  }

  function handleCloseMovie() {
    console.log("previousPanelOpened after closing movie", previousPanelOpened);
    setSelectedId(null);
    // if (!isLargeScreen) {
    //   setPanelOpened({ watchlisted: false, rated: false });
    // } else {
    //   setPanelOpened({ watchlisted: true, rated: false });
    // }
    if (!isLargeScreen) {
      setPanelOpened(previousPanelOpened);
    }
  }

  function handleNavBtn(type) {
    if (type === "Ratings") {
      setSelectedId(null);
      setPanelOpened({ watchlisted: false, rated: true });

      setQuery("");
    }

    if (type === "Watchlist") {
      setSelectedId(null);
      setPanelOpened({ watchlisted: true, rated: false });

      setQuery("");
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

  const isMobileScreen = useMediaQuery("(max-width: 500px)");
  const isMediumScreen = useMediaQuery("(max-width: 960px)") && !isMobileScreen; //isSmall
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

  //console.log({ isLargeScreen, isMediumScreen, isMobileScreen });

  return (
    <NoSsr>
      <NavBar>
        <Logo isMobileScreen={isMobileScreen} />
        <Search
          isShrinked={!isLargeScreen}
          query={query}
          setQuery={(query) => {
            setQuery(query);
            setPanelOpened({ watchlisted: !query, rated: false });
            if (!isLargeScreen) {
              setSelectedId(null);
            }
          }}
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
      </NavBar>

      <Main>
        {showSearchResults && (
          <Box>
            {isLoading && <Loader />}
            {error && <ErrorMessage message={error} />}
            {!isLoading && !error && (
              <MoviesList
                movies={movies}
                onSelectMovie={handleSelectMovie}
                isSearchResult={true}
              />
            )}
          </Box>
        )}
        {showWatchlist && (
          <Box>
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
          </Box>
        )}
        {showRatingsList && (
          <Box>
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
          </Box>
        )}
        {showMovieDetails && (
          <Box>
            <MovieDetailsView
              // panelOpened={previousPanelOpened}
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
          </Box>
        )}
        {showMovieDetailsPlaceholder && <Box />}
      </Main>
    </NoSsr>
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

function NavBar({ children }) {
  return <nav className="nav-bar">{children}</nav>;
}

function NavBtn({ icon, isActive, onNavBar, name }) {
  return (
    <button className="nav-bar__btn" onClick={() => onNavBar(name)}>
      <FontAwesomeIcon
        className={"btn__icon " + (isActive ? "btn__icon--active" : "")}
        icon={icon}
      />
      <span className={"btn__label " + (isActive ? "btn__label--active" : "")}>
        {name}
      </span>
    </button>
  );
}

//https://flammanatla.github.io/portfolio/cinesearch/dist/?q=harry
function Search({ query, setQuery, isShrinked }) {
  const inputEl = useRef(null);

  useKey("Enter", function () {
    if (document.activeElement === inputEl.current) {
      return;
    }

    inputEl.current.focus();
    setQuery("");
  });

  return (
    <input
      className="search"
      type="text"
      placeholder={
        isShrinked ? "search here..." : "search over 300 000 movies..."
      }
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      ref={inputEl}
      id="search-input"
    />
  );
}

function Main({ children }) {
  return <main className="main">{children}</main>;
}

function Box({ children }) {
  return <div className="box">{children}</div>;
}
