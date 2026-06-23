# 🔄 Database Migration Flow Diagram

## Visual Migration Sequence

```
┌─────────────────────────────────────────────────────────────────┐
│                     PHASE 1: FOUNDATION                         │
└─────────────────────────────────────────────────────────────────┘

    ┌────────────────────────────────────────┐
    │  STEP 1: Initial Schema                │
    │  ────────────────────────               │
    │  • profiles                            │
    │  • seats                               │
    │  • bookings                            │
    │  • Basic RLS policies                  │
    └────────────────────┬───────────────────┘
                         │
                         ▼
    ┌────────────────────────────────────────┐
    │  STEP 2: User Trigger                  │
    │  ────────────────────                  │
    │  • Auto-create profile on signup       │
    │  • handle_new_user() function          │
    └────────────────────┬───────────────────┘
                         │
                         ▼
    ┌────────────────────────────────────────┐
    │  STEP 3: Admin Functionality           │
    │  ────────────────────────               │
    │  • Add is_admin column                 │
    │  • Admin RLS policies                  │
    └────────────────────┬───────────────────┘
                         │
                         │
┌─────────────────────────────────────────────────────────────────┐
│                     PHASE 2: FEATURES                           │
└─────────────────────────────────────────────────────────────────┘
                         │
                         ▼
    ┌────────────────────────────────────────┐
    │  STEP 4: Community & Books             │
    │  ────────────────────────               │
    │  • books                               │
    │  • community_posts                     │
    │  • post_likes                          │
    │  • post_comments                       │
    │  • book_requests                       │
    └────────────────────┬───────────────────┘
                         │
                         ▼
    ┌────────────────────────────────────────┐
    │  STEP 5: Enhanced Books System         │
    │  ────────────────────────               │
    │  • user_reading_list                   │
    │  • reading_quiz_questions              │
    │  • user_quiz_attempts                  │
    │  • learning_paths                      │
    │  • roadmap_books                       │
    │  • user_roadmap_progress               │
    │  • Trigger functions                   │
    └────────────────────┬───────────────────┘
                         │
                         ▼
    ┌────────────────────────────────────────┐
    │  STEP 6: Payment & Admin Fixes         │
    │  ────────────────────────               │
    │  • payment_id column                   │
    │  • amount_paid column                  │
    │  • Policy fixes                        │
    └────────────────────┬───────────────────┘
                         │
                         │
┌─────────────────────────────────────────────────────────────────┐
│                     PHASE 3: SECURITY                           │
└─────────────────────────────────────────────────────────────────┘
                         │
                         ▼
    ┌────────────────────────────────────────┐
    │  STEP 7: Reading List RLS              │
    │  ────────────────────────               │
    │  • user_reading_list policies          │
    │  • Basic CRUD permissions              │
    └────────────────────┬───────────────────┘
                         │
                         ▼
    ┌────────────────────────────────────────┐
    │  STEP 8: Complete RLS Policies         │
    │  ────────────────────────               │
    │  • All table RLS enabled               │
    │  • Quiz policies                       │
    │  • Learning path policies              │
    │  • Progress tracking policies          │
    │  • Refined trigger functions           │
    └────────────────────┬───────────────────┘
                         │
                         ▼
    ┌────────────────────────────────────────┐
    │  STEP 9: Progress Tracking             │
    │  ────────────────────────               │
    │  • Enhanced roadmap progress           │
    │  • Improved trigger logic              │
    │  • recalculate_roadmap_progress()      │
    └────────────────────┬───────────────────┘
                         │
                         │
┌─────────────────────────────────────────────────────────────────┐
│                   PHASE 4: SAMPLE DATA                          │
└─────────────────────────────────────────────────────────────────┘
                         │
                         ▼
    ┌────────────────────────────────────────┐
    │  STEP 10: Insert Sample Books          │
    │  ────────────────────────               │
    │  • 18 Programming Books                │
    │  • 4 Learning Paths:                   │
    │    - Backend Development (4 books)     │
    │    - Frontend Development (4 books)    │
    │    - Full Stack Development (6 books)  │
    │    - DevOps & Cloud (4 books)          │
    │  • roadmap_books associations          │
    └────────────────────┬───────────────────┘
                         │
                         ▼
    ┌────────────────────────────────────────┐
    │  STEP 11: Add Quiz Questions           │
    │  ────────────────────────               │
    │  • 90 Quiz Questions Total             │
    │  • 5 questions per book                │
    │  • Easy, Medium, Hard difficulty       │
    │  • Multiple choice format              │
    └────────────────────┬───────────────────┘
                         │
                         ▼
    ┌────────────────────────────────────────┐
    │  STEP 12: Make User Admin              │
    │  ────────────────────────               │
    │  ⚠️  EDIT THIS FILE FIRST!             │
    │  • Replace YOUR_USER_ID_HERE           │
    │  • Set is_admin = true                 │
    └────────────────────┬───────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                  ✅ DATABASE READY TO USE!                      │
└─────────────────────────────────────────────────────────────────┘
```

