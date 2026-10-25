import React, { useRef, useState } from 'react'
import useSafeReducedMotion from './motion/use-safe-reduced-motion'
import { motion, AnimatePresence, useScroll, useSpring } from 'motion/react'
import { GatsbyImage } from 'gatsby-plugin-image'
import { PlusIcon, MinusIcon } from '@heroicons/react/24/solid'
import { EASE, useInViewOnce } from './motion/reveal'

const TimelineItem = ({ event, index, open, onToggle, idPrefix }) => {
  const { ref, inView } = useInViewOnce(0.1)
  const hasBio = !!event?.bio?.childMarkdownRemark?.html
  const bioId = `${idPrefix}-bio-${index}`

  return (
    <li
      ref={ref}
      className={`relative grid grid-cols-[2.5rem_1fr] md:grid-cols-[11rem_3rem_1fr] gap-x-4 md:gap-x-6 pb-14 last:pb-0 reveal ${
        inView ? 'is-visible' : ''
      }`}
      style={{ '--reveal-y': '16px' }}
    >
      <div className="hidden md:block pt-2 text-right">
        <p className="eyebrow text-ink/75 leading-relaxed">
          {event.startDate}
          <br />
          <span className={event.currentRole ? 'text-accent' : ''}>
            {event.currentRole ? 'Present' : event.endDate}
          </span>
        </p>
      </div>

      <div className="relative flex justify-center">
        <div className="relative z-10 w-10 h-10 md:w-12 md:h-12 rounded-full bg-paper border border-line shadow-sm overflow-hidden grid place-items-center">
          {event?.icon?.gatsbyImageData ? (
            <GatsbyImage
              image={event.icon.gatsbyImageData}
              alt={`${event.company} logo`}
              className="w-full h-full"
              imgClassName="object-contain p-1.5"
            />
          ) : (
            <span className="font-display font-semibold text-ink">{event.company?.[0]}</span>
          )}
        </div>
        {event.currentRole && (
          <span
            aria-hidden="true"
            className="absolute top-0 w-10 h-10 md:w-12 md:h-12 rounded-full bg-accent/40 animate-ping"
          />
        )}
      </div>

      <div className="group rounded-[1.5rem] border border-line bg-paper/70 hover:bg-white hover:shadow-[0_30px_60px_-30px_rgba(23,51,43,0.35)] hover:-translate-y-1 transition-all duration-500 p-6 md:p-8">
        <p className="md:hidden eyebrow text-ink/75 mb-3">
          {event.startDate} —{' '}
          {event.currentRole ? <span className="text-accent">Present</span> : event.endDate}
        </p>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h3 className="font-display text-2xl md:text-3xl font-semibold tracking-tight text-ink">
              {event.jobTitle}
            </h3>
            <p className="mt-1 text-ink/75 font-medium">{event.company}</p>
          </div>
          {event.currentRole && (
            <span className="eyebrow !text-[0.7rem] rounded-full bg-accent/10 text-accent px-3 py-1.5">
              Current role
            </span>
          )}
        </div>

        {event?.description?.childMarkdownRemark?.html && (
          <div
            className="rich-text mt-4 text-ink/75 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: event.description.childMarkdownRemark.html }}
          />
        )}

        {hasBio && (
          <>
            <button
              type="button"
              onClick={onToggle}
              aria-expanded={open}
              aria-controls={bioId}
              className="mt-5 inline-flex items-center gap-2 text-sm font-medium !text-ink"
            >
              <span className="grid place-items-center w-7 h-7 rounded-full border border-ink/20 group-hover:bg-ink group-hover:border-ink transition-colors duration-300">
                {open ? (
                  <MinusIcon className="w-3.5 h-3.5 no-fill fill-ink group-hover:fill-paper" />
                ) : (
                  <PlusIcon className="w-3.5 h-3.5 no-fill fill-ink group-hover:fill-paper" />
                )}
              </span>
              {open ? 'Show less' : 'Read more'}
            </button>
            <AnimatePresence initial={false}>
              {open && (
                <motion.div
                  id={bioId}
                  key="bio"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.8, ease: EASE }}
                  className="overflow-hidden"
                >
                  <div
                    className="rich-text pt-5 mt-5 border-t border-line text-ink/75 text-base leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: event.bio.childMarkdownRemark.html }}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </>
        )}
      </div>
    </li>
  )
}

const Resume = ({ timeline = [], initialCount = 6, idPrefix = 'timeline' }) => {
  const ref = useRef(null)
  const reduce = useSafeReducedMotion()
  const [showAll, setShowAll] = useState(false)
  const [open, setOpen] = useState([])
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 0.75', 'end 0.6'],
  })
  const spine = useSpring(scrollYProgress, { stiffness: 90, damping: 25 })

  const items = showAll ? timeline : timeline.slice(0, initialCount)
  const toggle = (i) =>
    setOpen((prev) => (prev.includes(i) ? prev.filter((x) => x !== i) : [...prev, i]))

  return (
    <div>
      <div ref={ref} className="relative">
        <div
          aria-hidden="true"
          className="absolute top-0 bottom-0 left-5 md:left-[calc(11rem+1.5rem+1.5rem)] w-px -translate-x-1/2 bg-ink/10"
        />
        <motion.div
          aria-hidden="true"
          style={reduce ? undefined : { scaleY: spine }}
          className="absolute top-0 bottom-0 left-5 md:left-[calc(11rem+1.5rem+1.5rem)] w-px -translate-x-1/2 bg-ink/60 origin-top"
        />
        <ul className="relative list-none p-0 m-0">
          {items.map((event, index) => (
            <TimelineItem
              key={`${event.company}-${event.jobTitle}-${index}`}
              event={event}
              index={index}
              open={open.includes(index)}
              onToggle={() => toggle(index)}
              idPrefix={idPrefix}
            />
          ))}
        </ul>
      </div>

      {timeline.length > initialCount && (
        <div className="mt-12 flex justify-center">
          <button
            type="button"
            onClick={() => setShowAll((v) => !v)}
            className="inline-flex items-center gap-3 rounded-full border border-ink/20 px-6 py-3 font-medium !text-ink hover:bg-ink hover:!text-paper transition-colors duration-300 group"
          >
            {showAll ? 'Show fewer roles' : `Show ${timeline.length - initialCount} earlier roles`}
            <PlusIcon
              className={`w-4 h-4 no-fill fill-current transition-transform duration-500 ${
                showAll ? 'rotate-45' : ''
              }`}
            />
          </button>
        </div>
      )}
    </div>
  )
}

export default Resume