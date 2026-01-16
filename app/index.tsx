import { useAuth } from '@/contexts/AuthContext';
import { usePathname, Redirect } from 'expo-router';
import { ActivityIndicator, StyleSheet, View } from 'react-native';


export default function Index() {
  const pathname = usePathname();
  const { isAuthenticated, isLoading, user } = useAuth();
  console.log('index ran')
  

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#5865F2" />
      </View>
    );
  }
  if (isAuthenticated && pathname === "/") {
    // Check onboarding flow
    if (user && !user.hasSelectedAvatar) {
      return <Redirect href="/avatar-selection" />;
    }
    if (user && user.hasSelectedAvatar && !user.hasCompletedOnboarding) {
      return <Redirect href="/onboarding" />;
    }
    return <Redirect href="/home" />;
  }

  return <Redirect href="/welcome" />;
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});