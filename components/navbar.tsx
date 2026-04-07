"use client"

import { useLeave, type Role } from "@/lib/leave-context"
import { Button } from "@/components/ui/button"
import { GraduationCap, ShieldCheck, UserCog, LogOut } from "lucide-react"

export function Navbar() {
  const { user, logout } = useLeave()
  const role = user?.role || "student"

  return (
    <nav className="border-b border-border bg-card/80 backdrop-blur-md sticky top-0 z-50 px-8 py-4 flex items-center justify-between shadow-sm">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20 rotate-3 group-hover:rotate-0 transition-transform">
          <GraduationCap className="text-primary-foreground h-6 w-6" />
        </div>
        <div className="flex flex-col">
          <h1 className="text-xl font-black text-foreground italic tracking-tighter leading-none">LeavePortal</h1>
          <span className="text-[10px] uppercase font-black text-primary tracking-widest opacity-80">Institution Management</span>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="hidden md:flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/5 border border-primary/10">
          <div className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
          <span className="text-xs font-black uppercase tracking-widest text-primary italic">
            Active {role} Session
          </span>
        </div>
        
        <div className="h-8 w-[1px] bg-border mx-2 hidden md:block" />
        
        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-black text-foreground italic tracking-tight leading-none uppercase">
              {user?.name}
            </p>
            <p className="text-[10px] text-muted-foreground font-bold tracking-tighter uppercase opacity-60">
              {user?.email}
            </p>
          </div>
          
          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-primary/40 flex items-center justify-center text-sm font-black text-white shadow-lg border-2 border-white/20">
            {role[0].toUpperCase()}
          </div>

          <Button 
            variant="ghost" 
            size="icon" 
            onClick={logout}
            className="rounded-full hover:bg-destructive/10 hover:text-destructive group transition-all"
            title="Logout"
          >
            <LogOut className="h-5 w-5 group-hover:translate-x-0.5 transition-transform" />
          </Button>
        </div>
      </div>
    </nav>
  )
}
