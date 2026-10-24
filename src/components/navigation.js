import React, { useEffect, useRef, useState } from 'react'
import useSafeReducedMotion from './motion/use-safe-reduced-motion'
import { Link } from 'gatsby'
import { motion, AnimatePresence, useMotionValueEvent, useScroll } from 'motion/react'
import Container from './container'
import Logo from './logo'
import Socials from './socials'
import { EASE } from './motion/reveal'

const Navigation = ({ navList }) => {
  const reduce = useSafeReducedMotion()
  const [mobileNav, setMobileNav] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const lastScrollY = useRef(0)
  const scrolledRef = useRef(false)
  const { scrollY } = useScroll()

  useMotionValueEvent(scrollY, 'change', (y) => {
    const previousY = lastScrollY.current
    if (Math.abs(y - previousY) < 4) return

    lastScrollY.current = y
    const nextScrolled = y > 20

    if (scrolledRef.current !== nextScrolled) {
      scrolledRef.current = nextScrolled
      setScrolled(nextScrolled)
    }
  })

  // Lock page scroll while the mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileNav ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [mobileNav])

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && setMobileNav(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <>
      <motion.header
        role="banner"
        className="fixed top-0 inset-x-0 z-50 pt-3 md:pt-4"
      >
        <Container as="nav" aria-label="Main">
          <div
            className={`flex items-center justify-between rounded-full pl-5 pr-2 py-2 transition-[background-color,border-color,box-shadow] duration-300 ${
              scrolled || mobileNav
                ? 'bg-paper/95 shadow-[0_10px_40px_-15px_rgba(23,51,43,0.35)] border border-white/70'
                : 'border border-transparent'
            }`}
          >
            <Logo onClick={() => setMobileNav(false)} />

            <ul className="hidden md:flex items-center gap-1 p-0 m-0">
              {navList?.map((item) => (
                <li key={item.url} className="list-none">
                  <Link
                    to={item.url}
                    className="relative px-4 py-2 rounded-full text-sm font-medium !text-ink/75 hover:!text-ink hover:bg-ink/5 transition-colors"
                    activeClassName="!text-ink bg-ink/5"
                  >
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>

            <div className="flex items-center gap-2">
              <a
                href="/#contact"
                className="hidden sm:inline-flex items-center gap-2 rounded-full bg-ink !text-paper px-5 py-2.5 text-sm font-medium hover:bg-accent transition-colors duration-300"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                Let's talk
              </a>
              <button
                onClick={() => setMobileNav((v) => !v)}
                className="md:hidden relative w-11 h-11 rounded-full bg-ink grid place-items-center"
                aria-expanded={mobileNav}
                aria-controls="mobile-menu"
                aria-label={mobileNav ? 'Close menu' : 'Open menu'}
              >
                <span className="relative block w-5 h-3">
                  <motion.span
                    className="absolute left-0 right-0 h-[2px] bg-paper rounded-full"
                    animate={
                      mobileNav
                        ? { top: '50%', rotate: 45, y: '-50%' }
                        : { top: '0%', rotate: 0, y: '0%' }
                    }
                    transition={{ duration: 0.25, ease: EASE }}
                  />
                  <motion.span
                    className="absolute left-0 right-0 h-[2px] bg-paper rounded-full"
                    animate={
                      mobileNav
                        ? { bottom: '50%', rotate: -45, y: '50%' }
                        : { bottom: '0%', rotate: 0, y: '0%' }
                    }
                    transition={{ duration: 0.25, ease: EASE }}
                  />
                </span>
              </button>
            </div>
          </div>
        </Container>
      </motion.header>

      <AnimatePresence>
        {mobileNav && (
          <motion.div
            id="mobile-menu"
            key="mobile-menu"
            className="fixed inset-0 z-40 bg-ink text-paper md:hidden flex flex-col pt-28 pb-10 overflow-y-auto"
            initial={
              reduce
                ? false
                : { clipPath: 'circle(0% at calc(100% - 3rem) 2.5rem)' }
            }
            animate={{ clipPath: 'circle(150% at calc(100% - 3rem) 2.5rem)' }}
            exit={{ clipPath: 'circle(0% at calc(100% - 3rem) 2.5rem)' }}
            transition={{ duration: reduce ? 0 : 0.25, ease: EASE }}
          >
            <Container className="relative flex-1 flex flex-col">
              <p className="eyebrow text-paper/65 mb-6">Menu</p>
              <ul className="p-0 m-0 flex-1">
                {[...(navList || []), { title: "Let's talk", url: '/#contact' }].map(
                  (item, i) => (
                    <motion.li
                      key={item.url}
                      className="list-none border-b border-paper/10 overflow-hidden"
                      initial={reduce ? false : { opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: reduce ? 0 : 0.25,
                        delay: reduce ? 0 : 0.05 + i * 0.03,
                        ease: EASE,
                      }}
                    >
                      <Link
                        to={item.url}
                        onClick={() => setMobileNav(false)}
                        className="flex items-baseline gap-4 py-4 !text-paper"
                      >
                        <span className="eyebrow text-accent">
                          {String(i + 1).padStart(2, '0')}
                        </span>
                        <span className="font-display text-4xl font-semibold tracking-tight">
                          {item.title}
                        </span>
                      </Link>
                    </motion.li>
                  ),
                )}
              </ul>
              <div className="mt-10 text-paper">
                <Socials
                  width="w-7"
                  className="justify-start"
                  iconClassName="fill-grey !text-paper/70"
                />
              </div>
            </Container>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default Navigation