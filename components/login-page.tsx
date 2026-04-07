"use client"

import { useState } from "react"
import { useLeave } from "@/lib/leave-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { GraduationCap, Lock, Mail, AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export function LoginPage() {
  const { login } = useLeave()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    // Simulate small delay for premium feel
    setTimeout(() => {
      const success = login(email)
      if (!success) {
        setError("Invalid email. Only @college.edu emails are allowed.")
        setIsLoading(false)
      }
    }, 800)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-primary/10 p-4">
      <div className="w-full max-w-md space-y-8 animate-in fade-in zoom-in duration-500">
        <div className="flex flex-col items-center text-center space-y-2">
          <div className="h-16 w-16 rounded-2xl bg-primary flex items-center justify-center shadow-xl shadow-primary/20 rotate-3 hover:rotate-0 transition-transform duration-500">
            <GraduationCap className="h-10 w-10 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-black tracking-tighter italic">LeavePortal</h1>
          <p className="text-muted-foreground font-medium">Streamlined Leave Management for Institutions</p>
        </div>

        <Card className="border-border/50 shadow-2xl backdrop-blur-sm bg-card/80">
          <CardHeader>
            <CardTitle className="text-2xl font-bold italic">Welcome Back</CardTitle>
            <CardDescription>Enter your college credentials to access your dashboard</CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              {error && (
                <Alert variant="destructive" className="animate-in slide-in-from-top-2 duration-300">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              
              <div className="space-y-2">
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="email"
                    placeholder="name@college.edu"
                    className="pl-10 h-11"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="password"
                    placeholder="••••••••"
                    className="pl-10 h-11"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full h-11 font-bold text-lg italic transition-all active:scale-[0.98]" disabled={isLoading}>
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                    Authenticating...
                  </div>
                ) : (
                  "Login to Dashboard"
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>

        <div className="text-center space-y-4">
          <p className="text-xs text-muted-foreground font-semibold uppercase tracking-widest opacity-50">Role-Based Access Control</p>
          <div className="flex justify-center gap-4 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
            <span>Student</span>
            <span>&bull;</span>
            <span>Staff</span>
            <span>&bull;</span>
            <span>HOD</span>
          </div>
        </div>
      </div>
    </div>
  )
}
