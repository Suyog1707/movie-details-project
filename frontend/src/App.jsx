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

function PrivateRoute({ children }) {
  const token = localStorage.getItem("token");

  return token ? children : <Navigate to="/login" />;
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
          <PrivateRoute>
            <Route index element={<HomePage />} />
            <Route path="movies" element={<MoviesPage />} />
            <Route path="tv-shows" element={<TVShowsPage />} />
            <Route path="details/:id" element={<DetailsPage />} />
            <Route path="search" element={<SearchPage />} />
            <Route path="favorites" element={<FavoritesPage />} />
            <Route path="profile" element={<ProfilePage />} />
          </PrivateRoute>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
