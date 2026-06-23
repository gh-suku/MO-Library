# MO-Library Database Setup Guide

## Overview

This guide provides step-by-step instructions for setting up the complete database schema for the MO-Library application using Supabase SQL migrations.

## 📋 Prerequisites

- Supabase project created
- Access to Supabase SQL Editor
- Basic understanding of SQL

## 🗂️ Migration Files Organization

The migration files have been organized into the following categories:

### **Core Migration Files (Run in Order)**

These files must be executed in sequence to set up the complete database:

| Step | File Name | Description |
|------|-----------|-------------|
| 1 | `step01_initial_schema.sql` | Initial database schema (profiles, seats, bookings) |
| 2 | `step02_user_trigger.sql` | Auto-create user profiles on signup |
| 3 | `step03_admin_functionality.sql` | Add admin role and permissions |
| 4 | `step04_community_and_books.sql` | Books, community posts, comments, likes |
| 5 | `step05_enhanced_books_system.sql` | Enhanced book features (reading lists, quizzes, learning paths) |
| 6 | `step06_payment_and_admin_fixes.sql` | Payment columns and admin policy fixes |
| 7 | `step07_reading_list_rls_policies.sql` | Row Level Security for reading lists |
| 8 | `step08_complete_rls_policies.sql` | Complete RLS policies for all tables |
| 9 | `step09_roadmap_progress_tracking.sql` | Enhanced roadmap progress tracking |
| 10 | `step10_insert_sample_books.sql` | Sample programming books with learning paths |
| 11 | `step11_add_quiz_questions.sql` | Quiz questions for sample books |
| 12 | `step12_make_user_admin.sql` | Make a specific user an admin |
| 13 | `step13_prevent_double_booking.sql` | Prevent concurrent seat bookings (race condition fix) |

### **Query Files (Optional - For Verification)**

These files contain SELECT queries to verify your data:

- `query_check_books_with_quizzes.sql` - Check which books have quizzes
- `query_check_roadmap_books.sql` - Verify books in learning paths
- `query_verify_sample_data.sql` - Complete data verification

### **Utility Files (Optional - Use as Needed)**

- `utility_cleanup_duplicate_roadmaps.sql` - Remove duplicate learning paths
- `utility_drop_roadmap_books.sql` - Remove all roadmap book associations
- `optional_admin_permission_update.sql` - Alternative admin permission setup
- `optional_new_access_policies.sql` - Additional access policies

### **Archive Files (For Reference)**

These are older versions or templates - not needed for setup:

- `archive_*.sql` - Historical migration versions

## 🚀 Setup Instructions

### Step-by-Step Execution

1. **Open Supabase Dashboard**
   - Go to your project: https://supabase.com/dashboard/project/YOUR_PROJECT_ID
   - Navigate to SQL Editor

2. **Execute Core Migrations**

   Run each file in order by copying its content into the SQL Editor:

   ```
   Step 1: step01_initial_schema.sql
   ```
   ✅ Creates: profiles, seats, bookings tables with RLS policies

   ```
   Step 2: step02_user_trigger.sql
   ```
   ✅ Creates: Auto-profile creation trigger for new users

   ```
   Step 3: step03_admin_functionality.sql
   ```
   ✅ Adds: is_admin column and admin policies

   ```
   Step 4: step04_community_and_books.sql
   ```
   ✅ Creates: books, community_posts, post_likes, post_comments, book_requests

   ```
   Step 5: step05_enhanced_books_system.sql
   ```
   ✅ Creates: Enhanced book system with:
   - user_reading_list
   - reading_quiz_questions
   - user_quiz_attempts
   - learning_paths
   - roadmap_books
   - user_roadmap_progress

   ```
   Step 6: step06_payment_and_admin_fixes.sql
   ```
   ✅ Adds: Payment tracking columns (payment_id, amount_paid)

   ```
   Step 7: step07_reading_list_rls_policies.sql
   ```
   ✅ Creates: RLS policies for user_reading_list

   ```
   Step 8: step08_complete_rls_policies.sql
   ```
   ✅ Finalizes: All RLS policies and trigger functions

   ```
   Step 9: step09_roadmap_progress_tracking.sql
   ```
   ✅ Enhances: Roadmap progress tracking with improved triggers

   ```
   Step 10: step10_insert_sample_books.sql
   ```
   ✅ Creates: 4 learning paths (Backend, Frontend, Full Stack, DevOps)
   ✅ Inserts: 18 programming books organized into:
   - Backend Development (4 books)
   - Frontend Development (4 books)
   - Full Stack Development (6 books)
   - DevOps & Cloud (4 books)
   ✅ Associates: Books with learning paths via roadmap_books

   ```
   Step 11: step11_add_quiz_questions.sql
   ```
   ✅ Inserts: 5 quiz questions for each programming book (90 questions total)

   ```
   Step 12: step12_make_user_admin.sql
   ```
   ⚠️ **IMPORTANT**: Edit this file first!
   - Replace `'uid'` with your actual user ID
   - Get your user ID from: Authentication → Users → Copy user ID
   - Then run the updated query

