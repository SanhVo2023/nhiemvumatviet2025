// Cấu hình chiến dịch "Chinh phục nhiệm vụ – Rinh voucher khủng"

export type MissionId = "instagram" | "facebook" | "zaloMiniApp"

// 0: chưa làm, 1: đang xác nhận, 2: hoàn thành
export type MissionStatus = 0 | 1 | 2

export interface Mission {
  id: MissionId
  platform: string
  url: string
}

// Thứ tự hiển thị giống poster tại cửa hàng
export const MISSIONS: Mission[] = [
  { id: "instagram", platform: "Instagram", url: "https://www.instagram.com/matviet.vn/" },
  { id: "facebook", platform: "Facebook", url: "https://www.facebook.com/Matviet.vn/?locale=vi_VN" },
  { id: "zaloMiniApp", platform: "Zalo Mini App", url: "https://zalo.me/s/4547084850318285898" },
]

export interface VoucherTier {
  missions: number
  value: number
  short: string
  minOrder: string
}

// Voucher cộng dồn theo số nhiệm vụ đã hoàn thành
export const TIERS: VoucherTier[] = [
  { missions: 0, value: 50_000, short: "50K", minOrder: "1.000.000đ" },
  { missions: 1, value: 100_000, short: "100K", minOrder: "2.000.000đ" },
  { missions: 2, value: 200_000, short: "200K", minOrder: "3.000.000đ" },
  { missions: 3, value: 300_000, short: "300K", minOrder: "4.000.000đ" },
]

export const VOUCHER_VALIDITY = "24h kể từ khi nhận"
export const CAMPAIGN_PERIOD = "26.10 – 30.10.2026"
export const HOTLINE = "1900 6081"

// Tên cửa hàng theo mã utm_content trên QR (xem google-review-stores.md)
export const STORES: Record<string, string> = {
  "101": "AEON Canary Bình Dương",
  "102": "AEON Mall Bình Tân",
  "104": "AEON Mall Long Biên",
  "105": "Crescent Mall",
  "106": "SC VivoCity",
  "107": "Vincom Biên Hòa",
  "111": "Giga Mall Sense City",
  "114": "Vincom Bà Triệu",
  "115": "AEON Mall Huế",
  "116": "Parc Mall",
  "117": "Estella Palace",
  "118": "Vincom Plaza Vinh",
  "208": "Vincom Đà Nẵng",
  "216": "BigC Mỹ Tho",
  "218": "Landmark 81",
  "220": "Vincom Trần Duy Hưng",
  "226": "Vincom Liễu Giai",
  "227": "Vincom Center Đồng Khởi",
  "228": "AEON Mall Hà Đông",
  "230": "Diamond Plaza",
  "302": "Cách Mạng Tháng 8",
  "303": "Hào Phát Bảo Lộc",
  "304": "Vincom Xuân Khánh Cần Thơ",
  "305": "Sala",
  "307": "3 Tháng 2",
  "308": "Quốc Hương Thảo Điền",
  "309": "Hoàng Diệu 2",
  "310": "Hoàng Hoa Thám",
  "321": "Nguyễn Trãi",
  "322": "Nguyễn Văn Nghi",
  "403": "Biên Hòa",
  "512": "Vincom Megamall Grand Park",
}

export function tierFor(completed: number): VoucherTier {
  return TIERS[Math.min(Math.max(completed, 0), TIERS.length - 1)]
}

export function earnedTiers(completed: number): VoucherTier[] {
  return TIERS.filter((t) => t.missions <= completed)
}

export function formatVND(value: number): string {
  return `${value.toLocaleString("vi-VN")}đ`
}

export function normalizePhone(raw: string): string {
  return raw.replace(/[\s.\-()]/g, "")
}

// Số di động Việt Nam: 0xxxxxxxxx hoặc +84xxxxxxxxx
export function isValidPhone(raw: string): boolean {
  return /^(0|\+?84)\d{9}$/.test(normalizePhone(raw))
}

export function maskPhone(raw: string): string {
  const p = normalizePhone(raw)
  if (p.length < 7) return p
  return `${p.slice(0, 4)} ••• ${p.slice(-3)}`
}

// Tên gọi: chữ cuối trong họ tên tiếng Việt ("Nguyễn Văn An" → "An")
export function givenName(fullName: string): string {
  const parts = fullName.trim().split(/\s+/)
  return parts[parts.length - 1] || ""
}
