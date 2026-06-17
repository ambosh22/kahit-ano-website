import { useState } from 'react';
import foods from '../data/foods';
import FoodModal from '../components/FoodModal';
import { formatPeso } from '../utils/helpers';
import { FiSearch, FiShoppingBag, FiHeart } from 'react-icons/fi';

const categories = ['All', ...new Set(foods.map(f => f.category))];

export default function BuyOutside() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [maxBudget, setMaxBudget] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [selected, setSelected] = useState(null);
  const [favorites, setFavorites] = useState([]);

  const filtered = foods.filter(f => {
    const matchSearch = f.name.toLowerCase().includes(search.toLowerCase());
    const matchCat = category === 'All' || f.category === category;
    const matchBudget = !maxBudget || f.price <= Number(maxBudget);
    return matchSearch && matchCat && matchBudget;
  }).sort((a, b) => {
    if (sortBy === 'price-asc') return a.price - b.price;
    if (sortBy === 'price-desc') return b.price - a.price;
    if (sortBy === 'name') return a.name.localeCompare(b.name);
    return 0;
  });

  const toggleFav = (id) => {
    setFavorites(prev => prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]);
  };

  return (
    <div className="page">
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h1 className="section-title" style={{ fontSize: '36px', marginBottom: '8px' }}>
            Buy Outside
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '16px' }}>
            Tamad magluto? Eto na mga pwedeng bilhin!
          </p>
        </div>

        <div className="card" style={{ marginBottom: '32px' }}>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
            <div style={{ flex: 1, minWidth: '180px', position: 'relative' }}>
              <FiSearch size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="text"
                placeholder="Search food..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                style={{ ...styles.input, paddingLeft: '36px' }}
              />
            </div>
            <select value={category} onChange={e => setCategory(e.target.value)} style={styles.select}>
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <input
              type="number"
              placeholder="Max budget"
              value={maxBudget}
              onChange={e => setMaxBudget(e.target.value)}
              style={{ ...styles.input, maxWidth: '140px' }}
            />
            <select value={sortBy} onChange={e => setSortBy(e.target.value)} style={styles.select}>
              <option value="">Sort by</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="name">Name</option>
            </select>
          </div>
        </div>

        <div className="grid grid-4">
          {filtered.map(food => (
            <div key={food.id} className="card" style={{ textAlign: 'center', padding: '20px', position: 'relative' }}>
              <button
                onClick={() => toggleFav(food.id)}
                style={styles.favBtn}
              >
                <FiHeart size={18} color={favorites.includes(food.id) ? '#EF4444' : 'var(--text-muted)'} fill={favorites.includes(food.id) ? '#EF4444' : 'none'} />
              </button>
              <div onClick={() => setSelected(food)} style={{ cursor: 'pointer' }}>
              <span style={{ fontSize: '48px', display: 'block', marginBottom: '8px' }}>{food.image}</span>
                <h3 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text)', marginBottom: '4px' }}>{food.name}</h3>
                <span className="badge" style={{ marginBottom: '6px' }}>{food.category}</span>
                <p style={{ color: 'var(--primary)', fontWeight: 700, fontSize: '20px' }}>{formatPeso(food.price)}</p>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
            <FiSearch size={48} color="var(--text-muted)" />
            <p style={{ color: 'var(--text-secondary)', marginTop: '12px' }}>No foods match your filters.</p>
          </div>
        )}

        {selected && <FoodModal food={selected} onClose={() => setSelected(null)} />}
      </div>
    </div>
  );
}

const styles = {
  input: {
    flex: 1, minWidth: '180px', padding: '10px 16px',
    borderRadius: '50px', border: '2px solid var(--border)',
    background: 'var(--bg-card)', color: 'var(--text)',
    fontSize: '14px',
  },
  select: {
    padding: '10px 16px', borderRadius: '50px',
    border: '2px solid var(--border)',
    background: 'var(--bg-card)', color: 'var(--text)',
    fontSize: '14px', cursor: 'pointer',
  },
  favBtn: {
    position: 'absolute', top: '8px', right: '8px',
    background: 'none', border: 'none', cursor: 'pointer',
    zIndex: 1, padding: '4px',
  },
};
