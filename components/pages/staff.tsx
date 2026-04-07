"use client"

import { useLeave } from "@/lib/leave-context"
import { LeaveCard } from "@/components/leave-card"
import { PageLayout } from "@/components/page-layout"
import { ShieldCheck, SearchX, Layers } from "lucide-react"
import { useState, useMemo } from "react"
import { DashboardHeader } from "@/components/dashboard-header"

export function StaffDashboard() {
  const { leaves } = useLeave()
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("pending")

  // Filter logic
  const filteredLeaves = useMemo(() => {
    return leaves.filter(l => {
      const matchesSearch = l.reason.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesFilter =
        filterStatus === "all" ||
        (filterStatus === "approved" && ["staff_approved", "hod_approved"].includes(l.status)) ||
        l.status === filterStatus
      return matchesSearch && matchesFilter
    })
  }, [leaves, searchTerm, filterStatus])

  // Stats calculation
  const stats = useMemo(() => {
    return {
      total: leaves.length,
      pending: leaves.filter(l => l.status === "pending").length,
      approved: leaves.filter(l => l.status === "staff_approved" || l.status === "hod_approved").length,
      rejected: leaves.filter(l => l.status === "rejected").length,
    }
  }, [leaves])

  return (
    <PageLayout 
        title="Staff Approval Dashboard" 
        description="Review and process incoming student leave requests"
    >
      <div className="space-y-8 max-w-6xl mx-auto">
        <DashboardHeader
          total={stats.total}
          pending={stats.pending}
          approved={stats.approved}
          rejected={stats.rejected}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          filterStatus={filterStatus}
          onFilterChange={setFilterStatus}
        />

        <div className="space-y-6">
          <div className="flex items-center gap-2 border-b border-border/50 pb-4">
             <ShieldCheck className="h-5 w-5 text-primary opacity-50" />
             <h2 className="text-xl font-black italic tracking-tighter text-foreground uppercase opacity-80">
                {filterStatus === "pending" ? "Pending Approval" : "Processed Applications"}
             </h2>
          </div>

          {filteredLeaves.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 px-4 bg-white rounded-3xl border-2 border-dashed border-border/50 group hover:border-primary/30 transition-colors">
               <div className="h-24 w-24 rounded-full bg-muted/50 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-primary/10 transition-all duration-500">
                   <SearchX className="h-10 w-10 text-muted-foreground group-hover:text-primary transition-colors" />
               </div>
               <p className="text-xl font-black text-foreground italic tracking-tight">No results found!</p>
               <p className="text-sm text-muted-foreground font-medium mt-1">Try adjusting your filters or search query.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-in fade-in duration-700">
                {filteredLeaves.map(leave => (
                  <LeaveCard key={leave._id || leave.id} leave={leave} />
                ))}
            </div>
          )}
        </div>
      </div>
    </PageLayout>
  )
}
