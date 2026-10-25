import React, { useState } from 'react'
import useSafeReducedMotion from './motion/use-safe-reduced-motion'
import { motion, AnimatePresence } from 'motion/react'
import ImageSlot, { hasImage } from './image-slot'
import { EASE, useInViewOnce } from './motion/reveal'

const SkillsPanel = ({ list = [], image }) => {
  const reduce = useSafeReducedMotion()
  const { ref, inView: entered } = useInViewOnce(0.1)
  const [active, setActive] = useState(0)
  const [focused, setFocused] = useState(null)
  const section = list[active] || { skills: [] }
  const skills = section.skills || []
  const detail = skills.find((s) => s.name === focused) || skills[0]
  const withImage = hasImage('craft', image)

  const selectCategory = (i) => {
    setActive(i)
    setFocused(null)
  }

  return (
    <div
      ref={ref}
      className={`grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 reveal ${
        entered ? 'is-visible' : ''
      }`}
    >
      <div className="lg:col-span-6">
        <div role="tablist" aria-label="Skill categories" className="flex flex-wrap gap-2 mb-10">
          {list.map((cat, i) => (
            <button
              key={cat.category}
              role="tab"
              aria-selected={active === i}
              onClick={() => selectCategory(i)}
              className={`relative rounded-full px-5 py-2.5 text-sm font-medium transition-colors duration-300 ${
                active === i ? '!text-paper' : '!text-ink/75 hover:!text-ink bg-ink/5'
              }`}
            >
              {active === i && (
                <motion.span
                  layoutId="skills-tab"
                  className="absolute inset-0 rounded-full bg-ink"
                  transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                />
              )}
              <span className="relative">{cat.category}</span>
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.ul
            key={section.category}
            className="flex flex-wrap gap-3"
            initial={false}
            animate="show"
            exit="exit"
            variants={{
              hidden: {},
              show: { transition: { staggerChildren: reduce ? 0 : 0.04 } },
              exit: { opacity: 0, transition: { duration: 0.2 } },
            }}
          >
            {skills.map((skill) => {
              const isActive = detail?.name === skill.name
              return (
                <motion.li
                  key={skill.name}
                  variants={{
                    hidden: { opacity: 0, y: 20, scale: 0.9 },
                    show: {
                      opacity: 1,
                      y: 0,
                      scale: 1,
                      transition: { duration: 0.8, ease: EASE },
                    },
                  }}
                >
                  <button
                    type="button"
                    onMouseEnter={() => setFocused(skill.name)}
                    onFocus={() => setFocused(skill.name)}
                    onClick={() => setFocused(skill.name)}
                    aria-pressed={isActive}
                    className={`rounded-2xl border px-5 py-3 text-base md:text-lg font-sans font-medium tracking-tight transition-all duration-300 hover:-translate-y-0.5 ${
                      isActive
                        ? 'bg-ink border-ink !text-paper shadow-[0_14px_30px_-16px_rgba(23,51,43,0.7)]'
                        : 'bg-paper border-line !text-ink hover:border-ink'
                    }`}
                  >
                    {skill.name}
                  </button>
                </motion.li>
              )
            })}
          </motion.ul>
        </AnimatePresence>
      </div>

      <aside className="lg:col-span-6">
        <div className="relative rounded-[1.5rem] bg-ink text-paper p-8 md:p-10 overflow-hidden min-h-[22rem] lg:sticky lg:top-28">
          {withImage && (
            <div className="mobile-image-frame relative -mx-4 -mt-4 mb-7 aspect-[16/10] rounded-2xl overflow-hidden">
              <ImageSlot slot="craft" image={image} />
            </div>
          )}
          <p className="eyebrow text-paper/65 relative">{section.category}</p>
          <AnimatePresence mode="wait">
            <motion.div
              key={detail?.name || 'empty'}
              initial={reduce || entered ? false : { opacity: 0, y: 16 }}
              animate={entered || reduce ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.8, ease: EASE }}
              className="relative mt-8"
            >
              <h3 className="display-md text-paper">{detail?.name}</h3>
              {detail?.description && (
                <p className="mt-4 text-paper/70 text-base md:text-lg leading-relaxed max-w-prose">
                  {detail.description}
                </p>
              )}
            </motion.div>
          </AnimatePresence>
          <p className="relative mt-10 eyebrow text-paper/65">
            {String(skills.length).padStart(2, '0')} skills · hover or tap to explore
          </p>
        </div>
      </aside>
    </div>
  )
}

export default SkillsPanel