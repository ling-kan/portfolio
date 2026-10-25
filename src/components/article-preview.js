import React, { useRef, useState } from 'react'
import useSafeReducedMotion from './motion/use-safe-reduced-motion'
import { Link } from 'gatsby'
import { GatsbyImage } from 'gatsby-plugin-image'
import { motion, useMotionValue, useSpring } from 'motion/react'
import { ArrowUpRightIcon, LockClosedIcon } from '@heroicons/react/24/solid'
import { EASE, useInViewOnce } from './motion/reveal'

const ProjectCard = ({ post, index }) => {
  const imageFrameRef = useRef(null)
  const reduce = useSafeReducedMotion()
  const { ref: revealRef, inView } = useInViewOnce(0.1)
  const [hover, setHover] = useState(false)

  const cx = useMotionValue(0)
  const cy = useMotionValue(0)
  const cursorX = useSpring(cx, { stiffness: 300, damping: 28 })
  const cursorY = useSpring(cy, { stiffness: 300, damping: 28 })

  const onMove = (e) => {
    const rect = imageFrameRef.current?.getBoundingClientRect()
    if (!rect) return
    const withinImage =
      e.clientX >= rect.left &&
      e.clientX <= rect.right &&
      e.clientY >= rect.top &&
      e.clientY <= rect.bottom
    setHover((curr) => (curr === withinImage ? curr : withinImage))
    cx.set(e.clientX - rect.left)
    cy.set(e.clientY - rect.top)
  }

  const html = post.description?.childMarkdownRemark?.html

  return (
    <li
      ref={revealRef}
      className={`list-none reveal ${inView ? 'is-visible' : ''}`}
      style={{ '--reveal-y': '16px' }}
    >
      <Link
        to={`/portfolio/${post.slug}`}
        className="group block !text-ink"
        aria-label={`Read case study: ${post.title}`}
        onMouseMove={onMove}
        onMouseLeave={() => setHover(false)}
      >
        {post.heroImage?.gatsbyImageData && (
          <div
            ref={imageFrameRef}
            className="mobile-image-frame relative aspect-[4/3] rounded-[1.5rem] overflow-hidden bg-sand md:cursor-none"
          >
            <div className="absolute inset-0">
              <GatsbyImage
                image={post.heroImage.gatsbyImageData}
                alt={post.title}
                className="w-full h-full transition-transform duration-[1.2s] ease-out group-hover:scale-105"
                imgClassName="object-cover"
              />
            </div>
            <div className="absolute inset-0 bg-ink/0 group-hover:bg-ink/20 transition-colors duration-500" />

            <div className="absolute top-5 left-5 right-5 flex items-center justify-between">
              <span className="glass rounded-full px-3 py-1.5 eyebrow !text-[0.7rem] text-ink">
                {String(index + 1).padStart(2, '0')}
              </span>
              {post.protectPage && (
                <span className="glass rounded-full px-3 py-1.5 eyebrow !text-[0.7rem] text-ink inline-flex items-center gap-1.5">
                  <LockClosedIcon className="w-3 h-3 no-fill fill-ink" /> Private
                </span>
              )}
            </div>

            {!reduce && (
              <motion.span
                aria-hidden="true"
                style={{ x: cursorX, y: cursorY }}
                animate={{ scale: hover ? 1 : 0, opacity: hover ? 1 : 0 }}
                transition={{ duration: 0.8, ease: EASE }}
                className="hidden md:grid absolute top-0 left-0 -ml-12 -mt-12 w-24 h-24 place-items-center rounded-full bg-ink/90 backdrop-blur text-paper text-xs font-medium tracking-wide pointer-events-none"
              >
                View case
              </motion.span>
            )}
          </div>
        )}

        <div className="mt-6 flex items-start justify-between gap-6">
          <div className="min-w-0">
            <p className="eyebrow text-ink/75">
              {post.endDate}
              {post.tags?.length > 0 && <span className="text-ink/30"> · </span>}
              {post.tags?.[0]}
            </p>
            <h3 className="mt-3 display-md !text-[clamp(1.3rem,1.8vw,1.6rem)] text-ink group-hover:text-accent transition-colors duration-300">
              {post.title}
            </h3>
            {post.headlineResult && (
              <p className="mt-3 inline-flex items-center gap-2 rounded-full bg-accent/10 px-3 py-1 text-sm font-semibold text-accent">
                {post.headlineResult}
              </p>
            )}
            {html && (
              <div
                className="rich-text mt-3 text-ink/75 line-clamp-2 max-w-lg"
                dangerouslySetInnerHTML={{ __html: html }}
              />
            )}
          </div>
          <span className="shrink-0 grid place-items-center w-12 h-12 rounded-full border border-ink/20 group-hover:bg-ink group-hover:border-ink transition-all duration-500 group-hover:rotate-45">
            <ArrowUpRightIcon className="w-5 h-5 no-fill fill-ink group-hover:fill-paper transition-colors" />
          </span>
        </div>
      </Link>
    </li>
  )
}

const ArticlePreview = ({ posts, limit }) => {
  if (!Array.isArray(posts)) return null
  const visible = posts.filter((post) => !post.hiddenPage)
  const shown = limit ? visible.slice(0, limit) : visible

  return (
    <>
      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 lg:gap-x-8 gap-y-14 p-0 m-0">
        {shown.map((post, index) => (
          <ProjectCard key={post.slug} post={post} index={index} />
        ))}
      </ul>
      {shown.length < visible.length && (
        <div className="mt-16 flex justify-center">
          <Link
            to="/portfolio/"
            className="group inline-flex items-center gap-3 rounded-full border border-ink/15 pl-6 pr-2 py-2 text-sm font-medium !text-ink hover:border-ink/40 hover:bg-white/60 transition-colors duration-300"
          >
            See all {visible.length} case studies
            <span className="grid place-items-center w-8 h-8 rounded-full bg-ink">
              <ArrowUpRightIcon className="w-3.5 h-3.5 no-fill fill-paper group-hover:rotate-45 transition-transform duration-500" />
            </span>
          </Link>
        </div>
      )}
    </>
  )
}

export default ArticlePreview