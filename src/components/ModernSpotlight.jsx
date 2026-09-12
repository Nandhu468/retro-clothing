import React from 'react'

/**
 * Headline component for RETRO CLOTHING
 * Features smooth, luminous neon flicker typography with perfect mobile responsiveness
 * so "RETRO CLOTHING" and the letter "G" are always fully visible on all mobile screens.
 */
export default function ModernSpotlight({ className = '' }) {
  return (
    <div className={`relative flex flex-col items-start select-none max-w-full overflow-visible ${className}`}>
      <h1
        className="hero-flicker-wordmark font-display font-extrabold tracking-tight leading-[0.92] select-none text-[clamp(2.15rem,10vw,4.25rem)] sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl mb-3 sm:mb-6 max-w-full break-normal"
        aria-label="Retro Clothing"
      >
        RETRO<br />CLOTHING
      </h1>
    </div>
  )
}
