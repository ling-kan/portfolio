import React from 'react'
import Container from './container'
import { SplitText, useInViewOnce } from './motion/reveal'

const TONES = {
  light: 'bg-paper text-ink',
  sand: 'bg-sand text-ink',
  dark: 'bg-ink text-paper',
}

const Section = ({
  id,
  number,
  eyebrow,
  title,
  highlight = [],
  intro,
  aside,
  backdrop,
  tone = 'light',
  className = '',
  children,
}) => {
  const { ref: ruleRef, inView } = useInViewOnce()
  const dark = tone === 'dark'

  return (
    <section id={id} className={`page-section relative py-12 md:py-24 ${TONES[tone]} ${className}`}>
      {backdrop}
      <Container className="relative">
        <header className="mb-14 md:mb-20 max-w-4xl">
          <div className="mb-6 md:mb-8">
            <div
              className={`eyebrow inline-flex items-center gap-4 ${
                dark ? 'text-paper/60' : 'text-ink/75'
              }`}
            >
              {number && <span className="text-accent">{number}</span>}
              <span
                ref={ruleRef}
                aria-hidden="true"
                className={`h-px w-12 origin-left transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                  dark ? 'bg-paper/30' : 'bg-ink/25'
                } ${inView ? 'scale-x-100' : 'scale-x-0'}`}
              />
              <span>{eyebrow}</span>
            </div>
          </div>
          <div>
            {title && (
              <SplitText as="h2" text={title} highlight={highlight} className="display-lg block" />
            )}
            {intro && (
              <p className={`lead mt-6 max-w-2xl ${dark ? 'text-paper/70' : 'text-ink/75'}`}>
                {intro}
              </p>
            )}
            {aside}
          </div>
        </header>
        {children}
      </Container>
    </section>
  )
}

export default Section