import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    googleId: v.string(),
    name: v.string(),
    email: v.string(),
    pictureUrl: v.optional(v.string()),
    idToken: v.string(), // Store Google ID token for session
    createdAt: v.number(),
    lastLogin: v.number(),
    // Avatar and profile
    selectedAvatar: v.optional(v.string()), // Avatar image path/name
    hasSelectedAvatar: v.optional(v.boolean()), // Track if user has selected avatar
    level: v.optional(v.string()), // e.g., "Radiant Level FinCer"
    // Stats
    totalCoins: v.optional(v.number()),
    dayStreak: v.optional(v.number()),
    timesOnLeaderboard: v.optional(v.number()),
    // Achievements
    achievements: v.optional(v.array(v.string())), // Array of achievement IDs
    // Onboarding
    hasCompletedOnboarding: v.optional(v.boolean()),
    onboardingData: v.optional(v.object({
      howDidYouHear: v.optional(v.string()),
      interestedTopics: v.optional(v.array(v.string())),
      understandingLevel: v.optional(v.string()),
      timeCommitment: v.optional(v.string()),
      startingPoint: v.optional(v.string()),
    })),
  })
    .index("by_google_id", ["googleId"])
    .index("by_email", ["email"]),
});


