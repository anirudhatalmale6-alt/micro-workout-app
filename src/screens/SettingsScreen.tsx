import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Switch,
} from 'react-native';
import { useAppContext } from '../context/AppContext';

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

export const SettingsScreen: React.FC = () => {
  const {
    settings,
    updateSettings,
    progress,
    updateProgress,
    manualSchedule,
    setManualSchedule,
  } = useAppContext();

  const [workingHoursStart, setWorkingHoursStart] = useState(settings.workingHoursStart);
  const [workingHoursEnd, setWorkingHoursEnd] = useState(settings.workingHoursEnd);
  const [minimumGap, setMinimumGap] = useState(settings.minimumGapMinutes.toString());
  const [buffer, setBuffer] = useState(settings.bufferMinutes.toString());
  const [maxPrompts, setMaxPrompts] = useState(settings.maxPromptsPerDay.toString());

  // Progress settings
  const [startWeight, setStartWeight] = useState(progress.startWeight.toString());
  const [pushUpBaseline, setPushUpBaseline] = useState(progress.pushUpBaseline.toString());
  const [deadHangBaseline, setDeadHangBaseline] = useState(progress.deadHangBaseline.toString());
  const [currentPushUps, setCurrentPushUps] = useState(progress.currentPushUps.toString());
  const [currentDeadHang, setCurrentDeadHang] = useState(progress.currentDeadHang.toString());

  // Manual schedule
  const [newMeetingStart, setNewMeetingStart] = useState('');
  const [newMeetingEnd, setNewMeetingEnd] = useState('');

  const saveScheduleSettings = () => {
    updateSettings({
      workingHoursStart,
      workingHoursEnd,
      minimumGapMinutes: parseInt(minimumGap) || 6,
      bufferMinutes: parseInt(buffer) || 5,
      maxPromptsPerDay: parseInt(maxPrompts) || 5,
    });
    Alert.alert('Saved', 'Schedule settings updated');
  };

  const saveProgressSettings = () => {
    updateProgress({
      startWeight: parseFloat(startWeight) || 86,
      pushUpBaseline: parseInt(pushUpBaseline) || 0,
      deadHangBaseline: parseInt(deadHangBaseline) || 0,
      currentPushUps: parseInt(currentPushUps) || 0,
      currentDeadHang: parseInt(currentDeadHang) || 0,
    });
    Alert.alert('Saved', 'Progress settings updated');
  };

  const addMeeting = () => {
    if (!newMeetingStart || !newMeetingEnd) {
      Alert.alert('Error', 'Please enter both start and end times (HH:MM format)');
      return;
    }

    const timeRegex = /^([01]?[0-9]|2[0-3]):([0-5][0-9])$/;
    if (!timeRegex.test(newMeetingStart) || !timeRegex.test(newMeetingEnd)) {
      Alert.alert('Error', 'Please use HH:MM format (e.g., 09:00)');
      return;
    }

    setManualSchedule([...manualSchedule, { start: newMeetingStart, end: newMeetingEnd }]);
    setNewMeetingStart('');
    setNewMeetingEnd('');
  };

  const removeMeeting = (index: number) => {
    const updated = manualSchedule.filter((_, i) => i !== index);
    setManualSchedule(updated);
  };

  const resetStartDate = () => {
    Alert.alert(
      'Reset Programme',
      'This will reset your start date to today. Are you sure?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: () => {
            updateProgress({
              startDate: new Date().toISOString().split('T')[0],
              currentStreak: 0,
              totalSessionsCompleted: 0,
            });
          },
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      {/* Schedule Settings */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Schedule Settings</Text>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Working Hours</Text>
          <View style={styles.timeRow}>
            <TextInput
              style={styles.timeInput}
              value={workingHoursStart}
              onChangeText={setWorkingHoursStart}
              placeholder="08:00"
              placeholderTextColor={COLORS.textLight}
            />
            <Text style={styles.timeSeparator}>to</Text>
            <TextInput
              style={styles.timeInput}
              value={workingHoursEnd}
              onChangeText={setWorkingHoursEnd}
              placeholder="18:30"
              placeholderTextColor={COLORS.textLight}
            />
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Minimum Gap (minutes)</Text>
          <TextInput
            style={styles.numberInput}
            value={minimumGap}
            onChangeText={setMinimumGap}
            keyboardType="number-pad"
            placeholder="6"
            placeholderTextColor={COLORS.textLight}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Buffer Around Meetings (minutes)</Text>
          <TextInput
            style={styles.numberInput}
            value={buffer}
            onChangeText={setBuffer}
            keyboardType="number-pad"
            placeholder="5"
            placeholderTextColor={COLORS.textLight}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Max Session Prompts Per Day</Text>
          <TextInput
            style={styles.numberInput}
            value={maxPrompts}
            onChangeText={setMaxPrompts}
            keyboardType="number-pad"
            placeholder="5"
            placeholderTextColor={COLORS.textLight}
          />
        </View>

        <TouchableOpacity style={styles.saveButton} onPress={saveScheduleSettings}>
          <Text style={styles.saveButtonText}>Save Schedule Settings</Text>
        </TouchableOpacity>
      </View>

      {/* Manual Schedule */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Today's Meetings (Manual)</Text>
        <Text style={styles.sectionSubtitle}>
          Add your meetings to find free workout slots
        </Text>

        {manualSchedule.length > 0 && (
          <View style={styles.meetingsList}>
            {manualSchedule.map((meeting, index) => (
              <View key={index} style={styles.meetingItem}>
                <Text style={styles.meetingTime}>
                  {meeting.start} - {meeting.end}
                </Text>
                <TouchableOpacity onPress={() => removeMeeting(index)}>
                  <Text style={styles.removeButton}>✕</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}

        <View style={styles.addMeetingRow}>
          <TextInput
            style={styles.meetingTimeInput}
            value={newMeetingStart}
            onChangeText={setNewMeetingStart}
            placeholder="Start (09:00)"
            placeholderTextColor={COLORS.textLight}
          />
          <Text style={styles.timeSeparator}>-</Text>
          <TextInput
            style={styles.meetingTimeInput}
            value={newMeetingEnd}
            onChangeText={setNewMeetingEnd}
            placeholder="End (10:00)"
            placeholderTextColor={COLORS.textLight}
          />
          <TouchableOpacity style={styles.addButton} onPress={addMeeting}>
            <Text style={styles.addButtonText}>Add</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Progress Settings */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Progress Settings</Text>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Starting Weight (kg)</Text>
          <TextInput
            style={styles.numberInput}
            value={startWeight}
            onChangeText={setStartWeight}
            keyboardType="decimal-pad"
            placeholder="86"
            placeholderTextColor={COLORS.textLight}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Push-up Baseline (reps)</Text>
          <View style={styles.twoColumnRow}>
            <View style={styles.halfColumn}>
              <Text style={styles.subLabel}>Baseline</Text>
              <TextInput
                style={styles.numberInput}
                value={pushUpBaseline}
                onChangeText={setPushUpBaseline}
                keyboardType="number-pad"
                placeholder="0"
                placeholderTextColor={COLORS.textLight}
              />
            </View>
            <View style={styles.halfColumn}>
              <Text style={styles.subLabel}>Current</Text>
              <TextInput
                style={styles.numberInput}
                value={currentPushUps}
                onChangeText={setCurrentPushUps}
                keyboardType="number-pad"
                placeholder="0"
                placeholderTextColor={COLORS.textLight}
              />
            </View>
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Dead Hang (seconds)</Text>
          <View style={styles.twoColumnRow}>
            <View style={styles.halfColumn}>
              <Text style={styles.subLabel}>Baseline</Text>
              <TextInput
                style={styles.numberInput}
                value={deadHangBaseline}
                onChangeText={setDeadHangBaseline}
                keyboardType="number-pad"
                placeholder="0"
                placeholderTextColor={COLORS.textLight}
              />
            </View>
            <View style={styles.halfColumn}>
              <Text style={styles.subLabel}>Current</Text>
              <TextInput
                style={styles.numberInput}
                value={currentDeadHang}
                onChangeText={setCurrentDeadHang}
                keyboardType="number-pad"
                placeholder="0"
                placeholderTextColor={COLORS.textLight}
              />
            </View>
          </View>
        </View>

        <TouchableOpacity style={styles.saveButton} onPress={saveProgressSettings}>
          <Text style={styles.saveButtonText}>Save Progress Settings</Text>
        </TouchableOpacity>
      </View>

      {/* Reset */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Programme Reset</Text>
        <TouchableOpacity style={styles.dangerButton} onPress={resetStartDate}>
          <Text style={styles.dangerButtonText}>Reset 12-Week Programme</Text>
        </TouchableOpacity>
        <Text style={styles.dangerWarning}>
          This will reset your start date to today
        </Text>
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
  section: {
    backgroundColor: COLORS.card,
    marginHorizontal: 15,
    marginTop: 15,
    borderRadius: 15,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 5,
  },
  sectionSubtitle: {
    fontSize: 13,
    color: COLORS.textLight,
    marginBottom: 15,
  },
  inputGroup: {
    marginTop: 15,
  },
  inputLabel: {
    fontSize: 14,
    color: COLORS.textLight,
    marginBottom: 8,
  },
  subLabel: {
    fontSize: 12,
    color: COLORS.textLight,
    marginBottom: 5,
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeInput: {
    flex: 1,
    backgroundColor: COLORS.background,
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    color: COLORS.text,
    textAlign: 'center',
  },
  timeSeparator: {
    marginHorizontal: 10,
    color: COLORS.textLight,
    fontSize: 16,
  },
  numberInput: {
    backgroundColor: COLORS.background,
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    color: COLORS.text,
  },
  twoColumnRow: {
    flexDirection: 'row',
    gap: 15,
  },
  halfColumn: {
    flex: 1,
  },
  saveButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 20,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  meetingsList: {
    marginBottom: 15,
  },
  meetingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 12,
    marginBottom: 8,
  },
  meetingTime: {
    fontSize: 16,
    color: COLORS.text,
  },
  removeButton: {
    fontSize: 18,
    color: COLORS.secondary,
    paddingHorizontal: 10,
  },
  addMeetingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  meetingTimeInput: {
    flex: 1,
    backgroundColor: COLORS.background,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 12,
    fontSize: 14,
    color: COLORS.text,
  },
  addButton: {
    backgroundColor: COLORS.success,
    borderRadius: 10,
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  dangerButton: {
    backgroundColor: COLORS.secondary,
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 10,
  },
  dangerButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  dangerWarning: {
    fontSize: 12,
    color: COLORS.textLight,
    textAlign: 'center',
    marginTop: 10,
  },
  bottomPadding: {
    height: 40,
  },
});
