export const COLORS = {
  primary: '#FF6B00',
  primaryLight: '#FF8C38',
  secondary: '#FFD600',
  background: '#F5F5F5',
  surface: '#FFFFFF',
  textPrimary: '#1A1A1A',
  textSecondary: '#757575',
  success: '#4CAF50',
  error: '#E53935',

  categoryColors: [
    '#FF6B00', '#E53935', '#4CAF50', '#2196F3',
    '#9C27B0', '#FF9800', '#00BCD4', '#795548',
  ],
};

export const CATEGORIES = [
  'All', 'Rice Meals', 'Snacks', 'Desserts', 'Drinks', 'Street Food', 'Fast Food', 'Korean Food',
];

export const MOODS = ['Happy', 'Sad', 'Stressed', 'Tired', 'Excited', 'Lazy'];

export const RECIPE_FILTERS = ['Cheap Meals', 'Healthy Meals', 'Fast Cooking', 'Good for Family'];

export const SORT_OPTIONS = ['Nearest', 'Cheapest', 'Highest Rated'];

export const BUDGET_PRESETS = [50, 100, 200, 500];

export const CATEGORY_ICONS = {
  'Rice Meals': '🍚',
  'Snacks': '🍿',
  'Desserts': '🍰',
  'Drinks': '🥤',
  'Street Food': '🍢',
  'Fast Food': '🍔',
  'Korean Food': '🥩',
  'Chicken': '🍗',
  'All': '🍽️',
};

export const MOOD_ICONS = {
  Happy: '😊',
  Sad: '😢',
  Stressed: '😰',
  Tired: '😴',
  Excited: '🤩',
  Lazy: '🛋️',
};

export const MOOD_COLORS = {
  Happy: '#4CAF50',
  Sad: '#2196F3',
  Stressed: '#FF9800',
  Tired: '#9C27B0',
  Excited: '#E53935',
  Lazy: '#607D8B',
};

export const MOOD_FOODS = {
  Happy: ['Samgyup', 'Pizza', 'Ice Cream', 'Bibimbap'],
  Sad: ['Ice Cream', 'Chocolate', 'Pancit Canton', 'Milktea'],
  Stressed: ['Milktea', 'French Fries', 'Burger', 'Fried Chicken'],
  Tired: ['Coffee', 'Siomai Rice', 'Pancit', 'Rice Meals'],
  Excited: ['Samgyeopsal', 'Pizza', 'Korean BBQ', 'Chicken'],
  Lazy: ['Delivery Food', 'Instant Noodles', 'Pizza', 'Burger'],
};

export function getCategoryIcon(cat) {
  return CATEGORY_ICONS[cat] || '🍽️';
}

export function getMoodIcon(mood) {
  return MOOD_ICONS[mood] || '😐';
}

export function getCategoryColor(index) {
  return COLORS.categoryColors[index % COLORS.categoryColors.length];
}