## Data Flow Relationships

```
profiles
    ├──> bookings (user bookings)
    ├──> community_posts (user posts)
    ├──> post_likes (user likes)
    ├──> post_comments (user comments)
    ├──> user_reading_list (reading progress)
    ├──> user_quiz_attempts (quiz history)
    └──> user_roadmap_progress (learning path progress)

books
    ├──> roadmap_books (books in learning paths)
    ├──> user_reading_list (user's book list)
    ├──> reading_quiz_questions (book quizzes)
    └──> user_quiz_attempts (quiz attempts)

learning_paths
    ├──> roadmap_books (path's books)
    └──> user_roadmap_progress (user progress)

community_posts
    ├──> post_likes (post likes)
    └──> post_comments (post comments)
```

## Security Layer (RLS)

```
┌──────────────────────────────────────────────────────────┐
│                    RLS POLICY STRUCTURE                  │
└──────────────────────────────────────────────────────────┘

PUBLIC DATA (All Authenticated Users)
    • books (SELECT)
    • learning_paths (SELECT published)
    • roadmap_books (SELECT)
    • reading_quiz_questions (SELECT)
    • seats (SELECT)

USER DATA (Own Data Only)
    • profiles (SELECT, UPDATE own)
    • bookings (CRUD own)
    • community_posts (CRUD own)
    • post_likes (INSERT, DELETE own)
    • post_comments (CRUD own)
    • user_reading_list (CRUD own)
    • user_quiz_attempts (SELECT, INSERT own)
    • user_roadmap_progress (CRUD own)

ADMIN DATA (is_admin = true)
    • All tables (FULL ACCESS)
    • Can manage books, quizzes, learning paths
    • Can view all user data
    • Can update book requests
```

## Trigger Automation

```
┌─────────────────────────────────────────────────────────────┐
│                    AUTOMATED PROCESSES                      │
└─────────────────────────────────────────────────────────────┘

USER SIGNUP
    auth.users (INSERT)
        ↓
    [Trigger: on_auth_user_created]
        ↓
    profiles (AUTO INSERT)
        ↓
    User profile created automatically


BOOK RATING
    user_reading_list (UPDATE user_rating)
        ↓
    [Trigger: trigger_update_book_rating]
        ↓
    books.rating (AUTO UPDATE)
        ↓
    Average rating recalculated


ROADMAP PROGRESS
    user_reading_list (UPDATE status = 'completed')
        ↓
    [Trigger: trigger_update_roadmap_progress]
        ↓
    user_roadmap_progress (AUTO UPDATE)
        ↓
    Books completed count incremented
```

## Migration Dependencies

```
STEP 1 ──┐
         ├──> STEP 2 ──> STEP 3 ──> STEP 4 ──┐
                                              ├──> STEP 5 ──┐
                                                            ├──> STEP 6 ──> STEP 7 ──> STEP 8 ──> STEP 9 ──┐
                                                                                                            ├──> STEP 10 ──> STEP 11 ──> STEP 12
```

**Key Dependencies:**
- Steps 1-3: Foundation (must run first)
- Steps 4-5: Feature tables (depends on Step 3)
- Steps 6-9: Enhancements and security (depends on Steps 4-5)
- Steps 10-11: Sample data (depends on all previous)
- Step 12: Admin setup (can run anytime after Step 3)

## Verification Points

```
After STEP 3:  Check admin column exists
After STEP 5:  Check 14 tables exist
After STEP 8:  Check RLS enabled on all tables
After STEP 11: Check 18 books, 4 paths, 90 questions
After STEP 12: Check you are admin
```

## Quick Verification Commands

```sql
-- After Step 5: Count tables
SELECT COUNT(*) FROM information_schema.tables 
WHERE table_schema = 'public';
-- Expected: ~14 tables

-- After Step 8: Check RLS
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public';
-- Expected: All true

-- After Step 11: Count data
SELECT 
  (SELECT COUNT(*) FROM books) as books,
  (SELECT COUNT(*) FROM learning_paths) as paths,
  (SELECT COUNT(*) FROM reading_quiz_questions) as quizzes;
-- Expected: 18, 4, 90

-- After Step 12: Verify admin
SELECT email, is_admin FROM profiles WHERE is_admin = true;
-- Expected: Your email with is_admin = true
```

---

**Total Phases:** 4  
**Total Steps:** 12  
**Estimated Time:** 5-10 minutes  
**Result:** Production-ready database with sample data ✅
