import React, { useRef, useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, ScrollView } from 'react-native';

interface LandingPageProps {
  accessToken?: string | null;
}

const LandingPage: React.FC<LandingPageProps> = ({ accessToken }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [token, setToken] = useState<string | null>(accessToken || null);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  const requestAccessToken = async () => {
    try {
      const response = await fetch('https://investec-developer-project-repo.visitmyjoburg.co.za/authenticate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      setToken(data.access_token);
    } catch (error) {
      console.error('Error fetching access token:', error);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.spacer} />
      <Animated.View style={[styles.hero, { opacity: fadeAnim }]}>
        <Text style={styles.heroTitle}>Welcome to Investec Developer Portal</Text>
        <Text style={styles.heroSubtitle}>Seamlessly interact with Investec APIs</Text>
      </Animated.View>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>API Access</Text>
        {token ? (
          <>
            <Text style={styles.infoText}>Your Access Token:</Text>
            <View style={styles.tokenContainer}>
              <Text style={styles.tokenText}>{token}</Text>
            </View>
          </>
        ) : (
          <>
            <Text style={styles.infoText}>No access token available.</Text>
            <TouchableOpacity style={styles.button} onPress={requestAccessToken}>
              <Text style={styles.buttonText}>Request Access Token</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>About This App</Text>
        <Text style={styles.infoText}>This portal enables developers to securely interact with Investec’s API ecosystem.</Text>
      </View>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Developer Resources</Text>
        <TouchableOpacity style={styles.linkItem}>
          <Text style={styles.linkText}>Project Repository</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.linkItem}>
          <Text style={styles.linkText}>API Documentation</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.linkItem}>
          <Text style={styles.linkText}>Developer Community</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
  spacer: {
    height: 20,
  },
  hero: {
    alignItems: 'center',
    backgroundColor: '#1e40af',
    padding: 30,
    borderRadius: 10,
    marginBottom: 20,
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
  heroSubtitle: {
    fontSize: 16,
    color: 'white',
    textAlign: 'center',
    marginTop: 5,
  },
  card: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  infoText: {
    fontSize: 16,
    marginBottom: 10,
  },
  tokenContainer: {
    backgroundColor: '#e0e7ff',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  tokenText: {
    fontSize: 14,
    color: '#333',
  },
  button: {
    backgroundColor: '#2563eb',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  linkItem: {
    paddingVertical: 8,
  },
  linkText: {
    fontSize: 16,
    color: '#2563eb',
  },
});

export default LandingPage;
