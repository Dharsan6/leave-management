"use client"

import { useState } from "react"
import { PageLayout } from "@/components/page-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { StatusBadge } from "@/components/status-badge"
import { LeaveTypeBadge } from "@/components/leave-type-badge"
import { mockLeaveRequests, type LeaveRequest } from "@/lib/mock-data"
import {
  Clock,
  CheckCircle,
  XCircle,
  ChevronDown,
  ChevronUp,
  User,
  Calendar,
  FileText,
  ShieldCheck,
  Building,
} from "lucide-react"
import { cn } from "@/lib/utils"

// Filter staff-approved requests for HOD to approve
const staffApprovedRequests = mockLeaveRequests.filter(
  (leave) => leave.status === "staff_approved"
)

export default function HODApprovalPage() {
  const [requests, setRequests] = useState<LeaveRequest[]>(staffApprovedRequests)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [comments, setComments] = useState<Record<string, string>>({})

  const handleApprove = (id: string) => {
    setRequests((prev) =>
      prev.map((req) =>
        req.id === id
          ? {
              ...req,
              status: "hod_approved" as const,
              hodApproval: {
                approved: true,
                approvedBy: "Prof. David Miller",
                approvedDate: new Date().toISOString().split("T")[0],
                comments: comments[id] || "Final approval granted.",
              },
            }
          : req
      )
    )
    setExpandedId(null)
  }

  const handleReject = (id: string) => {
    setRequests((prev) =>
      prev.map((req) =>
        req.id === id
          ? {
              ...req,
              status: "rejected" as const,
              hodApproval: {
                approved: false,
                approvedBy: "Prof. David Miller",
                approvedDate: new Date().toISOString().split("T")[0],
                comments: comments[id] || "Request denied by HOD.",
              },
            }
          : req
      )
    )
    setExpandedId(null)
  }

  const pendingCount = requests.filter(
    (r) => r.status === "staff_approved"
  ).length
  const approvedCount = requests.filter((r) => r.status === "hod_approved").length
  const rejectedCount = requests.filter((r) => r.status === "rejected").length

  return (
    <PageLayout
      title="HOD Approval"
      description="Final approval for staff-reviewed leave requests"
    >
      <div className="space-y-6">
        {/* HOD Info Banner */}
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <ShieldCheck className="h-6 w-6 text-primary" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-foreground">
                Head of Department - Computer Science
              </p>
              <p className="text-sm text-muted-foreground">
                Prof. David Miller &bull; Final approval authority for leave
                requests
              </p>
            </div>
            <div className="flex items-center gap-2 rounded-lg bg-card px-4 py-2">
              <Building className="h-5 w-5 text-muted-foreground" />
              <span className="text-sm font-medium text-foreground">
                CS Department
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardContent className="flex items-center gap-4 p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Clock className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">
                  Awaiting Final Approval
                </p>
                <p className="text-2xl font-semibold text-foreground">
                  {pendingCount}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center gap-4 p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-success/10">
                <CheckCircle className="h-6 w-6 text-success" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">
                  Approved This Month
                </p>
                <p className="text-2xl font-semibold text-foreground">
                  {approvedCount}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center gap-4 p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-destructive/10">
                <XCircle className="h-6 w-6 text-destructive" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">
                  Rejected This Month
                </p>
                <p className="text-2xl font-semibold text-foreground">
                  {rejectedCount}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Requests List */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Staff-Approved Requests</CardTitle>
            <span className="rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
              {pendingCount} pending
            </span>
          </CardHeader>
          <CardContent>
            {requests.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                  <FileText className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="mt-4 text-lg font-medium text-foreground">
                  No pending requests
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  All staff-approved requests have been processed
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {requests.map((request) => (
                  <div
                    key={request.id}
                    className={cn(
                      "rounded-lg border border-border transition-all",
                      expandedId === request.id && "ring-2 ring-primary/20"
                    )}
                  >
                    {/* Request Header */}
                    <button
                      onClick={() =>
                        setExpandedId(
                          expandedId === request.id ? null : request.id
                        )
                      }
                      className="flex w-full items-center justify-between p-4 text-left"
                    >
                      <div className="flex items-center gap-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-medium text-primary">
                          {request.studentName
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-medium text-foreground">
                              {request.studentName}
                            </p>
                            <StatusBadge status={request.status} />
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {request.studentId} &bull; {request.department}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <LeaveTypeBadge type={request.leaveType} />
                        {expandedId === request.id ? (
                          <ChevronUp className="h-5 w-5 text-muted-foreground" />
                        ) : (
                          <ChevronDown className="h-5 w-5 text-muted-foreground" />
                        )}
                      </div>
                    </button>

                    {/* Expanded Details */}
                    {expandedId === request.id && (
                      <div className="border-t border-border bg-muted/30 p-4">
                        <div className="grid gap-6 lg:grid-cols-3">
                          {/* Leave Details */}
                          <div className="space-y-4">
                            <h4 className="text-sm font-medium text-foreground">
                              Leave Details
                            </h4>
                            <div className="flex items-center gap-3">
                              <Calendar className="h-5 w-5 text-muted-foreground" />
                              <div>
                                <p className="text-xs text-muted-foreground">
                                  Duration
                                </p>
                                <p className="text-sm font-medium text-foreground">
                                  {new Date(
                                    request.startDate
                                  ).toLocaleDateString("en-US", {
                                    month: "short",
                                    day: "numeric",
                                  })}{" "}
                                  -{" "}
                                  {new Date(request.endDate).toLocaleDateString(
                                    "en-US",
                                    {
                                      month: "short",
                                      day: "numeric",
                                      year: "numeric",
                                    }
                                  )}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-start gap-3">
                              <FileText className="mt-0.5 h-5 w-5 text-muted-foreground" />
                              <div>
                                <p className="text-xs text-muted-foreground">
                                  Reason
                                </p>
                                <p className="text-sm text-foreground">
                                  {request.reason}
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* Staff Approval Info */}
                          {request.staffApproval && (
                            <div className="space-y-4">
                              <h4 className="text-sm font-medium text-foreground">
                                Staff Review
                              </h4>
                              <div className="rounded-lg border border-success/20 bg-success/5 p-4">
                                <div className="flex items-center gap-2">
                                  <CheckCircle className="h-4 w-4 text-success" />
                                  <span className="text-sm font-medium text-foreground">
                                    Approved by Staff
                                  </span>
                                </div>
                                <div className="mt-2 flex items-center gap-2">
                                  <User className="h-4 w-4 text-muted-foreground" />
                                  <span className="text-sm text-muted-foreground">
                                    {request.staffApproval.approvedBy}
                                  </span>
                                </div>
                                <div className="mt-1 flex items-center gap-2">
                                  <Calendar className="h-4 w-4 text-muted-foreground" />
                                  <span className="text-sm text-muted-foreground">
                                    {new Date(
                                      request.staffApproval.approvedDate
                                    ).toLocaleDateString("en-US", {
                                      month: "long",
                                      day: "numeric",
                                      year: "numeric",
                                    })}
                                  </span>
                                </div>
                                {request.staffApproval.comments && (
                                  <p className="mt-2 text-sm italic text-muted-foreground">
                                    &quot;{request.staffApproval.comments}&quot;
                                  </p>
                                )}
                              </div>
                            </div>
                          )}

                          {/* Action Section */}
                          {request.status === "staff_approved" && (
                            <div className="space-y-4">
                              <h4 className="text-sm font-medium text-foreground">
                                Final Decision
                              </h4>
                              <Textarea
                                placeholder="Add your comments (optional)..."
                                value={comments[request.id] || ""}
                                onChange={(e) =>
                                  setComments((prev) => ({
                                    ...prev,
                                    [request.id]: e.target.value,
                                  }))
                                }
                                rows={3}
                              />
                              <div className="flex gap-3">
                                <Button
                                  onClick={() => handleApprove(request.id)}
                                  className="flex-1 bg-success text-success-foreground hover:bg-success/90"
                                >
                                  <CheckCircle className="mr-2 h-4 w-4" />
                                  Grant Final Approval
                                </Button>
                                <Button
                                  onClick={() => handleReject(request.id)}
                                  variant="destructive"
                                  className="flex-1"
                                >
                                  <XCircle className="mr-2 h-4 w-4" />
                                  Reject
                                </Button>
                              </div>
                            </div>
                          )}

                          {/* Show HOD approval info for processed requests */}
                          {(request.status === "hod_approved" ||
                            (request.status === "rejected" &&
                              request.hodApproval)) &&
                            request.hodApproval && (
                              <div className="space-y-4">
                                <h4 className="text-sm font-medium text-foreground">
                                  HOD Decision
                                </h4>
                                <div
                                  className={cn(
                                    "rounded-lg border p-4",
                                    request.hodApproval.approved
                                      ? "border-success/20 bg-success/5"
                                      : "border-destructive/20 bg-destructive/5"
                                  )}
                                >
                                  <div className="flex items-center gap-2">
                                    {request.hodApproval.approved ? (
                                      <CheckCircle className="h-4 w-4 text-success" />
                                    ) : (
                                      <XCircle className="h-4 w-4 text-destructive" />
                                    )}
                                    <span className="text-sm font-medium text-foreground">
                                      {request.hodApproval.approved
                                        ? "Final Approval Granted"
                                        : "Rejected by HOD"}
                                    </span>
                                  </div>
                                  <p className="mt-2 text-sm text-muted-foreground">
                                    By {request.hodApproval.approvedBy}
                                  </p>
                                  {request.hodApproval.comments && (
                                    <p className="mt-2 text-sm italic text-muted-foreground">
                                      &quot;{request.hodApproval.comments}&quot;
                                    </p>
                                  )}
                                </div>
                              </div>
                            )}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  )
}
