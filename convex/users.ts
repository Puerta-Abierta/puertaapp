import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { action } from "./_generated/server"; 
import { api } from "./_generated/api";

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
      hasUploadedAvatar: false
    });
    return await ctx.db.get(args.userId);
  },
});

export const replaceUserAvatar = mutation({
  args: {
    userId: v.id("users"),
    newStorageId: v.id("_storage")
  },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId)
    if (!user) return
    
    if (user.hasUploadedAvatar && user.selectedAvatarPath) {
      await ctx.storage.delete(user.selectedAvatarPath)
    }
    await ctx.db.patch(args.userId, {
      selectedAvatarPath: args.newStorageId,
      hasSelectedAvatar: true,
      hasUploadedAvatar: true
    })
  },
});

export const generateUploadUrl = mutation(async (ctx) => {
  return await ctx.storage.generateUploadUrl()
})

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

export const getImage = query({
  args: {
    storageId: v.id("_storage"),
  },
  handler: async (ctx, args) => {
    return await ctx.storage.getUrl(args.storageId)
  }
})

export const importSnapBitmoji = action({
  args: {
    userId: v.id("users"),
    code: v.string()
  },
  handler: async (ctx, args) => {
    const clientId = process.env.SNAPCHAT_CLIENT_ID!;
    const clientSecret = process.env.SNAPCHAT_CLIENT_SECRET!;
    const redirectUri = process.env.SNAPCHAT_REDIRECT_URI!;
  
  
  const tokenRes = await fetch(
    "https://accounts.snapchat.com/accounts/oauth2/token",
    {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          grant_type: "authorization_code",
          code: args.code,
          client_id: clientId,
          client_secret: clientSecret,
          redirect_uri: redirectUri,
        }),
    }
  );

  const tokenData = await tokenRes.json()
  const accessToken = tokenData?.access_token;

  if (!accessToken) {
    alert("Failed to get Snap access token")
  }

  const avatarRes = await fetch(
    "https://kit.snapchat.com/v1/me/bitmoji/avatar",
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  const avatarData = await avatarRes.json()
  const avatarUrl = avatarData?.data?.avatar_url;

  if (!avatarUrl) {
    alert("No bitmoji avatar returned")
  }

  const imageRes = await fetch(avatarUrl)
  const imageBuffer = await imageRes.arrayBuffer()
  const blob = new Blob([imageBuffer], { type: 'image/png' })

  const storageId = await ctx.storage.store(blob)

  await ctx.runMutation(api.users.replaceUserAvatar, {
    userId: args.userId,
    newStorageId: storageId
  })
}
})

