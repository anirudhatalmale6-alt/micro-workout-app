import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { snacks, searchSnacks, getSnacksByCategory } from '../data/snacks';
import { Snack } from '../types';

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

type Category = 'all' | 'Protein' | 'Sweet' | 'Savoury' | 'Warm';

export const SnacksScreen: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category>('all');

  const getFilteredSnacks = (): Snack[] => {
    let filtered = snacks;

    if (selectedCategory !== 'all') {
      filtered = getSnacksByCategory(selectedCategory);
    }

    if (searchQuery.trim()) {
      filtered = searchSnacks(searchQuery).filter(s =>
        selectedCategory === 'all' || s.category === selectedCategory
      );
    }

    return filtered.sort((a, b) => a.estimatedCalories - b.estimatedCalories);
  };

  const filteredSnacks = getFilteredSnacks();

  const getCategoryIcon = (category: string): string => {
    const icons: { [key: string]: string } = {
      Protein: '🥚',
      Sweet: '🍎',
      Savoury: '🥕',
      Warm: '🍲',
    };
    return icons[category] || '🍽️';
  };

  const getCategoryColor = (category: string): string => {
    const colors: { [key: string]: string } = {
      Protein: '#4ECDC4',
      Sweet: '#FF6B6B',
      Savoury: '#FFE66D',
      Warm: '#FF9F43',
    };
    return colors[category] || COLORS.primary;
  };

  return (
    <View style={styles.container}>
      {/* Search */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search snacks..."
          placeholderTextColor={COLORS.textLight}
        />
      </View>

      {/* Category Filter */}
      <View style={styles.filterContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {(['all', 'Protein', 'Sweet', 'Savoury', 'Warm'] as Category[]).map(category => (
            <TouchableOpacity
              key={category}
              style={[
                styles.filterTab,
                selectedCategory === category && styles.filterTabActive,
              ]}
              onPress={() => setSelectedCategory(category)}
            >
              <Text
                style={[
                  styles.filterTabText,
                  selectedCategory === category && styles.filterTabTextActive,
                ]}
              >
                {category === 'all' ? '🍽️ All' : `${getCategoryIcon(category)} ${category}`}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Info Banner */}
      <View style={styles.infoBanner}>
        <Text style={styles.infoBannerText}>
          All snacks under 200 calories - great for curbing cravings!
        </Text>
      </View>

      {/* Snacks List */}
      <ScrollView style={styles.snacksList}>
        {filteredSnacks.map(snack => (
          <View key={snack.id} style={styles.snackCard}>
            <View
              style={[
                styles.categoryIndicator,
                { backgroundColor: getCategoryColor(snack.category) },
              ]}
            >
              <Text style={styles.categoryIcon}>{getCategoryIcon(snack.category)}</Text>
            </View>

            <View style={styles.snackInfo}>
              <Text style={styles.snackName}>{snack.name}</Text>
              <Text style={styles.snackNotes}>{snack.notes}</Text>
            </View>

            <View style={styles.caloriesBadge}>
              <Text style={styles.caloriesNumber}>{snack.estimatedCalories}</Text>
              <Text style={styles.caloriesLabel}>cal</Text>
            </View>
          </View>
        ))}

        {filteredSnacks.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No snacks found</Text>
            <Text style={styles.emptySubtext}>Try adjusting your search</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  searchContainer: {
    padding: 15,
    backgroundColor: COLORS.card,
  },
  searchInput: {
    backgroundColor: COLORS.background,
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    color: COLORS.text,
  },
  filterContainer: {
    backgroundColor: COLORS.card,
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  filterTab: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    marginHorizontal: 5,
    backgroundColor: COLORS.background,
  },
  filterTabActive: {
    backgroundColor: COLORS.primary,
  },
  filterTabText: {
    color: COLORS.textLight,
    fontWeight: '600',
    fontSize: 14,
  },
  filterTabTextActive: {
    color: '#FFFFFF',
  },
  infoBanner: {
    backgroundColor: '#E8F5E9',
    padding: 12,
    marginHorizontal: 15,
    marginTop: 15,
    borderRadius: 10,
  },
  infoBannerText: {
    color: '#2E7D32',
    textAlign: 'center',
    fontSize: 13,
  },
  snacksList: {
    flex: 1,
    padding: 15,
  },
  snackCard: {
    backgroundColor: COLORS.card,
    borderRadius: 15,
    padding: 15,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 2,
  },
  categoryIndicator: {
    width: 50,
    height: 50,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
  },
  categoryIcon: {
    fontSize: 24,
  },
  snackInfo: {
    flex: 1,
  },
  snackName: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
  },
  snackNotes: {
    fontSize: 13,
    color: COLORS.textLight,
    marginTop: 4,
  },
  caloriesBadge: {
    alignItems: 'center',
    backgroundColor: COLORS.background,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
  },
  caloriesNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  caloriesLabel: {
    fontSize: 10,
    color: COLORS.textLight,
    textTransform: 'uppercase',
  },
  emptyState: {
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 18,
    color: COLORS.text,
  },
  emptySubtext: {
    fontSize: 14,
    color: COLORS.textLight,
    marginTop: 8,
  },
});
