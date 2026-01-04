# Micro Workout App

A 12-week micro-workout programme app designed for desk-bound workers. The app suggests short exercise sessions (4-10 minutes) between meetings to help with:
- Fat loss
- Bodyweight strength
- Mobility
- Pelvic floor health

## Features

- **Calendar-Aware Scheduling**: Add your meetings manually and the app finds free slots for workouts
- **60 Exercises**: Full library with instructions, cues, and YouTube video links
- **16 Pre-built Sessions**: 4/6/8/10 minute workouts across Push, Pull, Legs, Core, Mobility, and Pelvic Floor categories
- **Workout Timer**: Built-in timer with exercise progression and vibration alerts
- **Daily Check-in**: Track weight, sleep, protein, water, and cravings
- **Progress Dashboard**: View milestones for weeks 4, 8, and 12
- **20 Snack Ideas**: All under 200 calories to curb cravings

## Build Instructions

### Prerequisites
- Node.js 18+
- npm or yarn
- Expo CLI

### Development
```bash
cd MicroWorkout
npm install
npx expo start
```

### Build APK (using EAS)
```bash
npx eas build --platform android --profile preview
```

### Build APK Locally
```bash
npx expo prebuild
cd android
./gradlew assembleRelease
```

## Project Structure
```
src/
├── context/       # App state management
├── data/          # Exercise, session, snack data
├── navigation/    # React Navigation setup
├── screens/       # All app screens
├── types/         # TypeScript definitions
└── utils/         # Helper functions
```

## Configuration

Settings can be adjusted in the app:
- Working hours (default: 08:00-18:30)
- Minimum gap between meetings (default: 6 min)
- Buffer around meetings (default: 5 min)
- Max workout prompts per day (default: 5)

## Data Storage

All data is stored locally on device using AsyncStorage:
- Daily check-ins
- Completed sessions
- User progress
- Settings

## Video Content Note

The YouTube video links provided require verification of Creative Commons licensing before production use.
