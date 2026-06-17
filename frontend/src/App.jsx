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
import axiosClient from '../../backend/src/axios/axios.client';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
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

  const fetchFavorites = async () => {
    const response = await axiosClient.get(`/api/v1/user/favorites`)
    setFavorites(
      response.data
    )
  }

  useEffect(() => {
    if (!checkAuth) return;

    fetchFavorites();
  }, [checkAuth]);

  return (
    <Router>
      <SidebarProvider>
        <Routes>
          <Route path="/" element={<Layout />}>
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
              <HomePage
                favorites={favorites}
                fetchFavorites={fetchFavorites}
              />
            } />
            <Route path="movies" element={
              <ProtectedRoute>
                <MoviesPage
                  favorites={favorites}
                  fetchFavorites={fetchFavorites}
                />
              </ProtectedRoute>
            } />
            <Route path="details/:mediaId" element={
              <ProtectedRoute>
                <DetailsPage
                  favorites={favorites}
                  fetchFavorites={fetchFavorites}
                />
              </ProtectedRoute>
            } />
            <Route path="search" element={
              <ProtectedRoute>
                <SearchPage
                  favorites={favorites}
                  fetchFavorites={fetchFavorites}
                />
              </ProtectedRoute>
            } />
            <Route path="favorites" element={
              <ProtectedRoute>
                <FavoritesPage
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
            <Route path="*" element={console.log("not found")} />
          </Route>
        </Routes>
      </SidebarProvider>
    </Router>
  );
}

export default App;
