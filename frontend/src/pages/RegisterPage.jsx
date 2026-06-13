import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function RegisterPage() {

  const [userNmae, setUserName] = useState("")
  const [displayName, setDisplayName] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  const handleSignUp = async (e) => {
    e.preventDefault()

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/v1/user/signup`,
        {
          userNmae,
          displayName,
          password,
          confirmPassword
        }
      );

      console.log(response.data)

      localStorage.setItem("token", response.data.token);

    } catch (error) {
      console.error(error.response?.data);
    }
  }

  return (
    <div className="min-h-[calc(100vh-8rem)] px-4 py-10 lg:px-8 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md glass-card p-6 sm:p-8"
      >
        <h1 className="text-2xl font-bold mb-1">Create your account</h1>
        <p className="text-sm text-gray-400 mb-6">Register to personalize your TMDB movie experience.</p>

        {error && <div className="mb-4 rounded-lg bg-red-500/20 text-red-200 text-sm px-3 py-2">{error}</div>}

        <form onSubmit={handleSignUp} className="space-y-4">
          <div>
            <label className="block text-sm mb-1 text-gray-300">Username</label>
            <input
              type="text"
              value={userNmae}
              onChange={(e) => setUserName(e.target.value)}
              required
              className="w-full px-3 py-2 rounded-lg bg-dark-600 border border-white/10 focus:outline-none focus:border-primary"
              placeholder="Your name"
            />
          </div>

          <div>
            <label className="block text-sm mb-1 text-gray-300">Display name</label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
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
              placeholder="Minimum 6 characters"
            />
          </div>

          <div>
            <label className="block text-sm mb-1 text-gray-300">Confirm password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full px-3 py-2 rounded-lg bg-dark-600 border border-white/10 focus:outline-none focus:border-primary"
              placeholder="Re-enter password"
            />
          </div>

          <button type="submit" className="btn-primary w-full">Register</button>
        </form>

        <p className="text-sm text-gray-400 mt-5">
          Already have an account?{' '}
          <Link to="/login" className="text-primary hover:text-red-400 transition-colors">
            Sign in
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
