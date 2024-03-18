import { useState, useEffect } from "react";

import { API_URL, API_KEY } from "../utils/config";

import { keyLowering, getErrorMessage } from "../utils/helpers";

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

type MovieState = Record<string, string | Array<Record<string, string>>> | null;

export function useMovieDetails(selectedId: string) {
  const [movie, setMovie] = useState<MovieState>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

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
        const error = getErrorMessage(err);
        if (typeof error === "string") {
          console.log(error);
        }
        if (typeof error !== "string" && error.name !== "AbortError") {
          setError(error.message);
        }
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
