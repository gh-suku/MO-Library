# 🔧 Troubleshooting Notes

## Common Issues and Solutions

### ✅ FIXED: Foreign Key Constraint Error in Step 10

**Error Message:**
```
ERROR: 23503: insert or update on table "roadmap_books" violates foreign key constraint "roadmap_books_learning_path_id_fkey"
DETAIL: Key (learning_path_id)=(c34b63f1-9c4b-4a36-a27a-45c0fd2704ff) is not present in table "learning_paths"
```

**Cause:**
Step 10 was trying to insert books into learning paths that didn't exist yet.

**Solution:**
Step 10 has been updated to:
1. First create the 4 learning paths
2. Then insert the 18 programming books
3. Finally associate books with learning paths

**Action Required:**
Simply re-run `step10_insert_sample_books.sql` - it now handles everything correctly.

---

### How to Verify Step 10 Worked

After running Step 10, verify with these queries:

```sql
-- Check learning paths were created
SELECT id, title, difficulty_level 
FROM learning_paths 
ORDER BY title;
-- Expected: 4 learning paths

-- Check books were inserted
SELECT COUNT(*) as book_count 
FROM books;
-- Expected: 18 books

-- Check books are associated with paths
SELECT 
  lp.title as learning_path,
  COUNT(rb.id) as book_count
FROM learning_paths lp
LEFT JOIN roadmap_books rb ON lp.id = rb.learning_path_id
GROUP BY lp.title
ORDER BY lp.title;
-- Expected: 
-- Backend Development: 4 books
-- DevOps & Cloud: 4 books
-- Frontend Development: 4 books
-- Full Stack Development: 6 books
```

---

### What Changed in Step 10

**Old Version:**
```sql
-- Only inserted books and tried to link them
-- Failed because learning_paths didn't exist
```

**New Version:**
```sql
-- 1. Creates learning_paths first
-- 2. Then inserts books
-- 3. Finally creates roadmap_books associations
```

---

### If You Already Ran Steps 1-9 Successfully

You're in good shape! Just run the updated Step 10 and continue with Steps 11-12.

```sql
-- Run in Supabase SQL Editor:
-- 1. Copy contents of step10_insert_sample_books.sql
-- 2. Paste and execute
-- 3. Continue with step11_add_quiz_questions.sql
-- 4. Continue with step12_make_user_admin.sql
```

---

### Complete Verification After All Steps

After running all steps (1-12), run this complete check:

```sql
SELECT 
  'Learning Paths' as item, 
  COUNT(*)::text as count 
FROM learning_paths
UNION ALL
SELECT 'Books', COUNT(*)::text FROM books
UNION ALL
SELECT 'Books in Paths', COUNT(*)::text FROM roadmap_books
UNION ALL
SELECT 'Quiz Questions', COUNT(*)::text FROM reading_quiz_questions
UNION ALL
SELECT 'Admin Users', COUNT(*)::text FROM profiles WHERE is_admin = true;
```

**Expected Results:**
- Learning Paths: 4
- Books: 18
- Books in Paths: 18
- Quiz Questions: 90
- Admin Users: 1 (or more)

---

## Other Potential Issues

### Issue: "Column already exists"
**Solution:** Safe to ignore - migrations use `IF NOT EXISTS` where possible

### Issue: "Policy already exists"
**Solution:** Safe to ignore - migrations drop existing policies before creating new ones

### Issue: Step 12 doesn't set you as admin
**Solution:** 
1. Get your user ID from: Supabase Dashboard → Authentication → Users
2. Edit `step12_make_user_admin.sql`
3. Replace `'YOUR_USER_ID_HERE'` with your actual user ID
4. Run the updated query

### Issue: Need to start over
**Solution:**
```sql
-- To reset roadmap books only:
DELETE FROM roadmap_books;
DELETE FROM learning_paths;

-- Then re-run:
-- step10_insert_sample_books.sql
-- step11_add_quiz_questions.sql
```

**⚠️ Warning:** Don't delete books if users have already added them to reading lists!

---

## Getting Help

If you encounter other issues:

1. **Check Supabase Logs:**
   - Dashboard → Database → Logs
   - Look for detailed error messages

2. **Verify Table Structure:**
   - Dashboard → Table Editor
   - Ensure all 14 tables exist

3. **Check RLS Policies:**
   - Dashboard → Authentication → Policies
   - Verify policies are enabled

4. **Run Verification Queries:**
   - Use `query_verify_sample_data.sql`
   - Use `query_check_roadmap_books.sql`
   - Use `query_check_books_with_quizzes.sql`

---

**Last Updated:** 2024  
**Issue Fixed:** Step 10 foreign key constraint  
**Status:** ✅ Resolved
