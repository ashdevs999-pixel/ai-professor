# Supabase Security Setup Guide

## 1. Verify RLS Status

### Option A: Run SQL in Supabase Dashboard
1. Go to: **https://supabase.com/dashboard**
2. Select your project
3. Click **SQL Editor**
4. Copy and paste the contents of `supabase/verify-rls.sql`
5. Click **Run**

### What to Look For:
- ✅ All tables should show `rls_enabled: true`
- ✅ Each table should have at least one policy
- ⚠️ If any table shows "NO POLICIES - AT RISK", that table is exposed

---

## 2. Set Up Logging Alerts

### Step 1: Enable Logging
1. Go to: **https://supabase.com/dashboard**
2. Select your project
3. Click **Logs** in sidebar
4. Ensure logs are being collected

### Step 2: Create Alerts for Suspicious Activity

Go to **Logs** → **Logs Explorer** and save these queries as alerts:

#### Alert 1: Failed Auth Attempts (Brute Force)
```
# Filter for failed authentication
t.timestamp > now() - interval '5 minutes'
and req.path = '/auth/v1/token'
and resp.status_code = 401
| group by t.timestamp, req.ip
| count
```
**Alert if:** More than 5 failures from same IP in 5 minutes

#### Alert 2: Service Role Key Usage
```
# Filter for service role usage (should only be from your servers)
t.timestamp > now() - interval '1 hour'
and req.headers['x-supabase-role'] = 'service_role'
| group by t.timestamp, req.ip, req.path
```
**Alert if:** Requests from unknown IPs

#### Alert 3: Unusual API Volume
```
# Filter for high request volume
t.timestamp > now() - interval '1 minute'
| group by req.ip
| count
```
**Alert if:** More than 100 requests per minute from single IP

#### Alert 4: Data Exfiltration Attempts
```
# Filter for large data exports
t.timestamp > now() - interval '1 hour'
and resp.content_length > 1000000
| group by t.timestamp, req.ip, req.path
```
**Alert if:** Responses over 1MB (potential data dump)

---

## 3. Set Up Email/Webhook Alerts

1. Go to: **Project Settings** → **Alerts**
2. Click **Create Alert**
3. Configure:
   - **Name:** Security Alert
   - **Trigger:** Custom log query
   - **Action:** Email or Webhook
   - **Webhook URL:** (optional) Your monitoring service

---

## 4. Additional Security Recommendations

### API Rate Limiting
Already in code, but consider adding **Supabase-side rate limiting**:
1. Go to: **Project Settings** → **API**
2. Enable **Rate Limiting**
3. Set limits per your needs

### Allowed Origins
Restrict which domains can use your API:
1. Go to: **Project Settings** → **API**
2. Add **Allowed Origins**:
   - `https://ai-professor-red.vercel.app`
   - `https://pulseaiprofessor.com`
   - `http://localhost:3000` (development only)

### Disable Anonymous Key (Optional)
If you don't need anonymous access:
1. Create a new anon key with restricted permissions
2. Or use authenticated-only access

---

## 5. Regular Security Checklist

Run this monthly:
- [ ] Review Supabase logs for anomalies
- [ ] Check RLS policies are still in place
- [ ] Rotate any exposed API keys
- [ ] Review user access and permissions
- [ ] Update dependencies (`npm audit`)
- [ ] Check Vercel deployment logs

---

## Quick Reference: Your Tables

| Table | RLS Enabled? | Policy Type |
|-------|--------------|-------------|
| users | ✅ | User owns data |
| courses | ✅ | Published or instructor |
| lessons | ✅ | Enrolled users only |
| enrollments | ✅ | User owns data |
| progress | ✅ | User owns data |
| subscriptions | ✅ | User owns data |
| news_items | ✅ | Public read |
| news_sources | ✅ | Public read |
| news_audio | ✅ | Public read |

Run `verify-rls.sql` to confirm these are active.
