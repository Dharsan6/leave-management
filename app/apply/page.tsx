"use client"

import { useState } from "react"
import { PageLayout } from "@/components/page-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { studentInfo, leaveBalance } from "@/lib/mock-data"
import {
  Calendar,
  Upload,
  CheckCircle,
  Activity,
  AlertTriangle,
  BookOpen,
} from "lucide-react"

export default function ApplyLeavePage() {
  const [leaveType, setLeaveType] = useState<string>("")
  const [startDate, setStartDate] = useState<string>("")
  const [endDate, setEndDate] = useState<string>("")
  const [reason, setReason] = useState<string>("")
  const [file, setFile] = useState<File | null>(null)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
    // Reset form after a delay
    setTimeout(() => {
      setSubmitted(false)
      setLeaveType("")
      setStartDate("")
      setEndDate("")
      setReason("")
      setFile(null)
    }, 3000)
  }

  const getLeaveBalance = (type: string) => {
    switch (type) {
      case "sick":
        return leaveBalance.sick
      case "casual":
        return leaveBalance.casual
      case "emergency":
        return leaveBalance.emergency
      case "academic":
        return leaveBalance.academic
      default:
        return null
    }
  }

  const selectedBalance = getLeaveBalance(leaveType)

  if (submitted) {
    return (
      <PageLayout title="Apply for Leave" description="Submit a new leave application">
        <div className="flex min-h-[400px] items-center justify-center">
          <Card className="max-w-md text-center">
            <CardContent className="p-8">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-success/10">
                <CheckCircle className="h-8 w-8 text-success" />
              </div>
              <h2 className="mb-2 text-xl font-semibold text-foreground">
                Application Submitted
              </h2>
              <p className="text-muted-foreground">
                Your leave application has been submitted successfully. You will
                be notified once it is reviewed.
              </p>
            </CardContent>
          </Card>
        </div>
      </PageLayout>
    )
  }

  return (
    <PageLayout title="Apply for Leave" description="Submit a new leave application">
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Form */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Leave Application Form</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Student Info (Read-only) */}
                <div className="rounded-lg border border-border bg-muted/50 p-4">
                  <h3 className="mb-3 text-sm font-medium text-foreground">
                    Student Information
                  </h3>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <Label className="text-xs text-muted-foreground">Name</Label>
                      <p className="text-sm font-medium text-foreground">
                        {studentInfo.name}
                      </p>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">
                        Student ID
                      </Label>
                      <p className="text-sm font-medium text-foreground">
                        {studentInfo.id}
                      </p>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">
                        Department
                      </Label>
                      <p className="text-sm font-medium text-foreground">
                        {studentInfo.department}
                      </p>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">
                        Semester
                      </Label>
                      <p className="text-sm font-medium text-foreground">
                        {studentInfo.semester}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Leave Type */}
                <div className="space-y-2">
                  <Label htmlFor="leaveType">Leave Type *</Label>
                  <Select value={leaveType} onValueChange={setLeaveType} required>
                    <SelectTrigger id="leaveType">
                      <SelectValue placeholder="Select leave type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sick">
                        <div className="flex items-center gap-2">
                          <Activity className="h-4 w-4 text-destructive" />
                          Sick Leave
                        </div>
                      </SelectItem>
                      <SelectItem value="casual">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-primary" />
                          Casual Leave
                        </div>
                      </SelectItem>
                      <SelectItem value="emergency">
                        <div className="flex items-center gap-2">
                          <AlertTriangle className="h-4 w-4 text-warning-foreground" />
                          Emergency Leave
                        </div>
                      </SelectItem>
                      <SelectItem value="academic">
                        <div className="flex items-center gap-2">
                          <BookOpen className="h-4 w-4 text-chart-3" />
                          Academic Leave
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  {selectedBalance && (
                    <p className="text-sm text-muted-foreground">
                      Available balance: {selectedBalance.remaining} of{" "}
                      {selectedBalance.total} days
                    </p>
                  )}
                </div>

                {/* Date Range */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="startDate">Start Date *</Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="endDate">End Date *</Label>
                    <Input
                      id="endDate"
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      min={startDate}
                      required
                    />
                  </div>
                </div>

                {/* Reason */}
                <div className="space-y-2">
                  <Label htmlFor="reason">Reason for Leave *</Label>
                  <Textarea
                    id="reason"
                    placeholder="Please provide a detailed reason for your leave request..."
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    rows={4}
                    required
                  />
                </div>

                {/* Supporting Document */}
                <div className="space-y-2">
                  <Label htmlFor="document">Supporting Document (Optional)</Label>
                  <div 
                    className="relative flex items-center justify-center rounded-lg border-2 border-dashed border-border bg-muted/30 p-6 transition-colors hover:border-primary/50 cursor-pointer"
                    onClick={() => {
                        const input = document.getElementById('document') as HTMLInputElement;
                        input?.click();
                    }}
                  >
                    <div className="text-center">
                      <Upload className="mx-auto h-8 w-8 text-muted-foreground" />
                      <p className="mt-2 text-sm text-muted-foreground">
                        {file ? file.name : "Click to browse or drag and drop"}
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {file ? `${(file.size / 1024).toFixed(1)} KB` : "PDF, JPG, PNG up to 5MB"}
                      </p>
                    </div>
                    <input
                      id="document"
                      type="file"
                      className="hidden"
                      onChange={(e) => setFile(e.target.files?.[0] || null)}
                      accept=".pdf,.jpg,.jpeg,.png"
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <div className="flex gap-4">
                  <Button type="submit" className="flex-1">
                    Submit Application
                  </Button>
                  <Button type="button" variant="outline">
                    Save as Draft
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Leave Balance Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Your Leave Balance</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between rounded-lg border border-border p-3">
                <div className="flex items-center gap-2">
                  <Activity className="h-4 w-4 text-destructive" />
                  <span className="text-sm text-foreground">Sick</span>
                </div>
                <span className="text-sm font-medium text-foreground">
                  {leaveBalance.sick.remaining} days
                </span>
              </div>
              <div className="flex items-center justify-between rounded-lg border border-border p-3">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-primary" />
                  <span className="text-sm text-foreground">Casual</span>
                </div>
                <span className="text-sm font-medium text-foreground">
                  {leaveBalance.casual.remaining} days
                </span>
              </div>
              <div className="flex items-center justify-between rounded-lg border border-border p-3">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-warning-foreground" />
                  <span className="text-sm text-foreground">Emergency</span>
                </div>
                <span className="text-sm font-medium text-foreground">
                  {leaveBalance.emergency.remaining} days
                </span>
              </div>
              <div className="flex items-center justify-between rounded-lg border border-border p-3">
                <div className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-chart-3" />
                  <span className="text-sm text-foreground">Academic</span>
                </div>
                <span className="text-sm font-medium text-foreground">
                  {leaveBalance.academic.remaining} days
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Guidelines Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Guidelines</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary" />
                  Apply at least 2 days in advance for planned leaves
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary" />
                  Medical certificate required for sick leave exceeding 3 days
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary" />
                  Emergency leaves require supporting documents
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary" />
                  Leaves during exams are generally not approved
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageLayout>
  )
}
