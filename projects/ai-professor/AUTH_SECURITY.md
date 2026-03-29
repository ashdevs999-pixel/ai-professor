# AI Professor - Authentication & Security

> **Purpose:** Authentication flow, access control, and security configuration

---

## 🔐 How to Log In

### Regular User Login
1. Go to: **https://ai-professor-red.vercel.app/auth/signin**
2. Click **"Continue with Google"**
3. Sign in with Google account
4. Redirected to `/dashboard`

### Admin Login
**Same flow as regular user** - admin privileges are based on email.

**Admin Email:** `bryanbleong@gmail.com`

The system checks `session.user.email` against `ADMIN_EMAILS` array:
```typescript
const ADMIN_EMAILS = ['bryanbleong@gmail.com']
```

---

## 🛡️ Access Control Matrix

| Content Type | Public | Logged In | Enrolled | Admin |
|--------------|--------|-----------|----------|-------|
| News | ✅ | ✅ | ✅ | ✅ |
| Breaking News | ✅ | ✅ | ✅ | ✅ |
| Quick Guides | ✅ | ✅ | ✅ | ✅ |
| Course List | ✅ | ✅ | ✅ | ✅ |
| Course Detail | ✅ | ✅ | ✅ | ✅ |
| **Lesson Content** | ❌ | ❌ | ✅ Required | ✅ Bypass |
| Admin Panel | ❌ | ❌ | ❌ | ✅ Only |

---

## 🚨 Known Issues (as of 2026-03-29)

### Issue 1: Paid Content Not Protected
**Status:** 🔴 CRITICAL - Being fixed

**Problem:** Lesson pages are accessible without enrollment check. Anyone can view paid content.

**Impact:** Revenue leak - no incentive to pay for courses.

**Fix in Progress:**
- Adding enrollment check middleware
- Paywall for non-enrolled users
- Admin bypass (bryanbleong@gmail.com)

### Issue 2: No Admin Dashboard
**Status:** 🟡 Being created

**Problem:** No UI for admin to manage the site. Only API routes exist.

**Fix in Progress:**
- Creating `/admin` page
- Stats dashboard
- User/course management

### Issue 3: Test Users in Database
**Status:** 🟡 Script being created

**Problem:** Multiple test users in database need cleanup.

**Fix in Progress:**
- Creating cleanup script
- Keep only: bryanbleong@gmail.com
- Clean related data

---

## 📋 Admin Capabilities

### Available Now (via API)
- `GET /api/admin/stats` - View statistics
- `GET /api/admin/popular` - View popular content
- `GET /api/admin/activity` - View recent activity

### Coming Soon (Dashboard UI)
- User management
- Course management
- Content moderation
- Revenue analytics
- Settings configuration

---

## 🔑 Authentication Configuration

### Provider
- **NextAuth.js** (Auth.js v5)
- **Google OAuth** as primary provider

### Session Strategy
- JWT-based sessions
- Session includes: `user.id`, `user.email`, `user.subscription_tier`

### Environment Variables Required
```
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
NEXTAUTH_SECRET=...
NEXTAUTH_URL=https://ai-professor-red.vercel.app
```

---

## 📝 Database Tables

### User-Related Tables
| Table | Purpose | RLS |
|-------|---------|-----|
| `users` | User accounts | ✅ |
| `profiles` | User profiles | ✅ |
| `enrollments` | Course enrollments | ✅ |
| `progress` | Lesson progress | ✅ |
| `subscriptions` | Payment data | ✅ |

### Admin Access
Admin (`bryanbleong@gmail.com`) can access all tables via:
- API routes with admin check
- Supabase dashboard directly

---

## 🔄 Password/Session Reset

To force all users to re-authenticate:
1. Go to Supabase Dashboard
2. Authentication → Users
3. Select users → Invalidate sessions

**Note:** This logs everyone out including admin.

---

## 🚫 What Admin Cannot Do

- View other users' passwords (hashed, not stored)
- Bypass Stripe payments (not implemented yet)
- Modify other users' Google account info

---

## 📞 Support

For authentication issues:
1. Check browser console for errors
2. Check network tab for failed requests
3. Check Vercel logs: vercel.com → ai-professor → Deployments → Logs
4. Check Supabase logs: supabase.com/dashboard → Logs

---

**Last Updated:** 2026-03-29
