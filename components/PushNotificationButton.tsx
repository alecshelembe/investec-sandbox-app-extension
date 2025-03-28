import React from 'react';
import { Button, Alert, Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';

// Configure notification handling
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

async function registerForPushNotificationsAsync() {
  let token;

  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      Alert.alert(
        'Permission Denied',
        'Failed to get push token for push notification!',
        [{ text: 'OK' }]
      );
      return;
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;
    console.log(token);
  } else {
    Alert.alert(
      'Simulator/Emulator',
      'Must use physical device for Push Notifications',
      [{ text: 'OK' }]
    );
  }

  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  return token;
}

export default function PushNotificationButton({
  title = 'Send Notification',
  notificationTitle = 'Notification Title',
  notificationBody = 'Notification Body',
}) {
  const sendPushNotification = async (expoPushToken) => {
    try {
      const message = {
        to: expoPushToken,
        sound: 'default',
        title: notificationTitle,
        body: notificationBody,
        data: { someData: 'goes here' },
      };

      const response = await fetch('https://exp.host/--/api/v2/push/send', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Accept-encoding': 'gzip, deflate',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(message),
      });

      if (!response.ok) {
        console.error('Failed to send push notification:', response);
        Alert.alert(
          'Notification Failed',
          'There was an error sending the notification.',
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      console.error('Error sending push notification:', error);
      Alert.alert(
        'Notification Failed',
        'An unexpected error occurred.',
        [{ text: 'OK' }]
      );
    }
  };

  const handleSendNotification = async () => {
    const token = await registerForPushNotificationsAsync();
    if (token) {
      await sendPushNotification(token);
    }
  };

  return <Button title={title} onPress={handleSendNotification} />;
}