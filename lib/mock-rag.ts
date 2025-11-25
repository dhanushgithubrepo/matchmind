// Mock RAG engine that simulates intelligent matching from profiles
interface Profile {
  id: string
  name: string
  title: string
  description: string
  expertise: string[]
  email: string
  affiliation?: string
  company?: string
  matchScore: number
}

const mockProfiles: Profile[] = []

export function mockRAGSearch(query: string): { results: Profile[]; reasoning: string } {
  const lowerQuery = query.toLowerCase()
  const keywords = lowerQuery.split(" ").filter((k) => k.length > 2)

  // Score each profile based on keyword matches
  const scoredProfiles = mockProfiles.map((profile) => {
    let score = 0
    const matchedKeywords: string[] = []

    keywords.forEach((keyword) => {
      // Check if keyword matches any profile field
      if (profile.title.toLowerCase().includes(keyword)) {
        score += 3
        matchedKeywords.push(keyword)
      }
      if (profile.description.toLowerCase().includes(keyword)) {
        score += 2
        matchedKeywords.push(keyword)
      }
      profile.expertise.forEach((exp) => {
        if (exp.toLowerCase().includes(keyword)) {
          score += 2.5
          matchedKeywords.push(keyword)
        }
      })
    })

    return {
      ...profile,
      relevanceScore: score,
      matchedKeywords: [...new Set(matchedKeywords)],
    }
  })

  // Filter and sort by relevance
  const relevantProfiles = scoredProfiles
    .filter((p) => p.relevanceScore > 0)
    .sort((a, b) => b.relevanceScore - a.relevanceScore)
    .slice(0, 5)

  // Generate reasoning
  let reasoning = "Based on your search, I found "
  if (relevantProfiles.length === 0) {
    reasoning = "I couldn't find exact matches for your query. Here are some general recommendations:"
  } else {
    reasoning = `I found ${relevantProfiles.length} highly relevant match${relevantProfiles.length !== 1 ? "es" : ""} based on your search.`
  }

  return {
    results: relevantProfiles.length > 0 ? relevantProfiles : [],
    reasoning,
  }
}
