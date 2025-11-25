"use client"

import { motion } from "framer-motion"
import { useState } from "react"

interface MatchResultCardProps {
  match: any
}

export function MatchResultCard({ match }: MatchResultCardProps) {
  const [isSaved, setIsSaved] = useState(false)
  const [contactFeedback, setContactFeedback] = useState<string | null>(null)
  const [expanded, setExpanded] = useState(false)

  const handleViewProfile = () => {
    setExpanded((v) => !v)
  }

  return (
    <motion.div
      className="p-4 bg-card border border-border rounded-xl hover:border-primary/50 transition-all relative"
      whileHover={{ y: -2 }}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-foreground">{match.name}</h3>
            {match.badge && (
              <span className="text-xs font-semibold px-2 py-0.5 bg-accent/20 text-accent rounded-full">
                {match.badge}
              </span>
            )}
          </div>
          <p className="text-sm text-primary font-medium">{match.title}</p>
        </div>
        <div className="text-right">
          {/* Match score from mock RAG - will be replaced with real backend scores */}
          <p className="text-lg font-bold text-primary">{match.matchScore}%</p>
          <p className="text-xs text-muted-foreground">Match</p>
        </div>
      </div>

      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{match.description}</p>

      <div className="flex flex-wrap gap-2 mb-3">
        {match.expertise?.slice(0, 3).map((tag: string, idx: number) => (
          <span key={idx} className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
            {tag}
          </span>
        ))}
      </div>

      <div className="flex items-center gap-2 mb-3">
        {match.affiliation && <span className="text-xs text-muted-foreground">📍 {match.affiliation}</span>}
        {match.company && <span className="text-xs text-muted-foreground">🏢 {match.company}</span>}
      </div>

      <div className="flex gap-2">
        <motion.button
          onClick={() => setIsSaved(!isSaved)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`flex-1 py-2 px-3 text-sm font-medium rounded-lg transition-all ${
            isSaved
              ? "bg-accent/20 text-accent border border-accent/50"
              : "bg-muted text-muted-foreground border border-border hover:border-muted-foreground"
          }`}
        >
          {isSaved ? "✓ Saved" : "Save"}
        </motion.button>
        <motion.button
          onClick={handleViewProfile}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex-1 py-2 px-3 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-all"
        >
          {expanded ? 'Hide Profile' : 'View Profile'}
        </motion.button>
      </div>

      {expanded && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-3 p-3 border border-border rounded-lg text-sm space-y-2"
        >
          {match.email && <div><span className="font-medium">Email:</span> {match.email}</div>}
          {match.raw?.resume_link && <div><span className="font-medium">Resume:</span> <a className="text-primary underline" href={match.raw.resume_link} target="_blank" rel="noreferrer">{match.raw.resume_link}</a></div>}
          {match.raw?.linkedin_url && <div><span className="font-medium">LinkedIn:</span> <a className="text-primary underline" href={match.raw.linkedin_url} target="_blank" rel="noreferrer">{match.raw.linkedin_url}</a></div>}
          {match.raw?.github_url && <div><span className="font-medium">GitHub:</span> <a className="text-primary underline" href={match.raw.github_url} target="_blank" rel="noreferrer">{match.raw.github_url}</a></div>}
          {Array.isArray(match.raw?.top_skills) && match.raw.top_skills.length > 0 && (
            <div>
              <span className="font-medium">Top skills:</span> {match.raw.top_skills.join(', ')}
            </div>
          )}
          {match.raw?.years_of_experience && <div><span className="font-medium">Experience:</span> {match.raw.years_of_experience}</div>}
          {match.raw?.expected_salary && <div><span className="font-medium">Expected salary:</span> {match.raw.expected_salary}</div>}
          {Array.isArray(match.raw?.projects) && match.raw.projects.length > 0 && (
            <div>
              <div className="font-medium">Projects:</div>
              <ul className="list-disc pl-5 space-y-1">
                {match.raw.projects.slice(0,3).map((pr: any, idx: number) => (
                  <li key={idx}><span className="font-medium">{pr.title}:</span> {pr.description}</li>
                ))}
              </ul>
            </div>
          )}
          {Array.isArray(match.raw?.education) && match.raw.education.length > 0 && (
            <div>
              <div className="font-medium">Education:</div>
              <ul className="list-disc pl-5 space-y-1">
                {match.raw.education.slice(0,3).map((ed: any, idx: number) => (
                  <li key={idx}>{ed.degree} - {ed.institution} {ed.year ? `(${ed.year})` : ''}</li>
                ))}
              </ul>
            </div>
          )}
        </motion.div>
      )}
    </motion.div>
  )
}
