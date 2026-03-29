# Admin Guide - AI Professor

This guide explains how to log in and access the admin features of AI Professor.

## 🔐 How to Log In

### Step 1: Access the Login Page
1. Go to: **https://pulseaiprofessor.com** (or your local development URL)
2. Click the **"Sign In"** button in the top navigation

### Step 2: Sign In with Google
1. Click **"Sign in with Google"**
2. Use your admin Google account:
   - **Email:** `bryanbleong@gmail.com`
   - This is the only account with admin access

### Step 3: Complete Sign In
1. Follow Google's authentication flow
2. You'll be redirected back to the site automatically
3. You should now see your email in the navigation bar

## 🎛️ Accessing the Admin Panel

Once logged in:

1. Navigate to: **https://pulseaiprofessor.com/admin**
2. Or click the "Admin" link in your user menu (if available)

### Admin Panel Features

The admin dashboard provides:

- **📊 Dashboard Overview**
  - Total users
  - Total enrollments
  - Published courses
  - Revenue (placeholder - integrate with Stripe)

- **🎯 Quick Actions**
  - Manage Courses
  - Manage Users
  - View Enrollments
  - Content Management
  - Analytics
  - Settings

## 🎓 Admin Privileges

As admin, you have special access:

### Lesson Access
- ✅ **Bypass all enrollment checks** - You can view any lesson content without being enrolled
- ✅ **Admin badge** - You'll see a "Crown" icon and "Admin Access" badge on lesson pages
- ✅ **Full visibility** - Access all courses and lessons

### User Management
- ✅ View all registered users
- ✅ See user enrollment data
- ✅ Monitor user progress

### Content Management
- ✅ Create, edit, and delete courses
- ✅ Generate course content using AI
- ✅ Manage lessons and resources

### Analytics
- ✅ View enrollment statistics
- ✅ Track user engagement
- ✅ Monitor course performance

## 🗄️ Database Management

### Cleaning Up Test Users

If you have test users in the database, use the cleanup script:

```bash
# Preview what will be deleted (dry run)
npx ts-node scripts/cleanup-users.ts --dry-run

# Actually delete test users
npx ts-node scripts/cleanup-users.ts
```

**What the script does:**
- Keeps only `bryanbleong@gmail.com`
- Removes all other users
- Deletes related data:
  - Progress records
  - Enrollments
  - Profiles
  - Ratings
  - Project submissions
  - Assessment attempts
  - Subscriptions

**Important:**
- ⚠️ Always run with `--dry-run` first to preview changes
- ⚠️ This action cannot be undone
- ⚠️ Make sure you have a database backup

## 🔒 Security Notes

### Admin Email
- The admin email is hardcoded in:
  - `/lib/auth.ts` (ADMIN_EMAILS constant)
  - `/app/admin/page.tsx` (ADMIN_EMAILS constant)
  - `/app/courses/[id]/lessons/[lessonId]/page.tsx` (ADMIN_EMAILS constant)

### To Add More Admins
1. Edit the `ADMIN_EMAILS` array in the files above
2. Add additional email addresses
3. Deploy changes

Example:
```typescript
const ADMIN_EMAILS = [
  'bryanbleong@gmail.com',
  'another-admin@example.com'
]
```

## 📝 Common Tasks

### Creating a New Course
1. Currently done via scripts (see `/scripts/`)
2. Admin UI for course creation coming soon

### Viewing User Data
1. Go to `/admin`
2. Click "Manage Users"
3. View all registered users and their details

### Checking Enrollments
1. Go to `/admin`
2. Click "View Enrollments"
3. See which users are enrolled in which courses

### Viewing Analytics
1. Go to `/admin`
2. Click "Analytics"
3. View detailed statistics and reports

## 🐛 Troubleshooting

### Can't Access Admin Panel
- **Issue:** Redirected to home page
- **Solution:** Make sure you're logged in with `bryanbleong@gmail.com`

### Lesson Shows Paywall
- **Issue:** Admin still sees paywall
- **Solution:** 
  1. Clear browser cache
  2. Log out and log back in
  3. Check if email matches exactly

### Google OAuth Not Working
- **Issue:** Can't sign in with Google
- **Solution:**
  1. Check if Google OAuth is configured in `.env.local`
  2. Verify callback URLs in Google Cloud Console
  3. Check Supabase auth settings

## 📞 Support

If you encounter any issues:

1. Check the logs:
   - Browser console (F12)
   - Server logs (Vercel dashboard or local terminal)

2. Verify configuration:
   - `.env.local` has all required variables
   - Supabase is accessible
   - Google OAuth is properly configured

3. Contact development team if issues persist

## 🚀 Future Enhancements

Coming soon:
- [ ] Admin UI for course creation/editing
- [ ] User management interface
- [ ] Revenue tracking (Stripe integration)
- [ ] Advanced analytics dashboard
- [ ] Email notifications management
- [ ] Bulk operations for users/enrollments

---

**Last Updated:** 2026-03-29
**Version:** 1.0
