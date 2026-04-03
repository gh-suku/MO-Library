# Quick Fix Guide - Payment & Admin Issues

## Problem Summary
1. ❌ Error: "Could not find the 'amount_paid' column of 'bookings'"
2. ❌ Error: "policy 'Admins can view all profiles' for table 'profiles' already exists"

## Solution (3 Simple Steps)

### Step 1: Run the Fix Migration
Open your Supabase SQL Editor and run this file:
```
supabase/migrations/fix_all_issues.sql
```

Copy the entire content and execute it in the SQL Editor.

### Step 2: Verify the Fix
Run this query to confirm columns were added:
```sql
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'bookings' 
AND column_name IN ('payment_id', 'amount_paid');
```

You should see:
- `payment_id` (text)
- `amount_paid` (numeric)

### Step 3: Make Your First Admin User
Replace the email with your admin email:
```sql
UPDATE profiles 
SET is_admin = true 
WHERE email = 'your-email@example.com';
```

## What Was Fixed

### Code Changes:
✅ Updated `src/lib/supabase.ts` - Added payment fields to Booking type
✅ Fixed `supabase/migrations/newAccess.sql` - Now drops existing policies first
✅ Created `supabase/migrations/fix_all_issues.sql` - Complete fix in one file

### Database Changes (after running migration):
✅ Added `payment_id` column to bookings table
✅ Added `amount_paid` column to bookings table
✅ Added `is_admin` column to profiles table
✅ Fixed duplicate policy errors
✅ Added proper indexes for performance

## Test Your Payment Flow

1. Go to the Seat Booking page
2. Select a seat and time
3. Click "Pay & Book Seat"
4. Complete the Razorpay payment
5. Booking should be created successfully ✅

## Troubleshooting

### If you still get the "column not found" error:
1. Make sure you ran `fix_all_issues.sql` in the SQL Editor
2. Refresh your browser (clear cache if needed)
3. Check the database schema in Supabase Dashboard

### If you still get the "policy already exists" error:
The `newAccess.sql` file is now fixed with `DROP POLICY IF EXISTS` statements.
You can safely run it again.

### If payment doesn't work:
1. Check your `.env` file has `VITE_RAZORPAY_KEY_ID`
2. Make sure Razorpay is configured correctly
3. Check browser console for errors

## Files Modified
- ✅ `src/lib/supabase.ts` - Added payment fields to Booking type
- ✅ `supabase/migrations/newAccess.sql` - Fixed duplicate policy issue
- ✅ `supabase/migrations/fix_all_issues.sql` - New comprehensive fix
- ✅ `supabase/migrations/add_payment_columns.sql` - Alternative fix (payment only)

## Need Help?
Check `MIGRATION_INSTRUCTIONS.md` for detailed information.
