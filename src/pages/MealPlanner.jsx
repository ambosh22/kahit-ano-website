import { useState } from 'react';
import foods from '../data/foods';
import recipes from '../data/recipes';
import { formatPeso, getMealType } from '../utils/helpers';
import { FiCalendar, FiShoppingBag, FiX, FiCheck, FiPlus, FiClock, FiUsers, FiChevronRight } from 'react-icons/fi';

const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const meals = ['Breakfast', 'Lunch', 'Dinner', 'Snack'];

export default function MealPlanner() {
  const [plan, setPlan] = useState({});
  const [showPicker, setShowPicker] = useState(null);
  const [filter, setFilter] = useState('All');

  const filtered = foods.filter(f =>
    filter === 'All' || getMealType(f.category) === filter
  );

  const pickFood = (food) => {
    setPlan(prev => ({
      ...prev,
      [`${showPicker.day}-${showPicker.meal}`]: food,
    }));
    setShowPicker(null);
  };

  const removeFood = (day, meal) => {
    setPlan(prev => {
      const next = { ...prev };
      delete next[`${day}-${meal}`];
      return next;
    });
  };

  const selectedFoods = Object.values(plan);
  const totalCost = selectedFoods.reduce((sum, f) => sum + f.price, 0);
  const groceryItems = [...new Set(selectedFoods.map(f => f.name))];

  return (
    <div className="page">
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h1 className="section-title" style={{ fontSize: '36px', marginBottom: '8px' }}>
            Meal Planner
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '16px' }}>
            Plan your baon at budget for the week!
          </p>
        </div>

        <div className="card" style={{ padding: '20px', marginBottom: '24px', overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '600px' }}>
            <thead>
              <tr>
                <th style={{ padding: '10px', textAlign: 'left', color: 'var(--text-secondary)', fontSize: '13px', borderBottom: '2px solid var(--border)' }}></th>
                {days.map(d => (
                  <th key={d} style={{ padding: '10px', textAlign: 'center', color: 'var(--primary)', fontWeight: 700, fontSize: '14px', borderBottom: '2px solid var(--border)' }}>{d}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {meals.map(meal => (
                <tr key={meal}>
                  <td style={{ padding: '10px', fontWeight: 600, color: 'var(--text)', borderBottom: '1px solid var(--border)', whiteSpace: 'nowrap' }}>{meal}</td>
                  {days.map(day => {
                    const key = `${day}-${meal}`;
                    const picked = plan[key];
                    return (
                      <td key={key} style={{ padding: '6px', textAlign: 'center', borderBottom: '1px solid var(--border)', verticalAlign: 'top' }}>
                        {picked ? (
                          <div style={{ background: `${getMealType(picked.category) === 'Ulam' ? '#E53935' : '#FF9800'}15`, borderRadius: '8px', padding: '6px', position: 'relative' }}>
                            <button onClick={() => removeFood(day, meal)} style={{ position: 'absolute', top: '2px', right: '4px', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', fontSize: '12px', padding: '2px' }}><FiX size={12} /></button>
                            <div style={{ fontSize: '24px' }}>{picked.image}</div>
                            <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text)', marginTop: '2px', lineHeight: 1.2 }}>{picked.name}</div>
                            <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--primary)' }}>{formatPeso(picked.price)}</div>
                          </div>
                        ) : (
                          <button onClick={() => setShowPicker({ day, meal })} style={{ width: '100%', padding: '12px 4px', background: 'var(--bg-glass)', border: '1px dashed var(--border)', borderRadius: '8px', cursor: 'pointer', color: 'var(--text-muted)', fontSize: '11px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                            <FiPlus size={14} />
                            Add
                          </button>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {Object.keys(plan).length > 0 && (
          <div className="card" style={{ padding: '20px', marginBottom: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <FiShoppingBag size={20} color="var(--primary)" />
              <h3 style={{ fontWeight: 700, color: 'var(--text)' }}>Grocery List</h3>
              <span style={{ marginLeft: 'auto', fontSize: '18px', fontWeight: 800, color: 'var(--primary)' }}>{formatPeso(totalCost)}</span>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {groceryItems.map((item, i) => (
                <span key={i} className="badge" style={{ background: 'var(--bg-glass)', color: 'var(--text)', border: '1px solid var(--border)', fontSize: '13px', padding: '6px 14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <FiCheck size={12} color="#4CAF50" /> {item}
                </span>
              ))}
            </div>
          </div>
        )}

        {showPicker && (
          <div style={styles.overlay} onClick={() => setShowPicker(null)}>
            <div className="card" style={styles.modal} onClick={e => e.stopPropagation()}>
              <button style={styles.closeBtn} onClick={() => setShowPicker(null)}><FiX size={18} /></button>
              <h3 style={{ fontWeight: 700, color: 'var(--text)', marginBottom: '12px' }}>
                Pick a food for {showPicker.day} - {showPicker.meal}
              </h3>
              <div style={{ display: 'flex', gap: '6px', marginBottom: '16px', flexWrap: 'wrap' }}>
                {['All', 'Ulam', 'Merienda'].map(f => (
                  <button key={f} className={`btn btn-sm ${filter === f ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setFilter(f)}>{f}</button>
                ))}
              </div>
              <div style={{ maxHeight: '300px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {filtered.map(food => (
                  <div key={food.id} onClick={() => pickFood(food)} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 14px', borderRadius: 'var(--radius-sm)', cursor: 'pointer', border: '1px solid var(--border)' }}>
                    <span style={{ fontSize: 28 }}>{food.image}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600, color: 'var(--text)', fontSize: '14px' }}>{food.name}</div>
                      <span className="badge" style={{ fontSize: '10px', background: getMealType(food.category) === 'Ulam' ? '#E53935' : '#FF9800' }}>{getMealType(food.category)}</span>
                    </div>
                    <span style={{ fontWeight: 700, color: 'var(--primary)' }}>{formatPeso(food.price)}</span>
                    <FiChevronRight size={16} color="var(--text-muted)" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="card" style={{ padding: '20px', textAlign: 'center', background: 'var(--gradient)', color: 'white' }}>
          <FiCalendar size={28} style={{ marginBottom: '8px' }} />
          <h3 style={{ fontWeight: 700, fontSize: '18px', marginBottom: '4px' }}>{Object.keys(plan).length} meals planned</h3>
          <p style={{ opacity: 0.9, fontSize: '14px' }}>Total budget: {formatPeso(totalCost)} | {groceryItems.length} unique items</p>
        </div>
      </div>
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
    maxHeight: '80vh', overflowY: 'auto',
    position: 'relative',
    padding: '24px',
  },
  closeBtn: {
    position: 'sticky', top: '0', float: 'right',
    width: '36px', height: '36px', borderRadius: '50%', border: 'none',
    background: 'rgba(0,0,0,0.1)', cursor: 'pointer',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    color: 'var(--text)',
  },
};
