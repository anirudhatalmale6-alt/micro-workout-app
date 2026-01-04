import { Snack } from '../types';

export const snacks: Snack[] = [
  // PROTEIN
  {
    id: 1,
    name: 'Greek yogurt with berries',
    estimatedCalories: 150,
    category: 'Protein',
    notes: 'High protein low sugar',
  },
  {
    id: 2,
    name: 'Cottage cheese with cucumber',
    estimatedCalories: 120,
    category: 'Protein',
    notes: 'Very filling',
  },
  {
    id: 3,
    name: 'Protein shake with water',
    estimatedCalories: 130,
    category: 'Protein',
    notes: 'Use low sugar powder',
  },
  {
    id: 4,
    name: 'Boiled eggs x2',
    estimatedCalories: 140,
    category: 'Protein',
    notes: 'Portable',
  },
  {
    id: 5,
    name: 'Edamame beans',
    estimatedCalories: 180,
    category: 'Protein',
    notes: 'Fiber rich',
  },
  {
    id: 6,
    name: 'Turkey slices and mustard',
    estimatedCalories: 100,
    category: 'Protein',
    notes: 'Lean protein',
  },
  {
    id: 20,
    name: 'Scrambled eggs light',
    estimatedCalories: 160,
    category: 'Protein',
    notes: 'Quick prep',
  },
  // SWEET
  {
    id: 7,
    name: 'Apple with cinnamon',
    estimatedCalories: 95,
    category: 'Sweet',
    notes: 'Craving control',
  },
  {
    id: 8,
    name: 'Apple with peanut butter tbsp',
    estimatedCalories: 180,
    category: 'Sweet',
    notes: 'Portion control',
  },
  {
    id: 9,
    name: 'Frozen grapes',
    estimatedCalories: 120,
    category: 'Sweet',
    notes: 'Slow eating',
  },
  {
    id: 10,
    name: 'Dark chocolate squares x2',
    estimatedCalories: 120,
    category: 'Sweet',
    notes: 'Choose 70 percent',
  },
  // SAVOURY
  {
    id: 11,
    name: 'Air popped popcorn',
    estimatedCalories: 150,
    category: 'Savoury',
    notes: 'High volume',
  },
  {
    id: 12,
    name: 'Carrot sticks and salsa',
    estimatedCalories: 90,
    category: 'Savoury',
    notes: 'Very low calorie',
  },
  {
    id: 13,
    name: 'Pickles and deli meat',
    estimatedCalories: 80,
    category: 'Savoury',
    notes: 'Salty craving',
  },
  {
    id: 14,
    name: 'Rice cake with cottage cheese',
    estimatedCalories: 130,
    category: 'Savoury',
    notes: 'Light snack',
  },
  {
    id: 15,
    name: 'Seaweed snacks',
    estimatedCalories: 60,
    category: 'Savoury',
    notes: 'Very low calorie',
  },
  // WARM
  {
    id: 16,
    name: 'Miso soup',
    estimatedCalories: 70,
    category: 'Warm',
    notes: 'Comfort food',
  },
  {
    id: 17,
    name: 'Vegetable broth',
    estimatedCalories: 50,
    category: 'Warm',
    notes: 'Hydrating',
  },
  {
    id: 18,
    name: 'Tomato soup light',
    estimatedCalories: 120,
    category: 'Warm',
    notes: 'Choose low sugar',
  },
  {
    id: 19,
    name: 'Oatmeal small portion',
    estimatedCalories: 180,
    category: 'Warm',
    notes: 'Fiber rich',
  },
];

export const getSnacksByCategory = (category: Snack['category']): Snack[] => {
  return snacks.filter(s => s.category === category);
};

export const getSnacksUnderCalories = (maxCalories: number): Snack[] => {
  return snacks.filter(s => s.estimatedCalories <= maxCalories).sort((a, b) => a.estimatedCalories - b.estimatedCalories);
};

export const searchSnacks = (query: string): Snack[] => {
  const lowerQuery = query.toLowerCase();
  return snacks.filter(
    s =>
      s.name.toLowerCase().includes(lowerQuery) ||
      s.notes.toLowerCase().includes(lowerQuery) ||
      s.category.toLowerCase().includes(lowerQuery)
  );
};
