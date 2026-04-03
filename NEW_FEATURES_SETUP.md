# New Features Setup Guide

This guide will help you set up the three new features added to Mo-Library:

1. **Community Feed** - Users can post book requests, like posts, and comment/reply
2. **Book Search** - Search and filter available books in the library
3. **Book Request Form** - Request new books via Formspree integration

## Database Setup

### Step 1: Run the Migration

You need to run the new migration file to create the required database tables:

```bash
# Navigate to your Supabase project dashboard
# Go to SQL Editor and run the contents of:
supabase/migrations/community_and_books.sql
```

Or if you have Supabase CLI installed:

```bash
supabase db push
```

This will create the following tables:
- `books` - Store book information
- `community_posts` - User posts about book needs
- `post_likes` - Track post likes
- `post_comments` - Comments and replies on posts
- `book_requests` - Book requests submitted via form

## Formspree Setup

### Step 2: Configure Formspree

1. Go to [Formspree.io](https://formspree.io/) and create a free account
2. Create a new form project
3. Copy your form endpoint URL (looks like: `https://formspree.io/f/YOUR_FORM_ID`)
4. Update your `.env` file:

```env
VITE_FORMSPREE_ENDPOINT=https://formspree.io/f/YOUR_FORM_ID
```

5. In Formspree dashboard, configure:
   - Email notifications to receive book requests
   - Custom email templates (optional)
   - Spam protection settings

## Features Overview

### 1. Community Feed (`/community`)

Users can:
- Create posts about books they need
- Specify book title and duration needed
- Like posts from other users
- Comment on posts
- Reply to comments (nested replies)
- View all community activity

**Access:** Requires authentication

### 2. Book Search (`/book-search`)

Users can:
- Search books by title, author, or ISBN
- Filter by availability status
- View total and available copies
- See real-time availability

**Access:** Requires authentication

### 3. Book Request (`/book-request`)

Anyone can:
- Submit book requests with name and email
- Provide book title and author
- Add additional information
- Receive email confirmation via Formspree

**Access:** Public (no authentication required)

## Navigation

The new features are accessible from the navbar:
- **Community** - Community feed icon
- **Books** - Search icon for book search
- **Request** - BookPlus icon for book requests

## Admin Features

Admins can:
- Add new books to the library (via Admin panel)
- Update book availability
- Manage book copies
- View all book requests

## Testing the Features

### Test Community Feed:
1. Login to your account
2. Navigate to `/community`
3. Create a post about a book you need
4. Like and comment on posts

### Test Book Search:
1. Login to your account
2. Navigate to `/book-search`
3. Search for books (you'll need to add some via admin panel first)
4. Filter by availability

### Test Book Request:
1. Navigate to `/book-request` (no login required)
2. Fill out the form with your details
3. Submit and check your Formspree dashboard for the submission

## Adding Sample Books (Admin Only)

To test the book search feature, you'll need to add some books. Run this SQL in Supabase:

```sql
INSERT INTO books (title, author, isbn, total_copies, available_copies, is_available)
VALUES 
  ('The Great Gatsby', 'F. Scott Fitzgerald', '9780743273565', 3, 2, true),
  ('To Kill a Mockingbird', 'Harper Lee', '9780061120084', 2, 0, false),
  ('1984', 'George Orwell', '9780451524935', 4, 4, true),
  ('Pride and Prejudice', 'Jane Austen', '9780141439518', 2, 1, true),
  ('The Catcher in the Rye', 'J.D. Salinger', '9780316769174', 3, 3, true);
```

## Troubleshooting

### Community posts not showing:
- Check if the migration ran successfully
- Verify RLS policies are enabled
- Ensure user is authenticated

### Book search returns no results:
- Add books via SQL or admin panel
- Check database connection
- Verify table permissions

### Book request form not working:
- Verify `VITE_FORMSPREE_ENDPOINT` is set in `.env`
- Check Formspree dashboard for errors
- Ensure endpoint URL is correct

## Next Steps

1. Run the database migration
2. Set up Formspree endpoint
3. Add sample books for testing
4. Test all three features
5. Customize styling as needed

## Support

If you encounter any issues, check:
- Browser console for errors
- Supabase logs for database issues
- Formspree dashboard for form submission issues
