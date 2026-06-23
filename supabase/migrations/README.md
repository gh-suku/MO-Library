# MO-Library Database Migrations

## 🚀 Quick Start

**Run these files in Supabase SQL Editor in numerical order:**

1. `step01_initial_schema.sql` - Base tables
2. `step02_user_trigger.sql` - Auto profile creation
3. `step03_admin_functionality.sql` - Admin roles
4. `step04_community_and_books.sql` - Books & community
5. `step05_enhanced_books_system.sql` - Learning system
6. `step06_payment_and_admin_fixes.sql` - Payment tracking
7. `step07_reading_list_rls_policies.sql` - Reading list security
8. `step08_complete_rls_policies.sql` - Complete RLS
9. `step09_roadmap_progress_tracking.sql` - Progress tracking
10. `step10_insert_sample_books.sql` - Sample books
11. `step11_add_quiz_questions.sql` - Quiz questions
12. `step12_make_user_admin.sql` - ⚠️ **Edit this first!** Add your user ID
13. `step13_prevent_double_booking.sql` - ⚠️ **IMPORTANT: Bug Fix** - Prevents double booking

## 📖 Full Documentation

See **[DATABASE_SETUP_GUIDE.md](./DATABASE_SETUP_GUIDE.md)** for complete instructions.

## 📁 File Organization

### Required Files (Run in Order)
- `step01_*.sql` through `step12_*.sql` - Core migrations

### Query Files (Verification)
- `query_*.sql` - Check your data

### Utility Files (Optional)
- `utility_*.sql` - Maintenance scripts
- `optional_*.sql` - Alternative configurations

### Archive Files (Reference Only)
- `archive_*.sql` - Historical versions

## ✅ Verify Setup

```sql
-- Check tables
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' ORDER BY table_name;

-- Check admin status
SELECT id, email, is_admin FROM profiles WHERE is_admin = true;

-- Count data
SELECT 'Learning Paths' as type, COUNT(*) as count FROM learning_paths
UNION ALL
SELECT 'Books', COUNT(*) FROM books
UNION ALL
SELECT 'Quiz Questions', COUNT(*) FROM reading_quiz_questions;
```

## 🆘 Need Help?

- Check **DATABASE_SETUP_GUIDE.md** for troubleshooting
- Review Supabase Dashboard → Database → Logs
- Ensure you run files in the correct order

---

**Total Migrations:** 13 steps
**Estimated Time:** 5-10 minutes
**Sample Data:** 18 books, 4 learning paths, 90 quiz questions
**Bug Fixes:** Double booking prevention ✅
