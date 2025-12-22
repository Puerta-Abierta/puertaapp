import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Fonts } from '@/constants/theme';
import { useAuth } from '@/contexts/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Pressable, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

// Achievement data
const ACHIEVEMENTS = [
  {
    id: 'speedster',
    title: 'Speedster',
    description: 'For speeding through 5+ lessons!',
    icon: '🏃',
    color: '#FFD700',
  },
  {
    id: 'banker',
    title: 'Banker',
    description: 'For collecting over 100 coins!',
    icon: '💰',
    color: '#32CD32',
  },
  {
    id: 'top_saver',
    title: 'Top Saver',
    description: 'For successfully learning how to save!',
    icon: '🐷',
    color: '#87CEEB',
  },
  {
    id: 'investor',
    title: 'Investor',
    description: 'For investing energy into financial literacy!',
    icon: '🌱',
    color: '#FF6347',
  },
];

export default function HomePage() {
  const { user, signOut } = useAuth();
  const router = useRouter();

  // Get user stats with defaults
  const totalCoins = user?.totalCoins ?? 100;
  const dayStreak = user?.dayStreak ?? 5;
  const timesOnLeaderboard = user?.timesOnLeaderboard ?? 2;
  const level = user?.level ?? 'Radiant Level FinCer';
  const achievements = user?.achievements ?? ['speedster', 'banker', 'top_saver', 'investor'];
  const selectedAvatar = user?.selectedAvatar;
  const joinedYear = user?.createdAt ? new Date(user.createdAt).getFullYear() : 2024;

  // Get avatar emoji based on selection
  const getAvatarEmoji = () => {
    const avatarMap: { [key: string]: string } = {
      penguin: '🐧',
      cat: '🐱',
      dog: '🐶',
      rabbit: '🐰',
      fox: '🦊',
      bear: '🐻',
      panda: '🐼',
      tiger: '🐯',
      lion: '🦁',
      unicorn: '🦄',
      dragon: '🐉',
      owl: '🦉',
    };
    return selectedAvatar ? avatarMap[selectedAvatar] || '👤' : '👤';
  };

  const handleChooseAvatar = () => {
    router.push('/avatar-selection');
  };

  return (
    <ThemedView style={styles.container}>
      {/* Header with Settings and Sign Out */}
      <View style={styles.topHeader}>
        <TouchableOpacity style={styles.signOutButton} onPress={signOut}>
          <Ionicons name="log-out-outline" size={20} color="#fff" />
          <ThemedText style={styles.signOutText}>Sign Out</ThemedText>
        </TouchableOpacity>
        <TouchableOpacity style={styles.settingsButton}>
          <ThemedText style={styles.settingsText}>Settings</ThemedText>
          <Ionicons name="settings-outline" size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* User Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.profileLeft}>
            <ThemedText style={styles.greeting}>Hi {user?.name?.split(' ')[0] || 'User'}!</ThemedText>
            <ThemedText style={styles.joinDate}>Joined in {joinedYear}</ThemedText>
            <View style={styles.levelContainer}>
              <ThemedText style={styles.levelText}>{level}</ThemedText>
              <ThemedText style={[styles.diamondIcon, { fontSize: 16 }]}>💎</ThemedText>
            </View>
          </View>
          <View style={styles.avatarContainer}>
            <View style={styles.avatarCircle}>
              <ThemedText style={styles.avatarEmoji}>{getAvatarEmoji()}</ThemedText>
            </View>
          </View>
        </View>

        {/* Choose Avatar Button */}
        <Pressable style={styles.chooseAvatarButton} onPress={handleChooseAvatar}>
          <ThemedText style={styles.chooseAvatarText}>Choose New Avatar</ThemedText>
        </Pressable>

        {/* Activity Overview */}
        <ThemedText style={styles.sectionTitle}>Activity Overview</ThemedText>
        <View style={styles.activityGrid}>
          <View style={styles.activityCard}>
            <Ionicons name="logo-usd" size={32} color="#FFD700" />
            <ThemedText style={styles.activityValue}>{totalCoins}</ThemedText>
            <ThemedText style={styles.activityLabel}>Total Coins</ThemedText>
          </View>
          <View style={styles.activityCard}>
            <Ionicons name="flame-outline" size={32} color="#FF6347" />
            <ThemedText style={styles.activityValue}>{dayStreak}</ThemedText>
            <ThemedText style={styles.activityLabel}>Day Streak</ThemedText>
          </View>
          <View style={styles.activityCard}>
            <Ionicons name="trophy-outline" size={32} color="#FFD700" />
            <ThemedText style={styles.activityValue}>{timesOnLeaderboard}</ThemedText>
            <ThemedText style={styles.activityLabel}>Times on Top of Leaderboard</ThemedText>
          </View>
        </View>

        {/* Achievements */}
        <ThemedText style={styles.sectionTitle}>Achievements</ThemedText>
        <View style={styles.achievementsGrid}>
          {ACHIEVEMENTS.filter(ach => achievements.includes(ach.id)).map((achievement) => (
            <View key={achievement.id} style={styles.achievementCard}>
              <View style={[styles.achievementBadge, { backgroundColor: achievement.color + '40' }]}>
                <ThemedText style={styles.achievementIcon}>{achievement.icon}</ThemedText>
              </View>
              <ThemedText style={styles.achievementTitle}>{achievement.title}</ThemedText>
              <ThemedText style={styles.achievementDescription}>{achievement.description}</ThemedText>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="bookmark-outline" size={24} color="#666" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="grid-outline" size={24} color="#666" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="bulb-outline" size={24} color="#666" />
        </TouchableOpacity>
        <TouchableOpacity style={[styles.navItem, styles.navItemActive]}>
          <Ionicons name="person" size={24} color="#5865F2" />
        </TouchableOpacity>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  topHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 10,
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#2a2a2a',
  },
  signOutText: {
    color: '#fff',
    fontSize: 14,
    fontFamily: Fonts.rounded,
    fontWeight: '500',
  },
  settingsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  settingsText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: Fonts.rounded,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  profileCard: {
    backgroundColor: '#1a1a1a',
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  profileLeft: {
    flex: 1,
  },
  greeting: {
    fontSize: 28,
    fontFamily: Fonts.rounded,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  joinDate: {
    fontSize: 14,
    fontFamily: Fonts.rounded,
    color: '#999',
    marginBottom: 8,
  },
  levelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  levelText: {
    fontSize: 16,
    fontFamily: Fonts.rounded,
    color: '#37c2e9ff',
    fontWeight: '600',
  },
  diamondIcon: {
    marginLeft: 6,
    color: '#37c2e9ff',
  },
  avatarContainer: {
    marginLeft: 16,
  },
  avatarCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#2a2a2a',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#37c2e9ff',
  },
  avatarEmoji: {
    fontSize: 40,
  },
  chooseAvatarButton: {
    backgroundColor: '#5865F2',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 20,
    alignItems: 'center',
    marginBottom: 32,
  },
  chooseAvatarText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: Fonts.rounded,
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: Fonts.rounded,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
  },
  activityGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  activityCard: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    width: '30%',
    minHeight: 120,
    justifyContent: 'center',
  },
  activityValue: {
    fontSize: 20,
    fontFamily: Fonts.rounded,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 8,
    marginBottom: 4,
  },
  activityLabel: {
    fontSize: 11,
    fontFamily: Fonts.rounded,
    color: '#999',
    textAlign: 'center',
  },
  achievementsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  achievementCard: {
    width: '48%',
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    alignItems: 'center',
  },
  achievementBadge: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  achievementIcon: {
    fontSize: 32,
  },
  achievementTitle: {
    fontSize: 16,
    fontFamily: Fonts.rounded,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  achievementDescription: {
    fontSize: 12,
    fontFamily: Fonts.rounded,
    color: '#999',
    textAlign: 'center',
  },
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    backgroundColor: '#1a1a1a',
    paddingVertical: 12,
    paddingHorizontal: 20,
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: '#2a2a2a',
  },
  navItem: {
    padding: 8,
  },
  navItemActive: {
    backgroundColor: '#5865F220',
    borderRadius: 8,
  },
});
