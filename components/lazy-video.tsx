'use client'

import { useEffect, useRef, useState } from 'react'
import './video.css'

interface LazyVideoProps {
  src: string
  className?: string
  poster?: string
  autoplay?: boolean
  loop?: boolean
  muted?: boolean
  controls?: boolean
  playsInline?: boolean
  'aria-label'?: string
}

export default function LazyVideo({
  src,
  className = '',
  poster,
  autoplay = false,
  loop = false,
  muted = true,
  controls = false,
  playsInline = true,
  'aria-label': ariaLabel,
  ...props
}: LazyVideoProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const [loaded, setLoaded] = useState(false)
  const [error, setError] = useState(false)

  useEffect(() => {
    const el = videoRef.current
    if (!el) return

    const handleError = () => {
      console.error('Video failed to load:', src)
      setError(true)
    }

    el.addEventListener('error', handleError)

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting && !loaded) {
            el.src = src
            el.load()
            setLoaded(true)

            if (autoplay) {
              el.play().catch(err => {
                console.log('Autoplay prevented:', err)
              })
            }
          } else if (!entry.isIntersecting && autoplay) {
            el.pause()
          } else if (entry.isIntersecting && loaded && autoplay && el.paused) {
            el.play().catch(err => {
              console.log('Resume prevented:', err)
            })
          }
        })
      },
      {
        rootMargin: '50px',
        threshold: 0.1,
      }
    )

    observer.observe(el)

    return () => {
      observer.disconnect()
      el.removeEventListener('error', handleError)
    }
  }, [src, loaded, autoplay])

  return (
    <>
      <video
        ref={videoRef}
        className={[className, (props as any).className, 'video-bg-black']
          .filter(Boolean)
          .join(' ')}
        muted={muted}
        loop={loop}
        playsInline={playsInline}
        controls={controls}
        preload="metadata"
        poster={poster}
        aria-label={ariaLabel}
        {...props}
      >
        <source src={src} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/80 text-white text-sm">
          Video failed to load
        </div>
      )}
    </>
  )
}
