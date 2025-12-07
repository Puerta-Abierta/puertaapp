import React from 'react';
import { View, StyleSheet, TextInput, Pressable, Image, Text } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Fonts } from '@/constants/theme';
import { Link } from 'expo-router';

export default function ResetPasswordPage() {

  return (
    <ThemedView style={styles.container}>
    <View style={styles.header}>
      <Link href='/forgotpass' asChild>
        <Pressable style={styles.backCircle}>
          <ThemedText style={styles.backArrow}>←</ThemedText>
        </Pressable>
      </Link>
      <ThemedText type="title" style={styles.title}>
        Forgot Password?
      </ThemedText>
    </View>  
      

      <Image
        source={require('@/assets/images/temp check.png')} // replace with your image
        style={styles.image}
        resizeMode="contain"
      />
      <ThemedText style={styles.label}>
        Your reset password link has been sent to your phone number! If you still have not received it after a few minutes, resend the link.     
    </ThemedText>

      <View style={styles.form}>
        

        <Pressable style={styles.submitButton} >
          <ThemedText type="defaultSemiBold" style={styles.submitText}>
            Resend Link
          </ThemedText>
        </Pressable>
      </View>

    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 40,
    alignItems: 'center',
    
  },
  topBar: {
    width: '100%',
    marginBottom: 20,
  },
  backCircle: {
    width: 30,
    height: 30,
    backgroundColor: '#5865F2',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    left: 16,
    top: 30,
    zIndex: 10,
  },
  backArrow: {
    fontSize: 20,
    fontFamily: Fonts.rounded,
    color: '#323030ff'
  },
  title: {
    position: 'absolute',
    top: 28,       // adjust vertical alignment
    left: 0,
    right: 0,
    textAlign: 'center',
    fontSize: 25,
    fontFamily: Fonts.rounded,
    zIndex: 5,
  },
  image: {
    width: 250,
    height: 250,
    marginBottom: 30,
    marginTop: 50
  },
  form: {
    width: '100%',
  },
  input: {
    width: '90%',
    height: 50,
    borderWidth: 0,
    borderColor: '#ECECEC',
    borderRadius: 12,
    paddingHorizontal: 15,
    marginBottom: 24,
    fontFamily: Fonts.rounded,
    fontSize: 16,
    alignSelf: 'center'
  },
  buttonWrapper: {
    marginTop: 10,
  },
  submitButton: {
    paddingVertical: 15,
    paddingHorizontal: 32,
    borderRadius: 30,
    alignSelf: 'center',  
    marginTop: 20,
    backgroundColor: '#5865F2',
    marginBottom: 30
  },
  submitText: {
    color: '#fff',
    fontSize: 18,
    fontFamily: Fonts.rounded,
  },
  label: {
    marginBottom: 40,
    fontFamily: Fonts.rounded,
    fontSize: 18,
    textAlign: "center"
  },
  resendText: {
    flexDirection: 'row',
    gap: 6
  },
  header: {
    width: '100%',
    height: 80,
    position: 'relative'
  },
});
