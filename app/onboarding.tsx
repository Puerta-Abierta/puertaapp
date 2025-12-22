import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Fonts } from '@/constants/theme';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/convex/_generated/api';
import { Ionicons } from '@expo/vector-icons';
import { useMutation } from 'convex/react';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

// Step 1: How did you hear about us?
const HEAR_ABOUT_OPTIONS = [
  { id: 'friends_family', label: 'Friends/family', icon: '👥' },
  { id: 'facebook_instagram', label: 'Facebook/Instagram', icon: '📱' },
  { id: 'uci_center', label: 'UCI Antrepreneur Center', icon: '🏛️' },
  { id: 'app_store', label: 'App Store Recommended', icon: '📲' },
  { id: 'google_search', label: 'Google Search', icon: '🔍' },
  { id: 'tiktok', label: 'TikTok', icon: '🎵' },
  { id: 'other', label: 'Other', icon: '⋯' },
];

// Step 2: What topics are you interested in?
const TOPIC_OPTIONS = [
  { id: 'learning_to_save', label: 'Learning To Save', icon: '💳', color: '#FF8C42' },
  { id: 'track_spending', label: 'Track My Spending', icon: '🔍', color: '#9B59B6' },
  { id: 'improve_credit', label: 'Improve My Credit Score', icon: '📊', color: '#2ECC71' },
  { id: 'create_budget', label: 'Create A Budget Plan', icon: '💰', color: '#E74C3C' },
  { id: 'retirement', label: 'Preparing For Retirement', icon: '👴', color: '#3498DB' },
  { id: 'emergency_fund', label: 'Building An Emergency Fund', icon: '💼', color: '#F1C40F' },
];

// Step 3: Understanding level
const UNDERSTANDING_LEVELS = [
  { id: 'new', label: "I'm new to finance", color: '#FF8C42' },
  { id: 'basic', label: 'I have some basic knowledge', color: '#9B59B6' },
  { id: 'intermediate', label: 'I can talk about finance topics to others', color: '#2ECC71' },
  { id: 'advanced', label: 'I can discuss most topics in detail', color: '#E74C3C' },
];

// Step 4: Time commitment
const TIME_COMMITMENTS = [
  { id: 'less_15', label: 'Less than 15 minutes per day' },
  { id: '15_30', label: 'Between 15-30 minutes per day' },
  { id: '30_60', label: 'Between 30-60 minutes per day' },
];

// Step 5: Starting point
const STARTING_POINTS = [
  { 
    id: 'from_scratch', 
    label: 'Start from scratch', 
    description: 'Take the beginning lessons in the modules',
    icon: '1️⃣'
  },
  { 
    id: 'find_place', 
    label: 'Find my starting place', 
    description: 'Answer some questions to skip the basics',
    icon: '🔧'
  },
];

