import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const AuthContext = createContext();

const USERS_KEY = 'cineverse_users';
const CURRENT_USER_KEY = 'cineverse_current_user';

const safeParse = (value, fallback) => {
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
};

export function AuthProvider({ children }) {
  const [users, setUsers] = useState(() => {
    const stored = localStorage.getItem(USERS_KEY);
    return stored ? safeParse(stored, []) : [];
  });

  const [currentUser, setCurrentUser] = useState(() => {
    const stored = localStorage.getItem(CURRENT_USER_KEY);
    return stored ? safeParse(stored, null) : null;
  });

  useEffect(() => {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(currentUser));
    } else {
      localStorage.removeItem(CURRENT_USER_KEY);
    }
  }, [currentUser]);

  const register = ({ name, email, password }) => {
    const normalizedEmail = email.trim().toLowerCase();

    const exists = users.some(user => user.email === normalizedEmail);
    if (exists) {
      throw new Error('An account with this email already exists.');
    }

    const newUser = {
      id: Date.now(),
      name: name.trim(),
      email: normalizedEmail,
      password,
      createdAt: new Date().toISOString(),
      bio: 'Movie lover using TMDB-powered CineVerse 🎬',
    };

    setUsers(prev => [...prev, newUser]);
    setCurrentUser(newUser);
  };

  const login = ({ email, password }) => {
    const normalizedEmail = email.trim().toLowerCase();

    const foundUser = users.find(
      user => user.email === normalizedEmail && user.password === password,
    );

    if (!foundUser) {
      throw new Error('Invalid email or password.');
    }

    setCurrentUser(foundUser);
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const updateProfile = (updates) => {
    if (!currentUser) return;

    const updatedUser = {
      ...currentUser,
      ...updates,
      name: updates.name?.trim() || currentUser.name,
      bio: updates.bio?.trim() || currentUser.bio,
    };

    setCurrentUser(updatedUser);
    setUsers(prev => prev.map(user => (user.id === updatedUser.id ? updatedUser : user)));
  };

  const value = useMemo(
    () => ({
      users,
      currentUser,
      isAuthenticated: Boolean(currentUser),
      register,
      login,
      logout,
      updateProfile,
    }),
    [users, currentUser],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
