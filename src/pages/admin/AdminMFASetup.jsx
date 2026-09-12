import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabaseClient'
import { useAdminAuth } from '../../context/AdminAuthContext'

export default function AdminMFASetup() {
  const { session, isAdmin, hasMfa, loading: authLoading, refresh } = useAdminAuth()
  const navigate = useNavigate()

  const [factorId, setFactorId] = useState(null)
  const [qrSvg, setQrSvg] = useState(null)
  const [secret, setSecret] = useState('')
  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (authLoading) return
    if (!session) { navigate('/admin/login'); return }
    if (!isAdmin) return
    if (hasMfa) { navigate('/admin'); return }
    enroll()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authLoading, session, isAdmin, hasMfa])

  async function enroll() {
    setBusy(true)
    setError('')
    const { data, error: enrollError } = await supabase.auth.mfa.enroll({
      factorType: 'totp',
      friendlyName: `Retro Admin ${new Date().toISOString().slice(0, 10)}`,
    })
    if (enrollError) {
      setError('Could not start MFA setup. Please refresh and try again.')
      setBusy(false)
      return
    }
    setFactorId(data.id)
    setQrSvg(data.totp.qr_code)
    setSecret(data.totp.secret)
    setReady(true)
    setBusy(false)
  }

  async function handleVerify(e) {
    e.preventDefault()
    setBusy(true)
    setError('')

    const { data: challenge, error: challengeError } = await supabase.auth.mfa.challenge({ factorId })
    if (challengeError) {
      setError('Could not verify. Please try again.')
      setBusy(false)
      return
    }

    const { error: verifyError } = await supabase.auth.mfa.verify({
      factorId,
      challengeId: challenge.id,
      code,
    })

    if (verifyError) {
      setError('Incorrect code. Please check your authenticator app and try again.')
      setBusy(false)
      return
    }

    await refresh()
    navigate('/admin')
  }

  if (authLoading || !session || !isAdmin) {
    return <div className="min-h-screen bg-ink flex items-center justify-center text-silver">Loading…</div>
  }

  return (
    <div className="min-h-screen bg-ink flex items-center justify-center px-6 py-16">
      <div className="w-full max-w-sm text-center">
        <p className="text-mist font-display text-2xl tracking-widest2 mb-2">SECURE YOUR ACCOUNT</p>
        <p className="text-silver text-xs leading-relaxed mb-8">
          Retro Clothing requires two-factor authentication for every administrator.
          Scan the QR code below with an authenticator app such as Google Authenticator,
          Microsoft Authenticator, or Authy.
        </p>

        {busy && !ready ? (
          <p className="text-silver text-sm">Generating your setup code…</p>
        ) : (
          <>
            {qrSvg && (
              <div
                className="bg-mist p-4 inline-block mb-4"
                dangerouslySetInnerHTML={{ __html: qrSvg }}
              />
            )}
            {secret && (
              <p className="text-silver text-[11px] mb-6 break-all">
                Can't scan? Enter this key manually: <span className="text-mist">{secret}</span>
              </p>
            )}

            <form onSubmit={handleVerify} className="space-y-4">
              <input
                type="text" inputMode="numeric" pattern="[0-9]*" maxLength={6}
                required value={code} onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                className="w-full bg-charcoal border border-graphite text-mist px-4 py-3 text-center text-2xl tracking-[0.5em] focus-ring"
                placeholder="000000"
              />
              {error && <p className="text-red-400 text-xs">{error}</p>}
              <button
                type="submit" disabled={busy || code.length !== 6}
                className="w-full bg-mist text-ink py-3 text-xs tracking-widest2 hover:bg-silver transition-colors disabled:opacity-50"
              >
                {busy ? 'VERIFYING…' : 'ACTIVATE MFA'}
              </button>
            </form>

            <p className="text-silver/70 text-[11px] mt-6 leading-relaxed">
              Store the manual key above somewhere safe (e.g. a password manager) before
              continuing. Retro Clothing's MFA setup does not issue separate recovery codes,
              so losing access to your authenticator app means you will need another admin
              or database access to remove and re-enroll this factor.
            </p>
          </>
        )}
      </div>
    </div>
  )
}
