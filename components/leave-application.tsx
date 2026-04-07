"use client"

import { useEffect, useRef, useState } from "react"
import { useLeave } from "@/lib/leave-context"
import { type LeaveRequest, type LeaveType } from "@/lib/mock-data"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Calendar, FileText, Type, ChevronLeft, Send, CheckCircle2, Upload, Paperclip } from "lucide-react"

interface LeaveApplicationProps {
  onBack: () => void
  editLeave?: LeaveRequest
}

export function LeaveApplication({ onBack, editLeave }: LeaveApplicationProps) {
  const { addLeave, updateLeave, user, showToast } = useLeave()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const isEditingPendingLeave = !editLeave || editLeave.status === "pending"

  const [formData, setFormData] = useState<{ leaveType: LeaveType; startDate: string; endDate: string; reason: string; description: string }>({
    leaveType: editLeave?.leaveType ?? "sick",
    startDate: editLeave?.startDate ?? "",
    endDate: editLeave?.endDate ?? "",
    reason: editLeave?.reason ?? "",
    description: "",
  })
  const [file, setFile] = useState<File | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  useEffect(() => {
    if (editLeave && editLeave.status !== "pending") {
      showToast("Only pending leave applications can be edited", "error")
      onBack()
    }
  }, [editLeave, onBack, showToast])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isEditingPendingLeave) return
    if (!formData.startDate || !formData.endDate || !formData.reason) return

    setIsSubmitting(true)

    if (editLeave?._id) {
      await updateLeave(editLeave._id, {
        leaveType: formData.leaveType as any,
        startDate: formData.startDate,
        endDate: formData.endDate,
        reason: formData.reason,
        attachmentName: file?.name || editLeave.attachmentName,
      })
    } else {
      await addLeave({
        studentName: user?.name || "Student",
        studentEmail: user?.email || "",
        studentId: "STU2024001",
        department: "Computer Science",
        leaveType: formData.leaveType as any,
        startDate: formData.startDate,
        endDate: formData.endDate,
        reason: formData.reason,
        attachmentName: file?.name,
      })
    }

    setIsSubmitting(false)
    setIsSuccess(true)
    setTimeout(onBack, 1500)
  }

  if (isSuccess) {
    return (
      <div className="max-w-2xl mx-auto py-12 animate-in fade-in duration-500">
        <Card className="border-success/20 bg-success/5 shadow-2xl flex flex-col items-center justify-center p-12 space-y-6 text-center">
          <div className="h-20 w-20 rounded-full bg-success flex items-center justify-center animate-bounce shadow-xl shadow-success/20">
            <CheckCircle2 className="h-10 w-10 text-white" />
          </div>
          <div className="space-y-2">
            <h2 className="text-3xl font-black italic tracking-tighter text-success-foreground">Application Submitted!</h2>
            <p className="text-muted-foreground font-medium">
              {editLeave ? "Your leave request has been updated successfully." : "Your leave request has been sent for review."}
            </p>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto py-8 space-y-6 animate-in slide-in-from-bottom-4 duration-500">
      <Button variant="ghost" onClick={onBack} className="group hover:bg-primary/10 hover:text-primary transition-all">
        <ChevronLeft className="h-4 w-4 mr-1 group-hover:-translate-x-1 transition-transform" />
        Back to Dashboard
      </Button>

      <Card className="border-border/50 shadow-2xl backdrop-blur-sm bg-card/80 overflow-hidden">
        <div className="h-2 bg-primary/40" />
        <CardHeader className="space-y-1">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <FileText className="h-6 w-6 text-primary" />
            </div>
            <CardTitle className="text-3xl font-black italic tracking-tighter">{editLeave ? "Edit Leave Request" : "Apply for Leave"}</CardTitle>
          </div>
          <CardDescription className="font-medium">All fields marked with * are required</CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit} className="relative">
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Leave Type */}
              <div className="space-y-2">
                <Label htmlFor="leaveType" className="text-xs font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                  <Type className="h-3 w-3" /> Leave Type *
                </Label>
                <Select
                  value={formData.leaveType}
                  onValueChange={(val: LeaveType) => setFormData(prev => ({ ...prev, leaveType: val }))}
                >
                  <SelectTrigger id="leaveType" className="h-11 border-2 focus:ring-primary/20 transition-all text-left">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sick">Sick Leave</SelectItem>
                    <SelectItem value="casual">Casual Leave</SelectItem>
                    <SelectItem value="emergency">Emergency Leave</SelectItem>
                    <SelectItem value="academic">Academic Leave</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Date Range */}
              <div className="space-y-4 md:space-y-0 md:contents">
                <div className="space-y-2">
                  <Label htmlFor="startDate" className="text-xs font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                    <Calendar className="h-3 w-3" /> From Date *
                  </Label>
                  <Input
                    id="startDate"
                    type="date"
                    className="h-11 border-2 focus:ring-primary/20 hover:border-primary/40 transition-all"
                    value={formData.startDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endDate" className="text-xs font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                    <Calendar className="h-3 w-3" /> To Date *
                  </Label>
                  <Input
                    id="endDate"
                    type="date"
                    className="h-11 border-2 focus:ring-primary/20 hover:border-primary/40 transition-all"
                    value={formData.endDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Reason */}
            <div className="space-y-2">
              <Label htmlFor="reason" className="text-xs font-black uppercase tracking-widest text-muted-foreground">Reason for Leave *</Label>
              <Textarea
                id="reason"
                placeholder="Briefly explain why you need this leave..."
                className="min-h-[100px] border-2 focus:ring-primary/20 focus:border-primary/40 transition-all"
                value={formData.reason}
                onChange={(e) => setFormData(prev => ({ ...prev, reason: e.target.value }))}
                required
              />
            </div>

            {/* Supporting Document - Corrected Fix */}
            <div className="space-y-3">
              <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                <Paperclip className="h-3 w-3" /> Supporting Document
              </Label>
              <div
                className="relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-border bg-muted/20 p-8 transition-all hover:bg-muted/30 hover:border-primary/30 group cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
              >
                <div className="text-center space-y-2">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                    <Upload className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-foreground italic">
                      {file ? file.name : "Click to upload medical certificate or proof"}
                    </p>
                    <p className="text-xs text-muted-foreground">PDF, JPG, or PNG (Max 5MB)</p>
                  </div>
                </div>
                {/* File input is isolated and relative ONLY to this container */}
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden" // Completely hidden, triggered via ref/click on container
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  accept=".pdf,.jpg,.jpeg,.png"
                />
              </div>
            </div>
          </CardContent>

          <CardFooter className="bg-muted/30 p-6 flex items-center justify-center">
            <Button
              type="submit"
              className="w-full h-14 font-black italic text-xl transition-all active:scale-[0.98] shadow-lg shadow-primary/20"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <span className="h-5 w-5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  Submitting Application...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Send className="h-5 w-5" />
                  Submit Application
                </div>
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
