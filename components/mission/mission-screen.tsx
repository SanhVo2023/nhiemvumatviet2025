"use client"

import { useEffect, useRef, useState } from "react"
import { createPortal } from "react-dom"
import { AnimatePresence, motion } from "framer-motion"
import { ArrowRight, Gift, Info, Sparkles } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog"
import { MISSIONS, TIERS, tierFor, type MissionId, type MissionStatus } from "@/lib/campaign"
import { BrandBar } from "./brand-bar"
import { popAt } from "./celebrate"
import { FocusLens } from "./focus-lens"
import { Mascot } from "./mascot"
import { MissionRow } from "./mission-row"

const TOP = TIERS[TIERS.length - 1]

export function MissionScreen({
  name,
  storeName,
  statuses,
  onStart,
  onClaim,
}: {
  name: string
  storeName?: string
  statuses: Record<MissionId, MissionStatus>
  onStart: (id: MissionId) => void
  onClaim: () => void
}) {
  const completed = MISSIONS.filter((m) => statuses[m.id] === 2).length
  const remaining = MISSIONS.length - completed
  const verifying = MISSIONS.some((m) => statuses[m.id] === 1)
  const nextId = verifying ? undefined : MISSIONS.find((m) => statuses[m.id] === 0)?.id
  const tier = tierFor(completed)

  const [cheer, setCheer] = useState(0)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const rowRefs = useRef<Partial<Record<MissionId, HTMLDivElement | null>>>({})
  const prev = useRef(statuses)

  // Mỗi nhiệm vụ vừa hoàn thành: pháo giấy tại dòng đó + linh vật nhảy
  useEffect(() => {
    for (const m of MISSIONS) {
      if (prev.current[m.id] !== 2 && statuses[m.id] === 2) {
        popAt(rowRefs.current[m.id] ?? null)
        setCheer((c) => c + 1)
      }
    }
    prev.current = statuses
  }, [statuses])

  const caption =
    completed === 0
      ? "Làm 1 nhiệm vụ để mở khóa voucher"
      : remaining > 0
        ? `Còn ${remaining} nhiệm vụ để lên ${TOP.short}`
        : `Nét căng! Bạn đã đạt mức ${TOP.short}`

  const claim = () => (completed < MISSIONS.length ? setConfirmOpen(true) : onClaim())

  return (
    <>
      <BrandBar storeName={storeName} />

      <section className="mt-5 text-center">
        {name && <p className="text-[15px] font-extrabold text-navy/80">Chào {name}!</p>}
        <h1 className="poster-type mt-1 text-[clamp(28px,8.6vw,38px)] text-royal">
          Theo dõi càng nhiều
          <span className="poster-type--orange block">voucher càng khủng</span>
        </h1>
      </section>

      {/* Ống kính voucher + linh vật hai bên */}
      <section className="relative mt-4">
        <FocusLens completed={completed} total={MISSIONS.length} />
        <Mascot who="chick" cheer={cheer} className="absolute bottom-2 left-[-8px] w-[27%] max-w-[118px]" delay={0.2} />
        <Mascot who="penguin" cheer={cheer} className="absolute right-[-10px] top-6 w-[26%] max-w-[112px]" delay={0.3} />
        <div className="relative z-10 -mt-4 flex justify-center">
          <span className="rounded-full bg-navy px-4 py-1.5 text-[12px] font-extrabold uppercase tracking-[0.12em] text-sun shadow-lg">
            {completed}/{MISSIONS.length} nhiệm vụ
          </span>
        </div>
        <AnimatePresence mode="wait" initial={false}>
          <motion.p
            key={caption}
            initial={{ opacity: 0, y: 6, filter: "blur(4px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -6 }}
            className="mt-2.5 text-center text-[15px] font-bold"
          >
            {caption}
          </motion.p>
        </AnimatePresence>
      </section>

      <section className="mt-6">
        <div className="space-y-3">
          {MISSIONS.map((m, i) => (
            <motion.div
              key={m.id}
              ref={(el) => {
                rowRefs.current[m.id] = el
              }}
              initial={{ opacity: 0, x: -24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ type: "spring", stiffness: 220, damping: 22, delay: 0.25 + i * 0.08 }}
            >
              <MissionRow mission={m} status={statuses[m.id]} isNext={m.id === nextId} onStart={() => onStart(m.id)} />
            </motion.div>
          ))}
        </div>
        <p className="mt-4 flex items-start gap-2 px-2 text-[13px] font-medium leading-snug text-navy/70">
          <Info className="mt-0.5 h-4 w-4 shrink-0" />
          Bấm vào từng nhiệm vụ, theo dõi Mắt Việt rồi quay lại trang này để nhận voucher.
        </p>
      </section>

      <ClaimBar completed={completed} total={MISSIONS.length} amount={tier.short} onClaim={claim} />

      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent className="w-[calc(100%-32px)] max-w-[400px] gap-0 rounded-[28px] border-0 bg-paper px-6 pb-6 pt-16 text-center sm:rounded-[28px]">
          <img src="/chick.png" alt="" className="absolute -top-16 left-1/2 w-24 -translate-x-1/2 drop-shadow-lg" />
          <DialogTitle className="text-[21px] font-extrabold leading-tight text-navy">
            Còn {remaining} nhiệm vụ nữa là lên {TOP.short}
          </DialogTitle>
          <DialogDescription className="mt-2 text-[14px] font-medium leading-snug text-navy/70">
            Bạn đang có voucher {tier.short}. Theo dõi thêm{" "}
            {MISSIONS.filter((m) => statuses[m.id] !== 2)
              .map((m) => m.platform)
              .join(", ")}{" "}
            để nhận mức cao nhất.
          </DialogDescription>
          <button type="button" className="btn-royal mt-6 w-full" onClick={() => setConfirmOpen(false)}>
            Làm tiếp nhiệm vụ
          </button>
          <button
            type="button"
            className="mt-3 h-12 w-full rounded-full text-[15px] font-bold text-navy/70 underline-offset-4 hover:underline"
            onClick={() => {
              setConfirmOpen(false)
              onClaim()
            }}
          >
            Nhận voucher {tier.short} luôn
          </button>
        </DialogContent>
      </Dialog>
    </>
  )
}

function ClaimBar({
  completed,
  total,
  amount,
  onClaim,
}: {
  completed: number
  total: number
  amount: string
  onClaim: () => void
}) {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  if (!mounted) return null

  const all = completed === total

  return createPortal(
    <motion.div
      className="claim-bar"
      initial={{ y: 120 }}
      animate={{ y: 0 }}
      exit={{ y: 120 }}
      transition={{ type: "spring", stiffness: 260, damping: 26, delay: 0.4 }}
    >
      <div className="mx-auto w-full max-w-[440px]">
        {completed === 0 ? (
          <div className="flex h-[60px] w-full items-center justify-center gap-2 rounded-full border-2 border-dashed border-navy/30 bg-paper/75 text-[15px] font-bold text-navy/60">
            <Gift className="h-5 w-5" />
            Làm 1 nhiệm vụ để nhận voucher
          </div>
        ) : all ? (
          <motion.button
            type="button"
            onClick={onClaim}
            className="btn-gold w-full"
            initial={{ scale: 0.9 }}
            animate={{ scale: [1, 1.03, 1] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          >
            <Sparkles className="h-5 w-5" />
            <span className="relative z-10">Nhận voucher {amount} ngay</span>
          </motion.button>
        ) : (
          <button type="button" onClick={onClaim} className="btn-royal w-full pl-6 pr-2">
            <span className="flex-1 text-left">Nhận voucher {amount}</span>
            <span className="grid h-11 w-11 place-items-center rounded-full bg-sun text-navy">
              <ArrowRight className="h-5 w-5" strokeWidth={3} />
            </span>
          </button>
        )}
      </div>
    </motion.div>,
    document.body,
  )
}
