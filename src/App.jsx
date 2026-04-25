import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { FavoritesProvider } from './context/FavoritesContext';
import { SidebarProvider } from './context/SidebarContext';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import MoviesPage from './pages/MoviesPage';
import TVShowsPage from './pages/TVShowsPage';
import FavoritesPage from './pages/FavoritesPage';
import DetailsPage from './pages/DetailsPage';
import SearchPage from './pages/SearchPage';

function App() {
  return (
    <Router>
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
            </Route>
          </Routes>
        </SidebarProvider>
      </FavoritesProvider>
    </Router>
  );
}

export default App;
