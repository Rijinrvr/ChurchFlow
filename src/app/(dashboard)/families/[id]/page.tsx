"use client"

import { useState, useMemo } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import {
  ArrowLeft,
  Phone,
  MapPin,
  Users,
  Plus,
  Calendar,
  UserCheck,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useData } from "@/lib/data-context"
import { formatDate, formatCurrency } from "@/lib/utils"
import { toast } from "sonner"

export default function FamilyDetailPage() {
  const params = useParams()
  const { families, transactions, addMember } = useData()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [newMember, setNewMember] = useState({
    name: "",
    phone: "",
    dob: "",
    gender: "male" as "male" | "female",
    role: "",
  })

  const family = families.find((f) => f.id === params.id)

  const familyTransactions = useMemo(
    () => transactions.filter((t) => t.familyId === params.id).slice(0, 20),
    [transactions, params.id]
  )

  const totalContribution = useMemo(
    () =>
      transactions
        .filter((t) => t.familyId === params.id && t.type === "income")
        .reduce((s, t) => s + t.amount, 0),
    [transactions, params.id]
  )

  if (!family) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <div className="text-center space-y-3">
          <p className="text-muted-foreground">Family not found</p>
          <Link href="/families">
            <Button variant="outline">Go Back</Button>
          </Link>
        </div>
      </div>
    )
  }

  function handleAddMember() {
    if (!newMember.name || !newMember.dob) {
      toast.error("Please fill in required fields")
      return
    }
    addMember({
      ...newMember,
      familyId: family!.id,
    })
    toast.success("Member added successfully!")
    setNewMember({ name: "", phone: "", dob: "", gender: "male", role: "" })
    setDialogOpen(false)
  }

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Link href="/families">
        <Button variant="ghost" className="gap-2 -ml-2">
          <ArrowLeft className="h-4 w-4" /> Back to Families
        </Button>
      </Link>

      {/* Family Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Card className="border-0 shadow-sm overflow-hidden">
          <div className="h-2 bg-gradient-to-r from-primary via-primary/80 to-primary/50" />
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarFallback className="bg-primary/10 text-primary text-xl font-bold">
                    {family.familyNo}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="text-2xl font-bold">{family.houseName}</h2>
                  <p className="text-muted-foreground">Family No: {family.familyNo}</p>
                  <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <UserCheck className="h-3.5 w-3.5" /> {family.headOfFamily}
                    </span>
                    <span className="flex items-center gap-1">
                      <Phone className="h-3.5 w-3.5" /> {family.phone}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5" /> {family.address}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex gap-3">
                <Card className="border-0 bg-primary/5 dark:bg-primary/10">
                  <CardContent className="p-3 text-center">
                    <p className="text-2xl font-bold text-primary">{family.members.length}</p>
                    <p className="text-xs text-muted-foreground">Members</p>
                  </CardContent>
                </Card>
                <Card className="border-0 bg-emerald-50 dark:bg-emerald-950/30">
                  <CardContent className="p-3 text-center">
                    <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                      {formatCurrency(totalContribution)}
                    </p>
                    <p className="text-xs text-muted-foreground">Total Contributed</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Members */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Card className="border-0 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base">Members</CardTitle>
              <CardDescription>Family members list</CardDescription>
            </div>
            <Button size="sm" onClick={() => setDialogOpen(true)} className="gap-2">
              <Plus className="h-4 w-4" /> Add Member
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="text-xs">Member ID</TableHead>
                  <TableHead className="text-xs">Name</TableHead>
                  <TableHead className="text-xs">Role</TableHead>
                  <TableHead className="text-xs">DOB</TableHead>
                  <TableHead className="text-xs">Phone</TableHead>
                  <TableHead className="text-xs">Gender</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {family.members.map((member) => (
                  <TableRow key={member.id}>
                    <TableCell>
                      <Badge variant="secondary" className="font-mono text-xs">{member.memberId}</Badge>
                    </TableCell>
                    <TableCell>
                      <Link href={`/members/${member.id}`} className="flex items-center gap-2 hover:text-primary">
                        <Avatar className="h-7 w-7">
                          <AvatarFallback className="text-[10px] bg-primary/10 text-primary">
                            {member.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-medium text-sm">{member.name}</span>
                      </Link>
                    </TableCell>
                    <TableCell><Badge variant="outline" className="text-xs">{member.role}</Badge></TableCell>
                    <TableCell className="text-sm text-muted-foreground">{formatDate(member.dob)}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{member.phone}</TableCell>
                    <TableCell className="capitalize text-sm text-muted-foreground">{member.gender}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </motion.div>

      {/* Contribution History */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-base">Contribution History</CardTitle>
            <CardDescription>Recent transactions by this family</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="text-xs">Date</TableHead>
                  <TableHead className="text-xs">Receipt</TableHead>
                  <TableHead className="text-xs">Category</TableHead>
                  <TableHead className="text-xs">Member</TableHead>
                  <TableHead className="text-xs text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {familyTransactions.map((t) => (
                  <TableRow key={t.id}>
                    <TableCell className="text-xs text-muted-foreground">{formatDate(t.date)}</TableCell>
                    <TableCell className="font-mono text-xs">{t.receiptNo}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="text-[10px]">{t.category}</Badge>
                    </TableCell>
                    <TableCell className="text-xs">{t.memberName}</TableCell>
                    <TableCell className="text-right font-semibold text-xs text-emerald-600 dark:text-emerald-400">
                      {formatCurrency(t.amount)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </motion.div>

      {/* Add Member Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add Member to {family.houseName}</DialogTitle>
            <DialogDescription>
              Member ID will be auto-generated based on family number {family.familyNo}.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Name *</Label>
              <Input value={newMember.name} onChange={(e) => setNewMember({ ...newMember, name: e.target.value })} placeholder="Enter full name" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Date of Birth *</Label>
                <Input type="date" value={newMember.dob} onChange={(e) => setNewMember({ ...newMember, dob: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Gender</Label>
                <Select value={newMember.gender} onValueChange={(v) => v && setNewMember({ ...newMember, gender: v as "male" | "female" })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Role</Label>
              <Input value={newMember.role} onChange={(e) => setNewMember({ ...newMember, role: e.target.value })} placeholder="e.g. Son, Daughter, Spouse" />
            </div>
            <div className="space-y-2">
              <Label>Phone</Label>
              <Input value={newMember.phone} onChange={(e) => setNewMember({ ...newMember, phone: e.target.value })} placeholder="Phone number" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleAddMember}>Add Member</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
