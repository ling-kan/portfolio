import React, { useEffect, useRef, useState } from 'react'
import useSafeReducedMotion from './motion/use-safe-reduced-motion'
import { GatsbyImage } from 'gatsby-plugin-image'
import { useAnimate, useInView } from 'motion/react'
import { ArrowDownRightIcon, ArrowRightIcon } from '@heroicons/react/24/solid'
import Container from './container'
import Marquee from './motion/marquee'
import Magnetic from './motion/magnetic'
import RotatingBadge from './motion/rotating-badge'
import { EASE } from './motion/reveal'
import Socials from './socials'

const RoleTicker = ({ roles = [], ready = true }) => {
  const reduce = useSafeReducedMotion()
  const [index, setIndex] = useState(0)
  const [scope, animateRole] = useAnimate()

  useEffect(() => {
    if (!ready || reduce || roles.length < 2) return undefined
    const id = setInterval(() => setIndex((i) => (i + 1) % roles.length), 2800)
    return () => clearInterval(id)
  }, [ready, reduce, roles.length])

  useEffect(() => {
    if (!scope.current || !ready || reduce) return
    animateRole(
      scope.current,
      { y: ['100%', '0%'], opacity: [0, 1] },
      { duration: 0.7, ease: EASE },
    )
  }, [index, ready, reduce, animateRole, scope])

  if (!roles.length) return null
  if (reduce) return <span>{roles.join(' · ')}</span>

  return (
    <span className="relative block overflow-hidden h-[1.2em]">
      <span
        key={index}
        ref={scope}
        className="block whitespace-nowrap leading-[1.2]"
        style={{ transform: 'translate3d(0, 100%, 0)', opacity: 0 }}
      >
        {roles[index]}
      </span>
    </span>
  )
}

/**
 * Letters: one animate() call on the container's children.
 */
const Letters = ({ word, delay = 0, className = '', ready = true }) => {
  const reduce = useSafeReducedMotion()
  const [mounted, setMounted] = useState(false)
  const [scope, animateLetters] = useAnimate()
  const display = className.includes('inline') ? '' : 'block'

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted || reduce || !ready || !scope.current) return
    const els = scope.current.querySelectorAll('.hero-letter')
    if (!els.length) return
    animateLetters(
      els,
      { y: ['105%', '0%'] },
      { duration: 0.8, ease: EASE, delay: (i) => delay + i * 0.01 },
    )
  }, [mounted, reduce, ready, animateLetters, scope, delay])

  if (!mounted || reduce) {
    return <span className={`${display} ${className}`}>{word}</span>
  }

  return (
    <span
      ref={scope}
      className={`${display} overflow-hidden pb-[0.08em] ${className}`}
      aria-hidden="true"
    >
      {Array.from(word).map((char, i) => (
        <span key={i} className="hero-letter inline-block" style={{ transform: 'translate3d(0, 105%, 0)' }}>
          {char === ' ' ? '\u00A0' : char}
        </span>
      ))}
    </span>
  )
}

