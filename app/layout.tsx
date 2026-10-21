import type React from "react"
import type { Viewport } from "next"
import "./globals.css"
import { Anton, Be_Vietnam_Pro, Pacifico } from "next/font/google"

const display = Anton({
  weight: "400",
  subsets: ["latin", "vietnamese"],
  variable: "--font-display",
  display: "swap",
})

const body = Be_Vietnam_Pro({
  weight: ["400", "500", "600", "700", "800"],
  subsets: ["latin", "vietnamese"],
  variable: "--font-body",
  display: "swap",
})

const script = Pacifico({
  weight: "400",
  subsets: ["latin", "vietnamese"],
  variable: "--font-script",
  display: "swap",
})

export const metadata = {
  title: "Chinh Phục Nhiệm Vụ – Rinh Voucher Khủng | Mắt Việt",
  description:
    "Theo dõi Mắt Việt trên Instagram, Facebook và Zalo Mini App để nhận voucher đến 300.000đ khi mua kính tại Mắt Việt.",
  keywords: ["Mắt Việt", "voucher", "kính mắt", "giảm giá", "khuyến mãi"],
  authors: [{ name: "Mắt Việt" }],
  openGraph: {
    title: "Chinh Phục Nhiệm Vụ – Rinh Voucher Khủng",
    description: "Hoàn thành 3 nhiệm vụ theo dõi, nhận voucher đến 300.000đ tại Mắt Việt",
    type: "website",
    locale: "vi_VN",
    siteName: "Mắt Việt",
  },
  robots: {
    index: true,
    follow: true,
  },
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#FFD43B",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="vi" className={`${display.variable} ${body.variable} ${script.variable}`}>
      <body className="font-body">{children}</body>
    </html>
  )
}
