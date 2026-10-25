import React, { useEffect, useRef, useState } from 'react'
import useSafeReducedMotion from './use-safe-reduced-motion'
import { motion, useAnimate } from 'motion/react'

export const EASE = [0.16, 1, 0.3, 1]

/** Fires once when the element enters the viewport. */
export const useInViewOnce = (amount = 0.1) => {
  const ref = useRef(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return undefined
    if (typeof IntersectionObserver === 'undefined') {
      setInView(true)
      return undefined
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          io.disconnect()
        }
      },
      { threshold: amount },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [amount])

  return { ref, inView, entered: inView }
}

/** Back-compat shape — returns ref, inView, entered, reduce. */
export const useRevealInView = (amount = 0.1) => {
  const { ref, inView, entered } = useInViewOnce(amount)
  const reduce = useSafeReducedMotion()
  return {
    ref,
    inView,
    entered,
    reduce,
    animated: inView,
    controls: 'show',
  }
}

export const Reveal = ({
  children,
  delay = 0,
  y = 12,
  className = '',
  as = 'div',
  amount = 0.1,
  id,
}) => {
  const reduce = useSafeReducedMotion()
  const Tag = as
  const MotionTag = motion[as] || motion.div

  // Reduced motion: plain element, no Motion-only props on DOM
  if (reduce) {
    return (
      <Tag id={id} className={className}>
        {children}
      </Tag>
    )
  }

  return (
    <MotionTag
      id={id}
      className={className}
      initial={false}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount }}
      transition={{ duration: 0.7, delay, ease: EASE }}
      style={{ opacity: 0, transform: `translate3d(0, ${y}px, 0)` }}
    >
      {children}
    </MotionTag>
  )
}

/**
 * SplitText: one single Motion timeline drives all words.
 */
export const SplitText = ({
  text = '',
  className = '',
  delay = 0,
  stagger = 0.02,
  as = 'span',
  highlight = [],
  animateOnMount = false,
}) => {
  const reduce = useSafeReducedMotion()
  const [scope, animate] = useAnimate()
  const words = String(text).split(' ').filter(Boolean)
  const norm = (w) => w.replace(/[^\w'-]/g, '').toLowerCase()
  const highlighted = highlight.map(norm)
  const isHighlight = (word) => highlighted.includes(norm(word))

  useEffect(() => {
    if (reduce) return undefined
    if (!scope.current) return undefined

    const wordEls = scope.current.querySelectorAll('.split-text__word')
    if (!wordEls.length) return undefined

    const run = () => {
      animate(
        wordEls,
        { y: ['110%', '0%'] },
        { duration: 0.8, ease: EASE, delay: (i) => delay + i * stagger },
      )
    }

    if (animateOnMount) {
      run()
      return undefined
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          run()
          io.disconnect()
        }
      },
      { threshold: 0.15 },
    )
    io.observe(scope.current)
    return () => io.disconnect()
  }, [animate, delay, stagger, reduce, animateOnMount, scope, text])

  const Tag = as

  if (reduce) {
    return (
      <Tag className={className}>
        {words.map((word, i) => (
          <span key={i} className={isHighlight(word) ? 'editorial text-accent' : undefined}>
            {word}
            {i < words.length - 1 ? ' ' : ''}
          </span>
        ))}
      </Tag>
    )
  }

  return (
    <Tag ref={scope} className={className} aria-label={text}>
      <span aria-hidden="true" className="split-text">
        {words.map((word, i) => (
          <React.Fragment key={i}>
            <span className="split-text__mask">
              <span
                className={`split-text__word ${
                  isHighlight(word) ? 'editorial text-accent pr-[0.06em]' : ''
                }`}
              >
                {word}
              </span>
            </span>
            {i < words.length - 1 && ' '}
          </React.Fragment>
        ))}
      </span>
    </Tag>
  )
}

export const Stagger = ({
  children,
  className = '',
  stagger = 0.03,
  delay = 0,
  as = 'div',
  amount = 0.1,
}) => {
  const reduce = useSafeReducedMotion()
  const Tag = as
  const MotionTag = motion[as] || motion.div

  if (reduce) return <Tag className={className}>{children}</Tag>

  return (
    <MotionTag
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount }}
      variants={{
        hidden: {},
        show: { transition: { staggerChildren: stagger, delayChildren: delay } },
      }}
    >
      {children}
    </MotionTag>
  )
}

export const StaggerItem = ({
  children,
  className = '',
  as = 'div',
  y = 12,
  duration = 0.45,
}) => {
  const reduce = useSafeReducedMotion()
  const Tag = as
  const MotionTag = motion[as] || motion.div

  if (reduce) return <Tag className={className}>{children}</Tag>

  return (
    <MotionTag
      className={className}
      variants={{
        hidden: { opacity: 0, y },
        show: { opacity: 1, y: 0, transition: { duration, ease: EASE } },
      }}
    >
      {children}
    </MotionTag>
  )
}

export default Reveal