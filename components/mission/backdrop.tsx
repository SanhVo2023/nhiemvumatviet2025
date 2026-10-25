// Nền vàng tia nắng + ruy băng giống poster chiến dịch
export function Backdrop() {
  return (
    <div className="sky" aria-hidden>
      <div className="sky__rays" />
      <div className="sky__grain" />
      <Ribbon className="absolute -left-10 top-16 w-40 -rotate-12 opacity-90" from="#FFF3A3" to="#FFC21A" />
      <Ribbon className="absolute -right-24 top-[58%] w-44 rotate-[200deg]" from="#7B95FF" to="#2A44AD" />
      <Ribbon className="absolute -left-14 bottom-24 w-36 rotate-[160deg] opacity-60" from="#FFF3A3" to="#FFB300" />
    </div>
  )
}

function Ribbon({ className, from, to }: { className?: string; from: string; to: string }) {
  const id = `rb-${from.slice(1)}-${to.slice(1)}`
  return (
    <svg viewBox="0 0 200 120" className={className} fill="none">
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={from} />
          <stop offset="1" stopColor={to} />
        </linearGradient>
      </defs>
      <path
        d="M6 92 C 40 20, 70 20, 82 58 S 120 108, 136 62 S 170 8, 196 30"
        stroke={`url(#${id})`}
        strokeWidth="16"
        strokeLinecap="round"
      />
      <path
        d="M6 92 C 40 20, 70 20, 82 58 S 120 108, 136 62 S 170 8, 196 30"
        stroke="rgba(255,255,255,0.55)"
        strokeWidth="3"
        strokeLinecap="round"
        transform="translate(-2,-4)"
      />
    </svg>
  )
}
