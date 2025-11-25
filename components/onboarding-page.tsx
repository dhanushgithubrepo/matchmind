"use client"

import { motion } from "framer-motion"
import { useState } from "react"
import { OnboardingForm } from "@/components/onboarding-form"
import type { User } from "@/types/user"

interface OnboardingPageProps {
  user: User
  onSubmit: (profileData: any) => void
}

export function OnboardingPage({ user, onSubmit }: OnboardingPageProps) {
  const [selectedRole, setSelectedRole] = useState<"hr" | "seeker" | "researcher" | null>(null)

  if (!selectedRole) {
    return <RoleSelection user={user} onSelectRole={setSelectedRole} />
  }

  return <OnboardingForm user={user} role={selectedRole} onSubmit={onSubmit} onBack={() => setSelectedRole(null)} />
}

function RoleSelection({
  user,
  onSelectRole,
}: {
  user: User
  onSelectRole: (role: "hr" | "seeker" | "researcher") => void
}) {
  const roles = [
    {
      id: "hr",
      title: "HR Manager",
      description: "I'm hiring and looking for talent",
      icon: "🏢",
      details: ["Post job openings", "Find qualified candidates", "Manage hiring pipeline"],
    },
    {
      id: "seeker",
      title: "Job Seeker",
      description: "I'm looking for my next opportunity",
      icon: "👩‍💻",
      details: ["Discover job opportunities", "Connect with recruiters", "Showcase your expertise"],
    },
    {
      id: "researcher",
      title: "Researcher",
      description: "I'm open to research collaborations",
      icon: "🧠",
      details: ["Find research partners", "Collaborate on projects", "Share your expertise"],
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary flex items-center justify-center px-4 py-8">
      <motion.div
        className="max-w-5xl w-full"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-3">Welcome, {user.name}!</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Tell us about yourself so we can make the best matches for your needs
          </p>
        </motion.div>

        {/* Role Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {roles.map((role, index) => (
            <motion.button
              key={role.id}
              onClick={() => onSelectRole(role.id as any)}
              className="p-6 rounded-xl border border-border bg-card hover:border-primary hover:shadow-lg hover:bg-secondary transition-all duration-300 text-left group"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 * index }}
              whileHover={{ scale: 1.05, y: -8 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="text-5xl mb-4">{role.icon}</div>
              <h3 className="text-lg font-semibold text-foreground mb-2">{role.title}</h3>
              <p className="text-sm text-muted-foreground mb-4">{role.description}</p>

              {/* Benefits list for each role */}
              <ul className="space-y-2">
                {role.details.map((detail, idx) => (
                  <li key={idx} className="text-xs text-muted-foreground flex items-start gap-2">
                    <span className="text-primary mt-1">✓</span>
                    <span>{detail}</span>
                  </li>
                ))}
              </ul>

              <motion.div
                className="mt-4 text-primary font-medium text-sm flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity"
                initial={false}
              >
                Select Role
                <span>→</span>
              </motion.div>
            </motion.button>
          ))}
        </div>

        {/* Info Footer */}
        <motion.div
          className="mt-12 pt-8 border-t border-border text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <p className="text-sm text-muted-foreground">You can change your role later in your profile settings</p>
        </motion.div>
      </motion.div>
    </div>
  )
}
