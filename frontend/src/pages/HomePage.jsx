import { motion } from 'framer-motion';
import HeroBanner from '../components/HeroBanner';
import SectionRow from '../components/SectionRow';
import { useState, useEffect } from 'react';
import axiosClient from '../axios/axiosClient';
import axios from 'axios';

export default function HomePage({ favorites, genres, fetchFavorites }) {

  const [trending, setTrending] = useState([])
  const [popularMovies, setPopularMovies] = useState([])
  const [topRated, setTopRated] = useState([])
  const [upcoming, setUpcoming] = useState([])
  const [allContent, setAllContent] = useState([])

  const [popularPage, setPopularPage] = useState(0);
  const [topRatedPage, setTopRatedPage] = useState(0);
  const [upcomingPage, setUpcomingPage] = useState(0);
  const [trendingPage, setTrendingPage] = useState(0);

  const fetchData = async (mediaType, mediaCategory, page) => {
    if (mediaCategory !== "trending") {
      const response = await axios.get(`${import.meta.env.VITE_TMDB_URL}/${mediaType}/${mediaCategory}?api_key=${import.meta.env.VITE_TMDB_API_KEY}`, {
        params: {
          page: page
        }
      })

      return response.data
    } else {
      const response = await axios.get(`${import.meta.env.VITE_TMDB_URL}/${mediaCategory}/${mediaType}/week?api_key=${import.meta.env.VITE_TMDB_API_KEY}`, {
        params: {
          page: page
        }
      })

      return response.data
    }
  }

  const loadMorePopular = async () => {
    try {
      const nextPage = popularPage + 1;

      const data = await fetchData(
        "movie",
        "popular",
        nextPage
      );

      setPopularMovies(prev => {
        const merged = [...prev, ...data.results];

        return Array.from(
          new Map(
            merged.map(movie => [movie.id, movie])
          ).values()
        );
      });

      setPopularPage(nextPage);
    } catch (error) {
      console.log(error);
    }
  };

  const loadMoreTopRated = async () => {
    try {
      const nextPage = topRatedPage + 1;

      const data = await fetchData(
        "movie",
        "top_rated",
        nextPage
      );

      setTopRated(prev => {
        const merged = [...prev, ...data.results];

        return Array.from(
          new Map(
            merged.map(movie => [movie.id, movie])
          ).values()
        );
      });

      setTopRatedPage(nextPage);
    } catch (error) {
      console.log(error);
    }
  };

  const loadMoreUpcoming = async () => {
    try {
      const nextPage = upcomingPage + 1;

      const data = await fetchData(
        "movie",
        "upcoming",
        nextPage
      );

      setUpcoming(prev => {
        const merged = [...prev, ...data.results];

        return Array.from(
          new Map(
            merged.map(movie => [movie.id, movie])
          ).values()
        );
      });

      setUpcomingPage(nextPage);
    } catch (error) {
      console.log(error);
    }
  };

  const loadMoreTrending = async () => {
    try {
      const nextPage = trendingPage + 1;

      const data = await fetchData(
        "movie",
        "trending",
        nextPage
      );

      setTrending(prev => {
        const merged = [...prev, ...data.results];

        return Array.from(
          new Map(
            merged.map(movie => [movie.id, movie])
          ).values()
        );
      });

      setTrendingPage(nextPage);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    loadMoreTrending(),
      loadMorePopular(),
      loadMoreTopRated(),
      loadMoreUpcoming()
  }, []);

  useEffect(() => {
    setAllContent([
      ...trending,
      ...popularMovies,
      ...topRated,
      ...upcoming
    ]);
  }, [trending, popularMovies, topRated, upcoming]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Hero Banner */}
      <HeroBanner
        movies={allContent}
        genres={genres}
        favorites={favorites}
        fetchFavorites={fetchFavorites}
      />

      {/* Content Sections */}
      <div className="px-4 lg:px-8 mt-10 relative z-10">

        <SectionRow
          title="🔥 Trending Now"
          subtitle="What everyone is watching"
          items={trending || []}
          onLoadMore={loadMoreTrending}
          genres={genres}
          favorites={favorites}
          fetchFavorites={fetchFavorites}
        />

        <SectionRow
          title="🎬 Popular Movies"
          subtitle="Most watched this month"
          items={popularMovies || []}
          onLoadMore={loadMorePopular}
          genres={genres}
          favorites={favorites}
          fetchFavorites={fetchFavorites}
        />

        <SectionRow
          title="⭐ Top Rated"
          subtitle="Critically acclaimed content"
          items={topRated || []}
          onLoadMore={loadMoreTopRated}
          genres={genres}
          favorites={favorites}
          fetchFavorites={fetchFavorites}
        />

        <SectionRow
          title="Upcoming"
          subtitle="What is coming next"
          items={upcoming || []}
          onLoadMore={loadMoreUpcoming}
          genres={genres}
          favorites={favorites}
          fetchFavorites={fetchFavorites}
        />

        {favorites?.length > 0 && (
          <SectionRow
            title="❤️ My Favorites"
            subtitle="Your personal collection"
            items={favorites}
            genres={genres}
            favorites={favorites}
            fetchFavorites={fetchFavorites}
          />
        )}

      </div>
    </motion.div>
  );
}
