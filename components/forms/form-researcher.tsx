"use client"

import { useForm } from "react-hook-form"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState } from "react"

interface FormResearcherProps {
  user: any
  onSubmit: (data: any) => void
}

export function FormResearcher({ user, onSubmit }: FormResearcherProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      name: user.name,
      affiliation: "",
      field_of_research: "",
      research_keywords: "",
      career_objective: "",
      current_project_title: "",
      current_project_description: "",
      skills_needed: "",
      contact_email: user.email,
    },
  })
  const [openToConnect, setOpenToConnect] = useState(true)

  // Collections state
  const [projects, setProjects] = useState<any[]>([])
  const [newProject, setNewProject] = useState({
    title: "",
    description: "",
    tech_stack: "",
    methods_used: "",
  })
  const [projectError, setProjectError] = useState("")

  const [education, setEducation] = useState<any[]>([])
  const [newEducation, setNewEducation] = useState({
    degree: "",
    institution: "",
    year: "",
  })
  const [educationError, setEducationError] = useState("")

  const [publications, setPublications] = useState<any[]>([])
  const [newPublication, setNewPublication] = useState({
    title: "",
    year: "",
    journal_or_conference: "",
    short_bio: "",
  })
  const [publicationError, setPublicationError] = useState("")

  const addProject = () => {
    if (!newProject.title.trim()) {
      setProjectError("Project title is required")
      return
    }
    setProjectError("")
    setProjects([...projects, newProject])
    setNewProject({ title: "", description: "", tech_stack: "", methods_used: "" })
  }

  const removeProject = (i: number) => setProjects(projects.filter((_, idx) => idx !== i))

  const addEducation = () => {
    if (!newEducation.degree.trim() || !newEducation.institution.trim()) {
      setEducationError("Degree and Institution are required")
      return
    }
    setEducationError("")
    setEducation([...education, newEducation])
    setNewEducation({ degree: "", institution: "", year: "" })
  }

  const removeEducation = (i: number) => setEducation(education.filter((_, idx) => idx !== i))

  const addPublication = () => {
    if (!newPublication.title.trim()) {
      setPublicationError("Publication title is required")
      return
    }
    setPublicationError("")
    setPublications([...publications, newPublication])
    setNewPublication({ title: "", year: "", journal_or_conference: "", short_bio: "" })
  }

  const removePublication = (i: number) => setPublications(publications.filter((_, idx) => idx !== i))

  const onFormSubmit = (data: any) => {
    onSubmit({
      ...data,
      projects,
      education,
      publications,
      open_to_connect: openToConnect,
    })
  }

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        <h2 className="text-2xl font-bold text-foreground mb-6">Researcher Profile Setup</h2>

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
              Affiliation <span className="text-destructive">*</span>
            </label>
            <Input
              {...register("affiliation", { required: "Affiliation is required" })}
              placeholder="University / Institution"
              className={errors.affiliation ? "border-destructive" : ""}
            />
            <AnimatePresence>
              {errors.affiliation && (
                <motion.span
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="text-sm text-destructive mt-1 block"
                >
                  {String(errors.affiliation.message)}
                </motion.span>
              )}
            </AnimatePresence>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Field of Research <span className="text-destructive">*</span>
            </label>
            <Input
              {...register("field_of_research", { required: "Field is required" })}
              placeholder="e.g., Machine Learning, Biotech"
              className={errors.field_of_research ? "border-destructive" : ""}
            />
            <AnimatePresence>
              {errors.field_of_research && (
                <motion.span
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="text-sm text-destructive mt-1 block"
                >
                  {String(errors.field_of_research.message)}
                </motion.span>
              )}
            </AnimatePresence>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Research Keywords (comma-separated)</label>
            <Input {...register("research_keywords")} placeholder="e.g., NLP, Computer Vision, Quantum Computing" />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Career Objective</label>
            <textarea
              {...register("career_objective")}
              placeholder="Brief summary of your goals and interests"
              className="w-full p-2 border border-border rounded-lg bg-background text-foreground text-sm"
              rows={3}
            />
          </div>

          {/* Current Project */}
          <div className="pt-4 border-t border-border">
            <h3 className="text-lg font-semibold text-foreground mb-4">Current Project</h3>
            <Input {...register("current_project_title")} placeholder="Project Title" className="mb-3" />
            <textarea
              {...register("current_project_description")}
              placeholder="Project Description"
              className="w-full p-2 border border-border rounded-lg bg-background text-foreground text-sm mb-3"
              rows={3}
            />
            <Input {...register("skills_needed")} placeholder="Skills / Methods Needed (comma-separated)" />
          </div>

          {/* Projects */}
          <div className="pt-4 border-t border-border">
            <h3 className="text-lg font-semibold text-foreground mb-3">Projects</h3>
            <AnimatePresence>
              {projects.length > 0 && (
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="mb-6 space-y-2">
                  {projects.map((p, idx) => (
                    <motion.div key={idx} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="p-4 bg-secondary rounded-lg flex items-start justify-between">
                      <div className="flex-1">
                        <p className="font-medium text-foreground">{p.title}</p>
                        {p.description && <p className="text-sm text-muted-foreground mt-1">{p.description}</p>}
                        {(p.tech_stack || p.methods_used) && (
                          <p className="text-sm text-primary mt-1">Tech/Methods: {[p.tech_stack, p.methods_used].filter(Boolean).join(" | ")}</p>
                        )}
                      </div>
                      <button type="button" onClick={() => removeProject(idx)} className="text-destructive hover:text-destructive/80 transition-colors ml-4">✕</button>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-3 p-4 bg-card border border-border rounded-lg">
              <Input value={newProject.title} onChange={(e) => setNewProject({ ...newProject, title: e.target.value })} placeholder="Project Title" />
              <textarea value={newProject.description} onChange={(e) => setNewProject({ ...newProject, description: e.target.value })} placeholder="Project Description" className="w-full p-2 border border-border rounded-lg bg-background text-foreground text-sm" rows={2} />
              <Input value={newProject.tech_stack} onChange={(e) => setNewProject({ ...newProject, tech_stack: e.target.value })} placeholder="Tech Stack (comma-separated)" />
              <Input value={newProject.methods_used} onChange={(e) => setNewProject({ ...newProject, methods_used: e.target.value })} placeholder="Methods Used (comma-separated)" />
              <AnimatePresence>
                {projectError && (
                  <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} className="text-sm text-destructive">{projectError}</motion.p>
                )}
              </AnimatePresence>
              <motion.button onClick={addProject} type="button" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full py-2 px-4 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity text-sm font-medium">Add Project</motion.button>
            </div>
          </div>

          {/* Education */}
          <div className="pt-4 border-t border-border">
            <h3 className="text-lg font-semibold text-foreground mb-3">Education</h3>
            <AnimatePresence>
              {education.length > 0 && (
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="mb-6 space-y-2">
                  {education.map((e, idx) => (
                    <motion.div key={idx} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="p-4 bg-secondary rounded-lg flex items-start justify-between">
                      <div className="flex-1">
                        <p className="font-medium text-foreground">{e.degree}</p>
                        <p className="text-sm text-muted-foreground mt-1">{e.institution}</p>
                        {e.year && <p className="text-sm text-primary mt-1">Year: {e.year}</p>}
                      </div>
                      <button type="button" onClick={() => removeEducation(idx)} className="text-destructive hover:text-destructive/80 transition-colors ml-4">✕</button>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-3 p-4 bg-card border border-border rounded-lg">
              <Input value={newEducation.degree} onChange={(e) => setNewEducation({ ...newEducation, degree: e.target.value })} placeholder="Degree" />
              <Input value={newEducation.institution} onChange={(e) => setNewEducation({ ...newEducation, institution: e.target.value })} placeholder="Institution" />
              <Input value={newEducation.year} onChange={(e) => setNewEducation({ ...newEducation, year: e.target.value })} placeholder="Year" />
              <AnimatePresence>
                {educationError && (
                  <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} className="text-sm text-destructive">{educationError}</motion.p>
                )}
              </AnimatePresence>
              <motion.button onClick={addEducation} type="button" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full py-2 px-4 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity text-sm font-medium">Add Education</motion.button>
            </div>
          </div>

          {/* Publications */}
          <div className="pt-4 border-t border-border">
            <h3 className="text-lg font-semibold text-foreground mb-3">Publications</h3>
            <AnimatePresence>
              {publications.length > 0 && (
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="mb-6 space-y-2">
                  {publications.map((p, idx) => (
                    <motion.div key={idx} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="p-4 bg-secondary rounded-lg flex items-start justify-between">
                      <div className="flex-1">
                        <p className="font-medium text-foreground">{p.title}</p>
                        <p className="text-sm text-muted-foreground mt-1">{p.journal_or_conference}</p>
                        {p.year && <p className="text-sm text-primary mt-1">Year: {p.year}</p>}
                        {p.short_bio && <p className="text-sm text-muted-foreground mt-1">{p.short_bio}</p>}
                      </div>
                      <button type="button" onClick={() => removePublication(idx)} className="text-destructive hover:text-destructive/80 transition-colors ml-4">✕</button>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-3 p-4 bg-card border border-border rounded-lg">
              <Input value={newPublication.title} onChange={(e) => setNewPublication({ ...newPublication, title: e.target.value })} placeholder="Title" />
              <Input value={newPublication.year} onChange={(e) => setNewPublication({ ...newPublication, year: e.target.value })} placeholder="Year" />
              <Input value={newPublication.journal_or_conference} onChange={(e) => setNewPublication({ ...newPublication, journal_or_conference: e.target.value })} placeholder="Journal or Conference" />
              <textarea value={newPublication.short_bio} onChange={(e) => setNewPublication({ ...newPublication, short_bio: e.target.value })} placeholder="Short summary (optional)" className="w-full p-2 border border-border rounded-lg bg-background text-foreground text-sm" rows={2} />
              <AnimatePresence>
                {publicationError && (
                  <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} className="text-sm text-destructive">{publicationError}</motion.p>
                )}
              </AnimatePresence>
              <motion.button onClick={addPublication} type="button" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full py-2 px-4 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity text-sm font-medium">Add Publication</motion.button>
            </div>
          </div>
          {/* Contact & Availability */}
          <div className="pt-4 border-t border-border">
            <label className="block text-sm font-medium text-foreground mb-2">Contact Email</label>
            <Input value={user.email} disabled className="bg-muted mb-4" />

            <div className="flex items-center gap-3">
              <motion.button
                type="button"
                onClick={() => setOpenToConnect(!openToConnect)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className={`relative w-12 h-6 rounded-full transition-colors ${
                  openToConnect ? "bg-primary" : "bg-muted"
                }`}
              >
                <motion.div
                  layout
                  className={`w-5 h-5 bg-white rounded-full transition-transform`}
                  animate={{ x: openToConnect ? 20 : 2 }}
                />
              </motion.button>
              <label className="text-sm font-medium text-foreground">Open to Research Collaborations</label>
            </div>
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
