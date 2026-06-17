import { useState } from 'react';
import recipes from '../data/recipes';
import { formatPeso, getMealType } from '../utils/helpers';
import { FiClock, FiUsers, FiSearch, FiX } from 'react-icons/fi';

const mealFilters = ['All', 'Pang Ulam', 'Pang Merienda'];
const categoryFilters = ['All', 'Cheap Meals', 'Healthy Meals', 'Fast Cooking', 'Family Meals', 'Ulam', 'Spicy Ulam', 'Snacks', 'Desserts'];

export default function CookAtHome() {
  const [mealFilter, setMealFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);

  const filtered = recipes.filter(r => {
    const matchMeal = mealFilter === 'All' || getMealType(r.category) === mealFilter;
    const matchCat = categoryFilter === 'All' || r.category === categoryFilter;
    const matchSearch = r.name.toLowerCase().includes(search.toLowerCase());
    return matchMeal && matchCat && matchSearch;
  });

  const totalCost = selected?.ingredients?.reduce((sum, ing) => sum + ing.cost, 0) || 0;

  return (
    <div className="page">
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h1 className="section-title" style={{ fontSize: '36px', marginBottom: '8px' }}>
            Cook at Home
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '16px' }}>
            Tipsidihin man o magastos, may recipe tayo para sa'yo!
          </p>
        </div>

        <div className="card" style={{ maxWidth: '700px', margin: '0 auto 32px' }}>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '12px' }}>
            {mealFilters.map(f => (
              <button
                key={f}
                className={`btn btn-sm ${mealFilter === f ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setMealFilter(f)}
              >
                {f === 'Pang Ulam' ? '🍖 Pang Ulam' : f === 'Pang Merienda' ? '🍿 Pang Merienda' : 'All'}
              </button>
            ))}
          </div>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center' }}>
            {categoryFilters.map(f => (
              <button
                key={f}
                className={`btn btn-sm ${categoryFilter === f ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setCategoryFilter(f)}
                style={{ fontSize: '12px', padding: '6px 14px' }}
              >
                {f}
              </button>
            ))}
          </div>
          <div style={{ marginTop: '16px', position: 'relative' }}>
            <FiSearch size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder="Search recipes..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ ...styles.input, paddingLeft: '36px' }}
            />
          </div>
        </div>

        {filtered.length === 0 && (
          <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
            <FiSearch size={48} color="var(--text-muted)" />
            <p style={{ color: 'var(--text-secondary)', marginTop: '12px' }}>No recipes found.</p>
          </div>
        )}

        <div className="grid grid-2">
          {filtered.map(recipe => (
            <div key={recipe.id} className="card" style={{ cursor: 'pointer' }}
              onClick={() => setSelected(recipe)}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', marginBottom: '12px' }}>
                <div style={{
                  width: '80px', height: '80px', borderRadius: 'var(--radius-sm)',
                  background: 'linear-gradient(135deg, rgba(255,107,53,0.1), rgba(255,215,0,0.1))',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '40px', flexShrink: 0,
                }}>{recipe.image}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text)' }}>{recipe.name}</h3>
                    <span style={{ color: 'var(--primary)', fontWeight: 700, fontSize: '18px' }}>
                      {formatPeso(recipe.totalCost)}
                    </span>
                  </div>
                  <div style={{ display: 'flex', gap: '8px', marginTop: '6px', flexWrap: 'wrap' }}>
                    <span className="badge" style={{ background: '#4CAF50', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <FiClock size={10} /> {recipe.cookingTime}
                    </span>
                    <span className="badge" style={{ background: '#2196F3', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <FiUsers size={10} /> {recipe.servings} servings
                    </span>
                    <span className="badge">{recipe.category}</span>
                    <span className="badge" style={{ background: getMealType(recipe.category) === 'Ulam' ? '#E53935' : '#FF9800' }}>
                      {getMealType(recipe.category)}
                    </span>
                  </div>
                </div>
              </div>
              <div>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '6px' }}>Ingredients:</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                  {recipe.ingredients.map((ing, i) => (
                    <span key={i} style={{
                      background: 'rgba(255,107,53,0.1)', padding: '3px 8px',
                      borderRadius: '50px', fontSize: '11px', color: 'var(--text-secondary)',
                    }}>
                      {ing.name}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {selected && (
          <div style={styles.overlay} onClick={() => setSelected(null)}>
            <div className="card" style={styles.modal} onClick={e => e.stopPropagation()}>
              <button style={styles.closeBtn} onClick={() => setSelected(null)}>
                <FiX size={18} />
              </button>
              <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                <span style={{ fontSize: '64px' }}>{selected.image}</span>
                <h2 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text)', marginTop: '8px' }}>{selected.name}</h2>
                <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginTop: '8px', flexWrap: 'wrap' }}>
                  <span className="badge" style={{ background: '#4CAF50', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <FiClock size={12} /> {selected.cookingTime}
                  </span>
                  <span className="badge" style={{ background: '#2196F3', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <FiUsers size={12} /> {selected.servings} servings
                  </span>
                  <span className="badge">{selected.category}</span>
                  <span className="badge" style={{ background: getMealType(selected.category) === 'Ulam' ? '#E53935' : '#FF9800' }}>
                    {getMealType(selected.category)}
                  </span>
                </div>
              </div>

              <div style={{ marginBottom: '20px', overflowX: 'auto' }}>
                <h3 style={{ fontWeight: 700, marginBottom: '10px', color: 'var(--text)' }}>Ingredients</h3>
                <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '250px' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--border)' }}>
                      <th style={{ textAlign: 'left', padding: '8px', color: 'var(--text-secondary)', fontSize: '13px' }}>Item</th>
                      <th style={{ textAlign: 'right', padding: '8px', color: 'var(--text-secondary)', fontSize: '13px' }}>Cost</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selected.ingredients.map((ing, i) => (
                      <tr key={i} style={{ borderBottom: '1px solid var(--border)' }}>
                        <td style={{ padding: '8px', color: 'var(--text)' }}>{ing.name}</td>
                        <td style={{ padding: '8px', textAlign: 'right', color: 'var(--primary)', fontWeight: 600 }}>{formatPeso(ing.cost)}</td>
                      </tr>
                    ))}
                    <tr>
                      <td style={{ padding: '8px', fontWeight: 700, color: 'var(--text)' }}>Total</td>
                      <td style={{ padding: '8px', textAlign: 'right', fontWeight: 800, color: 'var(--primary)', fontSize: '18px' }}>{formatPeso(totalCost)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div>
                <h3 style={{ fontWeight: 700, marginBottom: '10px', color: 'var(--text)' }}>Steps</h3>
                <ol style={{ paddingLeft: '20px' }}>
                  {selected.steps.map((step, i) => (
                    <li key={i} style={{ color: 'var(--text-secondary)', marginBottom: '8px', lineHeight: 1.5 }}>{step}</li>
                  ))}
                </ol>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  input: {
    width: '100%', padding: '12px 16px',
    borderRadius: '50px', border: '2px solid var(--border)',
    background: 'var(--bg-card)', color: 'var(--text)',
    fontSize: '15px',
  },
  overlay: {
    position: 'fixed', inset: 0, zIndex: 2000,
    background: 'rgba(0,0,0,0.6)',
    backdropFilter: 'blur(4px)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    padding: '20px',
  },
  modal: {
    maxWidth: '500px', width: '100%',
    maxHeight: '90vh', overflowY: 'auto',
    position: 'relative',
  },
  closeBtn: {
    position: 'sticky', top: '0', float: 'right',
    width: '36px', height: '36px',
    borderRadius: '50%', border: 'none',
    background: 'rgba(0,0,0,0.1)',
    cursor: 'pointer',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    color: 'var(--text)',
  },
};
