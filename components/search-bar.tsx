"use client"

import type React from "react"

import { motion } from "framer-motion"
import { Input } from "@/components/ui/input"

interface SearchBarProps {
  query: string
  onQueryChange: (query: string) => void
  onSearch: () => void
}

export function SearchBar({ query, onQueryChange, onSearch }: SearchBarProps) {
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      onSearch()
    }
  }

  return (
    <motion.div
      className="relative"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
    >
      <div className="flex gap-3">
        <div className="flex-1 relative">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground text-lg">🔍</div>
          <Input
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Find ML researchers, Show HRs hiring for data scientists..."
            className="pl-12 pr-4 py-6 text-base focus:ring-2 focus:ring-primary/50"
          />
        </div>
        <motion.button
          onClick={onSearch}
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
          className="px-8 py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-all duration-300 font-medium shadow-sm hover:shadow-md"
        >
          Search
        </motion.button>
      </div>
    </motion.div>
  )
}
