import { motion } from 'framer-motion';
import HeroBanner from '../components/HeroBanner';
import SectionRow from '../components/SectionRow';

export default function HomePage() {
  const { favorites } = useFavorites();

  const popularMovies = movies.filter(m => m.popular);
  const popularTVShows = tvShows.filter(t => t.popular);
  const topRated = allContent.filter(item => item.topRated);
  const trending = allContent.filter(item => item.trending);
  const recentlyAdded = allContent.filter(item => item.recentlyAdded);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Hero Banner */}
      <HeroBanner movies={allContent} />

      {/* Content Sections */}
      <div className="px-4 lg:px-8 -mt-10 relative z-10">
        <SectionRow
          title="🔥 Trending Now"
          subtitle="What everyone is watching"
          items={trending}
        />

        <SectionRow
          title="🎬 Popular Movies"
          subtitle="Most watched this month"
          items={popularMovies}
        />

        <SectionRow
          title="📺 Popular TV Shows"
          subtitle="Binge-worthy series"
          items={popularTVShows}
        />

        <SectionRow
          title="⭐ Top Rated"
          subtitle="Critically acclaimed content"
          items={topRated}
        />

        {favorites.length > 0 && (
          <SectionRow
            title="❤️ My Favorites"
            subtitle="Your personal collection"
            items={favorites}
          />
        )}

        <SectionRow
          title="▶️ Continue Watching"
          subtitle="Pick up where you left off"
          items={continueWatching}
          showProgress={true}
        />

        <SectionRow
          title="🆕 Recently Added"
          subtitle="Fresh new arrivals"
          items={recentlyAdded}
        />
      </div>
    </motion.div>
  );
}
