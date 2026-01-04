import { Milestone } from '../types';

export const milestones: Milestone[] = [
  {
    week: 4,
    weightLossTarget: '-1.5 to -2.0 kg',
    sessionsTarget: 16, // ~4 per week
    strengthGoals: [
      'Push-ups: +5 reps from baseline',
      'Dead hang: +10 seconds',
      'Establish consistent routine',
    ],
  },
  {
    week: 8,
    weightLossTarget: '-3.5 to -4.5 kg',
    sessionsTarget: 32, // cumulative
    strengthGoals: [
      'Push-ups: +10 reps from baseline',
      'Dead hang: +20 seconds',
      'Complete first negative pull-up',
    ],
  },
  {
    week: 12,
    weightLossTarget: '-6.0 kg',
    sessionsTarget: 48, // cumulative
    strengthGoals: [
      'Push-ups: +15 reps from baseline',
      'Dead hang: +30 seconds',
      'First full pull-up (or 5-second controlled negative)',
    ],
  },
];

export const getCurrentMilestone = (weekNumber: number): Milestone | undefined => {
  if (weekNumber <= 4) return milestones[0];
  if (weekNumber <= 8) return milestones[1];
  if (weekNumber <= 12) return milestones[2];
  return undefined;
};

export const getWeekNumber = (startDate: string): number => {
  const start = new Date(startDate);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - start.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return Math.min(Math.ceil(diffDays / 7), 12);
};
