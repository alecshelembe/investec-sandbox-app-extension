import React, { useState, useEffect } from "react";
import { Alert, Pressable, Text, StyleSheet, Image, View } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { ThemedView } from "./ThemedView";

export default function CameraButton({ title, theme = "primary" }) {
  const [photo, setPhoto] = useState(null);

  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Sorry, we need camera permissions to make this work!"
        );
      }
    })();
  }, []);

  const takePicture = async () => {
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setPhoto(result.assets[0]);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <Pressable style={[styles.button, styles[theme]]} onPress={takePicture}>
        <Text style={styles.text}>{title}</Text>
      </Pressable>

      {photo && (
        <View style={styles.imageContainer}>
          <Image source={{ uri: photo.uri }} style={styles.image} />
        </View>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginVertical: 20,
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
  imageContainer: {
    marginTop: 20,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    overflow: "hidden",
  },
  image: {
    width: 300,
    height: 200,
  },
});