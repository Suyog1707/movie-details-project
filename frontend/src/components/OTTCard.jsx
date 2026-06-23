import { motion } from 'framer-motion';
import { HiExternalLink } from 'react-icons/hi';

const platformColors = {
  'Netflix': 'from-red-600 to-red-800',
  'Amazon Prime': 'from-blue-600 to-blue-800',
  'Disney+ Hotstar': 'from-blue-500 to-indigo-700',
  'YouTube Movies': 'from-red-500 to-red-700',
  'Apple TV': 'from-gray-600 to-gray-800',
};

const platformLogos = {
  'Netflix': 'N',
  'Amazon Prime': 'P',
  'Disney+ Hotstar': 'D+',
  'YouTube Movies': 'YT',
  'Apple TV': '▶',
};

export default function OTTCard({ type, platform, index = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.1 }}
      className="flex-shrink-0 w-52 group"
    >
      <div className="glass-card p-4 hover:bg-white/10 transition-all duration-300 cursor-pointer">
        <div className="flex items-center gap-3 mb-3">
          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${platform.provider_name || 'from-gray-600 to-gray-800'} 
            flex items-center justify-center text-white font-bold text-sm shadow-lg`}>
            <img
              src={`${import.meta.env.VITE_IMG_URL}${platform.logo_path}`}
              className="rounded-xl"
            />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white">{platform.provider_name}</h4>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
