import { useState, useEffect } from "react";

import { API_URL, API_KEY } from "../utils/config.js";
import { keyLowering } from "../utils/helpers.js";

export function useMovies(query) {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  //to do: rewrite as an eventListener since we don't need to do data fetching on the mount anymore
  useEffect(
    function () {
      const controller = new AbortController();

      async function fetchMovies() {
        try {
          setIsLoading(true);
          setError("");
          const res = await fetch(`${API_URL}?apikey=${API_KEY}&s=${query}`, {
            signal: controller.signal,
          });

          if (!res.ok) {
            throw new Error("Something went wrong with fetching movies data");
          }

          const data = await res.json();

          if (data.Response === "False") {
            throw new Error("Movie not found");
          }
          const mappedSearch = data.Search.map((searchItem) =>
            keyLowering(searchItem)
          );

          setMovies(mappedSearch);
          setError("");
        } catch (err) {
          if (err.name !== "AbortError") {
            console.log(err);
            setError(err.message);
          }
        } finally {
          setIsLoading(false);
        }
      }

      if (query.length < 2) {
        setMovies([]);
        setError("");
        return;
      }

      //handleCloseMovie();
      fetchMovies();

      return function () {
        controller.abort();
      };
    },
    [query]
  );

  return { movies, isLoading, error };
}
