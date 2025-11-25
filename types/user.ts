export interface User {
  id: string
  name: string
  email: string
  avatar?: string
  provider?: string
}

export interface HRProfile {
  role: "hr"
  company_name: string
  location: string
  contact_email: string
  roles_hiring_for: Position[]
}

export interface Position {
  title: string
  skills_required: string
  experience_level: "entry" | "mid" | "senior"
  job_type: "full-time" | "part-time" | "contract" | "remote"
  salary_range: string
  description: string
}

export interface JobSeekerProfile {
  role: "seeker"
  location: string
  role_title: string
  skills: string[]
  years_of_experience: string
  expected_salary: string
  preferred_job_type: string
  linkedin_url: string
  github_url: string
  resume_file: string
}

export interface ResearcherProfile {
  role: "researcher"
  affiliation: string
  field_of_research: string
  research_keywords: string[]
  publications: string
  current_project_title: string
  current_project_description: string
  skills_needed: string[]
  contact_email: string
  open_to_connect: boolean
}
