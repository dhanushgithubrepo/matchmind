"use client"

import { motion } from "framer-motion"
import { useState } from "react"
import { FormHR } from "@/components/forms/form-hr"
import { FormJobSeeker } from "@/components/forms/form-job-seeker"
import { FormResearcher } from "@/components/forms/form-researcher"

interface OnboardingFormProps {
  user: any
  role: "hr" | "seeker" | "researcher"
  onSubmit: (profileData: any) => void
  onBack: () => void
}

export function OnboardingForm({ user, role, onSubmit, onBack }: OnboardingFormProps) {
  const [submitted, setSubmitted] = useState(false)

  const roleLabels = {
    hr: "HR Manager",
    seeker: "Job Seeker",
    researcher: "Researcher",
  }

  const roleEmojis = {
    hr: "🏢",
    seeker: "👩‍💻",
    researcher: "🧠",
  }

  const handleFormSubmit = async (data: any) => {
    try {
      // Get the auth token
      const token = localStorage.getItem('authToken')
      
      if (!token) {
        alert('Please login first')
        return
      }

      // Determine the API endpoint based on role
      const endpoints = {
        hr: '/api/profiles/hr',
        seeker: '/api/profiles/jobseeker',
        researcher: '/api/profiles/researcher'
      }

      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000'
      
      // Send data to backend
      const response = await fetch(`${backendUrl}${endpoints[role]}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data)
      })

      const result = await response.json()

      if (result.success) {
        console.log('Profile saved successfully:', result)
        setSubmitted(true)
        setTimeout(() => {
          onSubmit({
            role,
            ...data,
          })
        }, 1500)
      } else {
        alert('Error saving profile: ' + result.message)
      }
    } catch (error) {
      console.error('Error saving profile:', error)
      alert('Failed to save profile. Please try again.')
    }
  }

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      {submitted ? (
        <motion.div
          className="max-w-md mx-auto h-screen flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center">
            <motion.div
              className="text-6xl mb-6"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, type: "spring" }}
            >
              ✨
            </motion.div>
            <h2 className="text-2xl font-bold text-foreground mb-2">Profile Complete!</h2>
            <p className="text-muted-foreground">Redirecting to your dashboard...</p>
            <motion.div
              className="flex gap-2 justify-center mt-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              {[0, 1, 2].map((dot) => (
                <motion.div
                  key={dot}
                  className="w-2 h-2 bg-primary rounded-full"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 0.6, delay: dot * 0.2, repeat: Number.POSITIVE_INFINITY }}
                />
              ))}
            </motion.div>
          </div>
        </motion.div>
      ) : (
        <motion.div
          className="max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header with Back Button */}
          <div className="flex items-center justify-between mb-8">
            <motion.button
              onClick={onBack}
              whileHover={{ scale: 1.05, x: -4 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 text-primary hover:text-accent transition-colors font-medium"
            >
              ← Back
            </motion.button>
            <div className="flex items-center gap-2">
              <span className="text-xl">{roleEmojis[role]}</span>
              <span className="text-sm font-medium text-muted-foreground">{roleLabels[role]}</span>
            </div>
          </div>

          {/* Form */}
          {role === "hr" && <FormHR user={user} onSubmit={handleFormSubmit} />}
          {role === "seeker" && <FormJobSeeker user={user} onSubmit={handleFormSubmit} />}
          {role === "researcher" && <FormResearcher user={user} onSubmit={handleFormSubmit} />}
        </motion.div>
      )}
    </div>
  )
}
