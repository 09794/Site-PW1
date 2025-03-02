import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaSearch, FaFire, FaTags, FaHome } from 'react-icons/fa';

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const navItems = [
    { path: '/', icon: FaHome, label: 'Início' },
    { path: '/buscar', icon: FaSearch, label: 'Buscar' },
    { path: '/populares', icon: FaFire, label: 'Populares' },
    { path: '/generos', icon: FaTags, label: 'Gêneros' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <nav className="w-full bg-white/90 dark:bg-gray-800/90 shadow-lg shadow-gray-100/20 dark:shadow-gray-900/20 backdrop-blur-md">
        <div className="max-w-7xl w-full mx-auto px-4 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center"
            >
              <Link to="/" className="flex items-center space-x-2">
                <span className="text-2xl font-bold text-blue-600">
                  MangáFinder
                </span>
              </Link>
            </motion.div>
            
            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8">
              {navItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  isActive={isActive(item.path)}
                >
                  <div className="flex items-center space-x-1">
                    <item.icon className="mr-2" />
                    {item.label}
                  </div>
                </NavLink>
              ))}
            </div>

            {/* Mobile Menu Button */}
            <div className="flex items-center md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="Menu"
              >
                <svg
                  className="w-6 h-6 text-gray-700 dark:text-gray-200"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  {isMenuOpen ? (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  ) : (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden border-t border-gray-200 dark:border-gray-700 bg-white/90 dark:bg-gray-800/90 backdrop-blur-md"
            >
              <div className="max-w-7xl w-full mx-auto px-4 py-4 space-y-4">
                {navItems.map((item) => (
                <MobileNavLink 
                    key={item.path}
                    to={item.path}
                    isActive={isActive(item.path)}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <div className="flex items-center space-x-1">
                      <item.icon />
                      {item.label}
                    </div>
                  </MobileNavLink>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
}

const NavLink = ({ to, children, isActive }) => (
  <motion.div
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
  >
    <Link
      to={to}
      className={`font-medium transition-colors ${
        isActive
          ? "text-blue-600"
          : "text-gray-700 dark:text-gray-200 hover:text-blue-600"
      }`}
    >
      {children}
    </Link>
  </motion.div>
);

const MobileNavLink = ({ to, children, onClick, isActive }) => (
  <motion.div whileTap={{ scale: 0.95 }}>
    <Link
      to={to}
      onClick={onClick}
      className={`block font-medium transition-colors ${
        isActive
          ? "text-blue-600"
          : "text-gray-700 dark:text-gray-200 hover:text-blue-600"
      }`}
    >
      {children}
    </Link>
  </motion.div>
);

export default Navbar; 