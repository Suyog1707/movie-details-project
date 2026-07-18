import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiFilter, HiTrash } from 'react-icons/hi';
import { useSearchParams, useNavigate } from 'react-router-dom';
import MovieCard from '../components/MovieCard';
import MovieCardSkeleton from "../components/MovieCardSkeleton";

export default function FavoritesPage({ genres, favorites, fetchFavorites, loadingFavorites }) {

  const [searchParams] = useSearchParams();
  const genreFilter = searchParams.get('genre');
  const [sortBy, setSortBy] = useState('added');
  const [selectedGenre, setSelectedGenre] = useState(genreFilter || 'All');
  const navigate = useNavigate();
  

  useEffect(() => {
    const genre = searchParams.get("genre");

    setSelectedGenre(genre || "All");
  }, [searchParams]);

  const filtered = useMemo(() => {
    let result = [...favorites];

    if (selectedGenre !== "All") {
      const genreObj = genres.find(
        g => g.name === selectedGenre
      );

      result = result.filter(movie =>
        movie.genre_ids?.includes(genreObj?.id)
      );
    }

    if (sortBy === "added") {
      result.sort(
        (a, b) =>
          new Date(b.createdAt) -
          new Date(a.createdAt)
      );
    }
    else if (sortBy === "rating") {
      result.sort(
        (a, b) => b.vote_average - a.vote_average
      );
    } else if (sortBy === "year") {
      result.sort(
        (a, b) =>
          new Date(b.release_date) -
          new Date(a.release_date)
      );
    } else if (sortBy === "title") {
      result.sort((a, b) =>
        a.title.localeCompare(b.title)
      );
    }

    return result;
  }, [favorites, genres, selectedGenre, sortBy]);

  const handleGenreClick = (genreName) => {
    if (genreName === selectedGenre) {
      navigate("/favorites?genre=All");
    } else {
      navigate(`/favorites?genre=${encodeURIComponent(genreName)}`);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="px-4 lg:px-8 py-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display font-bold text-2xl md:text-3xl mb-1">❤️ My Favorites</h1>
          <p className="text-sm text-gray-500">{favorites.length} items in your collection</p>
        </div>
        {favorites.length > 0 && (
          <div className="flex items-center gap-2">
            <HiFilter className="w-4 h-4 text-gray-500" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-dark-700 border border-white/10 rounded-lg px-3 py-2 text-sm text-white outline-none cursor-pointer"
            >
              <option value="added">Recently Added</option>
              <option value="rating">Top Rated</option>
              <option value="year">Newest</option>
              <option value="title">A-Z</option>
            </select>
          </div>
        )}
      </div>

      {/* Genre Filter */}
      {favorites.length > 0 && (
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
      )}

      {/* Grid */}
      <AnimatePresence mode="popLayout">
        {loadingFavorites ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {Array.from({ length: 10 }).map((_, index) => (
              <MovieCardSkeleton key={index} />
            ))}
          </div>
        ) : filtered.length > 0 ? (
          <motion.div
            layout
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 gap-4"
          >
            {filtered.map((movie, index) => (
              <motion.div
                key={movie.id}
                layout
                exit={{ opacity: 0, scale: 0.8 }}
                className="relative group"
              >
                <MovieCard movie={movie} index={index} genres={genres} favorites={favorites} fetchFavorites={fetchFavorites} />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <div className="text-6xl mb-4">🎬</div>
            <p className="text-gray-400 text-lg mb-2">No favorites yet</p>
            <p className="text-gray-600 text-sm">Start adding movies and shows you love!</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
