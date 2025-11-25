"use client"

import { motion } from "framer-motion"

interface RecommendationCardsProps {
  matches: any[]
  userRole: string
}

export function RecommendationCards({ matches, userRole }: RecommendationCardsProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
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

  return (
    <motion.div
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {matches.map((match, idx) => (
        <motion.div
          key={match.id}
          className="p-6 bg-gradient-to-br from-primary/5 to-accent/5 border border-primary/20 rounded-xl hover:border-primary/50 transition-all duration-300 group cursor-pointer"
          variants={itemVariants}
          whileHover={{ y: -4, borderColor: "var(--color-primary)" }}
        >
          {/* Star Rating */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => (
                <span key={i} className={i < 4 ? "text-accent text-sm" : "text-muted text-sm"}>
                  ★
                </span>
              ))}
            </div>
            <span className="text-xs font-semibold text-accent">AI Recommended</span>
          </div>

          <h3 className="text-lg font-bold text-foreground mb-1">{match.name}</h3>
          <p className="text-sm text-primary font-medium mb-3">{match.title}</p>
          <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{match.description}</p>

          {/* Quick Stats */}
          <div className="space-y-2 mb-4">
            {match.affiliation && (
              <p className="text-xs text-muted-foreground">
                <span className="font-semibold">Location:</span> {match.affiliation}
              </p>
            )}
            {match.company && (
              <p className="text-xs text-muted-foreground">
                <span className="font-semibold">Company:</span> {match.company}
              </p>
            )}
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-1 mb-4">
            {match.expertise?.slice(0, 3).map((tag: string, idx: number) => (
              <span key={idx} className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded">
                {tag}
              </span>
            ))}
          </div>

          {/* CTA */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full mt-4 py-2 px-4 bg-primary text-primary-foreground rounded-lg group-hover:opacity-90 transition-opacity text-sm font-medium"
          >
            View Profile
          </motion.button>
        </motion.div>
      ))}
    </motion.div>
  )
}
