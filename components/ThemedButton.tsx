import { Pressable, Text, StyleSheet } from "react-native";
import { ThemedView } from "./ThemedView"; // Assuming you use ThemedView for styling

export default function ThemeButton({ title, onPress, theme = "primary" }) {
  return (
    <ThemedView style={styles.container}>
      <Pressable
        style={[styles.button, styles[theme]]}
        onPress={onPress}
      >
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
    backgroundColor: "#007AFF", // Blue
  },
  secondary: {
    backgroundColor: "#FF5733", // Red
  },
  success: {
    backgroundColor: "#28A745", // Green
  },
  danger: {
    backgroundColor: "#DC3545", // Dark Red
  },
});
