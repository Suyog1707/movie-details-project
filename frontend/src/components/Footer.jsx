import { Link } from 'react-router-dom';
import { FaFacebookF, FaTwitter, FaInstagram, FaYoutube, FaGithub } from 'react-icons/fa';
import { MdMovie } from 'react-icons/md';

export default function Footer() {

  const footerLinks = {
    'Company': ['About Us', 'Careers', 'Press', 'Contact'],
    'Support': ['Help Center', 'Safety', 'Terms of Service', 'Privacy Policy'],
    'Explore': ['Movies', 'TV Shows', 'Trending'],
  };

  const socialLinks = [
    { icon: FaFacebookF, href: '#', label: 'Facebook' },
    { icon: FaTwitter, href: '#', label: 'Twitter' },
    { icon: FaInstagram, href: '#', label: 'Instagram' },
    { icon: FaYoutube, href: '#', label: 'YouTube' },
    { icon: FaGithub, href: '#', label: 'GitHub' },
  ];


  return (
    <footer className="bg-dark-800 border-t border-white/5 mt-16">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Top section */}
        <div className="py-12 grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-red-700 rounded-lg flex items-center justify-center">
                <MdMovie className="w-4 h-4 text-white" />
              </div>
              <span className="font-display font-bold text-lg">
                Cine<span className="text-primary">Verse</span>
              </span>
            </Link>
            <p className="text-xs text-gray-500 leading-relaxed mb-4">
              Your ultimate destination for discovering movies and TV shows. Stream, explore, and enjoy cinematic experiences.
            </p>
            {/* Social Links */}
            <div className="flex items-center gap-2">
              {socialLinks.map(social => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="w-8 h-8 rounded-full bg-white/5 hover:bg-primary/20 hover:text-primary 
                    border border-white/5 hover:border-primary/30 flex items-center justify-center 
                    text-gray-400 transition-all duration-300"
                >
                  <social.icon className="w-3.5 h-3.5" />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="font-semibold text-sm text-white mb-3">{title}</h4>
              <ul className="space-y-2">
                {links.map(link => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-xs text-gray-500 hover:text-white transition-colors duration-200"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="py-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[11px] text-gray-600">
            © {new Date().getFullYear()} CineVerse. All rights reserved. Made with ❤️
          </p>
          <div className="flex items-center gap-4 text-[11px] text-gray-600">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
