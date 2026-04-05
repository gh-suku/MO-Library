import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Map, BookOpen, TrendingUp, Award, Clock, ChevronRight, Play } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

interface LearningPath {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty_level: string;
  estimated_duration_days: number | null;
  cover_image_url: string | null;
  is_published: boolean;
  book_count?: number;
  user_progress?: {
    books_completed: number;
    started_at: string;
  };
}

export default function LearningPaths() {
  const navigate = useNavigate();
  const [paths, setPaths] = useState<LearningPath[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    fetchLearningPaths();
  }, []);

  const fetchLearningPaths = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();

      // Fetch learning paths
      const { data: pathsData, error: pathsError } = await supabase
        .from('learning_paths')
        .select('*')
        .eq('is_published', true)
        .order('created_at', { ascending: false });

      if (pathsError) throw pathsError;

      // Fetch book counts for each path
      const pathsWithCounts = await Promise.all(
        (pathsData || []).map(async (path) => {
          const { count } = await supabase
            .from('roadmap_books')
            .select('*', { count: 'exact', head: true })
            .eq('learning_path_id', path.id);

          // Fetch user progress if logged in
          let userProgress = null;
          if (user) {
            const { data: progressData } = await supabase
              .from('user_roadmap_progress')
              .select('books_completed, started_at')
              .eq('user_id', user.id)
              .eq('learning_path_id', path.id)
              .single();

            userProgress = progressData;
          }

          return {
            ...path,
            book_count: count || 0,
            user_progress: userProgress,
          };
        })
      );

      setPaths(pathsWithCounts);
    } catch (error: any) {
      toast.error('Failed to load learning paths');
    } finally {
      setLoading(false);
    }
  };

  const startPath = async (pathId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('Please log in to start a learning path');
        navigate('/login');
        return;
      }

      const { error } = await supabase
        .from('user_roadmap_progress')
        .insert({
          user_id: user.id,
          learning_path_id: pathId,
          books_completed: 0,
        });

      if (error) throw error;

      toast.success('Learning path started!');
      navigate(`/learning-path/${pathId}`);
    } catch (error: any) {
      if (error.code === '23505') {
        // Already started
        navigate(`/learning-path/${pathId}`);
      } else {
        toast.error(error.message || 'Failed to start learning path');
      }
    }
  };

  const categories = ['all', ...new Set(paths.map((p) => p.category))];
  const filteredPaths = selectedCategory === 'all'
    ? paths
    : paths.filter((p) => p.category === selectedCategory);

  const getDifficultyColor = (level: string) => {
    switch (level) {
      case 'beginner':
        return 'bg-green-500/20 text-green-400';
      case 'intermediate':
        return 'bg-yellow-500/20 text-yellow-400';
      case 'advanced':
        return 'bg-red-500/20 text-red-400';
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
          className="mb-8 text-center"
        >
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Learning <span className="gradient-text">Roadmaps</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Follow curated learning paths with structured book recommendations
          </p>
        </motion.div>

        {/* Category Filter */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-lg whitespace-nowrap capitalize transition-all ${
                selectedCategory === category
                  ? 'gradient-bg text-white'
                  : 'glass-effect text-gray-600 dark:text-gray-300 hover:bg-primary/20'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Learning Paths Grid */}
        {filteredPaths.length === 0 ? (
          <div className="glass-effect rounded-lg p-12 text-center">
            <Map className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No learning paths yet</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Check back soon for curated learning roadmaps
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPaths.map((path) => (
              <motion.div
                key={path.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass-effect rounded-lg overflow-hidden hover:neon-shadow transition-all"
              >
                {path.cover_image_url ? (
                  <img
                    src={path.cover_image_url}
                    alt={path.title}
                    className="w-full h-48 object-cover"
                  />
                ) : (
                  <div className="w-full h-48 bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                    <Map size={64} className="text-gray-400" />
                  </div>
                )}

                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <span className={`px-2 py-1 rounded text-xs capitalize ${getDifficultyColor(path.difficulty_level)}`}>
                      {path.difficulty_level}
                    </span>
                    <span className="px-2 py-1 rounded text-xs bg-primary/20 text-primary capitalize">
                      {path.category}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold mb-2">{path.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
                    {path.description}
                  </p>

                  <div className="flex items-center gap-4 mb-4 text-sm text-gray-600 dark:text-gray-300">
                    <div className="flex items-center gap-1">
                      <BookOpen size={16} />
                      <span>{path.book_count} books</span>
                    </div>
                    {path.estimated_duration_days && (
                      <div className="flex items-center gap-1">
                        <Clock size={16} />
                        <span>{path.estimated_duration_days} days</span>
                      </div>
                    )}
                  </div>

                  {path.user_progress ? (
                    <div className="mb-4">
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-600 dark:text-gray-300">Progress</span>
                        <span className="font-semibold">
                          {path.user_progress.books_completed}/{path.book_count}
                        </span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div
                          className="gradient-bg h-2 rounded-full transition-all"
                          style={{
                            width: `${(path.user_progress.books_completed / (path.book_count || 1)) * 100}%`,
                          }}
                        />
                      </div>
                    </div>
                  ) : null}

                  <button
                    onClick={() => path.user_progress ? navigate(`/learning-path/${path.id}`) : startPath(path.id)}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 gradient-bg text-white rounded-lg hover:opacity-90 transition-opacity"
                  >
                    {path.user_progress ? (
                      <>
                        Continue
                        <ChevronRight size={18} />
                      </>
                    ) : (
                      <>
                        <Play size={18} />
                        Start Path
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
