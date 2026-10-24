import React from 'react'

/**
 * Circular text badge that slowly spins (CSS, so it pauses for reduced motion).
 * The <svg> is marked aria-hidden and its <defs> is invisible by default.
 */
const RotatingBadge = ({ text = 'PORTFOLIO • PORTFOLIO • ', className = '', children }) => {
  const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
  return (
    <div className={`relative ${className}`}>
      <svg
        viewBox="0 0 200 200"
        className="w-full h-full animate-spin-slow"
        aria-hidden="true"
        focusable="false"
        style={{ display: 'block' }}
      >
        <defs>
          <path
            id={`badge-${id}`}
            d="M100,100 m-78,0 a78,78 0 1,1 156,0 a78,78 0 1,1 -156,0"
            fill="none"
          />
        </defs>
        <text
          className="fill-current"
          style={{
            fontFamily: 'var(--font-sans)',
            fontSize: 14,
            fontWeight: 500,
            letterSpacing: 3.5,
          }}
        >
          <textPath href={`#badge-${id}`} startOffset="0">
            {text}
          </textPath>
        </text>
      </svg>
      {children && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          {children}
        </div>
      )}
    </div>
  )
}

export default RotatingBadge