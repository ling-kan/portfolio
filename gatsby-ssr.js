import React from 'react'

export const onRenderBody = ({ setHeadComponents }) => {
  setHeadComponents([
    <link
      key="font-inter-400"
      rel="preload"
      href="/fonts/inter-latin-400-normal.woff2"
      as="font"
      type="font/woff2"
      crossOrigin="anonymous"
    />,
    <link
      key="font-inter-600"
      rel="font-inter-600"
      href="/fonts/inter-latin-600-normal.woff2"
      as="font"
      type="font/woff2"
      crossOrigin="anonymous"
    />,
    <link
      key="font-playfair-500"
      rel="preload"
      href="/fonts/playfair-display-latin-500-normal.woff2"
      as="font"
      type="font/woff2"
      crossOrigin="anonymous"
    />,
  ])
}