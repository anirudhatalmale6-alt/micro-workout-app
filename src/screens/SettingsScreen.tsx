import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useAppContext } from '../context/AppContext';
import {
  useOutlookAuth,
  exchangeCodeForTokens,
  isAuthenticated,
  clearTokens,
  fetchCalendarEvents,
  getRedirectUri,
} from '../utils/microsoftAuth';

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
    setCalendarEvents,
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

  // Calendar auth state
  const [isCalendarConnected, setIsCalendarConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  const { request, response, promptAsync, error: authError } = useOutlookAuth();

  // Check auth status on mount
  useEffect(() => {
    checkAuthStatus();
  }, []);

  // Handle OAuth response
  useEffect(() => {
    if (response?.type === 'success' && response.params.code) {
      handleAuthResponse(response.params.code, request?.codeVerifier || '');
    } else if (response?.type === 'error') {
      setIsConnecting(false);
      Alert.alert('Error', 'Failed to connect to Outlook. Please try again.');
    }
  }, [response]);

  const checkAuthStatus = async () => {
    const authenticated = await isAuthenticated();
    setIsCalendarConnected(authenticated);
    if (authenticated) {
      updateSettings({ calendarConnected: true, useManualSchedule: false });
    }
  };

  const handleAuthResponse = async (code: string, codeVerifier: string) => {
    try {
      const tokens = await exchangeCodeForTokens(code, codeVerifier);
      if (tokens) {
        setIsCalendarConnected(true);
        updateSettings({ calendarConnected: true, useManualSchedule: false });
        Alert.alert('Success', 'Outlook calendar connected! Your meetings will now sync automatically.');
        syncCalendar();
      } else {
        Alert.alert('Error', 'Failed to complete authentication.');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to connect calendar.');
    } finally {
      setIsConnecting(false);
    }
  };

  const connectOutlook = async () => {
    setIsConnecting(true);
    try {
      await promptAsync();
    } catch (error) {
      setIsConnecting(false);
      Alert.alert('Error', 'Failed to start authentication.');
    }
  };

  const disconnectOutlook = async () => {
    Alert.alert(
      'Disconnect Calendar',
      'Are you sure you want to disconnect your Outlook calendar?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Disconnect',
          style: 'destructive',
          onPress: async () => {
            await clearTokens();
            setIsCalendarConnected(false);
            updateSettings({ calendarConnected: false, useManualSchedule: true });
            setCalendarEvents([]);
          },
        },
      ]
    );
  };

  const syncCalendar = async () => {
    setIsSyncing(true);
    try {
      const events = await fetchCalendarEvents(new Date());
      setCalendarEvents(events);
      Alert.alert('Synced', `Found ${events.length} events for today.`);
    } catch (error) {
      Alert.alert('Error', 'Failed to sync calendar. Please try reconnecting.');
    } finally {
      setIsSyncing(false);
    }
  };

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
      {/* Outlook Calendar Integration */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Outlook Calendar</Text>
        <Text style={styles.sectionSubtitle}>
          Connect your calendar to automatically find free workout slots
        </Text>

        {isCalendarConnected ? (
          <View>
            <View style={styles.connectedBadge}>
              <Text style={styles.connectedText}>✓ Connected to Outlook</Text>
            </View>
            <View style={styles.calendarActions}>
              <TouchableOpacity
                style={styles.syncButton}
                onPress={syncCalendar}
                disabled={isSyncing}
              >
                {isSyncing ? (
                  <ActivityIndicator color="#FFFFFF" size="small" />
                ) : (
                  <Text style={styles.syncButtonText}>Sync Now</Text>
                )}
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.disconnectButton}
                onPress={disconnectOutlook}
              >
                <Text style={styles.disconnectButtonText}>Disconnect</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : authError ? (
          <View style={styles.errorBadge}>
            <Text style={styles.errorText}>{authError}</Text>
            <Text style={styles.errorSubtext}>You can still add meetings manually below</Text>
          </View>
        ) : (
          <TouchableOpacity
            style={styles.connectButton}
            onPress={connectOutlook}
            disabled={isConnecting || !request}
          >
            {isConnecting ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <Text style={styles.connectButtonText}>Connect Outlook Calendar</Text>
            )}
          </TouchableOpacity>
        )}
      </View>

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

      {/* Manual Schedule - only show if not connected to calendar */}
      {!isCalendarConnected && (
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
      )}

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
  // Calendar connection styles
  connectButton: {
    backgroundColor: '#0078D4', // Microsoft blue
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  connectButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  connectedBadge: {
    backgroundColor: '#E8F5E9',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 15,
    marginBottom: 15,
  },
  connectedText: {
    color: '#2E7D32',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  calendarActions: {
    flexDirection: 'row',
    gap: 10,
  },
  syncButton: {
    flex: 1,
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
  },
  syncButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  disconnectButton: {
    flex: 1,
    backgroundColor: COLORS.background,
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.secondary,
  },
  disconnectButtonText: {
    color: COLORS.secondary,
    fontWeight: 'bold',
  },
  errorBadge: {
    backgroundColor: '#FFF3E0',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 15,
  },
  errorText: {
    color: '#E65100',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  errorSubtext: {
    color: '#FF8A65',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 5,
  },
});
