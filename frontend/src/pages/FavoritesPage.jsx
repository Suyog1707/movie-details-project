import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiFilter, HiTrash } from 'react-icons/hi';
import MovieCard from '../components/MovieCard';

export default function FavoritesPage() {

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
            onClick={() => setSelectedGenre('All')}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all 
              ${selectedGenre === 'All' ? 'bg-primary text-white' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}
          >
            All
          </button>
          {genres
            .filter(g => favorites.some(f => f.genres.includes(g.name)))
            .map(g => (
              <button
                key={g.id}
                onClick={() => setSelectedGenre(g.name)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all 
                  ${selectedGenre === g.name ? 'bg-primary text-white' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}
              >
                {g.icon} {g.name}
              </button>
            ))}
        </div>
      )}

      {/* Grid */}
      <AnimatePresence mode="popLayout">
        {filtered.length > 0 ? (
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
                <MovieCard movie={movie} index={index} />
                {/* Remove button */}
                <button
                  onClick={() => removeFavorite(movie.id)}
                  className="absolute top-2 right-2 z-10 p-1.5 rounded-full bg-red-500/80 text-white 
                    opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                  aria-label="Remove from favorites"
                >
                  <HiTrash className="w-3.5 h-3.5" />
                </button>
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
