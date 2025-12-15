import React, { useEffect } from 'react';
import { Platform, Pressable, StyleSheet, View } from 'react-native';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { ThemedText } from '@/components/themed-text'; // your text component

declare global {
  interface Window {
    google: any;
  }
}

interface GoogleButtonProps {
  onSignIn: (userInfo: any) => void;
}

const GoogleButton: React.FC<GoogleButtonProps> = ({ onSignIn }) => {

  useEffect(() => {
    if (Platform.OS !== 'web') {
      // Mobile setup
      GoogleSignin.configure({
        webClientId: "647366167286-9nmlmk5gg3qroc55rd0jdokte5s7muur.apps.googleusercontent.com",
        iosClientId: "647366167286-t82v2msoh3s4cft9bl6rjl208vspp3rs.apps.googleusercontent.com" 
      });
    } else {
      
      const handleScriptLoad = () => {
        if (window.google) {
          window.google.accounts.id.initialize({
            client_id: "647366167286-9nmlmk5gg3qroc55rd0jdokte5s7muur.apps.googleusercontent.com",
            callback: onSignIn,
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
        document.body.removeChild(script);
      };
    }
  }, []);

  const handleMobileSignIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      onSignIn(userInfo);
    } catch (error) {
      console.log('Google Sign-In error:', error);
    }
  };

  if (Platform.OS === 'web') {
    return <View style={{ alignItems: 'center', width: '100%' }} id="googleButtonDiv" />;
  }

  return (
    <View style={styles.googleContainer}>
    <Pressable style={styles.googleButton} onPress={handleMobileSignIn}>
      <ThemedText style={styles.googleText}>Sign up with Google</ThemedText>
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

