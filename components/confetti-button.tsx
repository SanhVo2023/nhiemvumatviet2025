"use client"

import type React from "react"

import { useState } from "react"
import confetti from "canvas-confetti"
import { Button } from "@/components/ui/button"
import { Sparkles } from "lucide-react"

interface ConfettiButtonProps {
  children: React.ReactNode
  onClick?: () => void
  className?: string
}

export function ConfettiButton({ children, onClick, className = "" }: ConfettiButtonProps) {
  const [isAnimating, setIsAnimating] = useState(false)

  const handleClick = () => {
    if (onClick) onClick()

    setIsAnimating(true)
    setTimeout(() => setIsAnimating(false), 700)

    const count = 200
    const defaults = {
      origin: { y: 0.7 },
      zIndex: 1000,
    }

    function fire(particleRatio: number, opts: any) {
      confetti({
        ...defaults,
        ...opts,
        particleCount: Math.floor(count * particleRatio),
      })
    }

    fire(0.25, {
      spread: 26,
      startVelocity: 55,
      colors: ["#FFDE59", "#002169", "#ffffff"],
    })
    fire(0.2, {
      spread: 60,
      colors: ["#FFDE59", "#002169", "#ffffff"],
    })
    fire(0.35, {
      spread: 100,
      decay: 0.91,
      scalar: 0.8,
      colors: ["#FFDE59", "#002169", "#ffffff"],
    })
    fire(0.1, {
      spread: 120,
      startVelocity: 25,
      decay: 0.92,
      scalar: 1.2,
      colors: ["#FFDE59", "#002169", "#ffffff"],
    })
    fire(0.1, {
      spread: 120,
      startVelocity: 45,
      colors: ["#FFDE59", "#002169", "#ffffff"],
    })
  }

  return (
    <Button onClick={handleClick} className={`relative overflow-hidden ${className}`}>
      {isAnimating && (
        <span className="absolute inset-0 flex items-center justify-center">
          <Sparkles className="h-5 w-5 text-[#002169] animate-ping" />
        </span>
      )}
      <span className={isAnimating ? "opacity-0" : ""}>{children}</span>
    </Button>
  )
}
