import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiSearch, HiFilter, HiStar } from 'react-icons/hi';
import MovieCard from '../components/MovieCard';

export default function MoviesPage() {
  const [searchParams] = useSearchParams();
  const genreFilter = searchParams.get('genre');
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('rating');
  const [selectedGenre, setSelectedGenre] = useState(genreFilter || 'All');

  const filtered = useMemo(() => {
    let result = [...movies];

    // Filter by genre
    if (selectedGenre && selectedGenre !== 'All') {
      result = result.filter(m => m.genres.includes(selectedGenre));
    }

    // Search
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(m =>
        m.title.toLowerCase().includes(q) ||
        m.genres.some(g => g.toLowerCase().includes(q))
      );
    }

    // Sort
    if (sortBy === 'rating') result.sort((a, b) => b.rating - a.rating);
    else if (sortBy === 'year') result.sort((a, b) => b.releaseYear - a.releaseYear);
    else if (sortBy === 'title') result.sort((a, b) => a.title.localeCompare(b.title));

    return result;
  }, [selectedGenre, search, sortBy]);

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
            <option value="rating">Top Rated</option>
            <option value="year">Newest First</option>
            <option value="title">A-Z</option>
          </select>
        </div>
      </div>

      {/* Genre Tags */}
      <div className="flex flex-wrap gap-2 mb-8">
        <button
          onClick={() => setSelectedGenre('All')}
          className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all 
            ${selectedGenre === 'All' ? 'bg-primary text-white' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}
        >
          All
        </button>
        {genres.map(g => (
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

      {/* Results Count */}
      <p className="text-xs text-gray-500 mb-4">{filtered.length} movies found</p>

      {/* Movie Grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {filtered.map((movie, index) => (
            <MovieCard key={movie.id} movie={movie} index={index} />
          ))}
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
