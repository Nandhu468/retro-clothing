import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabaseClient'
import { useAdminAuth } from '../../context/AdminAuthContext'

export default function AdminLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [step, setStep] = useState('credentials') // 'credentials' | 'totp'
  const [factorId, setFactorId] = useState(null)
  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { refresh } = useAdminAuth()

  async function handleCredentials(e) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const { data, error: signInError } = await supabase.auth.signInWithPassword({ email, password })
    if (signInError) {
      setError('Invalid email or password.')
      setLoading(false)
      return
    }

    // Confirm this user is an authorized admin before proceeding to MFA
    const { data: adminRow } = await supabase
      .from('admins')
      .select('id')
      .eq('user_id', data.user.id)
      .maybeSingle()

    if (!adminRow) {
      await supabase.auth.signOut()
      setError('This account is not an authorized administrator.')
      setLoading(false)
      return
    }

    const { data: factorsData } = await supabase.auth.mfa.listFactors()
    const totp = factorsData?.totp?.find((f) => f.status === 'verified')

    if (!totp) {
      // No MFA enrolled yet — route to mandatory setup
      await refresh()
      navigate('/admin/mfa-setup')
      return
    }

    const { data: challenge, error: challengeError } = await supabase.auth.mfa.challenge({ factorId: totp.id })
    if (challengeError) {
      setError('Could not start MFA challenge. Please try again.')
      setLoading(false)
      return
    }

    setFactorId(totp.id)
    setStep('totp')
    // store challenge id on window for the verify step (kept simple/local)
    window.__retro_challenge_id = challenge.id
    setLoading(false)
  }

  async function handleVerifyTotp(e) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const { error: verifyError } = await supabase.auth.mfa.verify({
      factorId,
      challengeId: window.__retro_challenge_id,
      code,
    })

    if (verifyError) {
      setError('Incorrect code. Please try again.')
      setLoading(false)
      return
    }

    await refresh()
    navigate('/admin')
  }

  return (
    <div className="min-h-screen bg-ink flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center mb-10">
          <img src="/logo.jpg" alt="Retro Clothing" className="h-14 w-14 rounded-full object-cover mb-3" />
          <p className="text-mist font-display text-2xl tracking-widest2">RETRO ADMIN</p>
        </div>

        {step === 'credentials' ? (
          <form onSubmit={handleCredentials} className="space-y-4">
            <div>
              <label className="text-xs tracking-widest2 text-silver block mb-2">EMAIL</label>
              <input
                type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-charcoal border border-graphite text-mist px-4 py-3 text-sm focus-ring"
              />
            </div>
            <div>
              <label className="text-xs tracking-widest2 text-silver block mb-2">PASSWORD</label>
              <input
                type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-charcoal border border-graphite text-mist px-4 py-3 text-sm focus-ring"
              />
            </div>
            {error && <p className="text-red-400 text-xs">{error}</p>}
            <button
              type="submit" disabled={loading}
              className="w-full bg-mist text-ink py-3 text-xs tracking-widest2 hover:bg-silver transition-colors disabled:opacity-50"
            >
              {loading ? 'SIGNING IN…' : 'SIGN IN'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyTotp} className="space-y-4">
            <p className="text-silver text-xs leading-relaxed">
              Enter the 6-digit code from your authenticator app.
            </p>
            <input
              type="text" inputMode="numeric" pattern="[0-9]*" maxLength={6}
              required value={code} onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
              className="w-full bg-charcoal border border-graphite text-mist px-4 py-3 text-center text-2xl tracking-[0.5em] focus-ring"
              placeholder="000000"
            />
            {error && <p className="text-red-400 text-xs">{error}</p>}
            <button
              type="submit" disabled={loading || code.length !== 6}
              className="w-full bg-mist text-ink py-3 text-xs tracking-widest2 hover:bg-silver transition-colors disabled:opacity-50"
            >
              {loading ? 'VERIFYING…' : 'VERIFY & SIGN IN'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
