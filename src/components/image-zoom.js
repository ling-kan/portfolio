import React, { useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { XMarkIcon } from '@heroicons/react/24/solid'

const getImageSource = (image) => {
  if (typeof image === 'string') return { src: image }

  const fallback = image?.images?.fallback
  if (fallback?.src) {
    return {
      src: fallback.src,
      srcSet: fallback.srcSet,
      sizes: fallback.sizes || '100vw',
    }
  }

  return { src: '' }
}

const ImageZoomDialog = ({ source, alt, onClose }) => {
  const closeRef = useRef(null)

  useEffect(() => {
    const previousOverflow = document.body.style.overflow
    const previousFocus = document.activeElement
    const onKeyDown = (event) => {
      if (event.key === 'Escape') onClose()
      if (event.key === 'Tab') {
        event.preventDefault()
        closeRef.current?.focus()
      }
    }

    document.body.style.overflow = 'hidden'
    document.addEventListener('keydown', onKeyDown)
    closeRef.current?.focus()

    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', onKeyDown)
      if (previousFocus instanceof HTMLElement) previousFocus.focus()
    }
  }, [onClose])

  return (
    <div className="image-zoom-backdrop">
      <div
        className="image-zoom-dialog"
        role="dialog"
        aria-modal="true"
        aria-label={alt || 'Enlarged image'}
      >
        <button
          ref={closeRef}
          type="button"
          className="image-zoom-close"
          aria-label="Close enlarged image"
          onClick={onClose}
        >
          <XMarkIcon aria-hidden="true" className="h-6 w-6" />
        </button>
        <img
          src={source.src}
          srcSet={source.srcSet}
          sizes={source.sizes}
          alt={alt}
          className="image-zoom-image"
        />
      </div>
    </div>
  )
}

const ImageZoom = ({ image, alt = '', children, className = '' }) => {
  const [source, setSource] = useState(null)
  const triggerRef = useRef(null)
  const imageSource = getImageSource(image)
  const close = useCallback(() => setSource(null), [])

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        className={`image-zoom-trigger ${className}`}
        aria-label={alt ? `View larger image: ${alt}` : 'View larger image'}
        onClick={() => {
          triggerRef.current?.focus()
          if (imageSource.src) setSource(imageSource)
        }}
      >
        {children}
      </button>
      {source &&
        createPortal(
          <ImageZoomDialog source={source} alt={alt} onClose={close} />,
          document.body,
        )}
    </>
  )
}

export const ImageZoomContent = ({ html = '', className = '' }) => {
  const [activeImage, setActiveImage] = useState(null)
  const contentRef = useRef(null)
  const close = useCallback(() => setActiveImage(null), [])

  // Make every image inside the rendered HTML a proper interactive element.
  useEffect(() => {
    const images = contentRef.current?.querySelectorAll('img') || []
    images.forEach((image) => {
      image.tabIndex = 0
      image.setAttribute('role', 'button')
      image.setAttribute(
        'aria-label',
        image.alt ? `View larger image: ${image.alt}` : 'View larger image',
      )
      image.title = 'View larger image'
    })
  }, [html])

  const showImage = useCallback((image) => {
    image.focus()
    const source = {
      src: image.currentSrc || image.src,
      srcSet: image.getAttribute('srcset') || undefined,
      sizes: '100vw',
    }
    if (source.src) setActiveImage({ source, alt: image.alt || '' })
  }, [])

  // Event delegation: click and keyboard handling for rich-content images.
  const onClick = useCallback(
    (event) => {
      if (event.target instanceof HTMLImageElement) {
        event.preventDefault()
        event.stopPropagation()
        showImage(event.target)
      }
    },
    [showImage],
  )

  const onKeyDown = useCallback(
    (event) => {
      if (
        event.target instanceof HTMLImageElement &&
        (event.key === 'Enter' || event.key === ' ')
      ) {
        event.preventDefault()
        event.stopPropagation()
        showImage(event.target)
      }
    },
    [showImage],
  )

  return (
    <>
      <div
        ref={contentRef}
        className={`image-zoom-content ${className}`}
        onClick={onClick}
        onKeyDown={onKeyDown}
        role="presentation"
        // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
        tabIndex={-1}
        dangerouslySetInnerHTML={{ __html: html }}
      />
      {activeImage &&
        createPortal(
          <ImageZoomDialog
            source={activeImage.source}
            alt={activeImage.alt}
            onClose={close}
          />,
          document.body,
        )}
    </>
  )
}

export default ImageZoom