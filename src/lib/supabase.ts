import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Profile = {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  created_at: string;
  is_admin?: boolean;
};

export type Seat = {
  id: string;
  seat_number: string;
  is_available: boolean;
  created_at: string;
};

export type Booking = {
  id: string;
  user_id: string;
  seat_id: string;
  start_time: string;
  end_time: string;
  created_at: string;
  payment_id?: string | null;
  amount_paid?: number | null;
  seat?: Seat;
  profile?: Profile;
};

export type Book = {
  id: string;
  title: string;
  author: string;
  isbn?: string | null;
  is_available: boolean;
  total_copies: number;
  available_copies: number;
  book_type?: 'physical' | 'ebook' | 'both';
  pdf_url?: string | null;
  cover_image_url?: string | null;
  description?: string | null;
  genre?: string | null;
  category?: string | null;
  publication_year?: number | null;
  pages?: number | null;
  language?: string | null;
  publisher?: string | null;
  rating?: number | null;
  created_at: string;
  updated_at: string;
};

export type CommunityPost = {
  id: string;
  user_id: string;
  content: string;
  book_title?: string | null;
  duration_days?: number | null;
  created_at: string;
  updated_at: string;
  profile?: Profile;
  likes_count?: number;
  comments_count?: number;
  user_has_liked?: boolean;
};

export type PostComment = {
  id: string;
  post_id: string;
  user_id: string;
  parent_comment_id?: string | null;
  content: string;
  created_at: string;
  updated_at: string;
  profile?: Profile;
  replies?: PostComment[];
};

export type BookRequest = {
  id: string;
  requester_name: string;
  requester_email: string;
  book_title: string;
  author: string;
  additional_info?: string | null;
  status: string;
  created_at: string;
};

export const isAdmin = async (): Promise<boolean> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;
    
    const { data } = await supabase
      .from('profiles')
      .select('is_admin')
      .eq('id', user.id)
      .single();
    
    return data?.is_admin === true;
  } catch (error) {
    console.error('Error checking admin status:', error);
    return false;
  }
};