import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Vibration,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useAppContext } from '../context/AppContext';
import { getExerciseByName } from '../data/exercises';
import { MicroSession, Exercise } from '../types';

const COLORS = {
  primary: '#6C63FF',
  secondary: '#FF6B6B',
  success: '#4ECDC4',
  warning: '#FFE66D',
  background: '#F7F8FC',
  card: '#FFFFFF',
  text: '#2D3436',
  textLight: '#636E72',
};

type WorkoutState = 'ready' | 'active' | 'paused' | 'completed';

export const WorkoutScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { addCompletedSession } = useAppContext();

  const session: MicroSession = route.params?.session;
  const exercises = session.exercises
    .map(name => getExerciseByName(name))
    .filter((e): e is Exercise => e !== undefined);

  const [workoutState, setWorkoutState] = useState<WorkoutState>('ready');
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(session.durationMinutes * 60);
  const [exerciseTime, setExerciseTime] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const currentExercise = exercises[currentExerciseIndex];
  const timePerExercise = Math.floor((session.durationMinutes * 60) / exercises.length);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  useEffect(() => {
    if (workoutState === 'active') {
      timerRef.current = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            completeWorkout();
            return 0;
          }
          return prev - 1;
        });
        setExerciseTime(prev => {
          if (prev >= timePerExercise - 1) {
            // Move to next exercise
            if (currentExerciseIndex < exercises.length - 1) {
              Vibration.vibrate(200);
              setCurrentExerciseIndex(i => i + 1);
              return 0;
            }
          }
          return prev + 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [workoutState, currentExerciseIndex]);

  const startWorkout = () => {
    setWorkoutState('active');
  };

  const pauseWorkout = () => {
    setWorkoutState('paused');
  };

  const resumeWorkout = () => {
    setWorkoutState('active');
  };

  const skipExercise = () => {
    if (currentExerciseIndex < exercises.length - 1) {
      setCurrentExerciseIndex(i => i + 1);
      setExerciseTime(0);
    } else {
      completeWorkout();
    }
  };

  const completeWorkout = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setWorkoutState('completed');

    const now = new Date();
    addCompletedSession({
      id: `${session.id}-${now.getTime()}`,
      sessionId: session.id,
      date: now.toISOString().split('T')[0],
      completedAt: now.toISOString(),
      durationMinutes: session.durationMinutes,
    });

    Vibration.vibrate([200, 100, 200]);
  };

  const exitWorkout = () => {
    Alert.alert(
      'Exit Workout',
      'Are you sure you want to exit? Progress will not be saved.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Exit', style: 'destructive', onPress: () => navigation.goBack() },
      ]
    );
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (workoutState === 'completed') {
    return (
      <View style={styles.completedContainer}>
        <Text style={styles.completedIcon}>🎉</Text>
        <Text style={styles.completedTitle}>Workout Complete!</Text>
        <Text style={styles.completedSubtitle}>{session.name}</Text>
        <Text style={styles.completedStats}>
          {session.durationMinutes} minutes • {exercises.length} exercises
        </Text>
        <TouchableOpacity
          style={styles.doneButton}
          onPress={() => navigation.navigate('Today')}
        >
          <Text style={styles.doneButtonText}>Done</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Timer Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={exitWorkout} style={styles.closeButton}>
          <Text style={styles.closeText}>✕</Text>
        </TouchableOpacity>
        <View style={styles.timerContainer}>
          <Text style={styles.timerLabel}>Time Remaining</Text>
          <Text style={styles.timerText}>{formatTime(timeRemaining)}</Text>
        </View>
        <View style={styles.progressInfo}>
          <Text style={styles.progressText}>
            {currentExerciseIndex + 1} / {exercises.length}
          </Text>
        </View>
      </View>

      {/* Exercise Progress Bar */}
      <View style={styles.progressBarContainer}>
        {exercises.map((_, index) => (
          <View
            key={index}
            style={[
              styles.progressSegment,
              index < currentExerciseIndex && styles.progressComplete,
              index === currentExerciseIndex && styles.progressActive,
            ]}
          />
        ))}
      </View>

      {/* Current Exercise */}
      {workoutState === 'ready' ? (
        <View style={styles.readyContainer}>
          <Text style={styles.readyTitle}>{session.name}</Text>
          <Text style={styles.readySubtitle}>{session.focus}</Text>
          <Text style={styles.readyDuration}>{session.durationMinutes} minutes</Text>
          <Text style={styles.readyNotes}>{session.notes}</Text>

          <View style={styles.exerciseList}>
            <Text style={styles.exerciseListTitle}>Exercises:</Text>
            {exercises.map((ex, index) => (
              <Text key={index} style={styles.exerciseListItem}>
                {index + 1}. {ex.name}
              </Text>
            ))}
          </View>

          <TouchableOpacity style={styles.startButton} onPress={startWorkout}>
            <Text style={styles.startButtonText}>Start Workout</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView style={styles.exerciseContainer}>
          <View style={styles.exerciseCard}>
            <Text style={styles.exerciseName}>{currentExercise.name}</Text>
            <Text style={styles.exerciseCategory}>{currentExercise.category}</Text>

            {/* Exercise Timer */}
            <View style={styles.exerciseTimer}>
              <Text style={styles.exerciseTimerText}>{formatTime(exerciseTime)}</Text>
              <Text style={styles.exerciseTimerLabel}>
                / {formatTime(timePerExercise)}
              </Text>
            </View>

            {/* Instructions */}
            <View style={styles.instructionSection}>
              <Text style={styles.instructionTitle}>Setup</Text>
              <Text style={styles.instructionText}>{currentExercise.setup}</Text>
            </View>

            <View style={styles.instructionSection}>
              <Text style={styles.instructionTitle}>Execution</Text>
              <Text style={styles.instructionText}>{currentExercise.execution}</Text>
            </View>

            <View style={styles.instructionSection}>
              <Text style={styles.instructionTitle}>Key Cues</Text>
              <Text style={styles.instructionText}>{currentExercise.keyCues}</Text>
            </View>

            <TouchableOpacity
              style={styles.videoButton}
              onPress={() => navigation.navigate('ExerciseDetail', { exercise: currentExercise })}
            >
              <Text style={styles.videoButtonText}>View Video & Details</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      )}

      {/* Controls */}
      {workoutState !== 'ready' && (
        <View style={styles.controls}>
          <TouchableOpacity style={styles.skipButton} onPress={skipExercise}>
            <Text style={styles.skipButtonText}>Skip</Text>
          </TouchableOpacity>

          {workoutState === 'active' ? (
            <TouchableOpacity style={styles.pauseButton} onPress={pauseWorkout}>
              <Text style={styles.pauseButtonText}>Pause</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.resumeButton} onPress={resumeWorkout}>
              <Text style={styles.resumeButtonText}>Resume</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity style={styles.completeButton} onPress={completeWorkout}>
            <Text style={styles.completeButtonText}>Done</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    backgroundColor: COLORS.primary,
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  closeButton: {
    padding: 10,
  },
  closeText: {
    color: '#FFFFFF',
    fontSize: 24,
  },
  timerContainer: {
    alignItems: 'center',
  },
  timerLabel: {
    color: '#FFFFFF',
    fontSize: 12,
    opacity: 0.8,
  },
  timerText: {
    color: '#FFFFFF',
    fontSize: 36,
    fontWeight: 'bold',
  },
  progressInfo: {
    padding: 10,
  },
  progressText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  progressBarContainer: {
    flexDirection: 'row',
    padding: 15,
    gap: 5,
  },
  progressSegment: {
    flex: 1,
    height: 6,
    backgroundColor: COLORS.border,
    borderRadius: 3,
  },
  progressComplete: {
    backgroundColor: COLORS.success,
  },
  progressActive: {
    backgroundColor: COLORS.primary,
  },
  readyContainer: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
  },
  readyTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.text,
    marginTop: 20,
  },
  readySubtitle: {
    fontSize: 18,
    color: COLORS.primary,
    marginTop: 5,
  },
  readyDuration: {
    fontSize: 16,
    color: COLORS.textLight,
    marginTop: 10,
  },
  readyNotes: {
    fontSize: 14,
    color: COLORS.textLight,
    marginTop: 5,
    fontStyle: 'italic',
  },
  exerciseList: {
    width: '100%',
    marginTop: 30,
    backgroundColor: COLORS.card,
    borderRadius: 15,
    padding: 20,
  },
  exerciseListTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 10,
  },
  exerciseListItem: {
    fontSize: 14,
    color: COLORS.textLight,
    paddingVertical: 5,
  },
  startButton: {
    marginTop: 30,
    backgroundColor: COLORS.success,
    paddingHorizontal: 50,
    paddingVertical: 18,
    borderRadius: 30,
  },
  startButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  exerciseContainer: {
    flex: 1,
    padding: 15,
  },
  exerciseCard: {
    backgroundColor: COLORS.card,
    borderRadius: 20,
    padding: 25,
    alignItems: 'center',
  },
  exerciseName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
    textAlign: 'center',
  },
  exerciseCategory: {
    fontSize: 14,
    color: COLORS.primary,
    marginTop: 5,
  },
  exerciseTimer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginTop: 20,
  },
  exerciseTimerText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  exerciseTimerLabel: {
    fontSize: 20,
    color: COLORS.textLight,
    marginLeft: 5,
  },
  instructionSection: {
    width: '100%',
    marginTop: 20,
  },
  instructionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 5,
  },
  instructionText: {
    fontSize: 16,
    color: COLORS.text,
    lineHeight: 24,
  },
  videoButton: {
    marginTop: 25,
    backgroundColor: COLORS.secondary,
    paddingHorizontal: 25,
    paddingVertical: 12,
    borderRadius: 20,
  },
  videoButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 20,
    backgroundColor: COLORS.card,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  skipButton: {
    paddingHorizontal: 25,
    paddingVertical: 12,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: COLORS.textLight,
  },
  skipButtonText: {
    color: COLORS.textLight,
    fontWeight: '600',
  },
  pauseButton: {
    paddingHorizontal: 35,
    paddingVertical: 12,
    borderRadius: 20,
    backgroundColor: COLORS.warning,
  },
  pauseButtonText: {
    color: COLORS.text,
    fontWeight: 'bold',
  },
  resumeButton: {
    paddingHorizontal: 35,
    paddingVertical: 12,
    borderRadius: 20,
    backgroundColor: COLORS.success,
  },
  resumeButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  completeButton: {
    paddingHorizontal: 25,
    paddingVertical: 12,
    borderRadius: 20,
    backgroundColor: COLORS.primary,
  },
  completeButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  completedContainer: {
    flex: 1,
    backgroundColor: COLORS.success,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  completedIcon: {
    fontSize: 80,
  },
  completedTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 20,
  },
  completedSubtitle: {
    fontSize: 20,
    color: '#FFFFFF',
    marginTop: 10,
    opacity: 0.9,
  },
  completedStats: {
    fontSize: 16,
    color: '#FFFFFF',
    marginTop: 10,
    opacity: 0.8,
  },
  doneButton: {
    marginTop: 40,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 50,
    paddingVertical: 15,
    borderRadius: 30,
  },
  doneButtonText: {
    color: COLORS.success,
    fontSize: 18,
    fontWeight: 'bold',
  },
});
