import '@fontsource/inter/400.css'
import '@fontsource/inter/500.css'
import '@fontsource/inter/600.css'
import '@fontsource/playfair-display/500.css'
import '@fontsource/playfair-display/500-italic.css'

import './src/styles/tailwind.css'
import './src/styles/variables.scss'
import './src/styles/global.scss'

import React from "react"
import { AnimatePresence } from "motion/react"

export const wrapPageElement = ({ element }) => (
    <AnimatePresence mode="wait">{element}</AnimatePresence>
)

export const shouldUpdateScroll = ({
    routerProps: { location },
    getSavedScrollPosition
}) => {
    // Give the incoming page a moment to render before scrolling
    // Must outlast the page exit transition in motion/header-list.js (0.7s)
    const TRANSITION_DELAY = 750

    if (location.hash) {
        window.setTimeout(() => {
            // scroll-padding-top in global.scss keeps the target clear of the fixed nav
            document.querySelector(location.hash)?.scrollIntoView({ behavior: "smooth" })
        }, TRANSITION_DELAY)
        return false
    }

    if (location.action === "PUSH") {
        window.setTimeout(() => window.scrollTo({ top: 0, behavior: "instant" }), TRANSITION_DELAY)
    } else {
        const savedPosition = getSavedScrollPosition(location) || [0, 0]
        window.setTimeout(() => window.scrollTo({ left: savedPosition[0], top: savedPosition[1], behavior: "instant" }), TRANSITION_DELAY)
    }
    return false
}
