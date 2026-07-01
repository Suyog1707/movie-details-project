import { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiSearch, HiFilter, HiStar } from 'react-icons/hi';
import loadingImage from "/loading.svg"
import MovieCardSkeleton from "../components/MovieCardSkeleton";
import MovieCard from '../components/MovieCard';
import axios from "axios"

export default function MoviesPage({ genres, favorites, fetchFavorites }) {

  const [searchParams] = useSearchParams();
  const genreFilter = searchParams.get('genre');
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('none');
  const [selectedGenre, setSelectedGenre] = useState(genreFilter || 'All');
  const [movies, setMovies] = useState([])
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true)
  const [initialLoading, setInitialLoading] = useState(true);
  const navigate = useNavigate();

  const observer = useRef();

  const fetchMovies = async (pageNumber) => {
    const response = await axios.get(
      `${import.meta.env.VITE_TMDB_URL}/discover/movie`,
      {
        params: {
          api_key: import.meta.env.VITE_TMDB_API_KEY,
          page: pageNumber,
          sort_by: "popularity.desc",
        },
      }
    );

    return response.data;
  };

  const loadMovies = async (pageNumber) => {
    if (loading || !hasMore) return;

    setLoading(true);

    try {
      const data = await fetchMovies(pageNumber);

      const newMovies = data.results || [];

      setMovies(prev => [
        ...new Map(
          [...prev, ...newMovies].map(movie => [movie.id, movie])
        ).values()
      ]);

      setHasMore(pageNumber < data.total_pages);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);

      if (pageNumber === 1) {
        setInitialLoading(false);
      }
    }
  };

  useEffect(() => {
    loadMovies(page);
  }, [page]);

  useEffect(() => {
    const genre = searchParams.get("genre");

    setSelectedGenre(genre || "All");
  }, [searchParams]);

  const lastMovieRef = useCallback(
    node => {
      if (loading) return;

      if (observer.current) {
        observer.current.disconnect();
      }

      observer.current = new IntersectionObserver(entries => {
        if (
          entries[0].isIntersecting &&
          hasMore
        ) {
          setPage(prev => prev + 1);
        }
      });

      if (node) {
        observer.current.observe(node);
      }
    },
    [loading, hasMore]
  );

  const filtered = useMemo(() => {
    let result = [...movies];

    if (selectedGenre !== "All") {
      const genreObj = genres.find(
        g => g.name === selectedGenre
      );

      result = result.filter(movie =>
        movie.genre_ids?.includes(genreObj?.id)
      );
    }

    if (search.trim()) {
      const q = search.toLowerCase();

      result = result.filter(movie =>
        movie.title?.toLowerCase().includes(q)
      );
    }

    switch (sortBy) {
      case "rating":
        result.sort(
          (a, b) => b.vote_average - a.vote_average
        );
        break;

      case "year":
        result.sort(
          (a, b) =>
            new Date(b.release_date) -
            new Date(a.release_date)
        );
        break;

      case "title":
        result.sort((a, b) =>
          a.title.localeCompare(b.title)
        );
        break;

      default:
        // keep TMDB order
        break;
    }

    return result;
  }, [movies, genres, selectedGenre, search, sortBy]);

  if (initialLoading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="px-4 lg:px-8 py-6"
      >
        <div className="mb-6">
          <h1 className="font-display font-bold text-2xl md:text-3xl">
            🎬 Movies
          </h1>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {Array.from({ length: 15 }).map((_, index) => (
            <MovieCardSkeleton key={index} />
          ))}
        </div>
      </motion.div>
    );
  }

  const handleGenreClick = (genreName) => {
    if (genreName === selectedGenre) {
      navigate("/movies");
    } else {
      navigate(`/movies?genre=${encodeURIComponent(genreName)}`);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="px-4 lg:px-8 py-6"
    >
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="font-display font-bold text-2xl md:text-3xl mb-1">
          🎬 Movies
        </h1>
        <p className="text-sm text-gray-500">Discover and explore our movie collection</p>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        {/* Search */}
        <div className="flex items-center bg-dark-700 border border-white/10 rounded-lg px-3 py-2 flex-1 min-w-[200px] max-w-sm">
          <HiSearch className="w-4 h-4 text-gray-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search movies..."
            className="bg-transparent text-sm text-white placeholder-gray-500 ml-2 outline-none w-full"
          />
        </div>

        {/* Sort */}
        <div className="flex items-center gap-2">
          <HiFilter className="w-4 h-4 text-gray-500" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-dark-700 border border-white/10 rounded-lg px-3 py-2 text-sm text-white outline-none cursor-pointer"
          >
            <option value="none">Default</option>
            <option value="rating">Top Rated</option>
            <option value="year">Newest First</option>
            <option value="title">A-Z</option>
          </select>
        </div>
      </div>

      {/* Genre Tags */}
      <div className="flex flex-wrap gap-2 mb-8">
        <button
          onClick={() => handleGenreClick('All')}
          className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all 
            ${selectedGenre === 'All' ? 'bg-primary text-white' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}
        >
          All
        </button>
        {genres.map(g => (
          <button
            key={g.id}
            onClick={() => handleGenreClick(g.name)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all 
              ${selectedGenre === g.name ? 'bg-primary text-white' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}
          >
            {g.name}
          </button>
        ))}
      </div>

      {/* Results Count */}
      <p className="text-xs text-gray-500 mb-4">{filtered.length} movies found</p>

      {/* Movie Grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {filtered.map((movie, index) => {
            if (filtered.length === index + 1) {
              return (
                <div ref={lastMovieRef} key={index}>
                  <MovieCard
                    movie={movie}
                    index={index}
                    genres={genres}
                    favorites={favorites}
                    fetchFavorites={fetchFavorites}
                  />
                </div>
              );
            }

            return (
              <MovieCard
                key={index}
                movie={movie}
                index={index}
                genres={genres}
                favorites={favorites}
                fetchFavorites={fetchFavorites}
              />
            );
          })}
          {loading && !initialLoading && (
            <div className="flex items-center justify-center h-screen">
              <div className="w-16 h-16 animate-spin text-primary">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="64"
                  height="64"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="animate-spin"
                >
                  <circle
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeOpacity="0.2"
                  />

                  <path
                    d="M22 12a10 10 0 0 1-10 10"
                    stroke="#E50914"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
            </div>
          )}
        </div>

      ) : (
        <div className="text-center py-20">
          <p className="text-gray-500 text-lg mb-2">No movies found</p>
          <p className="text-gray-600 text-sm">Try adjusting your search or filters</p>
        </div>
      )}
    </motion.div>
  );
}
