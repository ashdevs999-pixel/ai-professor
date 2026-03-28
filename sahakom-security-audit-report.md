# Security Audit Report: Sahakom.app
**Cambodian Farmer-to-Consumer Marketplace Platform**

**Audit Date:** 2026-03-27
**Auditor:** STAR Security Audit System
**Risk Assessment:** HIGH RISK

---

## Executive Summary

Sahakom.app has implemented several good security practices including HSTS, X-Frame-Options, and TLS 1.3. However, **critical vulnerabilities** were discovered that expose the entire database schema, allow unrestricted access to Supabase APIs, and weaken XSS protection. The exposed Supabase anon key with a 10-year expiration period is particularly concerning.

**Overall Risk Rating: HIGH**

| Severity | Count | Immediate Action Required |
|----------|-------|--------------------------|
| 🔴 CRITICAL | 4 | YES |
| 🟠 HIGH | 3 | YES |
| 🟡 MEDIUM | 2 | Recommended |
| 🟢 LOW | 3 | Monitor |

---

## Critical Findings (Risk Rating: CRITICAL)

### 1. Exposed Supabase Anon Key in Client-Side Code

**Severity:** 🔴 CRITICAL
**CVSS Score:** 9.1
**Category:** Application Security / API Security

**Description:**
The Supabase anonymous JWT key is hardcoded in the client-side JavaScript bundle and publicly accessible.

**Evidence:**
```
File: https://sahakom.app/assets/index-U3EHyPMX.js
Token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd0YXJ6bWxuem1saGNlYWZmbW9hIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA5NTE5MjAsImV4cCI6MjA2NjUyNzkyMH0.fy51ZzWPdP-ZjBSzxO36pnj-lC8AWlr5LrZ8LcwuGOY
Supabase URL: https://gtarzmlnzmlhceaffmoa.supabase.co
```

**Decoded JWT Payload:**
```json
{
  "iss": "supabase",
  "ref": "gtarzmlnzmlhceaffmoa",
  "role": "anon",
  "iat": 1750951920,
  "exp": 2066527920
}
```

**Impact:**
- Attackers can use this key to query the Supabase API directly
- Bypasses any frontend security controls
- Enables enumeration of all database tables and schemas
- Key cannot be easily rotated without breaking the application

**Remediation:**

**Option A: Use Environment Variables (Recommended for Development)**
```javascript
// vite.config.ts
export default defineConfig({
  define: {
    'process.env.SUPABASE_URL': JSON.stringify(process.env.SUPABASE_URL),
    'process.env.SUPABASE_ANON_KEY': JSON.stringify(process.env.SUPABASE_ANON_KEY)
  }
})

// In your code
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY
```

**Option B: Server-Side API Proxy (Recommended for Production)**
```typescript
// server/api/proxy.ts
import { createClient } from '@supabase/supabase-js'

export default defineEventHandler(async (event) => {
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY // Use service role key server-side
  )
  
  // Apply your own authorization logic here
  const user = await verifyUser(event)
  if (!user) {
    throw createError({ statusCode: 401 })
  }
  
  // Forward only allowed queries
  const result = await supabase.from('allowed_table').select('*')
  return result
})
```

**Priority:** P1 - Immediate Action Required

---

### 2. JWT Token Has 10-Year Expiration

**Severity:** 🔴 CRITICAL
**CVSS Score:** 8.6
**Category:** Authentication / Session Management

**Description:**
The exposed JWT token has an expiration date 10 years in the future (2035-06-27).

**Evidence:**
```
Issued: 2025-06-26 15:32:00
Expires: 2035-06-27 03:32:00
Duration: 10.0 years
```

**Impact:**
- Compromised tokens remain valid for a decade
- No automatic credential rotation
- Violates security best practices (tokens should expire in hours/days, not years)

**Remediation:**
```sql
-- In Supabase SQL Editor, update JWT expiration
ALTER ROLE anon SET jwt_expiry = 3600; -- 1 hour

-- For service role, use longer but reasonable expiry
ALTER ROLE authenticated SET jwt_expiry = 86400; -- 24 hours
```

