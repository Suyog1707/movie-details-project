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

function RequireAuth({ children }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <FavoritesProvider>
          <SidebarProvider>
            <Routes>
              <Route path="/" element={<Layout />}>
                <Route index element={<HomePage />} />
                <Route path="movies" element={<MoviesPage />} />
                <Route path="tv-shows" element={<TVShowsPage />} />
                <Route path="favorites" element={<FavoritesPage />} />
                <Route path="details/:id" element={<DetailsPage />} />
                <Route path="search" element={<SearchPage />} />
                <Route path="login" element={<LoginPage />} />
                <Route path="register" element={<RegisterPage />} />
                <Route
                  path="profile"
                  element={(
                    <RequireAuth>
                      <ProfilePage />
                    </RequireAuth>
                  )}
                />
              </Route>
            </Routes>
          </SidebarProvider>
        </FavoritesProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
