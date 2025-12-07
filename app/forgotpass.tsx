import React from 'react';
import { View, StyleSheet, TextInput, Pressable, Image, Text } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Fonts } from '@/constants/theme';
import { Link } from 'expo-router';
import { useColorScheme } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';


export default function ForgotPasswordPage() {
  const colorScheme = useColorScheme();

  const[name, setName] = useState('');
  const[email, setEmail] = useState('');
  const router = useRouter();

  const imageSource = 
    colorScheme === 'dark' ? require('@/assets/images/finc.png') : require('@/assets/images/dark-logo.png');
  const textboxColor = 
    colorScheme === 'dark' ? '#ffffffff' : '#565555ff';
  const placeholderColor = 
    colorScheme === 'dark' ? '#2f2d2dff' : '#f8f7f7ff';

  return (
    <ThemedView style={styles.container}>
    <View style={styles.header}>
      <Link href='/login' asChild>
        <Pressable style={styles.backCircle}>
          <ThemedText style={styles.backArrow}>←</ThemedText>
        </Pressable>
      </Link>
      <ThemedText type="title" style={styles.title}>
        Forgot Password?
      </ThemedText>
    </View>  
      

      <Image
        source={require('@/assets/images/FP graphic.png')} // replace with your image
        style={styles.image}
        resizeMode="contain"
      />
      <ThemedText style={styles.label}>
        Please enter the email associated with your account to receive your password reset link:
      </ThemedText>

      <View style={styles.form}>
        
        <TextInput
          placeholder="Ex: opendoors@gmail.com"
          style={[styles.input, { backgroundColor: textboxColor, color: placeholderColor }]}
          keyboardType="email-address"
          placeholderTextColor={placeholderColor}
          value={email}
          onChangeText={setEmail}
        />

        <Pressable style={styles.submitButton} onPress={()=>{router.push('/resetpass')}}>
          <ThemedText type="defaultSemiBold" style={styles.submitText}>
            Next
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
    width: 300,
    height: 300,
    marginBottom: 30,
    marginTop: 20
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
    fontSize: 22,
    marginLeft: 20,
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
