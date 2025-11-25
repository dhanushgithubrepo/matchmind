"use client"

import { motion } from "framer-motion"
import { OAuthButtons } from "@/components/oauth-buttons"

interface LandingPageProps {
  onLogin: (userData: any) => void
}

export function LandingPage({ onLogin }: LandingPageProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary flex items-center justify-center px-4 overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl"
          animate={{ y: [0, 30, 0] }}
          transition={{ duration: 8, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-72 h-72 bg-accent/5 rounded-full blur-3xl"
          animate={{ y: [0, -30, 0] }}
          transition={{ duration: 8, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
        />
      </div>

      <motion.div
        className="max-w-2xl w-full relative z-10"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Logo */}
        <motion.div variants={itemVariants} className="text-center mb-12">
          <motion.div
            className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-2xl mb-6"
            whileHover={{ scale: 1.1, rotate: 5 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="text-2xl font-bold text-primary-foreground">MM</span>
          </motion.div>
        </motion.div>

        {/* Heading */}
        <motion.h1 variants={itemVariants} className="text-5xl md:text-6xl font-bold text-center mb-4 text-foreground">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            MatchMind
          </motion.span>
        </motion.h1>

        {/* Tagline */}
        <motion.p
          variants={itemVariants}
          className="text-xl md:text-2xl text-center text-muted-foreground mb-8 font-light"
        >
          AI-powered connection for hiring, research, and collaboration
        </motion.p>

        {/* Description */}
        <motion.p variants={itemVariants} className="text-center text-muted-foreground mb-12 max-w-md mx-auto">
          Connect with top talent, find your next opportunity, or discover research collaborators. All in one
          intelligent platform.
        </motion.p>

        {/* OAuth Buttons */}
        <motion.div variants={itemVariants}>
          <OAuthButtons onLogin={onLogin} />
        </motion.div>

        {/* Features Grid */}
        <motion.div variants={itemVariants} className="grid grid-cols-3 gap-6 mt-16 pt-12 border-t border-border">
          {[
            { icon: "🎯", label: "Smart Matching", desc: "AI-powered recommendations" },
            { icon: "🔒", label: "Secure", desc: "OAuth verified profiles" },
            { icon: "🚀", label: "Instant", desc: "Connect in seconds" },
          ].map((feature, idx) => (
            <motion.div
              key={idx}
              className="text-center"
              whileHover={{ y: -4 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <motion.div className="text-3xl mb-2">{feature.icon}</motion.div>
              <p className="text-sm font-semibold text-foreground">{feature.label}</p>
              <p className="text-xs text-muted-foreground mt-1">{feature.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  )
}
