import { motion } from 'framer-motion';

export default function CastCard({ actor, index = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.05 }}
      className="flex-shrink-0 w-28 text-center group"
    >
      <div className="w-20 h-20 mx-auto rounded-full overflow-hidden border-2 border-white/10 
        group-hover:border-primary transition-colors duration-300 mb-2">
        <img
          src={actor.image}
          alt={actor.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          loading="lazy"
        />
      </div>
      <h4 className="text-xs font-semibold text-white truncate">{actor.name}</h4>
      <p className="text-[10px] text-gray-500 truncate">{actor.character}</p>
    </motion.div>
  );
}
