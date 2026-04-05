import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { BookOpen, Star, TrendingUp, Award, Clock, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

interface ReadingEntry {
  id: string;
  status: string;
  user_rating: number | null;
  user_notes: string | null;
  started_at: string | null;
  completed_at: string | null;
  added_at: string;
  book: {
    id: string;
    title: string;
    author: string;
    cover_image_url: string | null;
    genre: string | null;
    pages: number | null;
  };
}

export default function MyReading() {
  const navigate = useNavigate();
  const [entries, setEntries] = useState<ReadingEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'all' | 'reading' | 'completed' | 'want'>('all');

  useEffect(() => {
    fetchReadingList();
  }, []);

  const fetchReadingList = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('user_reading_list')
        .select(`
          *,
          book:books(id, title, author, cover_image_url, genre, pages)
        `)
        .eq('user_id', user.id)
        .order('added_at', { ascending: false });

      if (error) throw error;
      setEntries(data || []);
    } catch (error: any) {
      toast.error('Failed to load reading list');
    } finally {
      setLoading(false);
    }
  };

  const filteredEntries = entries.filter((entry) => {
    if (activeTab === 'all') return true;
    if (activeTab === 'reading') return entry.status === 'currently_reading';
    if (activeTab === 'completed') return entry.status === 'completed';
    if (activeTab === 'want') return entry.status === 'want_to_read';
    return true;
  });

  const stats = {
    total: entries.length,
    reading: entries.filter((e) => e.status === 'currently_reading').length,
    completed: entries.filter((e) => e.status === 'completed').length,
    wantToRead: entries.filter((e) => e.status === 'want_to_read').length,
    avgRating: entries.filter((e) => e.user_rating).length > 0
      ? (entries.reduce((sum, e) => sum + (e.user_rating || 0), 0) / entries.filter((e) => e.user_rating).length).toFixed(1)
      : '0',
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500/20 text-green-400';
      case 'currently_reading':
        return 'bg-blue-500/20 text-blue-400';
      case 'want_to_read':
        return 'bg-purple-500/20 text-purple-400';
      case 'on_hold':
        return 'bg-yellow-500/20 text-yellow-400';
      default:
        return 'bg-gray-500/20 text-gray-400';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="animate-spin-slow w-12 h-12 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-8">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold mb-2">
            My <span className="gradient-text">Reading</span>
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Track your reading journey and discover new books
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-effect rounded-lg p-4"
          >
            <div className="flex items-center gap-2 text-primary mb-2">
              <BookOpen size={20} />
              <span className="text-sm">Total Books</span>
            </div>
            <p className="text-2xl font-bold">{stats.total}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-effect rounded-lg p-4"
          >
            <div className="flex items-center gap-2 text-blue-400 mb-2">
              <Clock size={20} />
              <span className="text-sm">Reading</span>
            </div>
            <p className="text-2xl font-bold">{stats.reading}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-effect rounded-lg p-4"
          >
            <div className="flex items-center gap-2 text-green-400 mb-2">
              <Check size={20} />
              <span className="text-sm">Completed</span>
            </div>
            <p className="text-2xl font-bold">{stats.completed}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="glass-effect rounded-lg p-4"
          >
            <div className="flex items-center gap-2 text-purple-400 mb-2">
              <TrendingUp size={20} />
              <span className="text-sm">Want to Read</span>
            </div>
            <p className="text-2xl font-bold">{stats.wantToRead}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="glass-effect rounded-lg p-4"
          >
            <div className="flex items-center gap-2 text-yellow-400 mb-2">
              <Award size={20} />
              <span className="text-sm">Avg Rating</span>
            </div>
            <p className="text-2xl font-bold">{stats.avgRating}</p>
          </motion.div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto">
          {[
            { key: 'all', label: 'All Books', count: stats.total },
            { key: 'reading', label: 'Currently Reading', count: stats.reading },
            { key: 'completed', label: 'Completed', count: stats.completed },
            { key: 'want', label: 'Want to Read', count: stats.wantToRead },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`px-4 py-2 rounded-lg whitespace-nowrap transition-all ${
                activeTab === tab.key
                  ? 'gradient-bg text-white'
                  : 'glass-effect text-gray-600 dark:text-gray-300 hover:bg-primary/20'
              }`}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>

        {/* Books Grid */}
        {filteredEntries.length === 0 ? (
          <div className="glass-effect rounded-lg p-12 text-center">
            <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No books yet</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Start building your reading list by exploring our collection
            </p>
            <button
              onClick={() => navigate('/book-search')}
              className="px-6 py-3 gradient-bg text-white rounded-lg hover:opacity-90 transition-opacity"
            >
              Browse Books
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredEntries.map((entry) => (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                onClick={() => navigate(`/book/${entry.book.id}`)}
                className="glass-effect rounded-lg p-4 hover:neon-shadow transition-all cursor-pointer"
              >
                {entry.book.cover_image_url ? (
                  <img
                    src={entry.book.cover_image_url}
                    alt={entry.book.title}
                    className="w-full h-48 object-cover rounded-lg mb-3"
                  />
                ) : (
                  <div className="w-full h-48 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-lg flex items-center justify-center mb-3">
                    <BookOpen size={48} className="text-gray-400" />
                  </div>
                )}

                <h3 className="font-bold text-lg mb-1 line-clamp-2">{entry.book.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                  by {entry.book.author}
                </p>

                <div className="flex items-center justify-between mb-3">
                  <span className={`px-2 py-1 rounded text-xs ${getStatusColor(entry.status)}`}>
                    {entry.status.replace('_', ' ')}
                  </span>
                  {entry.user_rating && (
                    <div className="flex items-center gap-1">
                      <Star size={14} className="fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-semibold">{entry.user_rating}</span>
                    </div>
                  )}
                </div>

                {entry.completed_at && (
                  <p className="text-xs text-gray-600 dark:text-gray-300">
                    Completed: {new Date(entry.completed_at).toLocaleDateString()}
                  </p>
                )}
                {entry.started_at && !entry.completed_at && (
                  <p className="text-xs text-gray-600 dark:text-gray-300">
                    Started: {new Date(entry.started_at).toLocaleDateString()}
                  </p>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
