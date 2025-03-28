import React from 'react';
import { StyleSheet, Text, TouchableOpacity, Alert } from 'react-native';

const MyAjaxButton = ({ url, method = 'GET', data = null, theme = 'primary' }) => { // Added theme prop

  const handleAjaxCall = async () => {
    try {
      const options = {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
      };

      if (data) {
        options.body = JSON.stringify(data);
      }

      const response = await fetch(url, options);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const responseData = await response.json();
      Alert.alert('Success', JSON.stringify(responseData));

    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  const buttonStyle = [styles.button, styles[theme]]; // Apply dynamic theme style

  return (
    <TouchableOpacity style={buttonStyle} onPress={handleAjaxCall}>
      <Text style={styles.text}>Send Ajax Call</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginVertical: 10,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: "center",
  },
  text: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  primary: {
    backgroundColor: "#007AFF",
  },
  secondary: {
    backgroundColor: "#FF5733",
  },
  success: {
    backgroundColor: "#28A745",
  },
  danger: {
    backgroundColor: "#DC3545",
  },
});

export default MyAjaxButton;