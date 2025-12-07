import { Pressable, StyleSheet } from "react-native";
import { Image } from "expo-image";
import { Link } from "expo-router";
import { LinearGradient } from 'expo-linear-gradient'
import { ThemedText } from '@/components/themed-text';
import { Fonts } from '@/constants/theme';

export default function Welcome() {
  return (
    <LinearGradient 
      colors={['#010006ff', '#836be6ff']} // start and end colors
      start={{ x: 0.5, y: 0 }}
      style={styles.container}
    >
      <Image
        source={require("@/assets/images/finance-icon.png")} 
        style={styles.image}
        contentFit="contain"
      />

      <ThemedText lightColor="#ffffff" type="title" style={styles.title}>Welcome to FinC!</ThemedText>

      <ThemedText style={styles.description} lightColor="#ffffff" >
        Our lessons are designed to help you deepen your knowledge on financial
        literacy and empower your mindset for the future!
      </ThemedText>

    <Link href='/signup' asChild>
    <Pressable style={styles.button}>
        <ThemedText lightColor="#ffffff">
            Let’s Get Started →
        </ThemedText>
    </Pressable>
    </Link>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 20
  },

  image: {
    width: "100%",
    height: 260,
    marginBottom: 20
  },

  title: {
    flexDirection: "row",
    fontFamily: Fonts.rounded,
    marginBottom: 37
  },

  description: {
    fontSize: 17.5,
    textAlign: "center",
    lineHeight: 22,
    paddingHorizontal: 10,
    marginBottom: 37,
    fontFamily: Fonts.rounded
    
  },

  button: {
    backgroundColor: "black",
    paddingVertical: 18,
    paddingHorizontal: 24,
    borderRadius: 14,
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
});
