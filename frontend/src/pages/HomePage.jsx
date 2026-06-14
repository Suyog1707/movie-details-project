import { motion } from 'framer-motion';
import HeroBanner from '../components/HeroBanner';
import SectionRow from '../components/SectionRow';
import { useState, useEffect } from 'react';
import axiosClient from '../../../backend/src/axios/axios.client';

export default function HomePage({ favorites, setFavorites, fetchFavorites }) {

  const [trending, setTrending] = useState([])
  const [popularMovies, setPopularMovies] = useState([])
  const [popularTVShows, setPopularTVShows] = useState([])
  const [topRated, setTopRated] = useState([])
  const [upcoming, setUpcoming] = useState([])
  const [allContent, setAllContent] = useState([])

  const fetchData = async ({ type, category }) => {
    const response = await axiosClient.get(`${import.meta.env.VITE_BASE_URL}/api/v1/${type}/${category}`)
    //console.log(`${category}:-`, response.data)
    return response.data.results
  }

  useEffect(() => {
    setTrending(fetchData("movie", "trending"))
    setTrending(
      ...trending,
      fetchData("tv", "trending")
    )
    setPopularMovies(fetchData("movie", "popular"))
    setPopularTVShows(fetchData("tv", "popular"))
    setTopRated(fetchData("movie", "top_rated"))
    setTopRated(
      ...topRated,
      fetchData("tv", "top_rated")
    )
    setUpcoming(fetchData("movie", "top_rated"))
    setUpcoming(
      ...upcoming,
      fetchData("tv", "on_the_air")
    )
    setAllContent({
      ...trending,
      ...popularMovies,
      ...popularTVShows,
      ...topRated,
      ...upcoming
    })
  }, [])

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
          items={trending}
          favorites={favorites}
          fetchFavorites={fetchFavorites}
        />

        <SectionRow
          title="🎬 Popular Movies"
          subtitle="Most watched this month"
          items={popularMovies}
          favorites={favorites}
          fetchFavorites={fetchFavorites}
        />

        <SectionRow
          title="📺 Popular TV Shows"
          subtitle="Binge-worthy series"
          items={popularTVShows}
          favorites={favorites}
          fetchFavorites={fetchFavorites}
        />

        <SectionRow
          title="⭐ Top Rated"
          subtitle="Critically acclaimed content"
          items={topRated}
          favorites={favorites}
          fetchFavorites={fetchFavorites}
        />

        <SectionRow
          title="Upcoming"
          subtitle="What is coming next"
          items={upcoming}
          favorites={favorites}
          fetchFavorites={fetchFavorites}
        />

        {favorites.length > 0 && (
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
