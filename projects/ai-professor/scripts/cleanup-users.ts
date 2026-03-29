/**
 * Database Cleanup Script
 * 
 * This script removes all test users except the admin account (bryanbleong@gmail.com)
 * and cleans up related data (enrollments, progress, profiles, etc.)
 * 
 * Usage: npx ts-node scripts/cleanup-users.ts [--dry-run]
 */

import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import path from 'path'

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../.env.local') })

const ADMIN_EMAIL = 'bryanbleong@gmail.com'

async function main() {
  const isDryRun = process.argv.includes('--dry-run')
  
  console.log('🧹 Database Cleanup Script')
  console.log('==========================')
  console.log(`Mode: ${isDryRun ? 'DRY RUN (no changes will be made)' : 'LIVE (changes will be applied)'}`)
  console.log(`Admin email to keep: ${ADMIN_EMAIL}`)
  console.log('')
  
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  
  if (!supabaseUrl || !supabaseServiceKey) {
    console.error('❌ Error: Missing Supabase credentials')
    console.error('Make sure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set in .env.local')
    process.exit(1)
  }
  
  const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
  
  try {
    // Step 1: Get all users
    console.log('📋 Step 1: Fetching all users...')
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('*')
    
    if (usersError) throw usersError
    
    console.log(`   Found ${users?.length || 0} users`)
    
    if (!users || users.length === 0) {
      console.log('✅ No users to clean up')
      return
    }
    
    // Step 2: Identify users to delete
    const adminUser = users.find(u => u.email === ADMIN_EMAIL)
    const usersToDelete = users.filter(u => u.email !== ADMIN_EMAIL)
    
    if (!adminUser) {
      console.log(`⚠️  Warning: Admin user (${ADMIN_EMAIL}) not found in database`)
      console.log(`   This script will not delete any users to be safe`)
      return
    }
    
    console.log(`   Admin user found: ${adminUser.email} (${adminUser.id})`)
    console.log(`   Users to delete: ${usersToDelete.length}`)
    
    if (usersToDelete.length === 0) {
      console.log('✅ No test users to remove')
      return
    }
    
    console.log('')
    console.log('Users to be removed:')
    usersToDelete.forEach((user, i) => {
      console.log(`   ${i + 1}. ${user.email} (${user.id})`)
    })
    console.log('')
    
    if (isDryRun) {
      console.log('🔍 DRY RUN COMPLETE')
      console.log('To apply these changes, run: npx ts-node scripts/cleanup-users.ts')
      return
    }
    
    // Step 3: Delete related data for each user
    console.log('🗑️  Step 2: Deleting related data...')
    
    for (const user of usersToDelete) {
      console.log(`   Processing ${user.email}...`)
      
      // Delete progress
      const { error: progressError } = await supabase
        .from('progress')
        .delete()
        .eq('user_id', user.id)
      
      if (progressError) {
        console.error(`   ❌ Error deleting progress for ${user.email}:`, progressError.message)
      } else {
        console.log(`   ✓ Deleted progress records`)
      }
      
      // Delete enrollments
      const { error: enrollmentError } = await supabase
        .from('enrollments')
        .delete()
        .eq('user_id', user.id)
      
      if (enrollmentError) {
        console.error(`   ❌ Error deleting enrollments for ${user.email}:`, enrollmentError.message)
      } else {
        console.log(`   ✓ Deleted enrollment records`)
      }
      
      // Delete ratings
      const { error: ratingsError } = await supabase
        .from('ratings')
        .delete()
        .eq('user_id', user.id)
      
      if (ratingsError && ratingsError.code !== 'PGRST116') {
        console.error(`   ❌ Error deleting ratings for ${user.email}:`, ratingsError.message)
      } else {
        console.log(`   ✓ Deleted rating records`)
      }
      
      // Delete project submissions
      const { error: submissionsError } = await supabase
        .from('project_submissions')
        .delete()
        .eq('user_id', user.id)
      
      if (submissionsError && submissionsError.code !== 'PGRST116') {
        console.error(`   ❌ Error deleting project submissions for ${user.email}:`, submissionsError.message)
      } else {
        console.log(`   ✓ Deleted project submission records`)
      }
      
      // Delete assessment attempts
      const { error: attemptsError } = await supabase
        .from('assessment_attempts')
        .delete()
        .eq('user_id', user.id)
      
      if (attemptsError && attemptsError.code !== 'PGRST116') {
        console.error(`   ❌ Error deleting assessment attempts for ${user.email}:`, attemptsError.message)
      } else {
        console.log(`   ✓ Deleted assessment attempt records`)
      }
      
      // Delete subscriptions
      const { error: subsError } = await supabase
        .from('subscriptions')
        .delete()
        .eq('user_id', user.id)
      
      if (subsError && subsError.code !== 'PGRST116') {
        console.error(`   ❌ Error deleting subscriptions for ${user.email}:`, subsError.message)
      } else {
        console.log(`   ✓ Deleted subscription records`)
      }
      
      // Delete profiles
      const { error: profileError } = await supabase
        .from('profiles')
        .delete()
        .eq('id', user.id)
      
      if (profileError && profileError.code !== 'PGRST116') {
        console.error(`   ❌ Error deleting profile for ${user.email}:`, profileError.message)
      } else {
        console.log(`   ✓ Deleted profile record`)
      }
      
      console.log('')
    }
    
    // Step 4: Delete users
    console.log('🗑️  Step 3: Deleting users...')
    const userIdsToDelete = usersToDelete.map(u => u.id)
    
    const { error: deleteError } = await supabase
      .from('users')
      .delete()
      .in('id', userIdsToDelete)
    
    if (deleteError) throw deleteError
    
    console.log(`   ✓ Deleted ${usersToDelete.length} users`)
    console.log('')
    
    // Step 5: Verify cleanup
    console.log('✅ Step 4: Verifying cleanup...')
    const { data: remainingUsers, error: verifyError } = await supabase
      .from('users')
      .select('*')
    
    if (verifyError) throw verifyError
    
    console.log(`   Remaining users: ${remainingUsers?.length || 0}`)
    
    if (remainingUsers && remainingUsers.length > 0) {
      console.log('   Remaining user(s):')
      remainingUsers.forEach(u => console.log(`     - ${u.email}`))
    }
    
    console.log('')
    console.log('🎉 Cleanup complete!')
    console.log(`✅ Admin account preserved: ${ADMIN_EMAIL}`)
    console.log(`✅ Removed ${usersToDelete.length} test users`)
    
  } catch (error) {
    console.error('❌ Error during cleanup:', error)
    process.exit(1)
  }
}

main()
