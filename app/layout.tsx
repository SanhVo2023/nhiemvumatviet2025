import type React from "react"
import "./globals.css"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Nhiệm Vụ Mắt Việt - Nhận Voucher Đến 300K",
  description: "Hoàn thành 3 nhiệm vụ đơn giản và nhận voucher giảm giá đến 300.000đ khi mua kính mắt tại Mắt Việt",
  keywords: ["Mắt Việt", "voucher", "kính mắt", "giảm giá", "khuyến mãi"],
  authors: [{ name: "Mắt Việt" }],
  openGraph: {
    title: "Nhiệm Vụ Mắt Việt - Nhận Voucher Đến 300K",
    description: "Hoàn thành 3 nhiệm vụ đơn giản và nhận voucher giảm giá đến 300.000đ",
    type: "website",
    locale: "vi_VN",
    siteName: "Mắt Việt",
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
  },
  robots: {
    index: true,
    follow: true,
  },
  generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
