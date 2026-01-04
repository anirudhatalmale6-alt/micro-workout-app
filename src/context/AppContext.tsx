import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  DailyCheckIn,
  CompletedSession,
  UserSettings,
  UserProgress,
  CalendarEvent,
  FreeSlot,
} from '../types';

interface AppState {
  // Settings
  settings: UserSettings;
  updateSettings: (settings: Partial<UserSettings>) => void;

  // Progress
  progress: UserProgress;
  updateProgress: (progress: Partial<UserProgress>) => void;

  // Check-ins
  checkIns: DailyCheckIn[];
  addCheckIn: (checkIn: DailyCheckIn) => void;
  getTodayCheckIn: () => DailyCheckIn | undefined;

  // Completed Sessions
  completedSessions: CompletedSession[];
  addCompletedSession: (session: CompletedSession) => void;
  getSessionsThisWeek: () => CompletedSession[];
  getCurrentStreak: () => number;

  // Calendar
  calendarEvents: CalendarEvent[];
  setCalendarEvents: (events: CalendarEvent[]) => void;
  manualSchedule: { start: string; end: string }[];
  setManualSchedule: (schedule: { start: string; end: string }[]) => void;
  getFreeSlots: () => FreeSlot[];

  // Loading state
  isLoading: boolean;
}

const defaultSettings: UserSettings = {
  workingHoursStart: '08:00',
  workingHoursEnd: '18:30',
  minimumGapMinutes: 6,
  bufferMinutes: 5,
  maxPromptsPerDay: 5,
  calendarConnected: false,
  useManualSchedule: true,
};

const defaultProgress: UserProgress = {
  startWeight: 86,
  currentWeight: 86,
  startDate: new Date().toISOString().split('T')[0],
  currentStreak: 0,
  longestStreak: 0,
  totalSessionsCompleted: 0,
  pushUpBaseline: 0,
  currentPushUps: 0,
  deadHangBaseline: 0,
  currentDeadHang: 0,
};

