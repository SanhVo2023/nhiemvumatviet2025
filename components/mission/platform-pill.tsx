import type { MissionId } from "@/lib/campaign"
import { cn } from "@/lib/utils"

export function InstagramGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 36 36" className={className} aria-hidden>
      <defs>
        <radialGradient id="ig-grad" cx="0.3" cy="1.07" r="1.2">
          <stop offset="0" stopColor="#FFD776" />
          <stop offset="0.25" stopColor="#F9A344" />
          <stop offset="0.5" stopColor="#E1306C" />
          <stop offset="0.8" stopColor="#C13584" />
          <stop offset="1" stopColor="#5B51D8" />
        </radialGradient>
      </defs>
      <rect width="36" height="36" rx="10" fill="url(#ig-grad)" />
      <rect x="8" y="8" width="20" height="20" rx="6" fill="none" stroke="#fff" strokeWidth="2.6" />
      <circle cx="18" cy="18" r="4.6" fill="none" stroke="#fff" strokeWidth="2.6" />
      <circle cx="23.6" cy="12.4" r="1.6" fill="#fff" />
    </svg>
  )
}

export function FacebookGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 36 36" className={className} aria-hidden>
      <circle cx="18" cy="18" r="18" fill="#fff" />
      <path
        d="M20.2 36V23.4h4.2l.7-4.9h-4.9v-3.1c0-1.4.4-2.4 2.4-2.4h2.6V8.6c-.4-.1-2-.2-3.8-.2-3.8 0-6.3 2.3-6.3 6.5v3.6h-4.2v4.9h4.2V36z"
        fill="#1877F2"
      />
    </svg>
  )
}

export function ZaloGlyph({ className }: { className?: string }) {
  return (
    <span className={cn("grid place-items-center overflow-hidden rounded-[10px] bg-white", className)}>
      <img src="/Zalo (2).png" alt="" className="h-[86%] w-[86%] object-contain" />
    </span>
  )
}

export function PlatformPill({ id, className }: { id: MissionId; className?: string }) {
  if (id === "instagram") {
    return (
      <span className={cn("platform-pill bg-white text-[#111]", className)}>
        <InstagramGlyph className="h-9 w-9" />
        <span className="text-[15px] font-extrabold tracking-tight">Instagram</span>
      </span>
    )
  }
  if (id === "facebook") {
    return (
      <span className={cn("platform-pill bg-[#1877F2] text-white", className)}>
        <FacebookGlyph className="h-9 w-9" />
        <span className="text-[16px] font-extrabold lowercase tracking-[-0.03em]">facebook</span>
      </span>
    )
  }
  return (
    <span className={cn("platform-pill bg-gradient-to-r from-[#0068FF] to-[#12A6FF] text-white", className)}>
      <ZaloGlyph className="h-9 w-9" />
      <span className="flex items-baseline gap-1">
        <span className="text-[15px] font-extrabold tracking-tight">Zalo</span>
        <span className="text-[12px] font-semibold opacity-95">Mini App</span>
      </span>
    </span>
  )
}
