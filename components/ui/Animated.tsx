'use client'

import React from 'react'
import { motion, MotionProps } from 'framer-motion'
import '../video.css'

type Props = React.PropsWithChildren<
  MotionProps & {
    className?: string
  }
>

export default function Animated({ children, className, ...rest }: Props) {
  return (
    <motion.div
      {...rest}
      className={[className, 'animated-3d'].filter(Boolean).join(' ')}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 8 }}
      transition={{ duration: 0.4, ease: [0.22, 0.9, 0.2, 1] }}
    >
      {children}
    </motion.div>
  )
}
