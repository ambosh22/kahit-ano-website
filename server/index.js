import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: { origin: process.env.NODE_ENV === 'production' ? false : '*' },
});

function generateRoomCode() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = 'FOOD-';
  for (let i = 0; i < 4; i++) code += chars[Math.floor(Math.random() * chars.length)];
  return code;
}

const rooms = {};

io.on('connection', (socket) => {
  let currentRoom = null;

  socket.on('create-room', () => {
    const code = generateRoomCode();
    rooms[code] = {
      code,
      suggestions: [],
      host: socket.id,
      ended: false,
      winner: null,
    };
    currentRoom = code;
    socket.join(code);
    socket.emit('room-created', { code, state: rooms[code] });
  });

  socket.on('join-room', ({ code }) => {
    const room = rooms[code];
    if (!room) {
      socket.emit('room-error', { message: 'Room not found!' });
      return;
    }
    currentRoom = code;
    socket.join(code);
    socket.emit('room-joined', { code, state: room });
  });

  socket.on('suggest-food', ({ name, mealType }) => {
    if (!currentRoom || !rooms[currentRoom]) return;
    const room = rooms[currentRoom];
    const existing = room.suggestions.find(
      s => s.name.toLowerCase() === name.toLowerCase()
    );
    if (existing) {
      socket.emit('suggest-error', { message: `"${existing.name}" is already on the board!` });
      return;
    }
    const suggestion = {
      id: Date.now(),
      name,
      votes: 0,
      mealType,
    };
    room.suggestions.push(suggestion);
    io.to(currentRoom).emit('room-update', { state: room });
  });

  socket.on('vote-food', ({ id }) => {
    if (!currentRoom || !rooms[currentRoom]) return;
    const room = rooms[currentRoom];
    const food = room.suggestions.find(s => s.id === id);
    if (food) {
      food.votes += 1;
      io.to(currentRoom).emit('room-update', { state: room });
    }
  });

  socket.on('end-voting', () => {
    if (!currentRoom || !rooms[currentRoom]) return;
    const room = rooms[currentRoom];
    if (room.host !== socket.id) return;
    if (room.suggestions.length === 0) return;
    const maxVotes = Math.max(...room.suggestions.map(s => s.votes));
    const winner = room.suggestions.find(s => s.votes === maxVotes);
    room.ended = true;
    room.winner = winner;
    io.to(currentRoom).emit('voting-ended', { state: room, winner });
  });

  socket.on('leave-room', () => {
    if (currentRoom) {
      socket.leave(currentRoom);
      currentRoom = null;
    }
  });

  socket.on('disconnect', () => {
    if (currentRoom) {
      socket.leave(currentRoom);
    }
  });
});

const foodEmoji = {
  restaurant: '🍽️', fast_food: '🍔', cafe: '☕',
  bakery: '🥐', ice_cream: '🍦', pub: '🍺',
};

function getTagType(tags) {
  return tags.amenity || tags.shop || 'restaurant';
}

function getEmoji(tags) {
  const type = getTagType(tags);
  return foodEmoji[type] || '🍽️';
}

function getCategory(tags) {
  const cuisine = (tags.cuisine || '').toLowerCase();
  const name = (tags.name || '').toLowerCase();

  // Convenience stores (7-11, Ministop, etc.)
  if ((tags.shop && tags.shop.toLowerCase() === 'convenience') || name.includes('7-eleven') || name.includes('7/11') || name.includes('7 eleven') || name.includes('ministop')) return 'Convenience';

  // Explicit cuisine matches
  if (cuisine.includes('filipino') || cuisine.includes('local') || name.includes('carinderia') || name.includes('carindería')) return 'Filipino Food';
  if (cuisine.includes('korean')) return 'Korean Food';
  if (cuisine.includes('japanese') || cuisine.includes('sushi') || cuisine.includes('ramen')) return 'Japanese Food';
  if (cuisine.includes('chinese')) return 'Chinese Food';
  if (cuisine.includes('italian') || cuisine.includes('pizza') || cuisine.includes('pasta')) return 'Pizza';
  if (cuisine.includes('mexican')) return 'Fast Food';
  if (cuisine.includes('american') || cuisine.includes('burger') || cuisine.includes('sandwich')) return 'Burger';
  if (cuisine.includes('chicken')) return 'Chicken';
  if (cuisine.includes('coffee') || cuisine.includes('tea')) return 'Drinks';
  if (cuisine.includes('bakery') || cuisine.includes('cake') || cuisine.includes('pastry')) return 'Snacks';
  if (cuisine.includes('ice_cream') || cuisine.includes('dessert')) return 'Snacks';
  if (cuisine.includes('seafood')) return 'Filipino Food';

  // Name-based heuristics for home-cooked and merienda
  if (name.includes('lutong') || name.includes('lutong bahay') || name.includes('homecooked') || name.includes('home-cooked') || name.includes('turo') || name.includes('turo-turo') || name.includes('turo turo')) return 'Home-cooked';
  if (name.includes('merienda') || name.includes('kakanin') || name.includes('meryenda') || name.includes('snack') || name.includes('treats')) return 'Merienda';

  const type = getTagType(tags);
  if (type === 'cafe') return 'Drinks';
  if (type === 'fast_food') return 'Fast Food';
  if (type === 'bakery' || type === 'ice_cream') return 'Snacks';

  // Default to Filipino Food to surface local/eatery places first
  return 'Filipino Food';
}

