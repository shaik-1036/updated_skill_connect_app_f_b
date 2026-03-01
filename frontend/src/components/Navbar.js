/*
 * Copyright (c) 2026 Your Company Name
 * All rights reserved.
 */
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import '../styles/navbar.css';

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    navigate('/');
    setIsMenuOpen(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const navVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: { opacity: 1, y: 0 },
  };

  const linkVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: (i) => ({
      opacity: 1,
      x: 0,
      transition: { delay: i * 0.1 },
    }),
  };

  const isAuthenticated = location.pathname === '/user-dashboard' || location.pathname === '/admin-dashboard';

  return (
    <motion.nav
      initial="hidden"
      animate="visible"
      variants={navVariants}
      className={`navbar ${isScrolled ? 'scrolled' : ''}`}
    >
      <div className="navbar-container">
        {/* Logo */}
        <Link to="/" className="navbar-logo">
          <motion.div
            whileHover={{ rotate: 180 }}
            transition={{ duration: 0.6 }}
            className="p-2 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg"
          >
            <Sparkles size={24} className="text-white" />
          </motion.div>
          <div>
            <div className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Skill Connect
            </div>
            <div className="text-xs text-gray-600 font-medium">Professional Network</div>
          </div>
        </Link>

        {/* Desktop Menu */}
        <div className="nav-links-desktop md:flex hidden items-center gap-1">
          {isAuthenticated ? (
            <>
              <motion.div
                custom={0}
                variants={linkVariants}
                initial="hidden"
                animate="visible"
              >
                <Link
                  to={location.pathname === '/user-dashboard' ? '/user-dashboard' : '/admin-dashboard'}
                  className="nav-link px-4 py-2 text-gray-700 hover:text-blue-600 font-medium transition-colors"
                >
                  Dashboard
                </Link>
              </motion.div>
              <motion.button
                custom={1}
                variants={linkVariants}
                initial="hidden"
                animate="visible"
                onClick={handleLogout}
                className="nav-button px-6 py-2 ml-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all duration-300 font-medium"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Logout
              </motion.button>
            </>
          ) : (
            <>
              <motion.div custom={0} variants={linkVariants} initial="hidden" animate="visible">
                <Link to="/" className="nav-link px-4 py-2 text-gray-700 hover:text-blue-600 font-medium transition-colors">
                  Home
                </Link>
              </motion.div>
              <motion.div custom={1} variants={linkVariants} initial="hidden" animate="visible">
                <Link to="/old-age-homes" className="nav-link px-4 py-2 text-gray-700 hover:text-blue-600 font-medium transition-colors">
                  Donate to Masjids
                </Link>
              </motion.div>
              <motion.div custom={2} variants={linkVariants} initial="hidden" animate="visible">
                <Link to="/orphans" className="nav-link px-4 py-2 text-gray-700 hover:text-blue-600 font-medium transition-colors">
                  Donate to Madrasa
                </Link>
              </motion.div>
              <motion.div custom={3} variants={linkVariants} initial="hidden" animate="visible">
                <Link
                  to="/login"
                  className="nav-link px-4 py-2 text-gray-700 hover:text-blue-600 font-medium transition-colors"
                >
                  Login
                </Link>
              </motion.div>
              <motion.div custom={4} variants={linkVariants} initial="hidden" animate="visible">
                <Link
                  to="/signup"
                  className="nav-button px-6 py-2 ml-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all duration-300 font-medium"
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                >
                  Get Started
                </Link>
              </motion.div>
              
              <motion.div custom={3} variants={linkVariants} initial="hidden" animate="visible">
                <Link
                  to="/admin-login"
                  className="nav-link px-4 py-2 text-gray-700 hover:text-blue-600 font-medium transition-colors"
                >
                  Admin Login
                </Link>
              </motion.div>
              
            </>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <div className="md:hidden flex items-center">
          <motion.button
            onClick={toggleMenu}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="mobile-menu-btn p-2 text-gray-700 hover:bg-gray-100 rounded-lg"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </motion.button>
        </div>
      </div>

      {/* Mobile Menu */}
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={isMenuOpen ? { opacity: 1, height: 'auto' } : { opacity: 0, height: 0 }}
        transition={{ duration: 0.3 }}
        className={`nav-links-mobile md:hidden overflow-hidden ${isMenuOpen ? 'open' : ''}`}
      >
        <div className="pb-4 space-y-2 border-t border-gray-200">
          {isAuthenticated ? (
            <>
              <Link
                to={location.pathname === '/user-dashboard' ? '/user-dashboard' : '/admin-dashboard'}
                onClick={() => setIsMenuOpen(false)}
                className="mobile-nav-item block px-4 py-3 text-gray-700 hover:bg-blue-50 rounded-lg font-medium transition-colors"
              >
                Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="mobile-nav-button w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium transition-all duration-300"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/"
                onClick={() => setIsMenuOpen(false)}
                className="mobile-nav-item block px-4 py-3 text-gray-700 hover:bg-blue-50 rounded-lg font-medium transition-colors"
              >
                Home
              </Link>
              <Link
                to="/old-age-homes"
                onClick={() => setIsMenuOpen(false)}
                className="mobile-nav-item block px-4 py-3 text-gray-700 hover:bg-blue-50 rounded-lg font-medium transition-colors"
              >
                Donate to Homes
              </Link>
              <Link
                to="/orphans"
                onClick={() => setIsMenuOpen(false)}
                className="mobile-nav-item block px-4 py-3 text-gray-700 hover:bg-blue-50 rounded-lg font-medium transition-colors"
              >
                Donate to Orphans
              </Link>
              <Link
                to="/login"
                onClick={() => setIsMenuOpen(false)}
                className="mobile-nav-item block px-4 py-3 text-gray-700 hover:bg-blue-50 rounded-lg font-medium transition-colors"
              >
                Login
              </Link>
              <Link
                to="/signup"
                onClick={() => setIsMenuOpen(false)}
                className="mobile-nav-button block px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium transition-all duration-300"
              >
                Get Started
              </Link>
            </>
          )}
        </div>
      </motion.div>
    </motion.nav>
  );
}

export default Navbar;
