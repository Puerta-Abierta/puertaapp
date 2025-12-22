import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Fonts } from '@/constants/theme';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/convex/_generated/api';
import { useMutation } from 'convex/react';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';

// Avatar options - you can replace these with actual avatar images
const AVATAR_OPTIONS = [
  { id: 'penguin', name: 'Penguin', emoji: '🐧' },
  { id: 'cat', name: 'Cat', emoji: '🐱' },
  { id: 'dog', name: 'Dog', emoji: '🐶' },
  { id: 'rabbit', name: 'Rabbit', emoji: '🐰' },
  { id: 'fox', name: 'Fox', emoji: '🦊' },
  { id: 'bear', name: 'Bear', emoji: '🐻' },
  { id: 'panda', name: 'Panda', emoji: '🐼' },
  { id: 'tiger', name: 'Tiger', emoji: '🐯' },
  { id: 'lion', name: 'Lion', emoji: '🦁' },
  { id: 'unicorn', name: 'Unicorn', emoji: '🦄' },
  { id: 'dragon', name: 'Dragon', emoji: '🐉' },
  { id: 'owl', name: 'Owl', emoji: '🦉' },
];

export default function AvatarSelection() {
  const { user } = useAuth();
  const router = useRouter();
  const [selectedAvatar, setSelectedAvatar] = useState<string | null>(null);
  const updateAvatar = useMutation(api.users.updateUserAvatar);

  const handleSelectAvatar = async (avatarId: string) => {
    if (!user) return;
    
    setSelectedAvatar(avatarId);
    try {
      await updateAvatar({
        userId: user._id,
        avatar: avatarId,
      });
      // Navigate to onboarding after avatar selection (for first-time users)
      router.replace('/onboarding');
    } catch (error) {
      console.error('Error updating avatar:', error);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <ThemedText type="title" style={styles.title}>
          Choose Your Avatar
        </ThemedText>
        <ThemedText style={styles.subtitle}>
          Select an avatar to represent you in FinC!
        </ThemedText>
      </View>

      <ScrollView 
        contentContainerStyle={styles.avatarGrid}
        showsVerticalScrollIndicator={false}
      >
        {AVATAR_OPTIONS.map((avatar) => (
          <Pressable
            key={avatar.id}
            style={[
              styles.avatarCard,
              selectedAvatar === avatar.id && styles.avatarCardSelected,
            ]}
            onPress={() => handleSelectAvatar(avatar.id)}
          >
            <View style={styles.avatarEmojiContainer}>
              <ThemedText style={styles.avatarEmoji}>{avatar.emoji}</ThemedText>
            </View>
            <ThemedText style={styles.avatarName}>{avatar.name}</ThemedText>
          </Pressable>
        ))}
      </ScrollView>
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
});
