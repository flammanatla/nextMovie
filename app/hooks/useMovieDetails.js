import { useState, useEffect } from "react";

import { API_URL, API_KEY } from "../utils/config.js";

import { keyLowering } from "../utils/helpers.js";

// original code of useEffect from MovieDetails before transforming it to a custom hook
// useEffect(
//   function () {
//     async function getMovieDetails() {
//       setIsLoading(true);
//       const res = await fetch(`${API_URL}?apikey=${API_KEY}&i=${selectedId}`);
//       const data = await res.json();
//       setMovie(data);
//       setIsLoading(false);
//     }
//     getMovieDetails();
//   },
//   [selectedId]
// );

export function useMovieDetails(selectedId) {
  const [movie, setMovie] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    const fetchMovie = async () => {
      try {
        setIsLoading(true);
        setError("");

        const res = await fetch(
          `${API_URL}?apikey=${API_KEY}&i=${selectedId}`,
          {
            signal: controller.signal,
          }
        );

        if (!res.ok) {
          throw new Error(
            "Something went wrong with fetching movie details data"
          );
        }

        const data = await res.json();

        if (data.Response === "False") {
          throw new Error("Movie not found");
        }

        const mappedMovie = keyLowering(data);

        setMovie(mappedMovie);

        setError("");
      } catch (err) {
        if (err.name !== "AbortError") {
          console.log(err);
          setError(err.message);
        }
        console.log(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMovie();

    return () => {
      controller.abort();
    };
  }, [selectedId]);

  return { movie, isLoading, error };
}
