"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { CheckCircle, ChevronRight, Award, Zap, Gift, Clock, Tag, Star, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import confetti from "canvas-confetti"
import { ConfettiButton } from "@/components/confetti-button"

// Định nghĩa các loại dữ liệu
interface CustomerData {
  name: string
  phone: string
  email: string
  source: string
}

interface VoucherInfo {
  amount: string
  code: string
  expiry: string
  description: string
}

interface AllVouchersInfo {
  vouchers: VoucherInfo[]
}

export default function MissionPage() {
  // State cho dữ liệu khách hàng
  const [customerData, setCustomerData] = useState<CustomerData>({
    name: "",
    phone: "",
    email: "",
    source: "",
  })

  // State cho các trang và nhiệm vụ
  const [currentPage, setCurrentPage] = useState<"form" | "mission" | "success">("form")
  const [completedMissions, setCompletedMissions] = useState<number>(0)
  const [missionStatus, setMissionStatus] = useState({
    zalo: 0, // 0: chưa bắt đầu, 1: đang làm, 2: hoàn thành
    shopee: 0,
    review: 0,
  })
  const [recentlyCompletedMission, setRecentlyCompletedMission] = useState<string | null>(null)
  const [progressValue, setProgressValue] = useState(0)
  const [showProgressAnimation, setShowProgressAnimation] = useState(false)
  const [isCheckingPhone, setIsCheckingPhone] = useState(false)
  const [showAlreadyCompletedPopup, setShowAlreadyCompletedPopup] = useState(false)
  const [phoneAlreadyExists, setPhoneAlreadyExists] = useState(false)

  // Voucher information based on completed missions (cumulative)
  const getAllVouchersInfo = (): AllVouchersInfo => {
    const vouchers: VoucherInfo[] = []
    
    // Add vouchers cumulatively based on completed missions
    if (completedMissions >= 0) {
      vouchers.push({
        amount: "50.000đ",
        code: "MATVIET50K",
        expiry: "24h kể khi nhận voucher.",
        description: "Áp dụng cho đơn hàng từ 1.000.000đ khi mua kính mắt tại Mắt Việt",
      })
    }
    
    if (completedMissions >= 1) {
      vouchers.push({
        amount: "100.000đ",
        code: "MATVIET100K",
        expiry: "24h kể khi nhận voucher.",
        description: "Áp dụng cho đơn hàng từ 2.000.000đ khi mua kính mắt tại Mắt Việt",
      })
    }
    
    if (completedMissions >= 2) {
      vouchers.push({
        amount: "150.000đ",
        code: "MATVIET150K",
        expiry: "24h kể khi nhận voucher.",
        description: "Áp dụng cho đơn hàng từ 3.000.000đ khi mua kính mắt tại Mắt Việt",
      })
    }
    
    if (completedMissions >= 3) {
      vouchers.push({
        amount: "300.000đ",
        code: "MATVIET300K",
        expiry: "24h kể khi nhận voucher.",
        description: "Áp dụng cho đơn hàng từ 4.000.000đ khi mua kính mắt tại Mắt Việt",
      })
    }
    
    return { vouchers }
  }

  // Keep single voucher function for backward compatibility
  const getVoucherInfo = (): VoucherInfo => {
    const allVouchers = getAllVouchersInfo()
    return allVouchers.vouchers[allVouchers.vouchers.length - 1] || {
      amount: "50.000đ",
      code: "MATVIET50K",
      expiry: "24h kể khi nhận voucher.",
      description: "Áp dụng cho đơn hàng từ 1.000.000đ khi mua kính mắt tại Mắt Việt",
    }
  }

  // Function to check if phone number already exists in Google Sheets
  const checkPhoneInGoogleSheets = async (phoneNumber: string): Promise<boolean> => {
    try {
      // Using the published Google Sheets web URL
      const sheetUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vT93YL10Rs5_31bpVM-2Gw-WtlgVJn-YbLCe31X6BM7XzfOSsSM-TDFM8uw7RoAZldjNkRDmumPvdwj/pubhtml?gid=423231860&single=true"
      
      const response = await fetch(sheetUrl, {
        mode: 'cors',
        headers: {
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        }
      })
      
      if (!response.ok) {
        console.warn('Could not check Google Sheets, proceeding with mission')
        return false
      }
      
      const htmlText = await response.text()
      
      // Parse the HTML table to extract phone numbers and status
      const parser = new DOMParser()
      const doc = parser.parseFromString(htmlText, 'text/html')
      const rows = doc.querySelectorAll('table tr')
      
      // Clean input phone number for comparison
      const cleanInputPhone = phoneNumber.replace(/[\s\-\(\)\+]/g, '')
      
      // Check each row (skip header row)
      for (let i = 1; i < rows.length; i++) {
        const cells = rows[i].querySelectorAll('td')
        if (cells.length >= 6) {
          // Column structure: Dấu thời gian, Họ Và Tên, Số Điện Thoại, Email, Voucher, Status
          const phoneInSheet = cells[2]?.textContent?.trim() || '' // Column C (Số Điện Thoại)
          const status = cells[5]?.textContent?.trim() || '' // Column F (Status)
          
          // Clean phone number from sheet for comparison
          const cleanPhoneInSheet = phoneInSheet.replace(/[\s\-\(\)\+]/g, '')
          
          // Check if phone matches and status is "Sent"
          if (cleanPhoneInSheet === cleanInputPhone && status.toLowerCase() === 'sent') {
            return true // Phone number exists and SMS has been sent
          }
        }
      }
      
      return false
    } catch (error) {
      console.warn('Error checking Google Sheets:', error)
      return false // If there's an error, allow the user to proceed
    }
  }

  // Lấy UTM source từ URL khi trang tải
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const utmContent = urlParams.get("utm_content") || ""
    setCustomerData((prev) => ({ ...prev, source: utmContent }))
  }, [])

  // Cập nhật thanh tiến độ
  useEffect(() => {
    if (completedMissions > 0) {
      setShowProgressAnimation(true)
      const targetValue = (completedMissions / 3) * 100

      // Animate progress bar
      const startValue = progressValue
      const duration = 1000
      const startTime = Date.now()

      const animateProgress = () => {
        const currentTime = Date.now()
        const elapsedTime = currentTime - startTime

        if (elapsedTime < duration) {
          const nextValue = startValue + ((targetValue - startValue) * elapsedTime) / duration
          setProgressValue(nextValue)
          requestAnimationFrame(animateProgress)
        } else {
          setProgressValue(targetValue)
          setTimeout(() => setShowProgressAnimation(false), 500)
        }
      }

      requestAnimationFrame(animateProgress)
    }
  }, [completedMissions])

  // Xử lý form đăng ký
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Check for dev mode bypass
    const urlParams = new URLSearchParams(window.location.search)
    const isDevMode = urlParams.has('dev')
    
    // Check if phone number already exists in Google Sheets (skip in dev mode)
    if (customerData.phone && !isDevMode) {
      setIsCheckingPhone(true)
      const phoneExists = await checkPhoneInGoogleSheets(customerData.phone)
      setIsCheckingPhone(false)
      
      if (phoneExists) {
        setPhoneAlreadyExists(true)
        setShowAlreadyCompletedPopup(true)
        return
      }
    }
    
    setCurrentPage("mission")
  }

  // Xử lý nhiệm vụ Zalo
  const handleZaloClick = () => {
    if (missionStatus.zalo === 0) {
      window.open("https://zalo.me/454595931874476823", "_blank")
      setMissionStatus((prev) => ({ ...prev, zalo: 1 }))
    } else if (missionStatus.zalo === 1) {
      setMissionStatus((prev) => ({ ...prev, zalo: 2 }))
      setCompletedMissions((prev) => Math.min(prev + 1, 3))
      setRecentlyCompletedMission("zalo")
      setTimeout(() => setRecentlyCompletedMission(null), 2000)
    }
  }

  // Xử lý nhiệm vụ Facebook
  const handleFacebookClick = () => {
    if (missionStatus.shopee === 0) {
      window.open("https://www.facebook.com/Matviet.vn/?locale=vi_VN", "_blank")
      setMissionStatus((prev) => ({ ...prev, shopee: 1 }))
    } else if (missionStatus.shopee === 1) {
      setMissionStatus((prev) => ({ ...prev, shopee: 2 }))
      setCompletedMissions((prev) => Math.min(prev + 1, 3))
      setRecentlyCompletedMission("shopee")
      setTimeout(() => setRecentlyCompletedMission(null), 2000)
    }
  }

  // Xử lý nhiệm vụ Google Review
  const handleReviewClick = () => {
    // Danh sách các link Google Review theo mã cửa hàng
    const googleReviewLinks: Record<string, string> = {
      "304": "https://g.page/r/CSli1B6AT816EBM/review",
      "512": "https://g.page/r/CTX5ccIXvBfLEBM/review",
      "227": "https://g.page/r/Cd13ctajeuzIEBM/review",
      "208": "https://g.page/r/CdkKP8K4U1QfEBM/review",
      "107": "https://g.page/r/Cf0QEdFdm8SZEBM/review",
      "106": "https://g.page/r/CZFWvE5qke8XEBM/review",
      "308": "https://g.page/r/Caj3DT5DxcnmEBM/review",
      "116": "https://g.page/r/CdXTUGppiBpAEBM/review",
      "322": "https://g.page/r/CaS0A31ve3UvEBM/review",
      "321": "https://g.page/r/CUvylGWxJksIEBM/review",
      "311": "https://g.page/r/Caf3N09IbE9iEBM/review",
      "218": "https://g.page/r/CeBNKHVV7xPwEBM/review",
      "310": "https://g.page/r/CX-WU4AWD--4EBM/review",
      "309": "https://g.page/r/CXAzQSCLVbxkEBM/review",
      "303": "https://g.page/r/CUWbiiOMDUcmEBM/review",
      "111": "https://g.page/r/CZ4R_UofOLO7EBM/review",
      "105": "https://g.page/r/Ca8mhGxOYsyyEBM/review",
      "302": "https://g.page/r/CTfCUpzTMpbXEBM/review",
      "216": "https://g.page/r/CVPOxSBuPsSzEBM/review",
      "403": "https://g.page/r/CSn0zQA6Nn8qEBM/review",
      "103": "https://g.page/r/CV66nKP3dhCNEBM/review",
      "115": "https://g.page/r/CWP7DIte5URyEBM/review",
      "102": "https://g.page/r/CTehalJSIjDzEBM/review",
      "101": "https://g.page/r/CcRHr-hclnKzEBM/review",
      "307": "https://g.page/r/CR24h43gQ1ZWEBM/review",
      "220": "https://g.page/r/Cb-d5zh36mCxEBM/review",
      "226": "https://g.page/r/CXwdwIjvAb7EEBM/review",
      "114": "https://g.page/r/Cd6VjUvsC96NEBM/review",
      "104": "https://g.page/r/CfPYNTk81GmnEBM/review",
      "228": "https://g.page/r/CVaXwqKV7UzREBM/review",
      "117":"https://g.page/r/CbDbwVIMB2kdEBM/review",
      "305": "https://g.page/r/CYekIWkz4sinEBM/review"
    }

    const reviewLink =
      customerData.source && googleReviewLinks[customerData.source]
        ? googleReviewLinks[customerData.source]
        : "https://maps.google.com/"

    if (missionStatus.review === 0) {
      window.open(reviewLink, "_blank")
      setMissionStatus((prev) => ({ ...prev, review: 1 }))
    } else if (missionStatus.review === 1) {
      setMissionStatus((prev) => ({ ...prev, review: 2 }))
      setCompletedMissions((prev) => Math.min(prev + 1, 3))
      setRecentlyCompletedMission("review")
      setTimeout(() => setRecentlyCompletedMission(null), 2000)
    }
  }

  // Xử lý nhận thưởng
  const handleRewardClick = () => {
    // Tạo chuỗi trạng thái nhiệm vụ
    const missionStatusString = `${customerData.source}-${missionStatus.zalo}-${missionStatus.shopee}-${missionStatus.review}`

    // Gửi dữ liệu đến Google Form
    const formData = new FormData()
    formData.append("entry.1196289321", customerData.name)
    formData.append("entry.444309530", customerData.phone)
    formData.append("entry.235353783", customerData.email)
    formData.append("entry.652305656", missionStatusString)

    fetch("https://docs.google.com/forms/d/e/1FAIpQLSffTfCzoPY1cyP0bs33_COxYP-8tzgvBgnLjcY-QJVndL7AJA/formResponse", {
      method: "POST",
      mode: "no-cors",
      body: formData,
    })

    setCurrentPage("success")
  }

  // Hàm kích hoạt hiệu ứng confetti
  const triggerConfetti = () => {
    const duration = 5 * 1000
    const animationEnd = Date.now() + duration
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 }

    function randomInRange(min: number, max: number) {
      return Math.random() * (max - min) + min
    }

    const interval: NodeJS.Timeout = setInterval(() => {
      const timeLeft = animationEnd - Date.now()

      if (timeLeft <= 0) {
        return clearInterval(interval)
      }

      const particleCount = 50 * (timeLeft / duration)

      // Phóng confetti từ các góc khác nhau với màu sắc Mắt Việt
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
        colors: ["#FFDE59", "#002169", "#ffffff"],
      })
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        colors: ["#FFDE59", "#002169", "#ffffff"],
      })
    }, 250)
  }

  // Hiển thị trang đăng ký
  if (currentPage === "form") {
    return (
      <div className="min-h-screen gradient-bg flex flex-col items-center justify-center p-4">
        {/* Enhanced Banner */}
        <motion.div 
          className="w-full max-w-md mb-6"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="relative">
            <img
              src="/banner.png"
              alt="Mắt Việt Banner"
              className="w-full h-auto rounded-2xl shadow-2xl"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl"></div>
          </div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="w-full max-w-md"
        >
          <div className="glass-card p-8 rounded-2xl shadow-2xl animate-slide-in-up">
            <motion.div 
              className="text-center mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <div className="relative inline-block">
                <h1 className="text-2xl font-bold text-[#002169] mb-2">🎯 Bắt đầu nhiệm vụ</h1>
                <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-[#FFDE59] to-[#FFD700] rounded-full"></div>
              </div>
              <p className="text-gray-600 mt-4">Điền đầy đủ thông tin trước khi thực hiện nhiệm vụ của Mắt Việt nha.</p>
            </motion.div>

            <form onSubmit={handleFormSubmit} className="space-y-6">
              <motion.div 
                className="space-y-3"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
              >
                <Label htmlFor="name" className="text-[#002169] font-semibold flex items-center">
                  👤 Họ tên
                </Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Nhập họ tên của bạn"
                  required
                  className="border-2 border-gray-200 focus:border-[#FFDE59] focus:ring-2 focus:ring-[#FFDE59]/20 rounded-xl h-12 px-4 transition-all duration-300 hover:border-[#FFDE59]/50"
                  value={customerData.name}
                  onChange={(e) => setCustomerData({ ...customerData, name: e.target.value })}
                />
              </motion.div>

              <motion.div 
                className="space-y-3"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
              >
                <Label htmlFor="phone" className="text-[#002169] font-semibold flex items-center">
                  📱 Số điện thoại
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="Nhập số điện thoại"
                  required
                  className="border-2 border-gray-200 focus:border-[#FFDE59] focus:ring-2 focus:ring-[#FFDE59]/20 rounded-xl h-12 px-4 transition-all duration-300 hover:border-[#FFDE59]/50"
                  value={customerData.phone}
                  onChange={(e) => setCustomerData({ ...customerData, phone: e.target.value })}
                />
              </motion.div>

              <motion.div 
                className="space-y-3"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 }}
              >
                <Label htmlFor="email" className="text-[#002169] font-semibold flex items-center">
                  ✉️ Email <span className="text-gray-400 text-sm ml-2">(tùy chọn)</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Nhập email (không bắt buộc)"
                  className="border-2 border-gray-200 focus:border-[#FFDE59] focus:ring-2 focus:ring-[#FFDE59]/20 rounded-xl h-12 px-4 transition-all duration-300 hover:border-[#FFDE59]/50"
                  value={customerData.email}
                  onChange={(e) => setCustomerData({ ...customerData, email: e.target.value })}
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
              >
                <Button 
                  type="submit" 
                  disabled={isCheckingPhone}
                  className="w-full reward-button text-[#002169] font-bold h-14 text-lg rounded-xl shadow-lg transition-all duration-300"
                >
                  {isCheckingPhone ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#002169] mr-2"></div>
                      Đang kiểm tra...
                    </div>
                  ) : (
                    <div className="flex items-center justify-center">
                      🚀 Bắt đầu nhiệm vụ
                      <ChevronRight className="ml-2 h-5 w-5" />
                    </div>
                  )}
                </Button>
              </motion.div>
            </form>
          </div>
        </motion.div>

        {/* Dialog for already completed mission */}
        <Dialog open={showAlreadyCompletedPopup} onOpenChange={setShowAlreadyCompletedPopup}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-[#002169]">Thông báo</DialogTitle>
            </DialogHeader>
            <div className="text-center py-4">
              <div className="mb-4">
                <img
                  src="/logo.png"
                  alt="Mắt Việt Logo"
                  className="h-8 mx-auto mb-2"
                />
              </div>
              <DialogDescription>
                Số điện thoại này đã tham gia và nhận thưởng từ chương trình trước đó. 
                Mỗi số điện thoại chỉ có thể tham gia một lần duy nhất.
              </DialogDescription>
              <br />
              <strong className="text-[#002169]">Cảm ơn bạn đã ủng hộ Mắt Việt!</strong>
            </div>
            <div className="flex justify-center">
              <Button 
                onClick={() => setShowAlreadyCompletedPopup(false)}
                className="bg-[#FFDE59] hover:bg-[#FFD700] text-[#002169] font-bold"
              >
                Đã hiểu
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    )
  }

  // Hiển thị trang nhiệm vụ
  if (currentPage === "mission") {
    return (
      <div className="min-h-screen gradient-bg flex flex-col items-center p-4 pt-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="w-full max-w-md"
        >
          <div className="glass-card p-8 rounded-2xl shadow-2xl">
            {/* Enhanced Logo */}
            <motion.div 
              className="flex justify-center mb-6"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6 }}
            >
              <div className="relative">
                <img
                  src="/logo.png"
                  alt="Mắt Việt Logo"
                  className="h-12 animate-float"
                />
                <div className="absolute -inset-3 bg-gradient-to-r from-[#FFDE59]/20 to-[#FFD700]/20 rounded-full blur-xl"></div>
              </div>
            </motion.div>

            {/* Enhanced Progress Header */}
            <motion.div 
              className="text-center mb-8"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="relative inline-block mb-4">
                <h2 className="text-2xl font-bold text-[#002169] mb-1">
                  🏆 Tiến độ nhiệm vụ
                </h2>
                <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-[#FFDE59] to-[#FFD700] rounded-full"></div>
              </div>
              
              <div className="flex items-center justify-center space-x-2 mb-4">
                <motion.span
                  key={completedMissions}
                  initial={{ scale: 1.3, color: "#FFDE59" }}
                  animate={{ scale: 1, color: "#002169" }}
                  transition={{ duration: 0.5 }}
                  className="text-3xl font-bold"
                  style={{ textShadow: "0 0 10px rgba(255, 222, 89, 0.3)" }}
                >
                  {completedMissions}
                </motion.span>
                <span className="text-xl text-gray-400">/</span>
                <span className="text-xl font-semibold text-gray-600">3</span>
                <span className="text-sm text-gray-500 ml-2">nhiệm vụ</span>
              </div>

              {/* Enhanced Progress Bar */}
              <div className="relative h-4 bg-gray-200 rounded-full overflow-hidden shadow-inner">
                <motion.div
                  className={`h-full bg-gradient-to-r from-[#FFDE59] via-[#FFD700] to-[#FFC107] rounded-full relative ${showProgressAnimation ? "shine-effect" : ""}`}
                  style={{ width: `${progressValue}%` }}
                  initial={{ width: "0%" }}
                  animate={{ width: `${progressValue}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-white/20 rounded-full"></div>
                </motion.div>
                <div className="absolute inset-0 bg-gradient-to-t from-white/20 to-transparent rounded-full"></div>
              </div>
              
              <div className="text-sm text-gray-500 mt-2">
                {completedMissions === 0 && "Bắt đầu thực hiện nhiệm vụ đầu tiên! 🚀"}
                {completedMissions === 1 && "Tuyệt vời! Tiếp tục thực hiện 2 nhiệm vụ còn lại! 💪"}
                {completedMissions === 2 && "Sắp hoàn thành rồi! Chỉ còn 1 nhiệm vụ cuối! 🔥"}
                {completedMissions === 3 && "Hoàn thành xuất sắc! Nhận thưởng ngay! 🎉"}
              </div>
            </motion.div>

            {/* Enhanced Reward Progress */}
            <motion.div 
              className="mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <div className="text-center mb-4">
                <h3 className="font-bold text-[#002169] text-lg mb-1">🎁 Phần thưởng</h3>
                <p className="text-sm text-gray-600">Hoàn thành nhiệm vụ để mở khóa voucher</p>
              </div>
              
              <div className="flex justify-between items-center relative px-2">
                {/* Enhanced connection line */}
                <div className="absolute left-6 right-6 top-6 h-2 bg-gray-200 rounded-full"></div>
                <motion.div 
                  className="absolute left-6 top-6 h-2 bg-gradient-to-r from-[#FFDE59] to-[#FFD700] rounded-full"
                  initial={{ width: "0%" }}
                  animate={{ width: `${Math.max(0, (completedMissions - 0) / 3 * 100)}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  style={{ right: `${100 - Math.max(0, (completedMissions) / 3 * 100)}%` }}
                />

                {/* Enhanced reward circles */}
                {[
                  { missions: 0, amount: "50k", color: "from-blue-400 to-blue-600" },
                  { missions: 1, amount: "100k", color: "from-purple-400 to-purple-600" },
                  { missions: 2, amount: "150k", color: "from-pink-400 to-pink-600" },
                  { missions: 3, amount: "300k", color: "from-yellow-400 to-orange-500" }
                ].map((reward, index) => (
                  <motion.div 
                    key={index}
                    className="relative flex flex-col items-center z-10"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                  >
                    <motion.div
                      className={`w-12 h-12 rounded-full flex items-center justify-center border-3 shadow-lg progress-circle ${
                        completedMissions >= reward.missions 
                          ? `bg-gradient-to-br ${reward.color} text-white border-white animate-glow` 
                          : "bg-gray-200 text-gray-400 border-gray-300"
                      }`}
                      whileHover={{ scale: 1.1 }}
                      animate={completedMissions >= reward.missions ? { 
                        boxShadow: ["0 0 0 0 rgba(255, 222, 89, 0.7)", "0 0 0 10px rgba(255, 222, 89, 0)"] 
                      } : {}}
                      transition={{ duration: 1.5, repeat: completedMissions >= reward.missions ? Infinity : 0 }}
                    >
                      {completedMissions >= reward.missions ? (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: "spring", stiffness: 500, damping: 10 }}
                        >
                          <CheckCircle className="h-6 w-6" />
                        </motion.div>
                      ) : (
                        <span className="text-sm font-bold">{index + 1}</span>
                      )}
                    </motion.div>
                    <motion.div 
                      className="text-center mt-2"
                      animate={completedMissions >= reward.missions ? { scale: [1, 1.1, 1] } : {}}
                      transition={{ duration: 0.5 }}
                    >
                      <div className={`text-sm font-bold ${
                        completedMissions >= reward.missions ? "text-[#002169]" : "text-gray-500"
                      }`}>
                        {reward.amount}
                      </div>
                      {completedMissions >= reward.missions && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="text-xs text-green-600 font-semibold"
                        >
                          ✓ Mở khóa
                        </motion.div>
                      )}
                    </motion.div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Hộp phần thưởng đặc biệt - Hidden as requested */}
            {/* <motion.div
              className={`p-4 rounded-lg text-center mb-6 font-medium ${
                completedMissions >= 3
                  ? "bg-[#FFDE59] text-[#002169] border-2 border-[#002169]"
                  : "bg-gray-100 text-gray-700 border border-gray-200"
              }`}
              animate={{
                scale: completedMissions >= 3 ? [1, 1.05, 1] : 1,
                boxShadow:
                  completedMissions >= 3
                    ? ["0 0 0 rgba(255, 222, 89, 0)", "0 0 20px rgba(255, 222, 89, 0.7)", "0 0 0 rgba(255, 222, 89, 0)"]
                    : "none",
              }}
              transition={{
                duration: 1.5,
                repeat: completedMissions >= 3 ? Number.POSITIVE_INFINITY : 0,
                repeatType: "reverse",
              }}
            >
              <div className="flex items-center justify-center">
                <img src="/bonus.png" alt="Bonus" className="w-12 h-12 mr-2" />
                <span className="font-bold">Nhận thêm Bộ nước rửa kính khi hoàn thành tất cả nhiệm vụ</span>
              </div>
            </motion.div> */}

            {/* Enhanced Mission List */}
            <motion.div 
              className="space-y-6 mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <div className="text-center mb-6">
                <h3 className="font-bold text-[#002169] text-lg mb-1">📋 Danh sách nhiệm vụ</h3>
                <p className="text-sm text-gray-600">Hoàn thành tất cả để nhận voucher cao nhất</p>
              </div>

              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 }}
              >
                <MissionCard
                  title="Theo dõi Zalo Mắt Việt"
                  status={missionStatus.zalo}
                  onClick={handleZaloClick}
                  isRecentlyCompleted={recentlyCompletedMission === "zalo"}
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 }}
              >
                <MissionCard
                  title="Theo dõi Facebook Mắt Việt"
                  status={missionStatus.shopee}
                  onClick={handleFacebookClick}
                  isRecentlyCompleted={recentlyCompletedMission === "shopee"}
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.9 }}
              >
                <MissionCard
                  title="Review Google cho Mắt Việt"
                  status={missionStatus.review}
                  onClick={handleReviewClick}
                  isRecentlyCompleted={recentlyCompletedMission === "review"}
                />
              </motion.div>
            </motion.div>

            {/* Enhanced Reward Button */}
            {completedMissions > 0 && (
              <motion.div 
                initial={{ opacity: 0, y: 20, scale: 0.9 }} 
                animate={{ opacity: 1, y: 0, scale: 1 }} 
                transition={{ delay: 1, type: "spring", stiffness: 300, damping: 20 }}
                className="relative"
              >
                {completedMissions === 3 ? (
                  <div className="relative">
                    <div className="absolute -inset-1 bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500 rounded-2xl blur opacity-75 animate-pulse"></div>
                    <ConfettiButton
                      onClick={handleRewardClick}
                      className="relative w-full reward-button text-[#002169] font-bold py-6 text-xl rounded-2xl shadow-2xl transform hover:scale-105 transition-all duration-300"
                    >
                      <div className="flex items-center justify-center space-x-2">
                        <span className="text-2xl animate-bounce">🎉</span>
                        <span>Nhận thưởng ngay!</span>
                        <span className="text-2xl animate-bounce">🎁</span>
                      </div>
                    </ConfettiButton>
                  </div>
                ) : (
                  <Button
                    onClick={handleRewardClick}
                    className="w-full reward-button text-[#002169] font-bold py-5 text-lg rounded-2xl shadow-xl transform hover:scale-105 transition-all duration-300"
                  >
                    <div className="flex items-center justify-center space-x-2">
                      <span className="text-xl">🎁</span>
                      <span>Nhận thưởng ({completedMissions}/3)</span>
                    </div>
                  </Button>
                )}
                
                {/* Floating particles effect for completed state */}
                {completedMissions === 3 && (
                  <div className="absolute inset-0 pointer-events-none">
                    {[...Array(6)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute w-2 h-2 bg-yellow-400 rounded-full"
                        style={{
                          left: `${20 + i * 12}%`,
                          top: "50%",
                        }}
                        animate={{
                          y: [-10, -30, -10],
                          opacity: [0, 1, 0],
                          scale: [0, 1, 0],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          delay: i * 0.2,
                        }}
                      />
                    ))}
                  </div>
                )}
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    )
  }

  // Hiển thị trang thành công
  return (
    <div className="min-h-screen bg-[#002169] flex flex-col items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md text-center"
        onAnimationComplete={() => {
          if (currentPage === "success" && completedMissions === 3) {
            triggerConfetti()
          }
        }}
      >
        <Card className="p-8 shadow-lg border-0 bg-white">
          <motion.div
            initial={{ scale: 0.2, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{
              type: "spring",
              stiffness: 260,
              damping: 20,
              delay: 0.2,
            }}
            className="mb-6"
          >
            <img
              src="/logo.png"
              alt="Mắt Việt Logo"
              className="h-10 mx-auto mb-4"
            />

            <h1 className="text-2xl font-bold text-[#002169] mb-4">Chúc mừng bạn!</h1>

            <div className="relative w-32 h-32 mx-auto">
              <motion.div
                className="absolute inset-0 flex items-center justify-center"
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
              >
                <div className="w-full h-full rounded-full border-4 border-dashed border-[#FFDE59] opacity-70"></div>
              </motion.div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-[#FFDE59] bg-white">
                  <img
                    src="/mascot.png"
                    alt="Mắt Việt Mascot"
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>
            </div>
          </motion.div>

          <p className="text-gray-600 mb-6">
            Bạn đã hoàn thành nhiệm vụ và nhận được phần thưởng. Cảm ơn bạn đã tham gia cùng Mắt Việt!
          </p>

          {/* Voucher section - All earned vouchers */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mb-6"
          >
            <div className="mb-4">
              <h3 className="font-bold text-[#002169] mb-3 text-center">Các voucher bạn đã nhận được</h3>
            </div>
            
            {getAllVouchersInfo().vouchers.map((voucher, index) => (
              <motion.div
                key={voucher.code}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 + index * 0.2 }}
                className="voucher mb-3 border-2 border-[#002169]"
              >
                <div className="voucher-dash"></div>
                <div className="voucher-content">
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center">
                      <Gift className="h-5 w-5 text-[#002169] mr-2" />
                      <h4 className="font-bold text-[#002169]">Voucher Mắt Việt</h4>
                    </div>
                    <div className="px-2 py-1 bg-[#FFDE59] rounded text-xs font-bold text-[#002169]">
                      {voucher.amount}
                    </div>
                  </div>

                  <div className="flex items-center text-sm text-gray-600 mb-2">
                    <Clock className="h-4 w-4 mr-1" />
                    <span>Hạn sử dụng: {voucher.expiry}</span>
                  </div>



                  <div className="text-xs text-gray-500 mt-2 border-t pt-2">{voucher.description}</div>
                </div>
              </motion.div>
            ))}
            
            <div className="text-center text-sm text-gray-600 mt-4 p-4 bg-gradient-to-r from-blue-50 to-yellow-50 rounded-lg border border-[#FFDE59]">
              <div className="mb-2">
                <strong className="text-[#002169]">🎉 Chúc mừng! Bạn nhận được tất cả các voucher trên!</strong>
              </div>
              <div className="text-xs text-gray-600 space-y-1">
                <p>• <strong>Một mã voucher duy nhất</strong> sẽ được gửi qua SMS đến số điện thoại của bạn</p>
                <p>• Bạn có thể <strong>sử dụng mã này cho bất kỳ voucher nào</strong> trong danh sách trên</p>
                <p>• <strong>Chỉ được sử dụng một voucher</strong> cho mỗi lần mua hàng</p>
              </div>
            </div>

            {/* Special bonus reward hidden as requested */}
            {/* {completedMissions === 3 && (
              <motion.div
                className="voucher border-2 border-[#FFDE59]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
              >
                <div className="voucher-dash"></div>
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center">
                    <Star className="h-5 w-5 text-[#FFDE59] mr-2" />
                    <h3 className="font-bold text-[#002169]">Phần thưởng đặc biệt</h3>
                  </div>
                </div>

                <div className="flex items-center mb-2">
                  <Check className="h-4 w-4 text-[#FFDE59] mr-1" />
                  <span className="text-sm">Bộ nước rửa kính Mắt Việt</span>
                </div>

                <div className="text-xs text-gray-500 mt-2 border-t pt-2">
                  Quý khách vui lòng đến cửa hàng Mắt Việt gần nhất để nhận phần thưởng đặc biệt
                </div>
              </motion.div>
            )} */}
          </motion.div>

          <div className="flex flex-col space-y-3">
            <Button
              onClick={() => (window.location.href = "https://matviet.vn")}
              className="bg-[#FFDE59] hover:bg-[#FFD700] text-[#002169] font-bold"
            >
              Khám phá sản phẩm Mắt Việt
            </Button>

            <Button
              variant="outline"
              onClick={() => (window.location.href = "https://matviet.vn/pages/he-thong-cua-hang")}
              className="border-[#002169] text-[#002169] hover:bg-[#002169] hover:text-white"
            >
              Tìm cửa hàng gần nhất
            </Button>
          </div>
        </Card>
      </motion.div>
    </div>
  )
}

