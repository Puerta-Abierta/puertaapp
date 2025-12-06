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

  const[email, setEmail] = useState('');
  const[password, setPassword] = useState('');
  const router = useRouter();

  const [checked, setChecked] = useState(false);
  const textboxColor = 
    colorScheme === 'dark' ? '#ffffffff' : '#565555ff';
  const placeholderColor = 
    colorScheme === 'dark' ? '#2f2d2dff' : '#f8f7f7ff';


  const switchToSignup = () => {
    router.push('/signup');
  }

  return (
    <ThemedView style={styles.container}>
    <View style={styles.header}>
      <ThemedText type="title" style={styles.title}>
        FinC
      </ThemedText>
    </View>  
      

      <Image
        source={require('@/assets/images/Welcome-cuate 1.png')} // replace with your image
        style={styles.image}
        resizeMode="contain"
      />

      <View style={styles.form}>
        <ThemedText style={styles.label}>Login</ThemedText>
        <TextInput
          placeholder="Email"
          style={[styles.input, { backgroundColor: textboxColor, color: placeholderColor }]}
          placeholderTextColor={placeholderColor}
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          placeholder="Password"
          style={[styles.input, { backgroundColor: textboxColor, color: placeholderColor }]}
          secureTextEntry={true}
          placeholderTextColor={placeholderColor}
          value={password}
          onChangeText={setPassword}
        />

        <ThemedView style={[styles.resendText, { gap: 0.05}]}>
            <Pressable onPress={()=>setChecked(!checked)}>
                <ThemedText style={styles.checkBox}>
                {checked ? "✔️" : ""}
                </ThemedText>
            </Pressable>
            <ThemedView style={{ flexDirection: 'row', gap: 83 }}>
            <ThemedText>
                Remember Me
            </ThemedText>
            
            <Link href='/'>
                <Pressable>
                    <ThemedText style={{ color: '#37c2e9ff'}}>
                        Forgot password?
                    </ThemedText>
                </Pressable>
            </Link>
            </ThemedView>
            
        </ThemedView>

        <Pressable style={styles.submitButton}>
          <ThemedText type="defaultSemiBold" style={styles.submitText}>
            Login
          </ThemedText>
        </Pressable>
        </View>



        <ThemedView style={styles.resendText}>
            <ThemedText style={[{ color:'#5865F2', fontFamily: Fonts.rounded, fontWeight: 'bold' }]}>
                Don't have an account?          
            </ThemedText>
            
            <Pressable onPress={switchToSignup}>
                <ThemedText style={[ { color: '#37c2e9ff', fontFamily: Fonts.rounded, fontWeight: 'bold' } ]}>Sign Up</ThemedText> 
            </Pressable>
        </ThemedView>
    <View style={styles.bottomButtons}>
        <Pressable style={styles.circleButton}>
            <Image source={require('@/assets/images/Vector.png')} resizeMode='contain'/>
        </Pressable>
        <Pressable style={styles.circleButton}>
            <Image source={require('@/assets/images/Vector (1).png')} resizeMode='contain'/>
        </Pressable>
        <Pressable style={styles.circleButton}>
            <Image source={require('@/assets/images/Vector (2).png')} resizeMode='contain'/>
        </Pressable>
    </View>
        

    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 60,
    alignItems: 'center',
    
  },
  
  bottomButtons: {
    position: 'absolute',      // Fix it at the bottom
    bottom: 30,                // Distance from bottom of screen
    left: 0,
    right: 0,
    flexDirection: 'row',      // Arrange horizontally
    justifyContent: 'space-around', // Even spacing between buttons
    alignItems: 'center',
    paddingHorizontal: 100,
  },
  circleButton: {
    width: 35,
    height: 35,
    borderRadius: 30,         // Make it circular
    backgroundColor: '#5865F2', // Purple color
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',      // optional shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 4,             // for Android shadow
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  title: {
    position: 'absolute',
    top: 28,       // adjust vertical alignment
    left: 0,
    right: 0,
    textAlign: 'center',
    fontSize: 33,
    fontFamily: Fonts.rounded,
    includeFontPadding: false,
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
  resendText: {
    flexDirection: 'row',
    gap: 6
  },
  input: {
    width: '100%',
    height: 50,
    borderWidth: 0,
    borderColor: '#ECECEC',
    borderRadius: 3,
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
    paddingHorizontal: 90,
    borderRadius: 30,
    alignSelf: 'center',  
    marginTop: 20,
    backgroundColor: '#5865F2',
    marginBottom: 20
  },
  submitText: {
    color: '#fff',
    fontSize: 23,
    fontFamily: Fonts.rounded,
    fontWeight: 'bold'
  },
  label: {
    marginBottom: 20,
    fontFamily: Fonts.rounded,
    fontWeight: 'bold',
    fontSize: 22,
    marginLeft: 3
  },
  header: {
    width: '100%',
    paddingTop: 60,
    paddingBottom: 20,
    height: 'auto',
    position: 'relative'
  },
  checkBox: {
    width: 25,
    height: 25,
    borderWidth: 2,
    borderColor: "#555",
    backgroundColor: '#fff',
    borderRadius: 4,
    textAlign: "center",
    lineHeight: 18,
    marginRight: 8
  }
});
