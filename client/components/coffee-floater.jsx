"use client"

import { useEffect, useState } from "react"
import { Coffee, Heart, ChevronsDown, IndianRupee, QrCode, Smartphone, Monitor, X } from "lucide-react"

const DISPLAY_DELAY = 10000 // 10 seconds before showing
const AUTO_MINIMIZE_DELAY = 8000 // 8 seconds before auto-minimizing

// QR Code generation function using a simple algorithm
const generateQRCode = (text) => {
  // Create QR code using Google Charts API
  const size = 200
  const encodedText = encodeURIComponent(text)
  return `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodedText}`
}

export default function CoffeeFloater() {
  const [isVisible, setIsVisible] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [showQR, setShowQR] = useState(false)
  const [customAmount, setCustomAmount] = useState("50")
  const [isCustomAmountMode, setIsCustomAmountMode] = useState(false)
  const [qrCode, setQrCode] = useState("")
  const [isMobile, setIsMobile] = useState(false)

  // Detect mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent))
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

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

  const generateUPILink = (amount) => {
    return `upi://pay?pa=aryan28november@oksbi&pn=Aryan%20Singh&tn=Support%20Exclutch&am=${amount}&cu=INR`
  }

  const handleUPIClick = () => {
    const amount = customAmount || "50"
    const upiLink = generateUPILink(amount)
    
    if (isMobile) {
      window.location.href = upiLink
    } else {
      // Generate QR code for desktop users
      const qrDataUrl = generateQRCode(upiLink)
      setQrCode(qrDataUrl)
      setShowQR(true)
    }
  }

  const handleAmountChange = (e) => {
    const value = e.target.value.replace(/[^\d]/g, '')
    if (value === '' || (parseInt(value) >= 1 && parseInt(value) <= 10000)) {
      setCustomAmount(value)
    }
  }

  const predefinedAmounts = [10, 50, 100, 200]

  if (!isVisible) return null

  return (
    <>
      {/* QR Code Modal */}
      {showQR && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 max-w-sm w-full mx-4 relative">
            <button
              onClick={() => setShowQR(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <X className="w-5 h-5" />
            </button>
            
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-4">
                <QrCode className="w-6 h-6 text-blue-600" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  Scan to Pay
                </h3>
              </div>
              
              <div className="bg-white p-4 rounded-xl mb-4 inline-block">
                <img src={qrCode} alt="UPI QR Code" className="w-48 h-48" />
              </div>
              
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                Scan with any UPI app to pay ₹{customAmount || "50"}
              </p>
             
            </div>
          </div>
        </div>
      )}

      {/* Main Floater */}
      <div
        className={`fixed bottom-6 right-6 z-50 transition-all duration-300 ${
          isMinimized ? "w-auto" : "w-80"
        }`}
      >
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-xl overflow-hidden">
          {isMinimized ? (
            <button
              onClick={() => setIsMinimized(false)}
              className="p-4 flex items-center justify-center group hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              <div className="relative">
                <Coffee className="w-6 h-6 text-amber-600 dark:text-amber-400 group-hover:text-amber-700 dark:group-hover:text-amber-300 transition-colors" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full flex items-center justify-center animate-pulse">
                  <Heart className="w-2 h-2 text-white" />
                </div>
              </div>
            </button>
          ) : (
            <div className="p-5">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-xl">
                    <Coffee className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-sm">
                      Support Exclutch ☕
                    </h3>
                    <p className="text-xs text-gray-600 dark:text-gray-400 flex items-center gap-1">
                      {isMobile ? (
                        <>
                          <Smartphone className="w-3 h-3" />
                          Direct UPI
                        </>
                      ) : (
                        <>
                          <Monitor className="w-3 h-3" />
                          QR Code
                        </>
                      )}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsMinimized(true)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <ChevronsDown className="w-4 h-4" />
                </button>
              </div>

              <p className="text-sm text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
                Help keep this platform free for SRM students. {isMobile ? "One tap UPI" : "Scan QR code"} to Aryan Singh!
              </p>

              {/* Amount Selection */}
              <div className="mb-4">
                <div className="flex gap-2 mb-3">
                  {predefinedAmounts.map((amount) => (
                    <button
                      key={amount}
                      onClick={() => {
                        setCustomAmount(amount.toString())
                        setIsCustomAmountMode(false)
                      }}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                        customAmount === amount.toString()
                          ? "bg-amber-500 text-white"
                          : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-amber-100 dark:hover:bg-amber-900/30"
                      }`}
                    >
                      ₹{amount}
                    </button>
                  ))}
                  <button
                    onClick={() => setIsCustomAmountMode(true)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                      isCustomAmountMode
                        ? "bg-amber-500 text-white"
                        : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-amber-100 dark:hover:bg-amber-900/30"
                    }`}
                  >
                    Custom
                  </button>
                </div>

                {isCustomAmountMode && (
                  <div className="relative">
                    <IndianRupee className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      value={customAmount}
                      onChange={handleAmountChange}
                      placeholder="Enter amount"
                      className="w-full pl-9 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      maxLength={5}
                    />
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                <button
                  onClick={handleUPIClick}
                  disabled={!customAmount || customAmount === "0"}
                  className="flex-1 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed text-white font-medium py-2.5 px-4 rounded-xl text-sm transition-all duration-200 flex items-center justify-center gap-2 shadow-lg"
                >
                  {isMobile ? (
                    <>
                      <IndianRupee className="w-4 h-4" />
                      Pay ₹{customAmount}
                    </>
                  ) : (
                    <>
                      <QrCode className="w-4 h-4" />
                      Show QR ₹{customAmount}
                    </>
                  )}
                </button>
                <button
                  onClick={() => setIsMinimized(true)}
                  className="px-3 py-2.5 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-sm"
                >
                  Later
                </button>
              </div>

              <div className="mt-3 flex items-center justify-center">
                <div className="flex gap-1">
                  {[...Array(3)].map((_, i) => (
                    <div
                      key={i}
                      className={`w-1.5 h-1.5 bg-amber-400 rounded-full animate-pulse`}
                      style={{ animationDelay: `${i * 0.2}s` }}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}