import React from 'react'
import { motion } from 'framer-motion'
import type { SectionId } from '../constants/designTokens'

interface SectionWrapperProps {
  id: SectionId
  children: React.ReactNode
  className?: string
  sectionRef?: React.RefObject<HTMLElement | null>
}

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6 },
  },
}

const SectionWrapper: React.FC<SectionWrapperProps> = ({
  id,
  children,
  className,
  sectionRef,
}) => (
  <motion.section
    id={id}
    ref={sectionRef as React.RefObject<HTMLElement>}
    className={className}
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, margin: '-80px' }}
    variants={fadeUp}
  >
    {children}
  </motion.section>
)

export default SectionWrapper