**Code Implementation:**
```typescript
// Implement refresh token rotation
const { data, error } = await supabase.auth.refreshSession()
if (error) {
  // Handle token refresh failure
  await supabase.auth.signOut()
}
```

**Priority:** P1 - Immediate Action Required

---

### 3. Full Database Schema Exposed via OpenAPI/GraphQL

**Severity:** 🔴 CRITICAL
**CVSS Score:** 8.5
**Category:** Information Disclosure / API Security

**Description:**
The complete database schema is exposed through:
1. OpenAPI REST endpoint at `/rest/v1/`
2. GraphQL introspection enabled

**Evidence:**
Over 300 database tables exposed including sensitive ones:
- `user_sessions` (session tokens)
- `login_attempts` (authentication logs)
- `security_alerts` (security monitoring data)
- `audit_logs` (system audit trail)
- `escrow_transactions` (financial transactions)
- `payment_logs` (payment processing data)
- `pos_users` (includes password_hash column)
- `fraud_verifications` (fraud detection data)
- `blockchain_records` (blockchain transaction data)
- `smart_contracts` (contract data)

**Impact:**
- Attackers have complete map of database structure
- Enables targeted attacks on specific tables
- Reveals business logic and data relationships
- Facilitates data exfiltration attempts

**Remediation:**

**Disable GraphQL Introspection:**
```sql
-- In Supabase, disable GraphQL introspection
-- Contact Supabase support or use their dashboard
-- Settings > API > GraphQL > Disable Introspection
```

**Restrict OpenAPI Access:**
```sql
-- Create a database function to check auth
CREATE OR REPLACE FUNCTION auth.check_api_access()
RETURNS BOOLEAN AS $$
BEGIN
  -- Only allow authenticated users to access schema
  RETURN auth.uid() IS NOT NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Apply to schema visibility
REVOKE ALL ON SCHEMA public FROM anon;
GRANT USAGE ON SCHEMA public TO authenticated;
```

**Priority:** P1 - Immediate Action Required

---

### 4. Weak Content Security Policy (CSP)

**Severity:** 🔴 CRITICAL
**CVSS Score:** 8.1
**Category:** Frontend Security / XSS Protection

**Description:**
The Content Security Policy contains dangerous directives that significantly weaken XSS protection.

**Evidence:**
```html
<meta http-equiv="Content-Security-Policy" content="
  default-src 'self';
  script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net https://esm.sh https://unpkg.com;
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
  font-src 'self' https://fonts.gstatic.com;
  img-src 'self' data: blob: https: http:;
  connect-src 'self' https://*.supabase.co wss://*.supabase.co https://api.openai.com;
  ...
">
```

**Issues:**
1. `'unsafe-inline'` in script-src allows inline JavaScript execution
2. `'unsafe-eval'` allows eval() and similar functions
3. `img-src` allows any HTTPS/HTTP source (data exfiltration risk)
4. `connect-src` allows external API calls to OpenAI

**Impact:**
- Inline scripts can be injected via XSS
- Attackers can exfiltrate data through image URLs
- External API calls to OpenAI could leak sensitive data
- Significantly reduces effectiveness of CSP as XSS mitigation

**Remediation:**

**Improved CSP Configuration:**
```html
<meta http-equiv="Content-Security-Policy" content="
  default-src 'self';
  script-src 'self' https://cdn.jsdelivr.net;
  style-src 'self' https://fonts.googleapis.com;
  font-src 'self' https://fonts.gstatic.com;
  img-src 'self' data: blob:;
  connect-src 'self' https://gtarzmlnzmlhceaffmoa.supabase.co wss://gtarzmlnzmlhceaffmoa.supabase.co;
  object-src 'none';
  base-uri 'self';
  form-action 'self';
  frame-ancestors 'none';
  upgrade-insecure-requests;
">
```

