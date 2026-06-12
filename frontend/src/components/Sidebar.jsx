import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { HiX } from 'react-icons/hi';

export default function Sidebar() {
  const { isOpen, close, activeGenre, setActiveGenre } = useSidebar();
  const navigate = useNavigate();

  const handleGenreClick = (genre) => {
    setActiveGenre(genre.name === activeGenre ? null : genre.name);
    navigate(`/movies?genre=${encodeURIComponent(genre.name)}`);
    close();
  };

  return (
    <>
      {/* Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
            className="fixed inset-0 bg-black/60 z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full z-50 w-64 bg-dark-800 border-r border-white/5 
          transition-transform duration-300 ease-in-out overflow-y-auto
          lg:translate-x-0 lg:top-16 lg:z-30 lg:w-56
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        {/* Mobile header */}
        <div className="flex items-center justify-between p-4 lg:hidden border-b border-white/5">
          <span className="font-display font-bold text-lg">
            Cine<span className="text-primary">Verse</span>
          </span>
          <button onClick={close} className="btn-icon">
            <HiX className="w-5 h-5" />
          </button>
        </div>

        {/* Genres */}
        <div className="p-4">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
            Genres
          </h3>
          <nav className="space-y-1">
            {genres.map((genre, index) => (
              <motion.button
                key={genre.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.03 }}
                onClick={() => handleGenreClick(genre)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium 
                  transition-all duration-200 group
                  ${activeGenre === genre.name
                    ? 'bg-primary/20 text-primary border-l-2 border-primary'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
              >
                <span className="text-lg group-hover:scale-125 transition-transform">
                  {genre.icon}
                </span>
                <span>{genre.name}</span>
              </motion.button>
            ))}
          </nav>
        </div>

        {/* Bottom section */}
        <div className="p-4 mb-14 border-t border-white/5">
          <div className="glass-card p-4 text-center">
            <p className="text-xs text-gray-400 mb-2">Upgrade to Premium</p>
            <p className="text-[10px] text-gray-500 mb-3">Get 4K streaming + no ads</p>
            <button className="btn-primary text-xs py-2 px-4 w-full">
              Upgrade Now
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
