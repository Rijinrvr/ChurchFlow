"use client"

import { motion } from "framer-motion"
import { Settings, Shield, Database, Church, Save, Upload, Download, RefreshCw } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table"
import { toast } from "sonner"

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">Manage application settings</p>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList>
          <TabsTrigger value="general" className="gap-2"><Settings className="h-3.5 w-3.5" /> General</TabsTrigger>
          <TabsTrigger value="users" className="gap-2"><Shield className="h-3.5 w-3.5" /> Users</TabsTrigger>
          <TabsTrigger value="backup" className="gap-2"><Database className="h-3.5 w-3.5" /> Backup</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Church className="h-4 w-4 text-primary" /> Church Information
                </CardTitle>
                <CardDescription>Basic details about your church</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Church Name</Label>
                    <Input defaultValue="St. Mary's Orthodox Church" />
                  </div>
                  <div className="space-y-2">
                    <Label>Phone</Label>
                    <Input defaultValue="+91 9847000000" />
                  </div>
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input defaultValue="church@example.com" />
                  </div>
                  <div className="space-y-2">
                    <Label>Website</Label>
                    <Input defaultValue="https://stmarys.church" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Address</Label>
                  <Textarea defaultValue="Kottayam, Kerala, India - 686001" rows={2} />
                </div>
                <Separator />
                <div className="space-y-4">
                  <h3 className="text-sm font-medium">Preferences</h3>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Auto-generate Receipt Numbers</p>
                      <p className="text-xs text-muted-foreground">Automatically assign receipt numbers</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Email Notifications</p>
                      <p className="text-xs text-muted-foreground">Send email reminders for pending contributions</p>
                    </div>
                    <Switch />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">SMS Notifications</p>
                      <p className="text-xs text-muted-foreground">Send SMS for birthday reminders</p>
                    </div>
                    <Switch />
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button className="gap-2" onClick={() => toast.success("Settings saved!")}>
                    <Save className="h-4 w-4" /> Save Changes
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        <TabsContent value="users" className="space-y-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Card className="border-0 shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-base">User Management</CardTitle>
                  <CardDescription>Manage admin and staff accounts</CardDescription>
                </div>
                <Button size="sm" className="gap-2">Add User</Button>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent">
                      <TableHead className="text-xs">User</TableHead>
                      <TableHead className="text-xs">Email</TableHead>
                      <TableHead className="text-xs">Role</TableHead>
                      <TableHead className="text-xs">Status</TableHead>
                      <TableHead className="text-xs">Last Login</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {[
                      { name: "Admin User", email: "admin@church.org", role: "Admin", status: "Active", lastLogin: "Today" },
                      { name: "Fr. Thomas", email: "thomas@church.org", role: "Staff", status: "Active", lastLogin: "Yesterday" },
                      { name: "Deacon Samuel", email: "samuel@church.org", role: "Staff", status: "Active", lastLogin: "3 days ago" },
                      { name: "Office Staff", email: "office@church.org", role: "Viewer", status: "Inactive", lastLogin: "1 week ago" },
                    ].map((user) => (
                      <TableRow key={user.email}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Avatar className="h-7 w-7">
                              <AvatarFallback className="text-[10px] bg-primary/10 text-primary">
                                {user.name.split(" ").map(n => n[0]).join("")}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-sm font-medium">{user.name}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">{user.email}</TableCell>
                        <TableCell><Badge variant={user.role === "Admin" ? "default" : "secondary"} className="text-xs">{user.role}</Badge></TableCell>
                        <TableCell>
                          <Badge variant={user.status === "Active" ? "outline" : "secondary"} className={`text-xs ${user.status === "Active" ? "text-emerald-600 border-emerald-200 dark:border-emerald-800" : ""}`}>
                            {user.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground">{user.lastLogin}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        <TabsContent value="backup" className="space-y-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Database className="h-4 w-4 text-primary" /> Backup & Restore
                </CardTitle>
                <CardDescription>Manage your data backups</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="border bg-muted/30">
                    <CardContent className="p-4 text-center space-y-2">
                      <Download className="h-8 w-8 mx-auto text-primary" />
                      <h3 className="text-sm font-medium">Export Data</h3>
                      <p className="text-xs text-muted-foreground">Download all data as JSON</p>
                      <Button variant="outline" size="sm" className="w-full" onClick={() => toast.success("Export started!")}>
                        Export
                      </Button>
                    </CardContent>
                  </Card>
                  <Card className="border bg-muted/30">
                    <CardContent className="p-4 text-center space-y-2">
                      <Upload className="h-8 w-8 mx-auto text-emerald-600" />
                      <h3 className="text-sm font-medium">Import Data</h3>
                      <p className="text-xs text-muted-foreground">Restore from backup file</p>
                      <Button variant="outline" size="sm" className="w-full">Import</Button>
                    </CardContent>
                  </Card>
                  <Card className="border bg-muted/30">
                    <CardContent className="p-4 text-center space-y-2">
                      <RefreshCw className="h-8 w-8 mx-auto text-amber-600" />
                      <h3 className="text-sm font-medium">Auto Backup</h3>
                      <p className="text-xs text-muted-foreground">Schedule automatic backups</p>
                      <Button variant="outline" size="sm" className="w-full">Configure</Button>
                    </CardContent>
                  </Card>
                </div>

                <Separator />

                <div>
                  <h3 className="text-sm font-medium mb-3">Recent Backups</h3>
                  <div className="space-y-2">
                    {[
                      { date: "30 Jun 2026, 10:00 AM", size: "2.4 MB", type: "Auto" },
                      { date: "29 Jun 2026, 10:00 AM", size: "2.3 MB", type: "Auto" },
                      { date: "28 Jun 2026, 02:30 PM", size: "2.3 MB", type: "Manual" },
                      { date: "25 Jun 2026, 10:00 AM", size: "2.2 MB", type: "Auto" },
                    ].map((backup, i) => (
                      <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                        <div className="flex items-center gap-3">
                          <Database className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <p className="text-sm font-medium">{backup.date}</p>
                            <p className="text-xs text-muted-foreground">{backup.size} • {backup.type}</p>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm" className="text-xs">
                          <Download className="h-3.5 w-3.5 mr-1" /> Download
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
