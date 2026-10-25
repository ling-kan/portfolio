import { useEffect, useState } from 'react'

const REDUCED_QUERY = '(prefers-reduced-motion: reduce)'

/**
 * Returns true when the user prefers reduced motion OR is on a low-powered device.
 * Always returns false on the server and on the first client render so that
 * hydration matches SSR, then updates after mount. This avoids the
 * "Suspense boundary received an update before it finished hydrating" error.
 */
const useSafeReducedMotion = () => {
  const [reduce, setReduce] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return undefined
    const mq = window.matchMedia(REDUCED_QUERY)

    const compute = () => {
      const cores = navigator.hardwareConcurrency || 8
      const mem = navigator.deviceMemory || 8
      setReduce(mq.matches || cores <= 2 || mem <= 2)
    }

    compute()
    mq.addEventListener('change', compute)
    return () => mq.removeEventListener('change', compute)
  }, [])

  return reduce
}

export default useSafeReducedMotion
