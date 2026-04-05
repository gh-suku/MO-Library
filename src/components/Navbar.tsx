import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Session } from "@supabase/supabase-js";
import { supabase, isAdmin } from "../lib/supabase";
import {
  BookOpen,
  Menu,
  X,
  User,
  Shield,
  Home,
  LayoutDashboard,
  CalendarCheck,
  Sun,
  Moon,
  ChevronDown,
} from "lucide-react";
import toast from "react-hot-toast";

interface NavbarProps {
  session: Session | null;
}

const Navbar: React.FC<NavbarProps> = ({ session }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [userIsAdmin, setUserIsAdmin] = useState(false);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [showBooksDropdown, setShowBooksDropdown] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    // Load theme from localStorage
    const savedTheme = localStorage.getItem('theme') as 'dark' | 'light' || 'dark';
    setTheme(savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  useEffect(() => {
    if (session) {
      const checkAdminStatus = async () => {
        const adminStatus = await isAdmin();
        setUserIsAdmin(adminStatus);
      };

      checkAdminStatus();
    } else {
      setUserIsAdmin(false);
    }
  }, [session]);



  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "glass-effect py-2" : "bg-transparent py-4"
      }`}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-2">
            <motion.div
              initial={{ rotate: -10 }}
              animate={{ rotate: 10 }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatType: "reverse",
              }}
            >
              <BookOpen className="w-8 h-8 text-primary" />
            </motion.div>
            <span className="text-xl font-bold gradient-text">Mo-Library</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-4">
            <Link
              to="/"
              className="text-white hover:text-primary transition-colors flex items-center"
            >
              <Home className="w-5 h-5 mr-1" />
              Home
            </Link>
            {session ? (
              <>
                <Link
                  to="/dashboard"
                  className="text-white hover:text-primary transition-colors flex items-center"
                >
                  <LayoutDashboard className="w-5 h-5 mr-1" />
                  Dashboard
                </Link>
                <Link
                  to="/seat-booking"
                  className="text-white hover:text-primary transition-colors flex items-center"
                >
                  <CalendarCheck className="w-5 h-5 mr-1" />
                  Seats
                </Link>
                
                {/* Books Dropdown */}
                <div className="relative">
                  <button
                    onMouseEnter={() => setShowBooksDropdown(true)}
                    onMouseLeave={() => setShowBooksDropdown(false)}
                    className="text-white hover:text-primary transition-colors flex items-center"
                  >
                    <BookOpen className="w-5 h-5 mr-1" />
                    Books
                    <ChevronDown className="w-4 h-4 ml-1" />
                  </button>
                  {showBooksDropdown && (
                    <div 
                      className="absolute top-full mt-2 w-48 glass-effect rounded-lg shadow-lg py-2 z-50"
                      onMouseEnter={() => setShowBooksDropdown(true)}
                      onMouseLeave={() => setShowBooksDropdown(false)}
                    >
                      <Link
                        to="/book-search"
                        className="block px-4 py-2 text-white hover:bg-primary/20 transition-colors"
                      >
                        Browse Books
                      </Link>
                      <Link
                        to="/my-reading"
                        className="block px-4 py-2 text-white hover:bg-primary/20 transition-colors"
                      >
                        My Reading
                      </Link>
                      <Link
                        to="/book-request"
                        className="block px-4 py-2 text-white hover:bg-primary/20 transition-colors"
                      >
                        Request Book
                      </Link>
                    </div>
                  )}
                </div>

                <Link
                  to="/learning-paths"
                  className="text-white hover:text-primary transition-colors flex items-center"
                >
                  <BookOpen className="w-5 h-5 mr-1" />
                  Roadmap
                </Link>

                <Link
                  to="/community"
                  className="text-white hover:text-primary transition-colors flex items-center"
                >
                  <BookOpen className="w-5 h-5 mr-1" />
                  Community
                </Link>

                {userIsAdmin && (
                  <Link
                    to="/admin"
                    className="text-white hover:text-primary transition-colors flex items-center"
                  >
                    <Shield className="w-4 h-4 mr-1" />
                    Admin
                  </Link>
                )}
                
                <Link
                  to="/profile"
                  className="flex items-center text-white hover:text-primary transition-colors"
                >
                  <User className="w-5 h-5" />
                </Link>
                
                {/* Theme Toggle at the end */}
                <button
                  onClick={toggleTheme}
                  className="text-white hover:text-primary transition-colors flex items-center p-2"
                  aria-label="Toggle theme"
                >
                  {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </button>
              </>
            ) : (
              <>
                <div className="flex items-center space-x-3">
                  <Link
                    to="/login"
                    className="px-4 py-2 rounded-md text-white hover:text-primary transition-colors"
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    className="px-4 py-2 rounded-md gradient-bg text-white hover:opacity-90 transition-opacity"
                  >
                    Sign Up
                  </Link>
                </div>
                {/* Theme Toggle at the end for non-logged in users */}
                <button
                  onClick={toggleTheme}
                  className="text-white hover:text-primary transition-colors flex items-center p-2"
                  aria-label="Toggle theme"
                >
                  {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </button>
              </>
            )}
          </div>

          {/* Mobile Navigation Toggle */}
          <button
            className="lg:hidden text-white focus:outline-none"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="lg:hidden glass-effect mt-2 py-4 px-4"
        >
          <div className="flex flex-col space-y-4">
            <Link
              to="/"
              className="text-white hover:text-primary transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Home
            </Link>
            {session ? (
              <>
                <Link
                  to="/dashboard"
                  className="text-white hover:text-primary transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  Dashboard
                </Link>
                <Link
                  to="/seat-booking"
                  className="text-white hover:text-primary transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  Book a Seat
                </Link>
                <Link
                  to="/book-search"
                  className="text-white hover:text-primary transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  Browse Books
                </Link>
                <Link
                  to="/my-reading"
                  className="text-white hover:text-primary transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  My Reading
                </Link>
                <Link
                  to="/learning-paths"
                  className="text-white hover:text-primary transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  Roadmap
                </Link>
                <Link
                  to="/book-request"
                  className="text-white hover:text-primary transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  Request Book
                </Link>
                <Link
                  to="/community"
                  className="text-white hover:text-primary transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  Community
                </Link>
                {userIsAdmin && (
                  <Link
                    to="/admin"
                    className="text-white hover:text-primary transition-colors flex items-center"
                    onClick={() => setIsOpen(false)}
                  >
                    <Shield className="w-4 h-4 mr-1" />
                    Admin
                  </Link>
                )}
                <Link
                  to="/profile"
                  className="text-white hover:text-primary transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  Profile
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-white hover:text-primary transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="text-white hover:text-primary transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  Sign Up
                </Link>
              </>
            )}
            {/* Theme Toggle at the end */}
            <button
              onClick={() => {
                toggleTheme();
                setIsOpen(false);
              }}
              className="text-left text-white hover:text-primary transition-colors flex items-center"
            >
              {theme === 'dark' ? (
                <>
                  <Sun className="w-5 h-5 mr-2" />
                  Light Mode
                </>
              ) : (
                <>
                  <Moon className="w-5 h-5 mr-2" />
                  Dark Mode
                </>
              )}
            </button>
          </div>
        </motion.div>
      )}
    </nav>
  );
};

export default Navbar;
