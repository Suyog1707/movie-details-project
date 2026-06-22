import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiStar, HiHeart, HiPlay } from 'react-icons/hi';
import { isFavorite } from '../utils/IsFavorite';
import { toggleFavorites } from '../utils/toggleFavorite';

export default function MovieCard({ movie, index = 0, showProgress = false, genres, favorites, fetchFavorites }) {

  const genreMap = genres?.reduce((acc, genre) => {
    acc[genre.id] = genre.name;
    return acc;
  }, {});

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
      className="relative group flex-shrink-0 w-[160px] sm:w-[180px] md:w-[200px]"
    >
      <Link to={`/details/${movie.id}`}>
        <div className="relative overflow-hidden rounded-xl aspect-[2/3] card-hover">
          {/* Poster */}
          <img
            src={`${import.meta.env.VITE_IMG_URL}${movie.poster_path}`}
            alt={movie.title}
            className="w-full h-full object-cover"
            loading="lazy"
          />

          {/* Hover Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent 
            opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3">
            <h3 className="font-semibold text-sm leading-tight mb-1">{movie.title}</h3>
            <div className="flex items-center gap-2 text-xs text-gray-300">
              <span className="flex items-center gap-0.5 text-accent-gold">
                <HiStar className="w-3 h-3" /> {Math.round(movie.vote_average).toFixed(1)}
              </span>
              <span>{movie.release_date}</span>
            </div>
            <div className="flex items-center gap-1 mt-1.5 flex-wrap">
              {movie.genre_ids.slice(0, 2).map(id => (
                <span key={id} className="px-1.5 py-0.5 text-[9px] bg-white/10 rounded-full">
                  {genreMap[id]}
                </span>
              ))}
            </div>
          </div>

          {/* Rating Badge */}
          <div className="absolute top-2 right-2 flex items-center gap-0.5 
            bg-black/70 backdrop-blur-sm rounded px-1.5 py-0.5 text-[10px] font-semibold">
            <HiStar className="w-3 h-3 text-accent-gold" /> {Math.fround(movie.vote_average).toFixed(1)}
          </div>
        </div>
      </Link>

      {/* Action Buttons (visible on hover) */}
      <div className="absolute top-10 right-2 flex flex-col gap-1.5 opacity-0 group-hover:opacity-100 
        transition-all duration-300 translate-y-2 group-hover:translate-y-0">
        <button
          onClick={(e) => { e.preventDefault(); toggleFavorites(movie.id, favorites, fetchFavorites); }}
          className={`p-1.5 rounded-full backdrop-blur-sm transition-all duration-200 
            ${isFavorite(movie.id, favorites)
              ? 'bg-primary text-white hover:bg-white hover:text-primary'
              : 'bg-black/60 text-white hover:bg-white hover:text-primary'
            }`}
          aria-label="Toggle favorite"
        >
          <HiHeart className="w-3.5 h-3.5" />
        </button>
        <Link to={`/details/${movie.id}`}>
          <button className="p-1.5 rounded-full bg-black/60 backdrop-blur-sm text-white 
            hover:bg-white/20 transition-all duration-200" aria-label="Play trailer">
            <HiPlay className="w-3.5 h-3.5" />
          </button>
        </Link>
      </div>

      {/* Title below card */}
      <div className="mt-2">
        <h3 className="text-xs font-medium text-gray-200 truncate">{movie.title}</h3>
        <p className="text-[10px] text-gray-500">{movie.release_date}</p>
      </div>
    </motion.div>
  );
}