const HomeHero = ({
  name = '',
  animatedList = [],
  image,
  tagline,
  marqueeItems = [],
  primaryCta = 'View selected work',
  secondaryCta = 'Get in touch',
  availability,
  cvUrl,
}) => {
  const reduce = useSafeReducedMotion()
  const sectionRef = useRef(null)
  const ready = useInView(sectionRef, { once: true, amount: 0.05 })

  const safeName = name || ''
  const [first, ...rest] = safeName.trim().split(' ')
  const last = rest.join(' ')
  const hasPortrait = Boolean(image?.gatsbyImageData)
  const roles = animatedList || []

  return (
    <section
      ref={sectionRef}
      id="home"
      className="relative isolate overflow-hidden min-h-[100svh] flex flex-col pt-28 md:pt-32"
    >
      <div aria-hidden="true" className="absolute inset-0 -z-10">
        <div className="absolute -top-40 -right-32 w-[44rem] h-[44rem] rounded-full bg-mint/35 blur-[140px]" />
        <div className="absolute -bottom-40 -left-40 w-[36rem] h-[36rem] rounded-full bg-accent-soft/40 blur-[140px]" />
      </div>

      <Container className="flex-1 flex items-center">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-14 lg:gap-10 items-center w-full">
          <div className={hasPortrait ? 'md:col-span-7' : 'lg:col-span-12'}>
            <h1
              className="display-xl text-ink uppercase whitespace-nowrap !tracking-[-0.035em] !text-[clamp(3.25rem,9vw,8.5rem)]"
              aria-label={name}
            >
              <Letters
                word={first || ''}
                delay={0.15}
                ready={ready}
                className="inline-block align-top"
              />
              {last && (
                <>
                  {' '}
                  <Letters
                    word={last}
                    delay={0.35}
                    ready={ready}
                    className="inline-block align-top"
                  />
                </>
              )}
            </h1>

            {roles.length > 0 && (
              <div className="mt-8 flex items-center gap-4 text-xl md:text-2xl font-sans font-medium tracking-tight text-ink">
                <span aria-hidden="true" className="h-px w-5 bg-accent/60 shrink-0" />
                <span className="min-w-0 flex-1">
                  <RoleTicker roles={roles} ready={ready} />
                </span>
              </div>
            )}

            {tagline && (
              <div
                className="rich-text lead mt-5 md:max-w-lg text-ink/75"
                dangerouslySetInnerHTML={{ __html: tagline }}
              />
            )}

            <div className="mt-10 flex flex-wrap items-center gap-3">
              <Magnetic>
                <a
                  href="#portfolio"
                  className="group inline-flex items-center gap-3 rounded-full bg-ink !text-paper pl-6 pr-1.5 py-1.5 text-sm font-medium hover:bg-ink-soft transition-colors duration-300"
                >
                  {primaryCta}
                  <span className="grid place-items-center w-9 h-9 rounded-full bg-paper/10 group-hover:bg-accent transition-colors duration-200">
                    <ArrowRightIcon className="w-4 h-4 no-fill fill-paper group-hover:-rotate-45 transition-transform duration-200" />
                  </span>
                </a>
              </Magnetic>
              <a
                href="#contact"
                className="inline-flex items-center rounded-full border border-ink/15 px-6 py-3 text-sm font-medium !text-ink hover:border-ink/40 hover:bg-white/60 transition-colors duration-300"
              >
                {secondaryCta}
              </a>
              {cvUrl && (
                <a
                  href={cvUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center px-2 py-3 text-sm font-medium text-link !text-ink"
                >
                  Download CV
                </a>
              )}
            </div>

            {availability && (
              <p className="mt-6 inline-flex items-center gap-2 text-sm text-ink/75">
                <span aria-hidden="true" className="w-2 h-2 rounded-full bg-accent" />
                {availability}
              </p>
            )}

            <div className="mt-10">
              <Socials
                width="w-6 h-6"
                iconClassName="fill-ink text-paper/70 hover:text-accent transition-colors"
              />
            </div>
          </div>

          {hasPortrait && (
            <div className="md:col-span-5 relative mx-auto w-full max-w-[22rem] sm:max-w-sm lg:max-w-[28rem] lg:ml-auto lg:mr-0">
              <div className="mobile-image-frame relative aspect-[4/5] rounded-[1.5rem] overflow-hidden bg-gradient-to-br from-ink to-ink-soft shadow-[0_30px_70px_-35px_rgba(23,51,43,0.45)]">
                <GatsbyImage
                  image={image.gatsbyImageData}
                  alt={`Portrait of ${name}`}
                  className="!absolute inset-0 w-full h-full"
                  imgClassName="object-cover"
                  loading="eager"
                  fetchpriority="high"
                />
                <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-ink/80 via-ink/30 to-transparent" />
                <div className="absolute bottom-4 left-5 right-5 flex items-end justify-between text-paper text-[0.75rem] font-medium">
                  <span className="uppercase tracking-wider">{name}</span>
                  <span>©{new Date().getFullYear()}</span>
                </div>
              </div>

              {!reduce && (
                <div className="absolute -left-5 bottom-10 sm:-left-10 w-24 h-24 sm:w-28 sm:h-28">
                  <a
                    href="#about"
                    aria-label="Scroll to About"
                    className="group block w-full h-full rounded-full bg-ink !text-paper/80 shadow-[0_20px_40px_-20px_rgba(23,51,43,0.6)] hover:!text-paper transition-colors duration-500"
                  >
                    <RotatingBadge
                      text={`EXPLORE • ${safeName.toUpperCase()} • `}
                      className="w-full h-full p-1"
                    >
                      <ArrowDownRightIcon className="w-5 h-5 no-fill fill-accent group-hover:rotate-45 transition-transform duration-500" />
                    </RotatingBadge>
                  </a>
                </div>
              )}
            </div>
          )}
        </div>
      </Container>

      <div className="relative md:mt-20 py-6">
        <Marquee duration={50} gap="2.5rem">
          {(marqueeItems?.length ? marqueeItems : roles).map((item, i) => (
            <span
              key={`${item}-${i}`}
              className="flex items-center gap-10 font-sans text-base md:text-lg font-medium text-ink/70 whitespace-nowrap"
            >
              {item}
              <span aria-hidden="true" className="w-1 h-1 rounded-full bg-ink/25" />
            </span>
          ))}
        </Marquee>
      </div>
    </section>
  )
}

export default HomeHero