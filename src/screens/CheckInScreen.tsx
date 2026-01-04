import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAppContext } from '../context/AppContext';
import { DailyCheckIn } from '../types';

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

export const CheckInScreen: React.FC = () => {
  const navigation = useNavigation();
  const { addCheckIn, getTodayCheckIn, progress } = useAppContext();

  const today = new Date().toISOString().split('T')[0];
  const existingCheckIn = getTodayCheckIn();

  const [weight, setWeight] = useState(existingCheckIn?.weight?.toString() || '');
  const [sleepHours, setSleepHours] = useState(existingCheckIn?.sleepHours?.toString() || '');
  const [sleepQuality, setSleepQuality] = useState<number>(existingCheckIn?.sleepQuality || 3);
  const [proteinGoalMet, setProteinGoalMet] = useState(existingCheckIn?.proteinGoalMet || false);
  const [proteinGrams, setProteinGrams] = useState(existingCheckIn?.proteinGrams?.toString() || '');
  const [waterLitres, setWaterLitres] = useState(existingCheckIn?.waterLitres?.toString() || '');
  const [waterGoalMet, setWaterGoalMet] = useState(existingCheckIn?.waterGoalMet || false);
  const [foodNote, setFoodNote] = useState(existingCheckIn?.foodNote || '');
  const [hadCravings, setHadCravings] = useState(existingCheckIn?.hadCravings || false);
  const [cravingsNote, setCravingsNote] = useState(existingCheckIn?.cravingsNote || '');

  const handleSave = () => {
    const checkIn: DailyCheckIn = {
      date: today,
      weight: weight ? parseFloat(weight) : undefined,
      sleepHours: sleepHours ? parseFloat(sleepHours) : undefined,
      sleepQuality: sleepQuality as 1 | 2 | 3 | 4 | 5,
      proteinGoalMet,
      proteinGrams: proteinGrams ? parseInt(proteinGrams) : undefined,
      waterLitres: waterLitres ? parseFloat(waterLitres) : undefined,
      waterGoalMet,
      foodNote,
      hadCravings,
      cravingsNote,
    };

    addCheckIn(checkIn);
    Alert.alert('Saved!', 'Your daily check-in has been recorded.', [
      { text: 'OK', onPress: () => navigation.goBack() },
    ]);
  };

  const formatDate = (dateStr: string): string => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-GB', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
    });
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Daily Check-in</Text>
        <Text style={styles.date}>{formatDate(today)}</Text>
      </View>

      {/* Weight */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Weight (kg)</Text>
        <View style={styles.inputRow}>
          <TextInput
            style={styles.numberInput}
            value={weight}
            onChangeText={setWeight}
            keyboardType="decimal-pad"
            placeholder={progress.currentWeight.toString()}
            placeholderTextColor={COLORS.textLight}
          />
          <Text style={styles.inputLabel}>kg</Text>
        </View>
        {weight && progress.startWeight && (
          <Text style={styles.weightChange}>
            {parseFloat(weight) - progress.startWeight >= 0 ? '+' : ''}
            {(parseFloat(weight) - progress.startWeight).toFixed(1)} kg from start
          </Text>
        )}
      </View>

      {/* Sleep */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Sleep</Text>
        <View style={styles.inputRow}>
          <TextInput
            style={styles.numberInput}
            value={sleepHours}
            onChangeText={setSleepHours}
            keyboardType="decimal-pad"
            placeholder="8"
            placeholderTextColor={COLORS.textLight}
          />
          <Text style={styles.inputLabel}>hours</Text>
        </View>

        <Text style={styles.subLabel}>Quality</Text>
        <View style={styles.qualityRow}>
          {[1, 2, 3, 4, 5].map(q => (
            <TouchableOpacity
              key={q}
              style={[
                styles.qualityButton,
                sleepQuality === q && styles.qualityButtonActive,
              ]}
              onPress={() => setSleepQuality(q)}
            >
              <Text
                style={[
                  styles.qualityButtonText,
                  sleepQuality === q && styles.qualityButtonTextActive,
                ]}
              >
                {q}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        <View style={styles.qualityLabels}>
          <Text style={styles.qualityLabelText}>Poor</Text>
          <Text style={styles.qualityLabelText}>Excellent</Text>
        </View>
      </View>

      {/* Protein */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Protein</Text>
        <TouchableOpacity
          style={[styles.checkbox, proteinGoalMet && styles.checkboxActive]}
          onPress={() => setProteinGoalMet(!proteinGoalMet)}
        >
          <Text style={[styles.checkboxText, proteinGoalMet && styles.checkboxTextActive]}>
            {proteinGoalMet ? '✓ Hit protein goal today' : 'Hit protein goal today'}
          </Text>
        </TouchableOpacity>

        <View style={styles.inputRow}>
          <TextInput
            style={styles.numberInput}
            value={proteinGrams}
            onChangeText={setProteinGrams}
            keyboardType="number-pad"
            placeholder="Optional: grams"
            placeholderTextColor={COLORS.textLight}
          />
          <Text style={styles.inputLabel}>g (optional)</Text>
        </View>
      </View>

      {/* Water */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Water</Text>
        <TouchableOpacity
          style={[styles.checkbox, waterGoalMet && styles.checkboxActive]}
          onPress={() => setWaterGoalMet(!waterGoalMet)}
        >
          <Text style={[styles.checkboxText, waterGoalMet && styles.checkboxTextActive]}>
            {waterGoalMet ? '✓ Hit water goal today' : 'Hit water goal today'}
          </Text>
        </TouchableOpacity>

        <View style={styles.inputRow}>
          <TextInput
            style={styles.numberInput}
            value={waterLitres}
            onChangeText={setWaterLitres}
            keyboardType="decimal-pad"
            placeholder="2.5"
            placeholderTextColor={COLORS.textLight}
          />
          <Text style={styles.inputLabel}>litres (optional)</Text>
        </View>
      </View>

      {/* Food Notes */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Food Notes</Text>
        <TextInput
          style={styles.textArea}
          value={foodNote}
          onChangeText={setFoodNote}
          placeholder="How was your eating today?"
          placeholderTextColor={COLORS.textLight}
          multiline
          numberOfLines={3}
        />
      </View>

      {/* Cravings */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Cravings</Text>
        <TouchableOpacity
          style={[styles.checkbox, hadCravings && styles.checkboxCravings]}
          onPress={() => setHadCravings(!hadCravings)}
        >
          <Text style={[styles.checkboxText, hadCravings && styles.checkboxTextActive]}>
            {hadCravings ? '✓ Had cravings today' : 'Had cravings today'}
          </Text>
        </TouchableOpacity>

        {hadCravings && (
          <TextInput
            style={styles.textArea}
            value={cravingsNote}
            onChangeText={setCravingsNote}
            placeholder="What triggered the cravings?"
            placeholderTextColor={COLORS.textLight}
            multiline
            numberOfLines={2}
          />
        )}
      </View>

      {/* Save Button */}
      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Save Check-in</Text>
      </TouchableOpacity>

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
    padding: 20,
    paddingTop: 40,
    backgroundColor: COLORS.primary,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  date: {
    fontSize: 16,
    color: '#FFFFFF',
    opacity: 0.9,
    marginTop: 5,
  },
  section: {
    backgroundColor: COLORS.card,
    marginHorizontal: 15,
    marginTop: 15,
    borderRadius: 15,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 15,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  numberInput: {
    backgroundColor: COLORS.background,
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 18,
    color: COLORS.text,
    minWidth: 100,
  },
  inputLabel: {
    marginLeft: 10,
    fontSize: 16,
    color: COLORS.textLight,
  },
  weightChange: {
    fontSize: 14,
    color: COLORS.primary,
    marginTop: 10,
  },
  subLabel: {
    fontSize: 14,
    color: COLORS.textLight,
    marginTop: 15,
    marginBottom: 10,
  },
  qualityRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  qualityButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: COLORS.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qualityButtonActive: {
    backgroundColor: COLORS.primary,
  },
  qualityButtonText: {
    fontSize: 18,
    color: COLORS.textLight,
    fontWeight: '600',
  },
  qualityButtonTextActive: {
    color: '#FFFFFF',
  },
  qualityLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  qualityLabelText: {
    fontSize: 12,
    color: COLORS.textLight,
  },
  checkbox: {
    backgroundColor: COLORS.background,
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
  },
  checkboxActive: {
    backgroundColor: COLORS.success,
  },
  checkboxCravings: {
    backgroundColor: COLORS.warning,
  },
  checkboxText: {
    fontSize: 16,
    color: COLORS.textLight,
    textAlign: 'center',
  },
  checkboxTextActive: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  textArea: {
    backgroundColor: COLORS.background,
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    color: COLORS.text,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  saveButton: {
    backgroundColor: COLORS.success,
    marginHorizontal: 15,
    marginTop: 25,
    paddingVertical: 18,
    borderRadius: 15,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  bottomPadding: {
    height: 40,
  },
});
