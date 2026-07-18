import { useRef } from 'react';
import { motion } from 'framer-motion';
import { HiChevronLeft, HiChevronRight } from 'react-icons/hi';
import MovieCard from './MovieCard';

export default function SectionRow({ title, subtitle, items, showProgress = false, onLoadMore, genres, favorites, fetchFavorites }) {
  
  const scrollRef = useRef(null);
  
  const scroll = (direction) => {
    if (scrollRef.current) {
      const amount = direction === 'left' ? -600 : 600;
      scrollRef.current.scrollBy({ left: amount, behavior: 'smooth' });
    }
  };

  const handleScroll = (e) => {
    const { scrollLeft, scrollWidth, clientWidth } = e.target;

    if (scrollLeft + clientWidth >= scrollWidth - 1000) {
      onLoadMore?.();
    }
  };

  if (!items || items.length === 0) return null;
  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5 }}
      className="mb-10"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4 px-1">
        <div>
          <h2 className="font-display font-bold text-lg md:text-xl text-white">
            {title}
          </h2>
          {subtitle && (
            <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => scroll('left')}
            className="p-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 
              transition-all duration-200 hover:scale-110 active:scale-95"
            aria-label="Scroll left"
          >
            <HiChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => scroll('right')}
            className="p-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 
              transition-all duration-200 hover:scale-110 active:scale-95"
            aria-label="Scroll right"
          >
            <HiChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Scroll Container */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex gap-4 overflow-x-auto hide-scrollbar scroll-smooth snap-x snap-mandatory pb-4 px-1"
      >
        {Array.isArray(items) &&
          items.map((item, index) => (
            <div key={index} className="snap-start">
              <MovieCard
                movie={item}
                genres={genres}
                index={index}
                showProgress={showProgress}
                favorites={favorites}
                fetchFavorites={fetchFavorites}
              />
            </div>
          ))}
      </div>
    </motion.section>
  );
}
