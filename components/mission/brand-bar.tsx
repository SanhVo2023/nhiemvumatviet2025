import { MapPin } from "lucide-react"

export function BrandBar({ storeName }: { storeName?: string }) {
  return (
    <header className="relative z-10 flex items-center justify-between gap-3 pt-4">
      <a
        href="https://matviet.vn"
        target="_blank"
        rel="noreferrer"
        className="flex h-12 items-center rounded-2xl bg-paper px-3 shadow-[0_6px_16px_-8px_rgba(120,70,0,0.6)]"
      >
        <img src="/logo.png" alt="Mắt Việt Eye Care" className="h-8 w-auto" />
      </a>
      {storeName && (
        <div className="flex min-w-0 items-center gap-1.5 rounded-full bg-navy py-2 pl-2.5 pr-3.5 text-[12px] font-bold uppercase tracking-wide text-sun shadow-[0_6px_16px_-8px_rgba(10,22,72,0.8)]">
          <MapPin className="h-3.5 w-3.5 shrink-0" strokeWidth={2.6} />
          <span className="truncate">{storeName}</span>
        </div>
      )}
    </header>
  )
}
