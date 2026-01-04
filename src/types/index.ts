// Type definitions for Micro Workout App

export interface Exercise {
  id: number;
  name: string;
  category: 'Push' | 'Pull' | 'Legs' | 'Glutes' | 'Core' | 'Conditioning' | 'Mobility' | 'Pelvic Floor';
  setup: string;
  execution: string;
  keyCues: string;
  commonMistakes: string;
  regression: string;
  progression: string;
  videoUrl: string;
  notes: string;
}

export interface MicroSession {
  id: string;
  name: string;
  durationMinutes: 4 | 6 | 8 | 10;
  focus: string;
  exercises: string[]; // Exercise names
  notes: string;
}

export interface Snack {
  id: number;
  name: string;
  estimatedCalories: number;
  category: 'Protein' | 'Sweet' | 'Savoury' | 'Warm';
  notes: string;
}

export interface DailyCheckIn {
  date: string; // ISO date string
  weight?: number;
  sleepHours?: number;
  sleepQuality?: 1 | 2 | 3 | 4 | 5;
  proteinGoalMet?: boolean;
  proteinGrams?: number;
  waterLitres?: number;
  waterGoalMet?: boolean;
  foodNote?: string;
  cravingsNote?: string;
  hadCravings?: boolean;
}

export interface CompletedSession {
  id: string;
  sessionId: string;
  date: string;
  completedAt: string;
  durationMinutes: number;
}

export interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
}

export interface FreeSlot {
  start: Date;
  end: Date;
  durationMinutes: number;
}

export interface UserSettings {
  workingHoursStart: string; // "08:00"
  workingHoursEnd: string; // "18:30"
  minimumGapMinutes: number; // default 6
  bufferMinutes: number; // default 5
  maxPromptsPerDay: number; // default 4-6
  calendarConnected: boolean;
  useManualSchedule: boolean;
}

export interface Milestone {
  week: number;
  weightLossTarget: string;
  sessionsTarget: number;
  strengthGoals: string[];
}

export interface UserProgress {
  startWeight: number;
  currentWeight: number;
  startDate: string;
  currentStreak: number;
  longestStreak: number;
  totalSessionsCompleted: number;
  pushUpBaseline: number;
  currentPushUps: number;
  deadHangBaseline: number;
  currentDeadHang: number;
}
