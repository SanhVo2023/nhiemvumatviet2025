"use client"

import { AnimatePresence, motion } from "framer-motion"
import { TIERS, tierFor } from "@/lib/campaign"

// Ống kính đo voucher: vạch chia in trên vành như ống kính máy ảnh,
// mỗi nhiệm vụ xoay vòng lấy nét và giá trị voucher hiện rõ dần.

const C = 140
const START = 135 // góc bắt đầu (độ, SVG: 0° = 3 giờ, chiều kim đồng hồ)
const SWEEP = 270
const R_KNURL_IN = 121
const R_KNURL_OUT = 128
const R_ARC = 114
const R_TICK_OUT = 108
const R_LABEL = 92
const R_RIM = 80
const R_GLASS = 76.5

const rad = (deg: number) => (deg * Math.PI) / 180
const pt = (r: number, deg: number) => [C + r * Math.cos(rad(deg)), C + r * Math.sin(rad(deg))] as const

function arcPath(r: number, from: number, to: number) {
  const [x1, y1] = pt(r, from)
  const [x2, y2] = pt(r, to)
  const large = to - from > 180 ? 1 : 0
  return `M ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2}`
}

export function FocusLens({ completed, total = 3 }: { completed: number; total?: number }) {
  const progress = completed / total
  const angleNow = START + SWEEP * progress
  const tier = tierFor(completed)
  const fog = (total - completed) / total

  const ticks = Array.from({ length: 31 }, (_, i) => START + (SWEEP / 30) * i)
  const knurls = Array.from({ length: 96 }, (_, i) => (360 / 96) * i)

  return (
    <div className="relative mx-auto aspect-square w-[min(68vw,264px)]">
      <svg viewBox="0 0 280 280" className="absolute inset-0 h-full w-full overflow-visible" aria-hidden>
        <defs>
          <linearGradient id="lens-barrel" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#2A47B8" />
            <stop offset="0.55" stopColor="#14287E" />
            <stop offset="1" stopColor="#0A1648" />
          </linearGradient>
          <radialGradient id="lens-glass" cx="0.38" cy="0.32" r="0.8">
            <stop offset="0" stopColor="#FFFFFF" />
            <stop offset="0.55" stopColor="#FFF8DD" />
            <stop offset="0.85" stopColor="#E9EEFF" />
            <stop offset="1" stopColor="#C9D5FF" />
          </radialGradient>
          <linearGradient id="lens-rim" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#FFF0A0" />
            <stop offset="0.45" stopColor="#FFD43B" />
            <stop offset="1" stopColor="#E89A00" />
          </linearGradient>
        </defs>

        {/* Thân ống kính */}
        <circle cx={C} cy={C} r={131} fill="#0A1648" />
        <circle cx={C} cy={C} r={129} fill="url(#lens-barrel)" />

        {/* Vân nhám vành xoay */}
        {knurls.map((a) => {
          const [x1, y1] = pt(R_KNURL_IN, a)
          const [x2, y2] = pt(R_KNURL_OUT, a)
          return <line key={a} x1={x1} y1={y1} x2={x2} y2={y2} stroke="rgba(255,255,255,0.16)" strokeWidth="1.6" />
        })}

        {/* Rãnh tiến độ */}
        <path d={arcPath(R_ARC, START, START + SWEEP)} stroke="rgba(255,255,255,0.12)" strokeWidth="5" strokeLinecap="round" fill="none" />
        <motion.path
          d={arcPath(R_ARC, START, START + SWEEP)}
          stroke="#FFD43B"
          strokeWidth="5"
          strokeLinecap="round"
          fill="none"
          initial={false}
          animate={{ pathLength: Math.max(progress, 0.001) }}
          transition={{ type: "spring", stiffness: 60, damping: 16 }}
          style={{ filter: "drop-shadow(0 0 4px rgba(255,212,59,0.8))" }}
        />

        {/* Vạch chia */}
        {ticks.map((a, i) => {
          const major = i % 10 === 0
          const lit = a <= angleNow + 0.01
          const [x1, y1] = pt(major ? 98 : 102, a)
          const [x2, y2] = pt(R_TICK_OUT, a)
          return (
            <line
              key={a}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke={lit ? "#FFD43B" : "rgba(255,255,255,0.3)"}
              strokeWidth={major ? 2.6 : 1.4}
              strokeLinecap="round"
              style={{ transition: "stroke 0.6s ease" }}
            />
          )
        })}

        {/* Mức voucher in trên vành */}
        {TIERS.map((t, i) => {
          const a = START + (SWEEP / (TIERS.length - 1)) * i
          const [x, y] = pt(R_LABEL, a)
          const rot = Math.sin(rad(a)) < 0 ? a + 90 : a - 90
          const unlocked = completed >= t.missions
          return (
            <text
              key={t.short}
              x={x}
              y={y}
              transform={`rotate(${rot} ${x} ${y})`}
              textAnchor="middle"
              dominantBaseline="central"
              fontFamily="var(--font-display)"
              fontSize="12.5"
              letterSpacing="0.6"
              fill={unlocked ? "#FFD43B" : "rgba(255,255,255,0.42)"}
              style={{ transition: "fill 0.6s ease" }}
            >
              {t.short}
            </text>
          )
        })}

        {/* Chỉ số vị trí */}
        <motion.g
          initial={false}
          animate={{ rotate: angleNow - START }}
          transition={{ type: "spring", stiffness: 60, damping: 14 }}
          style={{ originX: "140px", originY: "140px" }}
        >
          <circle cx={C} cy={C} r={140} fill="transparent" />
          <circle cx={pt(R_ARC, START)[0]} cy={pt(R_ARC, START)[1]} r="7" fill="#FFD43B" stroke="#0A1648" strokeWidth="2.5" />
          <circle cx={pt(R_ARC, START)[0]} cy={pt(R_ARC, START)[1]} r="2.4" fill="#0A1648" />
        </motion.g>

        {/* Gọng vàng + mặt kính */}
        <circle cx={C} cy={C} r={R_RIM + 4.5} fill="#0A1648" />
        <circle cx={C} cy={C} r={R_RIM} fill="none" stroke="url(#lens-rim)" strokeWidth="7" />
        <circle cx={C} cy={C} r={R_GLASS} fill="url(#lens-glass)" />
        <circle cx={C} cy={C} r={R_GLASS - 2} fill="none" stroke="rgba(51,82,196,0.12)" strokeWidth="5" />
      </svg>

      {/* Sương mờ trên kính tan dần theo tiến độ */}
      <motion.div
        className="pointer-events-none absolute inset-[22.5%] rounded-full"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, rgba(255,255,255,0) 38%, rgba(255,255,255,0.75) 72%, rgba(233,238,255,0.95) 100%)",
        }}
        initial={false}
        animate={{ opacity: fog }}
        transition={{ duration: 1.2, ease: "easeOut" }}
      />

      {/* Giá trị voucher trong mặt kính: lấy nét khi lên mức */}
      <div className="absolute inset-[22%] grid place-items-center rounded-full">
        <div className="flex flex-col items-center text-center">
          <span className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-royal/80">
            {completed === 0 ? "Khởi điểm" : "Bạn đang có"}
          </span>
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.span
              key={tier.short}
              className="font-display text-[clamp(40px,13vw,54px)] leading-[1.02] text-navy"
              initial={{ opacity: 0, scale: 1.35, filter: "blur(14px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, scale: 0.8, filter: "blur(10px)" }}
              transition={{ duration: 0.75, ease: [0.2, 0.9, 0.2, 1] }}
            >
              {tier.short}
            </motion.span>
          </AnimatePresence>
          <span className="mt-0.5 text-[10px] font-bold text-navy/60">
            {completed < total ? `Tối đa ${TIERS[TIERS.length - 1].short}` : "Mức cao nhất"}
          </span>
        </div>
      </div>

      {/* Ánh phản chiếu trên kính */}
      <svg viewBox="0 0 280 280" className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden>
        <path d={arcPath(69, 188, 236)} stroke="rgba(255,255,255,0.95)" strokeWidth="6" strokeLinecap="round" fill="none" />
        <circle cx={pt(69, 246)[0]} cy={pt(69, 246)[1]} r="3.2" fill="rgba(255,255,255,0.95)" />
        <path d={arcPath(69, 20, 60)} stroke="rgba(51,82,196,0.14)" strokeWidth="5" strokeLinecap="round" fill="none" />
      </svg>
    </div>
  )
}
