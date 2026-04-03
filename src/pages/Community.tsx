import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { CommunityPost, PostComment, Profile } from '../lib/supabase';
import { MessageSquare, Heart, Send } from 'lucide-react';

export default function Community() {
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [newPost, setNewPost] = useState({ content: '', book_title: '', duration_days: '' });
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<Profile | null>(null);
  const [expandedPost, setExpandedPost] = useState<string | null>(null);
  const [comments, setComments] = useState<{ [key: string]: PostComment[] }>({});
  const [newComment, setNewComment] = useState<{ [key: string]: string }>({});
  const [replyTo, setReplyTo] = useState<{ [key: string]: string | null }>({});

  useEffect(() => {
    fetchCurrentUser();
    fetchPosts();
  }, []);

  const fetchCurrentUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      setCurrentUser(data);
    }
  };

  const fetchPosts = async () => {
    setLoading(true);
    const { data: postsData } = await supabase
      .from('community_posts')
      .select(`
        *,
        profile:profiles(*)
      `)
      .order('created_at', { ascending: false });

    if (postsData) {
      const postsWithCounts = await Promise.all(
        postsData.map(async (post) => {
          const { count: likesCount } = await supabase
            .from('post_likes')
            .select('*', { count: 'exact', head: true })
            .eq('post_id', post.id);

          const { count: commentsCount } = await supabase
            .from('post_comments')
            .select('*', { count: 'exact', head: true })
            .eq('post_id', post.id);

          const { data: userLike } = await supabase
            .from('post_likes')
            .select('id')
            .eq('post_id', post.id)
            .eq('user_id', currentUser?.id || '')
            .single();

          return {
            ...post,
            likes_count: likesCount || 0,
            comments_count: commentsCount || 0,
            user_has_liked: !!userLike,
          };
        })
      );
      setPosts(postsWithCounts);
    }
    setLoading(false);
  };

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPost.content.trim()) return;

    const { error } = await supabase.from('community_posts').insert({
      user_id: currentUser?.id,
      content: newPost.content,
      book_title: newPost.book_title || null,
      duration_days: newPost.duration_days ? parseInt(newPost.duration_days) : null,
    });

    if (!error) {
      setNewPost({ content: '', book_title: '', duration_days: '' });
      fetchPosts();
    }
  };

  const handleLike = async (postId: string, hasLiked: boolean) => {
    if (hasLiked) {
      await supabase
        .from('post_likes')
        .delete()
        .eq('post_id', postId)
        .eq('user_id', currentUser?.id);
    } else {
      await supabase.from('post_likes').insert({
        post_id: postId,
        user_id: currentUser?.id,
      });
    }
    fetchPosts();
  };

  const fetchComments = async (postId: string) => {
    const { data } = await supabase
      .from('post_comments')
      .select(`
        *,
        profile:profiles(*)
      `)
      .eq('post_id', postId)
      .is('parent_comment_id', null)
      .order('created_at', { ascending: true });

    if (data) {
      const commentsWithReplies = await Promise.all(
        data.map(async (comment) => {
          const { data: replies } = await supabase
            .from('post_comments')
            .select(`
              *,
              profile:profiles(*)
            `)
            .eq('parent_comment_id', comment.id)
            .order('created_at', { ascending: true });
          return { ...comment, replies: replies || [] };
        })
      );
      setComments((prev) => ({ ...prev, [postId]: commentsWithReplies }));
    }
  };

  const toggleComments = (postId: string) => {
    if (expandedPost === postId) {
      setExpandedPost(null);
    } else {
      setExpandedPost(postId);
      fetchComments(postId);
    }
  };

  const handleAddComment = async (postId: string, parentId?: string) => {
    const content = newComment[postId];
    if (!content?.trim()) return;

    await supabase.from('post_comments').insert({
      post_id: postId,
      user_id: currentUser?.id,
      content,
      parent_comment_id: parentId || null,
    });

    setNewComment((prev) => ({ ...prev, [postId]: '' }));
    setReplyTo((prev) => ({ ...prev, [postId]: null }));
    fetchComments(postId);
    fetchPosts();
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Community Feed</h1>

        {/* Create Post */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <form onSubmit={handleCreatePost}>
            <textarea
              value={newPost.content}
              onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
              placeholder="Share what book you're looking for..."
              className="w-full p-3 border rounded-lg mb-3 focus:ring-2 focus:ring-blue-500"
              rows={3}
            />
            <div className="grid grid-cols-2 gap-3 mb-3">
              <input
                type="text"
                value={newPost.book_title}
                onChange={(e) => setNewPost({ ...newPost, book_title: e.target.value })}
                placeholder="Book title (optional)"
                className="p-2 border rounded-lg"
              />
              <input
                type="number"
                value={newPost.duration_days}
                onChange={(e) => setNewPost({ ...newPost, duration_days: e.target.value })}
                placeholder="Days needed (optional)"
                className="p-2 border rounded-lg"
              />
            </div>
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            >
              Post
            </button>
          </form>
        </div>

        {/* Posts Feed */}
        {loading ? (
          <div className="text-center py-8">Loading...</div>
        ) : (
          <div className="space-y-4">
            {posts.map((post) => (
              <div key={post.id} className="bg-white rounded-lg shadow p-6">
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                    {post.profile?.full_name?.[0] || 'U'}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold">{post.profile?.full_name || 'User'}</h3>
                    <p className="text-sm text-gray-500">
                      {new Date(post.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <p className="text-gray-800 mb-3">{post.content}</p>
                
                {post.book_title && (
                  <div className="bg-blue-50 p-3 rounded-lg mb-3">
                    <p className="text-sm">
                      <span className="font-semibold">Book:</span> {post.book_title}
                      {post.duration_days && (
                        <span className="ml-3">
                          <span className="font-semibold">Duration:</span> {post.duration_days} days
                        </span>
                      )}
                    </p>
                  </div>
                )}

                <div className="flex gap-4 pt-3 border-t">
                  <button
                    onClick={() => handleLike(post.id, post.user_has_liked || false)}
                    className={`flex items-center gap-2 ${
                      post.user_has_liked ? 'text-red-600' : 'text-gray-600'
                    } hover:text-red-600`}
                  >
                    <Heart className={post.user_has_liked ? 'fill-current' : ''} size={20} />
                    <span>{post.likes_count}</span>
                  </button>
                  <button
                    onClick={() => toggleComments(post.id)}
                    className="flex items-center gap-2 text-gray-600 hover:text-blue-600"
                  >
                    <MessageSquare size={20} />
                    <span>{post.comments_count}</span>
                  </button>
                </div>

                {/* Comments Section */}
                {expandedPost === post.id && (
                  <div className="mt-4 pt-4 border-t">
                    <div className="space-y-3 mb-4">
                      {comments[post.id]?.map((comment) => (
                        <div key={comment.id}>
                          <div className="flex gap-2">
                            <div className="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center text-white text-sm">
                              {comment.profile?.full_name?.[0] || 'U'}
                            </div>
                            <div className="flex-1 bg-gray-100 rounded-lg p-3">
                              <p className="font-semibold text-sm">
                                {comment.profile?.full_name || 'User'}
                              </p>
                              <p className="text-sm">{comment.content}</p>
                              <button
                                onClick={() =>
                                  setReplyTo((prev) => ({ ...prev, [post.id]: comment.id }))
                                }
                                className="text-xs text-blue-600 mt-1"
                              >
                                Reply
                              </button>
                            </div>
                          </div>

                          {/* Replies */}
                          {comment.replies && comment.replies.length > 0 && (
                            <div className="ml-10 mt-2 space-y-2">
                              {comment.replies.map((reply) => (
                                <div key={reply.id} className="flex gap-2">
                                  <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center text-white text-xs">
                                    {reply.profile?.full_name?.[0] || 'U'}
                                  </div>
                                  <div className="flex-1 bg-gray-50 rounded-lg p-2">
                                    <p className="font-semibold text-xs">
                                      {reply.profile?.full_name || 'User'}
                                    </p>
                                    <p className="text-xs">{reply.content}</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}

                          {/* Reply Input */}
                          {replyTo[post.id] === comment.id && (
                            <div className="ml-10 mt-2 flex gap-2">
                              <input
                                type="text"
                                value={newComment[post.id] || ''}
                                onChange={(e) =>
                                  setNewComment((prev) => ({ ...prev, [post.id]: e.target.value }))
                                }
                                placeholder="Write a reply..."
                                className="flex-1 p-2 border rounded-lg text-sm"
                              />
                              <button
                                onClick={() => handleAddComment(post.id, comment.id)}
                                className="bg-blue-600 text-white p-2 rounded-lg"
                              >
                                <Send size={16} />
                              </button>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Add Comment */}
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newComment[post.id] || ''}
                        onChange={(e) =>
                          setNewComment((prev) => ({ ...prev, [post.id]: e.target.value }))
                        }
                        placeholder="Write a comment..."
                        className="flex-1 p-2 border rounded-lg"
                      />
                      <button
                        onClick={() => handleAddComment(post.id)}
                        className="bg-blue-600 text-white p-2 rounded-lg"
                      >
                        <Send size={20} />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