### Alternative: Run All at Once (Advanced)

If you're comfortable with SQL, you can concatenate all files:

```sql
-- Open Supabase SQL Editor and paste all files in order
-- (step01 through step12)
```

## 🔍 Verification

After running all migrations, verify your setup:

### 1. Check Tables Created

```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;
```

**Expected tables:**
- bookings
- books
- book_requests
- community_posts
- learning_paths
- post_comments
- post_likes
- profiles
- reading_quiz_questions
- roadmap_books
- seats
- user_quiz_attempts
- user_reading_list
- user_roadmap_progress

### 2. Verify Sample Data

Run `query_verify_sample_data.sql` to get a complete report of:
- Learning paths created (4 expected)
- Books in each path
- Quiz questions per book
- Summary statistics

### 3. Check Your Admin Status

```sql
SELECT id, email, full_name, is_admin 
FROM profiles 
WHERE is_admin = true;
```

You should see your user with `is_admin = true`

### 4. Verify Books and Quizzes

Run `query_check_books_with_quizzes.sql` to see:
- Books with quizzes
- Books without quizzes
- Question counts by difficulty

## 📊 Database Schema Overview

### Core Tables

**User Management:**
- `profiles` - User profiles with admin flag
- `seats` - Library seat management
- `bookings` - Seat booking with payment tracking

**Books & Content:**
- `books` - Book catalog (physical, ebook, or both)
- `book_requests` - User book requests

**Community:**
- `community_posts` - User posts about books
- `post_likes` - Post likes
- `post_comments` - Nested comments

**Learning System:**
- `learning_paths` - Curated learning roadmaps
- `roadmap_books` - Books in each learning path
- `reading_quiz_questions` - Quiz questions per book
- `user_reading_list` - User's reading progress
- `user_quiz_attempts` - Quiz attempt history
- `user_roadmap_progress` - Learning path progress

## 🔐 Row Level Security (RLS)

All tables have RLS enabled with appropriate policies:

- **Users** can view/edit their own data
- **Admins** can view/edit all data
- **Public data** (books, learning paths, quizzes) is viewable by all authenticated users
- **Write permissions** for books/quizzes restricted to admins

## 🎯 Sample Data Summary

After running all migrations, you'll have:

- **4 Learning Paths:**
  1. Backend Development Mastery (4 books)
  2. Modern Frontend Development (4 books)
  3. Full Stack Web Development (6 books)
  4. DevOps & Cloud Engineering (4 books)

- **18 Programming Books** with metadata (genre, category, description, pages, etc.)

- **90 Quiz Questions** (5 per book) with varying difficulty levels

## 🛠️ Troubleshooting

### Issue: "Column already exists"

Some migrations add columns conditionally. If you see this error:
```sql
ALTER TABLE table_name ADD COLUMN IF NOT EXISTS column_name type;
```
This is safe to ignore.

### Issue: "Policy already exists"

Drop existing policies first:
```sql
DROP POLICY IF EXISTS "policy_name" ON table_name;
```

### Issue: Admin user not created

Edit `step12_make_user_admin.sql` and replace:
```sql
UPDATE profiles 
SET is_admin = true 
WHERE id = 'YOUR_ACTUAL_USER_ID_HERE';
```

Get your user ID from Supabase Dashboard → Authentication → Users

### Issue: Missing books in learning paths

Run `query_check_roadmap_books.sql` to verify book associations. If missing, re-run:
- `step10_insert_sample_books.sql` (this creates learning paths AND books)

### Issue: Foreign key constraint error in Step 10

**Error:** `learning_path_id is not present in table "learning_paths"`

**Solution:** This was fixed in the updated version. Step 10 now creates learning paths first, then inserts books. If you still see this error:
1. Verify Steps 1-9 ran successfully
2. Check if learning_paths table exists: `SELECT * FROM learning_paths;`
3. Re-run Step 10 - it now includes learning path creation

### Issue: Need to start fresh

To reset roadmap books only:
```sql
-- Run utility_drop_roadmap_books.sql
DELETE FROM roadmap_books;
```

To reset everything (⚠️ CAUTION - deletes all data):
```sql
-- Not recommended for production
-- Manually drop tables in reverse order if needed
```

## 📝 Next Steps After Setup

1. **Login to your app** with your admin account
2. **Navigate to Admin Dashboard** to verify:
   - Learning Paths are visible
   - Books are populated
   - Quizzes are loaded
3. **As a regular user**, test:
   - Browsing learning paths
   - Adding books to reading list
   - Taking quizzes
   - Tracking progress

## 🤝 Support

For issues or questions:
- Check Supabase logs in Dashboard → Database → Logs
- Review RLS policies: Dashboard → Authentication → Policies
- Verify table structure: Dashboard → Table Editor

## 📚 Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)

---

**Last Updated:** 2024
**Database Version:** 1.0
**Compatible with:** Supabase PostgreSQL 15+
