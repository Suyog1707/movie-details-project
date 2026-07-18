import { motion } from 'framer-motion';
import { HiPlay } from 'react-icons/hi';

export default function TrailerCard({ trailer, index = 0 }) {
  if (trailer.site === "YouTube") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
        className="flex-shrink-0 w-64 sm:w-72 group cursor-pointer"
        onClick={() => window.open(`https://www.youtube.com/watch?v=${trailer.key}`, '_blank')}
      >
        <div className="relative rounded-xl overflow-hidden aspect-video">
          <img
            src={`https://img.youtube.com/vi/${trailer.key}/hqdefault.jpg`}
            alt={`${trailer.name}`}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
          {/* Play Button Overlay */}
          <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition-colors flex items-center justify-center">
            <div className="w-14 h-14 rounded-full bg-primary/90 flex items-center justify-center 
            group-hover:scale-110 transition-transform shadow-lg shadow-primary/30">
              <HiPlay className="w-7 h-7 text-white ml-0.5" />
            </div>
          </div>
          {/* Language Badge */}
          <div className="absolute bottom-2 left-2 px-2.5 py-1 bg-black/70 backdrop-blur-sm 
          rounded-full text-[10px] font-semibold border border-white/10">
            {trailer.iso_639_1}
          </div>
        </div>
        <p className="mt-2 text-xs text-gray-300 font-medium">{trailer.type}</p>
      </motion.div>
    );
  }
}
