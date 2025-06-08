'use client'

import { useState, useCallback } from 'react'



export function useRateLimit(options) {
  const [attempts, setAttempts] = useState([])
  const [isLimited, setIsLimited] = useState(false)

  const checkRateLimit = useCallback(() => {
    const now = Date.now()
    const windowStart = now - options.windowMs
    
    const recentAttempts = attempts.filter(time => time > windowStart)
    
    if (recentAttempts.length >= options.maxAttempts) {
      setIsLimited(true)
      return false
    }
    
    setAttempts([...recentAttempts, now])
    setIsLimited(false)
    return true
  }, [attempts, options.maxAttempts, options.windowMs])

  const getRemainingTime = useCallback(() => {
    if (!isLimited) return 0
    const oldestAttempt = Math.min(...attempts)
    const resetTime = oldestAttempt + options.windowMs
    return Math.max(0, resetTime - Date.now())
  }, [attempts, isLimited, options.windowMs])

  return { checkRateLimit, isLimited, getRemainingTime }
}
