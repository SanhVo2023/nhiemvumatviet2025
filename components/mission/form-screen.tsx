"use client"

import type React from "react"
import { useState } from "react"
import { motion } from "framer-motion"
import { ArrowRight, Globe, Loader2, Phone } from "lucide-react"
import { CAMPAIGN_PERIOD, HOTLINE, TIERS, isValidPhone } from "@/lib/campaign"
import { BrandBar } from "./brand-bar"
import { Mascot } from "./mascot"
import { FacebookGlyph, InstagramGlyph, ZaloGlyph } from "./platform-pill"
import { VoucherTicket } from "./voucher-ticket"

export interface CustomerFields {
  name: string
  phone: string
  email: string
}

const rise = (delay: number) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { type: "spring" as const, stiffness: 200, damping: 20, delay },
})

export function FormScreen({
  fields,
  storeName,
  checking,
  onChange,
  onSubmit,
}: {
  fields: CustomerFields
  storeName?: string
  checking: boolean
  onChange: (fields: CustomerFields) => void
  onSubmit: () => void
}) {
  const [phoneTouched, setPhoneTouched] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const nameInvalid = submitted && !fields.name.trim()
  const phoneInvalid = (phoneTouched && fields.phone.length > 0 || submitted) && !isValidPhone(fields.phone)

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
    setPhoneTouched(true)
    if (!fields.name.trim() || !isValidPhone(fields.phone)) return
    onSubmit()
  }

  return (
    <>
      <BrandBar storeName={storeName} />

      {/* Tiêu đề kiểu poster */}
      <section className="relative mt-7 text-center">
        <motion.p {...rise(0.05)} className="poster-type poster-type--orange text-[clamp(22px,7.4vw,30px)]">
          Chinh phục nhiệm vụ
        </motion.p>
        <motion.h1 {...rise(0.15)} className="poster-type mt-1 text-royal">
          <span className="block text-[clamp(44px,14.5vw,64px)]">Rinh voucher</span>
          <span className="mt-[0.36em] block text-[clamp(76px,25vw,112px)] leading-[0.98]">khủng</span>
        </motion.h1>
      </section>

      {/* Linh vật đứng trên mép thẻ */}
      <div className="relative z-10 -mb-9 h-[118px]">
        <Mascot who="chick" className="absolute bottom-0 left-[-4px] w-[31%] max-w-[132px]" delay={0.35} />
        <motion.div
          className="absolute left-1/2 top-1"
          style={{ x: "-50%" }}
          initial={{ opacity: 0, y: 20, rotate: 0 }}
          animate={{ opacity: 1, y: [0, -6, 0], rotate: -7 }}
          transition={{
            opacity: { delay: 0.5 },
            rotate: { type: "spring", stiffness: 120, damping: 10, delay: 0.5 },
            y: { duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.5 },
          }}
        >
          <VoucherTicket tier={TIERS[TIERS.length - 1]} size="badge" />
        </motion.div>
        <Mascot who="penguin" className="absolute bottom-[-4px] right-[-6px] w-[30%] max-w-[128px]" delay={0.45} />
      </div>

      <motion.form {...rise(0.3)} onSubmit={submit} noValidate className="paper-card relative px-5 pb-6 pt-12">
        <div className="flex items-center justify-center gap-2">
          <div className="flex -space-x-1.5">
            <InstagramGlyph className="h-7 w-7 rounded-[9px] ring-2 ring-paper" />
            <FacebookGlyph className="h-7 w-7 rounded-full bg-[#1877F2] ring-2 ring-paper" />
            <ZaloGlyph className="h-7 w-7 ring-2 ring-paper" />
          </div>
          <span className="text-[13px] font-bold text-navy/75">3 nhiệm vụ · voucher đến 300K</span>
        </div>

        <h2 className="mt-4 text-center text-[21px] font-extrabold leading-tight tracking-tight">
          Điền thông tin nhận voucher
        </h2>
        <p className="mx-auto mt-1 max-w-[290px] text-center text-[13.5px] font-medium leading-snug text-navy/65">
          Mã voucher sẽ được gửi qua SMS tới số điện thoại bạn nhập.
        </p>

        <div className="mt-5 space-y-4">
          <label className="block">
            <span className="mb-1.5 block text-[13px] font-bold">Họ tên</span>
            <input
              className="field"
              type="text"
              name="name"
              autoComplete="name"
              placeholder="Nguyễn Văn An"
              required
              aria-invalid={nameInvalid}
              aria-describedby={nameInvalid ? "name-error" : undefined}
              value={fields.name}
              onChange={(e) => onChange({ ...fields, name: e.target.value })}
            />
            {nameInvalid && (
              <span id="name-error" className="mt-1.5 block text-[12.5px] font-semibold text-[#C2410C]">
                Nhập họ tên để nhận voucher.
              </span>
            )}
          </label>

          <label className="block">
            <span className="mb-1.5 block text-[13px] font-bold">Số điện thoại</span>
            <input
              className="field tracking-wide"
              type="tel"
              name="phone"
              inputMode="tel"
              autoComplete="tel"
              placeholder="0912 345 678"
              required
              aria-invalid={phoneInvalid}
              aria-describedby={phoneInvalid ? "phone-error" : undefined}
              value={fields.phone}
              onBlur={() => setPhoneTouched(true)}
              onChange={(e) => onChange({ ...fields, phone: e.target.value })}
            />
            {phoneInvalid && (
              <span id="phone-error" className="mt-1.5 block text-[12.5px] font-semibold text-[#C2410C]">
                {fields.phone.trim()
                  ? "Số điện thoại chưa đúng. Nhập 10 số, ví dụ 0912 345 678."
                  : "Nhập số điện thoại để nhận mã voucher qua SMS."}
              </span>
            )}
          </label>

          <label className="block">
            <span className="mb-1.5 flex items-baseline justify-between text-[13px] font-bold">
              Email
              <span className="text-[12px] font-semibold text-navy/45">Không bắt buộc</span>
            </span>
            <input
              className="field"
              type="email"
              name="email"
              autoComplete="email"
              placeholder="ban@email.com"
              value={fields.email}
              onChange={(e) => onChange({ ...fields, email: e.target.value })}
            />
          </label>
        </div>

        <button type="submit" disabled={checking} className="btn-royal mt-6 w-full pl-6 pr-2">
          {checking ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              Đang kiểm tra số điện thoại…
            </>
          ) : (
            <>
              <span className="flex-1 text-left">Bắt đầu nhiệm vụ</span>
              <span className="grid h-11 w-11 place-items-center rounded-full bg-sun text-navy">
                <ArrowRight className="h-5 w-5" strokeWidth={3} />
              </span>
            </>
          )}
        </button>
      </motion.form>

      <CampaignFooter />
    </>
  )
}

export function CampaignFooter() {
  return (
    <footer className="mt-6 text-center">
      <p className="text-[12px] font-semibold italic text-navy/70">
        *Có điều kiện áp dụng · Thời gian: {CAMPAIGN_PERIOD}
      </p>
      <div className="mt-3 flex items-center justify-center gap-5 rounded-full bg-navy px-4 py-3 text-[13px] font-bold text-white">
        <a href="https://matviet.vn" target="_blank" rel="noreferrer" className="flex items-center gap-1.5">
          <Globe className="h-4 w-4 text-sun" />
          matviet.vn
        </a>
        <span className="h-4 w-px bg-white/25" />
        <a href={`tel:${HOTLINE.replace(/\s/g, "")}`} className="flex items-center gap-1.5">
          <Phone className="h-4 w-4 text-sun" />
          {HOTLINE}
        </a>
      </div>
    </footer>
  )
}
