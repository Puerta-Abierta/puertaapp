import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Query to get user by email
export const getUserByEmail = query({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();
    return user;
  },
});

// Query to get user by ID
export const getUserById = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.userId);
  },
});

// Mutation to create or update user from Google Sign-In
export const createOrUpdateUserFromGoogle = mutation({
  args: {
    googleId: v.string(),
    name: v.string(),
    email: v.string(),
    pictureUrl: v.optional(v.string()),
    idToken: v.string(),
  },
  handler: async (ctx, args) => {
    // Check if user already exists by Google ID
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_google_id", (q) => q.eq("googleId", args.googleId))
      .first();

    if (existingUser) {
      // Update existing user
      await ctx.db.patch(existingUser._id, {
        name: args.name,
        email: args.email,
        pictureUrl: args.pictureUrl,
        lastLogin: Date.now(),
        idToken: args.idToken, // Store token for session management
      });
      // Fetch the updated user
      return await ctx.db.get(existingUser._id);
    } else {
      // Create new user with default values
      const currentYear = new Date().getFullYear();
      const userId = await ctx.db.insert("users", {
        googleId: args.googleId,
        name: args.name,
        email: args.email,
        pictureUrl: args.pictureUrl || "",
        createdAt: Date.now(),
        lastLogin: Date.now(),
        idToken: args.idToken,
        hasSelectedAvatar: false, // First-time user hasn't selected avatar
        level: "Radiant Level FinCer",
        totalCoins: 100,
        dayStreak: 5,
        timesOnLeaderboard: 2,
        achievements: ["speedster", "banker", "top_saver", "investor"],
      });
      return await ctx.db.get(userId);
    }
  },
});

// Mutation to update user avatar
export const updateUserAvatar = mutation({
  args: {
    userId: v.id("users"),
    avatar: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.userId, {
      selectedAvatar: args.avatar,
      hasSelectedAvatar: true,
    });
    return await ctx.db.get(args.userId);
  },
});

// Mutation to sign out (clear token)
export const signOut = mutation({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.userId, {
      idToken: "",
    });
    return { success: true };
  },
});

// Mutation to update onboarding data
export const updateOnboardingData = mutation({
  args: {
    userId: v.id("users"),
    onboardingData: v.object({
      howDidYouHear: v.optional(v.string()),
      interestedTopics: v.optional(v.array(v.string())),
      understandingLevel: v.optional(v.string()),
      timeCommitment: v.optional(v.string()),
      startingPoint: v.optional(v.string()),
    }),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.userId, {
      onboardingData: args.onboardingData,
      hasCompletedOnboarding: true,
    });
    return await ctx.db.get(args.userId);
  },
});


