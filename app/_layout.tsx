import { AuthProvider } from '@/contexts/AuthContext';
import { ConvexProvider, ConvexReactClient } from 'convex/react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

// Initialize Convex client
// You'll need to set your Convex deployment URL
// Get this from: npx convex dev or your Convex dashboard
const convexUrl = process.env.EXPO_PUBLIC_CONVEX_URL || '';

if (!convexUrl) {
  console.warn('EXPO_PUBLIC_CONVEX_URL is not set. Please set it in your .env file or environment variables.');
}

const convex = new ConvexReactClient(convexUrl);

export default function RootLayout() {
  return (
    <ConvexProvider client={convex}>
      <AuthProvider>
        <Stack screenOptions={{ headerShown: false, animation: 'fade' }} />
        <StatusBar style="auto" />
      </AuthProvider>
    </ConvexProvider>
  );
}
