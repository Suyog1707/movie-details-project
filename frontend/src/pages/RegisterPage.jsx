import axios from "axios";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext"

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [userName, setUserName] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

const handleSignUp = async (e) => {
  e.preventDefault();

  try {
    setError("");

    await register({
      userName,
      displayName,
      password,
      confirmPassword,
    });

    navigate("/login");
  } catch (error) {
    setError(error.response?.data?.message || "Registration failed");
    console.error(error)
  }
};

  return (
    <div className="min-h-[calc(100vh-8rem)] px-4 py-10 lg:px-8 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md glass-card p-6 sm:p-8"
      >
        <h1 className="text-2xl font-bold mb-1">Create your account</h1>
        <p className="text-sm text-gray-400 mb-6">
          Register to personalize your movie experience.
        </p>

        {error && (
          <div className="mb-4 rounded-lg bg-red-500/20 text-red-200 text-sm px-3 py-2">
            {error}
          </div>
        )}

        <form onSubmit={handleSignUp} className="space-y-4">
          <div>
            <label className="block text-sm mb-1 text-gray-300">
              Username
            </label>
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              required
              className="w-full px-3 py-2 rounded-lg bg-dark-600 border border-white/10 focus:outline-none focus:border-primary"
              placeholder="Username"
            />
          </div>

          <div>
            <label className="block text-sm mb-1 text-gray-300">
              Display Name
            </label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              required
              className="w-full px-3 py-2 rounded-lg bg-dark-600 border border-white/10 focus:outline-none focus:border-primary"
              placeholder="Display Name"
            />
          </div>

          <div>
            <label className="block text-sm mb-1 text-gray-300">
              Password
            </label>
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
            <label className="block text-sm mb-1 text-gray-300">
              Confirm Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full px-3 py-2 rounded-lg bg-dark-600 border border-white/10 focus:outline-none focus:border-primary"
              placeholder="Re-enter password"
            />
          </div>

          <button type="submit" className="btn-primary w-full">
            Register
          </button>
        </form>

        <p className="text-sm text-gray-400 mt-5">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-primary hover:text-red-400 transition-colors"
          >
            Sign In
          </Link>
        </p>
      </motion.div>
    </div>
  );
}