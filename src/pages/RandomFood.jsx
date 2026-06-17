import { useState } from 'react';
import FoodWheel from '../components/FoodWheel';
import recipes from '../data/recipes';
import foods from '../data/foods';
import { formatPeso, getMealType } from '../utils/helpers';
import { FiShuffle, FiClock, FiUsers, FiX, FiChevronRight } from 'react-icons/fi';

const mealFilters = ['All', 'Ulam', 'Merienda'];

export default function RandomFood() {
  const [selectedFood, setSelectedFood] = useState(null);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [mealFilter, setMealFilter] = useState('All');

  const filtered = foods.filter(f =>
    mealFilter === 'All' || getMealType(f.category) === mealFilter
  );

  const handleFoodSelect = (food) => {
    const match = recipes.find(r =>
      r.name.toLowerCase().includes(food.name.toLowerCase()) ||
      food.name.toLowerCase().includes(r.name.toLowerCase())
    );
    setSelectedFood(food);
    setSelectedRecipe(match || null);
  };

  const closeModal = () => {
    setSelectedFood(null);
    setSelectedRecipe(null);
  };

  return (
    <div className="page">
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h1 className="section-title" style={{ fontSize: '36px', marginBottom: '8px' }}>
            Random Food Picker
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '16px' }}>
            Hindi mo alam gusto mo? Hayaan mo na si Wheel of Food ang mag-decide!
          </p>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
            {mealFilters.map(f => (
              <button
                key={f}
                className={`btn btn-sm ${mealFilter === f ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setMealFilter(f)}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <div className="card" style={{ maxWidth: '500px', margin: '0 auto 40px' }}>
          <FoodWheel onResult={handleFoodSelect} foodsList={filtered} />
        </div>

        <div style={{ marginTop: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2 className="section-title" style={{ margin: 0 }}>
              {mealFilter === 'All' ? 'All' : mealFilter}
              <span style={{ fontSize: '16px', color: 'var(--text-secondary)', fontWeight: 400 }}> ({filtered.length})</span>
            </h2>
          </div>

          <div className="grid grid-4">
            {filtered.map(food => (
              <div
                key={food.id}
                className="card"
                style={{ cursor: 'pointer', textAlign: 'center', padding: '20px' }}
                onClick={() => handleFoodSelect(food)}
              >
                <span style={{ fontSize: '48px', display: 'block', marginBottom: '8px' }}>{food.image}</span>
                <h3 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text)', marginBottom: '4px' }}>
                  {food.name}{' '}
                  <span style={{ fontSize: '11px', fontWeight: 400, color: getMealType(food.category) === 'Ulam' ? '#E53935' : '#FF9800' }}>
                    ({getMealType(food.category).toLowerCase()})
                  </span>
                </h3>
                <span className="badge" style={{ marginBottom: '4px' }}>{food.category}</span>
                <p style={{ color: 'var(--primary)', fontWeight: 700, fontSize: '18px', marginTop: '6px' }}>{formatPeso(food.price)}</p>
                {recipes.some(r =>
                  r.name.toLowerCase().includes(food.name.toLowerCase()) ||
                  food.name.toLowerCase().includes(r.name.toLowerCase())
                ) && (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', color: 'var(--primary)', fontSize: '11px', fontWeight: 600, marginTop: '4px' }}>
                    May recipe <FiChevronRight size={11} />
                  </div>
                )}
              </div>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
              <FiShuffle size={48} color="var(--text-muted)" />
              <p style={{ color: 'var(--text-secondary)', marginTop: '12px' }}>No foods found.</p>
            </div>
          )}
        </div>
      </div>

      {selectedFood && selectedRecipe && (
        <div style={styles.overlay} onClick={closeModal}>
          <div className="card" style={styles.modal} onClick={e => e.stopPropagation()}>
            <button style={styles.closeBtn} onClick={closeModal}><FiX size={18} /></button>

            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <span style={{ fontSize: '64px' }}>{selectedRecipe.image}</span>
              <h2 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text)', marginTop: '8px' }}>{selectedRecipe.name}</h2>
              <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginTop: '8px', flexWrap: 'wrap' }}>
                <span className="badge" style={{ background: '#4CAF50', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <FiClock size={12} /> {selectedRecipe.cookingTime}
                </span>
                <span className="badge" style={{ background: '#2196F3', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <FiUsers size={12} /> {selectedRecipe.servings} servings
                </span>
                <span className="badge">{selectedRecipe.category}</span>
                <span className="badge" style={{ background: getMealType(selectedRecipe.category) === 'Ulam' ? '#E53935' : '#FF9800' }}>
                  {getMealType(selectedRecipe.category)}
                </span>
                <span className="badge" style={{ background: '#FF6B35' }}>
                  Total: {formatPeso(selectedRecipe.totalCost)}
                </span>
              </div>
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginTop: '10px' }}>
                <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                  Bili: <strong style={{ color: 'var(--primary)' }}>{formatPeso(selectedFood.price)}</strong>
                </span>
                <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                  Lutò: <strong style={{ color: selectedRecipe.totalCost <= selectedFood.price ? '#4CAF50' : '#FF9800' }}>{formatPeso(selectedRecipe.totalCost)}</strong>
                </span>
              </div>
            </div>

            <div style={{ marginBottom: '20px', overflowX: 'auto' }}>
              <h3 style={{ fontWeight: 700, marginBottom: '12px', color: 'var(--text)' }}>Ingredients</h3>
              <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '280px' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid var(--border)' }}>
                    <th style={{ textAlign: 'left', padding: '8px', color: 'var(--text-secondary)', fontSize: '13px' }}>Item</th>
                    <th style={{ textAlign: 'center', padding: '8px', color: 'var(--text-secondary)', fontSize: '13px' }}>Amount</th>
                    <th style={{ textAlign: 'right', padding: '8px', color: 'var(--text-secondary)', fontSize: '13px' }}>Cost</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedRecipe.ingredients.map((ing, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid var(--border)' }}>
                      <td style={{ padding: '10px 8px', color: 'var(--text)', fontWeight: 500 }}>{ing.name}</td>
                      <td style={{ padding: '10px 8px', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '14px' }}>{ing.grams}</td>
                      <td style={{ padding: '10px 8px', textAlign: 'right', color: 'var(--primary)', fontWeight: 600 }}>{formatPeso(ing.cost)}</td>
                    </tr>
                  ))}
                  <tr>
                    <td style={{ padding: '10px 8px', fontWeight: 700, color: 'var(--text)', fontSize: '15px' }}>Total</td>
                    <td style={{ padding: '10px 8px' }}></td>
                    <td style={{ padding: '10px 8px', textAlign: 'right', fontWeight: 800, color: 'var(--primary)', fontSize: '20px' }}>{formatPeso(selectedRecipe.totalCost)}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div>
              <h3 style={{ fontWeight: 700, marginBottom: '12px', color: 'var(--text)' }}>Steps</h3>
              <ol style={{ paddingLeft: '20px', margin: 0 }}>
                {selectedRecipe.steps.map((step, i) => (
                  <li key={i} style={{ color: 'var(--text-secondary)', marginBottom: '10px', lineHeight: 1.5, fontSize: '14px' }}>{step}</li>
                ))}
              </ol>
            </div>

            <div style={{ marginTop: '16px', padding: '12px', background: 'rgba(255,107,53,0.08)', borderRadius: 'var(--radius-sm)' }}>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', textAlign: 'center' }}>
                Bumili ng <strong>{selectedFood.name}</strong> sa halagang <strong>{formatPeso(selectedFood.price)}</strong>
                {' '}o lutuin gamit ang recipe sa taas ng <strong>{formatPeso(selectedRecipe.totalCost)}</strong>!
              </p>
            </div>
          </div>
        </div>
      )}

      {selectedFood && !selectedRecipe && (
        <div style={styles.overlay} onClick={closeModal}>
          <div className="card" style={{ ...styles.modal, maxWidth: '400px' }} onClick={e => e.stopPropagation()}>
            <button style={styles.closeBtn} onClick={closeModal}><FiX size={18} /></button>
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
              <span style={{ fontSize: '64px' }}>{selectedFood.image}</span>
              <h2 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text)', marginTop: '12px' }}>{selectedFood.name}</h2>
              <span className="badge" style={{ margin: '8px 0' }}>{selectedFood.category}</span>
              <p style={{ color: 'var(--primary)', fontWeight: 700, fontSize: '28px', margin: '12px 0' }}>{formatPeso(selectedFood.price)}</p>
              <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: 1.5 }}>{selectedFood.description}</p>
              <div style={{ marginTop: '16px', padding: '12px', background: 'rgba(255,107,53,0.08)', borderRadius: 'var(--radius-sm)' }}>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                  Pwedeng bumili nito sa <strong>{selectedFood.price <= 50 ? 'karinderya' : selectedFood.price <= 100 ? 'fast food' : 'restaurant'}</strong>
                  {' '}sa halagang {formatPeso(selectedFood.price)}. Budget-friendly!
                </p>
              </div>
            </div>
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
    maxWidth: '520px', width: '100%',
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
