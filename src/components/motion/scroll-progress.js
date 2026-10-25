import React from 'react'

/**
 * Progress bar driven entirely by CSS `animation-timeline: scroll()`.
 * Zero JS per frame. Falls back to hidden on unsupported browsers.
 */
const ScrollProgress = () => (
  <div
    aria-hidden="true"
    className="scroll-progress fixed top-0 left-0 right-0 h-[3px] bg-accent origin-left z-[60]"
  />
)

export default ScrollProgress
