import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useMutation, useQuery } from 'convex/react';
import { useRouter, useSegments } from 'expo-router';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';

interface User {
  _id: Id<"users">;
  name: string;
  email: string;
  pictureUrl?: string;
  googleId: string;
  selectedAvatar?: string;
  hasSelectedAvatar?: boolean;
  level?: string;
  totalCoins?: number;
  dayStreak?: number;
  timesOnLeaderboard?: number;
  achievements?: string[];
  createdAt?: number;
  hasCompletedOnboarding?: boolean;
  onboardingData?: {
    howDidYouHear?: string;
    interestedTopics?: string[];
    understandingLevel?: string;
    timeCommitment?: string;
    startingPoint?: string;
  };
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signIn: (userData: {
    googleId: string;
    name: string;
    email: string;
    pictureUrl?: string;
    idToken: string;
  }) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_STORAGE_KEY = '@puertaapp:user_id';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const [userId, setUserId] = useState<Id<"users"> | null>(null);
  const router = useRouter();
  const segments = useSegments();
  
  const createOrUpdateUser = useMutation(api.users.createOrUpdateUserFromGoogle);
  const signOutMutation = useMutation(api.users.signOut);
  
  // Get user data if we have a userId
  const user = useQuery(
    api.users.getUserById,
    userId ? { userId } : "skip"
  );

  // Check authentication state on mount
  useEffect(() => {
    checkAuthState();
  }, []);
  console.log('authprovider')

  // Handle navigation based on auth state
  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === '(auth)' || 
                       segments[0] === 'welcome' || 
                       segments[0] === 'signup' ||
                       segments[0] === 'avatar-selection' ||
                       segments[0] === 'onboarding' ||
                       segments[0] === 'upload' ||
                       segments[0] === 'third-party';
    const isAuthenticated = !!user && !!userId;
    const needsAvatar = user && !user.hasSelectedAvatar;
    const needsOnboarding = user && user.hasSelectedAvatar && !user.hasCompletedOnboarding;

    if (!isAuthenticated && !inAuthGroup) {
      // Redirect to welcome if not authenticated
      router.replace('/welcome');
    } else if (isAuthenticated && inAuthGroup && segments[0] !== 'confirmation' && segments[0] !== 'avatar-selection' && segments[0] !== 'onboarding' && segments[0] !=='upload' && segments[0] !== 'third-party') {
      // Check onboarding flow
      if (needsAvatar && segments[0] !== 'avatar-selection') {
        router.replace('/avatar-selection');
      } else if (needsOnboarding && segments[0] !== 'onboarding') {
        router.replace('/onboarding');
      } else if (!needsAvatar && !needsOnboarding) {
        router.replace('/home');
      }
    } else if (isAuthenticated && !inAuthGroup) {
      // Check onboarding flow
      if (needsAvatar) {
        router.replace('/avatar-selection');
      } else if (needsOnboarding) {
        router.replace('/onboarding');
      } else {
        router.replace('/home');
      }
    }
  }, [user, userId, segments, isLoading]);

  const checkAuthState = async () => {
    try {
      const storedUserId = await AsyncStorage.getItem(AUTH_STORAGE_KEY);
      if (storedUserId) {
        setUserId(storedUserId as Id<"users">);
      }
    } catch (error) {
      console.error('Error checking auth state:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const signIn = async (userData: {
    googleId: string;
    name: string;
    email: string;
    pictureUrl?: string;
    idToken: string;
  }) => {
    try {
      const newUser = await createOrUpdateUser(userData);
      if (newUser) {
        setUserId(newUser._id);
        await AsyncStorage.setItem(AUTH_STORAGE_KEY, newUser._id);
      }
    } catch (error) {
      console.error('Error signing in:', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      if (userId) {
        await signOutMutation({ userId });
      }
      setUserId(null);
      await AsyncStorage.removeItem(AUTH_STORAGE_KEY);
      router.replace('/signup');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const value: AuthContextType = {
    user: user || null,
    isLoading,
    isAuthenticated: !!user && !!userId,
    signIn,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}


