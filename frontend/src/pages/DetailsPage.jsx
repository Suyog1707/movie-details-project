import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiStar, HiPlay, HiHeart, HiCalendar, HiClock, HiFilm, HiGlobe, HiArrowLeft } from 'react-icons/hi';
import CastCard from '../components/CastCard';
import TrailerCard from '../components/TrailerCard';
import OTTCard from '../components/OTTCard';
import MovieCard from '../components/MovieCard';

export default function DetailsPage() {

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      {/* Backdrop Hero */}
      <div className="relative h-[50vh] min-h-[400px] overflow-hidden">
        <img
          src={item.backdrop}
          alt={item.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 gradient-overlay" />
        <div className="absolute inset-0 gradient-overlay-left" />

        {/* Back button */}
        <Link to="/" className="absolute top-4 left-4 btn-icon z-10">
          <HiArrowLeft className="w-5 h-5" />
        </Link>
      </div>

      {/* Content */}
      <div className="px-4 lg:px-8 -mt-40 relative z-10">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Poster */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex-shrink-0"
          >
            <img
              src={item.poster}
              alt={item.title}
              className="w-48 md:w-56 rounded-xl shadow-2xl shadow-black/50 border border-white/10"
            />
          </motion.div>

          {/* Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex-1"
          >
            {/* Genre tags */}
            <div className="flex flex-wrap gap-2 mb-3">
              {item.genres.map(genre => (
                <span key={genre} className="px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider 
                  bg-white/10 backdrop-blur-sm rounded-full border border-white/10">
                  {genre}
                </span>
              ))}
            </div>

            <h1 className="font-display font-black text-3xl md:text-4xl lg:text-5xl mb-2">
              {item.title}
            </h1>

            {item.tagline && (
              <p className="text-gray-400 italic text-sm mb-4">{item.tagline}</p>
            )}

            {/* Meta Row */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-300 mb-4">
              <span className="flex items-center gap-1 text-accent-gold font-bold text-base">
                <HiStar className="w-5 h-5" /> {item.rating}/10
              </span>
              <span className="flex items-center gap-1">
                <HiCalendar className="w-4 h-4" /> {item.releaseYear}
              </span>
              <span className="flex items-center gap-1">
                <HiClock className="w-4 h-4" /> {item.runtime}
              </span>
              {item.type === 'tv' && (
                <span className="flex items-center gap-1">
                  <HiFilm className="w-4 h-4" /> {item.seasons} Season{item.seasons > 1 ? 's' : ''}
                </span>
              )}
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4 text-sm">
              <div>
                <span className="text-gray-500">Director:</span>
                <span className="ml-2 text-white">{item.director}</span>
              </div>
              <div>
                <span className="text-gray-500">Producer:</span>
                <span className="ml-2 text-white">{item.producer}</span>
              </div>
              <div className="flex items-center gap-1">
                <HiGlobe className="w-4 h-4 text-gray-500" />
                <span className="text-gray-500">Languages:</span>
                <span className="ml-1 text-white">{item.languages.join(', ')}</span>
              </div>
              <div>
                <span className="text-gray-500">Quality:</span>
                <span className="ml-2 flex items-center gap-1">
                  {item.quality.map(q => (
                    <span key={q} className="px-2 py-0.5 text-[10px] font-bold bg-accent-gold/10 text-accent-gold rounded">
                      {q}
                    </span>
                  ))}
                </span>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <button className="btn-primary flex items-center gap-2">
                <HiPlay className="w-5 h-5" /> Watch Now
              </button>
              <button
                onClick={() => toggleFavorite(item)}
                className={`btn-secondary flex items-center gap-2 ${
                  isFavorite(item.id) ? '!border-primary !text-primary' : ''
                }`}
              >
                <HiHeart className={`w-5 h-5 ${isFavorite(item.id) ? 'fill-primary' : ''}`} />
                {isFavorite(item.id) ? 'In Favorites' : 'Add to Favorites'}
              </button>
            </div>

            {/* Overview */}
            <div className="mb-6">
              <h3 className="font-display font-bold text-lg mb-2">Overview</h3>
              <p className="text-gray-300 text-sm leading-relaxed">{item.overview}</p>
            </div>

            {/* Rating Stars */}
            <div className="flex items-center gap-1 mb-6">
              {[...Array(5)].map((_, i) => (
                <HiStar
                  key={i}
                  className={`w-5 h-5 ${i < Math.round(item.rating / 2) ? 'text-accent-gold' : 'text-gray-700'}`}
                />
              ))}
              <span className="text-sm text-gray-400 ml-2">{item.rating}/10</span>
            </div>
          </motion.div>
        </div>

        {/* Cast Section */}
        {item.cast && item.cast.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-10"
          >
            <h2 className="font-display font-bold text-xl mb-4">🎭 Cast</h2>
            <div className="flex gap-4 overflow-x-auto hide-scrollbar pb-4">
              {item.cast.map((actor, index) => (
                <CastCard key={actor.name} actor={actor} index={index} />
              ))}
            </div>
          </motion.section>
        )}

        {/* Trailers Section */}
        {item.trailers && item.trailers.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-10"
          >
            <h2 className="font-display font-bold text-xl mb-4">🎥 Trailers</h2>
            <div className="flex gap-4 overflow-x-auto hide-scrollbar pb-4">
              {item.trailers.map((trailer, index) => (
                <TrailerCard key={trailer.language} trailer={trailer} index={index} />
              ))}
            </div>
          </motion.section>
        )}

        {/* Where to Watch */}
        {item.platforms && item.platforms.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-10"
          >
            <h2 className="font-display font-bold text-xl mb-4">📺 Where to Watch</h2>
            <div className="flex gap-4 overflow-x-auto hide-scrollbar pb-4">
              {item.platforms.map((platform, index) => (
                <OTTCard key={platform.name} platform={platform} index={index} />
              ))}
            </div>
          </motion.section>
        )}

        {/* Related Content */}
        {related.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="mt-10 mb-8"
          >
            <h2 className="font-display font-bold text-xl mb-4">🔗 Related Content</h2>
            <div className="flex gap-4 overflow-x-auto hide-scrollbar pb-4">
              {related.map((movie, index) => (
                <MovieCard key={movie.id} movie={movie} index={index} />
              ))}
            </div>
          </motion.section>
        )}
      </div>
    </motion.div>
  );
}