const AppContext = createContext<AppState | undefined>(undefined);

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [settings, setSettings] = useState<UserSettings>(defaultSettings);
  const [progress, setProgress] = useState<UserProgress>(defaultProgress);
  const [checkIns, setCheckIns] = useState<DailyCheckIn[]>([]);
  const [completedSessions, setCompletedSessions] = useState<CompletedSession[]>([]);
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>([]);
  const [manualSchedule, setManualSchedule] = useState<{ start: string; end: string }[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load data from storage on mount
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [
        savedSettings,
        savedProgress,
        savedCheckIns,
        savedSessions,
        savedSchedule,
      ] = await Promise.all([
        AsyncStorage.getItem('settings'),
        AsyncStorage.getItem('progress'),
        AsyncStorage.getItem('checkIns'),
        AsyncStorage.getItem('completedSessions'),
        AsyncStorage.getItem('manualSchedule'),
      ]);

      if (savedSettings) setSettings(JSON.parse(savedSettings));
      if (savedProgress) setProgress(JSON.parse(savedProgress));
      if (savedCheckIns) setCheckIns(JSON.parse(savedCheckIns));
      if (savedSessions) setCompletedSessions(JSON.parse(savedSessions));
      if (savedSchedule) setManualSchedule(JSON.parse(savedSchedule));
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveData = async (key: string, data: any) => {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.error('Error saving data:', error);
    }
  };

  const updateSettings = (newSettings: Partial<UserSettings>) => {
    const updated = { ...settings, ...newSettings };
    setSettings(updated);
    saveData('settings', updated);
  };

  const updateProgress = (newProgress: Partial<UserProgress>) => {
    const updated = { ...progress, ...newProgress };
    setProgress(updated);
    saveData('progress', updated);
  };

  const addCheckIn = (checkIn: DailyCheckIn) => {
    // Replace existing check-in for the same day or add new
    const existingIndex = checkIns.findIndex(c => c.date === checkIn.date);
    let updated: DailyCheckIn[];
    if (existingIndex >= 0) {
      updated = [...checkIns];
      updated[existingIndex] = checkIn;
    } else {
      updated = [...checkIns, checkIn];
    }
    setCheckIns(updated);
    saveData('checkIns', updated);

    // Update current weight if provided
    if (checkIn.weight) {
      updateProgress({ currentWeight: checkIn.weight });
    }
  };

  const getTodayCheckIn = (): DailyCheckIn | undefined => {
    const today = new Date().toISOString().split('T')[0];
    return checkIns.find(c => c.date === today);
  };

  const addCompletedSession = (session: CompletedSession) => {
    const updated = [...completedSessions, session];
    setCompletedSessions(updated);
    saveData('completedSessions', updated);

    // Update streak and total
    const newStreak = calculateStreak(updated);
    updateProgress({
      totalSessionsCompleted: updated.length,
      currentStreak: newStreak,
      longestStreak: Math.max(progress.longestStreak, newStreak),
    });
  };

  const calculateStreak = (sessions: CompletedSession[]): number => {
    if (sessions.length === 0) return 0;

    const sortedDates = [...new Set(sessions.map(s => s.date))].sort().reverse();
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

    // Check if there's activity today or yesterday
    if (sortedDates[0] !== today && sortedDates[0] !== yesterday) {
      return 0;
    }

    let streak = 1;
    for (let i = 1; i < sortedDates.length; i++) {
      const current = new Date(sortedDates[i - 1]);
      const prev = new Date(sortedDates[i]);
      const diffDays = (current.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24);

      if (diffDays === 1) {
        streak++;
      } else {
        break;
      }
    }

    return streak;
  };

  const getSessionsThisWeek = (): CompletedSession[] => {
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    return completedSessions.filter(s => new Date(s.date) >= startOfWeek);
  };

  const getCurrentStreak = (): number => {
    return progress.currentStreak;
  };

  const getFreeSlots = (): FreeSlot[] => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    // Parse working hours
    const [startHour, startMin] = settings.workingHoursStart.split(':').map(Number);
    const [endHour, endMin] = settings.workingHoursEnd.split(':').map(Number);

    const workStart = new Date(today);
    workStart.setHours(startHour, startMin, 0, 0);

    const workEnd = new Date(today);
    workEnd.setHours(endHour, endMin, 0, 0);

    // Get blocked times (either from calendar or manual schedule)
    let blockedTimes: { start: Date; end: Date }[] = [];

    if (settings.calendarConnected && calendarEvents.length > 0) {
      blockedTimes = calendarEvents
        .filter(e => {
          const eventDate = new Date(e.start);
          return eventDate.toDateString() === today.toDateString();
        })
        .map(e => ({
          start: new Date(e.start),
          end: new Date(e.end),
        }));
    } else if (manualSchedule.length > 0) {
      blockedTimes = manualSchedule.map(slot => {
        const [sHour, sMin] = slot.start.split(':').map(Number);
        const [eHour, eMin] = slot.end.split(':').map(Number);

        const start = new Date(today);
        start.setHours(sHour, sMin, 0, 0);

        const end = new Date(today);
        end.setHours(eHour, eMin, 0, 0);

        return { start, end };
      });
    }

    // Add buffer around meetings
    const bufferedBlocks = blockedTimes.map(block => ({
      start: new Date(block.start.getTime() - settings.bufferMinutes * 60000),
      end: new Date(block.end.getTime() + settings.bufferMinutes * 60000),
    }));

    // Sort by start time
    bufferedBlocks.sort((a, b) => a.start.getTime() - b.start.getTime());

    // Find free slots
    const freeSlots: FreeSlot[] = [];
    let currentTime = new Date(Math.max(workStart.getTime(), now.getTime()));

    for (const block of bufferedBlocks) {
      if (block.start > currentTime && block.start <= workEnd) {
        const gapMinutes = (block.start.getTime() - currentTime.getTime()) / 60000;
        if (gapMinutes >= settings.minimumGapMinutes) {
          freeSlots.push({
            start: new Date(currentTime),
            end: new Date(block.start),
            durationMinutes: Math.floor(gapMinutes),
          });
        }
      }
      currentTime = new Date(Math.max(currentTime.getTime(), block.end.getTime()));
    }

    // Check for slot after last meeting
    if (currentTime < workEnd) {
      const gapMinutes = (workEnd.getTime() - currentTime.getTime()) / 60000;
      if (gapMinutes >= settings.minimumGapMinutes) {
        freeSlots.push({
          start: new Date(currentTime),
          end: new Date(workEnd),
          durationMinutes: Math.floor(gapMinutes),
        });
      }
    }

    return freeSlots;
  };

  const value: AppState = {
    settings,
    updateSettings,
    progress,
    updateProgress,
    checkIns,
    addCheckIn,
    getTodayCheckIn,
    completedSessions,
    addCompletedSession,
    getSessionsThisWeek,
    getCurrentStreak,
    calendarEvents,
    setCalendarEvents,
    manualSchedule,
    setManualSchedule: (schedule) => {
      setManualSchedule(schedule);
      saveData('manualSchedule', schedule);
    },
    getFreeSlots,
    isLoading,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
