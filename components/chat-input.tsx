"use client"

import type React from "react"

import { motion } from "framer-motion"
import { useState } from "react"
import { Input } from "@/components/ui/input"

interface ChatInputProps {
  onSendMessage: (message: string) => void
  loading: boolean
}

export function ChatInput({ onSendMessage, loading }: ChatInputProps) {
  const [input, setInput] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (input.trim() && !loading) {
      onSendMessage(input)
      setInput("")
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey && !loading) {
      handleSubmit(e as any)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-3">
      <div className="flex-1 relative">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Ask me anything... 'Find ML researchers with 10+ years experience'"
          disabled={loading}
          className="pr-12 focus:ring-primary/50 disabled:opacity-50"
        />
      </div>
      <motion.button
        type="submit"
        disabled={loading || !input.trim()}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium"
      >
        Send
      </motion.button>
    </form>
  )
}
