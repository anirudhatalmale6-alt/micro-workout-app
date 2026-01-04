import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { microSessions } from '../data/sessions';
import { getExerciseByName } from '../data/exercises';

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

type Duration = 4 | 6 | 8 | 10 | 'all';

export const SessionsScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const [selectedDuration, setSelectedDuration] = useState<Duration>('all');

  const filteredSessions =
    selectedDuration === 'all'
      ? microSessions
      : microSessions.filter(s => s.durationMinutes === selectedDuration);

  const getDurationColor = (duration: number): string => {
    const colors: { [key: number]: string } = {
      4: '#4ECDC4',
      6: '#6C63FF',
      8: '#FF9F43',
      10: '#FF6B6B',
    };
    return colors[duration] || COLORS.primary;
  };

  return (
    <View style={styles.container}>
      {/* Filter Tabs */}
      <View style={styles.filterContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {(['all', 4, 6, 8, 10] as Duration[]).map(duration => (
            <TouchableOpacity
              key={duration}
              style={[
                styles.filterTab,
                selectedDuration === duration && styles.filterTabActive,
              ]}
              onPress={() => setSelectedDuration(duration)}
            >
              <Text
                style={[
                  styles.filterTabText,
                  selectedDuration === duration && styles.filterTabTextActive,
                ]}
              >
                {duration === 'all' ? 'All' : `${duration} min`}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Sessions List */}
      <ScrollView style={styles.sessionsList}>
        {filteredSessions.map(session => (
          <TouchableOpacity
            key={session.id}
            style={styles.sessionCard}
            onPress={() => navigation.navigate('Workout', { session })}
          >
            <View
              style={[
                styles.durationIndicator,
                { backgroundColor: getDurationColor(session.durationMinutes) },
              ]}
            >
              <Text style={styles.durationText}>{session.durationMinutes}</Text>
              <Text style={styles.durationLabel}>min</Text>
            </View>

            <View style={styles.sessionInfo}>
              <Text style={styles.sessionName}>{session.name}</Text>
              <Text style={styles.sessionFocus}>{session.focus}</Text>
              <Text style={styles.sessionNotes}>{session.notes}</Text>

              <View style={styles.exerciseTags}>
                {session.exercises.slice(0, 3).map((exName, index) => {
                  const ex = getExerciseByName(exName);
                  return (
                    <View key={index} style={styles.exerciseTag}>
                      <Text style={styles.exerciseTagText}>{exName}</Text>
                    </View>
                  );
                })}
                {session.exercises.length > 3 && (
                  <View style={styles.moreTag}>
                    <Text style={styles.moreTagText}>
                      +{session.exercises.length - 3}
                    </Text>
                  </View>
                )}
              </View>
            </View>

            <View style={styles.startArrow}>
              <Text style={styles.arrowText}>→</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  filterContainer: {
    backgroundColor: COLORS.card,
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  filterTab: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    marginHorizontal: 5,
    backgroundColor: COLORS.background,
  },
  filterTabActive: {
    backgroundColor: COLORS.primary,
  },
  filterTabText: {
    color: COLORS.textLight,
    fontWeight: '600',
  },
  filterTabTextActive: {
    color: '#FFFFFF',
  },
  sessionsList: {
    flex: 1,
    padding: 15,
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
  durationIndicator: {
    width: 60,
    height: 60,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
  },
  durationText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  durationLabel: {
    fontSize: 10,
    color: '#FFFFFF',
    opacity: 0.9,
  },
  sessionInfo: {
    flex: 1,
  },
  sessionName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  sessionFocus: {
    fontSize: 14,
    color: COLORS.primary,
    marginTop: 2,
  },
  sessionNotes: {
    fontSize: 12,
    color: COLORS.textLight,
    marginTop: 5,
    fontStyle: 'italic',
  },
  exerciseTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
    gap: 5,
  },
  exerciseTag: {
    backgroundColor: COLORS.background,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  exerciseTagText: {
    fontSize: 10,
    color: COLORS.textLight,
  },
  moreTag: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  moreTagText: {
    fontSize: 10,
    color: '#FFFFFF',
  },
  startArrow: {
    padding: 10,
  },
  arrowText: {
    fontSize: 24,
    color: COLORS.primary,
  },
});
