import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { User, Session } from '@supabase/supabase-js'
import { supabase } from '../components/lib/supabase'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const session = ref<Session | null>(null)
  const loading = ref(true)

  const isAuthenticated = computed(() => !!user.value)

  const initialize = async () => {
    loading.value = true
    try {
      const { data: { session: currentSession } } = await supabase.auth.getSession()
      session.value = currentSession
      user.value = currentSession?.user ?? null

      supabase.auth.onAuthStateChange((_event, newSession) => {
        session.value = newSession
        user.value = newSession?.user ?? null
      })
    } catch (error) {
      console.error('Auth initialization error:', error)
    } finally {
      loading.value = false
    }
  }

  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          }
        }
      })
      
      if (error) {
        return { data: null, error: error.message }
      }
      
      return { data, error: null }
    } catch (error) {
      return { data: null, error: 'An unexpected error occurred' }
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })
      
      if (error) {
        return { data: null, error: error.message }
      }
      
      return { data, error: null }
    } catch (error) {
      return { data: null, error: 'An unexpected error occurred' }
    }
  }

  const signInWithGoogle = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/app`
        }
      })
      
      if (error) {
        return { data: null, error: error.message }
      }
      
      return { data, error: null }
    } catch (error) {
      return { data: null, error: 'An unexpected error occurred' }
    }
  }

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      
      if (error) {
        return { error: error.message }
      }
      
      return { error: null }
    } catch (error) {
      return { error: 'An unexpected error occurred' }
    }
  }

  const getUserDisplayName = () => {
    if (!user.value) return null
    
    return user.value.user_metadata?.full_name || 
           user.value.user_metadata?.name || 
           user.value.email?.split('@')[0] || 
           'User'
  }

  const getUserAvatarUrl = () => {
    if (!user.value) return null
    
    return user.value.user_metadata?.avatar_url || 
           user.value.user_metadata?.picture || 
           null
  }

  return {
    user,
    session,
    loading,
    isAuthenticated,
    initialize,
    signUp,
    signIn,
    signInWithGoogle,
    signOut,
    getUserDisplayName,
    getUserAvatarUrl
  }
})