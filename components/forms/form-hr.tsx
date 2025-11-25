"use client"

import { useForm } from "react-hook-form"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState } from "react"

interface FormHRProps {
  user: any
  onSubmit: (data: any) => void
}

export function FormHR({ user, onSubmit }: FormHRProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch,
  } = useForm({
    mode: "onChange",
    defaultValues: {
      name: user.name,
      company_name: "",
      company_industry: "",
      location: "",
      contact_email: user.email,
    },
  })

  const [positions, setPositions] = useState<any[]>([])
  const [newPosition, setNewPosition] = useState({
    title: "",
    skills_required: "",
    job_summary: "",
    experience_level: "mid",
    job_type: "full-time",
    salary_range: "",
    description: "",
  })
  const [positionError, setPositionError] = useState("")

  const addPosition = () => {
    if (!newPosition.title.trim()) {
      setPositionError("Job title is required")
      return
    }
    if (!newPosition.skills_required.trim()) {
      setPositionError("Skills are required")
      return
    }
    setPositionError("")
    setPositions([...positions, newPosition])
    setNewPosition({
      title: "",
      skills_required: "",
      job_summary: "",
      experience_level: "mid",
      job_type: "full-time",
      salary_range: "",
      description: "",
    })
  }

  const removePosition = (idx: number) => {
    setPositions(positions.filter((_, i) => i !== idx))
  }

  const onFormSubmit = (data: any) => {
    if (positions.length === 0) {
      setPositionError("Add at least one position")
      return
    }
    onSubmit({
      ...data,
      roles_hiring_for: positions,
    })
  }

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        <h2 className="text-2xl font-bold text-foreground mb-6">HR Profile Setup</h2>

        {/* Basic Info */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Full Name</label>
            <Input
              {...register("name", { required: "Name is required" })}
              defaultValue={user.name}
              placeholder="Your full name"
              className={errors.name ? "border-destructive" : ""}
            />
            <AnimatePresence>
              {errors.name && (
                <motion.span
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="text-sm text-destructive mt-1 block"
                >
                  {String(errors.name.message)}
                </motion.span>
              )}
            </AnimatePresence>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Company Name <span className="text-destructive">*</span>
            </label>
            <Input
              {...register("company_name", { required: "Company name is required" })}
              placeholder="Your company"
              className={errors.company_name ? "border-destructive" : ""}
            />
            <AnimatePresence>
              {errors.company_name && (
                <motion.span
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="text-sm text-destructive mt-1 block"
                >
                  {String(errors.company_name.message)}
                </motion.span>
              )}
            </AnimatePresence>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Company Industry</label>
            <Input
              {...register("company_industry")}
              placeholder="e.g., FinTech, Healthcare, EdTech"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Location <span className="text-destructive">*</span>
            </label>
            <Input
              {...register("location", { required: "Location is required" })}
              placeholder="City, Country"
              className={errors.location ? "border-destructive" : ""}
            />
            <AnimatePresence>
              {errors.location && (
                <motion.span
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="text-sm text-destructive mt-1 block"
                >
                  {String(errors.location.message)}
                </motion.span>
              )}
            </AnimatePresence>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Contact Email</label>
            <Input value={user.email} disabled className="bg-muted" />
          </div>
        </div>

        {/* Positions */}
        <div className="mt-8 pt-6 border-t border-border">
          <h3 className="text-lg font-semibold text-foreground mb-4">Positions You Are Hiring For</h3>

          <AnimatePresence>
            {positions.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mb-6 space-y-2"
              >
                {positions.map((pos, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="p-4 bg-secondary rounded-lg flex items-start justify-between"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-foreground">{pos.title}</p>
                      {pos.job_summary && (
                        <p className="text-sm text-foreground mt-1">Summary: {pos.job_summary}</p>
                      )}
                      <p className="text-sm text-muted-foreground mt-1">
                        Skills: {Array.isArray(pos.skills_required) ? pos.skills_required.join(", ") : pos.skills_required}
                      </p>
                      <div className="flex gap-2 mt-2 flex-wrap">
                        <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">{pos.job_type}</span>
                        <span className="text-xs bg-accent/10 text-accent px-2 py-1 rounded">
                          {pos.experience_level}
                        </span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removePosition(idx)}
                      className="text-destructive hover:text-destructive/80 transition-colors ml-4"
                    >
                      ✕
                    </button>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          <div className="space-y-3 p-4 bg-card border border-border rounded-lg">
            <Input
              value={newPosition.title}
              onChange={(e) => setNewPosition({ ...newPosition, title: e.target.value })}
              placeholder="Job Title (e.g., Senior Developer)"
            />
            <Input
              value={newPosition.job_summary}
              onChange={(e) => setNewPosition({ ...newPosition, job_summary: e.target.value })}
              placeholder="Job Summary (short role summary)"
            />
            <Input
              value={newPosition.skills_required}
              onChange={(e) => setNewPosition({ ...newPosition, skills_required: e.target.value })}
              placeholder="Required Skills (e.g., React, Node.js)"
            />
            <Input
              value={newPosition.salary_range}
              onChange={(e) => setNewPosition({ ...newPosition, salary_range: e.target.value })}
              placeholder="Salary Range (e.g., $100k-$150k)"
            />
            <textarea
              value={newPosition.description}
              onChange={(e) => setNewPosition({ ...newPosition, description: e.target.value })}
              placeholder="Job Description"
              className="w-full p-2 border border-border rounded-lg bg-background text-foreground text-sm"
              rows={3}
            />
            <select
              value={newPosition.job_type}
              onChange={(e) => setNewPosition({ ...newPosition, job_type: e.target.value })}
              className="w-full p-2 border border-border rounded-lg bg-background text-foreground text-sm"
            >
              <option value="full-time">Full-time</option>
              <option value="part-time">Part-time</option>
              <option value="contract">Contract</option>
              <option value="remote">Remote</option>
            </select>
            <select
              value={newPosition.experience_level}
              onChange={(e) => setNewPosition({ ...newPosition, experience_level: e.target.value })}
              className="w-full p-2 border border-border rounded-lg bg-background text-foreground text-sm"
            >
              <option value="entry">Entry Level</option>
              <option value="mid">Mid Level</option>
              <option value="senior">Senior Level</option>
            </select>

            <AnimatePresence>
              {positionError && (
                <motion.p
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="text-sm text-destructive"
                >
                  {positionError}
                </motion.p>
              )}
            </AnimatePresence>

            <motion.button
              onClick={addPosition}
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-2 px-4 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity text-sm font-medium"
            >
              Add Position
            </motion.button>
          </div>
        </div>

        {/* Submit */}
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="mt-8">
          <Button type="submit" className="w-full py-3 text-base" disabled={!isValid || positions.length === 0}>
            Complete Profile
          </Button>
        </motion.div>
      </motion.div>
    </form>
  )
}
