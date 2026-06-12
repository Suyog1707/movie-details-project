import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    try {
      login({ email, password });
      const redirectTo = location.state?.from?.pathname || '/profile';
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError(err.message || 'Unable to log in right now.');
    }
  };

  return (
    <div className="min-h-[calc(100vh-8rem)] px-4 py-10 lg:px-8 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md glass-card p-6 sm:p-8"
      >
        <h1 className="text-2xl font-bold mb-1">Welcome back</h1>
        <p className="text-sm text-gray-400 mb-6">Sign in to manage your TMDB movie profile.</p>

        {error && <div className="mb-4 rounded-lg bg-red-500/20 text-red-200 text-sm px-3 py-2">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm mb-1 text-gray-300">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2 rounded-lg bg-dark-600 border border-white/10 focus:outline-none focus:border-primary"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-sm mb-1 text-gray-300">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-3 py-2 rounded-lg bg-dark-600 border border-white/10 focus:outline-none focus:border-primary"
              placeholder="••••••••"
            />
          </div>

          <button type="submit" className="btn-primary w-full">Sign In</button>
        </form>

        <p className="text-sm text-gray-400 mt-5">
          New here?{' '}
          <Link to="/register" className="text-primary hover:text-red-400 transition-colors">
            Create an account
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
