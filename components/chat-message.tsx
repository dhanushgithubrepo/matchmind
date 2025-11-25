"use client"

import { motion } from "framer-motion"

interface Message {
  id: string
  type: "user" | "assistant"
  content: string
  timestamp: Date
}

interface ChatMessageProps {
  message: Message
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.type === "user"

  return (
    <motion.div
      className={`flex ${isUser ? "justify-end" : "justify-start"}`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div
        className={`max-w-2xl px-4 py-3 rounded-lg ${
          isUser
            ? "bg-primary text-primary-foreground rounded-br-none"
            : "bg-secondary text-foreground border border-border rounded-bl-none"
        }`}
      >
        <p className="text-sm leading-relaxed">{message.content}</p>
      </div>
    </motion.div>
  )
}
