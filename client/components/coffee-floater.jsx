"use client"

import { useEffect, useState } from "react"
import { Coffee, Heart, ChevronsDown } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

const DISPLAY_DELAY = 3000 // 10 seconds before showing
const AUTO_MINIMIZE_DELAY = 8000 // 8 seconds before auto-minimizing

export default function CoffeeFloater() {
  const [isVisible, setIsVisible] = useState(false)
  const [isMinimized, setIsMinimized] = useState(true)

  useEffect(() => {
    const showTimer = setTimeout(() => {
      setIsVisible(true)
    }, DISPLAY_DELAY)
    return () => clearTimeout(showTimer)
  }, [])

  useEffect(() => {
    if (!isVisible || isMinimized) return
    const minimizeTimer = setTimeout(() => {
      setIsMinimized(true)
    }, AUTO_MINIMIZE_DELAY)
    return () => clearTimeout(minimizeTimer)
  }, [isVisible, isMinimized])

  const handleCoffeeClick = () => {
    window.open("https://buymeacoffee.com/aryandeventh", "_blank")
    setIsMinimized(true)
  }

  if (!isVisible) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0, scale: 0.8 }}
        animate={{
          y: 0,
          opacity: 1,
          scale: 1,
          width: isMinimized ? "auto" : "320px"
        }}
        exit={{ y: 100, opacity: 0, scale: 0.8 }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 30
        }}
        className="fixed cursor-pointer bottom-6 right-6 z-50 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border-2 border-amber-200 dark:border-amber-700 rounded-2xl shadow-2xl overflow-hidden"
      >
        {isMinimized ? (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsMinimized(false)}
            className="p-4 flex items-center justify-center group cursor-pointer"
          >
            <div className="relative">
              <Coffee className="w-6 h-6 text-amber-600 dark:text-amber-400 group-hover:text-amber-700 dark:group-hover:text-amber-300 transition-colors" />
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full flex items-center justify-center"
              >
                <Heart className="w-2 h-2 text-white" />
              </motion.div>
            </div>
          </motion.button>
        ) : (
          <div className="p-5">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-xl">
                  <Coffee className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-sm">
                    Buy me a coffee! ☕
                  </h3>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    Enjoying Exclutch, SRM Study Notes?
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsMinimized(true)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors p-1 cursor-pointer"
              >
                <ChevronsDown className="w-4 h-4" />
              </button>
            </div>

            <p className="text-sm text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
              Help keep this platform free for all SRM students! Your support means the world to us.
            </p>

            <div className="flex gap-2">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleCoffeeClick}
                className="flex-1 bg-gradient-to-r cursor-pointer from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-medium py-2.5 px-4 rounded-xl text-sm transition-all duration-200 flex items-center justify-center gap-2 shadow-lg"
              >
                <Coffee className="w-4 h-4" />
                Buy Coffee
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setIsMinimized(true)}
                className="px-3 py-2.5 border cursor-pointer border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-sm"
              >
                Later
              </motion.button>
            </div>

            <div className="mt-3 flex items-center justify-center">
              <div className="flex gap-1">
                {[...Array(3)].map((_, i) => (
                  <motion.div
                    key={i}
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      delay: i * 0.2
                    }}
                    className="w-1.5 h-1.5 bg-amber-400 rounded-full"
                  />
                ))}
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  )
}
