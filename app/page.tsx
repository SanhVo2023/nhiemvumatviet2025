"use client"

import { useEffect, useRef, useState } from "react"
import { AnimatePresence, MotionConfig, motion } from "framer-motion"
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog"
import { Backdrop } from "@/components/mission/backdrop"
import { FormScreen, type CustomerFields } from "@/components/mission/form-screen"
import { MissionScreen } from "@/components/mission/mission-screen"
import { VERIFY_SECONDS } from "@/components/mission/mission-row"
import { SuccessScreen } from "@/components/mission/success-screen"
import { MISSIONS, STORES, givenName, normalizePhone, type MissionId, type MissionStatus } from "@/lib/campaign"

type Screen = "form" | "mission" | "success"
type Statuses = Record<MissionId, MissionStatus>

interface SavedState {
  customer: CustomerFields
  statuses: Statuses
  screen: Screen
}

// Giữ tiến độ khi trình duyệt tải lại trang sau lúc mở Instagram/Facebook/Zalo
const STORAGE_KEY = "matviet-mission-2026"

const EMPTY_STATUSES: Statuses = { instagram: 0, facebook: 0, zaloMiniApp: 0 }

// Màn hình "lấy nét" khi chuyển trang
const focusPull = {
  initial: { opacity: 0, filter: "blur(12px)", scale: 1.04 },
  animate: { opacity: 1, filter: "blur(0px)", scale: 1, transitionEnd: { filter: "none" } },
  exit: { opacity: 0, filter: "blur(12px)", scale: 0.97 },
}

