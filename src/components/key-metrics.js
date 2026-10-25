import React, { useEffect, useState } from 'react'
import useSafeReducedMotion from './motion/use-safe-reduced-motion'
import { motion, animate } from 'motion/react'
import { EASE, useInViewOnce } from './motion/reveal'

const parseValue = (value = '') => {
  const match = String(value).match(/^([^\d-]*)(-?[\d,]*\.?\d+)(.*)$/)
  if (!match) return null
  const [, prefix, raw, suffix] = match
  const number = parseFloat(raw.replace(/,/g, ''))
  const decimals = raw.includes('.') ? raw.split('.')[1].length : 0
  return Number.isNaN(number) ? null : { prefix, number, suffix, decimals }
}

const AnimatedNumber = ({ value, start, reduce }) => {
  const parsed = parseValue(value)
  const [display, setDisplay] = useState(0)

  useEffect(() => {
    if (!parsed || !start) return undefined
    if (reduce) {
      setDisplay(parsed.number)
      return undefined
    }
    const controls = animate(0, parsed.number, {
      duration: 1.2,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setDisplay(v),
    })
    return () => controls.stop()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, start, reduce])

  if (!parsed) return <span>{value}</span>

  const formatted = display.toLocaleString(undefined, {
    minimumFractionDigits: parsed.decimals,
    maximumFractionDigits: parsed.decimals,
  })

  return (
    <span className="tabular-nums">
      {parsed.prefix}
      {formatted}
      <span className="text-paper/65">{parsed.suffix}</span>
    </span>
  )
}

const KeyMetrics = ({ list = [] }) => {
  const { ref, inView: entered } = useInViewOnce(0.1)
  const reduce = useSafeReducedMotion()

  return (
    <div
      ref={ref}
      className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-paper/10 rounded-[1.5rem] overflow-hidden border border-paper/10 stagger ${
        entered ? 'is-visible' : ''
      }`}
      style={{ '--stagger-step': '0.06s' }}
    >
      {list.map((stat, i) => (
        <div
          key={stat.label}
          className="stagger-item group relative bg-ink p-8 md:p-10 min-h-[14rem] flex flex-col justify-between overflow-hidden"
        >
          <div
            aria-hidden="true"
            className="absolute -bottom-24 -right-24 w-56 h-56 rounded-full bg-accent/0 group-hover:bg-accent/25 blur-3xl transition-colors duration-700"
          />
          <span className="eyebrow text-paper/65">{String(i + 1).padStart(2, '0')}</span>
          <div className="relative">
            <p className="display-lg !text-[clamp(2.75rem,5vw,4.5rem)] text-paper">
              <AnimatedNumber value={stat.value} start={entered} reduce={reduce || !entered} />
            </p>
            <p className="mt-3 text-paper/70 text-base max-w-[16rem]">{stat.label}</p>
            <motion.span
              aria-hidden="true"
              className="block mt-6 h-px bg-paper/30 origin-left"
              initial={false}
              animate={entered ? { scaleX: 1 } : { scaleX: 0 }}
              transition={{ duration: 0.8, delay: 0.1 + i * 0.04, ease: EASE }}
            />
          </div>
        </div>
      ))}
    </div>
  )
}

export default KeyMetrics