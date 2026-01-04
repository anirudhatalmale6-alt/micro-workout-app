import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAppContext } from '../context/AppContext';
import { getSuggestedSession } from '../data/sessions';
import { FreeSlot, MicroSession } from '../types';

const COLORS = {
  primary: '#6C63FF',
  secondary: '#FF6B6B',
  success: '#4ECDC4',
  warning: '#FFE66D',
  background: '#F7F8FC',
  card: '#FFFFFF',
  text: '#2D3436',
  textLight: '#636E72',
  border: '#DFE6E9',
};

export const TodayScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const { getFreeSlots, getSessionsThisWeek, getCurrentStreak, settings } = useAppContext();
  const [freeSlots, setFreeSlots] = useState<FreeSlot[]>([]);
  const [suggestedSessions, setSuggestedSessions] = useState<{ slot: FreeSlot; session: MicroSession }[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadSlots();
  }, []);

  const loadSlots = () => {
    const slots = getFreeSlots();
    setFreeSlots(slots);

    // Get suggested sessions for each slot (up to max prompts)
    const suggestions: { slot: FreeSlot; session: MicroSession }[] = [];
    for (const slot of slots.slice(0, settings.maxPromptsPerDay)) {
      const session = getSuggestedSession(slot.durationMinutes);
      if (session) {
        suggestions.push({ slot, session });
      }
    }
    setSuggestedSessions(suggestions);
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadSlots();
    setRefreshing(false);
  };

  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
  };

  const sessionsThisWeek = getSessionsThisWeek().length;
  const currentStreak = getCurrentStreak();

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      {/* Header Stats */}
      <View style={styles.header}>
        <Text style={styles.greeting}>Good {getTimeOfDay()}!</Text>
        <Text style={styles.subtitle}>Let's keep moving today</Text>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{currentStreak}</Text>
          <Text style={styles.statLabel}>Day Streak</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{sessionsThisWeek}</Text>
          <Text style={styles.statLabel}>This Week</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{freeSlots.length}</Text>
          <Text style={styles.statLabel}>Free Slots</Text>
        </View>
      </View>

      {/* Suggested Sessions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Available Sessions</Text>

        {suggestedSessions.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>
              No free slots detected yet.
            </Text>
            <Text style={styles.emptySubtext}>
              {settings.useManualSchedule
                ? 'Add your meetings in Settings to find free time.'
                : 'Connect your calendar in Settings.'}
            </Text>
            <TouchableOpacity
              style={styles.settingsButton}
              onPress={() => navigation.navigate('Settings')}
            >
              <Text style={styles.settingsButtonText}>Go to Settings</Text>
            </TouchableOpacity>
          </View>
        ) : (
          suggestedSessions.map(({ slot, session }, index) => (
            <TouchableOpacity
              key={index}
              style={styles.sessionCard}
              onPress={() => navigation.navigate('Workout', { session })}
            >
              <View style={styles.sessionTime}>
                <Text style={styles.timeText}>{formatTime(slot.start)}</Text>
                <Text style={styles.durationBadge}>{slot.durationMinutes} min available</Text>
              </View>
              <View style={styles.sessionInfo}>
                <Text style={styles.sessionName}>{session.name}</Text>
                <Text style={styles.sessionFocus}>{session.focus}</Text>
                <Text style={styles.sessionDuration}>{session.durationMinutes} min workout</Text>
              </View>
              <View style={styles.startButton}>
                <Text style={styles.startButtonText}>Start</Text>
              </View>
            </TouchableOpacity>
          ))
        )}
      </View>

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.quickActions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigation.navigate('Sessions')}
          >
            <Text style={styles.actionIcon}>💪</Text>
            <Text style={styles.actionLabel}>All Sessions</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigation.navigate('CheckIn')}
          >
            <Text style={styles.actionIcon}>📝</Text>
            <Text style={styles.actionLabel}>Daily Check-in</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigation.navigate('Snacks')}
          >
            <Text style={styles.actionIcon}>🍎</Text>
            <Text style={styles.actionLabel}>Snack Ideas</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const getTimeOfDay = (): string => {
  const hour = new Date().getHours();
  if (hour < 12) return 'morning';
  if (hour < 17) return 'afternoon';
  return 'evening';
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    padding: 20,
    paddingTop: 40,
    backgroundColor: COLORS.primary,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  greeting: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  subtitle: {
    fontSize: 16,
    color: '#FFFFFF',
    opacity: 0.9,
    marginTop: 5,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: -30,
    paddingHorizontal: 15,
  },
  statCard: {
    backgroundColor: COLORS.card,
    borderRadius: 15,
    padding: 15,
    alignItems: 'center',
    minWidth: 90,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.textLight,
    marginTop: 5,
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 15,
  },
  sessionCard: {
    backgroundColor: COLORS.card,
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  sessionTime: {
    marginRight: 15,
    alignItems: 'center',
  },
  timeText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  durationBadge: {
    fontSize: 10,
    color: COLORS.success,
    marginTop: 5,
  },
  sessionInfo: {
    flex: 1,
  },
  sessionName: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
  },
  sessionFocus: {
    fontSize: 14,
    color: COLORS.textLight,
    marginTop: 2,
  },
  sessionDuration: {
    fontSize: 12,
    color: COLORS.primary,
    marginTop: 5,
  },
  startButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  startButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  emptyState: {
    backgroundColor: COLORS.card,
    borderRadius: 15,
    padding: 30,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: COLORS.text,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    color: COLORS.textLight,
    textAlign: 'center',
    marginTop: 10,
  },
  settingsButton: {
    marginTop: 20,
    backgroundColor: COLORS.primary,
    paddingHorizontal: 25,
    paddingVertical: 12,
    borderRadius: 25,
  },
  settingsButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  actionButton: {
    backgroundColor: COLORS.card,
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    minWidth: 100,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  actionIcon: {
    fontSize: 28,
  },
  actionLabel: {
    fontSize: 12,
    color: COLORS.text,
    marginTop: 8,
  },
});
