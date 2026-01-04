import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { useAppContext } from '../context/AppContext';
import { milestones, getWeekNumber, getCurrentMilestone } from '../data/milestones';

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

export const ProgressScreen: React.FC = () => {
  const { progress, completedSessions, checkIns } = useAppContext();

  const currentWeek = getWeekNumber(progress.startDate);
  const currentMilestone = getCurrentMilestone(currentWeek);
  const weightLost = progress.startWeight - progress.currentWeight;

  // Calculate weekly stats
  const getWeeklyCheckIns = () => {
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    return checkIns.filter(c => new Date(c.date) >= weekAgo);
  };

  const weeklyCheckIns = getWeeklyCheckIns();
  const avgSleep = weeklyCheckIns.length > 0
    ? weeklyCheckIns.reduce((sum, c) => sum + (c.sleepHours || 0), 0) / weeklyCheckIns.filter(c => c.sleepHours).length
    : 0;

  return (
    <ScrollView style={styles.container}>
      {/* Header Stats */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Your Progress</Text>
        <Text style={styles.weekBadge}>Week {currentWeek} of 12</Text>
      </View>

      {/* Main Stats */}
      <View style={styles.statsGrid}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{weightLost.toFixed(1)}</Text>
          <Text style={styles.statUnit}>kg</Text>
          <Text style={styles.statLabel}>Lost</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{progress.totalSessionsCompleted}</Text>
          <Text style={styles.statLabel}>Sessions</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{progress.longestStreak}</Text>
          <Text style={styles.statLabel}>Best Streak</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{avgSleep.toFixed(1)}</Text>
          <Text style={styles.statUnit}>hrs</Text>
          <Text style={styles.statLabel}>Avg Sleep</Text>
        </View>
      </View>

      {/* Current Weight */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Weight Journey</Text>
        <View style={styles.weightCard}>
          <View style={styles.weightRow}>
            <View style={styles.weightItem}>
              <Text style={styles.weightValue}>{progress.startWeight}</Text>
              <Text style={styles.weightLabel}>Start</Text>
            </View>
            <View style={styles.weightArrow}>
              <Text style={styles.arrowText}>→</Text>
            </View>
            <View style={styles.weightItem}>
              <Text style={[styles.weightValue, styles.currentWeight]}>
                {progress.currentWeight}
              </Text>
              <Text style={styles.weightLabel}>Current</Text>
            </View>
            <View style={styles.weightArrow}>
              <Text style={styles.arrowText}>→</Text>
            </View>
            <View style={styles.weightItem}>
              <Text style={[styles.weightValue, styles.goalWeight]}>
                {progress.startWeight - 6}
              </Text>
              <Text style={styles.weightLabel}>Goal</Text>
            </View>
          </View>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                { width: `${Math.min((weightLost / 6) * 100, 100)}%` },
              ]}
            />
          </View>
          <Text style={styles.progressText}>
            {((weightLost / 6) * 100).toFixed(0)}% to goal
          </Text>
        </View>
      </View>

      {/* Strength Progress */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Strength Progress</Text>
        <View style={styles.strengthCard}>
          <View style={styles.strengthItem}>
            <Text style={styles.strengthIcon}>💪</Text>
            <Text style={styles.strengthTitle}>Push-ups</Text>
            <View style={styles.strengthNumbers}>
              <Text style={styles.strengthBaseline}>{progress.pushUpBaseline}</Text>
              <Text style={styles.strengthArrow}>→</Text>
              <Text style={styles.strengthCurrent}>{progress.currentPushUps}</Text>
            </View>
            <Text style={styles.strengthChange}>
              {progress.currentPushUps - progress.pushUpBaseline >= 0 ? '+' : ''}
              {progress.currentPushUps - progress.pushUpBaseline} reps
            </Text>
          </View>
          <View style={styles.strengthDivider} />
          <View style={styles.strengthItem}>
            <Text style={styles.strengthIcon}>🏋️</Text>
            <Text style={styles.strengthTitle}>Dead Hang</Text>
            <View style={styles.strengthNumbers}>
              <Text style={styles.strengthBaseline}>{progress.deadHangBaseline}s</Text>
              <Text style={styles.strengthArrow}>→</Text>
              <Text style={styles.strengthCurrent}>{progress.currentDeadHang}s</Text>
            </View>
            <Text style={styles.strengthChange}>
              {progress.currentDeadHang - progress.deadHangBaseline >= 0 ? '+' : ''}
              {progress.currentDeadHang - progress.deadHangBaseline} seconds
            </Text>
          </View>
        </View>
      </View>

      {/* Milestones */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>12-Week Milestones</Text>
        {milestones.map((milestone, index) => {
          const isComplete = currentWeek > milestone.week;
          const isCurrent = currentWeek <= milestone.week && (index === 0 || currentWeek > milestones[index - 1].week);

          return (
            <View
              key={milestone.week}
              style={[
                styles.milestoneCard,
                isComplete && styles.milestoneComplete,
                isCurrent && styles.milestoneCurrent,
              ]}
            >
              <View style={styles.milestoneHeader}>
                <Text style={styles.milestoneWeek}>Week {milestone.week}</Text>
                {isComplete && <Text style={styles.milestoneCheck}>✓</Text>}
                {isCurrent && <Text style={styles.milestoneBadge}>Current</Text>}
              </View>
              <Text style={styles.milestoneTarget}>
                Target: {milestone.weightLossTarget}
              </Text>
              <Text style={styles.milestoneSessions}>
                {milestone.sessionsTarget} sessions total
              </Text>
              <View style={styles.milestoneGoals}>
                {milestone.strengthGoals.map((goal, i) => (
                  <Text key={i} style={styles.milestoneGoal}>• {goal}</Text>
                ))}
              </View>
            </View>
          );
        })}
      </View>

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
    backgroundColor: COLORS.primary,
    paddingTop: 50,
    paddingBottom: 30,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  weekBadge: {
    marginTop: 10,
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 15,
    gap: 15,
    marginTop: -20,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: COLORS.card,
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  statNumber: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  statUnit: {
    fontSize: 14,
    color: COLORS.textLight,
    marginTop: -5,
  },
  statLabel: {
    fontSize: 14,
    color: COLORS.textLight,
    marginTop: 5,
  },
  section: {
    padding: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 15,
  },
  weightCard: {
    backgroundColor: COLORS.card,
    borderRadius: 15,
    padding: 20,
  },
  weightRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  weightItem: {
    alignItems: 'center',
  },
  weightValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  currentWeight: {
    color: COLORS.primary,
  },
  goalWeight: {
    color: COLORS.success,
  },
  weightLabel: {
    fontSize: 12,
    color: COLORS.textLight,
    marginTop: 5,
  },
  weightArrow: {
    paddingHorizontal: 10,
  },
  arrowText: {
    fontSize: 20,
    color: COLORS.textLight,
  },
  progressBar: {
    height: 10,
    backgroundColor: COLORS.border,
    borderRadius: 5,
    marginTop: 20,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.success,
    borderRadius: 5,
  },
  progressText: {
    textAlign: 'center',
    marginTop: 10,
    fontSize: 14,
    color: COLORS.textLight,
  },
  strengthCard: {
    backgroundColor: COLORS.card,
    borderRadius: 15,
    padding: 20,
    flexDirection: 'row',
  },
  strengthItem: {
    flex: 1,
    alignItems: 'center',
  },
  strengthIcon: {
    fontSize: 30,
    marginBottom: 10,
  },
  strengthTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 10,
  },
  strengthNumbers: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  strengthBaseline: {
    fontSize: 18,
    color: COLORS.textLight,
  },
  strengthArrow: {
    fontSize: 14,
    color: COLORS.textLight,
  },
  strengthCurrent: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  strengthChange: {
    fontSize: 12,
    color: COLORS.success,
    marginTop: 5,
  },
  strengthDivider: {
    width: 1,
    backgroundColor: COLORS.border,
    marginHorizontal: 15,
  },
  milestoneCard: {
    backgroundColor: COLORS.card,
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.border,
  },
  milestoneComplete: {
    borderLeftColor: COLORS.success,
    opacity: 0.7,
  },
  milestoneCurrent: {
    borderLeftColor: COLORS.primary,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
  },
  milestoneHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  milestoneWeek: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  milestoneCheck: {
    marginLeft: 10,
    fontSize: 18,
    color: COLORS.success,
  },
  milestoneBadge: {
    marginLeft: 10,
    backgroundColor: COLORS.primary,
    color: '#FFFFFF',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 10,
    fontSize: 12,
    fontWeight: '600',
  },
  milestoneTarget: {
    fontSize: 16,
    color: COLORS.text,
    marginBottom: 5,
  },
  milestoneSessions: {
    fontSize: 14,
    color: COLORS.textLight,
    marginBottom: 10,
  },
  milestoneGoals: {
    marginTop: 5,
  },
  milestoneGoal: {
    fontSize: 13,
    color: COLORS.textLight,
    paddingVertical: 2,
  },
  bottomPadding: {
    height: 40,
  },
});
