import { motion } from 'framer-motion';
import { HiExternalLink } from 'react-icons/hi';

export default function OTTCard({ platform, index = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.1 }}
      className="flex-shrink-0 w-52 group"
    >
      <div className="glass-card p-4 hover:bg-white/10 transition-all duration-300 cursor-pointer">
        <div className="flex items-center gap-3 mb-3">
          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${platformColors[platform.name] || 'from-gray-600 to-gray-800'} 
            flex items-center justify-center text-white font-bold text-sm shadow-lg`}>
            {platformLogos[platform.name] || platform.logo}
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white">{platform.name}</h4>
            <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full 
              ${platform.type === 'Subscription' 
                ? 'bg-green-500/20 text-green-400' 
                : platform.type.startsWith('Buy')
                  ? 'bg-accent-gold/20 text-accent-gold'
                  : 'bg-blue-500/20 text-blue-400'
              }`}>
              {platform.type}
            </span>
          </div>
        </div>
        <button className="w-full py-2 text-xs font-semibold rounded-lg bg-white/5 hover:bg-white/10 
          border border-white/10 hover:border-white/20 transition-all flex items-center justify-center gap-1 group-hover:text-primary">
          <HiExternalLink className="w-3.5 h-3.5" />
          Watch Now
        </button>
      </div>
    </motion.div>
  );
}
