"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Code, Heart, Coffee } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

export function DeveloperDialog() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const closeModal = () => setIsModalOpen(false)

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        className="flex items-center space-x-2 cursor-pointer"
        onClick={() => setIsModalOpen(true)}
      >
        <Code className="h-4 w-4" />
        <span>Meet the Team</span>
      </Button>

      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 30 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="relative w-11/12 max-w-lg rounded-2xl bg-white p-8 shadow-xl md:w-2/3 lg:w-1/2"
            >
              {/* Close Button */}
              <div className="flex justify-end">
                <button
                  onClick={closeModal}
                  className="text-gray-400 transition-colors hover:text-gray-600 text-2xl"
                >
                  &times;
                </button>
              </div>

              {/* Image and Heading */}
              <div className="text-center mb-6">
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2, duration: 0.4 }}
                  className="mx-auto h-42 w-42 overflow-hidden rounded-full shadow-lg bg-gray-100"
                >
                  <img
                    src="https://res.cloudinary.com/do3vqgriw/image/upload/v1749542899/qtvu1blvwl0t1iqkacvf.jpg"
                    alt="Team Photo"
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      e.target.src =
                        "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='112' height='112' viewBox='0 0 24 24' fill='none' stroke='%236366f1' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2'/%3E%3Ccircle cx='12' cy='7' r='4'/%3E%3C/svg%3E"
                    }}
                  />
                </motion.div>

                <h2 className="mt-4 text-3xl font-bold text-gray-800">Aryan & Agrim</h2>
                <p className="text-gray-500">Crafting code and solving chaos</p>
              </div>

              {/* Description */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="space-y-5 text-center text-gray-700"
              >
                <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
                  <p className="leading-relaxed">
                   This project was procastination final boss, so before reporting a bug think twice!
                  </p>
                </div>

                <div className="flex justify-center items-center space-x-2 text-sm text-gray-500">
                  <span>Built with</span>
                  <Heart className="h-4 w-4 text-red-500 fill-current" />
                  <span>and plenty of</span>
                  <Coffee className="h-4 w-4 text-brown-500" />
                </div>

                <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-3 text-yellow-800 text-sm font-medium">
                  “We write code that *mostly* works.”
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
