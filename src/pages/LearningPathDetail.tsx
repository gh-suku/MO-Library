import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { ArrowLeft, BookOpen, Check, Lock, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

interface PathBook {
  id: string;
  sequence_order: number;
  is_required: boolean;
  notes: string | null;
  book: {
    id: string;
    title: string;
    author: string;
    cover_image_url: string | null;
    pages: number | null;
  };
  is_completed?: boolean;
}

interface LearningPath {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty_level: string;
  estimated_duration_days: number | null;
}

export default function LearningPathDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [path, setPath] = useState<LearningPath | null>(null);
  const [books, setBooks] = useState<PathBook[]>([]);
  const [progress, setProgress] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPathDetails();
  }, [id]);

  const fetchPathDetails = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/login');
        return;
      }

      // Fetch path details
      const { data: pathData, error: pathError } = await supabase
        .from('learning_paths')
        .select('*')
        .eq('id', id)
        .single();

      if (pathError) throw pathError;
      setPath(pathData);

      // Fetch books in path
      const { data: booksData, error: booksError } = await supabase
        .from('roadmap_books')
        .select(`
          *,
          book:books(id, title, author, cover_image_url, pages)
        `)
        .eq('learning_path_id', id)
        .order('sequence_order', { ascending: true });

      if (booksError) throw booksError;

      // Check which books are completed
      const { data: readingList } = await supabase
        .from('user_reading_list')
        .select('book_id, status')
        .eq('user_id', user.id)
        .eq('status', 'completed');

      const completedBookIds = new Set(readingList?.map((r) => r.book_id) || []);

      const booksWithCompletion = booksData.map((book) => ({
        ...book,
        is_completed: completedBookIds.has(book.book.id),
      }));

      setBooks(booksWithCompletion);

      // Fetch user progress
      const { data: progressData } = await supabase
        .from('user_roadmap_progress')
        .select('*')
        .eq('user_id', user.id)
        .eq('learning_path_id', id)
        .single();

      setProgress(progressData);
    } catch (error: any) {
      toast.error('Failed to load learning path');
      navigate('/learning-paths');
    } finally {
      setLoading(false);
    }
  };

  const completedCount = books.filter((b) => b.is_completed).length;
  const progressPercentage = books.length > 0 ? (completedCount / books.length) * 100 : 0;

  if (loading) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="animate-spin-slow w-12 h-12 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!path) return null;

  return (
    <div className="min-h-screen pt-24 pb-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Back Button */}
        <button
          onClick={() => navigate('/learning-paths')}
          className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-primary mb-6 transition-colors"
        >
          <ArrowLeft size={20} />
          Back to Learning Paths
        </button>

        {/* Path Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-effect rounded-lg p-6 mb-8"
        >
          <h1 className="text-3xl font-bold mb-2">{path.title}</h1>
          <p className="text-gray-600 dark:text-gray-300 mb-4">{path.description}</p>

          <div className="flex flex-wrap gap-2 mb-6">
            <span className="px-3 py-1 rounded-full text-sm bg-primary/20 text-primary capitalize">
              {path.category}
            </span>
            <span className="px-3 py-1 rounded-full text-sm bg-secondary/20 text-secondary capitalize">
              {path.difficulty_level}
            </span>
            {path.estimated_duration_days && (
              <span className="px-3 py-1 rounded-full text-sm bg-purple-500/20 text-purple-400">
                {path.estimated_duration_days} days
              </span>
            )}
          </div>

          {/* Progress Bar */}
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-600 dark:text-gray-300">Your Progress</span>
              <span className="font-semibold">
                {completedCount}/{books.length} books completed
              </span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-3">
              <div
                className="gradient-bg h-3 rounded-full transition-all"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>
        </motion.div>

        {/* Books List */}
        <div className="space-y-4">
          {books.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => navigate(`/book/${item.book.id}`)}
              className={`glass-effect rounded-lg p-4 transition-all cursor-pointer ${
                item.is_completed
                  ? 'border-2 border-green-500/50'
                  : 'hover:neon-shadow'
              }`}
            >
              <div className="flex gap-4">
                {/* Sequence Number */}
                <div className="flex-shrink-0">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold ${
                    item.is_completed
                      ? 'bg-green-500/20 text-green-400'
                      : 'bg-primary/20 text-primary'
                  }`}>
                    {item.is_completed ? <Check size={24} /> : item.sequence_order}
                  </div>
                </div>

                {/* Book Cover */}
                {item.book.cover_image_url ? (
                  <img
                    src={item.book.cover_image_url}
                    alt={item.book.title}
                    className="w-16 h-24 object-cover rounded"
                  />
                ) : (
                  <div className="w-16 h-24 bg-gradient-to-br from-primary/20 to-secondary/20 rounded flex items-center justify-center">
                    <BookOpen size={24} className="text-gray-400" />
                  </div>
                )}

                {/* Book Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-lg mb-1">{item.book.title}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                        by {item.book.author}
                      </p>
                    </div>
                    <ChevronRight className="flex-shrink-0 text-gray-400" size={20} />
                  </div>

                  {item.notes && (
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-2 italic">
                      {item.notes}
                    </p>
                  )}

                  <div className="flex items-center gap-3 text-sm">
                    {item.is_required && (
                      <span className="px-2 py-1 rounded text-xs bg-red-500/20 text-red-400">
                        Required
                      </span>
                    )}
                    {item.book.pages && (
                      <span className="text-gray-600 dark:text-gray-300">
                        {item.book.pages} pages
                      </span>
                    )}
                    {item.is_completed && (
                      <span className="flex items-center gap-1 text-green-400">
                        <Check size={14} />
                        Completed
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Completion Message */}
        {progressPercentage === 100 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-8 glass-effect border-2 border-green-500/50 rounded-lg p-6 text-center"
          >
            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check size={32} className="text-green-400" />
            </div>
            <h3 className="text-2xl font-bold mb-2">Congratulations!</h3>
            <p className="text-gray-600 dark:text-gray-300">
              You've completed the {path.title} learning path!
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
