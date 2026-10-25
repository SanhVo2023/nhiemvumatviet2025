"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

const SRC = {
  penguin: { src: "/penguin.png", alt: "Chim cánh cụt xanh Mắt Việt" },
  chick: { src: "/chick.png", alt: "Gà con vàng Mắt Việt" },
}

// Linh vật nhún nhảy; đổi `cheer` để linh vật bật nhảy ăn mừng
export function Mascot({
  who,
  className,
  delay = 0,
  cheer = 0,
  flip = false,
}: {
  who: keyof typeof SRC
  className?: string
  delay?: number
  cheer?: number
  flip?: boolean
}) {
  return (
    <motion.div
      key={cheer}
      className={cn("pointer-events-none select-none", className)}
      initial={cheer ? { y: 0, rotate: 0 } : { y: 40, opacity: 0, scale: 0.6 }}
      animate={
        cheer
          ? { y: [0, -34, 0, -12, 0], rotate: [0, -10, 8, -4, 0] }
          : { y: 0, opacity: 1, scale: 1 }
      }
      transition={
        cheer
          ? { duration: 0.9, ease: "easeOut" }
          : { type: "spring", stiffness: 240, damping: 14, delay }
      }
    >
      <motion.img
        src={SRC[who].src}
        alt={SRC[who].alt}
        draggable={false}
        className="h-auto w-full drop-shadow-[0_10px_10px_rgba(120,70,0,0.35)]"
        style={{ scaleX: flip ? -1 : 1 }}
        animate={{ y: [0, -7, 0], rotate: [0, who === "penguin" ? 2.5 : -2.5, 0] }}
        transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut", delay: delay + 0.6 }}
      />
    </motion.div>
  )
}
