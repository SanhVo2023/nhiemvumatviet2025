import type React from "react"
import { cn } from "@/lib/utils"
import { VOUCHER_VALIDITY, type VoucherTier } from "@/lib/campaign"

const amountDigits = (value: number) => value.toLocaleString("vi-VN")

// Vé voucher vàng "Cash VOUCHER" như trên poster
export function VoucherTicket({
  tier,
  size = "hero",
  className,
  style,
}: {
  tier: VoucherTier
  size?: "hero" | "badge"
  className?: string
  style?: React.CSSProperties
}) {
  if (size === "badge") {
    return (
      <div className={cn("ticket-wrap", className)} style={style}>
        <div className="ticket w-[128px]" style={{ "--stub": "24%", "--notch": "7px", borderRadius: 10 } as React.CSSProperties}>
          <div className="ticket__shine" />
          <div className="ticket__perf" style={{ borderLeftWidth: 2 }} />
          <div className="grid grid-cols-[1fr_24%] items-center">
            <div className="py-2 pl-2.5 pr-1">
              <div className="flex items-baseline gap-1 leading-none">
                <span className="font-script text-[13px] text-royal">Cash</span>
                <span className="font-display text-[10px] tracking-[0.08em]">VOUCHER</span>
              </div>
              <div className="ticket-amount mt-0.5 text-[26px]">{amountDigits(tier.value)}</div>
            </div>
            <div className="grid place-items-center">
              <span className="font-display text-[9px] tracking-[0.1em] [writing-mode:vertical-rl]">VNĐ</span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={cn("ticket-wrap", className)} style={style}>
      <div className="ticket" style={{ "--stub": "27%", "--notch": "13px", borderRadius: 20 } as React.CSSProperties}>
        <div className="ticket__shine" />
        <div className="ticket__perf" />
        <div className="grid grid-cols-[1fr_27%] items-stretch">
          <div className="py-4 pl-5 pr-2">
            <div className="flex items-baseline gap-1.5 leading-none">
              <span className="font-script text-[24px] text-royal">Cash</span>
              <span className="font-display text-[17px] tracking-[0.1em]">VOUCHER</span>
            </div>
            <div className="ticket-amount mt-1 whitespace-nowrap text-[clamp(40px,12.6vw,56px)]">
              {amountDigits(tier.value)}
              <span className="ml-1 align-top text-[0.36em]">VNĐ</span>
            </div>
            <div className="mt-2 inline-flex rounded-full bg-navy px-2.5 py-1 text-[11px] font-bold text-sun">
              Đơn từ {tier.minOrder}
            </div>
          </div>
          <div className="flex flex-col items-center justify-center gap-0.5 px-1 text-center">
            <span className="text-[9px] font-extrabold uppercase tracking-[0.14em] text-navy/70">Hiệu lực</span>
            <span className="font-display text-[30px] leading-none">24H</span>
            <span className="text-[9px] font-semibold leading-tight text-navy/70">{VOUCHER_VALIDITY.replace("24h ", "")}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
