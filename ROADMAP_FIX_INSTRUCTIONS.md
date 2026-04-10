# Roadmap Books Fix - Step by Step Guide

## Problem
The learning paths (roadmaps) contain incorrect books - classic literature instead of programming books.

## Solution
Follow these steps in order to fix the roadmaps:

---

## Step 1: Check Current State ✓ (COMPLETED)
**File:** `supabase/migrations/check_roadmap_books.sql`

Run this query to see current books in each roadmap.

**Result:** Found 4 roadmaps with wrong books (Alice in Wonderland, Frankenstein, etc.)

---

## Step 2: Remove Incorrect Book Associations
**File:** `supabase/migrations/step2_drop_incorrect_roadmap_books.sql`

This removes all book associations from roadmaps (does NOT delete the books themselves).

**Run this query in Supabase SQL Editor**

Expected result: All roadmaps will have 0 books.

---

## Step 3: Insert Programming Books and Add to Roadmaps
**File:** `supabase/migrations/step3_insert_programming_books.sql`

This does two things:
1. Inserts 18 relevant programming books into the `books` table
2. Associates these books with the correct roadmaps

**Books Added:**

### Backend Development (4 books)
- Node.js Design Patterns
- Database Design and Implementation
- RESTful Web API Design with Node.js
- Building Microservices

### Frontend Development (4 books)
- HTML and CSS: Design and Build Websites
- JavaScript: The Definitive Guide
- Learning React: Modern Patterns
- Web Performance in Action

### Full Stack Development (6 books)
- Full Stack JavaScript Development
- Pro MERN Stack
- Web Security for Developers
- Testing JavaScript Applications
- Learning GraphQL
- Architecting Modern Web Applications

### DevOps & Cloud (4 books)
- Docker Deep Dive
- Kubernetes in Action
- Continuous Delivery with Docker and Jenkins
- Cloud Native DevOps with Kubernetes

**Run this query in Supabase SQL Editor**

Expected result: Each roadmap will have the correct number of programming books.

---

## Step 4: Add Quizzes for Each Book
**File:** `supabase/migrations/step4_add_quizzes_for_books.sql`

This adds 5 quiz questions for each of the 18 programming books (90 questions total).

Each quiz includes:
- Questions relevant to the book topic
- 4 multiple choice options (A, B, C, D)
- Correct answer
- Difficulty level (easy, medium, hard)

**Run this query in Supabase SQL Editor**

Expected result: 90 quiz questions added (5 per book).

---

## Step 5: Clean Up Duplicate Roadmaps (Optional)
**File:** `supabase/migrations/step5_cleanup_duplicate_roadmaps.sql`

This removes the duplicate empty roadmaps you have.

**Run this query in Supabase SQL Editor**

Expected result: Only 4 roadmaps remain (one of each type).

---

## Verification Queries

After completing all steps, run these to verify:

### Check roadmaps and book counts
```sql
SELECT 
    lp.title,
    lp.difficulty_level,
    COUNT(rb.id) as book_count
FROM learning_paths lp
LEFT JOIN roadmap_books rb ON lp.id = rb.learning_path_id
GROUP BY lp.id, lp.title, lp.difficulty_level
ORDER BY lp.title;
```

### Check books in each roadmap
```sql
SELECT 
    lp.title as roadmap,
    b.title as book,
    rb.sequence_order,
    rb.is_required
FROM learning_paths lp
JOIN roadmap_books rb ON lp.id = rb.learning_path_id
JOIN books b ON rb.book_id = b.id
ORDER BY lp.title, rb.sequence_order;
```

### Check quiz counts
```sql
SELECT 
    b.title as book,
    COUNT(q.id) as quiz_count
FROM books b
LEFT JOIN reading_quiz_questions q ON b.id = q.book_id
WHERE b.id LIKE '%book-%'
GROUP BY b.title
ORDER BY b.title;
```

---

## Expected Final State

- **4 Learning Paths** (Backend, Frontend, Full Stack, DevOps)
- **18 Programming Books** (relevant to their roadmaps)
- **90 Quiz Questions** (5 per book)
- **No duplicate roadmaps**
- **No classic literature books in roadmaps**

---

## Rollback (if needed)

If something goes wrong, you can:

1. Delete the new books:
```sql
DELETE FROM books WHERE id LIKE 'backend-book-%' 
   OR id LIKE 'frontend-book-%' 
   OR id LIKE 'fullstack-book-%' 
   OR id LIKE 'devops-book-%';
```

2. Delete the quizzes:
```sql
DELETE FROM reading_quiz_questions WHERE book_id LIKE '%book-%';
```

3. Clear roadmap associations:
```sql
DELETE FROM roadmap_books;
```

---

## Notes

- All book IDs use simple prefixes (backend-book-1, frontend-book-2, etc.)
- Books are marked as 'both' type (physical and ebook)
- Each roadmap has 4-6 books in logical learning sequence
- Required books are marked with `is_required = true`
- Optional advanced books are marked with `is_required = false`
