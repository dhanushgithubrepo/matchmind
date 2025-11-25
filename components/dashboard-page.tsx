"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useState, useMemo } from "react"
import { SearchBar } from "@/components/search-bar"
import { MatchCards } from "@/components/match-cards"
import { RecommendationCards } from "@/components/recommendation-cards"

interface DashboardPageProps {
  user: any
  onLogout: () => void
}

export function DashboardPage({ user, onLogout }: DashboardPageProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [matches, setMatches] = useState<any[]>([])
  const [searched, setSearched] = useState(false)
  const [loading, setLoading] = useState(false)

  const mockMatches: Record<string, any[]> = { researchers: [], developers: [], hrs: [] }

  // Recommendations based on user role
  const recommendations = useMemo(() => {
    return []
  }, [user.role])

  const handleSearch = async () => {
    if (!searchQuery.trim()) return
    setLoading(true)
    setSearched(true)
    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || ""
      if (!backendUrl) {
        setMatches([])
        return
      }
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
      const target = user?.role === 'hr' ? 'seekers' : user?.role === 'seeker' ? 'hrs' : 'seekers'
      const res = await fetch(`${backendUrl}/api/profiles/match`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ query: searchQuery, useHRProfileEmbedding: true, blendWeight: 0.7, target }),
      })
      if (res.ok) {
        const data = await res.json()
        const mapped = Array.isArray(data.results)
          ? data.results.map((r: any) => {
              const p = r.profile || {}
              const isHR = !!p.company_name || Array.isArray(p.roles_hiring_for)
              const isResearcher = !!p.field_of_research || Array.isArray(p.research_keywords) || !!p.affiliation
              const firstRole = Array.isArray(p.roles_hiring_for) && p.roles_hiring_for.length > 0 ? p.roles_hiring_for[0] : null
              const expertise = isHR
                ? (Array.isArray(firstRole?.skills_required) ? firstRole!.skills_required : [])
                : isResearcher
                ? (Array.isArray(p.research_keywords) && p.research_keywords.length ? p.research_keywords : Array.isArray(p.methods_used) ? p.methods_used : [])
                : (Array.isArray(p.top_skills) ? p.top_skills : [])
              return {
                id: p._id || p.id || String(Math.random()),
                name: p.name || (isHR ? p.company_name : 'Candidate') || 'Candidate',
                title: isHR
                  ? (firstRole?.title ? `Hiring for ${firstRole.title}` : 'HR Manager')
                  : isResearcher
                  ? (p.field_of_research ? `Researcher — ${p.field_of_research}` : p.current_project_title || 'Researcher')
                  : (p.role || 'Talent'),
                matchScore: Math.round(((r.score || 0) * 100)),
                description: isHR
                  ? (firstRole?.job_summary || firstRole?.description || '')
                  : isResearcher
                  ? (p.current_project_description || p.career_objective || p.publications?.[0]?.short_bio || '')
                  : (p.career_objective || p.projects?.[0]?.description || ''),
                expertise,
                affiliation: isResearcher ? (p.affiliation || p.location) : p.location,
                company: isHR ? p.company_name : undefined,
                email: p.userId?.email,
                raw: p,
              }
            })
          : []
        setMatches(mapped)
      } else {
        setMatches([])
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <motion.div
        className="max-w-6xl mx-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        {/* Header */}
        <motion.div
          className="flex items-center justify-between mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center gap-4">
            <img
              src={user.avatar || "/placeholder.svg?height=48&width=48&query=user+avatar"}
              alt={user.name}
              className="w-12 h-12 rounded-full bg-secondary"
            />
            <div>
              <h1 className="text-3xl font-bold text-foreground">Welcome back, {user.name.split(" ")[0]}!</h1>
              <p className="text-muted-foreground text-sm mt-1">
                Role:{" "}
                <span className="font-semibold">
                  {user.role === "seeker" ? "Job Seeker" : user.role === "hr" ? "HR Manager" : "Researcher"}
                </span>
              </p>
            </div>
          </div>
          <motion.button
            onClick={onLogout}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-4 py-2 bg-muted hover:bg-secondary text-foreground rounded-lg transition-colors font-medium"
          >
            Logout
          </motion.button>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-12"
        >
          <SearchBar query={searchQuery} onQueryChange={setSearchQuery} onSearch={handleSearch} />
        </motion.div>

        {/* Loading State */}
        <AnimatePresence>
          {loading && (
            <motion.div
              className="text-center py-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div className="flex gap-2 justify-center mb-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                {[0, 1, 2].map((dot) => (
                  <motion.div
                    key={dot}
                    className="w-2 h-2 bg-primary rounded-full"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 0.6, delay: dot * 0.2, repeat: Number.POSITIVE_INFINITY }}
                  />
                ))}
              </motion.div>
              <p className="text-muted-foreground">Searching for matches...</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results or Placeholder */}
        <AnimatePresence mode="wait">
          {!loading && searched ? (
            <motion.div key="results" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <h2 className="text-xl font-semibold text-foreground mb-6">Search Results ({matches.length})</h2>
              <MatchCards matches={matches} userRole={user.role} />
            </motion.div>
          ) : !loading && !searched ? (
            <motion.div
              key="initial"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-12"
            >
              {/* Initial Empty State */}
              <div className="text-center py-12">
                <div className="text-6xl mb-4">✨</div>
                <h2 className="text-2xl font-bold text-foreground mb-2">Ready to find your match?</h2>
                <p className="text-muted-foreground max-w-md mx-auto mb-8">
                  Use the search bar above to discover opportunities, talent, or research collaborators tailored to your
                  needs.
                </p>
                <div className="mt-8 space-y-2">
                  <p className="text-sm text-muted-foreground font-semibold">Try searching for:</p>
                  <div className="flex flex-wrap justify-center gap-3">
                    {user.role === "seeker" && (
                      <>
                        <span className="text-sm text-muted-foreground bg-secondary px-3 py-1 rounded">
                          "Show tech companies hiring"
                        </span>
                        <span className="text-sm text-muted-foreground bg-secondary px-3 py-1 rounded">
                          "Find data science roles"
                        </span>
                      </>
                    )}
                    {user.role === "hr" && (
                      <>
                        <span className="text-sm text-muted-foreground bg-secondary px-3 py-1 rounded">
                          "Find senior developers"
                        </span>
                        <span className="text-sm text-muted-foreground bg-secondary px-3 py-1 rounded">
                          "ML researchers in Bay Area"
                        </span>
                      </>
                    )}
                    {user.role === "researcher" && (
                      <>
                        <span className="text-sm text-muted-foreground bg-secondary px-3 py-1 rounded">
                          "Find AI collaborators"
                        </span>
                        <span className="text-sm text-muted-foreground bg-secondary px-3 py-1 rounded">
                          "Show engineers in NLP"
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Recommendations */}
              {recommendations.length > 0 && (
                <div>
                  <h2 className="text-xl font-semibold text-foreground mb-6">Recommended for You</h2>
                  <RecommendationCards matches={recommendations} userRole={user.role} />
                </div>
              )}
            </motion.div>
          ) : null}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}
