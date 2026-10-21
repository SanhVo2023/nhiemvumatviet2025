import confetti from "canvas-confetti"

const COLORS = ["#FFD43B", "#3352C4", "#FF7A1A", "#FF8FA3", "#FFFFFF"]

const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches

// Pháo giấy nhỏ khi xong một nhiệm vụ, bắn từ vị trí phần tử
export function popAt(el: Element | null) {
  if (prefersReducedMotion()) return
  const rect = el?.getBoundingClientRect()
  const origin = rect
    ? { x: (rect.left + rect.width * 0.2) / window.innerWidth, y: (rect.top + rect.height / 2) / window.innerHeight }
    : { x: 0.5, y: 0.6 }
  confetti({ particleCount: 46, spread: 70, startVelocity: 32, scalar: 0.9, ticks: 120, origin, colors: COLORS, zIndex: 60 })
  navigator.vibrate?.(30)
}

// Màn chúc mừng: pháo giấy hai bên trong vài giây
export function celebrate(seconds = 3) {
  if (prefersReducedMotion()) return
  const end = Date.now() + seconds * 1000
  const frame = () => {
    confetti({ particleCount: 5, angle: 60, spread: 62, startVelocity: 58, origin: { x: 0, y: 0.75 }, colors: COLORS, zIndex: 60 })
    confetti({ particleCount: 5, angle: 120, spread: 62, startVelocity: 58, origin: { x: 1, y: 0.75 }, colors: COLORS, zIndex: 60 })
    if (Date.now() < end) requestAnimationFrame(frame)
  }
  frame()
  confetti({ particleCount: 140, spread: 110, startVelocity: 45, origin: { y: 0.45 }, colors: COLORS, scalar: 1.1, zIndex: 60 })
}
