import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { HiPlay, HiHeart, HiStar, HiCalendar } from 'react-icons/hi';
import { isFavorite } from '../utils/IsFavorite';
import { toggleFavorites } from '../utils/toggleFavorite';

const featured = [0, 3, 5, 7]; // indices into the data array

export default function HeroBanner({ favorites, movies, fetchFavorites }) {

  const [current, setCurrent] = useState(0);

  const featuredMovies = featured.map(i => movies[i]).filter(Boolean);
  const movie = featuredMovies[current];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent(prev => (prev + 1) % featuredMovies.length);
    }, 8000);
    return () => clearInterval(timer);
  }, [featuredMovies.length]);

  if (!movie) return null;

  return (
    <section className="relative w-full h-[75vh] min-h-[500px] max-h-[800px] overflow-hidden">
      {/* Backdrop Image */}
      <AnimatePresence mode="wait">
        <motion.div
          key={movie.id}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          className="absolute inset-0"
        >
          <img
            src={`${import.meta.env.VITE_IMG_URL}${movie.backdrop_path}`}
            alt={movie.title}
            className="w-full h-full object-cover"
          />
        </motion.div>
      </AnimatePresence>

      {/* Overlays */}
      <div className="absolute inset-0 gradient-overlay" />
      <div className="absolute inset-0 gradient-overlay-left" />
      <div className="absolute inset-0 bg-black/20" />

      {/* Content */}
      <div className="absolute inset-0 flex items-end pb-16 lg:pb-20 px-6 lg:px-12">
        <AnimatePresence mode="wait">
          <motion.div
            key={movie.id}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-2xl"
          >
            {/* Genre Tags */}
            <div className="flex flex-wrap gap-2 mb-3">
              {movie.genre_ids.map(genre => (
                <span
                  key={genre}
                  className="px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider 
                    bg-white/10 backdrop-blur-sm rounded-full border border-white/10"
                >
                  {genre}
                </span>
              ))}
            </div>

            {/* Title */}
            <h1 className="font-display font-black text-4xl md:text-5xl lg:text-6xl leading-tight mb-3">
              {movie.title}
            </h1>

            {/* Tagline */}
            <p className="text-gray-300 text-sm italic mb-3">{movie.tagline}</p>

            {/* Meta */}
            <div className="flex items-center gap-4 text-sm text-gray-300 mb-4">
              <span className="flex items-center gap-1 text-accent-gold font-semibold">
                <HiStar className="w-4 h-4" /> {Math.fround(movie.vote_average).toFixed(1)}
              </span>
              <span className="flex items-center gap-1">
                <HiCalendar className="w-4 h-4" /> {movie.release_date}
              </span>
              <span>{movie.runtime}</span>
              {movie.quality?.[0] && (
                <span className="px-2 py-0.5 text-[10px] font-bold bg-accent-gold/20 text-accent-gold rounded">
                  {movie.quality[0]}
                </span>
              )}
            </div>

            {/* Description */}
            <p className="text-gray-300 text-sm leading-relaxed mb-6 line-clamp-3 max-w-xl">
              {movie.overview}
            </p>

            {/* Buttons */}
            <div className="flex flex-wrap items-center gap-3">
              <Link to={`/details/${movie.id}`}>
                <button className="btn-primary flex items-center gap-2 text-sm">
                  <HiPlay className="w-5 h-5" /> Watch Now
                </button>
              </Link>
              <button
                onClick={() => toggleFavorites(movie.id, favorites, fetchFavorites)}
                className={`btn-secondary flex items-center gap-2 text-sm ${isFavorite(movie.id, favorites) ? '!border-primary !text-primary' : ''
                  }`}
              >
                <HiHeart className={`w-5 h-5 ${isFavorite(movie.id, favorites) ? 'fill-primary' : ''}`} />
                {isFavorite(movie.id, favorites) ? 'In Favorites' : 'Add to Favorites'}
              </button>
              <Link to={`/details/${movie.id}`}>
                <button className="btn-secondary flex items-center gap-2 text-sm">
                  <HiPlay className="w-4 h-4" /> Trailer
                </button>
              </Link>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Slide Indicators */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2">
        {featuredMovies.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`h-1 rounded-full transition-all duration-500 ${i === current ? 'w-8 bg-primary' : 'w-3 bg-white/30 hover:bg-white/50'
              }`}
          />
        ))}
      </div>
    </section>
  );
}
