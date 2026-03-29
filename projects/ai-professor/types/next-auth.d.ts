import { DefaultSession, DefaultUser } from 'next-auth'
import { JWT, DefaultJWT } from 'next-auth/jwt'

declare module 'next-auth' {
  interface Session {
    user: {
      /** The user's id. */
      id: string
      /** The user's subscription tier. */
      subscription_tier: string
    } & DefaultSession['user']
    /** The access token from Supabase. */
    accessToken?: string
    /** Error if token refresh failed. */
    error?: string
  }

  interface User extends DefaultUser {
    id: string
    subscription_tier: string
  }
}

declare module 'next-auth/jwt' {
  interface JWT extends DefaultJWT {
    id: string
    subscription_tier: string
    accessToken?: string
    refreshToken?: string
    expiresAt?: number
    error?: string
  }
}
