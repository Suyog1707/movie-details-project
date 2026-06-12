import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';

export default function ProfilePage() {

  return (
    <div className="px-4 py-8 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto space-y-6"
      >
        <div className="glass-card p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 mb-6">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-2xl font-bold">
              {initials}
            </div>
            <div>
              <h1 className="text-2xl font-bold">{currentUser?.name}</h1>
              <p className="text-gray-400 text-sm">{currentUser?.email}</p>
              <p className="text-xs text-gray-500 mt-1">Member since {new Date(currentUser?.createdAt).toLocaleDateString()}</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm mb-1 text-gray-300">Display name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-dark-600 border border-white/10 focus:outline-none focus:border-primary"
                required
              />
            </div>

            <div>
              <label className="block text-sm mb-1 text-gray-300">Bio</label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 rounded-lg bg-dark-600 border border-white/10 focus:outline-none focus:border-primary"
              />
            </div>

            <div className="flex items-center gap-3">
              <button type="submit" className="btn-primary">Save profile</button>
              {saved && <span className="text-emerald-300 text-sm">Profile updated!</span>}
            </div>
          </form>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="glass-card p-5">
            <p className="text-sm text-gray-400">Favorites</p>
            <p className="text-2xl font-bold mt-1">{favorites.length}</p>
          </div>
          <div className="glass-card p-5">
            <p className="text-sm text-gray-400">TMDB Source</p>
            <p className="text-2xl font-bold mt-1">Active</p>
          </div>
          <div className="glass-card p-5">
            <p className="text-sm text-gray-400">Account Status</p>
            <p className="text-2xl font-bold mt-1 text-emerald-300">Online</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
