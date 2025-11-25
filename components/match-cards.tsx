"use client"

import { motion } from "framer-motion"
import { useState } from "react"

interface MatchCardsProps {
  matches: any[]
  userRole: string
}

export function MatchCards({ matches, userRole }: MatchCardsProps) {
  const [savedMatches, setSavedMatches] = useState<string[]>([])
  const [hoveredId, setHoveredId] = useState<string | null>(null)

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 },
    },
  }

  const toggleSave = (id: string) => {
    setSavedMatches((prev) => (prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id]))
  }

  if (matches.length === 0) {
    return (
      <motion.div className="text-center py-12" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <div className="text-5xl mb-4">🤔</div>
        <h2 className="text-xl font-bold text-foreground mb-2">No matches found</h2>
        <p className="text-muted-foreground">Try adjusting your search criteria</p>
      </motion.div>
    )
  }

  return (
    <motion.div
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {matches.map((match) => (
        <motion.div
          key={match.id}
          className="relative p-6 bg-card border border-border rounded-xl hover:border-primary transition-all duration-300 overflow-hidden group"
          variants={itemVariants}
          onMouseEnter={() => setHoveredId(match.id)}
          onMouseLeave={() => setHoveredId(null)}
          whileHover={{ y: -4, boxShadow: "0 12px 24px rgba(0,0,0,0.1)" }}
        >
          {/* Badge */}
          {match.badge && (
            <motion.div
              className="absolute top-4 right-4 text-xs font-semibold px-3 py-1 bg-accent/20 text-accent rounded-full"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              {match.badge}
            </motion.div>
          )}

          {/* Content */}
          <div className="flex items-start justify-between mb-4 pr-20">
            <div>
              <h3 className="text-lg font-bold text-foreground">{match.name}</h3>
              <p className="text-sm text-primary font-medium mt-1">{match.title}</p>
            </div>
          </div>

          <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{match.description}</p>

          {/* Match Score */}
          {match.matchScore && (
            <div className="flex items-center gap-2 mb-4">
              <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-primary"
                  initial={{ width: 0 }}
                  animate={{ width: `${match.matchScore}%` }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                />
              </div>
              <span className="text-xs font-semibold text-foreground">{match.matchScore}%</span>
            </div>
          )}

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-4">
            {match.expertise?.slice(0, 2).map((tag: string, idx: number) => (
              <span key={idx} className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                {tag}
              </span>
            ))}
            {match.expertise && match.expertise.length > 2 && (
              <span className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded-full">
                +{match.expertise.length - 2}
              </span>
            )}
          </div>

          {/* Meta Info */}
          {match.affiliation && <p className="text-xs text-muted-foreground mb-2">📍 {match.affiliation}</p>}
          {match.company && <p className="text-xs text-muted-foreground mb-2">🏢 {match.company}</p>}

          {/* Actions */}
          <motion.div
            className="flex gap-2 mt-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: hoveredId === match.id ? 1 : 0 }}
          >
            <motion.button
              onClick={() => toggleSave(match.id)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`flex-1 py-2 px-3 rounded-lg transition-all text-sm font-medium ${
                savedMatches.includes(match.id)
                  ? "bg-accent/20 text-accent border border-accent/50"
                  : "bg-muted text-muted-foreground border border-border"
              }`}
            >
              {savedMatches.includes(match.id) ? "Saved" : "Save"}
            </motion.button>
            <motion.button
              onClick={() => alert(`Contacting: ${match.email}`)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex-1 py-2 px-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-all text-sm font-medium"
            >
              Contact
            </motion.button>
          </motion.div>
        </motion.div>
      ))}
    </motion.div>
  )
}
