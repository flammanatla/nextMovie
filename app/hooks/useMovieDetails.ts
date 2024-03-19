import { useState, useEffect } from "react";

import { API_URL, API_KEY } from "../utils/config";

import { lowercaseKey, getErrorMessage } from "../utils/helpers";

import { Movie } from "../components/Movie.types";

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

// type MovieState = Record<string, string | Array<Record<string, string>>> | null;
type MovieState = Movie | null;

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

        const data: object = await res.json();
        const mappedMovie = lowercaseKey(data) as Movie;

        if (mappedMovie.response === "False") {
          throw new Error("Movie not found");
        }

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
