import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { HiSearch, HiMenu, HiX, HiBell } from 'react-icons/hi';
import { MdMovie } from 'react-icons/md';
import { useSidebar } from '../context/SidebarContext';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const location = useLocation();
  const { toggle } = useSidebar();
  const navigate = useNavigate();
  const { isAuthenticated, currentUser, logout } = useAuth();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Movies', path: '/movies' },
    { name: 'TV Shows', path: '/tv-shows' },
    { name: 'Favorites', path: '/favorites' },
  ];

  const initials = currentUser?.displayName
    ? currentUser.displayName
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase()
    : "";

  const handleLogout = () => {
    logout(),
    navigate("/");
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/5">
      <div className="flex items-center justify-between px-4 lg:px-8 h-16">
        {/* Left: Logo + Brand + Hamburger */}
        <div className="flex items-center gap-3">
          <button
            onClick={toggle}
            className="lg:hidden p-2 rounded-lg hover:bg-white/10 transition-colors"
            aria-label="Toggle sidebar"
          >
            <HiMenu className="w-6 h-6" />
          </button>

          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 bg-gradient-to-br from-primary to-red-700 rounded-lg flex items-center justify-center shadow-lg shadow-primary/20 group-hover:shadow-primary/40 transition-shadow">
              <MdMovie className="w-5 h-5 text-white" />
            </div>
            <span className="font-display font-bold text-xl tracking-tight hidden sm:block">
              Cine<span className="text-primary">Verse</span>
            </span>
          </Link>
        </div>

        {/* Center: Nav Links (desktop) */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map(link => (
            <Link
              key={link.path}
              to={link.path}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${location.pathname === link.path
                ? 'text-white bg-white/10'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Right: Search, Notification, Profile */}
        <div className="flex items-center gap-2">
          {/* Search */}
          <AnimatePresence>
            {searchOpen ? (
              <motion.form
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: 250, opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                onSubmit={handleSearch}
                className="flex items-center overflow-hidden"
              >
                <div className="flex items-center bg-dark-600 border border-white/10 rounded-lg px-3 py-2 w-full">
                  <HiSearch className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search movies, shows..."
                    className="bg-transparent text-sm text-white placeholder-gray-500 ml-2 outline-none w-full"
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => setSearchOpen(false)}
                    className="ml-1 flex-shrink-0"
                  >
                    <HiX className="w-4 h-4 text-gray-400 hover:text-white" />
                  </button>
                </div>
              </motion.form>
            ) : (
              <motion.button
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                onClick={() => setSearchOpen(true)}
                className="btn-icon"
                aria-label="Search"
              >
                <HiSearch className="w-5 h-5" />
              </motion.button>
            )}
          </AnimatePresence>

          {/* Notifications */}
          <div className="relative hidden sm:block">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="btn-icon relative"
              aria-label="Notifications"
            >
              <HiBell className="w-5 h-5" />
              <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-primary rounded-full border-2 border-dark-900" />
            </button>
            <AnimatePresence>
              {showNotifications && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 top-12 w-72 glass-card p-4 shadow-2xl"
                >
                  <h4 className="font-semibold text-sm mb-3">Notifications</h4>
                  <div className="space-y-3">
                    {['New release: Starbound now streaming', 'Your watchlist was updated', 'Neon Samurai trailer is live'].map((n, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs text-gray-300 hover:text-white cursor-pointer">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                        {n}
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Auth actions */}
          {isAuthenticated ? (
            <>
              <Link
                to="/profile"
                className="w-8 h-8 rounded-full overflow-hidden border-2 border-white/20 hover:border-primary transition-colors"
                title="Profile"
              >
                <div className="w-full h-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-xs font-semibold text-white">
                  {initials}
                </div>
              </Link>
              <button
                onClick={handleLogout}
                className="hidden sm:inline-flex px-3 py-1.5 rounded-lg text-xs font-medium bg-white/10 hover:bg-white/20 transition-colors"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="hidden sm:inline-flex px-3 py-1.5 rounded-lg text-xs font-medium bg-white/10 hover:bg-white/20 transition-colors"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="inline-flex px-3 py-1.5 rounded-lg text-xs font-medium bg-primary hover:bg-red-700 transition-colors"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Mobile Nav Links */}
      <div className="md:hidden flex items-center gap-1 px-4 pb-2 overflow-x-auto hide-scrollbar">
        {navLinks.map(link => (
          <Link
            key={link.path}
            to={link.path}
            className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${location.pathname === link.path
              ? 'bg-primary text-white'
              : 'bg-white/5 text-gray-400 hover:text-white'
              }`}
          >
            {link.name}
          </Link>
        ))}
        {!isAuthenticated ? (
          <>
            <Link
              to="/login"
              className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${location.pathname === '/login'
                ? 'bg-primary text-white'
                : 'bg-white/5 text-gray-400 hover:text-white'
                }`}
            >
              Login
            </Link>
            <Link
              to="/register"
              className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${location.pathname === '/register'
                ? 'bg-primary text-white'
                : 'bg-white/5 text-gray-400 hover:text-white'
                }`}
            >
              Register
            </Link>
          </>
        ) : (
          <Link
            to="/profile"
            className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${location.pathname === '/profile'
              ? 'bg-primary text-white'
              : 'bg-white/5 text-gray-400 hover:text-white'
              }`}
          >
            Profile
          </Link>
        )}
      </div>
    </nav>
  );
}
