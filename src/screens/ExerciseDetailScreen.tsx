import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Exercise } from '../types';

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

export const ExerciseDetailScreen: React.FC = () => {
  const route = useRoute<any>();
  const navigation = useNavigation();
  const exercise: Exercise = route.params?.exercise;

  const openVideo = () => {
    if (exercise.videoUrl) {
      Linking.openURL(exercise.videoUrl);
    }
  };

  const getCategoryColor = (category: string): string => {
    const colors: { [key: string]: string } = {
      Push: '#FF6B6B',
      Pull: '#4ECDC4',
      Legs: '#FFE66D',
      Glutes: '#FF9F43',
      Core: '#6C63FF',
      Conditioning: '#A29BFE',
      Mobility: '#00CEC9',
      'Pelvic Floor': '#FD79A8',
    };
    return colors[category] || COLORS.primary;
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: getCategoryColor(exercise.category) }]}>
        <Text style={styles.exerciseName}>{exercise.name}</Text>
        <View style={styles.categoryBadge}>
          <Text style={styles.categoryText}>{exercise.category}</Text>
        </View>
      </View>

      {/* Video Button */}
      <TouchableOpacity style={styles.videoButton} onPress={openVideo}>
        <Text style={styles.videoIcon}>▶</Text>
        <Text style={styles.videoButtonText}>Watch Video Tutorial</Text>
      </TouchableOpacity>

      {/* Instructions */}
      <View style={styles.section}>
        <View style={styles.instructionCard}>
          <Text style={styles.instructionTitle}>Setup</Text>
          <Text style={styles.instructionText}>{exercise.setup}</Text>
        </View>

        <View style={styles.instructionCard}>
          <Text style={styles.instructionTitle}>Execution</Text>
          <Text style={styles.instructionText}>{exercise.execution}</Text>
        </View>

        <View style={styles.instructionCard}>
          <Text style={styles.instructionTitle}>Key Cues</Text>
          <Text style={styles.instructionText}>{exercise.keyCues}</Text>
        </View>
      </View>

      {/* Common Mistakes */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Watch Out For</Text>
        <View style={styles.mistakesCard}>
          <Text style={styles.mistakesIcon}>⚠️</Text>
          <Text style={styles.mistakesText}>{exercise.commonMistakes}</Text>
        </View>
      </View>

      {/* Progression */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Scaling Options</Text>
        <View style={styles.scalingRow}>
          <View style={[styles.scalingCard, styles.regressionCard]}>
            <Text style={styles.scalingLabel}>Too Hard?</Text>
            <Text style={styles.scalingTitle}>Regression</Text>
            <Text style={styles.scalingText}>{exercise.regression}</Text>
          </View>
          <View style={[styles.scalingCard, styles.progressionCard]}>
            <Text style={styles.scalingLabel}>Too Easy?</Text>
            <Text style={styles.scalingTitle}>Progression</Text>
            <Text style={styles.scalingText}>{exercise.progression}</Text>
          </View>
        </View>
      </View>

      {/* Notes */}
      {exercise.notes && (
        <View style={styles.section}>
          <View style={styles.notesCard}>
            <Text style={styles.notesLabel}>Note:</Text>
            <Text style={styles.notesText}>{exercise.notes}</Text>
          </View>
        </View>
      )}

      <View style={styles.bottomPadding} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  exerciseName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  categoryBadge: {
    alignSelf: 'center',
    marginTop: 10,
    backgroundColor: 'rgba(255,255,255,0.3)',
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 15,
  },
  categoryText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  videoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.secondary,
    marginHorizontal: 20,
    marginTop: -20,
    paddingVertical: 18,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
  },
  videoIcon: {
    fontSize: 20,
    color: '#FFFFFF',
    marginRight: 10,
  },
  videoButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 15,
  },
  instructionCard: {
    backgroundColor: COLORS.card,
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
  },
  instructionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  instructionText: {
    fontSize: 16,
    color: COLORS.text,
    lineHeight: 24,
  },
  mistakesCard: {
    backgroundColor: '#FFF3CD',
    borderRadius: 15,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  mistakesIcon: {
    fontSize: 24,
    marginRight: 15,
  },
  mistakesText: {
    flex: 1,
    fontSize: 16,
    color: '#856404',
    lineHeight: 24,
  },
  scalingRow: {
    flexDirection: 'row',
    gap: 15,
  },
  scalingCard: {
    flex: 1,
    borderRadius: 15,
    padding: 15,
  },
  regressionCard: {
    backgroundColor: '#E8F5E9',
  },
  progressionCard: {
    backgroundColor: '#E3F2FD',
  },
  scalingLabel: {
    fontSize: 12,
    color: COLORS.textLight,
  },
  scalingTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.text,
    marginTop: 5,
    marginBottom: 8,
  },
  scalingText: {
    fontSize: 14,
    color: COLORS.text,
    lineHeight: 20,
  },
  notesCard: {
    backgroundColor: '#F8F9FA',
    borderRadius: 15,
    padding: 15,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
  },
  notesLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: COLORS.textLight,
    marginBottom: 5,
  },
  notesText: {
    fontSize: 14,
    color: COLORS.text,
    fontStyle: 'italic',
  },
  bottomPadding: {
    height: 40,
  },
});
