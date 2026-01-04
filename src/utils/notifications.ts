import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FreeSlot, MicroSession } from '../types';
import { getSuggestedSession } from '../data/sessions';

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

const SCHEDULED_NOTIFICATIONS_KEY = '@scheduled_notifications';

export const requestNotificationPermissions = async (): Promise<boolean> => {
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    return false;
  }

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('workout-reminders', {
      name: 'Workout Reminders',
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#6C63FF',
    });
  }

  return true;
};

export const scheduleWorkoutNotification = async (
  slot: FreeSlot,
  session: MicroSession
): Promise<string | null> => {
  try {
    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title: `Time for ${session.name}!`,
        body: `You have ${slot.durationMinutes} minutes free. Ready for a ${session.durationMinutes}-minute workout?`,
        data: { sessionId: session.id, slotStart: slot.start.toISOString() },
        sound: true,
      },
      trigger: {
        date: slot.start,
        channelId: 'workout-reminders',
      },
    });

    return notificationId;
  } catch (error) {
    console.error('Error scheduling notification:', error);
    return null;
  }
};

export const scheduleNotificationsForSlots = async (
  slots: FreeSlot[],
  maxNotifications: number = 5
): Promise<void> => {
  // Cancel existing scheduled notifications
  await cancelAllScheduledNotifications();

  const now = new Date();
  const futureSlots = slots.filter(slot => slot.start > now);
  const slotsToNotify = futureSlots.slice(0, maxNotifications);

  const scheduledIds: string[] = [];

  for (const slot of slotsToNotify) {
    const session = getSuggestedSession(slot.durationMinutes);
    if (session) {
      const notificationId = await scheduleWorkoutNotification(slot, session);
      if (notificationId) {
        scheduledIds.push(notificationId);
      }
    }
  }

  // Store scheduled notification IDs
  await AsyncStorage.setItem(SCHEDULED_NOTIFICATIONS_KEY, JSON.stringify(scheduledIds));
};

export const cancelAllScheduledNotifications = async (): Promise<void> => {
  try {
    const stored = await AsyncStorage.getItem(SCHEDULED_NOTIFICATIONS_KEY);
    if (stored) {
      const ids: string[] = JSON.parse(stored);
      for (const id of ids) {
        await Notifications.cancelScheduledNotificationAsync(id);
      }
    }
    await AsyncStorage.removeItem(SCHEDULED_NOTIFICATIONS_KEY);
  } catch (error) {
    console.error('Error cancelling notifications:', error);
  }
};

export const sendImmediateTestNotification = async (): Promise<void> => {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Micro Workout',
      body: 'Notifications are working! You\'ll be reminded when workout slots open up.',
      sound: true,
    },
    trigger: null, // Immediate
  });
};

// Hook for handling notification responses (when user taps notification)
export const addNotificationResponseListener = (
  callback: (sessionId: string) => void
) => {
  return Notifications.addNotificationResponseReceivedListener(response => {
    const data = response.notification.request.content.data;
    if (data?.sessionId) {
      callback(data.sessionId as string);
    }
  });
};

// Hook for handling foreground notifications
export const addNotificationReceivedListener = (
  callback: (notification: Notifications.Notification) => void
) => {
  return Notifications.addNotificationReceivedListener(callback);
};
