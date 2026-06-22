import { useState, useCallback } from 'react';
import FoodWheel from '../components/FoodWheel';
import foods from '../data/foods';
import { CATEGORIES } from '../utils/constants';
import { getMealType } from '../utils/helpers';
import { FiX, FiShuffle, FiTrash2, FiPlus, FiStar, FiChevronRight } from 'react-icons/fi';
import recipes from '../data/recipes';
import { formatPeso } from '../utils/helpers';

const MAX_SLOTS = 12;

const WHEEL_COLORS = [
  '#FF6B35', '#E53935', '#4CAF50', '#2196F3',
  '#9C27B0', '#FF9800', '#00BCD4', '#795548',
  '#607D8B', '#F44336', '#3F51B5', '#009688',
];

const CATEGORY_EMOJIS = {
  'All': '🍽️',
  'Rice Meals': '🍚',
  'Snacks': '🍿',
  'Desserts': '🍰',
  'Drinks': '🥤',
  'Street Food': '🍢',
  'Fast Food': '🍔',
  'Korean Food': '🥩',
};

export default function CustomWheel() {
  const [selectedCats, setSelectedCats] = useState(new Set(['All']));
  const [slots, setSlots] = useState(Array(MAX_SLOTS).fill(null));
  const [result, setResult] = useState(null);
  const [dragOverIndex, setDragOverIndex] = useState(null);

  const toggleCat = (cat) => {
    setSelectedCats(prev => {
      const next = new Set(prev);
      if (cat === 'All') return new Set(['All']);
      next.delete('All');
      if (next.has(cat)) next.delete(cat);
      else next.add(cat);
      return next.size === 0 ? new Set(['All']) : next;
    });
  };

  const available = selectedCats.has('All')
    ? foods.slice(0, 50)
    : foods.filter(f => selectedCats.has(f.category));

  const handleDragStart = (e, type, food, index) => {
    e.dataTransfer.setData('application/json', JSON.stringify({ type, foodId: food.id, index }));
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDrop = (e, targetIndex) => {
    e.preventDefault();
    setDragOverIndex(null);
    try {
      const data = JSON.parse(e.dataTransfer.getData('application/json'));
      const { type, foodId, index: sourceIndex } = data;
      const food = foods.find(f => f.id === foodId);
      if (!food) return;

      setSlots(prev => {
        const next = [...prev];
        if (type === 'pool') {
          if (next[targetIndex]?.id === foodId) return next;
          next[targetIndex] = food;
        } else if (type === 'slot' && sourceIndex !== undefined) {
          if (sourceIndex === targetIndex) return next;
          const temp = next[sourceIndex];
          next[sourceIndex] = next[targetIndex];
          next[targetIndex] = temp;
        }
        return next;
      });
    } catch {}
  };

  const removeSlot = (index) => {
    setSlots(prev => {
      const next = [...prev];
      next[index] = null;
      return next;
    });
  };

  const clearAll = () => setSlots(Array(MAX_SLOTS).fill(null));

  const quickFill = () => {
    setSlots(prev => {
      const used = new Set(prev.filter(Boolean).map(f => f.id));
      const pool = available.filter(f => !used.has(f.id));
      if (pool.length === 0) return prev;
      const next = [...prev];
      let pi = 0;
      for (let i = 0; i < MAX_SLOTS; i++) {
        if (next[i] === null && pi < pool.length) {
          next[i] = pool[pi++];
        }
      }
      return next;
    });
  };

  const shuffleSlots = () => {
    setSlots(prev => {
      const filled = prev.filter(Boolean);
      for (let i = filled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [filled[i], filled[j]] = [filled[j], filled[i]];
      }
      const next = Array(MAX_SLOTS).fill(null);
      filled.forEach((f, i) => { next[i] = f; });
      return next;
    });
  };

  const usedIds = new Set(slots.filter(Boolean).map(f => f.id));
  const customList = slots.filter(Boolean);

  const handleResult = (food) => {
    const match = recipes.find(r =>
      r.name.toLowerCase().includes(food.name.toLowerCase()) ||
      food.name.toLowerCase().includes(r.name.toLowerCase())
    );
    setResult({ food, recipe: match || null });
  };

  return (
    <div className="page">
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <h1 className="section-title" style={{ fontSize: '32px', marginBottom: '6px' }}>
            <FiStar style={{ verticalAlign: 'middle', marginRight: '8px' }} />
            Custom Wheel
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '15px' }}>
            Piliin mo kung anong gusto mo isama sa wheel — drag & drop lang!
          </p>
        </div>

        <div className="card" style={{ marginBottom: '24px', padding: '16px 20px' }}>
          <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '10px', display: 'block' }}>
            Piliin ang kategorya:
          </label>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                className={`btn btn-sm ${selectedCats.has(cat) ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => toggleCat(cat)}
                style={{ fontSize: '13px', padding: '6px 14px' }}
              >
                {CATEGORY_EMOJIS[cat] || '🍽️'} {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="custom-wheel-layout" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px' }}>
          <div>
            <h3 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '10px', color: 'var(--text)' }}>
              Available Foods <span style={{ color: 'var(--text-muted)', fontWeight: 400, fontSize: '13px' }}>({available.length})</span>
            </h3>
            <div
              style={{
                display: 'flex', flexWrap: 'wrap', gap: '8px',
                maxHeight: '360px', overflowY: 'auto',
                padding: '4px',
              }}
            >
              {available.filter(f => !usedIds.has(f.id)).map(food => (
                <div
                  key={food.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, 'pool', food)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '6px',
                    padding: '8px 12px', borderRadius: 'var(--radius-sm)',
                    background: 'var(--bg-card)', border: '1px solid var(--border)',
                    cursor: 'grab', fontSize: '13px', fontWeight: 500,
                    transition: 'all 0.2s', userSelect: 'none',
                    boxShadow: 'var(--shadow)',
                  }}
                  onMouseOver={e => { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.transform = 'scale(1.03)'; }}
                  onMouseOut={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = 'scale(1)'; }}
                >
                  <span style={{ fontSize: '20px' }}>{food.image}</span>
                  <span>{food.name}</span>
                </div>
              ))}
              {available.filter(f => !usedIds.has(f.id)).length === 0 && (
                <p style={{ color: 'var(--text-muted)', fontSize: '13px', padding: '20px' }}>
                  No available foods left
                </p>
              )}
            </div>
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
              <h3 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text)' }}>
                Your Wheel <span style={{ color: 'var(--text-muted)', fontWeight: 400, fontSize: '13px' }}>({customList.length}/{MAX_SLOTS})</span>
              </h3>
              <div style={{ display: 'flex', gap: '6px' }}>
<button className="btn btn-sm btn-secondary" onClick={quickFill} title="Fill empty slots">
                          <FiPlus size={13} /> Fill
                        </button>
                <button className="btn btn-sm btn-secondary" onClick={shuffleSlots} title="Shuffle order">
                  <FiShuffle size={13} /> Shuffle
                </button>
                <button className="btn btn-sm btn-danger" onClick={clearAll} title="Clear all" style={{ padding: '6px 10px' }}>
                  <FiTrash2 size={13} />
                </button>
              </div>
            </div>
            <div style={{
              display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px',
              maxHeight: '380px', overflowY: 'auto', padding: '4px',
            }}
              className="wheel-slots-grid"
            >
              {slots.map((food, i) => (
                <div
                  key={i}
                  onDragOver={e => { e.preventDefault(); setDragOverIndex(i); }}
                  onDragLeave={() => setDragOverIndex(null)}
                  onDrop={(e) => handleDrop(e, i)}
                  style={{
                    position: 'relative',
                    aspectRatio: '1', borderRadius: 'var(--radius-sm)',
                    border: `2px ${food ? 'solid' : 'dashed'} ${dragOverIndex === i ? 'var(--primary)' : food ? WHEEL_COLORS[i % 12] : 'var(--border)'}`,
                    background: food ? `${WHEEL_COLORS[i % 12]}15` : 'transparent',
                    display: 'flex', flexDirection: 'column',
                    alignItems: 'center', justifyContent: 'center',
                    cursor: food ? 'grab' : 'default',
                    transition: 'all 0.2s', userSelect: 'none',
                    padding: '4px',
                    transform: dragOverIndex === i ? 'scale(1.05)' : 'scale(1)',
                    overflow: 'hidden',
                  }}
                  draggable={!!food}
                  onDragStart={food ? (e) => handleDragStart(e, 'slot', food, i) : undefined}
                >
                  {food ? (
                    <>
                      <span style={{ fontSize: '24px', lineHeight: 1 }}>{food.image}</span>
                      <span style={{
                        fontSize: '10px', fontWeight: 600, color: 'var(--text)',
                        textAlign: 'center', lineHeight: 1.2, marginTop: '2px',
                        wordBreak: 'break-word',
                      }}>
                        {food.name.length > 8 ? food.name.slice(0, 8) + '..' : food.name}
                      </span>
                      <button
                        onClick={(e) => { e.stopPropagation(); removeSlot(i); }}
                        style={{
                          position: 'absolute', top: '2px', right: '2px',
                          width: '18px', height: '18px', borderRadius: '50%',
                          border: 'none', background: 'rgba(0,0,0,0.4)',
                          color: 'white', cursor: 'pointer',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: '10px', padding: 0, lineHeight: 1,
                        }}
                      >
                        <FiX size={10} />
                      </button>
                      <span style={{
                        position: 'absolute', bottom: '2px', left: '4px',
                        fontSize: '9px', fontWeight: 700, color: WHEEL_COLORS[i % 12],
                        opacity: 0.7,
                      }}>
                        {i + 1}
                      </span>
                    </>
                  ) : (
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)', textAlign: 'center', lineHeight: 1.3 }}>
                      Slot {i + 1}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="card" style={{ maxWidth: '520px', margin: '0 auto 32px' }}>
          <FoodWheel onResult={handleResult} foodsList={customList.slice(0, 12)} />
        </div>

        {customList.length === 0 && (
          <div className="card" style={{ textAlign: 'center', padding: '40px', maxWidth: '500px', margin: '0 auto' }}>
            <FiShuffle size={40} color="var(--text-muted)" />
            <p style={{ color: 'var(--text-secondary)', marginTop: '10px', fontSize: '14px' }}>
              Mag-drag ka ng pagkain mula sa "Available Foods" papunta sa "Your Wheel" slots para makapag-spin!
            </p>
          </div>
        )}
      </div>

      {result && (
        <div style={styles.overlay} onClick={() => setResult(null)}>
          <div className="card" style={styles.modal} onClick={e => e.stopPropagation()}>
            <button style={styles.closeBtn} onClick={() => setResult(null)}><FiX size={18} /></button>

            <div style={{ textAlign: 'center', marginBottom: '16px' }}>
              <span style={{ fontSize: '64px' }}>{result.food.image}</span>
              <h2 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text)', marginTop: '8px' }}>{result.food.name}</h2>
              <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginTop: '8px', flexWrap: 'wrap' }}>
                <span className="badge">{result.food.category}</span>
                <span className="badge" style={{
                  background: getMealType(result.food.category) === 'Ulam' ? '#E53935' : '#FF9800'
                }}>
                  {getMealType(result.food.category)}
                </span>
              </div>
              <p style={{ color: 'var(--primary)', fontWeight: 700, fontSize: '28px', margin: '10px 0' }}>
                {formatPeso(result.food.price)}
              </p>
              <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: 1.5 }}>{result.food.description}</p>
            </div>

            {result.recipe && (
              <>
                <div style={{ marginBottom: '16px', overflowX: 'auto' }}>
                  <h3 style={{ fontWeight: 700, marginBottom: '10px', color: 'var(--text)', fontSize: '15px' }}>Ingredients</h3>
                  <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '240px' }}>
                    <thead>
                      <tr style={{ borderBottom: '2px solid var(--border)' }}>
                        <th style={{ textAlign: 'left', padding: '6px', color: 'var(--text-secondary)', fontSize: '12px' }}>Item</th>
                        <th style={{ textAlign: 'center', padding: '6px', color: 'var(--text-secondary)', fontSize: '12px' }}>Amount</th>
                        <th style={{ textAlign: 'right', padding: '6px', color: 'var(--text-secondary)', fontSize: '12px' }}>Cost</th>
                      </tr>
                    </thead>
                    <tbody>
                      {result.recipe.ingredients.map((ing, i) => (
                        <tr key={i} style={{ borderBottom: '1px solid var(--border)' }}>
                          <td style={{ padding: '8px 6px', color: 'var(--text)', fontWeight: 500, fontSize: '13px' }}>{ing.name}</td>
                          <td style={{ padding: '8px 6px', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '13px' }}>{ing.grams}</td>
                          <td style={{ padding: '8px 6px', textAlign: 'right', color: 'var(--primary)', fontWeight: 600, fontSize: '13px' }}>{formatPeso(ing.cost)}</td>
                        </tr>
                      ))}
                      <tr>
                        <td style={{ padding: '8px 6px', fontWeight: 700, color: 'var(--text)', fontSize: '14px' }}>Total</td>
                        <td></td>
                        <td style={{ padding: '8px 6px', textAlign: 'right', fontWeight: 800, color: 'var(--primary)', fontSize: '18px' }}>{formatPeso(result.recipe.totalCost)}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div>
                  <h3 style={{ fontWeight: 700, marginBottom: '10px', color: 'var(--text)', fontSize: '15px' }}>Steps</h3>
                  <ol style={{ paddingLeft: '18px', margin: 0 }}>
                    {result.recipe.steps.map((step, i) => (
                      <li key={i} style={{ color: 'var(--text-secondary)', marginBottom: '8px', lineHeight: 1.5, fontSize: '13px' }}>{step}</li>
                    ))}
                  </ol>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  overlay: {
    position: 'fixed', inset: 0, zIndex: 2000,
    background: 'rgba(0,0,0,0.6)',
    backdropFilter: 'blur(4px)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    padding: '20px',
  },
  modal: {
    maxWidth: '480px', width: '100%',
    maxHeight: '85vh', overflowY: 'auto',
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