export default function MissionPage() {
  const [customer, setCustomer] = useState<CustomerFields>({ name: "", phone: "", email: "" })
  const [source, setSource] = useState("")
  const [screen, setScreen] = useState<Screen>("form")
  const [statuses, setStatuses] = useState<Statuses>(EMPTY_STATUSES)
  const [restored, setRestored] = useState(false)
  const [isCheckingPhone, setIsCheckingPhone] = useState(false)
  const [showAlreadyCompletedPopup, setShowAlreadyCompletedPopup] = useState(false)
  const timers = useRef<Partial<Record<MissionId, number>>>({})

  const completed = MISSIONS.filter((m) => statuses[m.id] === 2).length
  const storeName = STORES[source]

  // Lấy UTM source từ URL và khôi phục tiến độ đã lưu
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    setSource(urlParams.get("utm_content") || "")
    try {
      const saved = JSON.parse(sessionStorage.getItem(STORAGE_KEY) || "null") as SavedState | null
      if (saved?.customer && saved.statuses) {
        setCustomer(saved.customer)
        setStatuses({ ...EMPTY_STATUSES, ...saved.statuses })
        setScreen(saved.screen)
      }
    } catch {
      // Không đọc được sessionStorage (chế độ ẩn danh...): bắt đầu lại từ đầu
    }
    setRestored(true)
  }, [])

  useEffect(() => {
    if (!restored) return
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ customer, statuses, screen } satisfies SavedState))
    } catch {
      // Bỏ qua nếu trình duyệt chặn lưu trữ
    }
  }, [customer, statuses, screen, restored])

  // Nhiệm vụ đang xác nhận tự hoàn thành sau VERIFY_SECONDS
  useEffect(() => {
    for (const m of MISSIONS) {
      if (statuses[m.id] === 1 && !timers.current[m.id]) {
        timers.current[m.id] = window.setTimeout(() => {
          delete timers.current[m.id]
          setStatuses((prev) => (prev[m.id] === 1 ? { ...prev, [m.id]: 2 } : prev))
        }, VERIFY_SECONDS * 1000)
      }
    }
  }, [statuses])

  useEffect(() => {
    const pending = timers.current
    return () => {
      Object.values(pending).forEach((t) => clearTimeout(t))
      timers.current = {}
    }
  }, [])

  useEffect(() => {
    window.scrollTo({ top: 0 })
  }, [screen])

  // Function to check if phone number already exists in Google Sheets
  const checkPhoneInGoogleSheets = async (phoneNumber: string): Promise<boolean> => {
    try {
      // Using the published Google Sheets web URL
      const sheetUrl =
        "https://docs.google.com/spreadsheets/d/e/2PACX-1vT93YL10Rs5_31bpVM-2Gw-WtlgVJn-YbLCe31X6BM7XzfOSsSM-TDFM8uw7RoAZldjNkRDmumPvdwj/pubhtml?gid=423231860&single=true"

      const response = await fetch(sheetUrl, {
        mode: "cors",
        headers: {
          Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        },
      })

      if (!response.ok) {
        console.warn("Could not check Google Sheets, proceeding with mission")
        return false
      }

      const htmlText = await response.text()

      // Parse the HTML table to extract phone numbers and status
      const parser = new DOMParser()
      const doc = parser.parseFromString(htmlText, "text/html")
      const rows = doc.querySelectorAll("table tr")

      // Clean input phone number for comparison
      const cleanInputPhone = phoneNumber.replace(/[\s\-\(\)\+]/g, "")

      // Check each row (skip header row)
      for (let i = 1; i < rows.length; i++) {
        const cells = rows[i].querySelectorAll("td")
        if (cells.length >= 6) {
          // Column structure: Dấu thời gian, Họ Và Tên, Số Điện Thoại, Email, Voucher, Status
          const phoneInSheet = cells[2]?.textContent?.trim() || ""
          const status = cells[5]?.textContent?.trim() || ""

          const cleanPhoneInSheet = phoneInSheet.replace(/[\s\-\(\)\+]/g, "")

          // Check if phone matches and status is "Sent"
          if (cleanPhoneInSheet === cleanInputPhone && status.toLowerCase() === "sent") {
            return true
          }
        }
      }

      return false
    } catch (error) {
      console.warn("Error checking Google Sheets:", error)
      return false // If there's an error, allow the user to proceed
    }
  }

  // Xử lý form đăng ký
  const handleFormSubmit = async () => {
    // Check for dev mode bypass
    const isDevMode = new URLSearchParams(window.location.search).has("dev")

    if (!isDevMode) {
      setIsCheckingPhone(true)
      const phoneExists = await checkPhoneInGoogleSheets(customer.phone)
      setIsCheckingPhone(false)

      if (phoneExists) {
        setShowAlreadyCompletedPopup(true)
        return
      }
    }

    setScreen("mission")
  }

  const handleStartMission = (id: MissionId) => {
    if (statuses[id] !== 0) return
    const mission = MISSIONS.find((m) => m.id === id)
    if (mission) window.open(mission.url, "_blank", "noopener")
    setStatuses((prev) => ({ ...prev, [id]: 1 }))
  }

  // Xử lý nhận thưởng
  const handleRewardClick = () => {
    // Chuỗi trạng thái giữ nguyên 3 vị trí như bản trước để bảng tính không phải đổi:
    // vị trí Zalo → Zalo Mini App, Facebook → Facebook, Google Review → Instagram
    const missionStatusString = `${source}-${statuses.zaloMiniApp}-${statuses.facebook}-${statuses.instagram}`

    // Gửi dữ liệu đến Google Form
    const formData = new FormData()
    formData.append("entry.1196289321", customer.name.trim())
    formData.append("entry.444309530", normalizePhone(customer.phone))
    formData.append("entry.235353783", customer.email.trim())
    formData.append("entry.652305656", missionStatusString)

    fetch("https://docs.google.com/forms/d/e/1FAIpQLSffTfCzoPY1cyP0bs33_COxYP-8tzgvBgnLjcY-QJVndL7AJA/formResponse", {
      method: "POST",
      mode: "no-cors",
      body: formData,
    })

    setScreen("success")
  }

  return (
    <MotionConfig reducedMotion="user">
      <Backdrop />
      <AnimatePresence mode="wait">
        <motion.main
          key={screen}
          variants={focusPull}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ duration: 0.5, ease: [0.2, 0.8, 0.2, 1] }}
          className={`relative z-10 mx-auto w-full max-w-[440px] px-4 ${screen === "mission" ? "pb-36" : "pb-10"}`}
        >
          {screen === "form" && (
            <FormScreen
              fields={customer}
              storeName={storeName}
              checking={isCheckingPhone}
              onChange={setCustomer}
              onSubmit={handleFormSubmit}
            />
          )}
          {screen === "mission" && (
            <MissionScreen
              name={givenName(customer.name)}
              storeName={storeName}
              statuses={statuses}
              onStart={handleStartMission}
              onClaim={handleRewardClick}
            />
          )}
          {screen === "success" && (
            <SuccessScreen
              name={givenName(customer.name)}
              phone={customer.phone}
              storeName={storeName}
              completed={completed}
            />
          )}
        </motion.main>
      </AnimatePresence>

      {/* Dialog for already completed mission */}
      <Dialog open={showAlreadyCompletedPopup} onOpenChange={setShowAlreadyCompletedPopup}>
        <DialogContent className="w-[calc(100%-32px)] max-w-[400px] gap-0 rounded-[28px] border-0 bg-paper px-6 pb-6 pt-16 text-center sm:rounded-[28px]">
          <img src="/penguin.png" alt="" className="absolute -top-16 left-1/2 w-24 -translate-x-1/2 drop-shadow-lg" />
          <DialogTitle className="text-[21px] font-extrabold leading-tight text-navy">
            Số này đã nhận voucher rồi
          </DialogTitle>
          <DialogDescription className="mt-2 text-[14px] font-medium leading-snug text-navy/70">
            Mỗi số điện thoại chỉ tham gia chương trình một lần. Cảm ơn bạn đã ủng hộ Mắt Việt!
          </DialogDescription>
          <button type="button" className="btn-royal mt-6 w-full" onClick={() => setShowAlreadyCompletedPopup(false)}>
            Đã hiểu
          </button>
        </DialogContent>
      </Dialog>
    </MotionConfig>
  )
}
