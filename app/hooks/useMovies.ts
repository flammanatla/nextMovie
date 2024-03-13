import { useState, useEffect } from "react";

import { API_URL, API_KEY, MINIMAL_QUERY_LENGTH } from "../utils/config";
import { keyLowering } from "../utils/helpers";

export function useMovies(query, currentPage) {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [totalSearchResults, setTotalSearchResults] = useState(null);

  //to do: rewrite as an eventListener since we don't need to do data fetching on the mount anymore
  useEffect(
    function () {
      const controller = new AbortController();

      async function fetchMovies() {
        try {
          setIsLoading(true);
          setError("");
          const res = await fetch(
            `${API_URL}?apikey=${API_KEY}&s=${query}&page=${currentPage}`,
            {
              signal: controller.signal,
            }
          );

          if (!res.ok) {
            throw new Error("Something went wrong with fetching movies data");
          }

          const data = await res.json();

          if (data.Response === "False") {
            throw new Error(
              "Movie not found. Search query length should be minimum 3 symbols."
            );
          }
          const mappedSearch = data.Search.map((searchItem) =>
            keyLowering(searchItem)
          );

          setMovies(mappedSearch);
          setTotalSearchResults(data.totalResults);
          setError("");
        } catch (err) {
          if (err.name !== "AbortError") {
            console.log(err);
            setError(err.message);
            setTotalSearchResults("");
          }
        } finally {
          setIsLoading(false);
        }
      }

      if (query.length < MINIMAL_QUERY_LENGTH) {
        setMovies([]);
        setError("");
        setTotalSearchResults("");
        return;
      }

      //handleCloseMovie();
      fetchMovies();

      return function () {
        controller.abort();
      };
    },
    [query, currentPage]
  );

  return { movies, isLoading, error, totalSearchResults };
}
