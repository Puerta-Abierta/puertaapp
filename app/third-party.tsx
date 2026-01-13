import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Fonts } from '@/constants/theme';
import { useRouter, Link } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

export default function UploadAvatar() {
  const router = useRouter();
  console.log('upload rendered')
  
  const handleSubmit = () => {
    router.replace('/home')
  
  }

  return (
      <ThemedView style={styles.container}>
        
        <View style={styles.header}>
              <Link href='/home' asChild>
                <Pressable style={styles.backCircle}>
                  <ThemedText style={styles.backArrow}>←</ThemedText>
                </Pressable>
              </Link>
              <ThemedText type="title" style={styles.title}>
                Choose Your Avatar
              </ThemedText>
              <ThemedText style={styles.subtitle}>
                Select an avatar to represent you in FinC!
              </ThemedText>
        </View>  
        
    
      {/* Top selector buttons */}
        <View style={styles.styleRow}>
          <Link href='/avatar-selection' asChild>
          <Pressable style={styles.styleCard}>
            <ThemedText style={styles.styleIcon}>🦊</ThemedText>
            <ThemedText style={styles.styleLabel}>FinC Originals</ThemedText>
          </Pressable>
          </Link>
  
          <Link href='/upload' asChild>
          <Pressable style={styles.styleCard}>
            <ThemedText style={styles.styleIcon}>🖼️</ThemedText>
            <ThemedText style={styles.styleLabel}>
              Upload a{'\n'}Image
            </ThemedText>
          </Pressable>
          </Link>
          
          
          <Pressable
            style={[styles.styleCard, styles.styleCardSelected]}
          >
            <ThemedText style={styles.styleIcon}>✨</ThemedText>
            <ThemedText style={styles.styleLabel}>
              Third party{'\n'}custom character
            </ThemedText>
          </Pressable>
          
        </View>
  
        <Pressable style={styles.submitButton} onPress={handleSubmit}>
            <ThemedText type="defaultSemiBold" style={styles.submitText}>
                  Save Avatar
            </ThemedText>
          </Pressable>
      </ThemedView>
  
      
    );
  }
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: 20,
      paddingTop: 60,
    },
    header: {
      marginBottom: 30,
      alignItems: 'center',
    },
    title: {
      fontSize: 28,
      fontFamily: Fonts.rounded,
      fontWeight: 'bold',
      marginBottom: 10,
      marginTop: 3
    },
    subtitle: {
      fontSize: 16,
      fontFamily: Fonts.rounded,
      opacity: 0.7,
      textAlign: 'center',
    },
    avatarGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      paddingBottom: 40,
    },
    avatarCard: {
      width: '30%',
      aspectRatio: 1,
      backgroundColor: '#2a2a2a',
      borderRadius: 16,
      marginBottom: 20,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 2,
      borderColor: 'transparent',
    },
    avatarCardSelected: {
      borderColor: '#5865F2',
      backgroundColor: '#3a3a3a',
    },
    avatarEmojiContainer: {
      marginBottom: 8,
    },
    avatarEmoji: {
      fontSize: 48,
    },
    avatarName: {
      fontSize: 14,
      fontFamily: Fonts.rounded,
      fontWeight: '500',
    },
    backCircle: {
      width: 30,
      height: 30,
      backgroundColor: '#5865F2',
      borderRadius: 20,
      justifyContent: 'center',
      alignItems: 'center',
      position: 'absolute',
      left: 4,
      top: 4,
      zIndex: 10,
    },
    backArrow: {
      fontSize: 20,
      fontFamily: Fonts.rounded,
      color: '#323030ff'
    },
    styleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  
  styleCard: {
    width: '30%',
    aspectRatio: 1,
    backgroundColor: '#2a2a2a',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  styleCardSelected: {
    backgroundColor: '#5865F2',
  },
  
  styleIcon: {
    fontSize: 28,
    marginBottom: 10,
  },
  
  styleLabel: {
    textAlign: 'center',
    fontSize: 13,
    fontFamily: Fonts.rounded,
    fontWeight: '600',
  },
  
  submitButton: {
      paddingVertical: 15,
      paddingHorizontal: 32,
      borderRadius: 30,
      alignSelf: 'center',  
      backgroundColor: '#5865F2',
      marginBottom: 60
    },
    submitText: {
      color: '#fff',
      fontSize: 18,
      fontFamily: Fonts.rounded,
    },
  
  });