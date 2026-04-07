"use client"

import { useLeave } from "@/lib/leave-context"
import { type LeaveRequest } from "@/lib/mock-data"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { StatusBadge } from "@/components/status-badge"
import { LeaveTypeBadge } from "@/components/leave-type-badge"
import { Calendar, Clock, FileText, CheckCircle, XCircle, Paperclip, Edit, Trash2 } from "lucide-react"

interface LeaveCardProps {
  leave: LeaveRequest
  onEdit?: (leave: LeaveRequest) => void
}

export function LeaveCard({ leave, onEdit }: LeaveCardProps) {
  const { role, user, updateStatus, deleteLeave } = useLeave()
  const leaveId = leave._id || leave.id || ""

  const canApprove = (
    (role === "staff" && leave.status === "pending") ||
    (role === "hod" && leave.status === "staff_approved")
  )

  const isStudentPending = role === "student" && leave.status === "pending"

  const handleApprove = () => {
    const status = role === "staff" ? "staff_approved" : "hod_approved"
    const actor = user?.name || "Approver"
    updateStatus(leaveId, status, actor, "Approved via portal dashboard.")
  }

  const handleReject = () => {
    const actor = user?.name || "Approver"
    updateStatus(leaveId, "rejected", actor, "Rejected via portal dashboard.")
  }

  return (
    <Card className="bg-white rounded-xl border-border/40 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group overflow-hidden">
      <div className="h-1 w-full bg-primary/10 group-hover:bg-primary/30 transition-colors" />
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <div className="space-y-1">
          <CardTitle className="text-lg font-black italic tracking-tighter group-hover:text-primary transition-colors">
            {role === "student" ? leaveId.slice(-6).toUpperCase() : leave.studentName}
          </CardTitle>
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
            {role !== "student" && <span>{leave.studentId} &bull; {leave.department}</span>}
          </div>
        </div>
        <div className="flex items-center gap-2">
            <StatusBadge status={leave.status} role={role} />
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="flex flex-wrap items-center gap-3 text-xs">
          <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-muted/50 font-medium">
            <Calendar className="h-3 w-3 text-primary" />
            <span>
              {new Date(leave.startDate).toLocaleDateString()} - {new Date(leave.endDate).toLocaleDateString()}
            </span>
          </div>
          <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-muted/50 font-medium">
            <Clock className="h-3 w-3 text-primary" />
            <span>{new Date(leave.appliedDate).toLocaleDateString()}</span>
          </div>
          <LeaveTypeBadge type={leave.leaveType} />
        </div>

        <div className="bg-muted/30 px-4 py-3 rounded-xl flex items-start gap-3 border border-border/10">
          <FileText className="h-4 w-4 mt-0.5 text-muted-foreground shrink-0" />
          <p className="text-sm font-bold italic leading-relaxed tracking-tight">"{leave.reason}"</p>
        </div>

        {leave.attachmentName && (
            <div className="flex items-center gap-2 text-[10px] font-black text-primary italic uppercase tracking-wider bg-primary/5 px-3 py-1.5 rounded-full border border-primary/10 w-fit">
                <Paperclip className="h-3 w-3" />
                {leave.attachmentName}
            </div>
        )}

        {(leave.staffApproval || leave.hodApproval) && (role !== "student" || leave.status === "hod_approved" || leave.status === "rejected") && (
            <div className="mt-4 space-y-3 border-t border-border/50 pt-4">
               {leave.staffApproval && (
                   <div className="text-[10px] flex flex-col gap-1">
                       <span className="font-black text-muted-foreground uppercase tracking-widest">Staff Review</span>
                       <p className="text-xs font-bold italic tracking-tight">{leave.staffApproval.comments}</p>
                       <span className="text-muted-foreground italic opacity-60">Approved by {leave.staffApproval.approvedBy} on {leave.staffApproval.approvedDate}</span>
                   </div>
               )}
               {leave.hodApproval && (
                   <div className="text-[10px] flex flex-col gap-1">
                       <span className="font-black text-muted-foreground uppercase tracking-widest">HOD Review</span>
                       <p className="text-xs font-bold italic tracking-tight">{leave.hodApproval.comments}</p>
                       <span className="text-muted-foreground italic opacity-60">Finalized by {leave.hodApproval.approvedBy} on {leave.hodApproval.approvedDate}</span>
                   </div>
               )}
            </div>
        )}
      </CardContent>

      {(canApprove || isStudentPending) && (
        <CardFooter className="flex gap-2 pt-0 bg-muted/10 p-4 mt-2">
          {canApprove ? (
            <>
              <Button 
                className="flex-1 bg-success hover:bg-success/90 text-white font-black italic rounded-xl h-10 shadow-lg shadow-success/20" 
                onClick={handleApprove}
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Approve
              </Button>
              <Button 
                variant="destructive" 
                className="flex-1 font-black italic rounded-xl h-10 shadow-lg shadow-destructive/20" 
                onClick={handleReject}
              >
                <XCircle className="h-4 w-4 mr-2" />
                Reject
              </Button>
            </>
          ) : (
            <>
              <Button 
                variant="outline"
                className="flex-1 font-black italic border-2 rounded-xl h-10 hover:bg-primary/5 hover:text-primary transition-all" 
                onClick={() => onEdit?.(leave)}
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
              <Button 
                variant="ghost" 
                className="px-3 text-destructive hover:bg-destructive/10 rounded-xl h-10" 
                onClick={() => {
                  if (confirm("Delete this leave application?")) deleteLeave(leaveId)
                }}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </>
          )}
        </CardFooter>
      )}
    </Card>
  )
}