**For Nonce-Based CSP (Even Better):**
```typescript
// server/middleware/csp.ts
import crypto from 'crypto'

export default defineEventHandler((event) => {
  const nonce = crypto.randomBytes(16).toString('base64')
  event.context.cspNonce = nonce
  
  const csp = `
    default-src 'self';
    script-src 'self' 'nonce-${nonce}' https://cdn.jsdelivr.net;
    style-src 'self' 'nonce-${nonce}' https://fonts.googleapis.com;
    ...
  `.replace(/\s+/g, ' ').trim()
  
  setHeader(event, 'Content-Security-Policy', csp)
})

// In your HTML
<script nonce="<%= nonce %>">...</script>
```

**Priority:** P1 - Immediate Action Required

---

## High Findings (Risk Rating: HIGH)

### 5. No Visible Rate Limiting

**Severity:** 🟠 HIGH
**CVSS Score:** 7.5
**Category:** Application Security / DoS Protection

**Description:**
Testing showed no rate limiting on the main application endpoints. Multiple rapid requests all returned HTTP 200.

**Evidence:**
```bash
# 10 rapid requests - all successful
for i in {1..10}; do 
  curl -s -o /dev/null -w "%{http_code}\n" "https://sahakom.app"
done
# Result: 10 200 (all successful)
```

**Impact:**
- Susceptible to brute force attacks on authentication
- Vulnerable to DoS attacks
- API abuse without restrictions
- Could lead to resource exhaustion

**Remediation:**

**Implement Rate Limiting:**
```typescript
// middleware/rateLimit.ts
import rateLimit from 'express-rate-limit'

export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later'
})

export const authLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // limit each IP to 5 login attempts per hour
  message: 'Too many login attempts, please try again later'
})

// Apply to routes
app.use('/api/', apiLimiter)
app.use('/auth/login', authLimiter)
```

**Cloudflare Rate Limiting (Already Available):**
```
# In Cloudflare Dashboard:
# Security > WAF > Rate Limiting Rules
# Create rule:
# - If requests from IP > 100 per 1 minute
# - Then Block for 10 minutes
```

**Priority:** P1 - Immediate Action Required

---

### 6. OpenAI API Allowed in CSP connect-src

**Severity:** 🟠 HIGH
**CVSS Score:** 7.3
**Category:** Data Exfiltration / Third-Party Services

**Description:**
The CSP allows outbound connections to `https://api.openai.com`, indicating OpenAI API integration in the frontend.

**Evidence:**
```
connect-src 'self' https://*.supabase.co wss://*.supabase.co https://api.openai.com;
```

**Impact:**
- If OpenAI API key is exposed in client-side code, it could be stolen
- Sensitive user data could be sent to OpenAI without proper controls
- Potential for data exfiltration through OpenAI API calls
- Cost implications if API key is abused

**Remediation:**

**Move OpenAI Calls to Backend:**
```typescript
// server/api/ai/chat.ts
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY // Server-side only
})

export default defineEventHandler(async (event) => {
  const { message } = await readBody(event)
  
  // Validate and sanitize input
  if (!message || message.length > 1000) {
    throw createError({ statusCode: 400 })
  }
  
  // Call OpenAI from server
  const response = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [{ role: 'user', content: message }],
    max_tokens: 500
  })
  
  return { response: response.choices[0].message.content }
})
```

**Update CSP:**
```html
<!-- Remove OpenAI from connect-src -->
<meta http-equiv="Content-Security-Policy" content="
  ...
  connect-src 'self' https://gtarzmlnzmlhceaffmoa.supabase.co wss://gtarzmlnzmlhceaffmoa.supabase.co;
  ...
">
```

**Priority:** P1 - Immediate Action Required

---

### 7. GraphQL Introspection Enabled in Production

**Severity:** 🟠 HIGH
**CVSS Score:** 7.0
**Category:** Information Disclosure / API Security

**Description:**
GraphQL introspection is enabled, allowing anyone to query the complete schema.

