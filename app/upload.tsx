import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Fonts } from '@/constants/theme';
import { useRouter, Link } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import React from 'react';
import { useState } from 'react';
import { useMutation } from 'convex/react'
import { api } from "@/convex/_generated/api";
import { Pressable, StyleSheet, View, Image, Alert, Linking } from 'react-native';
import * as ImagePicker from 'expo-image-picker'

export default function UploadAvatar() {
  const { user } = useAuth()
  const [imageUri, setImageUri] = useState<string | null>(null)
  const router = useRouter();
  const generateUploadUrl = useMutation(api.users.generateUploadUrl)
  const replaceUserAvatar = useMutation(api.users.replaceUserAvatar)
  
  
  const requestPhotoPermission = async () => {
    const { status, canAskAgain } = await ImagePicker.getMediaLibraryPermissionsAsync()
    if (status === 'granted') {
      return true
    }
    if (!canAskAgain) {
      Alert.alert(
      'Photo Access Required',
      'You previously denied photo access. Please enable it in Settings to upload an avatar.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Open Settings',
          onPress: () => Linking.openSettings(),
        },
      ]
    );
    return false;
    }

    const result = await ImagePicker.requestMediaLibraryPermissionsAsync()
    if (result.status !== 'granted') {
      Alert.alert(
        'Permission Denied',
        'Photo access is required to upload an avatar'
      );
      return false
    }
    return true
  }

  const pickImage = async () => {
    const permission = await requestPhotoPermission()
    if (!user || !permission) {
      alert('Permission to access photos is required!')
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1,1],
      quality: 0.8
    })
    if (result.canceled) return
    
    const asset = result.assets[0]
    setImageUri(asset.uri)
    
    const response = await fetch(asset.uri)
    const blob = await response.blob()

    const uploadUrl = await generateUploadUrl()

    const uploadRes = await fetch(uploadUrl, {
      method: "POST",
      headers: {
        "Content-Type": blob.type,
      },
      body: blob
    })

    if (!uploadRes.ok) {
      alert("Upload failed")
    }

    const { storageId } = await uploadRes.json()

    await replaceUserAvatar( {
      userId: user._id,
      newStorageId: storageId
    })
  }

  const handleSubmit = () => {
    if (!user?.hasCompletedOnboarding) {
      router.push('/onboarding')
    }
    else {
      router.push('/home')
    }
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
  
          
          <Pressable style={[styles.styleCard, styles.styleCardSelected]}>
            <ThemedText style={styles.styleIcon}>🖼️</ThemedText>
            <ThemedText style={styles.styleLabel}>
              Upload a{'\n'}Image
            </ThemedText>
          </Pressable>
          
          <Link href='/third-party' asChild>
          <Pressable
            style={styles.styleCard}
          >
            <ThemedText style={styles.styleIcon}>✨</ThemedText>
            <ThemedText style={styles.styleLabel}>
              Third party{'\n'}custom character
            </ThemedText>
          </Pressable>
          </Link>
        </View>

        <ThemedText style={styles.subtitle}>
          Upload an image below
        </ThemedText>
         <ThemedText style={styles.subtitle}>
          Please respect our community guidelines when selecting a profile image
        </ThemedText>
        <View style={styles.uploadBox}>
            {imageUri ? (
            <Image
                source={{ uri: imageUri }}
                style={styles.previewImage}
            />
            ) : (
              <>
      <ThemedText style={styles.uploadText}>
        Upload an image below
      </ThemedText>

        <Pressable style={styles.libraryButton} onPress={pickImage}>
          <ThemedText style={styles.libraryButtonText}>
            Choose from library
          </ThemedText>
        </Pressable>
            </>
          )}
        </View>
  
        <Pressable style={styles.submitButton} disabled={!imageUri} onPress={handleSubmit}>
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
  previewImage: {
    width: '100%',
    height: '100%',
    borderRadius: 16,
    },
  libraryButton: {
    marginTop: 16,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: '#3a3a3a',
  },
  libraryButtonText: {
    fontSize: 14,
  },
  uploadBox: {
    flex: 1,
    marginTop: 24,
    borderRadius: 20,
    backgroundColor: '#2a2a2a',
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20
  },
  uploadText: {
    fontSize: 18,
    fontFamily: Fonts.rounded,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 6,
    textAlign: 'center',
  },


});