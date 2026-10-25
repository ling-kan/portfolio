import React from 'react'
import { Link } from 'gatsby'
import { GatsbyImage } from 'gatsby-plugin-image'
import Marquee from './motion/marquee'
import { useInViewOnce } from './motion/reveal'

const Tile = ({ post }) => (
  <Link
    to={`/portfolio/${post.slug}`}
    className="mobile-image-frame group relative block w-60 md:w-80 aspect-[16/10] shrink-0 rounded-2xl overflow-hidden bg-sand"
    aria-label={post.title}
  >
    <GatsbyImage
      image={post.heroImage.gatsbyImageData}
      alt=""
      className="w-full h-full grayscale-[85%] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700 ease-out"
      imgClassName="object-cover"
    />
    <span className="absolute inset-x-3 bottom-3 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 rounded-full glass px-3 py-1.5 text-[0.7rem] font-medium !text-ink truncate">
      {post.title}
    </span>
  </Link>
)

const ImageReel = ({ posts = [] }) => {
  const { ref, inView } = useInViewOnce(0.1)
  const items = posts.filter((p) => !p.hiddenPage && p.heroImage?.gatsbyImageData)

  if (items.length < 3) return null
  const half = Math.ceil(items.length / 2)
  const rows = [
    items.slice(0, half),
    items
      .slice(half)
      .concat(items.slice(0, Math.max(0, half - (items.length - half)))),
  ]

  return (
    <section ref={ref} aria-label="Project gallery" className="relative pb-12 md:pb-24 overflow-hidden">
      {inView && (
        <div className="space-y-5">
          {rows.map((row, i) => (
            <Marquee key={i} duration={60 + i * 12} gap="1.25rem" reverse={i === 1}>
              {row.map((post) => (
                <Tile key={`${i}-${post.slug}`} post={post} />
              ))}
            </Marquee>
          ))}
        </div>
      )}
    </section>
  )
}

export default ImageReel