import React, { createContext, useContext, useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence, animate } from 'motion/react'
import { EASE } from './reveal'

const SESSION_KEY = 'intro-played'

const IntroContext = createContext(true)
export const useIntroReady = () => useContext(IntroContext)

const shouldPlayIntro = (skipAnimation) => {
  if (typeof window === 'undefined') return false
  if (skipAnimation) return false
  try {
    if (window.sessionStorage.getItem(SESSION_KEY)) return false
  } catch (e) {
    /* storage unavailable */
  }
  const connection = navigator.connection
  if (connection?.saveData || ['slow-2g', '2g'].includes(connection?.effectiveType)) return false
  if (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 2) return false
  if (navigator.deviceMemory && navigator.deviceMemory <= 2) return false
  return !window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

const RevealPreloader = ({
  brandName = 'LING KAN',
  label = 'Digital experience & growth',
  children,
  duration = 0.35,
  skipAnimation = false,
}) => {
  const [mounted, setMounted] = useState(false)
  const [visible, setVisible] = useState(true)
  const [instant, setInstant] = useState(false)
  const [count, setCount] = useState(0)
  const hasRun = useRef(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted || hasRun.current) return undefined
    hasRun.current = true

    if (!shouldPlayIntro(skipAnimation)) {
      setInstant(true)
      setVisible(false)
      return undefined
    }

    const controls = animate(0, 100, {
      duration,
      ease: [0.65, 0, 0.35, 1],
      onUpdate: (v) => setCount(Math.round(v)),
      onComplete: () => {
        try {
          window.sessionStorage.setItem(SESSION_KEY, '1')
        } catch (e) {
          /* storage unavailable */
        }
        setVisible(false)
      },
    })
    return () => controls.stop()
  }, [mounted, duration, skipAnimation])

  const introDone = mounted && !visible

  return (
    <>
      <noscript>
        <style>{'.preloader{display:none!important}'}</style>
      </noscript>
      <AnimatePresence>
        {visible && (
          <motion.div
            key="preloader"
            className="preloader fixed inset-0 z-[9999] bg-ink text-paper flex flex-col justify-between p-6 md:p-10 overflow-hidden"
            exit={instant ? { opacity: 0 } : { clipPath: 'inset(0 0 100% 0)' }}
            transition={{ duration: instant ? 0 : 0.9, ease: EASE }}
            aria-hidden="true"
          >
            <div className="relative flex justify-between eyebrow text-paper/65">
              <span>Portfolio</span>
              <span>{label}</span>
            </div>

            <div className="relative overflow-hidden">
              <motion.p
                className="display-xl uppercase"
                initial={{ y: '100%' }}
                animate={{ y: '0%' }}
                transition={{ duration: 0.8, ease: EASE }}
              >
                {brandName}
                <span className="text-accent">.</span>
              </motion.p>
            </div>

            <div className="relative flex items-end justify-between gap-6">
              <div className="flex-1 h-px bg-paper/15 overflow-hidden mb-4">
                <div
                  className="h-full bg-accent origin-left"
                  style={{ transform: `scaleX(${count / 100})` }}
                />
              </div>
              <span className="font-display font-semibold tabular-nums text-6xl md:text-[8rem] leading-none">
                {String(count).padStart(3, '0')}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <IntroContext.Provider value={introDone || (!mounted && false)}>
        {children}
      </IntroContext.Provider>
    </>
  )
}

export default RevealPreloader