export default function OnboardingScreen() {
  const { user } = useAuth();
  const router = useRouter();
  const updateOnboarding = useMutation(api.users.updateOnboardingData);
  
  const [currentStep, setCurrentStep] = useState(1);
  const [onboardingData, setOnboardingData] = useState({
    howDidYouHear: '',
    interestedTopics: [] as string[],
    understandingLevel: '',
    timeCommitment: '',
    startingPoint: '',
  });

  const handleNext = () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = async () => {
    if (!user) return;
    
    try {
      await updateOnboarding({
        userId: user._id,
        onboardingData: {
          howDidYouHear: onboardingData.howDidYouHear,
          interestedTopics: onboardingData.interestedTopics,
          understandingLevel: onboardingData.understandingLevel,
          timeCommitment: onboardingData.timeCommitment,
          startingPoint: onboardingData.startingPoint,
        },
      });
      router.replace('/home');
    } catch (error) {
      console.error('Error saving onboarding data:', error);
    }
  };

  const handleHearAboutSelect = (id: string) => {
    setOnboardingData({ ...onboardingData, howDidYouHear: id });
  };

  const handleTopicToggle = (id: string) => {
    const topics = onboardingData.interestedTopics;
    if (topics.includes(id)) {
      setOnboardingData({ 
        ...onboardingData, 
        interestedTopics: topics.filter(t => t !== id) 
      });
    } else {
      setOnboardingData({ 
        ...onboardingData, 
        interestedTopics: [...topics, id] 
      });
    }
  };

  const handleUnderstandingSelect = (id: string) => {
    setOnboardingData({ ...onboardingData, understandingLevel: id });
  };

  const handleTimeCommitmentSelect = (id: string) => {
    setOnboardingData({ ...onboardingData, timeCommitment: id });
  };

  const handleStartingPointSelect = (id: string) => {
    setOnboardingData({ ...onboardingData, startingPoint: id });
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return !!onboardingData.howDidYouHear;
      case 2:
        return onboardingData.interestedTopics.length > 0;
      case 3:
        return !!onboardingData.understandingLevel;
      case 4:
        return !!onboardingData.timeCommitment;
      case 5:
        return !!onboardingData.startingPoint;
      default:
        return false;
    }
  };

  const renderStep1 = () => (
    <View style={styles.stepContainer}>
      <ThemedText style={styles.question}>How did you hear about us?</ThemedText>
      <View style={styles.optionsContainer}>
        {HEAR_ABOUT_OPTIONS.map((option) => (
          <Pressable
            key={option.id}
            style={[
              styles.pillButton,
              onboardingData.howDidYouHear === option.id && styles.pillButtonSelected,
            ]}
            onPress={() => handleHearAboutSelect(option.id)}
          >
            <ThemedText style={styles.pillIcon}>{option.icon}</ThemedText>
            <ThemedText style={styles.pillText}>{option.label}</ThemedText>
          </Pressable>
        ))}
      </View>
    </View>
  );

  const renderStep2 = () => (
    <View style={styles.stepContainer}>
      <ThemedText style={styles.question}>What topics are you interested in?</ThemedText>
      <View style={styles.topicGrid}>
        {TOPIC_OPTIONS.map((topic) => (
          <Pressable
            key={topic.id}
            style={[
              styles.topicCard,
              { backgroundColor: topic.color + '40' },
              onboardingData.interestedTopics.includes(topic.id) && styles.topicCardSelected,
            ]}
            onPress={() => handleTopicToggle(topic.id)}
          >
            <ThemedText style={styles.topicIcon}>{topic.icon}</ThemedText>
            <ThemedText style={styles.topicLabel}>{topic.label}</ThemedText>
            {onboardingData.interestedTopics.includes(topic.id) && (
              <View style={styles.checkmark}>
                <Ionicons name="checkmark-circle" size={24} color="#2ECC71" />
              </View>
            )}
          </Pressable>
        ))}
      </View>
    </View>
  );

  const renderStep3 = () => (
    <View style={styles.stepContainer}>
      <ThemedText style={styles.question}>What is your understanding level?</ThemedText>
      <View style={styles.understandingGrid}>
        {UNDERSTANDING_LEVELS.map((level) => (
          <Pressable
            key={level.id}
            style={[
              styles.understandingCard,
              { backgroundColor: level.color + '40' },
              onboardingData.understandingLevel === level.id && styles.understandingCardSelected,
            ]}
            onPress={() => handleUnderstandingSelect(level.id)}
          >
            <ThemedText style={styles.understandingText}>{level.label}</ThemedText>
          </Pressable>
        ))}
      </View>
    </View>
  );

  const renderStep4 = () => (
    <View style={styles.stepContainer}>
      <ThemedText style={styles.question}>How much time do you want to commit to your learning journey?</ThemedText>
      <View style={styles.optionsContainer}>
        {TIME_COMMITMENTS.map((option) => (
          <Pressable
            key={option.id}
            style={[
              styles.pillButton,
              onboardingData.timeCommitment === option.id && styles.pillButtonSelected,
            ]}
            onPress={() => handleTimeCommitmentSelect(option.id)}
          >
            <ThemedText style={styles.pillText}>{option.label}</ThemedText>
          </Pressable>
        ))}
      </View>
    </View>
  );

  const renderStep5 = () => (
    <View style={styles.stepContainer}>
      <ThemedText style={styles.question}>Pick your starting point!</ThemedText>
      <View style={styles.optionsContainer}>
        {STARTING_POINTS.map((option) => (
          <Pressable
            key={option.id}
            style={[
              styles.startingPointCard,
              onboardingData.startingPoint === option.id && styles.startingPointCardSelected,
            ]}
            onPress={() => handleStartingPointSelect(option.id)}
          >
            <ThemedText style={styles.startingPointIcon}>{option.icon}</ThemedText>
            <View style={styles.startingPointContent}>
              <ThemedText style={styles.startingPointTitle}>{option.label}</ThemedText>
              <ThemedText style={styles.startingPointDescription}>{option.description}</ThemedText>
            </View>
          </Pressable>
        ))}
      </View>
    </View>
  );

  return (
    <ThemedView style={styles.container}>
      {/* Header Navigation */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.navButton} 
          onPress={handleBack}
          disabled={currentStep === 1}
        >
          <Ionicons 
            name="chevron-back" 
            size={24} 
            color={currentStep === 1 ? '#666' : '#fff'} 
          />
        </TouchableOpacity>
        <ThemedText style={styles.stepIndicator}>
          Step {currentStep} out of 5
        </ThemedText>
        <TouchableOpacity 
          style={styles.navButton} 
          onPress={handleNext}
          disabled={!canProceed() || currentStep === 5}
        >
          <Ionicons 
            name="chevron-forward" 
            size={24} 
            color={(!canProceed() || currentStep === 5) ? '#666' : '#fff'} 
          />
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {currentStep === 1 && renderStep1()}
        {currentStep === 2 && renderStep2()}
        {currentStep === 3 && renderStep3()}
        {currentStep === 4 && renderStep4()}
        {currentStep === 5 && renderStep5()}
      </ScrollView>

      {/* Next/Complete Button */}
      <View style={styles.footer}>
        <Pressable
          style={[styles.nextButton, !canProceed() && styles.nextButtonDisabled]}
          onPress={handleNext}
          disabled={!canProceed()}
        >
          <ThemedText style={styles.nextButtonText}>
            {currentStep === 5 ? 'Complete' : 'Next'}
          </ThemedText>
        </Pressable>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
  },
  navButton: {
    padding: 8,
  },
  stepIndicator: {
    color: '#fff',
    fontSize: 16,
    fontFamily: Fonts.rounded,
    fontWeight: '500',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  stepContainer: {
    flex: 1,
  },
  question: {
    fontSize: 24,
    fontFamily: Fonts.rounded,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 30,
    textAlign: 'center',
  },
  optionsContainer: {
    gap: 12,
  },
  pillButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    borderRadius: 25,
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderWidth: 2,
    borderColor: 'transparent',
    gap: 12,
  },
  pillButtonSelected: {
    backgroundColor: '#37c2e9ff',
    borderColor: '#37c2e9ff',
  },
  pillIcon: {
    fontSize: 20,
  },
  pillText: {
    fontSize: 16,
    fontFamily: Fonts.rounded,
    color: '#fff',
    flex: 1,
  },
  topicGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  topicCard: {
    width: '48%',
    aspectRatio: 1,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
    position: 'relative',
  },
  topicCardSelected: {
    borderColor: '#2ECC71',
    borderWidth: 3,
  },
  topicIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  topicLabel: {
    fontSize: 14,
    fontFamily: Fonts.rounded,
    color: '#fff',
    textAlign: 'center',
    fontWeight: '500',
  },
  checkmark: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
  understandingGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  understandingCard: {
    width: '48%',
    aspectRatio: 1.2,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  understandingCardSelected: {
    borderColor: '#fff',
    borderWidth: 3,
  },
  understandingText: {
    fontSize: 16,
    fontFamily: Fonts.rounded,
    color: '#fff',
    textAlign: 'center',
    fontWeight: '500',
  },
  startingPointCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    borderRadius: 16,
    padding: 20,
    borderWidth: 2,
    borderColor: 'transparent',
    gap: 16,
  },
  startingPointCardSelected: {
    borderColor: '#37c2e9ff',
    backgroundColor: '#37c2e9ff20',
  },
  startingPointIcon: {
    fontSize: 32,
  },
  startingPointContent: {
    flex: 1,
  },
  startingPointTitle: {
    fontSize: 18,
    fontFamily: Fonts.rounded,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  startingPointDescription: {
    fontSize: 14,
    fontFamily: Fonts.rounded,
    color: '#999',
  },
  footer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    paddingTop: 20,
  },
  nextButton: {
    backgroundColor: '#5865F2',
    borderRadius: 30,
    paddingVertical: 16,
    alignItems: 'center',
  },
  nextButtonDisabled: {
    backgroundColor: '#2a2a2a',
    opacity: 0.5,
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 18,
    fontFamily: Fonts.rounded,
    fontWeight: 'bold',
  },
});
