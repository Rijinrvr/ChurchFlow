"use client"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import {
  Users,
  Plus,
  Search,
  MoreHorizontal,
  Eye,
  Pencil,
  Trash2,
  Phone,
  Home,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { useData } from "@/lib/data-context"
import { toast } from "sonner"

export default function FamiliesPage() {
  const { families, addFamily } = useData()
  const [search, setSearch] = useState("")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [newFamily, setNewFamily] = useState({
    headOfFamily: "",
    houseName: "",
    phone: "",
    address: "",
  })

  const filtered = families.filter(
    (f) =>
      f.headOfFamily.toLowerCase().includes(search.toLowerCase()) ||
      f.houseName.toLowerCase().includes(search.toLowerCase()) ||
      f.familyNo.toString().includes(search)
  )

  function handleAddFamily() {
    if (!newFamily.headOfFamily || !newFamily.houseName) {
      toast.error("Please fill in required fields")
      return
    }
    addFamily(newFamily)
    toast.success("Family added successfully!")
    setNewFamily({ headOfFamily: "", houseName: "", phone: "", address: "" })
    setDialogOpen(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Families</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage church families and their details
          </p>
        </div>
        <Button onClick={() => setDialogOpen(true)} className="gap-2 shadow-md shadow-primary/20">
          <Plus className="h-4 w-4" />
          Add Family
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "Total Families", value: families.length, icon: Users, color: "text-blue-600" },
          { label: "Total Members", value: families.reduce((s, f) => s + f.members.length, 0), icon: Users, color: "text-indigo-600" },
          { label: "Avg. Members/Family", value: (families.reduce((s, f) => s + f.members.length, 0) / families.length).toFixed(1), icon: Home, color: "text-green-600" },
        ].map((stat, i) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
            <Card className="border-0 shadow-sm">
              <CardContent className="p-4 flex items-center gap-3">
                <div className={`h-10 w-10 rounded-xl bg-muted flex items-center justify-center ${stat.color}`}>
                  <stat.icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                  <p className="text-xl font-bold">{stat.value}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Table */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <CardTitle className="text-base">All Families</CardTitle>
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search families..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 h-9 bg-muted/50 border-0"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="text-xs">Family No</TableHead>
                  <TableHead className="text-xs">Head of Family</TableHead>
                  <TableHead className="text-xs">House Name</TableHead>
                  <TableHead className="text-xs text-center">Members</TableHead>
                  <TableHead className="text-xs">Phone</TableHead>
                  <TableHead className="text-xs text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((family, i) => (
                  <motion.tr
                    key={family.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.02 }}
                    className="group hover:bg-muted/50 cursor-pointer border-b border-border/50"
                  >
                    <TableCell>
                      <Badge variant="secondary" className="font-mono text-xs">
                        {family.familyNo}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Link href={`/families/${family.id}`} className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="bg-primary/10 text-primary text-xs">
                            {family.headOfFamily.split(" ").map(n => n[0]).join("").slice(0, 2)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-medium text-sm hover:text-primary transition-colors">
                          {family.headOfFamily}
                        </span>
                      </Link>
                    </TableCell>
                    <TableCell className="text-sm">{family.houseName}</TableCell>
                    <TableCell className="text-center">
                      <Badge variant="outline" className="text-xs">
                        {family.members.length}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Phone className="h-3 w-3" />
                        {family.phone}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger className="inline-flex items-center justify-center h-8 w-8 rounded-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-accent hover:text-accent-foreground">
                            <MoreHorizontal className="h-4 w-4" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => window.location.href = `/families/${family.id}`}>
                              <Eye className="mr-2 h-4 w-4" /> View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem><Pencil className="mr-2 h-4 w-4" /> Edit</DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive"><Trash2 className="mr-2 h-4 w-4" /> Delete</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </motion.tr>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Add Family Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New Family</DialogTitle>
            <DialogDescription>Register a new family in the church.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Head of Family *</Label>
              <Input value={newFamily.headOfFamily} onChange={(e) => setNewFamily({ ...newFamily, headOfFamily: e.target.value })} placeholder="Enter name" />
            </div>
            <div className="space-y-2">
              <Label>House Name *</Label>
              <Input value={newFamily.houseName} onChange={(e) => setNewFamily({ ...newFamily, houseName: e.target.value })} placeholder="Enter house name" />
            </div>
            <div className="space-y-2">
              <Label>Phone</Label>
              <Input value={newFamily.phone} onChange={(e) => setNewFamily({ ...newFamily, phone: e.target.value })} placeholder="Enter phone number" />
            </div>
            <div className="space-y-2">
              <Label>Address</Label>
              <Input value={newFamily.address} onChange={(e) => setNewFamily({ ...newFamily, address: e.target.value })} placeholder="Enter address" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleAddFamily}>Add Family</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
