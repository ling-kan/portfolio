import React from 'react'
import { motion, useScroll, useTransform } from 'motion/react'

const ScrollProgress = () => {
  const { scrollYProgress } = useScroll()
  const scaleX = useTransform(scrollYProgress, [0, 1], [0, 1])

  return (
    <motion.div
      aria-hidden="true"
      className="fixed top-0 left-0 right-0 h-[3px] bg-accent origin-left z-[60]"
      style={{ scaleX }}
    />
  )
}

export default ScrollProgress