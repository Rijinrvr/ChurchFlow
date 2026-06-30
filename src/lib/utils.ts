import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

export function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date
  return d.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })
}

export function formatDateShort(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date
  return d.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
  })
}

export function generateReceiptNo(): string {
  const now = new Date()
  const year = now.getFullYear().toString().slice(-2)
  const month = (now.getMonth() + 1).toString().padStart(2, "0")
  const random = Math.floor(Math.random() * 9000 + 1000)
  return `REC-${year}${month}-${random}`
}

export function generateMemberId(familyNo: number, memberIndex: number): string {
  return `${familyNo}${(memberIndex + 1).toString().padStart(2, "0")}`
}

export function getDaysUntilBirthday(dob: Date | string): number {
  const today = new Date()
  const birthDate = typeof dob === "string" ? new Date(dob) : dob
  const nextBirthday = new Date(
    today.getFullYear(),
    birthDate.getMonth(),
    birthDate.getDate()
  )
  if (nextBirthday < today) {
    nextBirthday.setFullYear(nextBirthday.getFullYear() + 1)
  }
  const diffTime = nextBirthday.getTime() - today.getTime()
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
}

export function getAge(dob: Date | string): number {
  const today = new Date()
  const birthDate = typeof dob === "string" ? new Date(dob) : dob
  let age = today.getFullYear() - birthDate.getFullYear()
  const m = today.getMonth() - birthDate.getMonth()
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--
  }
  return age
}

export const CATEGORIES = [
  { value: "birthday", label: "Birthday", emoji: "🎂", color: "#ec4899" },
  { value: "wedding", label: "Wedding Anniversary", emoji: "💍", color: "#f43f5e" },
  { value: "monthly", label: "Monthly Contribution", emoji: "🏠", color: "#22c55e" },
  { value: "new-project", label: "New Project", emoji: "🏗", color: "#f59e0b" },
  { value: "donation", label: "Donation", emoji: "❤️", color: "#8b5cf6" },
  { value: "thanksgiving", label: "Thanksgiving", emoji: "🎉", color: "#06b6d4" },
  { value: "special-offering", label: "Special Offering", emoji: "🕊", color: "#6366f1" },
  { value: "others", label: "Others", emoji: "📦", color: "#64748b" },
] as const

export type CategoryType = (typeof CATEGORIES)[number]["value"]

export const PAYMENT_METHODS = [
  { value: "cash", label: "Cash" },
  { value: "upi", label: "UPI" },
  { value: "bank-transfer", label: "Bank Transfer" },
  { value: "cheque", label: "Cheque" },
] as const

export type PaymentMethodType = (typeof PAYMENT_METHODS)[number]["value"]

export function getCategoryByValue(value: string) {
  return CATEGORIES.find((c) => c.value === value)
}
