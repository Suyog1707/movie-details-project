import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import MoviesPage from './pages/MoviesPage'; import FavoritesPage from './pages/FavoritesPage';
import DetailsPage from './pages/DetailsPage';
import SearchPage from './pages/SearchPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import { SidebarProvider } from './context/SidebarContext';
import { useAuth } from './context/AuthContext';
import { useState } from 'react';
import { useEffect } from 'react';
import loadingIcon from "../public/loading.svg"
import axiosClient from './axios/axiosClient';
import axios from 'axios';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen"><img src={loadingIcon} className=' justify-center item-center w-24 h-24'></img></div>;
  }

  return user
    ? children
    : <Navigate to="/login" replace />;
};

const PublicRoute = ({ children }) => {
  const { user } = useAuth();

  return user
    ? <Navigate to="/" replace />
    : children;
};

function App() {

  const { checkAuth } = useAuth();

  const [favorites, setFavorites] = useState([])
  const [genres, setGenres] = useState([])

  const fetchFavorites = async () => {
    const response = await axiosClient.get(`/api/v1/user/favorites`)
    setFavorites(
      response.data
    )
  }

  const fetchGenres = async () => {
    const response = await axios.get(`${import.meta.env.VITE_TMDB_URL}/genre/movie/list?api_key=${import.meta.env.VITE_TMDB_API_KEY}`)
    setGenres(response.data.genres)
  }

  useEffect(() => {
    if (!checkAuth) return;

    fetchFavorites();
    fetchGenres()
  }, [checkAuth]);

  return (
    <Router>
      <SidebarProvider>
        <Routes>
          <Route path="/" element={
            <Layout
              genres={genres}
            />
          }>
            <Route path="login" element={
              <PublicRoute>
                <LoginPage />
              </PublicRoute>
            } />
            <Route path="register" element={
              <PublicRoute>
                <RegisterPage />
              </PublicRoute>
            } />
            <Route index element={
              <ProtectedRoute>
                <HomePage
                  genres={genres}
                  favorites={favorites}
                  fetchFavorites={fetchFavorites}
                />
              </ProtectedRoute>
            } />
            <Route path="movies" element={
              <ProtectedRoute>
                <MoviesPage
                  genres={genres}
                  favorites={favorites}
                  fetchFavorites={fetchFavorites}
                />
              </ProtectedRoute>
            } />
            <Route path="details/:mediaId" element={
              <ProtectedRoute>
                <DetailsPage
                  genres={genres}
                  favorites={favorites}
                  fetchFavorites={fetchFavorites}
                />
              </ProtectedRoute>
            } />
            <Route path="search" element={
              <ProtectedRoute>
                <SearchPage
                  genres={genres}
                  favorites={favorites}
                  fetchFavorites={fetchFavorites}
                />
              </ProtectedRoute>
            } />
            <Route path="favorites" element={
              <ProtectedRoute>
                <FavoritesPage
                  genres={genres}
                  favorites={favorites}
                  fetchFavorites={fetchFavorites}
                />
              </ProtectedRoute>
            } />
            <Route path="profile" element={
              <ProtectedRoute>
                <ProfilePage favorites={favorites} />
              </ProtectedRoute>
            } />
          </Route>
        </Routes>
      </SidebarProvider>
    </Router>
  );
}

export default App;
