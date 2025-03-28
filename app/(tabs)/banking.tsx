import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking, Animated } from 'react-native';

interface LandingPageProps {
  accessToken?: string | null;
}

const LandingPage: React.FC<LandingPageProps> = ({ accessToken }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current; // Initial opacity 0

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true, // Improve performance
    }).start();
  }, [fadeAnim]);

  const handleLinkPress = (url: string) => {
    Linking.openURL(url);
  };

  return (
    <View style={styles.container}>
      {/* Hero Section */}
      <Animated.View style={[styles.hero, { opacity: fadeAnim, transform: [{ translateY: fadeAnim.interpolate({inputRange: [0, 1], outputRange: [20, 0]})}] }]}>
        <Text style={styles.heroTitle}>Welcome Investec Developer</Text>
        <Text style={styles.heroText}>Explore the best in coding with us and look around.</Text>
      </Animated.View>

      {accessToken ? (
        // Access Token Section
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Access Token (Sandbox)</Text>
          <View style={styles.tokenContainer}>
            <Text style={styles.tokenLabel}>Your Access Token:</Text>
            <Text style={styles.tokenText}>{accessToken}</Text>
          </View>
          <TouchableOpacity style={styles.button} onPress={() => handleLinkPress('/fetch-account-info')}>
            <Text style={styles.buttonText}>Fetch Account Info</Text>
          </TouchableOpacity>
        </View>
      ) : (
        // No Token Available
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>No Access Token Available</Text>
          <Text style={styles.sectionText}>Request a new access token by clicking below.</Text>
          <TouchableOpacity style={styles.button} onPress={() => handleLinkPress('/authenticate')}>
            <Text style={styles.buttonText}>Request Access Token</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Help Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Help</Text>
        <View style={styles.helpGrid}>
          <TouchableOpacity style={styles.helpItem} onPress={() => handleLinkPress('https://github.com/alecshelembe/investec-developer-project-repo')}>
            <Text style={styles.helpItemTitle}>Investec Developer Project Repo</Text>
            <Text style={styles.helpItemText}>Explore the GitHub repository for the Investec Developer Project.</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.helpItem} onPress={() => handleLinkPress('https://developer.investec.com/za/api-products/documentation/SA_PB_Account_Information#section/Release-Notes')}>
            <Text style={styles.helpItemTitle}>Investec API Documentation</Text>
            <Text style={styles.helpItemText}>Check the API documentation for SA PB Account Information.</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.helpItem} onPress={() => handleLinkPress('https://github.com/Investec-Developer-Community')}>
            <Text style={styles.helpItemTitle}>Investec Developer Community</Text>
            <Text style={styles.helpItemText}>Join the Investec Developer Community for support and updates.</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0', // Light gray background
    padding: 20,
  },
  hero: {
    backgroundColor: 'linear-gradient(90deg, #2563eb, #1e40af)',
    padding: 20,
    alignItems: 'center',
    marginBottom: 20,
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 10,
  },
  heroText: {
    fontSize: 16,
    color: 'white',
    opacity: 0.9,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  sectionText: {
    fontSize: 16,
    marginBottom: 10,
  },
  tokenContainer: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  tokenLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  tokenText: {
    fontSize: 12,
  },
  button: {
    backgroundColor: '#2563eb',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  helpGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  helpItem: {
    backgroundColor: 'white',
    width: '30%',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  helpItemTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  helpItemText: {
    fontSize: 12,
  },
});

export default LandingPage;