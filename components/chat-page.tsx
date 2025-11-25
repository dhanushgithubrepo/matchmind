"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useState, useRef, useEffect } from "react"
import { ChatMessage } from "@/components/chat-message"
import { ChatInput } from "@/components/chat-input"
import { MatchResultCard } from "@/components/match-result-card"
import { ProfileView } from "@/components/profile-view"

interface Message {
  id: string
  type: "user" | "assistant"
  content: string
  timestamp: Date
  matches?: any[]
  reasoning?: string
}

interface ChatPageProps {
  user: any
  onLogout: () => void
}

export function ChatPage({ user, onLogout }: ChatPageProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(false)
  const [showProfile, setShowProfile] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const handleSendMessage = async (userMessage: string) => {
    if (!userMessage.trim()) return

    // Add user message
    const userMsg: Message = {
      id: Date.now().toString(),
      type: "user",
      content: userMessage,
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, userMsg])

    setLoading(true)
    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || ""
      let assistantMsg: Message
      if (backendUrl) {
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
        const role = (user?.role || '').toString().toLowerCase()
        const qLower = userMessage.toLowerCase()
        const mentionsHR = /(\bhr\b|hiring manager|recruiter|talent acquisition)/.test(qLower)
        const mentionsDev = /(developer|engineer|software|candidate|job seeker)/.test(qLower)
        const mentionsResearcher = /(researcher|research|scientist|professor|academia)/.test(qLower)
        const target = mentionsHR
          ? 'hrs'
          : mentionsResearcher
          ? 'researchers'
          : mentionsDev
          ? 'seekers'
          : (role === 'hr' ? 'seekers' : (role === 'seeker' || role === 'jobseeker') ? 'hrs' : 'seekers')
        let res = await fetch(`${backendUrl}/api/profiles/match`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          credentials: 'include',
          body: JSON.stringify({ query: userMessage, useHRProfileEmbedding: true, blendWeight: 0.7, target }),
        })
        if (res.status === 401 && token) {
          // Retry without Authorization to allow session-based auth
          res = await fetch(`${backendUrl}/api/profiles/match`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: 'include',
            body: JSON.stringify({ query: userMessage, useHRProfileEmbedding: true, blendWeight: 0.7, target }),
          })
        }
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
          assistantMsg = {
            id: (Date.now() + 1).toString(),
            type: "assistant",
            content: data.reasoning || "Here are the most relevant matches.",
            timestamp: new Date(),
            matches: mapped,
            reasoning: data.reasoning,
          }
        } else {
          assistantMsg = {
            id: (Date.now() + 1).toString(),
            type: "assistant",
            content: "No matches available right now.",
            timestamp: new Date(),
            matches: [],
          }
        }
      } else {
        assistantMsg = {
          id: (Date.now() + 1).toString(),
          type: "assistant",
          content: "No matches available right now.",
          timestamp: new Date(),
          matches: [],
        }
      }
      setMessages((prev) => [...prev, assistantMsg])
    } finally {
      setLoading(false)
    }
  }

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header */}
      <motion.div
        className="border-b border-border bg-card/50 backdrop-blur-md sticky top-0 z-10"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src={user.avatar || user.picture || "/placeholder.svg?height=40&width=40&query=avatar"}
              alt={user.name}
              className="w-10 h-10 rounded-full"
            />
            <div>
              <h1 className="font-semibold text-foreground">MatchMind Chat</h1>
              <p className="text-xs text-muted-foreground">Powered by AI Matching Engine</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <motion.button
              onClick={() => setShowProfile(true)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-3 py-1.5 text-sm bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg transition-colors"
            >
              Profile
            </motion.button>
            <motion.button
              onClick={onLogout}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-3 py-1.5 text-sm bg-muted hover:bg-secondary text-foreground rounded-lg transition-colors"
            >
              Logout
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto w-full px-4 py-8">
          <AnimatePresence>
            {messages.length === 0 ? (
              <motion.div
                className="flex flex-col items-center justify-center h-full min-h-96 text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="text-5xl mb-4">🤖</div>
                <h2 className="text-2xl font-bold text-foreground mb-2">Welcome to MatchMind Chat</h2>
                <p className="text-muted-foreground max-w-md mb-8">
                  Ask me to find researchers, developers, or hiring managers using natural language. I'll search through
                  profiles and show you the best matches!
                </p>
                <div className="space-y-3 w-full max-w-md">
                  {[
                    "Find ML researchers with 10+ years experience",
                    "Show me HRs hiring for data scientists in New York",
                    "Find senior full-stack developers",
                    "Looking for AI ethics researchers",
                  ].map((suggestion, i) => (
                    <motion.button
                      key={i}
                      onClick={() => handleSendMessage(suggestion)}
                      whileHover={{ x: 4 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full text-left p-3 rounded-lg bg-card hover:bg-secondary border border-border text-sm text-foreground transition-colors"
                    >
                      {suggestion}
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            ) : (
              <div className="space-y-4">
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ChatMessage message={message} />
                    {message.matches && message.matches.length > 0 && (
                      <motion.div
                        className="mt-4 grid gap-3"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ staggerChildren: 0.08, delayChildren: 0.2 }}
                      >
                        {message.matches.map((match) => (
                          <motion.div key={match.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                            <MatchResultCard match={match} />
                          </motion.div>
                        ))}
                      </motion.div>
                    )}
                  </motion.div>
                ))}
                {loading && (
                  <motion.div
                    className="flex gap-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <motion.div
                      className="w-3 h-3 bg-primary rounded-full"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 0.6, repeat: Number.POSITIVE_INFINITY }}
                    />
                    <motion.div
                      className="w-3 h-3 bg-primary rounded-full"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 0.6, delay: 0.1, repeat: Number.POSITIVE_INFINITY }}
                    />
                    <motion.div
                      className="w-3 h-3 bg-primary rounded-full"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 0.6, delay: 0.2, repeat: Number.POSITIVE_INFINITY }}
                    />
                  </motion.div>
                )}
              </div>
            )}
          </AnimatePresence>
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <motion.div
        className="border-t border-border bg-card/50 backdrop-blur-md sticky bottom-0"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <div className="max-w-4xl mx-auto px-4 py-6">
          <ChatInput onSendMessage={handleSendMessage} loading={loading} />
        </div>
      </motion.div>

      {/* Profile Modal */}
      <AnimatePresence>
        {showProfile && (
          <ProfileView user={user} onClose={() => setShowProfile(false)} />
        )}
      </AnimatePresence>
    </div>
  )
}
