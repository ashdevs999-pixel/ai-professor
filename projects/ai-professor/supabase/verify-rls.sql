-- PART 5: Row Level Security (RLS)
-- Run this in Supabase SQL Editor to verify RLS status

-- Check RLS status on all tables
SELECT 
  schemaname,
  tablename,
  rowsecurity as rls_enabled
FROM pg_tables 
WHERE schemaname = 'public'
ORDER BY tablename;

-- List all RLS policies
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- Check for tables WITHOUT RLS policies (security risk!)
SELECT 
  t.tablename,
  CASE 
    WHEN p.policyname IS NULL THEN '⚠️ NO POLICIES - AT RISK!'
    ELSE '✅ Has policies'
  END as status
FROM pg_tables t
LEFT JOIN pg_policies p ON p.tablename = t.tablename AND p.schemaname = 'public'
WHERE t.schemaname = 'public'
GROUP BY t.tablename, p.policyname
ORDER BY t.tablename;
