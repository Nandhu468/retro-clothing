import { useEffect, useState } from 'react'

const INTRO_DURATION = 1700

export default function IntroScreen() {
  const [visible, setVisible] = useState(() => {
    if (typeof window === 'undefined') return false
    return !window.sessionStorage.getItem('retro_intro_seen')
  })
  const [leaving, setLeaving] = useState(false)

  useEffect(() => {
    if (!visible) return undefined
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    window.sessionStorage.setItem('retro_intro_seen', 'true')
    if (reducedMotion) {
      setVisible(false)
      return undefined
    }
    const leaveTimer = window.setTimeout(() => setLeaving(true), INTRO_DURATION)
    const removeTimer = window.setTimeout(() => setVisible(false), INTRO_DURATION + 460)
    return () => {
      window.clearTimeout(leaveTimer)
      window.clearTimeout(removeTimer)
    }
  }, [visible])

  if (!visible) return null

  return (
    <div className={`brand-intro ${leaving ? 'brand-intro-leaving' : ''}`} aria-hidden="true">
      <div className="brand-intro-content">
        <img src="/logo.jpg" alt="" className="brand-intro-logo" />
        <div className="brand-intro-line"><span /></div>
      </div>
    </div>
  )
}

