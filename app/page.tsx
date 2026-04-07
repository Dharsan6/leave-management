"use client"

import { useState } from "react"
import { LeaveProvider, useLeave } from "@/lib/leave-context"
import { type LeaveRequest } from "@/lib/mock-data"
import { Navbar } from "@/components/navbar"
import { LoginPage } from "@/components/login-page"
import { StudentDashboard } from "@/components/pages/student"
import { StaffDashboard } from "@/components/pages/staff"
import { HodDashboard } from "@/components/pages/hod"
import { LeaveApplication } from "@/components/leave-application"
import { LayoutGroup, motion, AnimatePresence } from "framer-motion"

function MainContent() {
  const { user, showToast } = useLeave()
  const [view, setView] = useState<"dashboard" | "apply">("dashboard")
  const [editLeave, setEditLeave] = useState<LeaveRequest | undefined>(undefined)

  if (!user) {
    return <LoginPage />
  }

  const role = user.role

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-foreground transition-colors duration-500">
      <Navbar />
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <LayoutGroup>
          <AnimatePresence mode="wait">
            <motion.div
              key={view + role + (editLeave?._id || editLeave?.id || "")}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              {role === "student" && (
                view === "apply" ? (
                  <LeaveApplication 
                    editLeave={editLeave} 
                    onBack={() => {
                        setView("dashboard")
                        setEditLeave(undefined)
                    }} 
                  />
                ) : (
                  <StudentDashboard onApply={(leave) => {
                      if (leave && leave.status !== "pending") {
                        showToast("Only pending leave applications can be edited", "error")
                        return
                      }
                      setEditLeave(leave)
                      setView("apply")
                  }} />
                )
              )}
              {role === "staff" && <StaffDashboard />}
              {role === "hod" && <HodDashboard />}
            </motion.div>
          </AnimatePresence>
        </LayoutGroup>
      </main>
      
      {/* Premium Mock Indicator */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="fixed bottom-6 right-6 flex items-center gap-3 backdrop-blur-xl bg-card/60 border border-primary/20 text-foreground py-2 px-4 rounded-2xl shadow-2xl z-50 border-t-primary/40 border-l-primary/40"
      >
        <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
        <span className="text-[10px] uppercase font-black tracking-widest italic opacity-80 antialiased">
          Active Workspace: {role}
        </span>
      </motion.div>
    </div>
  )
}

export default function App() {
  return (
    <LeaveProvider>
      <MainContent />
    </LeaveProvider>
  )
}
