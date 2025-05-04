"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import GlitchText from "@/components/glitch-text"

export default function NotFound() {
  const [glitchText, setGlitchText] = useState("WANNA SPY?")
  const [showMessage, setShowMessage] = useState(false)

  useEffect(() => {
    // Random glitch effect
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+"
        let result = ""
        for (let i = 0; i < 10; i++) {
          result += characters.charAt(Math.floor(Math.random() * characters.length))
        }
        setGlitchText(result)

        // Reset after a short delay
        setTimeout(() => {
          setGlitchText("WANNA SPY?")
        }, 200)
      }
    }, 2000)

    // Show message after delay
    const timeout = setTimeout(() => {
      setShowMessage(true)
    }, 3000)

    return () => {
      clearInterval(interval)
      clearTimeout(timeout)
    }
  }, [])

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4 overflow-hidden relative">
      {/* Binary background */}
      <div className="absolute inset-0 overflow-hidden opacity-10">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="absolute text-orange-500 font-mono text-sm whitespace-nowrap"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${10 + Math.random() * 20}s linear infinite`,
              opacity: 0.7,
            }}
          >
            {Array.from({ length: 50 })
              .map(() => (Math.random() > 0.5 ? "1" : "0"))
              .join("")}
          </div>
        ))}
      </div>

      {/* Glitchy elements */}
      <div className="relative z-10 text-center">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className="mb-8">
          <GlitchText className="text-5xl md:text-7xl font-bold font-mono text-orange-500">LOGIN</GlitchText>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mb-12"
        >
          <GlitchText className="text-4xl md:text-5xl font-bold font-mono text-orange-500">{glitchText}</GlitchText>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: showMessage ? 1 : 0, y: showMessage ? 0 : 20 }}
          transition={{ duration: 0.5 }}
          className="max-w-md mx-auto mb-8"
        >
          <p className="text-gray-400 mb-6">
            Looks like you've ventured into restricted territory. This page doesn't exist or has been moved to a
            classified location.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild className="bg-orange-600 hover:bg-orange-700 text-white">
              <Link href="/">Return to Base</Link>
            </Button>
            <Button asChild variant="outline" className="border-orange-600 text-orange-500 hover:bg-orange-950">
              <Link href="/join-us">Join the Mission</Link>
            </Button>
          </div>
        </motion.div>
      </div>

      {/* Glitch overlay */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-30"></div>
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-5 mix-blend-overlay"></div>

        {/* Horizontal glitch lines */}
        {Array.from({ length: 10 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-full h-px bg-orange-500 opacity-30"
            style={{
              top: `${Math.random() * 100}%`,
              animation: `glitchLine ${0.5 + Math.random() * 2}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 5}s`,
            }}
          ></div>
        ))}
      </div>

      <style jsx global>{`
        @keyframes glitchLine {
          0% {
            opacity: 0;
            transform: translateX(-100%);
          }
          10%, 90% {
            opacity: 0.3;
          }
          100% {
            opacity: 0;
            transform: translateX(100%);
          }
        }
        
        @keyframes float {
          0% {
            transform: translateY(0);
            opacity: 0;
          }
          10% {
            opacity: 0.7;
          }
          90% {
            opacity: 0.7;
          }
          100% {
            transform: translateY(-100vh);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  )
}