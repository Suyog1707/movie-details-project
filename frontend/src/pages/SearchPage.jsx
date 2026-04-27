import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiSearch, HiTrendingUp, HiClock, HiX } from 'react-icons/hi';
import MovieCard from '../components/MovieCard';
import { allContent, trendingSearches } from '../data/movies';

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const [query, setQuery] = useState(initialQuery);
  const [recentSearches, setRecentSearches] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('cineverse_recent_searches') || '[]');
    } catch { return []; }
  });

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return allContent.filter(item =>
      item.title.toLowerCase().includes(q) ||
      item.genres.some(g => g.toLowerCase().includes(q)) ||
      item.director?.toLowerCase().includes(q) ||
      item.cast?.some(c => c.name.toLowerCase().includes(q))
    );
  }, [query]);

  const handleSearch = (term) => {
    setQuery(term);
    setSearchParams({ q: term });
    // Add to recent searches
    const updated = [term, ...recentSearches.filter(s => s !== term)].slice(0, 8);
    setRecentSearches(updated);
    localStorage.setItem('cineverse_recent_searches', JSON.stringify(updated));
  };

  const removeRecent = (term) => {
    const updated = recentSearches.filter(s => s !== term);
    setRecentSearches(updated);
    localStorage.setItem('cineverse_recent_searches', JSON.stringify(updated));
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="px-4 lg:px-8 py-6"
    >
      {/* Search Bar */}
      <div className="max-w-2xl mx-auto mb-8">
        <div className="flex items-center bg-dark-700 border border-white/10 rounded-xl px-4 py-3 focus-within:border-primary/50 transition-colors">
          <HiSearch className="w-5 h-5 text-gray-500" />
          <input
            type="text"
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search movies, TV shows, actors, directors..."
            className="bg-transparent text-white placeholder-gray-500 ml-3 outline-none w-full text-base"
            autoFocus
          />
          {query && (
            <button onClick={() => { setQuery(''); setSearchParams({}); }} className="text-gray-500 hover:text-white">
              <HiX className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Results */}
      {query.trim() ? (
        <div>
          <p className="text-sm text-gray-500 mb-4">
            {results.length} result{results.length !== 1 ? 's' : ''} for "{query}"
          </p>
          {results.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {results.map((item, index) => (
                <MovieCard key={item.id} movie={item} index={index} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-4xl mb-3">🔍</p>
              <p className="text-gray-400 text-lg mb-1">No results found</p>
              <p className="text-gray-600 text-sm">Try different keywords or browse by genre</p>
            </div>
          )}
        </div>
      ) : (
        <div className="max-w-2xl mx-auto">
          {/* Trending Searches */}
          <div className="mb-8">
            <h3 className="flex items-center gap-2 font-display font-bold text-lg mb-4">
              <HiTrendingUp className="w-5 h-5 text-primary" /> Trending Searches
            </h3>
            <div className="flex flex-wrap gap-2">
              {trendingSearches.map(term => (
                <button
                  key={term}
                  onClick={() => handleSearch(term)}
                  className="px-3 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-sm text-gray-300 
                    hover:text-white transition-all border border-white/5 hover:border-white/10"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>

          {/* Recent Searches */}
          {recentSearches.length > 0 && (
            <div>
              <h3 className="flex items-center gap-2 font-display font-bold text-lg mb-4">
                <HiClock className="w-5 h-5 text-gray-500" /> Recent Searches
              </h3>
              <div className="space-y-1">
                {recentSearches.map(term => (
                  <div
                    key={term}
                    className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-white/5 transition-colors group"
                  >
                    <button
                      onClick={() => handleSearch(term)}
                      className="flex items-center gap-2 text-sm text-gray-400 hover:text-white"
                    >
                      <HiClock className="w-4 h-4" /> {term}
                    </button>
                    <button
                      onClick={() => removeRecent(term)}
                      className="text-gray-600 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <HiX className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
}