// Component thẻ nhiệm vụ
interface MissionCardProps {
  title: string
  status: number // 0: chưa bắt đầu, 1: đang làm, 2: hoàn thành
  onClick: () => void
  isRecentlyCompleted?: boolean
}

function MissionCard({ title, status, onClick, isRecentlyCompleted = false }: MissionCardProps) {
  // Xác định nội dung nút dựa trên trạng thái
  let buttonText = "🚀 Làm ngay"
  let buttonClass = "bg-[#002169] hover:bg-[#003399] text-white font-semibold px-6 py-2 rounded-xl transition-all duration-300 hover:shadow-lg"
  const [isLoading, setIsLoading] = useState(false)

  // Auto-click timer for "Kiểm tra" button
  useEffect(() => {
    let timer: NodeJS.Timeout
    if (status === 1) { // When status is "Kiểm tra"
      timer = setTimeout(() => {
        onClick()
      }, 3000)
    }
    return () => {
      if (timer) clearTimeout(timer)
    }
  }, [status, onClick])

  // Mission icons based on title
  const getMissionIcon = () => {
    if (title.includes("Zalo")) return "💬"
    if (title.includes("Facebook")) return "👥"
    if (title.includes("Review") || title.includes("Google")) return "⭐"
    return "🎯"
  }

  if (status === 1) {
    buttonText = "🔍 Kiểm tra"
    buttonClass = "reward-button text-[#002169] font-bold px-6 py-2 rounded-xl"
  } else if (status === 2) {
    buttonText = "✅ Hoàn thành"
    buttonClass = "bg-gradient-to-r from-green-100 to-green-200 text-green-800 cursor-default border-2 border-green-300 font-bold px-6 py-2 rounded-xl"
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{
        opacity: 1,
        y: 0,
        scale: isRecentlyCompleted ? [1, 1.02, 1] : 1,
      }}
      transition={{
        duration: 0.4,
        ease: "easeOut",
        repeat: isRecentlyCompleted ? 2 : 0,
      }}
      className={`mission-card p-6 rounded-2xl shadow-lg ${
        status === 2 ? "mission-card-completed sparkle-effect" : ""
      } ${isRecentlyCompleted ? "animate-bounce-in" : ""}`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className={`text-3xl ${status === 2 ? "animate-bounce" : ""}`}>
            {getMissionIcon()}
          </div>
          <div>
            <h3 className={`font-bold text-lg ${status === 2 ? "text-[#002169]" : "text-gray-800"}`}>
              {title}
            </h3>
            <div className="flex items-center mt-1">
              {status === 0 && (
                <span className="text-sm text-gray-500 flex items-center">
                  <div className="w-2 h-2 bg-gray-400 rounded-full mr-2"></div>
                  Chưa bắt đầu
                </span>
              )}
              {status === 1 && (
                <span className="text-sm text-orange-600 flex items-center">
                  <div className="w-2 h-2 bg-orange-400 rounded-full mr-2 animate-pulse"></div>
                  Đang kiểm tra...
                </span>
              )}
              {status === 2 && (
                <motion.span 
                  className="text-sm text-green-600 flex items-center font-semibold"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                  Đã hoàn thành
                </motion.span>
              )}
            </div>
          </div>
        </div>
        
        <motion.div
          whileHover={{ scale: status < 2 ? 1.05 : 1 }}
          whileTap={{ scale: status < 2 ? 0.95 : 1 }}
        >
          <Button 
            onClick={status < 2 ? onClick : undefined} 
            className={buttonClass} 
            disabled={status === 2 || isLoading}
          >
            {buttonText}
          </Button>
        </motion.div>
      </div>
      
      {/* Progress indicator */}
      <div className="mt-4">
        <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
          <motion.div
            className={`h-full rounded-full ${
              status === 0 ? "bg-gray-300" : 
              status === 1 ? "bg-orange-400" : 
              "bg-green-500"
            }`}
            initial={{ width: "0%" }}
            animate={{ 
              width: status === 0 ? "0%" : status === 1 ? "50%" : "100%" 
            }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
        </div>
      </div>
    </motion.div>
  )
}
