# 📋 Database Setup Checklist

Use this checklist to track your migration progress.

## Before You Start

- [ ] Supabase project created
- [ ] SQL Editor open in Supabase Dashboard
- [ ] User ID ready (from Authentication → Users)

## Core Migrations (Run in Order)

### Phase 1: Foundation
- [ ] **Step 1** - `step01_initial_schema.sql` - Base schema
- [ ] **Step 2** - `step02_user_trigger.sql` - User trigger
- [ ] **Step 3** - `step03_admin_functionality.sql` - Admin setup

### Phase 2: Features
- [ ] **Step 4** - `step04_community_and_books.sql` - Books & community
- [ ] **Step 5** - `step05_enhanced_books_system.sql` - Learning system
- [ ] **Step 6** - `step06_payment_and_admin_fixes.sql` - Payments

### Phase 3: Security
- [ ] **Step 7** - `step07_reading_list_rls_policies.sql` - RLS basics
- [ ] **Step 8** - `step08_complete_rls_policies.sql` - Complete RLS
- [ ] **Step 9** - `step09_roadmap_progress_tracking.sql` - Progress

### Phase 4: Sample Data
- [ ] **Step 10** - `step10_insert_sample_books.sql` - 18 books
- [ ] **Step 11** - `step11_add_quiz_questions.sql` - 90 questions
- [ ] **Step 12** - `step12_make_user_admin.sql` - ⚠️ **EDIT FIRST!**

## Verification

- [ ] Run `query_verify_sample_data.sql` to check everything
- [ ] Confirm 4 learning paths created
- [ ] Confirm 18 books created
- [ ] Confirm 90 quiz questions created
- [ ] Verify you are admin: `SELECT * FROM profiles WHERE is_admin = true;`

## Test in Application

- [ ] Login as admin
- [ ] Access Admin Dashboard
- [ ] View Learning Paths
- [ ] View Books
- [ ] View Quizzes
- [ ] Test as regular user (create test account)
- [ ] Browse learning paths
- [ ] Add book to reading list
- [ ] Take a quiz

## Troubleshooting

If you encounter issues:

1. **Column/Policy already exists** - Safe to ignore
2. **Admin not working** - Re-run step 12 with correct user ID
3. **Missing data** - Re-run steps 10 and 11
4. **Need to reset roadmap books** - Run `utility_drop_roadmap_books.sql`

## Quick Verification Query

```sql
-- Copy and run this after all migrations
SELECT 
  'Profiles' as table_name, COUNT(*) as count FROM profiles
UNION ALL
SELECT 'Books', COUNT(*) FROM books
UNION ALL
SELECT 'Learning Paths', COUNT(*) FROM learning_paths
UNION ALL
SELECT 'Roadmap Books', COUNT(*) FROM roadmap_books
UNION ALL
SELECT 'Quiz Questions', COUNT(*) FROM reading_quiz_questions
UNION ALL
SELECT 'Admins', COUNT(*) FROM profiles WHERE is_admin = true;
```

**Expected Results:**
- Books: 18
- Learning Paths: 4
- Roadmap Books: 18
- Quiz Questions: 90
- Admins: At least 1 (you!)

## Done! 🎉

If all checkboxes are checked and verification passed, your database is ready!

Next: Test your application features and enjoy your MO-Library system!

---

**Total Time:** ~5-10 minutes  
**Files Run:** 12 migrations  
**Tables Created:** 14 tables  
**Sample Data:** Ready to use!
