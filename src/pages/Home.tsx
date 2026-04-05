import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  BookOpen, Clock, Users, BookMarked, Search, Zap, 
  MapPin, Star, TrendingUp, MessageSquare, CreditCard,
  Calendar, Award, Eye, CheckCircle, ArrowRight
} from 'lucide-react';
import { supabase } from '../lib/supabase';

const Home: React.FC = () => {
  const [stats, setStats] = useState({
    totalBooks: 0,
    availableSeats: 0,
    totalUsers: 0,
    activeBookings: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      // Fetch total books
      const { count: booksCount } = await supabase
        .from('books')
        .select('*', { count: 'exact', head: true });

      // Fetch total seats
      const { count: seatsCount } = await supabase
        .from('seats')
        .select('*', { count: 'exact', head: true });

      // Fetch total users
      const { count: usersCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      // Fetch active bookings (upcoming)
      const { count: bookingsCount } = await supabase
        .from('bookings')
        .select('*', { count: 'exact', head: true })
        .gte('end_time', new Date().toISOString());

      setStats({
        totalBooks: booksCount || 0,
        availableSeats: seatsCount || 0,
        totalUsers: usersCount || 0,
        activeBookings: bookingsCount || 0
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const features = [
    {
      icon: <MapPin className="w-10 h-10 text-primary" />,
      title: 'Smart Seat Booking',
      description: 'Reserve your perfect spot with real-time availability, flexible time slots, and instant confirmation.',
    },
    {
      icon: <BookOpen className="w-10 h-10 text-primary" />,
      title: 'Vast Book Collection',
      description: 'Access thousands of physical and digital books across all genres with advanced search and filters.',
    },
    {
      icon: <TrendingUp className="w-10 h-10 text-primary" />,
      title: 'Learning Roadmaps',
      description: 'Follow curated learning paths with structured book recommendations for skill development.',
    },
    {
      icon: <Eye className="w-10 h-10 text-primary" />,
      title: 'Reading Tracker',
      description: 'Track your reading progress, rate books, add notes, and maintain your personal reading list.',
    },
    {
      icon: <MessageSquare className="w-10 h-10 text-primary" />,
      title: 'Community Hub',
      description: 'Connect with fellow readers, share experiences, discuss books, and request new titles.',
    },
    {
      icon: <CreditCard className="w-10 h-10 text-primary" />,
      title: 'Secure Payments',
      description: 'Seamless payment integration with Razorpay for hassle-free seat bookings at ₹5/hour.',
    },
    {
      icon: <Award className="w-10 h-10 text-primary" />,
      title: 'Personal Dashboard',
      description: 'Manage bookings, track reading stats, and access all features from your personalized dashboard.',
    },
    {
      icon: <Zap className="w-10 h-10 text-primary" />,
      title: 'High-Speed Wi-Fi',
      description: 'Stay connected with blazing-fast internet, power outlets at every seat, and a quiet environment.',
    },
  ];

  const displayStats = [
    { number: loading ? '...' : `${stats.totalBooks}+`, label: 'Books Available', icon: <BookOpen className="w-6 h-6" /> },
    { number: loading ? '...' : `${stats.availableSeats}`, label: 'Comfortable Seats', icon: <MapPin className="w-6 h-6" /> },
    { number: '24/7', label: 'Digital Access', icon: <Clock className="w-6 h-6" /> },
    { number: loading ? '...' : `${stats.totalUsers}+`, label: 'Happy Members', icon: <Users className="w-6 h-6" /> },
  ];

  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full filter blur-3xl animate-pulse-slow"></div>
          <div className="absolute bottom-20 right-10 w-80 h-80 bg-secondary/20 rounded-full filter blur-3xl animate-pulse-slow"></div>
        </div>
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-6"
            >
              <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                Welcome to the <span className="gradient-text">Future</span> of Libraries
              </h1>
              <p className="text-xl text-gray-300 dark:text-gray-300">
                Mo-Library reimagines the traditional library experience with cutting-edge technology and a focus on
                community.
              </p>
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <Link
                  to="/signup"
                  className="px-6 py-3 rounded-md gradient-bg text-white font-medium hover:opacity-90 transition-opacity text-center"
                >
                  Get Started
                </Link>
                <Link
                  to="/seat-booking"
                  className="px-6 py-3 rounded-md border border-primary text-white font-medium hover:bg-primary/10 transition-colors text-center"
                >
                  Book a Seat
                </Link>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="relative w-full h-[400px] rounded-xl overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1507842217343-583bb7270b66?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2340&q=80"
                  alt="Modern Library"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent"></div>
              </div>
              <motion.div
                className="absolute -bottom-6 -right-6 glass-effect p-4 rounded-lg neon-shadow"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.5 }}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <p className="text-sm font-medium">30 seats available now</p>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-background-light">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {displayStats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="flex justify-center mb-3 text-primary">
                  {stat.icon}
                </div>
                <h3 className="text-3xl md:text-4xl font-bold gradient-text mb-2">
                  {stat.number}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-3xl md:text-4xl font-bold mb-4"
            >
              Everything You Need in <span className="gradient-text">One Platform</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto"
            >
              Discover our comprehensive suite of features designed to revolutionize your library experience
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                className="glass-effect p-6 rounded-xl hover:neon-shadow transition-all duration-300 group"
              >
                <div className="mb-4 transform group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-background-light">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-3xl md:text-4xl font-bold mb-4"
            >
              How <span className="gradient-text">Mo-Library</span> Works
            </motion.h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: 'Sign Up & Explore',
                description: 'Create your account and browse our vast collection of books and learning resources',
                icon: <Users className="w-12 h-12" />
              },
              {
                step: '02',
                title: 'Book Your Seat',
                description: 'Choose your preferred seat, select time slot, and make secure payment via Razorpay',
                icon: <Calendar className="w-12 h-12" />
              },
              {
                step: '03',
                title: 'Learn & Grow',
                description: 'Access books, track your reading, join community discussions, and follow learning paths',
                icon: <TrendingUp className="w-12 h-12" />
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                className="relative"
              >
                <div className="glass-effect p-8 rounded-xl text-center">
                  <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 w-12 h-12 rounded-full gradient-bg flex items-center justify-center text-white font-bold text-xl">
                    {item.step}
                  </div>
                  <div className="mt-6 mb-4 flex justify-center text-primary">
                    {item.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300">{item.description}</p>
                </div>
                {index < 2 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                    <ArrowRight className="w-8 h-8 text-primary" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Seat Booking Preview */}
      <section className="py-20">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              <h2 className="text-3xl md:text-4xl font-bold">
                Reserve Your <span className="gradient-text">Perfect Spot</span>
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300">
                Our intuitive seat booking system lets you choose the ideal location for your needs. Book by the hour with instant confirmation and secure payment.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { icon: <Clock className="w-5 h-5" />, text: 'Flexible time slots (2hr, 4hr, custom)' },
                  { icon: <MapPin className="w-5 h-5" />, text: 'Real-time seat availability' },
                  { icon: <CreditCard className="w-5 h-5" />, text: 'Secure payment (₹5/hour)' },
                  { icon: <CheckCircle className="w-5 h-5" />, text: 'Instant booking confirmation' }
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 glass-effect rounded-lg">
                    <div className="text-primary">{item.icon}</div>
                    <span className="text-sm">{item.text}</span>
                  </div>
                ))}
              </div>
              <div>
                <Link
                  to="/seat-booking"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-md gradient-bg text-white font-medium hover:opacity-90 transition-opacity"
                >
                  Book Your Seat Now
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="relative"
            >
              <div className="glass-effect p-6 rounded-xl neon-shadow">
                <div className="mb-4">
                  <h3 className="text-lg font-semibold mb-2">Live Seat Availability</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Select your preferred seat</p>
                </div>
                <div className="grid grid-cols-5 gap-3 mb-6">
                  {[...Array(25)].map((_, i) => (
                    <div
                      key={i}
                      className={`seat ${
                        i % 3 === 0 ? 'booked' : i % 7 === 0 ? 'your-booking' : 'available'
                      } w-12 h-12 rounded-md flex items-center justify-center text-sm cursor-pointer hover:scale-110 transition-transform`}
                    >
                      {i + 1}
                    </div>
                  ))}
                </div>
                <div className="flex justify-between items-center pt-4 border-t border-gray-700">
                  <div className="flex gap-4">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-sm seat available"></div>
                      <span className="text-xs">Available</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-sm seat booked"></div>
                      <span className="text-xs">Booked</span>
                    </div>
                  </div>
                  <span className="text-sm font-semibold text-primary">18 seats left</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Reading Features Section */}
      <section className="py-20 bg-background-light">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="order-2 lg:order-1"
            >
              <div className="glass-effect p-8 rounded-xl">
                <div className="grid grid-cols-2 gap-4 mb-6">
                  {[
                    { icon: <BookOpen className="w-8 h-8" />, label: 'Books Read', value: '24' },
                    { icon: <Star className="w-8 h-8" />, label: 'Avg Rating', value: '4.5' },
                    { icon: <TrendingUp className="w-8 h-8" />, label: 'Reading Streak', value: '12 days' },
                    { icon: <Award className="w-8 h-8" />, label: 'Completed Paths', value: '3' }
                  ].map((stat, index) => (
                    <div key={index} className="bg-background-light dark:bg-background p-4 rounded-lg text-center">
                      <div className="flex justify-center text-primary mb-2">{stat.icon}</div>
                      <p className="text-2xl font-bold gradient-text mb-1">{stat.value}</p>
                      <p className="text-xs text-gray-600 dark:text-gray-300">{stat.label}</p>
                    </div>
                  ))}
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-background-light dark:bg-background rounded-lg">
                    <span className="text-sm text-gray-800 dark:text-gray-200">Currently Reading</span>
                    <span className="text-xs px-2 py-1 bg-blue-500/20 text-blue-400 rounded">3 books</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-background-light dark:bg-background rounded-lg">
                    <span className="text-sm text-gray-800 dark:text-gray-200">Want to Read</span>
                    <span className="text-xs px-2 py-1 bg-purple-500/20 text-purple-400 rounded">12 books</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-background-light dark:bg-background rounded-lg">
                    <span className="text-sm text-gray-800 dark:text-gray-200">Completed</span>
                    <span className="text-xs px-2 py-1 bg-green-500/20 text-green-400 rounded">24 books</span>
                  </div>
                </div>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="space-y-6 order-1 lg:order-2"
            >
              <h2 className="text-3xl md:text-4xl font-bold">
                Track Your <span className="gradient-text">Reading Journey</span>
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300">
                Manage your personal library, rate books, add notes, and track your progress with detailed analytics and insights.
              </p>
              <ul className="space-y-3">
                {[
                  'Organize books by reading status',
                  'Rate and review your reads',
                  'Add personal notes and highlights',
                  'Track reading statistics and goals',
                  'Follow curated learning roadmaps'
                ].map((item, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <div className="flex gap-4">
                <Link
                  to="/my-reading"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-md gradient-bg text-white font-medium hover:opacity-90 transition-opacity"
                >
                  My Reading List
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  to="/learning-paths"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-md border border-primary text-white font-medium hover:bg-primary/10 transition-colors"
                >
                  Learning Paths
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="glass-effect p-12 rounded-xl text-center max-w-4xl mx-auto relative overflow-hidden"
          >
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute top-0 left-0 w-64 h-64 bg-primary/20 rounded-full filter blur-3xl"></div>
              <div className="absolute bottom-0 right-0 w-64 h-64 bg-secondary/20 rounded-full filter blur-3xl"></div>
            </div>
            <div className="relative z-10">
              <BookOpen className="w-16 h-16 text-primary mx-auto mb-6" />
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Ready to Experience the <span className="gradient-text">Future of Libraries?</span>
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
                Join Mo-Library today and discover a new way to learn, research, and connect.
              </p>
              <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
                <Link
                  to="/signup"
                  className="px-8 py-3 rounded-md gradient-bg text-white font-medium hover:opacity-90 transition-opacity"
                >
                  Sign Up Now
                </Link>
                <Link
                  to="/login"
                  className="px-8 py-3 rounded-md border border-primary text-white font-medium hover:bg-primary/10 transition-colors"
                >
                  Login
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;