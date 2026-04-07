"use client"

import React, { createContext, useContext, useEffect, useState } from "react"
import api from "@/src/services/api"
import { type LeaveRequest, type LeaveStatus } from "./mock-data"

export type Role = "student" | "staff" | "hod"

interface User {
  name: string
  email: string
  role: Role
}

interface Toast {
  message: string
  type: "success" | "error" | "info"
}

interface LeaveContextType {
  leaves: LeaveRequest[]
  user: User | null
  role: Role | undefined
  toast: Toast | null
  login: (email: string) => boolean
  logout: () => void
  updateStatus: (id: string, status: LeaveStatus, actor: string, comments?: string) => Promise<void>
  addLeave: (leave: Omit<LeaveRequest, "id" | "_id" | "status" | "appliedDate">) => Promise<void>
  deleteLeave: (id: string) => Promise<void>
  updateLeave: (id: string, updatedData: Partial<LeaveRequest>) => Promise<void>
  showToast: (message: string, type?: Toast["type"]) => void
}

const LeaveContext = createContext<LeaveContextType | undefined>(undefined)

const formatNameFromEmail = (email: string) =>
  email
    .split("@")[0]
    .split(/[._-]/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ")

const mapLeave = (leave: LeaveRequest): LeaveRequest => ({
  ...leave,
  id: leave._id,
  studentName: leave.studentName || formatNameFromEmail(leave.studentEmail),
  studentId: leave.studentId || "N/A",
  department: leave.department || "General",
  leaveType: leave.leaveType || "casual",
  startDate: leave.startDate || leave.fromDate,
  endDate: leave.endDate || leave.toDate,
  appliedDate: leave.appliedDate || leave.createdAt?.split("T")[0] || leave.fromDate,
})

export function LeaveProvider({ children }: { children: React.ReactNode }) {
  const [leaves, setLeaves] = useState<LeaveRequest[]>([])
  const [user, setUser] = useState<User | null>(null)
  const [toast, setToast] = useState<Toast | null>(null)

  const showToast = (message: string, type: Toast["type"] = "success") => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3000)
  }

  useEffect(() => {
    const fetchLeaves = async () => {
      try {
        const response = await api.get("/leaves")
        console.log("Fetched leaves:", response.data)
        setLeaves(response.data.map(mapLeave))
      } catch (error) {
        console.error("Failed to fetch leaves:", error)
        showToast("Failed to fetch leaves", "error")
      }
    }

    fetchLeaves()
  }, [])

  const login = (email: string) => {
    if (!email.toLowerCase().endsWith("@college.edu")) return false

    let role: Role = "student"
    const prefix = email.split("@")[0].toLowerCase()

    if (prefix === "staff") role = "staff"
    else if (prefix === "hod") role = "hod"

    setUser({ name: formatNameFromEmail(email), email, role })
    showToast(`Logged in as ${role}`)
    return true
  }

  const logout = () => {
    setUser(null)
    showToast("Logged out successfully", "info")
  }

  const updateStatus = async (id: string, status: LeaveStatus, actor: string, comments?: string) => {
    const leave = leaves.find((item) => item._id === id)

    if (!leave) {
      showToast("Leave application not found", "error")
      return
    }

    const canUpdateStatus =
      (user?.role === "staff" && leave.status === "pending" && (status === "staff_approved" || status === "rejected")) ||
      (user?.role === "hod" && leave.status === "staff_approved" && (status === "hod_approved" || status === "rejected"))

    if (!canUpdateStatus) {
      showToast("You are not allowed to update this leave", "error")
      return
    }

    try {
      const response = await api.put(`/leaves/${id}`, { status })
      console.log("Updated leave status:", response.data)
      const nextLeave = mapLeave(response.data)

      if (status === "staff_approved" || (status === "rejected" && user?.role === "staff")) {
        nextLeave.staffApproval = {
          approved: status === "staff_approved",
          approvedBy: actor,
          approvedDate: new Date().toISOString().split("T")[0],
          comments,
        }
      } else if (status === "hod_approved" || (status === "rejected" && user?.role === "hod")) {
        nextLeave.hodApproval = {
          approved: status === "hod_approved",
          approvedBy: actor,
          approvedDate: new Date().toISOString().split("T")[0],
          comments,
        }
      }

      setLeaves((prev) => prev.map((item) => (item._id === id ? nextLeave : item)))

      const message =
        status === "staff_approved"
          ? "Leave application approved by staff"
          : status === "hod_approved"
            ? "Leave application approved by HOD"
            : "Leave application rejected"

      showToast(message, status === "rejected" ? "error" : "success")
    } catch (error) {
      console.error("Failed to update leave status:", error)
      showToast("Failed to update leave", "error")
    }
  }

  const addLeave = async (newLeave: Omit<LeaveRequest, "id" | "_id" | "status" | "appliedDate">) => {
    try {
      const payload = {
        studentEmail: newLeave.studentEmail,
        reason: newLeave.reason,
        fromDate: newLeave.startDate,
        toDate: newLeave.endDate,
      }
      const response = await api.post("/leaves/apply", payload)

      console.log("Applied leave:", response.data)
      setLeaves((prev) => [mapLeave(response.data), ...prev])
      showToast("Leave application submitted!")
    } catch (error) {
      console.error("Failed to submit leave application:", error)
      showToast("Failed to submit leave application", "error")
    }
  }

  const deleteLeave = async (id: string) => {
    const leave = leaves.find((item) => item._id === id)

    if (!leave) {
      showToast("Leave application not found", "error")
      return
    }

    if (user?.role !== "student" || leave.studentEmail !== user.email) {
      showToast("You are not allowed to delete this leave", "error")
      return
    }

    if (leave.status !== "pending") {
      showToast("Only pending leave applications can be deleted", "error")
      return
    }

    try {
      await api.delete(`/leaves/${id}`)
      setLeaves((prev) => prev.filter((item) => item._id !== id))
      showToast("Leave application deleted", "info")
    } catch {
      showToast("Failed to delete leave", "error")
    }
  }

  const updateLeave = async (id: string, updatedData: Partial<LeaveRequest>) => {
    const leave = leaves.find((item) => item._id === id)

    if (!leave) {
      showToast("Leave application not found", "error")
      return
    }

    if (user?.role !== "student" || leave.studentEmail !== user.email) {
      showToast("You are not allowed to edit this leave", "error")
      return
    }

    if (leave.status !== "pending") {
      showToast("Only pending leave applications can be edited", "error")
      return
    }

    try {
      const response = await api.put(`/leaves/${id}`, {
        reason: updatedData.reason,
        fromDate: updatedData.startDate,
        toDate: updatedData.endDate,
      })

      console.log("Updated leave:", response.data)
      setLeaves((prev) => prev.map((item) => (item._id === id ? mapLeave(response.data) : item)))
      showToast("Leave application updated")
    } catch (error) {
      console.error("Failed to update leave:", error)
      showToast("Failed to update leave", "error")
    }
  }

  return (
    <LeaveContext.Provider
      value={{
        leaves,
        user,
        role: user?.role,
        toast,
        login,
        logout,
        updateStatus,
        addLeave,
        deleteLeave,
        updateLeave,
        showToast,
      }}
    >
      {children}

      <div className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] transition-all duration-500 ${toast ? "translate-y-0 opacity-100" : "translate-y-12 opacity-0 pointer-events-none"}`}>
        {toast && (
          <div className={`px-6 py-3 rounded-2xl shadow-2xl border flex items-center gap-3 backdrop-blur-xl animate-in zoom-in-95 duration-300
            ${toast.type === "success" ? "bg-success/10 border-success/20 text-success-foreground" :
              toast.type === "error" ? "bg-destructive/10 border-destructive/20 text-destructive" :
              "bg-primary/10 border-primary/20 text-primary"}`}
          >
            <div className={`h-2 w-2 rounded-full animate-pulse ${toast.type === "success" ? "bg-success" : toast.type === "error" ? "bg-destructive" : "bg-primary"}`} />
            <span className="font-black italic tracking-tighter text-sm uppercase">{toast.message}</span>
          </div>
        )}
      </div>
    </LeaveContext.Provider>
  )
}

export function useLeave() {
  const context = useContext(LeaveContext)
  if (context === undefined) {
    throw new Error("useLeave must be used within a LeaveProvider")
  }
  return context
}
