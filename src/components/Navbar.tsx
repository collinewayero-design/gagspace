import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Hexagon, ShieldCheck } from 'lucide-react';

interface NavbarProps {
  isAdmin?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ isAdmin }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Projects', path: '/projects' },
    { name: 'Contact', path: '/contact' },
    { name: 'Join Me', path: '/join' },
  ];

  if (isAdmin) {
    navLinks.push({ name: 'Workspace', path: '/admin' });
  }

  return (
    <nav 
      className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled ? 'bg-paper/90 backdrop-blur-md shadow-sm py-4' : 'bg-transparent py-6'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2 group">
          <Hexagon className="w-8 h-8 text-ink group-hover:text-accent transition-colors stroke-[1.5]" />
          <span className="font-serif text-2xl font-bold tracking-tight text-ink">GigSpace</span>
          {isAdmin && <ShieldCheck className="w-4 h-4 text-green-600 ml-1" />}
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`text-sm font-medium tracking-wide transition-colors duration-200 ${
                location.pathname === link.path 
                  ? 'text-accent' 
                  : 'text-ink-light hover:text-ink'
              }`}
            >
              {link.name}
            </Link>
          ))}
          <Link 
            to="/projects" 
            className="px-5 py-2 bg-ink text-paper rounded-full text-sm font-medium hover:bg-accent transition-colors duration-300 shadow-sm"
          >
            View Work
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button 
          className="md:hidden p-2 text-ink"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="absolute top-full left-0 w-full bg-paper border-b border-gray-200 md:hidden animate-fade-in shadow-xl">
          <div className="flex flex-col p-6 gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="text-lg font-medium text-ink hover:text-accent"
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};