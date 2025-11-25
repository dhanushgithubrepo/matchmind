"use client"

import type React from "react"

import { useForm } from "react-hook-form"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState } from "react"

interface FormJobSeekerProps {
  user: any
  onSubmit: (data: any) => void
}

export function FormJobSeeker({ user, onSubmit }: FormJobSeekerProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      name: user.name,
      location: "",
      role: "",
      top_skills: "",
      career_objective: "",
      years_of_experience: "1",
      expected_salary: "",
      preferred_job_type: "full-time",
      resume_link: "",
      linkedin_url: "",
      github_url: "",
    },
  })

  const [projects, setProjects] = useState<any[]>([])
  const [newProject, setNewProject] = useState({
    title: "",
    description: "",
    tech_stack: "",
  })
  const [projectError, setProjectError] = useState("")

  const [education, setEducation] = useState<any[]>([])
  const [newEducation, setNewEducation] = useState({
    degree: "",
    institution: "",
    year: "",
  })
  const [educationError, setEducationError] = useState("")

  const addProject = () => {
    if (!newProject.title.trim()) {
      setProjectError("Project title is required")
      return
    }
    setProjectError("")
    setProjects([...projects, newProject])
    setNewProject({
      title: "",
      description: "",
      tech_stack: "",
    })
  }

  const removeProject = (idx: number) => {
    setProjects(projects.filter((_, i) => i !== idx))
  }

  const addEducation = () => {
    if (!newEducation.degree.trim()) {
      setEducationError("Degree is required")
      return
    }
    if (!newEducation.institution.trim()) {
      setEducationError("Institution is required")
      return
    }
    setEducationError("")
    setEducation([...education, newEducation])
    setNewEducation({
      degree: "",
      institution: "",
      year: "",
    })
  }

  const removeEducation = (idx: number) => {
    setEducation(education.filter((_, i) => i !== idx))
  }

  const onFormSubmit = (data: any) => {
    onSubmit({
      ...data,
      projects,
      education,
    })
  }

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        <h2 className="text-2xl font-bold text-foreground mb-6">Job Seeker Profile Setup</h2>

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
            <label className="block text-sm font-medium text-foreground mb-2">Email</label>
            <Input value={user.email} disabled className="bg-muted" />
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
            <label className="block text-sm font-medium text-foreground mb-2">
              Current / Target Role <span className="text-destructive">*</span>
            </label>
            <Input
              {...register("role", { required: "Role is required" })}
              placeholder="e.g., Senior React Developer"
              className={errors.role ? "border-destructive" : ""}
            />
            <AnimatePresence>
              {errors.role && (
                <motion.span
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="text-sm text-destructive mt-1 block"
                >
                  {String(errors.role.message)}
                </motion.span>
              )}
            </AnimatePresence>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Top Skills (comma-separated) <span className="text-destructive">*</span>
            </label>
            <Input
              {...register("top_skills", { required: "Top skills are required" })}
              placeholder="React, TypeScript, Node.js, Python"
              className={errors.top_skills ? "border-destructive" : ""}
            />
            <AnimatePresence>
              {errors.top_skills && (
                <motion.span
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="text-sm text-destructive mt-1 block"
                >
                  {String(errors.top_skills.message)}
                </motion.span>
              )}
            </AnimatePresence>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Career Objective</label>
            <textarea
              {...register("career_objective")}
              placeholder="Brief summary of your professional goals and aspirations"
              className="w-full p-2 border border-border rounded-lg bg-background text-foreground text-sm"
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Years of Experience</label>
            <select
              {...register("years_of_experience")}
              className="w-full p-2 border border-border rounded-lg bg-background text-foreground"
            >
              <option value="0">Less than 1 year</option>
              <option value="1">1-2 years</option>
              <option value="3">3-5 years</option>
              <option value="6">6-10 years</option>
              <option value="11">10+ years</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Expected Salary</label>
            <Input {...register("expected_salary")} placeholder="e.g., $120,000" />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Preferred Job Type</label>
            <select
              {...register("preferred_job_type")}
              className="w-full p-2 border border-border rounded-lg bg-background text-foreground"
            >
              <option value="full-time">Full-time</option>
              <option value="part-time">Part-time</option>
              <option value="contract">Contract</option>
              <option value="remote">Remote</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Resume Link (Google Drive)</label>
            <Input
              {...register("resume_link", {
                pattern: {
                  value: /^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/[^\s]*)?$/,
                  message: "Enter a valid URL",
                },
              })}
              placeholder="https://drive.google.com/your-resume-link"
              className={errors.resume_link ? "border-destructive" : ""}
            />
            <AnimatePresence>
              {errors.resume_link && (
                <motion.span
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="text-sm text-destructive mt-1 block"
                >
                  {errors.resume_link.message as any}
                </motion.span>
              )}
            </AnimatePresence>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">LinkedIn URL</label>
            <Input {...register("linkedin_url")} placeholder="https://linkedin.com/in/yourprofile" />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">GitHub URL</label>
            <Input {...register("github_url")} placeholder="https://github.com/yourprofile" />
          </div>
        </div>

        {/* Projects Section */}
        <div className="mt-8 pt-6 border-t border-border">
          <h3 className="text-lg font-semibold text-foreground mb-4">Projects</h3>

          <AnimatePresence>
            {projects.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mb-6 space-y-2"
              >
                {projects.map((proj, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="p-4 bg-secondary rounded-lg flex items-start justify-between"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-foreground">{proj.title}</p>
                      {proj.description && (
                        <p className="text-sm text-muted-foreground mt-1">{proj.description}</p>
                      )}
                      {proj.tech_stack && (
                        <p className="text-sm text-primary mt-1">Tech: {proj.tech_stack}</p>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => removeProject(idx)}
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
              value={newProject.title}
              onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
              placeholder="Project Title"
            />
            <textarea
              value={newProject.description}
              onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
              placeholder="Project Description"
              className="w-full p-2 border border-border rounded-lg bg-background text-foreground text-sm"
              rows={2}
            />
            <Input
              value={newProject.tech_stack}
              onChange={(e) => setNewProject({ ...newProject, tech_stack: e.target.value })}
              placeholder="Tech Stack (comma-separated, e.g., React, Node.js)"
            />

            <AnimatePresence>
              {projectError && (
                <motion.p
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="text-sm text-destructive"
                >
                  {projectError}
                </motion.p>
              )}
            </AnimatePresence>

            <motion.button
              onClick={addProject}
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-2 px-4 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity text-sm font-medium"
            >
              Add Project
            </motion.button>
          </div>
        </div>

        {/* Education Section */}
        <div className="mt-8 pt-6 border-t border-border">
          <h3 className="text-lg font-semibold text-foreground mb-4">Education</h3>

          <AnimatePresence>
            {education.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mb-6 space-y-2"
              >
                {education.map((edu, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="p-4 bg-secondary rounded-lg flex items-start justify-between"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-foreground">{edu.degree}</p>
                      <p className="text-sm text-muted-foreground mt-1">{edu.institution}</p>
                      {edu.year && (
                        <p className="text-sm text-primary mt-1">Year: {edu.year}</p>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => removeEducation(idx)}
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
              value={newEducation.degree}
              onChange={(e) => setNewEducation({ ...newEducation, degree: e.target.value })}
              placeholder="Degree (e.g., B.Tech in Computer Science)"
            />
            <Input
              value={newEducation.institution}
              onChange={(e) => setNewEducation({ ...newEducation, institution: e.target.value })}
              placeholder="Institution Name"
            />
            <Input
              value={newEducation.year}
              onChange={(e) => setNewEducation({ ...newEducation, year: e.target.value })}
              placeholder="Year (e.g., 2020 or 2018-2022)"
            />

            <AnimatePresence>
              {educationError && (
                <motion.p
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="text-sm text-destructive"
                >
                  {educationError}
                </motion.p>
              )}
            </AnimatePresence>

            <motion.button
              onClick={addEducation}
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-2 px-4 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity text-sm font-medium"
            >
              Add Education
            </motion.button>
          </div>
        </div>

        {/* Submit */}
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="mt-8">
          <Button type="submit" className="w-full py-3 text-base" disabled={!isValid}>
            Complete Profile
          </Button>
        </motion.div>
      </motion.div>
    </form>
  )
}
