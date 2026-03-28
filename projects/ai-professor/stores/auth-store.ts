import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { User } from '@/types/database'

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  
  // Actions
  setUser: (user: User | null) => void
  setLoading: (loading: boolean) => void
  logout: () => void
  
  // Auth methods
  signup: (data: { name: string; email: string; password: string }) => Promise<void>
  login: (email: string, password: string) => Promise<void>
  checkAuth: () => Promise<void>
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      
      setUser: (user) => set({ 
        user, 
        isAuthenticated: !!user,
        isLoading: false 
      }),
      
      setLoading: (isLoading) => set({ isLoading }),
      
      logout: async () => {
        try {
          await fetch('/api/auth/signout', { method: 'POST' })
        } catch (e) {
          // Ignore
        }
        set({ 
          user: null, 
          isAuthenticated: false,
          isLoading: false 
        })
      },
      
      signup: async (data: { name: string; email: string; password: string }) => {
        set({ isLoading: true })
        
        try {
          const response = await fetch('/api/auth/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
          })
          
          if (!response.ok) {
            const error = await response.json().catch(() => ({ error: 'Signup failed' }))
            throw new Error(error.error || 'Signup failed')
          }
          
          const result = await response.json()
          
          set({ 
            user: result.user,
            isAuthenticated: true,
            isLoading: false 
          })
        } catch (error) {
          set({ isLoading: false })
          throw error
        }
      },
      
      login: async (email: string, password: string) => {
        set({ isLoading: true })
        
        try {
          const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
          })
          
          if (!response.ok) {
            const error = await response.json().catch(() => ({ error: 'Login failed' }))
            throw new Error(error.error || 'Login failed')
          }
          
          const result = await response.json()
          
          set({ 
            user: result.user,
            isAuthenticated: true,
            isLoading: false 
          })
        } catch (error) {
          set({ isLoading: false })
          throw error
        }
      },
      
      checkAuth: async () => {
        try {
          const response = await fetch('/api/auth/session')
          
          if (response.ok) {
            const result = await response.json()
            set({ 
              user: result.user || null,
              isAuthenticated: !!result.user,
              isLoading: false 
            })
          } else {
            set({ 
              user: null,
              isAuthenticated: false,
              isLoading: false 
            })
          }
        } catch (error) {
          set({ 
            user: null,
            isAuthenticated: false,
            isLoading: false 
          })
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ 
        user: state.user,
        isAuthenticated: state.isAuthenticated 
      }),
    }
  )
)
