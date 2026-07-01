import { Fragment, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { HiSearch } from "react-icons/hi";
import { useSearchParams } from "react-router-dom";
import tmdbApi from "../api/tmdb.api";
import MovieCard from "../components/MovieCard";
import axiosClient from "../axios/axiosClient";
import MovieCardSkeleton from "../components/MovieCardSkeleton";

export default function SearchPage({ genres, favorites, fetchFavorites }) {
  const [searchParams] = useSearchParams();
  const initialQuery = searchParams.get("query") || "";
  const [query, setQuery] = useState(initialQuery || "");
  const [searchQuery, setSearchQuery] = useState("");
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);


  // Debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchQuery(query);
    }, 500);

    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    const loadMovies = async () => {
      if (!searchQuery.trim()) {
        setMovies([]);
        return;
      }

      try {
        setLoading(true);

        const mediaType = "movie";

        const response = await axiosClient.get(
          `/api/v1/${mediaType}/search`,
          {
            params: {
              query: searchQuery,
              page: 1,
            },
          }
        );

        console.log(response)

        setMovies(response.data.results || []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadMovies();
  }, [searchQuery]);


  return (
    <div className="min-h-screen px-4 md:px-8 py-8">
      {/* Search Bar */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-3xl mx-auto mb-10"
      >
        <div className="relative">
          <input
            type="text"
            placeholder="Search movies, TV shows..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="
              w-full
              bg-zinc-900
              border border-zinc-800
              rounded-xl
              py-4 pl-12 pr-4
              outline-none
              focus:border-red-500
              transition
            "
          />
        </div>
      </motion.div>

      {/* Loading */}
      {loading && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 gap-11 px-4 lg:px-8 py-6">
          {Array.from({ length: 10 }).map((_, index) => (
            <MovieCardSkeleton key={index} />
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && searchQuery && movies.length === 0 && (
        <div className="text-center py-20 text-gray-400">
          No results found for "{searchQuery}"
        </div>
      )}

      {/* Initial State */}
      {!searchQuery && (
        <div className="text-center py-20">
          <h1 className="text-3xl font-bold mb-3">
            Search Movies & TV Shows
          </h1>
          <p className="text-gray-400">
            Discover thousands of movies and series.
          </p>
        </div>
      )}

      {/* Results */}
      {movies.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="px-4 lg:px-8 py-6"
        >
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 gap-11">
            {movies.map((movie, index) => {
              if (movie.poster_path) {
                return (
                  <Fragment key={index}>
                    <MovieCard
                      movie={movie}
                      index={index}
                      genres={genres}
                      favorites={favorites}
                      fetchFavorites={fetchFavorites}
                    />
                  </Fragment>
                )
              }
            })}
          </div>
        </motion.div>
      )}
    </div>
  );
};