"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { format } from "date-fns"
import { CalendarIcon, Printer, Save } from "lucide-react"
import { toast } from "sonner"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { useData } from "@/lib/data-context"
import { CATEGORIES, PAYMENT_METHODS, generateReceiptNo, cn } from "@/lib/utils"
import type { CategoryType, PaymentMethodType } from "@/lib/utils"

const baseSchema = z.object({
  category: z.string().min(1, "Category is required"),
  familyId: z.string().min(1, "Family is required"),
  memberId: z.string().optional(),
  description: z.string().min(1, "Description is required"),
  amount: z.coerce.number().positive("Amount must be positive"),
  paymentMethod: z.string().min(1, "Payment method is required"),
  date: z.date(),
  notes: z.string().optional(),
  projectId: z.string().optional(),
})

const formSchema = baseSchema.superRefine((val, ctx) => {
  if (val.category === "new-project" && !val.projectId) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Project is required",
      path: ["projectId"],
    })
  }
})

type FormValues = z.infer<typeof baseSchema>

interface AddIncomeDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AddIncomeDialog({ open, onOpenChange }: AddIncomeDialogProps) {
  const { families, addTransaction, projects } = useData()
  const [receiptNo] = useState(generateReceiptNo())

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema) as any,
    defaultValues: {
      category: "",
      familyId: "",
      memberId: "",
      description: "",
      amount: 0,
      paymentMethod: "cash",
      date: new Date(),
      notes: "",
      projectId: "",
    },
  })

  const selectedFamilyId = form.watch("familyId")
  const selectedFamily = families.find((f) => f.id === selectedFamilyId)

  function onSubmit(data: FormValues, shouldPrint: boolean = false) {
    const transaction = addTransaction({
      category: data.category as CategoryType,
      familyId: data.familyId,
      memberId: data.memberId || undefined,
      description: data.description,
      amount: data.amount,
      paymentMethod: data.paymentMethod as PaymentMethodType,
      type: "income",
      notes: data.notes,
      date: format(data.date, "yyyy-MM-dd"),
      projectId: data.projectId || undefined,
    })

    toast.success("Income added successfully!", {
      description: `Receipt ${transaction.receiptNo} generated`,
    })

    form.reset()
    onOpenChange(false)

    if (shouldPrint) {
      window.open(`/receipts/${transaction.id}`, "_blank")
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[560px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">Add Income</DialogTitle>
          <DialogDescription>
            Record a new income entry. Receipt #{receiptNo} will be generated automatically.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit((data) => onSubmit(data, false))} className="space-y-5">
          {/* Category */}
          <div className="space-y-2">
            <Label htmlFor="category">Category *</Label>
            <Select
              value={form.watch("category")}
              onValueChange={(v) => {
                if (!v) return
                form.setValue("category", v)
                const cat = CATEGORIES.find((c) => c.value === v)
                if (cat) form.setValue("description", cat.label)
              }}
            >
              <SelectTrigger id="category">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((cat) => (
                  <SelectItem key={cat.value} value={cat.value}>
                    <span className="flex items-center gap-2">
                      <span>{cat.emoji}</span>
                      <span>{cat.label}</span>
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {form.formState.errors.category && (
              <p className="text-xs text-destructive">{form.formState.errors.category.message}</p>
            )}
          </div>

          {/* Project (Conditional on Category is New Project) */}
          {form.watch("category") === "new-project" && (
            <div className="space-y-2 animate-in fade-in-50 duration-200">
              <Label htmlFor="projectId">Project *</Label>
              <Select
                value={form.watch("projectId") || ""}
                onValueChange={(v) => {
                  form.setValue("projectId", v ?? undefined)
                  if (v) {
                    const proj = projects.find((p) => p.id === v)
                    if (proj) {
                      form.setValue("description", `Contribution for ${proj.name}`)
                    }
                  }
                }}
              >
                <SelectTrigger id="projectId">
                  <SelectValue placeholder="Select project" />
                </SelectTrigger>
                <SelectContent>
                  {projects.map((proj) => (
                    <SelectItem key={proj.id} value={proj.id}>
                      {proj.name} ({proj.status})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {form.formState.errors.projectId && (
                <p className="text-xs text-destructive">
                  {form.formState.errors.projectId.message}
                </p>
              )}
            </div>
          )}

          {/* Family & Member */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="family">Family *</Label>
              <Select
                value={form.watch("familyId")}
                onValueChange={(v) => {
                  if (!v) return
                  form.setValue("familyId", v)
                  form.setValue("memberId", "")
                }}
              >
                <SelectTrigger id="family">
                  <SelectValue placeholder="Select family" />
                </SelectTrigger>
                <SelectContent>
                  {families.map((f) => (
                    <SelectItem key={f.id} value={f.id}>
                      {f.familyNo} - {f.houseName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {form.formState.errors.familyId && (
                <p className="text-xs text-destructive">{form.formState.errors.familyId.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="member">Member (optional)</Label>
              <Select
                value={form.watch("memberId") || ""}
                onValueChange={(v) => form.setValue("memberId", v ?? "")}
                disabled={!selectedFamily}
              >
                <SelectTrigger id="member">
                  <SelectValue placeholder="Select member" />
                </SelectTrigger>
                <SelectContent>
                  {selectedFamily?.members.map((m) => (
                    <SelectItem key={m.id} value={m.id}>
                      {m.memberId} - {m.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Input
              id="description"
              {...form.register("description")}
              placeholder="Enter description"
            />
            {form.formState.errors.description && (
              <p className="text-xs text-destructive">{form.formState.errors.description.message}</p>
            )}
          </div>

          {/* Amount & Payment Method */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Amount (₹) *</Label>
              <Input
                id="amount"
                type="number"
                {...form.register("amount")}
                placeholder="0"
              />
              {form.formState.errors.amount && (
                <p className="text-xs text-destructive">{form.formState.errors.amount.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="paymentMethod">Payment Method *</Label>
              <Select
                value={form.watch("paymentMethod")}
                onValueChange={(v) => v && form.setValue("paymentMethod", v)}
              >
                <SelectTrigger id="paymentMethod">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PAYMENT_METHODS.map((pm) => (
                    <SelectItem key={pm.value} value={pm.value}>
                      {pm.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Receipt No & Date */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Receipt Number</Label>
              <Input value={receiptNo} readOnly className="bg-muted text-muted-foreground" />
            </div>

            <div className="space-y-2">
              <Label>Date *</Label>
              <Popover>
                <PopoverTrigger
                    className={cn(
                      "flex h-9 w-full items-center justify-start rounded-md border border-input bg-transparent px-3 py-1 text-left text-sm font-normal shadow-xs hover:bg-accent hover:text-accent-foreground",
                      !form.watch("date") && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {form.watch("date") ? format(form.watch("date"), "dd MMM yyyy") : "Pick a date"}
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={form.watch("date")}
                    onSelect={(date) => date && form.setValue("date", date)}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              {...form.register("notes")}
              placeholder="Optional notes..."
              rows={2}
            />
          </div>

          <DialogFooter className="gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={form.handleSubmit((data) => onSubmit(data, true))}
              className="gap-2"
            >
              <Printer className="h-4 w-4" />
              Save & Print
            </Button>
            <Button type="submit" className="gap-2">
              <Save className="h-4 w-4" />
              Save
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
