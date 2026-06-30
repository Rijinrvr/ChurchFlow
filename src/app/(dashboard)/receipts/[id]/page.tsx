"use client"

import { useMemo } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Printer, Download, Church, QrCode } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { useData } from "@/lib/data-context"
import { formatDate, formatCurrency, getCategoryByValue } from "@/lib/utils"

function numberToWords(num: number): string {
  const ones = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine",
    "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"]
  const tens = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"]

  if (num === 0) return "Zero"
  if (num < 0) return "Minus " + numberToWords(-num)

  let words = ""
  if (Math.floor(num / 100000) > 0) {
    words += numberToWords(Math.floor(num / 100000)) + " Lakh "
    num %= 100000
  }
  if (Math.floor(num / 1000) > 0) {
    words += numberToWords(Math.floor(num / 1000)) + " Thousand "
    num %= 1000
  }
  if (Math.floor(num / 100) > 0) {
    words += numberToWords(Math.floor(num / 100)) + " Hundred "
    num %= 100
  }
  if (num > 0) {
    if (words !== "") words += "and "
    if (num < 20) words += ones[num]
    else {
      words += tens[Math.floor(num / 10)]
      if (num % 10 > 0) words += " " + ones[num % 10]
    }
  }
  return words.trim()
}

export default function ReceiptDetailPage() {
  const params = useParams()
  const { transactions } = useData()

  const transaction = useMemo(
    () => transactions.find((t) => t.id === params.id),
    [transactions, params.id]
  )

  if (!transaction) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <div className="text-center space-y-3">
          <p className="text-muted-foreground">Receipt not found</p>
          <Link href="/receipts"><Button variant="outline">Go Back</Button></Link>
        </div>
      </div>
    )
  }

  const cat = getCategoryByValue(transaction.category)

  return (
    <div className="space-y-6">
      {/* Actions */}
      <div className="flex items-center justify-between no-print">
        <Link href="/receipts">
          <Button variant="ghost" className="gap-2"><ArrowLeft className="h-4 w-4" /> Back to Receipts</Button>
        </Link>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="gap-2"><Download className="h-4 w-4" /> Download PDF</Button>
          <Button size="sm" className="gap-2" onClick={() => window.print()}><Printer className="h-4 w-4" /> Print</Button>
        </div>
      </div>

      {/* Receipt */}
      <div className="max-w-[580px] mx-auto">
        <div className="bg-white dark:bg-card border rounded-2xl shadow-lg p-8 print:shadow-none print:border-2 print:border-gray-300">
          {/* Header */}
          <div className="text-center space-y-2 mb-6">
            <div className="flex items-center justify-center gap-3">
              <div className="h-12 w-12 rounded-xl bg-primary flex items-center justify-center text-primary-foreground">
                <Church className="h-7 w-7" />
              </div>
            </div>
            <h1 className="text-xl font-bold">St. Mary&apos;s Orthodox Church</h1>
            <p className="text-xs text-muted-foreground">Kottayam, Kerala, India</p>
            <p className="text-xs text-muted-foreground">Phone: +91 9847000000 | Email: church@example.com</p>
            <Separator />
            <h2 className="text-lg font-bold text-primary tracking-wider">RECEIPT</h2>
          </div>

          {/* Receipt Details */}
          <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
            <div>
              <p className="text-xs text-muted-foreground">Receipt No</p>
              <p className="font-bold font-mono">{transaction.receiptNo}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground">Date</p>
              <p className="font-bold">{formatDate(transaction.date)}</p>
            </div>
          </div>

          <Separator className="mb-6" />

          {/* Details Grid */}
          <div className="space-y-4 mb-6">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Received From</p>
                <p className="font-medium">{transaction.memberName}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Family</p>
                <p className="font-medium">{transaction.houseName} ({transaction.familyNo})</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Category</p>
                <p className="font-medium">{cat?.emoji} {cat?.label}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Payment Method</p>
                <p className="font-medium capitalize">{transaction.paymentMethod}</p>
              </div>
            </div>

            <div>
              <p className="text-xs text-muted-foreground mb-1">Description</p>
              <p className="font-medium">{transaction.description}</p>
            </div>
          </div>

          {/* Amount Box */}
          <div className="bg-primary/5 dark:bg-primary/10 rounded-xl p-4 mb-6">
            <div className="text-center">
              <p className="text-xs text-muted-foreground mb-1">Amount Received</p>
              <p className="text-3xl font-bold text-primary">{formatCurrency(transaction.amount)}</p>
              <p className="text-xs text-muted-foreground mt-1 italic">
                ({numberToWords(transaction.amount)} Rupees Only)
              </p>
            </div>
          </div>

          <Separator className="mb-6" />

          {/* Footer */}
          <div className="flex items-end justify-between">
            <div>
              <p className="text-xs text-muted-foreground">Received By</p>
              <p className="text-sm font-medium">{transaction.collectedBy}</p>
              <div className="mt-6 border-t border-dashed pt-1">
                <p className="text-xs text-muted-foreground">Authorized Signature</p>
              </div>
            </div>

            {/* QR Code placeholder */}
            <div className="text-center">
              <div className="h-16 w-16 bg-muted rounded-lg flex items-center justify-center">
                <QrCode className="h-10 w-10 text-muted-foreground/40" />
              </div>
              <p className="text-[9px] text-muted-foreground mt-1">Scan to verify</p>
            </div>
          </div>

          {/* Decorative Footer */}
          <div className="mt-6 pt-4 border-t text-center">
            <p className="text-[10px] text-muted-foreground">
              This is a computer-generated receipt. Thank you for your generous contribution.
            </p>
            <p className="text-[10px] text-muted-foreground mt-1">
              &quot;God loves a cheerful giver&quot; — 2 Corinthians 9:7
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
