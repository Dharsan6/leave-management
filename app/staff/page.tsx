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
} from "lucide-react"
import { cn } from "@/lib/utils"

// Filter pending requests for staff to approve
const pendingRequests = mockLeaveRequests.filter(
  (leave) => leave.status === "pending"
)

export default function StaffApprovalPage() {
  const [requests, setRequests] = useState<LeaveRequest[]>(pendingRequests)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [comments, setComments] = useState<Record<string, string>>({})

  const handleApprove = (id: string) => {
    setRequests((prev) =>
      prev.map((req) =>
        req.id === id
          ? {
              ...req,
              status: "staff_approved" as const,
              staffApproval: {
                approved: true,
                approvedBy: "Dr. Emily Roberts",
                approvedDate: new Date().toISOString().split("T")[0],
                comments: comments[id] || "Approved.",
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
              staffApproval: {
                approved: false,
                approvedBy: "Dr. Emily Roberts",
                approvedDate: new Date().toISOString().split("T")[0],
                comments: comments[id] || "Request denied.",
              },
            }
          : req
      )
    )
    setExpandedId(null)
  }

  const pendingCount = requests.filter((r) => r.status === "pending").length
  const approvedCount = requests.filter(
    (r) => r.status === "staff_approved"
  ).length
  const rejectedCount = requests.filter((r) => r.status === "rejected").length

  return (
    <PageLayout
      title="Staff Approval"
      description="Review and approve student leave requests"
    >
      <div className="space-y-6">
        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardContent className="flex items-center gap-4 p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-warning/10">
                <Clock className="h-6 w-6 text-warning-foreground" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Pending Review</p>
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
                <p className="text-sm text-muted-foreground">Approved Today</p>
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
                <p className="text-sm text-muted-foreground">Rejected Today</p>
                <p className="text-2xl font-semibold text-foreground">
                  {rejectedCount}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Requests List */}
        <Card>
          <CardHeader>
            <CardTitle>Leave Requests</CardTitle>
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
                  All leave requests have been processed
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
                        <div className="grid gap-6 md:grid-cols-2">
                          {/* Leave Details */}
                          <div className="space-y-4">
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
                                    month: "long",
                                    day: "numeric",
                                    year: "numeric",
                                  })}{" "}
                                  -{" "}
                                  {new Date(request.endDate).toLocaleDateString(
                                    "en-US",
                                    {
                                      month: "long",
                                      day: "numeric",
                                      year: "numeric",
                                    }
                                  )}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-start gap-3">
                              <User className="mt-0.5 h-5 w-5 text-muted-foreground" />
                              <div>
                                <p className="text-xs text-muted-foreground">
                                  Applied On
                                </p>
                                <p className="text-sm font-medium text-foreground">
                                  {new Date(
                                    request.appliedDate
                                  ).toLocaleDateString("en-US", {
                                    month: "long",
                                    day: "numeric",
                                    year: "numeric",
                                  })}
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

                          {/* Action Section */}
                          {request.status === "pending" && (
                            <div className="space-y-4">
                              <div>
                                <label className="mb-2 block text-sm font-medium text-foreground">
                                  Comments (Optional)
                                </label>
                                <Textarea
                                  placeholder="Add your comments here..."
                                  value={comments[request.id] || ""}
                                  onChange={(e) =>
                                    setComments((prev) => ({
                                      ...prev,
                                      [request.id]: e.target.value,
                                    }))
                                  }
                                  rows={3}
                                />
                              </div>
                              <div className="flex gap-3">
                                <Button
                                  onClick={() => handleApprove(request.id)}
                                  className="flex-1 bg-success text-success-foreground hover:bg-success/90"
                                >
                                  <CheckCircle className="mr-2 h-4 w-4" />
                                  Approve
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

                          {/* Show approval info for processed requests */}
                          {request.status !== "pending" &&
                            request.staffApproval && (
                              <div className="rounded-lg border border-border bg-card p-4">
                                <p className="text-xs text-muted-foreground">
                                  Decision by {request.staffApproval.approvedBy}
                                </p>
                                <p className="mt-1 text-sm font-medium text-foreground">
                                  {request.staffApproval.approved
                                    ? "Approved"
                                    : "Rejected"}
                                </p>
                                {request.staffApproval.comments && (
                                  <p className="mt-2 text-sm text-muted-foreground">
                                    {request.staffApproval.comments}
                                  </p>
                                )}
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
