import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useToken } from '../../TokenContext'; // adjust path if needed

const TokenScreen = () => {
  const { token } = useToken();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [accountData, setAccountData] = useState<any>(null);

  const sendTokenToServer = async () => {
    setErrorMessage(null); // Reset on new request
    setAccountData(null);

    if (!token) {
      setErrorMessage('No token available to send.');
      return;
    }

    try {
      const response = await fetch('https://investec-developer-project-repo.visitmyjoburg.co.za/api/fetch-account-info', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          access_token: token,
        }),
      });

      const contentType = response.headers.get('Content-Type');
      let data;

      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
        console.log('API Response (JSON):', data); // Log JSON response
      } else {
        const text = await response.text();
        console.log('API Response (Non-JSON):', text); // Log non-JSON response
        setErrorMessage(`Non-JSON response:\n\n${text}`);
        return;
      }

      if (response.ok && data.success) {
        setAccountData(data.accountData);
      } else {
        setErrorMessage(`API Error:\n${data.error || JSON.stringify(data, null, 2)}`);
      }
    } catch (error: any) {
      console.error('API Error (Network/Parse):', error); // Log network/parse errors
      setErrorMessage(`Network/Parse Error:\n${error.message || 'Something went wrong'}`);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Token Viewer</Text>
      <Text style={styles.label}>Access Token:</Text>
      <Text style={styles.token}>{token || 'No token available'}</Text>

      <TouchableOpacity style={styles.button} onPress={sendTokenToServer}>
        <Text style={styles.buttonText}>Send Token to Server</Text>
      </TouchableOpacity>

      {errorMessage && (
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>{errorMessage}</Text>
        </View>
      )}

      {accountData && (
        <View style={styles.successBox}>
          <Text style={styles.successText}>Account Info:</Text>
          <Text style={styles.accountJson}>{JSON.stringify(accountData, null, 2)}</Text>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
    flex: 1,
  },
  title: {
    marginTop: 20,
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  label: {
    fontSize: 18,
    marginBottom: 10,
  },
  token: {
    fontSize: 14,
    backgroundColor: '#e0e7ff',
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#2563eb',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  errorBox: {
    backgroundColor: '#fee2e2',
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
  },
  errorText: {
    color: '#b91c1c',
    fontSize: 14,
    fontFamily: 'monospace',
  },
  successBox: {
    backgroundColor: '#dcfce7',
    padding: 12,
    borderRadius: 8,
  },
  successText: {
    color: '#065f46',
    fontWeight: 'bold',
    marginBottom: 5,
  },
  accountJson: {
    fontSize: 12,
    color: '#065f46',
    fontFamily: 'monospace',
  },
});

export default TokenScreen;