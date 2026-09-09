import React, { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'

const AdminAuthContext = createContext(null)

export function AdminAuthProvider({ children }) {
  const [session, setSession] = useState(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [hasMfa, setHasMfa] = useState(false)
  const [loading, setLoading] = useState(true)

  async function refresh() {
    setLoading(true)
    const { data: { session } } = await supabase.auth.getSession()
    setSession(session)

    if (session) {
      // aal2 means the user has completed a second factor this session
      const { data: aal } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel()
      setHasMfa(aal?.currentLevel === 'aal2')

      const { data: adminRow } = await supabase
        .from('admins')
        .select('id')
        .eq('user_id', session.user.id)
        .maybeSingle()
      setIsAdmin(!!adminRow)
    } else {
      setIsAdmin(false)
      setHasMfa(false)
    }
    setLoading(false)
  }

  useEffect(() => {
    refresh()
    const { data: sub } = supabase.auth.onAuthStateChange(() => refresh())
    return () => sub.subscription.unsubscribe()
  }, [])

  async function signOut() {
    await supabase.auth.signOut()
    await refresh()
  }

  return (
    <AdminAuthContext.Provider
      value={{ session, isAdmin, hasMfa, loading, refresh, signOut }}
    >
      {children}
    </AdminAuthContext.Provider>
  )
}

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext)
  if (!ctx) throw new Error('useAdminAuth must be used within AdminAuthProvider')
  return ctx
}
