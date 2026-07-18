import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { HiSearch, HiMenu, HiX, HiBell } from 'react-icons/hi';
import { MdMovie } from 'react-icons/md';
import { useSidebar } from '../context/SidebarContext';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const location = useLocation();
  const { toggle } = useSidebar();
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Movies', path: '/movies?genre=All' },
    { name: 'Favorites', path: '/favorites?genre=All' },
    { name: "Search", path: "/search" },
  ];

  const initials = user?.displayName
    ? user.displayName
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase()
    : "";

  const handleLogout = async () => {
    await logout()
    navigate("/");
  }

  const handleSearch = () => {
    navigate(`/search`);
  };

  useEffect(() => {
  const handler = (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "k") {
      e.preventDefault();
      navigate("/search");
    }
  };

  window.addEventListener("keydown", handler);

  return () => window.removeEventListener("keydown", handler);
}, []);

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
              <motion.button
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                onClick={() => handleSearch()}
                className="btn-icon"
                aria-label="Search"
              >
                <HiSearch className="w-5 h-5" />
              </motion.button>
          </AnimatePresence>

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
