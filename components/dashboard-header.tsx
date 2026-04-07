"use client"

import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Filter, Layers, Clock, CheckCircle2, XCircle } from "lucide-react"

interface DashboardHeaderProps {
  total: number
  pending: number
  approved: number
  rejected: number
  searchTerm: string
  onSearchChange: (value: string) => void
  filterStatus: string
  onFilterChange: (status: string) => void
}

export function DashboardHeader({
  total,
  pending,
  approved,
  rejected,
  searchTerm,
  onSearchChange,
  filterStatus,
  onFilterChange
}: DashboardHeaderProps) {
  const filterOptions = [
    { value: "all", label: "All" },
    { value: "pending", label: "Pending" },
    { value: "approved", label: "Approved" },
    { value: "rejected", label: "Rejected" },
  ]

  const stats = [
    { label: "Total Leaves", value: total, icon: Layers, color: "text-primary", bg: "bg-primary/10" },
    { label: "Pending", value: pending, icon: Clock, color: "text-warning-foreground", bg: "bg-warning/10" },
    { label: "Approved", value: approved, icon: CheckCircle2, color: "text-success", bg: "bg-success/10" },
    { label: "Rejected", value: rejected, icon: XCircle, color: "text-destructive", bg: "bg-destructive/10" },
  ]

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-top-4 duration-500">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <Card key={i} className="p-6 border-border/40 shadow-sm hover:shadow-md transition-shadow bg-white rounded-2xl overflow-hidden relative group">
            <div className={`absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform`}>
              <stat.icon className={`h-16 w-16 ${stat.color}`} />
            </div>
            <div className="flex items-center gap-4 relative z-10">
              <div className={`p-3 rounded-xl ${stat.bg}`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{stat.label}</span>
                <span className="text-2xl font-black italic tracking-tighter">{stat.value}</span>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Controls */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-border/40 shadow-sm">
        <div className="relative w-full md:w-96 group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <Input
            placeholder="Search by reason..." 
            className="pl-10 h-11 border-2 focus:ring-2 focus:ring-primary/20 rounded-xl"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto scrollbar-hide">
          <div className="flex bg-muted/50 p-1 rounded-xl items-center gap-1">
            {filterOptions.map((option) => (
              <Button
                key={option.value}
                variant={filterStatus === option.value ? "default" : "ghost"}
                size="sm"
                onClick={() => onFilterChange(option.value)}
                className={`rounded-lg h-9 font-black italic text-[11px] uppercase tracking-wider px-4 transition-all
                  ${filterStatus === option.value ? "shadow-lg shadow-primary/20" : "hover:bg-primary/5 hover:text-primary"}`}
              >
                {option.label}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
