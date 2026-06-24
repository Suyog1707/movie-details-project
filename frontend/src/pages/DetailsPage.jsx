import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiStar, HiPlay, HiHeart, HiCalendar, HiClock, HiFilm, HiGlobe, HiArrowLeft } from 'react-icons/hi';
import CastCard from '../components/CastCard';
import TrailerCard from '../components/TrailerCard';
import OTTCard from '../components/OTTCard';
import MovieCard from '../components/MovieCard';
import axiosClient from '../axios/axiosClient';
import { useEffect, useState } from 'react';
import { isFavorite } from '../utils/IsFavorite';
import { toggleFavorites } from '../utils/toggleFavorite';
import axios from 'axios';

export default function DetailsPage({ genres, favorites, fetchFavorites }) {

  const { mediaId } = useParams();
  const [item, setItem] = useState(null)
  const [activeProviderTab, setActiveProviderTab] = useState("flatrate");

  const loadItems = async () => {
    const mediaType = "movie"
    const response = await axiosClient.get(`/api/v1/${mediaType}/detail/${mediaId}`)
    const providers = await axios.get(`${import.meta.env.VITE_TMDB_URL}/movie/${mediaId}/watch/providers?api_key=${import.meta.env.VITE_TMDB_API_KEY}`)
    const data = {
      ...response.data,
      watchProviders: providers?.data?.results?.IN || null
    }
    setItem(data)
  };
  useEffect(() => {
    loadItems()
  }, [mediaId])

  useEffect(() => {
    if (!item?.watchProviders) return;

    if (item.watchProviders.flatrate) {
      setActiveProviderTab("flatrate");
    } else if (item.watchProviders.buy) {
      setActiveProviderTab("buy");
    } else if (item.watchProviders.rent) {
      setActiveProviderTab("rent");
    }
  }, [item]);

  if (!item) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <p className="text-2xl mb-4">😕</p>
          <p className="text-gray-400 text-lg">Content not found</p>
          <Link to="/" className="text-primary text-sm mt-2 inline-block hover:underline">Back to Home</Link>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      {/* Backdrop Hero */}
      <div className="relative h-[50vh] min-h-[400px] overflow-hidden">
        <img
          src={`${import.meta.env.VITE_IMG_URL}${item.backdrop_path}`}
          alt={item.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 gradient-overlay" />
        <div className="absolute inset-0 gradient-overlay-left" />

        {/* Back button */}
        <Link to="/" className="absolute top-4 left-4 btn-icon z-10">
          <HiArrowLeft className="w-5 h-5" />
        </Link>
      </div>

      {/* Content */}
      <div className="px-4 lg:px-8 -mt-40 relative z-10">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Poster */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex-shrink-0"
          >
            <img
              src={`${import.meta.env.VITE_IMG_URL}${item.poster_path}`}
              alt={item.title}
              className="w-48 md:w-56 rounded-xl shadow-2xl shadow-black/50 border border-white/10"
            />
          </motion.div>

          {/* Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex-1"
          >
            {/* Genre tags */}
            <div className="flex flex-wrap gap-2 mb-3">
              {item.genres.map(genre => (
                <span key={genre.id} className="px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider 
                  bg-white/10 backdrop-blur-sm rounded-full border border-white/10">
                  {genre.name}
                </span>
              ))}
            </div>

            <h1 className="font-display font-black text-3xl md:text-4xl lg:text-5xl mb-2">
              {item.title}
            </h1>

            {item.tagline && (
              <p className="text-gray-400 italic text-sm mb-4">{item.tagline}</p>
            )}

            {/* Meta Row */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-300 mb-4">
              <span className="flex items-center gap-1 text-accent-gold font-bold text-base">
                <HiStar className="w-5 h-5" /> {item.vote_average === 0 ? item.vote_average : Math.fround(item.vote_average).toFixed(1)}/10
              </span>
              <span className="flex items-center gap-1">
                <HiCalendar className="w-4 h-4" /> {item.release_date}
              </span>
              <span className="flex items-center gap-1">
                <HiClock className="w-4 h-4" /> {item.runtime}
              </span>
            </div>

            {/* Details Grid */}
            <div>
              <div className="flex items-center mb-4 gap-1">
                <HiGlobe className="w-4 h-4 text-gray-500" />
                <span className="text-gray-500">Languages:</span>
                <span className="ml-1 text-white">{item.spoken_languages.map((language, index) => {
                  if (index !== item.spoken_languages.length - 1) {
                    return (
                      <span key={language.iso_639_1}>
                        {language.english_name},<span> </span>
                      </span>
                    )
                  } else {
                    return (
                      <span key={language.iso_639_1}>
                        {language.english_name}
                      </span>
                    )
                  }
                })}</span>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <button className="btn-primary flex items-center gap-2">
                <HiPlay className="w-5 h-5" /> Where to Watch
              </button>
              <button
                onClick={() => toggleFavorites(item.id, favorites, fetchFavorites)}
                className={`btn-secondary flex items-center gap-2 ${isFavorite(item.id, favorites) ? '!border-primary !text-primary' : ''
                  }`}
              >
                <HiHeart className={`w-5 h-5 ${isFavorite(item.id, favorites) ? 'fill-primary' : ''}`} />
                {isFavorite(item.id, favorites) ? 'In Favorites' : 'Add to Favorites'}
              </button>
            </div>

            {/* Overview */}
            <div className="mb-6">
              <h3 className="font-display font-bold text-lg mb-2">Overview</h3>
              <p className="text-gray-300 text-sm leading-relaxed">{item.overview}</p>
            </div>

            {/* Rating Stars */}
            <div className="flex items-center gap-1 mb-6">
              {[...Array(5)].map((_, i) => (
                <HiStar
                  key={i}
                  className={`w-5 h-5 ${i < Math.round(item.vote_average / 2) ? 'text-accent-gold' : 'text-gray-700'}`}
                />
              ))}
              <span className="text-sm text-gray-400 ml-2">{item.vote_average === 0 ? item.vote_average : Math.fround(item.vote_average).toFixed(1)}/10</span>
            </div>
          </motion.div>
        </div>

        {/* Cast Section */}
        {item.credits.cast && item.credits.cast.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-10"
          >
            <h2 className="font-display font-bold text-xl mb-4">🎭 Cast</h2>
            <div className="flex gap-4 overflow-x-auto hide-scrollbar pb-4">
              {item.credits.cast.map((actor, index) => (
                <CastCard key={index} actor={actor} index={index} />
              ))}
            </div>
          </motion.section>
        )}
        {item.credits.crew && item.credits.crew.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-10"
          >
            <h2 className="font-display font-bold text-xl mb-4">🎭 Directing Team</h2>
            <div className="flex gap-4 overflow-x-auto hide-scrollbar pb-4">
              {item.credits.crew.map((actor, index) => {
                if (actor.department === "Directing" && actor.profile_path !== null) {
                  return <CastCard key={index} actor={actor} index={index} />
                }
              })}
            </div>
            <h2 className="font-display font-bold text-xl mb-4">🎭 Production Team</h2>
            <div className="flex gap-4 overflow-x-auto hide-scrollbar pb-4">
              {item.credits.crew.map((actor, index) => {
                if (actor.department === "Production" && actor.profile_path !== null) {
                  return <CastCard key={index} actor={actor} index={index} />
                }
              })}
            </div>
            <h2 className="font-display font-bold text-xl mb-4">🎭 Other Crew Members</h2>
            <div className="flex gap-4 overflow-x-auto hide-scrollbar pb-4">
              {item.credits.crew.map((actor, index) => {
                if (actor.department !== "Directing" && actor.department !== "Production" && actor.profile_path !== null) {
                  return <CastCard key={index} actor={actor} index={index} />
                }
              })}
            </div>
          </motion.section>
        )}

        {/* Trailers Section */}
        {item.videos.results && item.videos.results.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-10"
          >
            <h2 className="font-display font-bold text-xl mb-4">🎥 Trailers</h2>
            <div className="flex gap-4 overflow-x-auto hide-scrollbar pb-4">
              {item.videos.results.map((trailer, index) => {
                if (trailer.official === true && trailer.type === "Trailer") {
                  return <TrailerCard key={trailer.id} trailer={trailer} index={index} />
                }
              })}
            </div>
          </motion.section>
        )}

        {/* Where to Watch */}
        {item.watchProviders ? (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-10"
          >
            <h2 className="font-display font-bold text-xl mb-4">📺 Providers</h2>
            <div className="flex gap-2 mb-6">
              {item.watchProviders?.flatrate && (
                <button
                  onClick={() => setActiveProviderTab("flatrate")}
                  className={`px-4 py-2 rounded-lg transition-all ${activeProviderTab === "flatrate"
                    ? "bg-primary text-white"
                    : "bg-white/10 text-gray-400"
                    }`}
                >
                  Streaming
                </button>
              )}

              {item.watchProviders?.buy && (
                <button
                  onClick={() => setActiveProviderTab("buy")}
                  className={`px-4 py-2 rounded-lg transition-all ${activeProviderTab === "buy"
                    ? "bg-primary text-white"
                    : "bg-white/10 text-gray-400"
                    }`}
                >
                  Buy
                </button>
              )}

              {item.watchProviders?.rent && (
                <button
                  onClick={() => setActiveProviderTab("rent")}
                  className={`px-4 py-2 rounded-lg transition-all ${activeProviderTab === "rent"
                    ? "bg-primary text-white"
                    : "bg-white/10 text-gray-400"
                    }`}
                >
                  Rent
                </button>
              )}
            </div>
            <div className="flex gap-4 overflow-x-auto hide-scrollbar pb-4">
              {activeProviderTab === "flatrate" &&
                item.watchProviders?.flatrate?.map((provider, i) => (
                  <OTTCard
                    key={provider.provider_id}
                    type="flatrate"
                    platform={provider}
                    index={i}
                  />
                ))}

              {activeProviderTab === "buy" &&
                item.watchProviders?.buy?.map((provider, i) => (
                  <OTTCard
                    key={provider.provider_id}
                    type="buy"
                    platform={provider}
                    index={i}
                  />
                ))}

              {activeProviderTab === "rent" &&
                item.watchProviders?.rent?.map((provider, i) => (
                  <OTTCard
                    key={provider.provider_id}
                    type="rent"
                    platform={provider}
                    index={i}
                  />
                ))}
            </div>
          </motion.section>
        ) : (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-10"
          >
            <h2 className="font-display font-bold text-xl mb-4">📺 Providers</h2>
            <div className="flex gap-4 overflow-x-auto hide-scrollbar pb-4">
              <span>There is no Provider for this movie</span>
            </div>
          </motion.section>
        )}

        {/* Related Content */}
        {item.recommend?.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="mt-10 mb-8"
          >
            <h2 className="font-display font-bold text-xl mb-4">🔗 Related Content</h2>
            <div className="flex gap-4 overflow-x-auto hide-scrollbar pb-4">
              {item.recommend?.map((movie, index) => (
                <MovieCard key={index} genres={genres} movie={movie} index={index} favorites={favorites} fetchFavorites={fetchFavorites} />
              ))}
            </div>
          </motion.section>
        )}
      </div>
    </motion.div>
  );
}
