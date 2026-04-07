import { cn } from "@/lib/utils"
import type { LeaveType } from "@/lib/mock-data"
import { Activity, Calendar, AlertTriangle, BookOpen } from "lucide-react"

const typeConfig: Record<
  LeaveType,
  { label: string; icon: typeof Activity; className: string }
> = {
  sick: {
    label: "Sick Leave",
    icon: Activity,
    className: "text-destructive",
  },
  casual: {
    label: "Casual Leave",
    icon: Calendar,
    className: "text-primary",
  },
  emergency: {
    label: "Emergency",
    icon: AlertTriangle,
    className: "text-warning-foreground",
  },
  academic: {
    label: "Academic",
    icon: BookOpen,
    className: "text-chart-3",
  },
}

interface LeaveTypeBadgeProps {
  type: LeaveType
  className?: string
  showIcon?: boolean
}

export function LeaveTypeBadge({
  type,
  className,
  showIcon = true,
}: LeaveTypeBadgeProps) {
  const config = typeConfig[type]
  const Icon = config.icon

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 text-sm font-medium",
        config.className,
        className
      )}
    >
      {showIcon && <Icon className="h-4 w-4" />}
      {config.label}
    </span>
  )
}