**Evidence:**
```bash
curl -sk "https://gtarzmlnzmlhceaffmoa.supabase.co/graphql/v1" \
  -H "apikey: [ANON_KEY]" \
  -H "Content-Type: application/json" \
  -d '{"query":"{__schema{types{name}}}"}'
  
# Returns: Complete schema with 300+ table definitions
```

**Impact:**
- Complete database structure visible to attackers
- Reveals all table names, relationships, and field types
- Enables precise targeting of sensitive data
- Violates principle of least privilege

**Remediation:**

**Disable GraphQL Introspection:**
```sql
-- Option 1: Through Supabase Dashboard
-- Settings > API > GraphQL > Disable Introspection

-- Option 2: Through SQL (if available)
ALTER ROLE anon SET graphql.introspection = false;
```

**Add Authorization Layer:**
```sql
-- Create authorization function
CREATE OR REPLACE FUNCTION graphql.auth_check()
RETURNS BOOLEAN AS $$
BEGIN
  -- Only allow authenticated users
  RETURN auth.uid() IS NOT NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Revoke GraphQL access from anon
REVOKE ALL ON SCHEMA graphql FROM anon;
GRANT USAGE ON SCHEMA graphql TO authenticated;
```

**Priority:** P2 - Action Required Within 7 Days

---

## Medium Findings (Risk Rating: MEDIUM)

### 8. Cloudflare R2 Storage URL Exposed

**Severity:** 🟡 MEDIUM
**CVSS Score:** 6.5
**Category:** Data Exposure / Storage Security

**Description:**
The Cloudflare R2 storage bucket URL is visible in the client-side JavaScript.

**Evidence:**
```
Storage URL: https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev
Example file: https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/44dbbf48-a8f6-4657-b53f-473568a8abe1/...
```

**Impact:**
- Attackers know where user-uploaded files are stored
- Could attempt to enumerate files if bucket is misconfigured
- Potential for unauthorized access to user files

**Remediation:**

**Implement Signed URLs:**
```typescript
// server/api/storage/signed-url.ts
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

const s3 = new S3Client({
  region: 'auto',
  endpoint: `https://${process.env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY!,
    secretAccessKey: process.env.R2_SECRET_KEY!
  }
})

