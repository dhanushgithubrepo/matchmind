"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { getUserEmail } from "@/lib/auth"

interface ProfileViewProps {
  user: any
  onClose: () => void
}

export function ProfileView({ user, onClose }: ProfileViewProps) {
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [editedProfile, setEditedProfile] = useState<any>(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('authToken')
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000'
      
      // Try to fetch from all profile types
      const profileTypes = ['jobseeker', 'researcher', 'hr']
      
      for (const type of profileTypes) {
        try {
          const response = await fetch(`${backendUrl}/api/profiles/${type}`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          })
          
          if (response.ok) {
            const data = await response.json()
            if (data.success && data.profile) {
              setProfile({ ...data.profile, profileType: type })
              setEditedProfile({ ...data.profile })
              break
            }
          }
        } catch (err) {
          continue
        }
      }
    } catch (error) {
      console.error('Error fetching profile:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    try {
      setSaving(true)
      const token = localStorage.getItem('authToken')
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000'
      
      const response = await fetch(`${backendUrl}/api/profiles/${profile.profileType}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(editedProfile)
      })

      const result = await response.json()

      if (result.success) {
        setProfile({ ...result.profile, profileType: profile.profileType })
        setEditedProfile({ ...result.profile })
        setEditing(false)
        alert('Profile updated successfully!')
      } else {
        alert('Error updating profile: ' + result.message)
      }
    } catch (error) {
      console.error('Error saving profile:', error)
      alert('Failed to save profile')
    } finally {
      setSaving(false)
    }
  }

  const renderProfileContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center py-12">
          <div className="flex gap-2">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-3 h-3 bg-primary rounded-full"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 0.6, delay: i * 0.1, repeat: Infinity }}
              />
            ))}
          </div>
        </div>
      )
    }

    if (!profile) {
      return (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No profile found</p>
        </div>
      )
    }

    // Job Seeker Profile
    if (profile.profileType === 'jobseeker') {
      return (
        <div className="space-y-4">
          <ProfileField
            label="Name"
            value={editing ? editedProfile.name : profile.name}
            editing={editing}
            onChange={(val) => setEditedProfile({ ...editedProfile, name: val })}
          />
          <ProfileField
            label="Email"
            value={user.email || getUserEmail()}
            editing={false}
          />
          <ProfileField
            label="Location"
            value={editing ? editedProfile.location : profile.location}
            editing={editing}
            onChange={(val) => setEditedProfile({ ...editedProfile, location: val })}
          />
          <ProfileField
            label="Role"
            value={editing ? editedProfile.role : profile.role}
            editing={editing}
            onChange={(val) => setEditedProfile({ ...editedProfile, role: val })}
          />
          <ProfileField
            label="Top Skills"
            value={editing 
              ? (Array.isArray(editedProfile.top_skills) ? editedProfile.top_skills.join(', ') : editedProfile.top_skills)
              : (Array.isArray(profile.top_skills) ? profile.top_skills.join(', ') : profile.top_skills)
            }
            editing={editing}
            onChange={(val) => setEditedProfile({ ...editedProfile, top_skills: val })}
          />
          <ProfileField
            label="Career Objective"
            value={editing ? editedProfile.career_objective : profile.career_objective}
            editing={editing}
            multiline
            onChange={(val) => setEditedProfile({ ...editedProfile, career_objective: val })}
          />
          <ProfileField
            label="Years of Experience"
            value={editing ? editedProfile.years_of_experience : profile.years_of_experience}
            editing={editing}
            onChange={(val) => setEditedProfile({ ...editedProfile, years_of_experience: val })}
          />
          <ProfileField
            label="Expected Salary"
            value={editing ? editedProfile.expected_salary : profile.expected_salary}
            editing={editing}
            onChange={(val) => setEditedProfile({ ...editedProfile, expected_salary: val })}
          />
          <ProfileField
            label="Preferred Job Type"
            value={editing ? editedProfile.preferred_job_type : profile.preferred_job_type}
            editing={editing}
            onChange={(val) => setEditedProfile({ ...editedProfile, preferred_job_type: val })}
          />
          <ProfileField
            label="Resume Link (Google Drive)"
            value={editing ? editedProfile.resume_link : profile.resume_link}
            editing={editing}
            onChange={(val) => setEditedProfile({ ...editedProfile, resume_link: val })}
          />
          <ProfileField
            label="LinkedIn"
            value={editing ? editedProfile.linkedin_url : profile.linkedin_url}
            editing={editing}
            onChange={(val) => setEditedProfile({ ...editedProfile, linkedin_url: val })}
          />
          <ProfileField
            label="GitHub"
            value={editing ? editedProfile.github_url : profile.github_url}
            editing={editing}
            onChange={(val) => setEditedProfile({ ...editedProfile, github_url: val })}
          />

          {/* Projects Section */}
          <div className="pt-4 border-t border-border">
            <h3 className="text-lg font-semibold mb-3">Projects</h3>
            {profile.projects && profile.projects.length > 0 ? (
              <div className="space-y-3">
                {profile.projects.map((project: any, idx: number) => (
                  <div key={idx} className="p-4 bg-secondary rounded-lg">
                    <p className="font-medium">{project.title}</p>
                    {project.description && (
                      <p className="text-sm text-muted-foreground mt-1">{project.description}</p>
                    )}
                    {project.tech_stack && (
                      <p className="text-sm text-primary mt-1">
                        Tech: {Array.isArray(project.tech_stack) ? project.tech_stack.join(', ') : project.tech_stack}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No projects added</p>
            )}
          </div>

          {/* Education Section */}
          <div className="pt-4 border-t border-border">
            <h3 className="text-lg font-semibold mb-3">Education</h3>
            {profile.education && profile.education.length > 0 ? (
              <div className="space-y-3">
                {profile.education.map((edu: any, idx: number) => (
                  <div key={idx} className="p-4 bg-secondary rounded-lg">
                    <p className="font-medium">{edu.degree}</p>
                    <p className="text-sm text-muted-foreground mt-1">{edu.institution}</p>
                    {edu.year && (
                      <p className="text-sm text-primary mt-1">Year: {edu.year}</p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No education added</p>
            )}
          </div>
        </div>
      )
    }

    // Researcher Profile
    if (profile.profileType === 'researcher') {
      return (
        <div className="space-y-4">
          <ProfileField
            label="Name"
            value={editing ? editedProfile.name : profile.name}
            editing={editing}
            onChange={(val) => setEditedProfile({ ...editedProfile, name: val })}
          />
          <ProfileField
            label="Email"
            value={profile.contact_email}
            editing={false}
          />
          <ProfileField
            label="Affiliation"
            value={editing ? editedProfile.affiliation : profile.affiliation}
            editing={editing}
            onChange={(val) => setEditedProfile({ ...editedProfile, affiliation: val })}
          />
          <ProfileField
            label="Field of Research"
            value={editing ? editedProfile.field_of_research : profile.field_of_research}
            editing={editing}
            onChange={(val) => setEditedProfile({ ...editedProfile, field_of_research: val })}
          />
          <ProfileField
            label="Career Objective"
            value={editing ? editedProfile.career_objective : profile.career_objective}
            editing={editing}
            multiline
            onChange={(val) => setEditedProfile({ ...editedProfile, career_objective: val })}
          />
          <ProfileField
            label="Research Keywords"
            value={editing 
              ? (Array.isArray(editedProfile.research_keywords) ? editedProfile.research_keywords.join(', ') : editedProfile.research_keywords)
              : (Array.isArray(profile.research_keywords) ? profile.research_keywords.join(', ') : profile.research_keywords)
            }
            editing={editing}
            onChange={(val) => setEditedProfile({ ...editedProfile, research_keywords: val })}
          />
          <ProfileField
            label="Skills Needed"
            value={editing 
              ? (Array.isArray(editedProfile.skills_needed) ? editedProfile.skills_needed.join(', ') : editedProfile.skills_needed)
              : (Array.isArray(profile.skills_needed) ? profile.skills_needed.join(', ') : profile.skills_needed)
            }
            editing={editing}
            onChange={(val) => setEditedProfile({ ...editedProfile, skills_needed: val })}
          />

          {/* Current project simple fields retained */}
          <ProfileField
            label="Current Project"
            value={editing ? editedProfile.current_project_title : profile.current_project_title}
            editing={editing}
            onChange={(val) => setEditedProfile({ ...editedProfile, current_project_title: val })}
          />
          <ProfileField
            label="Project Description"
            value={editing ? editedProfile.current_project_description : profile.current_project_description}
            editing={editing}
            multiline
            onChange={(val) => setEditedProfile({ ...editedProfile, current_project_description: val })}
          />

          {/* Projects */}
          <div className="pt-4 border-t border-border">
            <h3 className="text-lg font-semibold mb-3">Projects</h3>
            {profile.projects && profile.projects.length > 0 ? (
              <div className="space-y-3">
                {profile.projects.map((p: any, idx: number) => (
                  <div key={idx} className="p-4 bg-secondary rounded-lg">
                    <p className="font-medium">{p.title}</p>
                    {p.description && <p className="text-sm text-muted-foreground mt-1">{p.description}</p>}
                    {(p.tech_stack && p.tech_stack.length > 0) && (
                      <p className="text-sm text-primary mt-1">Tech: {p.tech_stack.join(', ')}</p>
                    )}
                    {(p.methods_used && p.methods_used.length > 0) && (
                      <p className="text-sm text-primary mt-1">Methods: {p.methods_used.join(', ')}</p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No projects added</p>
            )}
          </div>

          {/* Education */}
          <div className="pt-4 border-t border-border">
            <h3 className="text-lg font-semibold mb-3">Education</h3>
            {profile.education && profile.education.length > 0 ? (
              <div className="space-y-3">
                {profile.education.map((e: any, idx: number) => (
                  <div key={idx} className="p-4 bg-secondary rounded-lg">
                    <p className="font-medium">{e.degree}</p>
                    <p className="text-sm text-muted-foreground mt-1">{e.institution}</p>
                    {e.year && <p className="text-sm text-primary mt-1">Year: {e.year}</p>}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No education added</p>
            )}
          </div>

          {/* Publications */}
          <div className="pt-4 border-t border-border">
            <h3 className="text-lg font-semibold mb-3">Publications</h3>
            {profile.publications && profile.publications.length > 0 ? (
              <div className="space-y-3">
                {profile.publications.map((pub: any, idx: number) => (
                  <div key={idx} className="p-4 bg-secondary rounded-lg">
                    <p className="font-medium">{pub.title}</p>
                    {pub.journal_or_conference && (
                      <p className="text-sm text-muted-foreground mt-1">{pub.journal_or_conference}</p>
                    )}
                    {pub.year && <p className="text-sm text-primary mt-1">Year: {pub.year}</p>}
                    {pub.short_bio && <p className="text-sm text-muted-foreground mt-1">{pub.short_bio}</p>}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No publications added</p>
            )}
          </div>

          <div className="flex items-center gap-2 p-3 bg-secondary rounded-lg">
            <span className="text-sm font-medium">Open to Collaborations:</span>
            <span className="text-sm">{profile.open_to_connect ? '✅ Yes' : '❌ No'}</span>
          </div>
        </div>
      )
    }

    // HR Profile
    if (profile.profileType === 'hr') {
      return (
        <div className="space-y-4">
          <ProfileField
            label="Name"
            value={editing ? editedProfile.name : profile.name}
            editing={editing}
            onChange={(val) => setEditedProfile({ ...editedProfile, name: val })}
          />
          <ProfileField
            label="Email"
            value={profile.contact_email}
            editing={false}
          />
          <ProfileField
            label="Company Name"
            value={editing ? editedProfile.company_name : profile.company_name}
            editing={editing}
            onChange={(val) => setEditedProfile({ ...editedProfile, company_name: val })}
          />
          <ProfileField
            label="Company Industry"
            value={editing ? editedProfile.company_industry : profile.company_industry}
            editing={editing}
            onChange={(val) => setEditedProfile({ ...editedProfile, company_industry: val })}
          />
          <ProfileField
            label="Location"
            value={editing ? editedProfile.location : profile.location}
            editing={editing}
            onChange={(val) => setEditedProfile({ ...editedProfile, location: val })}
          />
          
          <div className="pt-4 border-t border-border">
            <h3 className="text-lg font-semibold mb-3">Hiring For</h3>
            {profile.roles_hiring_for && profile.roles_hiring_for.length > 0 ? (
              <div className="space-y-3">
                {profile.roles_hiring_for.map((role: any, idx: number) => (
                  <div key={idx} className="p-4 bg-secondary rounded-lg">
                    <p className="font-medium">{role.title}</p>
                    {role.job_summary && (
                      <p className="text-sm text-foreground mt-1">Summary: {role.job_summary}</p>
                    )}
                    <p className="text-sm text-muted-foreground mt-1">
                      Skills: {Array.isArray(role.skills_required) ? role.skills_required.join(', ') : role.skills_required}
                    </p>
                    <div className="flex gap-2 mt-2">
                      <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">{role.job_type}</span>
                      <span className="text-xs bg-accent/10 text-accent px-2 py-1 rounded">{role.experience_level}</span>
                    </div>
                    {role.salary_range && (
                      <p className="text-sm text-muted-foreground mt-2">💰 {role.salary_range}</p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No positions listed</p>
            )}
          </div>
        </div>
      )
    }

    return null
  }

  return (
    <motion.div
      className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="bg-card border border-border rounded-xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl"
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-2xl">
              {profile?.profileType === 'jobseeker' && '👩‍💻'}
              {profile?.profileType === 'researcher' && '🧠'}
              {profile?.profileType === 'hr' && '🏢'}
            </div>
            <div>
              <h2 className="text-xl font-bold">My Profile</h2>
              <p className="text-sm text-muted-foreground capitalize">
                {profile?.profileType || 'Loading...'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
          {renderProfileContent()}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-border">
          {editing ? (
            <>
              <Button
                variant="outline"
                onClick={() => {
                  setEditing(false)
                  setEditedProfile({ ...profile })
                }}
                disabled={saving}
              >
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={saving}>
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
            </>
          ) : (
            <Button onClick={() => setEditing(true)}>
              Edit Profile
            </Button>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}

function ProfileField({ 
  label, 
  value, 
  editing, 
  multiline = false,
  onChange 
}: { 
  label: string
  value: string
  editing: boolean
  multiline?: boolean
  onChange?: (val: string) => void
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-muted-foreground mb-1">{label}</label>
      {editing ? (
        multiline ? (
          <textarea
            value={value || ''}
            onChange={(e) => onChange?.(e.target.value)}
            className="w-full p-2 border border-border rounded-lg bg-background text-foreground text-sm"
            rows={3}
          />
        ) : (
          <Input
            value={value || ''}
            onChange={(e) => onChange?.(e.target.value)}
          />
        )
      ) : (
        <p className="text-foreground p-2 bg-secondary rounded-lg">
          {value || 'Not provided'}
        </p>
      )}
    </div>
  )
}
