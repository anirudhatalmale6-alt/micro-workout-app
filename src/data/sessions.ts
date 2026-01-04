import { MicroSession } from '../types';

export const microSessions: MicroSession[] = [
  // 4-MINUTE SESSIONS
  {
    id: 'S1',
    name: 'Quick Push Core',
    durationMinutes: 4,
    focus: 'Push/Core',
    exercises: ['Incline Push-Ups', 'Forearm Plank'],
    notes: '30s per exercise x2',
  },
  {
    id: 'S2',
    name: 'Desk Mobility Reset',
    durationMinutes: 4,
    focus: 'Mobility',
    exercises: ['Cat Cow', 'Thoracic Open Book', 'Neck Mobility Flow'],
    notes: 'Slow breathing',
  },
  {
    id: 'S3',
    name: 'Pull Bar Primer',
    durationMinutes: 4,
    focus: 'Pull',
    exercises: ['Dead Hang', 'Scapular Pull-Ups'],
    notes: 'Grip focus',
  },
  {
    id: 'S4',
    name: 'Glute Wake-Up',
    durationMinutes: 4,
    focus: 'Glutes',
    exercises: ['Glute Bridges', 'Bodyweight Squats'],
    notes: 'Controlled tempo',
  },
  // 6-MINUTE SESSIONS
  {
    id: 'S5',
    name: 'Push Strength',
    durationMinutes: 6,
    focus: 'Push',
    exercises: ['Knee Push-Ups', 'Push-Up Hold Bottom', 'Push-Up Shoulder Taps'],
    notes: '40s work 20s rest',
  },
  {
    id: 'S6',
    name: 'Leg Burner',
    durationMinutes: 6,
    focus: 'Legs',
    exercises: ['Reverse Lunges', 'Wall Sit', 'Calf Raises'],
    notes: 'Minimal rest',
  },
  {
    id: 'S7',
    name: 'Core Stability',
    durationMinutes: 6,
    focus: 'Core',
    exercises: ['Dead Bug', 'Side Plank', 'Heel Taps'],
    notes: 'Slow control',
  },
  {
    id: 'S8',
    name: 'Pelvic Floor Flow',
    durationMinutes: 6,
    focus: 'Pelvic Floor',
    exercises: ['Diaphragmatic Breathing Supine', 'Pelvic Floor Relaxation Cycles', 'Childs Pose Breathing'],
    notes: 'Relaxation emphasis',
  },
  // 8-MINUTE SESSIONS
  {
    id: 'S9',
    name: 'Upper Body Mix',
    durationMinutes: 8,
    focus: 'Push/Pull',
    exercises: ['Incline Push-Ups', 'Active Hang', 'Pike Push-Ups', 'Dead Hang'],
    notes: 'Alternate push pull',
  },
  {
    id: 'S10',
    name: 'Lower Body Strength',
    durationMinutes: 8,
    focus: 'Legs',
    exercises: ['Split Squats', 'Tempo Squats', 'Single-Leg Calf Raises'],
    notes: 'Strength focus',
  },
  {
    id: 'S11',
    name: 'Core Control',
    durationMinutes: 8,
    focus: 'Core',
    exercises: ['Forearm Plank', 'Bird Dog', 'Hollow Body Hold', 'Side Plank'],
    notes: 'No rushing',
  },
  {
    id: 'S12',
    name: 'Desk Mobility Plus',
    durationMinutes: 8,
    focus: 'Mobility',
    exercises: ['Hip Flexor Stretch', '90-90 Hip Switches', 'Hamstring Flossing', 'Thoracic Open Book'],
    notes: 'Breath led',
  },
  // 10-MINUTE SESSIONS
  {
    id: 'S13',
    name: 'Full Body Density',
    durationMinutes: 10,
    focus: 'Full Body',
    exercises: ['Bodyweight Squats', 'Standard Push-Ups', 'Mountain Climbers', 'Glute Bridges', 'High Plank'],
    notes: '2 rounds',
  },
  {
    id: 'S14',
    name: 'Pull Focus',
    durationMinutes: 10,
    focus: 'Pull',
    exercises: ['Dead Hang', 'Scapular Pull-Ups', 'Negative Pull-Ups', 'Chin Over Bar Hold'],
    notes: 'Quality reps',
  },
  {
    id: 'S15',
    name: 'Legs and Conditioning',
    durationMinutes: 10,
    focus: 'Legs',
    exercises: ['Reverse Lunges', 'Low-Impact Squat Pulses', 'Marching in Place', 'Wall Sit'],
    notes: 'Moderate HR',
  },
  {
    id: 'S16',
    name: 'Recovery Flow',
    durationMinutes: 10,
    focus: 'Recovery',
    exercises: ['Cat Cow', 'Hip Flexor Stretch', 'Childs Pose Breathing', 'Neck Mobility Flow'],
    notes: 'End of day',
  },
];

export const getSessionsByDuration = (duration: 4 | 6 | 8 | 10): MicroSession[] => {
  return microSessions.filter(s => s.durationMinutes === duration);
};

export const getSessionById = (id: string): MicroSession | undefined => {
  return microSessions.find(s => s.id === id);
};

export const getSuggestedSession = (availableMinutes: number): MicroSession | undefined => {
  // Find the longest session that fits in the available time
  const validDurations = [10, 8, 6, 4].filter(d => d <= availableMinutes);
  if (validDurations.length === 0) return undefined;

  const targetDuration = validDurations[0] as 4 | 6 | 8 | 10;
  const sessions = getSessionsByDuration(targetDuration);

  // Return a random session of appropriate duration
  return sessions[Math.floor(Math.random() * sessions.length)];
};
