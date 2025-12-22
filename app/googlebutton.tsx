import { ThemedText } from '@/components/themed-text';
import { useAuth } from '@/contexts/AuthContext';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Platform, Pressable, StyleSheet, View } from 'react-native';

declare global {
  interface Window {
    google: any;
  }
}

interface GoogleButtonProps {
  buttonText?: string;
}

const GoogleButton: React.FC<GoogleButtonProps> = ({ buttonText = "Sign up with Google" }) => {
  const { signIn } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (Platform.OS !== 'web') {
      // Mobile setup
      GoogleSignin.configure({
        webClientId: "647366167286-9nmlmk5gg3qroc55rd0jdokte5s7muur.apps.googleusercontent.com",
        iosClientId: "647366167286-t82v2msoh3s4cft9bl6rjl208vspp3rs.apps.googleusercontent.com",
        offlineAccess: true, // Get access token for server-side verification
      });
    } else {
      const handleScriptLoad = () => {
        if (window.google) {
          window.google.accounts.id.initialize({
            client_id: "647366167286-9nmlmk5gg3qroc55rd0jdokte5s7muur.apps.googleusercontent.com",
            callback: handleWebSignIn,
          });

          window.google.accounts.id.renderButton(
            document.getElementById('googleButtonDiv'),
            { theme: 'outline', size: 'large' }
          );
        }
      };

      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = handleScriptLoad;
      document.body.appendChild(script);

      return () => {
        if (document.body.contains(script)) {
          document.body.removeChild(script);
        }
      };
    }
  }, []);

  const handleWebSignIn = async (response: any) => {
    if (response.credential) {
      setIsLoading(true);
      try {
        // Decode the JWT token to get user info
        const base64Url = response.credential.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
          atob(base64)
            .split('')
            .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
            .join('')
        );
        const userData = JSON.parse(jsonPayload);

        await signIn({
          googleId: userData.sub,
          name: userData.name || 'User',
          email: userData.email || '',
          pictureUrl: userData.picture || '',
          idToken: response.credential,
        });

        router.replace('/');
      } catch (error) {
        console.error('Error signing in:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleMobileSignIn = async () => {
    setIsLoading(true);
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      
      if (userInfo.data?.user) {
        const user = userInfo.data.user;
        const tokens = await GoogleSignin.getTokens();
        
        await signIn({
          googleId: user.id || '',
          name: user.name || 'User',
          email: user.email || '',
          pictureUrl: user.photo || '',
          idToken: tokens.idToken || '',
        });

        router.replace('/');
      }
    } catch (error: any) {
      if (error.code !== 'SIGN_IN_CANCELLED') {
        console.log('Google Sign-In error:', error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (Platform.OS === 'web') {
    return (
      <View style={{ alignItems: 'center', width: '100%' }}>
        {isLoading && <ActivityIndicator size="small" color="#5865F2" />}
        <View id="googleButtonDiv" />
      </View>
    );
  }

  return (
    <View style={styles.googleContainer}>
      <Pressable 
        style={[styles.googleButton, isLoading && styles.googleButtonDisabled]} 
        onPress={handleMobileSignIn}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator size="small" color="#ebedeeff" />
        ) : (
          <ThemedText style={styles.googleText}>{buttonText}</ThemedText>
        )}
      </Pressable>
    </View>
  );
};

export default GoogleButton;

const styles = StyleSheet.create({
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#37c2e9ff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    width: '60%',
    marginBottom: 15
  },
  googleButtonDisabled: {
    opacity: 0.6,
  },
  googleContainer: {
    alignItems: 'center'
  },
  googleText: {
    color: '#ebedeeff',
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 8,
  },
});