function getPriceRange(tags) {
  if (tags.charge) return `₱${tags.charge}`;
  const level = tags.price_level || '';
  if (level === '1') return '₱50-150';
  if (level === '2') return '₱150-350';
  if (level === '3') return '₱350-700';
  if (level === '4') return '₱700+';
  return '₱100-300';
}

app.get('/api/nearby-restaurants', async (req, res) => {
  const { lat, lng, radius = 1500 } = req.query;
  if (!lat || !lng) {
    return res.status(400).json({ error: 'lat and lng are required' });
  }

  const query = `
    [out:json][timeout:10];
    (
      node["amenity"="restaurant"](around:${radius},${lat},${lng});
      node["amenity"="fast_food"](around:${radius},${lat},${lng});
      node["amenity"="cafe"](around:${radius},${lat},${lng});
      node["shop"="bakery"](around:${radius},${lat},${lng});
      node["amenity"="ice_cream"](around:${radius},${lat},${lng});
      node["shop"="convenience"](around:${radius},${lat},${lng});
    );
    out body 50;
  `.trim();

  // Try multiple Overpass endpoints with a timeout to handle transient outages/rate limits
  const endpoints = [
    'https://overpass-api.de/api/interpreter',
    'https://overpass.openstreetmap.fr/api/interpreter',
    'https://overpass.kumi.systems/api/interpreter'
  ];

  let lastErr = null;
  let json = null;

  for (const endpoint of endpoints) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 15000);

      const url = `${endpoint}?data=${encodeURIComponent(query)}`;
      const resp = await fetch(url, { headers: { 'User-Agent': 'KahitAnoFoodApp/1.0' }, signal: controller.signal });
      clearTimeout(timeout);

      if (!resp.ok) {
        lastErr = `Endpoint ${endpoint} returned ${resp.status}`;
        console.warn('Overpass fetch warning:', lastErr);
        continue;
      }

      json = await resp.json();
      // success
      break;
    } catch (err) {
      lastErr = `Endpoint ${endpoint} error: ${err.message}`;
      console.warn('Overpass fetch error:', lastErr);
      // try next endpoint
    }
  }

  if (!json) {
    console.error('All Overpass endpoints failed:', lastErr);
    return res.status(502).json({ error: 'Failed to fetch nearby restaurants', detail: lastErr, tried: endpoints });
  }

  try {
    const data = json;
    const seen = new Set();
    const results = data.elements
      .filter(el => el.tags && el.tags.name && !seen.has(el.tags.name) && seen.add(el.tags.name))
      .slice(0, 50)
      .map((el, index) => ({
        id: el.id || index + 1000,
        name: el.tags.name,
        lat: el.lat || el.center?.lat,
        lng: el.lon || el.center?.lon,
        category: getCategory(el.tags),
        priceRange: getPriceRange(el.tags),
        // OSM may provide a 'rating' or 'stars' tag
        rating: el.tags.rating ? parseFloat(el.tags.rating) : (el.tags.stars ? parseFloat(el.tags.stars) : null),
        openingHours: el.tags.opening_hours || null,
        phone: el.tags.phone || el.tags['contact:phone'] || null,
        website: el.tags.website || el.tags.url || null,
        image: getEmoji(el.tags),
      }));

    res.json(results);
  } catch (err) {
    console.error('Processing Overpass data error:', err.message);
    res.status(502).json({ error: 'Failed to process nearby restaurants', detail: err.message });
  }
});

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../dist/index.html'));
  });
}

const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
