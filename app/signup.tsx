import React from 'react';
import { View, StyleSheet, TextInput, Pressable, Image } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Fonts } from '@/constants/theme';
import { Link } from 'expo-router';
import { useColorScheme } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';


export default function SignUpPage() {
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

  const handleSubmit = () => {
    if (name.trim() && email.trim()) {
      router.push('/confirmation');
    }
  }

  return (
    <ThemedView style={styles.container}>
    <View style={styles.header}>
      <Link href='/welcome' asChild>
        <Pressable style={styles.backCircle}>
          <ThemedText style={styles.backArrow}>←</ThemedText>
        </Pressable>
      </Link>
      <ThemedText type="title" style={styles.title}>
        Sign Up
      </ThemedText>
    </View>  
      

      <Image
        source={imageSource} // replace with your image
        style={styles.image}
        resizeMode="contain"
      />

      <View style={styles.form}>
        <ThemedText style={styles.label}>Full Name</ThemedText>
        <TextInput
          placeholder="Ex: Jane Doe"
          style={[styles.input, { backgroundColor: textboxColor, color: placeholderColor }]}
          placeholderTextColor={placeholderColor}
          value={name}
          onChangeText={setName}
        />
        <ThemedText style={styles.label}>Email</ThemedText>
        <TextInput
          placeholder="Ex: opendoors@gmail.com"
          style={[styles.input, { backgroundColor: textboxColor, color: placeholderColor }]}
          keyboardType="email-address"
          placeholderTextColor={placeholderColor}
          value={email}
          onChangeText={setEmail}
        />

        <Pressable style={styles.submitButton} onPress={handleSubmit}>
          <ThemedText type="defaultSemiBold" style={styles.submitText}>
            Sign Up
          </ThemedText>
        </Pressable>
      </View>

      <ThemedView style={styles.resendText}>
          <ThemedText style={[{ color:'#5865F2', fontFamily: Fonts.rounded, fontWeight: 'bold' }]}>
            Already have an account?         
          </ThemedText>
              
          <Pressable onPress={()=>{router.push('/login')}}>
              <ThemedText style={[ { color: '#37c2e9ff', fontFamily: Fonts.rounded, fontWeight: 'bold' } ]}>Login</ThemedText> 
          </Pressable>
        </ThemedView>
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
    width: 40,
    height: 40,
    backgroundColor: '#5865F2',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    left: 16,
    top: 20,
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
    fontSize: 30,
    fontFamily: Fonts.rounded,
    zIndex: 5,
  },
  image: {
    width: 200,
    height: 200,
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
    marginBottom: 10,
    fontFamily: Fonts.rounded,
    fontSize: 22,
    marginLeft: 20
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
