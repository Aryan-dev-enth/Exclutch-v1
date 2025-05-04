"use client"

import { useEffect, useState } from "react"
import { AlertTriangle } from "lucide-react"
import { motion } from "framer-motion"

const API_CHECK_URL = process.env.NEXT_PUBLIC_API_BASE_URL 
const COLD_START_TIME = 90 // seconds

export default function ApiStatusFloater() {
  const [isApiDown, setIsApiDown] = useState(false)
  const [remainingTime, setRemainingTime] = useState(COLD_START_TIME)

  useEffect(() => {
    const checkApi = async () => {
      try {
        const res = await fetch(API_CHECK_URL, { method: "GET", cache: "no-store" })
        console.log(res)
        if (!res.ok) throw new Error("Not ok")
        setIsApiDown(false)
      } catch (error) {
        console.warn("API is down, likely cold start.")
        setIsApiDown(true)
      }
    }

    checkApi()

    const interval = setInterval(() => {
      checkApi()
    }, 15000) // retry every 15 seconds

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (!isApiDown) return
    const countdown = setInterval(() => {
      setRemainingTime((prev) => (prev > 0 ? prev - 1 : 0))
    }, 1000)

    return () => clearInterval(countdown)
  }, [isApiDown])

  if (!isApiDown) return null

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed bottom-4 right-4 z-50 bg-black border border-orange-600 text-orange-400 px-4 py-3 rounded-xl shadow-xl flex items-center gap-3 text-sm font-mono"
    >
      <AlertTriangle className="w-5 h-5 text-red-500 animate-pulse" />
      <div>
        API is waking up... <br />
        <span className="text-orange-500 font-bold">{remainingTime}</span> sec remaining
      </div>
    </motion.div>
  )
}
