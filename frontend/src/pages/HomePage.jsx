import { motion } from 'framer-motion';
import HeroBanner from '../components/HeroBanner';
import SectionRow from '../components/SectionRow';
import { useState, useEffect } from 'react';
import axiosClient from '../axios/axiosClient';
import axios from 'axios';

export default function HomePage({ favorites, setFavorites, fetchFavorites }) {

  const [trending, setTrending] = useState([])
  const [popularMovies, setPopularMovies] = useState([])
  const [topRated, setTopRated] = useState([])
  const [upcoming, setUpcoming] = useState([])
  const [allContent, setAllContent] = useState([])

  const fetchData = async (mediaType, mediaCategory, page) => {
    const response = await axios.get(`${import.meta.env.VITE_TMDB_URL}/${mediaType}/${mediaCategory}?api_key=${import.meta.env.VITE_TMDB_API_KEY}`, {
      params: {
        page: page
      }
    })

    return response.data
  }

  useEffect(() => {
    const loadData = async () => {
      try {
        const [
          popularData,
          topRatedData,
          upcomingData,
        ] = await Promise.all([
          fetchData("movie", "popular", 1),
          fetchData("movie", "top_rated", 1),
          fetchData("movie", "upcoming", 1),
        ]);

        const res = await axios.get(`${import.meta.env.VITE_TMDB_URL}/trending/movie/week?api_key=${import.meta.env.VITE_TMDB_API_KEY}`)

        const trendingData = res.data

        setTrending(trendingData);
        setPopularMovies(popularData);
        setTopRated(topRatedData);
        setUpcoming(upcomingData);

        setAllContent([
          ...(trendingData.results || []),
          ...(popularData.results || []),
          ...(topRatedData.results || []),
          ...(upcomingData.results || []),
        ]);
      } catch (error) {
        console.error("Error loading movies:", error);
      }
    };

    loadData();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Hero Banner */}
      <HeroBanner
        movies={allContent}
        favorites={favorites}
        fetchFavorites={fetchFavorites}
      />

      {/* Content Sections */}
      <div className="px-4 lg:px-8 -mt-10 relative z-10">

        <SectionRow
          title="🔥 Trending Now"
          subtitle="What everyone is watching"
          items={trending.results || []}
          favorites={favorites}
          fetchFavorites={fetchFavorites}
        />

        <SectionRow
          title="🎬 Popular Movies"
          subtitle="Most watched this month"
          items={popularMovies.results || []}
          favorites={favorites}
          fetchFavorites={fetchFavorites}
        />

        <SectionRow
          title="⭐ Top Rated"
          subtitle="Critically acclaimed content"
          items={topRated.results || []}
          favorites={favorites}
          fetchFavorites={fetchFavorites}
        />

        <SectionRow
          title="Upcoming"
          subtitle="What is coming next"
          items={upcoming.results || []}
          favorites={favorites}
          fetchFavorites={fetchFavorites}
        />

        {favorites?.length > 0 && (
          <SectionRow
            title="❤️ My Favorites"
            subtitle="Your personal collection"
            items={favorites}
            favorites={favorites}
            fetchFavorites={fetchFavorites}
          />
        )}

      </div>
    </motion.div>
  );
}
