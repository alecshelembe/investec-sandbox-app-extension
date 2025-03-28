import { useState } from "react";
import { Pressable, Text, StyleSheet, Alert } from "react-native";
import * as Location from "expo-location";
import { ThemedView } from "./ThemedView";

export default function ThemeButton({ title, theme = "primary" }) {
  const [location, setLocation] = useState(null);

  const getLocation = async () => {
    // Request permission to access location
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission Denied", "Allow location access to use this feature.");
      return;
    }

    // Fetch the current location
    const locationData = await Location.getCurrentPositionAsync({});
    setLocation(locationData);

    // Show an alert with location details
    Alert.alert(
      "Current Location",
      `Latitude: ${locationData.coords.latitude}\nLongitude: ${locationData.coords.longitude}`
    );
  };

  return (
    <ThemedView style={styles.container}>
      <Pressable style={[styles.button, styles[theme]]} onPress={getLocation}>
        <Text style={styles.text}>{title}</Text>
      </Pressable>
    </ThemedView>
  );
}

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
