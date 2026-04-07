"use client"

import { cn } from "@/lib/utils"
import { type LeaveStatus } from "@/lib/mock-data"

interface StatusBadgeProps {
  status: LeaveStatus
  role?: "student" | "staff" | "hod"
  className?: string
}

export function StatusBadge({ status, role, className }: StatusBadgeProps) {
  let label = status.replace("_", " ")
  let variant = "bg-muted text-muted-foreground"

  // Role-based mapping for students
  if (role === "student") {
    switch (status) {
      case "pending":
        label = "Pending"
        variant = "bg-warning/10 text-warning-foreground border-warning/20"
        break
      case "staff_approved":
        label = "Pending"
        variant = "bg-warning/10 text-warning-foreground border-warning/20"
        break
      case "hod_approved":
        label = "Approved"
        variant = "bg-success/10 text-success border-success/20"
        break
      case "rejected":
        label = "Rejected"
        variant = "bg-destructive/10 text-destructive border-destructive/20"
        break
    }
  } else {
    // Internal/Admin view
    switch (status) {
      case "pending":
        label = "Pending"
        variant = "bg-warning/10 text-warning-foreground border-warning/20"
        break
      case "staff_approved":
        label = "Staff Approved"
        variant = "bg-primary/10 text-primary border-primary/20"
        break
      case "hod_approved":
        label = "HOD Approved"
        variant = "bg-success/10 text-success border-success/20"
        break
      case "rejected":
        label = "Rejected"
        variant = "bg-destructive/10 text-destructive border-destructive/20"
        break
    }
  }

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold capitalize transition-colors",
        variant,
        className
      )}
    >
      {label}
    </span>
  )
}
