"use client"

import React, { createContext, useContext, useState, useCallback } from "react"
import {
  families as initialFamilies,
  members as initialMembers,
  transactions as initialTransactions,
  type Family,
  type Member,
  type Transaction,
} from "@/lib/data"
import { generateReceiptNo } from "@/lib/utils"
import type { CategoryType, PaymentMethodType } from "@/lib/utils"

interface DataContextType {
  families: Family[]
  members: Member[]
  transactions: Transaction[]
  addTransaction: (data: {
    category: CategoryType
    familyId: string
    memberId?: string
    description: string
    amount: number
    paymentMethod: PaymentMethodType
    type: "income" | "expense"
    notes?: string
    date?: string
  }) => Transaction
  addFamily: (data: { headOfFamily: string; houseName: string; phone: string; address: string }) => Family
  addMember: (data: { name: string; familyId: string; phone: string; dob: string; gender: "male" | "female"; role: string }) => Member
}

const DataContext = createContext<DataContextType | undefined>(undefined)

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [families, setFamilies] = useState<Family[]>(initialFamilies)
  const [members, setMembers] = useState<Member[]>(initialMembers)
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions)

  const addTransaction = useCallback(
    (data: {
      category: CategoryType
      familyId: string
      memberId?: string
      description: string
      amount: number
      paymentMethod: PaymentMethodType
      type: "income" | "expense"
      notes?: string
      date?: string
    }) => {
      const family = families.find((f) => f.id === data.familyId)
      const member = data.memberId ? members.find((m) => m.id === data.memberId) : null
      const receiptNo = generateReceiptNo()
      const newTransaction: Transaction = {
        id: `t-${Date.now()}`,
        date: data.date || new Date().toISOString().split("T")[0],
        receiptNo,
        category: data.category,
        familyId: data.familyId,
        familyNo: family?.familyNo || 0,
        houseName: family?.houseName || "",
        memberId: data.memberId,
        memberName: member?.name || family?.headOfFamily || "Church Admin",
        description: data.description,
        amount: data.amount,
        paymentMethod: data.paymentMethod,
        collectedBy: "Admin",
        type: data.type,
        notes: data.notes,
      }
      setTransactions((prev) => [newTransaction, ...prev])
      return newTransaction
    },
    [families, members]
  )

  const addFamily = useCallback((data: { headOfFamily: string; houseName: string; phone: string; address: string }) => {
    const maxFamilyNo = Math.max(...families.map((f) => f.familyNo), 99)
    const newFamily: Family = {
      id: `f-${Date.now()}`,
      familyNo: maxFamilyNo + 1,
      headOfFamily: data.headOfFamily,
      houseName: data.houseName,
      phone: data.phone,
      address: data.address,
      members: [],
      createdAt: new Date().toISOString().split("T")[0],
    }
    setFamilies((prev) => [...prev, newFamily])
    return newFamily
  }, [families])

  const addMember = useCallback(
    (data: { name: string; familyId: string; phone: string; dob: string; gender: "male" | "female"; role: string }) => {
      const family = families.find((f) => f.id === data.familyId)
      if (!family) throw new Error("Family not found")
      const memberIndex = family.members.length
      const memberId = `${family.familyNo}${(memberIndex + 1).toString().padStart(2, "0")}`
      const newMember: Member = {
        id: `m-${Date.now()}`,
        memberId,
        name: data.name,
        familyId: data.familyId,
        familyNo: family.familyNo,
        houseName: family.houseName,
        phone: data.phone,
        dob: data.dob,
        gender: data.gender,
        role: data.role,
      }
      setMembers((prev) => [...prev, newMember])
      setFamilies((prev) =>
        prev.map((f) => (f.id === data.familyId ? { ...f, members: [...f.members, newMember] } : f))
      )
      return newMember
    },
    [families]
  )

  return (
    <DataContext.Provider value={{ families, members, transactions, addTransaction, addFamily, addMember }}>
      {children}
    </DataContext.Provider>
  )
}

export function useData() {
  const context = useContext(DataContext)
  if (!context) throw new Error("useData must be used within a DataProvider")
  return context
}
