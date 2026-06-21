import { Outlet, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import Footer from './Footer';

export default function Layout({genres}) {

  return (
    <div className="min-h-screen bg-dark-900 text-white">
      <Navbar />
      <Sidebar genres={genres} />
      <main className="lg:ml-56 pt-16 md:pt-16 min-h-screen">
        <Outlet />
      </main>
      <div className="lg:ml-56">
        <Footer />
      </div>
    </div>
  );
}
