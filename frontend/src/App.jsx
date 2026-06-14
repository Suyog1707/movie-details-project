import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import MoviesPage from './pages/MoviesPage';
import TVShowsPage from './pages/TVShowsPage';
import FavoritesPage from './pages/FavoritesPage';
import DetailsPage from './pages/DetailsPage';
import SearchPage from './pages/SearchPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import { SidebarProvider } from './context/SidebarContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { useState } from 'react';
import { useEffect } from 'react';
import axiosClient from '../../backend/src/axios/axios.client';

function PrivateRoute({ children }) {
  const token = localStorage.getItem("token");

  return token ? children : <Navigate to="/login" />;
}

function App() {

  const [favorites, setFavorites] = useState([])

  const fetchFavorites = async () => {
    const response = await axiosClient.get(`${import.meta.env.VITE_BASE_URL}/api/v1/user/favorites`)
    setFavorites(
      response.data
    )
  }

  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) return;

    fetchFavorites();
  }, [isAuthenticated]);

  return (
    <Router>
        <SidebarProvider>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route path="login" element={<LoginPage />} />
              <Route path="register" element={<RegisterPage />} />
              <Route index element={
                <PrivateRoute>
                  <HomePage
                    favorites={favorites}
                    fetchFavorites={fetchFavorites}
                  />
                </PrivateRoute>
              } />
              <Route path="movies" element={
                <PrivateRoute>
                  <MoviesPage
                    favorites={favorites}
                    fetchFavorites={fetchFavorites}
                  />
                </PrivateRoute>
              } />
              <Route path="tv-shows" element={
                <PrivateRoute>
                  <TVShowsPage
                    favorites={favorites}
                    fetchFavorites={fetchFavorites}
                  />
                </PrivateRoute>
              } />
              <Route path="details/:mediaId" element={
                <PrivateRoute>
                  <DetailsPage
                    favorites={favorites}
                    fetchFavorites={fetchFavorites}
                  />
                </PrivateRoute>
              } />
              <Route path="search" element={
                <PrivateRoute>
                  <SearchPage
                    favorites={favorites}
                    fetchFavorites={fetchFavorites}
                  />
                </PrivateRoute>
              } />
              <Route path="favorites" element={
                <PrivateRoute>
                  <FavoritesPage
                    favorites={favorites}
                    fetchFavorites={fetchFavorites}
                  />
                </PrivateRoute>
              } />
              <Route path="profile" element={
                <PrivateRoute>
                  <ProfilePage favorites={favorites} />
                </PrivateRoute>
              } />
            </Route>
          </Routes>
        </SidebarProvider>
    </Router>
  );
}

export default App;
