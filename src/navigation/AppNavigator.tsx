import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Text } from 'react-native';

import {
  TodayScreen,
  WorkoutScreen,
  ExerciseDetailScreen,
  SessionsScreen,
  CheckInScreen,
  ProgressScreen,
  SnacksScreen,
  SettingsScreen,
} from '../screens';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const COLORS = {
  primary: '#6C63FF',
  textLight: '#636E72',
};

const HomeStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Today" component={TodayScreen} />
    <Stack.Screen name="Workout" component={WorkoutScreen} />
    <Stack.Screen
      name="ExerciseDetail"
      component={ExerciseDetailScreen}
      options={{ headerShown: true, title: 'Exercise' }}
    />
    <Stack.Screen
      name="CheckIn"
      component={CheckInScreen}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="Sessions"
      component={SessionsScreen}
      options={{ headerShown: true, title: 'All Sessions' }}
    />
    <Stack.Screen
      name="Snacks"
      component={SnacksScreen}
      options={{ headerShown: true, title: 'Snack Ideas' }}
    />
  </Stack.Navigator>
);

const SessionsStack = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="SessionsList"
      component={SessionsScreen}
      options={{ title: 'Workouts' }}
    />
    <Stack.Screen name="Workout" component={WorkoutScreen} options={{ headerShown: false }} />
    <Stack.Screen
      name="ExerciseDetail"
      component={ExerciseDetailScreen}
      options={{ title: 'Exercise' }}
    />
  </Stack.Navigator>
);

const ProgressStack = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="ProgressMain"
      component={ProgressScreen}
      options={{ headerShown: false }}
    />
  </Stack.Navigator>
);

const SnacksStack = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="SnacksList"
      component={SnacksScreen}
      options={{ title: 'Snacks' }}
    />
  </Stack.Navigator>
);

const SettingsStack = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="SettingsMain"
      component={SettingsScreen}
      options={{ title: 'Settings' }}
    />
  </Stack.Navigator>
);

const TabIcon = ({ name, focused }: { name: string; focused: boolean }) => {
  const icons: { [key: string]: string } = {
    Home: '🏠',
    Workouts: '💪',
    Progress: '📊',
    Snacks: '🍎',
    Settings: '⚙️',
  };

  return (
    <Text style={{ fontSize: 24, opacity: focused ? 1 : 0.5 }}>
      {icons[name] || '📱'}
    </Text>
  );
};

export const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused }) => <TabIcon name={route.name} focused={focused} />,
          tabBarActiveTintColor: COLORS.primary,
          tabBarInactiveTintColor: COLORS.textLight,
          headerShown: false,
          tabBarStyle: {
            paddingTop: 5,
            paddingBottom: 5,
            height: 60,
          },
          tabBarLabelStyle: {
            fontSize: 11,
          },
        })}
      >
        <Tab.Screen name="Home" component={HomeStack} />
        <Tab.Screen name="Workouts" component={SessionsStack} />
        <Tab.Screen name="Progress" component={ProgressStack} />
        <Tab.Screen name="Snacks" component={SnacksStack} />
        <Tab.Screen name="Settings" component={SettingsStack} />
      </Tab.Navigator>
    </NavigationContainer>
  );
};
