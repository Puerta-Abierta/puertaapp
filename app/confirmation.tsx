import React from 'react';
import { View, StyleSheet, TextInput, Pressable, Image } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { ExternalLink } from '@/components/external-link';
import { Fonts } from '@/constants/theme';
import { Link } from 'expo-router';
import { useColorScheme } from 'react-native';
import { useState, useRef } from 'react';
import { useRouter } from 'expo-router';

export default function Confirmation() {
    const [code, setCode] = useState(['', '', '', '', '']);
    const inputs = useRef<Array<TextInput | null>>([]);
    const router = useRouter();

    const textColor = 
      useColorScheme() === 'dark' ? '#f0ececff' : '#080707ff';

    const handleChange = (text: string, index: number) => {
        if (text.length > 1) text = text.slice(-1); 
        const newCode = [...code];
        newCode[index] = text;
        setCode(newCode);

        if (text && index < 4) {
            inputs.current[index + 1]?.focus();
        }
    };
    const handleBackspace = (e: { nativeEvent: { key: string } }, index: number) => {
        if (e.nativeEvent.key === 'Backspace' && !code[index] && index > 0) {
            inputs.current[index - 1]?.focus();
        }
    };

    // add a handle submit that checks the code and does router.push to next page

    return (
        <ThemedView style={styles.container}>
        <View style={styles.header}>
          <Link href='/signup' asChild>
            <Pressable style={styles.backCircle}>
              <ThemedText style={styles.backArrow}>←</ThemedText>
            </Pressable>
          </Link>
          <ThemedText type="title" style={styles.title}>
            Confirmation
          </ThemedText>
        </View>  
          
    
          <Image
            source={require('@/assets/images/Mobile inbox-cuate (1) 1.png')} // replace with your image
            style={styles.image}
            resizeMode="contain" 
          />

        <ThemedText style={styles.label}>
            Please enter the unique 5-digit code sent to the email associated with your account.
        </ThemedText>

        <ThemedView style={styles.otpContainer}>
            {code.map((digit, index) => (
                <TextInput
                    key={index}
                    ref = {(ref: TextInput | null) => {inputs.current[index] = ref}}
                    style = {[ styles.otpInput, { color: textColor, borderWidth: 1, borderColor: '#ccc', borderRadius: 8, marginHorizontal: 5 }]}
                    value={digit}
                    onChangeText={(text) => handleChange(text, index)}
                    keyboardType="number-pad"
                    maxLength={1}
                    textAlign="center"
                    onKeyPress={(e) => handleBackspace(e, index)}
                />
            ))}
        </ThemedView>
        
        <ThemedView style={styles.resendText}>
        <ThemedText style={[{ color:'#5865F2', fontFamily: Fonts.rounded, fontWeight: 'bold' }]}>
          Didn't receieve a code?          
        </ThemedText>
        
        <Pressable>
            <ThemedText style={[ { color: '#37c2e9ff', fontFamily: Fonts.rounded, fontWeight: 'bold' } ]}>Resend</ThemedText> 
        </Pressable>
        </ThemedView>

        <Pressable style={styles.submitButton}>
            <ThemedText type="defaultSemiBold" style={styles.submitText}>
                Confirm
            </ThemedText>
        </Pressable>
        </ThemedView>
    );
}

const styles = StyleSheet.create( {
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
    width: 250,
    height: 250,
    marginBottom: 30,
    
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
    marginTop: 40,
    backgroundColor: '#5865F2',
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '70%',
    marginBottom: 30,
    marginRight: 50
  },
  resendText: {
    flexDirection: 'row',
    gap: 6
  },
  otpInput: {
    borderBottomWidth: 2,
    borderColor: '#333',
    fontSize: 28,
    width: 50,
    paddingVertical: 5,
    fontWeight: 'bold'
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
  header: {
    width: '100%',
    height: 80,
    position: 'relative'
  },
})