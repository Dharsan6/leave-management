export type LeaveStatus = "pending" | "staff_approved" | "hod_approved" | "rejected"

export type LeaveType = "sick" | "casual" | "emergency" | "academic"

export interface LeaveRequest {
  _id?: string
  id?: string
  studentName?: string
  studentEmail: string
  studentId?: string
  department?: string
  leaveType?: LeaveType
  startDate?: string
  endDate?: string
  fromDate?: string
  toDate?: string
  reason: string
  status: LeaveStatus
  appliedDate?: string
  createdAt?: string
  staffApproval?: {
    approved: boolean
    approvedBy: string
    approvedDate: string
    comments?: string
  }
  hodApproval?: {
    approved: boolean
    approvedBy: string
    approvedDate: string
    comments?: string
  }
  attachmentName?: string
}

export const mockLeaveRequests: LeaveRequest[] = [
  {
    id: "LV001",
    studentName: "Sarah Johnson",
    studentEmail: "sarah.johnson@college.edu",
    studentId: "STU2024001",
    department: "Computer Science",
    leaveType: "sick",
    startDate: "2026-04-10",
    endDate: "2026-04-12",
    reason: "Medical appointment and recovery from flu symptoms. Doctor has advised rest for at least 3 days.",
    status: "pending",
    appliedDate: "2026-04-06",
  },
  {
    id: "LV002",
    studentName: "Michael Chen",
    studentEmail: "michael.chen@college.edu",
    studentId: "STU2024002",
    department: "Computer Science",
    leaveType: "casual",
    startDate: "2026-04-15",
    endDate: "2026-04-16",
    reason: "Family function - Sister's wedding ceremony.",
    status: "staff_approved",
    appliedDate: "2026-04-01",
    staffApproval: {
      approved: true,
      approvedBy: "Dr. Emily Roberts",
      approvedDate: "2026-04-02",
      comments: "Approved. Ensure assignments are submitted before leave.",
    },
  },
  {
    id: "LV003",
    studentName: "Emma Wilson",
    studentEmail: "emma.wilson@college.edu",
    studentId: "STU2024003",
    department: "Computer Science",
    leaveType: "emergency",
    startDate: "2026-04-07",
    endDate: "2026-04-09",
    reason: "Family emergency - Need to travel to hometown urgently.",
    status: "hod_approved",
    appliedDate: "2026-04-05",
    staffApproval: {
      approved: true,
      approvedBy: "Dr. Emily Roberts",
      approvedDate: "2026-04-05",
      comments: "Approved due to emergency nature.",
    },
    hodApproval: {
      approved: true,
      approvedBy: "Prof. David Miller",
      approvedDate: "2026-04-05",
      comments: "Approved. Take care.",
    },
  },
  {
    id: "LV004",
    studentName: "James Brown",
    studentEmail: "james.brown@college.edu",
    studentId: "STU2024004",
    department: "Computer Science",
    leaveType: "academic",
    startDate: "2026-04-20",
    endDate: "2026-04-22",
    reason: "Attending a national coding competition representing the university.",
    status: "rejected",
    appliedDate: "2026-04-03",
    staffApproval: {
      approved: false,
      approvedBy: "Dr. Emily Roberts",
      approvedDate: "2026-04-04",
      comments: "Cannot approve during examination period. Please reschedule.",
    },
  },
  {
    id: "LV005",
    studentName: "Olivia Davis",
    studentEmail: "olivia.davis@college.edu",
    studentId: "STU2024005",
    department: "Computer Science",
    leaveType: "sick",
    startDate: "2026-04-08",
    endDate: "2026-04-10",
    reason: "Dental surgery scheduled. Will need recovery time.",
    status: "pending",
    appliedDate: "2026-04-06",
  },
]

export const studentInfo = {
  name: "Sarah Johnson",
  id: "STU2024001",
  department: "Computer Science",
  semester: "4th",
  email: "sarah.johnson@university.edu",
  phone: "+1 234 567 8900",
}

export const leaveBalance = {
  sick: { total: 10, used: 2, remaining: 8 },
  casual: { total: 5, used: 1, remaining: 4 },
  emergency: { total: 3, used: 0, remaining: 3 },
  academic: { total: 5, used: 2, remaining: 3 },
}
