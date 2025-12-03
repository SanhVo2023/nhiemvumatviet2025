"use client"

import React from "react"
import { motion } from "framer-motion"
import { ArrowLeft, HelpCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import Link from "next/link"

export default function QAPage() {
  return (
    <div className="min-h-screen bg-[#002169] flex flex-col items-center p-4 pt-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-2xl"
      >
        {/* Header */}
        <div className="flex items-center mb-8 relative">
          <Link href="/">
            <Button variant="ghost" className="text-white hover:text-[#FFDE59] hover:bg-white/10 p-0 h-auto gap-2">
              <ArrowLeft className="h-5 w-5" />
              <span>Quay lại</span>
            </Button>
          </Link>
          <div className="absolute left-1/2 transform -translate-x-1/2 text-white font-bold text-xl flex items-center gap-2">
            <HelpCircle className="h-6 w-6 text-[#FFDE59]" />
            <span>Hỏi đáp (Q&A)</span>
          </div>
        </div>

        {/* Content Card */}
        <div className="glass-card p-6 md:p-8 rounded-2xl shadow-2xl mb-8">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <h1 className="text-2xl font-bold text-[#002169] mb-2 text-center">Câu hỏi thường gặp</h1>
            <p className="text-center text-gray-600 mb-8">Giải đáp thắc mắc về chương trình Nhiệm vụ Mắt Việt</p>

            <Accordion type="single" collapsible className="w-full space-y-4">
              <AccordionItem value="item-1" className="border-b-0">
                <div className="bg-white/50 rounded-xl px-4 transition-all hover:bg-white/80">
                  <AccordionTrigger className="text-[#002169] font-semibold text-left hover:no-underline hover:text-[#003399]">
                    Làm thế nào để nhận được Voucher?
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-700 pb-4">
                    Để nhận được Voucher, bạn cần hoàn thành các nhiệm vụ được liệt kê trên trang chủ. Mỗi khi hoàn thành một mức nhiệm vụ (1, 2, hoặc 3 nhiệm vụ), bạn sẽ nhận được mức voucher tương ứng. Sau khi hoàn thành, hãy nhấn nút "Nhận thưởng" để hệ thống ghi nhận và gửi mã voucher cho bạn.
                  </AccordionContent>
                </div>
              </AccordionItem>

              <AccordionItem value="item-2" className="border-b-0">
                <div className="bg-white/50 rounded-xl px-4 transition-all hover:bg-white/80">
                  <AccordionTrigger className="text-[#002169] font-semibold text-left hover:no-underline hover:text-[#003399]">
                    Tôi có thể sử dụng voucher ở đâu?
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-700 pb-4">
                    Voucher được áp dụng khi mua hàng trực tiếp tại hệ thống cửa hàng Mắt Việt trên toàn quốc hoặc mua online tại website matviet.vn. Vui lòng đưa mã voucher cho nhân viên hoặc nhập mã khi thanh toán online.
                  </AccordionContent>
                </div>
              </AccordionItem>

              <AccordionItem value="item-3" className="border-b-0">
                <div className="bg-white/50 rounded-xl px-4 transition-all hover:bg-white/80">
                  <AccordionTrigger className="text-[#002169] font-semibold text-left hover:no-underline hover:text-[#003399]">
                    Mỗi người được tham gia bao nhiêu lần?
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-700 pb-4">
                    Mỗi số điện thoại chỉ được tham gia nhận thưởng một lần duy nhất trong suốt thời gian diễn ra chương trình.
                  </AccordionContent>
                </div>
              </AccordionItem>

              <AccordionItem value="item-4" className="border-b-0">
                <div className="bg-white/50 rounded-xl px-4 transition-all hover:bg-white/80">
                  <AccordionTrigger className="text-[#002169] font-semibold text-left hover:no-underline hover:text-[#003399]">
                    Tôi đã hoàn thành nhưng chưa nhận được mã?
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-700 pb-4">
                    Mã voucher sẽ được gửi qua SMS hoặc Email mà bạn đã đăng ký trong vòng 24h làm việc. Nếu quá thời gian này vẫn chưa nhận được, vui lòng liên hệ Fanpage Mắt Việt để được hỗ trợ.
                  </AccordionContent>
                </div>
              </AccordionItem>

              <AccordionItem value="item-5" className="border-b-0">
                <div className="bg-white/50 rounded-xl px-4 transition-all hover:bg-white/80">
                  <AccordionTrigger className="text-[#002169] font-semibold text-left hover:no-underline hover:text-[#003399]">
                    Nhiệm vụ "Review Google" thực hiện như thế nào?
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-700 pb-4">
                    Bạn cần bấm vào nút "Làm ngay", hệ thống sẽ chuyển hướng đến Google Maps của cửa hàng. Hãy đánh giá 5 sao và viết một nhận xét tích cực, sau đó quay lại trang nhiệm vụ để xác nhận hoàn thành.
                  </AccordionContent>
                </div>
              </AccordionItem>
            </Accordion>
          </motion.div>
        </div>

        {/* Footer info */}
        <div className="text-center text-white/60 text-sm">
          <p>© 2024 Mắt Việt. All rights reserved.</p>
        </div>
      </motion.div>
    </div>
  )
}
