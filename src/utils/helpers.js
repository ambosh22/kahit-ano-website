export function formatPeso(amount) {
  return `P${Math.round(amount)}`;
}

export function generateRoomCode() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = 'FOOD-';
  for (let i = 0; i < 4; i++) code += chars[Math.floor(Math.random() * chars.length)];
  return code;
}

export function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.asin(Math.sqrt(a));
}

export function formatDistance(km) {
  if (km < 1) return `${Math.round(km * 1000)} m`;
  return `${km.toFixed(1)} km`;
}

const ulamCategories = new Set([
  'Rice Meals', 'Fast Food', 'Korean Food', 'Ulam', 'Spicy Ulam',
  'Family Meals', 'Cheap Meals', 'Healthy Meals', 'Fast Cooking',
  'Chicken', 'Filipino Food', 'Chinese Food', 'Japanese Food', 'Burger', 'Pizza',
]);

export function getMealType(category) {
  return ulamCategories.has(category) ? 'Ulam' : 'Merienda';
}
