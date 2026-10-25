"use client"

import { motion } from "framer-motion"
import { Check } from "lucide-react"
import type { Mission, MissionStatus } from "@/lib/campaign"
import { cn } from "@/lib/utils"
import { PlatformPill } from "./platform-pill"

export const VERIFY_SECONDS = 3

export function MissionRow({
  mission,
  status,
  isNext,
  onStart,
}: {
  mission: Mission
  status: MissionStatus
  isNext: boolean
  onStart: () => void
}) {
  const hot = status === 1 || (status === 0 && isNext)
  const done = status === 2

  const verb = done ? "Đã theo dõi" : status === 1 ? "Xác nhận" : "Theo dõi"

  return (
    <motion.button
      type="button"
      layout
      onClick={onStart}
      disabled={status !== 0}
      aria-label={`${verb} Mắt Việt trên ${mission.platform}`}
      className={cn("mission-row", hot && "mission-row--hot", done && "mission-row--done")}
      animate={done ? { scale: [1, 1.04, 1] } : { scale: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <StatusDot status={status} hot={hot} />
      <span
        className={cn(
          "min-w-0 flex-1 text-[14px] font-bold leading-tight",
          hot ? "text-white" : done ? "text-navy/55" : "text-navy",
        )}
      >
        {verb}
        {status === 1 && <span className="animate-pulse">…</span>}
      </span>
      <span className="relative shrink-0">
        <PlatformPill id={mission.id} className={cn(done && "saturate-[0.65]")} />
        {done && (
          <motion.span
            initial={{ scale: 0, rotate: -40 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 400, damping: 14 }}
            className="absolute -right-1 -top-1 grid h-6 w-6 place-items-center rounded-full bg-sun text-navy shadow ring-2 ring-paper"
          >
            <Check className="h-3.5 w-3.5" strokeWidth={4} />
          </motion.span>
        )}
      </span>
    </motion.button>
  )
}

function StatusDot({ status, hot }: { status: MissionStatus; hot: boolean }) {
  if (status === 2) {
    return (
      <motion.span
        initial={{ scale: 0.4 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 420, damping: 16 }}
        className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-royal text-white shadow-[0_4px_10px_-3px_rgba(51,82,196,0.8)]"
      >
        <Check className="h-6 w-6" strokeWidth={3.5} />
      </motion.span>
    )
  }

  if (status === 1) {
    return (
      <span className="relative grid h-11 w-11 shrink-0 place-items-center rounded-full bg-white/20">
        <svg viewBox="0 0 44 44" className="absolute inset-0 -rotate-90">
          <circle cx="22" cy="22" r="18" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="4" />
          <motion.circle
            cx="22"
            cy="22"
            r="18"
            fill="none"
            stroke="#fff"
            strokeWidth="4"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: VERIFY_SECONDS, ease: "linear" }}
          />
        </svg>
        <Check className="h-5 w-5 text-white/70" strokeWidth={3.5} />
      </span>
    )
  }

  return (
    <span
      className={cn(
        "grid h-11 w-11 shrink-0 place-items-center rounded-full border-[3px]",
        hot ? "border-white bg-white/15" : "border-royal/35 bg-butter",
      )}
    >
      <Check className={cn("h-5 w-5", hot ? "text-white/60" : "text-royal/25")} strokeWidth={3.5} />
    </span>
  )
}
