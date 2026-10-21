"use client"

import { useEffect } from "react"
import { motion } from "framer-motion"
import { MapPin, MessageSquareText, ShoppingBag } from "lucide-react"
import { MISSIONS, VOUCHER_VALIDITY, earnedTiers, maskPhone, tierFor } from "@/lib/campaign"
import { BrandBar } from "./brand-bar"
import { celebrate } from "./celebrate"
import { CampaignFooter } from "./form-screen"
import { Mascot } from "./mascot"
import { VoucherTicket } from "./voucher-ticket"

export function SuccessScreen({
  name,
  phone,
  storeName,
  completed,
}: {
  name: string
  phone: string
  storeName?: string
  completed: number
}) {
  const top = tierFor(completed)
  const tiers = earnedTiers(completed).reverse()

  useEffect(() => {
    const t = setTimeout(() => celebrate(completed === MISSIONS.length ? 3.2 : 1.6), 450)
    return () => clearTimeout(t)
  }, [completed])

  return (
    <>
      <BrandBar storeName={storeName} />

      <section className="relative mt-6 text-center">
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="poster-type poster-type--orange text-[clamp(22px,7vw,30px)]"
        >
          {name ? `Chúc mừng ${name}!` : "Chúc mừng bạn!"}
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 220, damping: 13, delay: 0.2 }}
          className="poster-type mt-1 text-[clamp(44px,14vw,62px)] text-royal"
        >
          Rinh voucher
          <span className="block">thành công</span>
        </motion.h1>
      </section>

      {/* Vé voucher "in" ra, hai linh vật hai bên */}
      <section className="relative mt-2 pt-[92px]">
        <Mascot who="chick" className="absolute left-[4%] top-0 w-[29%] max-w-[124px]" delay={0.7} />
        <Mascot who="penguin" className="absolute right-[3%] top-[-6px] w-[28%] max-w-[120px]" delay={0.8} />
        <motion.div
          className="relative z-10 mx-auto w-full"
          initial={{ opacity: 0, y: -40, rotate: -14, scale: 0.7 }}
          animate={{ opacity: 1, y: 0, rotate: -3, scale: 1 }}
          transition={{ type: "spring", stiffness: 160, damping: 12, delay: 0.45 }}
        >
          <VoucherTicket tier={top} />
        </motion.div>
      </section>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
        className="paper-card mt-6 flex items-center gap-3.5 p-4"
      >
        <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-royal text-white">
          <MessageSquareText className="h-6 w-6" />
        </span>
        <div className="min-w-0">
          <p className="text-[13.5px] font-semibold leading-snug text-navy/70">Mã voucher sẽ được gửi qua SMS tới</p>
          <p className="mt-0.5 text-[19px] font-extrabold tabular-nums tracking-wide">{maskPhone(phone)}</p>
        </div>
      </motion.div>

      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.05 }}
        className="paper-card mt-4 p-5"
      >
        <h2 className="text-[17px] font-extrabold leading-tight">Chọn mức voucher theo giá trị đơn</h2>
        <p className="mt-1 text-[13px] font-medium leading-snug text-navy/65">
          Một mã SMS dùng được cho 1 mức bất kỳ dưới đây.
        </p>
        <ul className="mt-4 divide-y divide-dashed divide-navy/15">
          {tiers.map((t, i) => (
            <motion.li
              key={t.short}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.15 + i * 0.08 }}
              className="flex items-center gap-3 py-3"
            >
              <span
                className={
                  i === 0
                    ? "grid h-12 w-[72px] shrink-0 place-items-center rounded-xl bg-gradient-to-br from-[#FFE873] to-[#FFB81C] font-display text-[22px] text-navy shadow-[inset_0_0_0_2px_#002169]"
                    : "grid h-12 w-[72px] shrink-0 place-items-center rounded-xl bg-butter font-display text-[22px] text-navy/80"
                }
              >
                {t.short}
              </span>
              <span className="flex-1 whitespace-nowrap text-[13.5px] font-semibold leading-snug">
                Đơn từ <strong className="font-extrabold">{t.minOrder}</strong>
              </span>
              {i === 0 && (
                <span className="rounded-full bg-tangerine px-2 py-1 text-[10.5px] font-extrabold uppercase tracking-wide text-white">
                  Cao nhất
                </span>
              )}
            </motion.li>
          ))}
        </ul>
        <ul className="mt-3 space-y-1.5 rounded-2xl bg-butter p-4 text-[12.5px] font-medium leading-snug text-navy/75">
          <li>• Mỗi đơn hàng áp dụng 1 voucher.</li>
          <li>• Hiệu lực {VOUCHER_VALIDITY}.</li>
          <li>• Áp dụng khi mua kính mắt tại Mắt Việt.</li>
        </ul>
      </motion.section>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.25 }}
        className="mt-6 space-y-3"
      >
        <a href="https://matviet.vn" className="btn-royal w-full">
          <ShoppingBag className="h-5 w-5" />
          Khám phá sản phẩm Mắt Việt
        </a>
        <a
          href="https://matviet.vn/pages/he-thong-cua-hang"
          className="flex h-14 w-full items-center justify-center gap-2 rounded-full bg-paper/70 text-[16px] font-bold text-navy ring-2 ring-navy/80 transition-colors hover:bg-paper"
        >
          <MapPin className="h-5 w-5" />
          Tìm cửa hàng gần nhất
        </a>
      </motion.div>

      <CampaignFooter />
    </>
  )
}
