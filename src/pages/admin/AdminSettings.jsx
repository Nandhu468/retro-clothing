import { useState } from 'react'
import { supabase } from '../../lib/supabaseClient'
import { useAdminAuth } from '../../context/AdminAuthContext'

export default function AdminSettings() {
  const { session, refresh } = useAdminAuth()
  const [confirmDisable, setConfirmDisable] = useState(false)
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState('')

  async function handleDisableMfa() {
    setBusy(true)
    const { data } = await supabase.auth.mfa.listFactors()
    const totp = data?.totp?.[0]
    if (totp) {
      await supabase.auth.mfa.unenroll({ factorId: totp.id })
    }
    await refresh()
    setBusy(false)
    setConfirmDisable(false)
    setMessage('MFA disabled. You will be asked to set it up again on next login.')
  }

  return (
    <div className="max-w-lg">
      <h1 className="font-display text-3xl tracking-wide mb-6">SETTINGS</h1>

      <div className="border border-bone bg-white p-5 mb-6">
        <h2 className="text-xs tracking-widest2 text-graphite mb-2">ACCOUNT</h2>
        <p className="text-sm">{session?.user?.email}</p>
      </div>

      <div className="border border-bone bg-white p-5">
        <h2 className="text-xs tracking-widest2 text-graphite mb-2">TWO-FACTOR AUTHENTICATION</h2>
        <p className="text-sm text-graphite mb-4">
          Two-factor authentication is currently required to access the admin dashboard.
          We strongly recommend keeping it enabled — disabling it reduces the security of your
          store's product data and customer-facing catalog.
        </p>

        {!confirmDisable ? (
          <button
            onClick={() => setConfirmDisable(true)}
            className="text-xs tracking-widest2 border border-red-600 text-red-600 px-4 py-2"
          >
            DISABLE MFA
          </button>
        ) : (
          <div className="border border-red-200 bg-red-50 p-4">
            <p className="text-sm text-red-700 mb-3">
              Are you sure? Disabling MFA makes your admin account significantly less secure.
              You'll be required to set it up again the next time you log in.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setConfirmDisable(false)} className="text-xs tracking-widest2 border border-ink px-4 py-2">
                CANCEL
              </button>
              <button
                onClick={handleDisableMfa}
                disabled={busy}
                className="text-xs tracking-widest2 bg-red-600 text-white px-4 py-2 disabled:opacity-50"
              >
                {busy ? 'DISABLING…' : 'CONFIRM DISABLE'}
              </button>
            </div>
          </div>
        )}

        {message && <p className="text-sm text-green-700 mt-4">{message}</p>}
      </div>
    </div>
  )
}
