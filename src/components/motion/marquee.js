import React, { useRef } from 'react'
import { useInView } from 'motion/react'

/**
 * Infinite horizontal ticker. Content is duplicated so the loop is seamless;
 * the copy is inert so links aren't announced or focused twice.
 */
const Marquee = ({ children, duration = 40, gap = '3rem', reverse = false, className = '' }) => {
  const ref = useRef(null)
  const inView = useInView(ref, { amount: 0.1 })

  return (
    <div
      ref={ref}
      className={`marquee ${inView ? 'marquee--active' : ''} ${reverse ? 'marquee--reverse' : ''} ${className}`}
      style={{
        '--marquee-duration': `${duration}s`,
        '--marquee-gap': gap,
        contain: 'layout paint',
      }}
    >
      <div className="marquee__track">{children}</div>
      <div className="marquee__track" aria-hidden="true" {...{ inert: '' }}>{children}</div>
    </div>
  )
}

export default Marquee