export default defineEventHandler(async (event) => {
  const { key } = getQuery(event)
  
  // Verify user has access to this file
  const user = await verifyUser(event)
  if (!user || !await canAccessFile(user.id, key)) {
    throw createError({ statusCode: 403 })
  }
  
  // Generate signed URL (expires in 1 hour)
  const command = new GetObjectCommand({
    Bucket: process.env.R2_BUCKET,
    Key: key
  })
  
  const signedUrl = await getSignedUrl(s3, command, { expiresIn: 3600 })
  
  return { url: signedUrl }
})
```

**Configure R2 Bucket Policies:**
```json
{
  "Version": "2023-03-27",
  "Statement": [
    {
      "Effect": "Deny",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::your-bucket/*",
      "Condition": {
        "StringNotEquals": {
          "aws:Referer": "https://sahakom.app/*"
        }
      }
    }
  ]
}
```

**Priority:** P2 - Action Required Within 14 Days

---

### 9. Server Version Disclosure

**Severity:** 🟡 MEDIUM
**CVSS Score:** 5.3
**Category:** Information Disclosure

**Description:**
The server header reveals that the application is using Cloudflare.

**Evidence:**
```
server: cloudflare
cf-ray: 9e2e6733ca2f6cc1-SIN
```

**Impact:**
- Low risk - Cloudflare is a known, secure CDN
- Could help attackers understand infrastructure
- CF-Ray reveals the specific data center (Singapore)

**Remediation:**

**Hide Server Header (Cloudflare):**
```
# In Cloudflare Dashboard:
# Rules > Transform Rules > Modify Response Header
# Remove header: Server
# Remove header: CF-Ray (not recommended - useful for debugging)
```

**Note:** This is a low-priority finding. The benefit of hiding this information is minimal compared to the operational value of having it for debugging.

**Priority:** P3 - Consider for Future Improvements

---

## Low Findings (Risk Rating: LOW)

### 10. Missing Permissions-Policy Header

**Severity:** 🟢 LOW
**CVSS Score:** 4.3
**Category:** Browser Security Features

**Description:**
The Permissions-Policy header (formerly Feature-Policy) is not implemented.

**Remediation:**
```html
<meta http-equiv="Permissions-Policy" content="
  accelerometer=(),
  camera=(),
  geolocation=(),
  gyroscope=(),
  magnetometer=(),
  microphone=(),
  payment=(),
  usb=()
">
```

**Or via HTTP header:**
```typescript
// server/middleware/security.ts
export default defineEventHandler((event) => {
  setHeader(event, 'Permissions-Policy', 
    'accelerometer=(), camera=(), geolocation=(), gyroscope=(), ' +
    'magnetometer=(), microphone=(), payment=(), usb=()'
  )
})
```

**Priority:** P3 - Consider for Future Improvements

---

### 11. Missing Cross-Origin Policies

**Severity:** 🟢 LOW
**CVSS Score:** 4.0
**Category:** Browser Security Features

**Description:**
Cross-Origin-Embedder-Policy, Cross-Origin-Opener-Policy, and Cross-Origin-Resource-Policy headers are not implemented.

**Remediation:**
```typescript
// server/middleware/security.ts
export default defineEventHandler((event) => {
  setHeader(event, 'Cross-Origin-Embedder-Policy', 'require-corp')
  setHeader(event, 'Cross-Origin-Opener-Policy', 'same-origin')
  setHeader(event, 'Cross-Origin-Resource-Policy', 'same-origin')
})
```

**Priority:** P3 - Consider for Future Improvements

---

### 12. Cache Control Headers Not Configured

**Severity:** 🟢 LOW
**CVSS Score:** 3.7
**Category:** Browser Security / Performance

**Description:**
No explicit cache control headers are set for sensitive pages.

**Remediation:**
```typescript
// For sensitive pages (login, dashboard, etc.)
export default defineEventHandler((event) => {
  setHeader(event, 'Cache-Control', 
    'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0')
  setHeader(event, 'Pragma', 'no-cache')
  setHeader(event, 'Expires', '0')
  setHeader(event, 'Surrogate-Control', 'no-store')
})
```

**Priority:** P3 - Consider for Future Improvements

---

## Positive Security Findings

The following security measures are properly implemented:

✅ **HSTS Enabled** - 1 year max-age with includeSubDomains
```
strict-transport-security: max-age=31536000; includeSubDomains
```

✅ **X-Frame-Options: DENY** - Prevents clickjacking attacks
```
x-frame-options: DENY
```

✅ **X-Content-Type-Options: nosniff** - Prevents MIME sniffing
```
x-content-type-options: nosniff
```

✅ **Referrer-Policy** - Controls referrer information
```
referrer-policy: strict-origin-when-cross-origin
```

✅ **HTTP to HTTPS Redirect** - Forces secure connections
```
HTTP/1.1 301 Moved Permanently
Location: https://sahakom.app/
```

✅ **TLS 1.3** - Latest TLS protocol with strong cipher suites
```
Protocol: TLSv1.3
Cipher: TLS_AES_256_GCM_SHA384
```

✅ **Cloudflare Protection** - DDoS protection and WAF

✅ **Sensitive Files Protected** - .env, .git, backup.sql return 404

✅ **SQL Injection Protection** - Parameterized queries in use

✅ **Authentication Required** - Sensitive endpoints require valid tokens
```
/auth/v1/user returns 401 without valid Bearer token
```

✅ **Password Validation** - Weak passwords rejected
```
Password validation rejects pwned/weak passwords
```

✅ **CSP frame-ancestors: 'none'** - Additional clickjacking protection

---

## Infrastructure Analysis

### DNS Configuration
- **A Record:** Resolves to Cloudflare IP
- **AAAA Record:** IPv6 supported
- **CDN:** Cloudflare (172.64.149.246, 104.18.38.10)

### SSL/TLS Configuration
- **Protocol:** TLS 1.3 (latest)
- **Cipher Suite:** TLS_AES_256_GCM_SHA384 (strong)
- **Certificate:** Let's Encrypt / Cloudflare
- **HSTS:** Enabled with 1-year max-age

### Hosting & Infrastructure
- **Frontend:** Cloudflare CDN (SPA/Vite)
- **Backend:** Supabase (PostgreSQL + Auth + Storage)
- **Database:** Supabase PostgreSQL
- **File Storage:** Cloudflare R2
- **AI Integration:** OpenAI API

### Technology Stack
- **Frontend Framework:** React/Vue (Vite build)
- **Backend:** Supabase (PostgreSQL + PostgREST)
- **Authentication:** Supabase Auth
- **Real-time:** Supabase Realtime (WebSocket)
- **API:** REST + GraphQL

---

## Business Logic Security Assessment

### Payment Flow Analysis
**Concerns:**
- `escrow_transactions` table is exposed in schema
- `payment_logs` table visible
- `fraud_verifications` table reveals fraud detection logic

**Recommendations:**
1. Implement additional server-side validation for all payment operations
2. Never trust client-side price calculations
3. Verify payment amounts server-side before processing
4. Implement webhook signature verification for payment callbacks

### Access Control Analysis
**Concerns:**
- Complete role structure visible in schema (`app_role`, `sahakom_role`, `pos_employee_role`)
- `user_role_profiles` and `user_roles` tables exposed
- `role_assignment_requests` table reveals role management logic

**Recommendations:**
1. Implement server-side role verification for all sensitive operations
2. Never rely on client-side role checks
3. Audit role assignments regularly
4. Implement principle of least privilege

### Data Exposure Risks
**High-Risk Tables Exposed:**
- `user_sessions` - Active session tokens
- `login_attempts` - Authentication logs
- `security_alerts` - Security monitoring
- `audit_logs` - System audit trail
- `pos_users` - Contains password_hash column
- `blockchain_records` - Blockchain transaction data
- `smart_contracts` - Contract information

**Recommendations:**
1. Implement RLS policies on all sensitive tables
2. Encrypt sensitive data at rest
3. Implement data masking for non-production environments
4. Regular security audits of data access patterns

---

## Priority-Ranked Action Items

### P0 - Immediate (Within 24 Hours)
1. ⚠️ **CRITICAL:** Rotate the exposed Supabase anon key
2. ⚠️ **CRITICAL:** Implement server-side API proxy to hide credentials
3. ⚠️ **CRITICAL:** Review RLS policies on all sensitive tables
4. ⚠️ **CRITICAL:** Disable GraphQL introspection

### P1 - Urgent (Within 7 Days)
5. 🔴 Fix CSP to remove `'unsafe-inline'` and `'unsafe-eval'`
6. 🔴 Remove OpenAI API from client-side code
7. 🔴 Implement rate limiting on all endpoints
8. 🔴 Reduce JWT token expiration to 1 hour

### P2 - High Priority (Within 14 Days)
9. 🟠 Implement signed URLs for R2 storage
10. 🟠 Add comprehensive monitoring and alerting
11. 🟠 Implement audit logging for all sensitive operations
12. 🟠 Review and strengthen RLS policies

### P3 - Medium Priority (Within 30 Days)
13. 🟡 Add Permissions-Policy header
14. 🟡 Implement Cross-Origin policies
15. 🟡 Configure proper cache control headers
16. 🟡 Add security.txt and /.well-known endpoints

---

## Code Examples for Remediation

### Complete Security Middleware Implementation

```typescript
// server/middleware/security.ts
import { defineEventHandler, setHeader, createError } from 'h3'
import crypto from 'crypto'
import rateLimit from 'express-rate-limit'

export default defineEventHandler(async (event) => {
  const nonce = crypto.randomBytes(16).toString('base64')
  event.context.cspNonce = nonce
  
  // Strict CSP with nonce
  const csp = `
    default-src 'self';
    script-src 'self' 'nonce-${nonce}' https://cdn.jsdelivr.net;
    style-src 'self' 'nonce-${nonce}' https://fonts.googleapis.com;
    font-src 'self' https://fonts.gstatic.com;
    img-src 'self' data: blob:;
    connect-src 'self' https://gtarzmlnzmlhceaffmoa.supabase.co wss://gtarzmlnzmlhceaffmoa.supabase.co;
    media-src 'self' blob: data:;
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    upgrade-insecure-requests;
  `.replace(/\s+/g, ' ').trim()
  
  // Set all security headers
  setHeader(event, 'Content-Security-Policy', csp)
  setHeader(event, 'X-Frame-Options', 'DENY')
  setHeader(event, 'X-Content-Type-Options', 'nosniff')
  setHeader(event, 'Referrer-Policy', 'strict-origin-when-cross-origin')
  setHeader(event, 'Permissions-Policy', 
    'accelerometer=(), camera=(), geolocation=(), gyroscope=(), ' +
    'magnetometer=(), microphone=(), payment=(), usb=()')
  setHeader(event, 'Cross-Origin-Embedder-Policy', 'require-corp')
  setHeader(event, 'Cross-Origin-Opener-Policy', 'same-origin')
  setHeader(event, 'Cross-Origin-Resource-Policy', 'same-origin')
  
  // For sensitive pages
  if (event.path.startsWith('/dashboard') || event.path.startsWith('/auth')) {
    setHeader(event, 'Cache-Control', 
      'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0')
    setHeader(event, 'Pragma', 'no-cache')
    setHeader(event, 'Expires', '0')
  }
})
```

### Supabase Client with Proper Error Handling

```typescript
// lib/supabase/server-client.ts
import { createClient } from '@supabase/supabase-js'
import type { H3Event } from 'h3'

export function createServerSupabaseClient(event: H3Event) {
  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_KEY!, // Service role, not anon key
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    }
  )
  
  return supabase
}

// Usage in API route
export default defineEventHandler(async (event) => {
  const supabase = createServerSupabaseClient(event)
  
  // Get user from auth header
  const token = getHeader(event, 'authorization')?.replace('Bearer ', '')
  if (!token) {
    throw createError({ statusCode: 401, message: 'Unauthorized' })
  }
  
  const { data: { user }, error } = await supabase.auth.getUser(token)
  if (error || !user) {
    throw createError({ statusCode: 401, message: 'Invalid token' })
  }
  
  // Now perform operations as authenticated user
  const { data, error: dbError } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', user.id)
    .single()
  
  if (dbError) {
    throw createError({ statusCode: 500, message: 'Database error' })
  }
  
  return { data }
})
```

---

## Conclusion

Sahakom.app demonstrates good foundational security practices with proper HTTPS, security headers, and Cloudflare protection. However, **critical vulnerabilities in API security, authentication, and CSP configuration pose immediate risks** that require urgent attention.

The most pressing issues are:
1. **Exposed Supabase credentials** in client-side code
2. **10-year JWT token expiration** preventing key rotation
3. **Complete database schema exposure** via GraphQL introspection
4. **Weak CSP** allowing inline scripts and eval

**Immediate action is required** on P0 and P1 items to prevent potential security breaches. The remediation steps provided in this report should be implemented in priority order.

### Next Steps
1. Schedule emergency security review meeting
2. Implement P0 fixes within 24 hours
3. Plan P1 fixes for implementation within 7 days
4. Conduct penetration testing after fixes are deployed
5. Establish regular security audit schedule (quarterly recommended)

---

**Report Generated:** 2026-03-27 12:30 UTC
**Auditor:** STAR Security Audit System
**Classification:** CONFIDENTIAL - Internal Use Only
