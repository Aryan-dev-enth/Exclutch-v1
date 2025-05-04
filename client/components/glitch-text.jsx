"use client"



import { useEffect, useRef } from "react"
import { motion } from "framer-motion"


export default function GlitchText({ children, className = "" }) {
  const textRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (textRef.current) {
      textRef.current.setAttribute("data-text", textRef.current.textContent || "")
    }
  }, [children])

  return (
    <motion.div
      ref={textRef}
      className={`glitch-effect ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {children}
    </motion.div>
  )
}