"use client"

import { useLeave } from "@/lib/leave-context"
import { LeaveCard } from "@/components/leave-card"
import { PageLayout } from "@/components/page-layout"
import { Button } from "@/components/ui/button"
import { Plus, SearchX, Layers } from "lucide-react"
import { useState, useMemo } from "react"
import { DashboardHeader } from "@/components/dashboard-header"
import { type LeaveRequest } from "@/lib/mock-data"

interface StudentDashboardProps {
  onApply: (editLeave?: LeaveRequest) => void
}

export function StudentDashboard({ onApply }: StudentDashboardProps) {
  const { leaves, user } = useLeave()
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")

  // Filter logic
  const filteredLeaves = useMemo(() => {
    return leaves
      .filter(l => l.studentEmail === user?.email)
      .filter(l => {
        const matchesSearch = l.reason.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesFilter =
          filterStatus === "all" ||
          (filterStatus === "pending" ? (l.status === "pending" || l.status === "staff_approved") : false) ||
          (filterStatus === "approved" ? l.status === "hod_approved" : false) ||
          l.status === filterStatus
        return matchesSearch && matchesFilter
      })
  }, [leaves, user?.email, searchTerm, filterStatus])

  // Stats calculation
  const stats = useMemo(() => {
    const studentLeaves = leaves.filter(l => l.studentEmail === user?.email)
    return {
      total: studentLeaves.length,
      pending: studentLeaves.filter(l => l.status === "pending" || l.status === "staff_approved").length,
      approved: studentLeaves.filter(l => l.status === "hod_approved").length,
      rejected: studentLeaves.filter(l => l.status === "rejected").length,
    }
  }, [leaves, user?.email])

  return (
    <PageLayout 
        title="Student Dashboard" 
        description="Track and manage your leave applications in real-time"
        actions={
          <Button 
              onClick={() => onApply()} 
              className="px-6 h-12 bg-primary hover:bg-primary/90 text-white font-black italic rounded-2xl shadow-xl shadow-primary/20 transition-all hover:scale-105 active:scale-95 flex items-center gap-2 group"
          >
            <Plus className="h-5 w-5 group-hover:rotate-90 transition-transform" />
            Apply Leave
          </Button>
        }
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
             <Layers className="h-5 w-5 text-primary opacity-50" />
             <h2 className="text-xl font-black italic tracking-tighter text-foreground uppercase opacity-80">Recent Applications</h2>
          </div>

          {filteredLeaves.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 px-4 bg-white rounded-3xl border-2 border-dashed border-border/50 group hover:border-primary/30 transition-colors">
               <div className="h-24 w-24 rounded-full bg-muted/50 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-primary/10 transition-all duration-500">
                   <SearchX className="h-10 w-10 text-muted-foreground group-hover:text-primary transition-colors" />
               </div>
               <p className="text-xl font-black text-foreground italic tracking-tight">No applications found!</p>
               <p className="text-sm text-muted-foreground font-medium mt-1">Try adjusting your filters or apply for a new leave.</p>
               <Button variant="link" onClick={() => { setSearchTerm(""); setFilterStatus("all") }} className="mt-4 text-primary font-bold decoration-2">Clear all filters</Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in duration-700 delay-200">
              {filteredLeaves.map(leave => (
                <LeaveCard 
                    key={leave._id || leave.id} 
                    leave={leave} 
                    onEdit={(l) => onApply(l)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </PageLayout>
  )
}
