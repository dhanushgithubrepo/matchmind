"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { LandingPage } from "@/components/landing-page"
import { OnboardingPage } from "@/components/onboarding-page"
import { ChatPage } from "@/components/chat-page"
import { getUserEmail, getUserName, isAuthenticated } from "@/lib/auth"

export default function Home() {
  const [currentPage, setCurrentPage] = useState<"landing" | "onboarding" | "dashboard">("landing")
  const [user, setUser] = useState<any>(null)

  // Check if user is already authenticated on mount
  useEffect(() => {
    if (isAuthenticated()) {
      const email = getUserEmail()
      const name = getUserName()
      
      if (email && name) {
        const userData = {
          email,
          name,
          provider: 'google'
        }
        setUser(userData)
        setCurrentPage("onboarding")
      }
    }
  }, [])

  const handleLogin = (userData: any) => {
    setUser(userData)
    setCurrentPage("onboarding")
  }

  const handleProfileSubmit = (profileData: any) => {
    setUser({ ...user, ...profileData })
    setCurrentPage("dashboard")
  }

  const handleLogout = async () => {
    const { logout } = await import("@/lib/auth")
    await logout()
    setUser(null)
    setCurrentPage("landing")
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
      {currentPage === "landing" && <LandingPage onLogin={handleLogin} />}
      {currentPage === "onboarding" && <OnboardingPage user={user} onSubmit={handleProfileSubmit} />}
      {currentPage === "dashboard" && <ChatPage user={user} onLogout={handleLogout} />}
    </motion.div>
  )
}
