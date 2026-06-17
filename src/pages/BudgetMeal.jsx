import { useState } from 'react';
import foods from '../data/foods';
import recipes from '../data/recipes';
import { formatPeso, getMealType } from '../utils/helpers';
import { FiDollarSign, FiSearch, FiClock, FiUsers, FiX, FiChevronRight } from 'react-icons/fi';

const presets = [50, 100, 200, 500];
const mealFilters = ['All', 'Pang Ulam', 'Pang Merienda'];

export default function BudgetMeal() {
  const [budget, setBudget] = useState(100);
  const [custom, setCustom] = useState('');
  const [analyzed, setAnalyzed] = useState(false);
  const [cookMealFilter, setCookMealFilter] = useState('All');
  const [buyMealFilter, setBuyMealFilter] = useState('All');
  const [selected, setSelected] = useState(null);
  const [selectedRecipe, setSelectedRecipe] = useState(null);

  const activeBudget = custom ? Number(custom) : budget;

  const affordableFoods = foods.filter(f => f.price <= activeBudget);
  const affordableRecipes = recipes.filter(r => r.totalCost <= activeBudget);

  const filteredRecipes = affordableRecipes.filter(r =>
    cookMealFilter === 'All' || getMealType(r.category) === cookMealFilter
  );
  const filteredFoods = affordableFoods.filter(f =>
    buyMealFilter === 'All' || getMealType(f.category) === buyMealFilter
  );

  const hasResults = filteredFoods.length > 0 || filteredRecipes.length > 0;

  const handleAnalyze = () => {
    if (custom && Number(custom) > 0) setBudget(Number(custom));
    setAnalyzed(true);
  };

  const handleFoodClick = (food) => {
    const match = recipes.find(r =>
      r.name.toLowerCase().includes(food.name.toLowerCase()) ||
      food.name.toLowerCase().includes(r.name.toLowerCase())
    );
    setSelected(food);
    setSelectedRecipe(match || null);
  };

  const closeModal = () => {
    setSelected(null);
    setSelectedRecipe(null);
  };

  return (
    <div className="page">
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h1 className="section-title" style={{ fontSize: '36px', marginBottom: '8px' }}>
            Budget Meal Finder
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '16px' }}>
            Ilan ba pera mo? Kami na bahala mag-plan ng meals mo!
          </p>
        </div>

        <div className="card" style={{ maxWidth: '600px', margin: '0 auto 40px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <FiDollarSign size={20} color="var(--primary)" />
            <h3 style={{ fontWeight: 700, color: 'var(--text)' }}>Magkano budget mo?</h3>
          </div>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '16px' }}>
            {presets.map(p => (
              <button
                key={p}
                className={`btn ${budget === p && !custom ? 'btn-primary' : 'btn-secondary'} btn-sm`}
                onClick={() => { setBudget(p); setCustom(''); setAnalyzed(false); }}
              >
                ₱{p}
              </button>
            ))}
          </div>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <input
              type="number"
              placeholder="Custom amount"
              value={custom}
              onChange={e => setCustom(e.target.value)}
              style={styles.input}
            />
            <button className="btn btn-primary" onClick={handleAnalyze} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <FiSearch size={16} />
              Analyze
            </button>
          </div>
        </div>

        {analyzed && (
          <div className="animate-fade">
            {!hasResults && (
              <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
                <span style={{ fontSize: '64px' }}>😅</span>
                <p style={{ color: 'var(--text-secondary)', marginTop: '12px', fontSize: '16px' }}>
                  Walang match sa ₱{activeBudget} na budget. Try magdagdag ng konti!
                </p>
              </div>
            )}

            {filteredRecipes.length > 0 && (
              <div style={{ marginBottom: '40px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '8px' }}>
                  <h2 className="section-title" style={{ margin: 0 }}>Food You Can Cook (₱{activeBudget})</h2>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    {mealFilters.map(f => (
                      <button
                        key={f}
                        className={`btn btn-sm ${cookMealFilter === f ? 'btn-primary' : 'btn-secondary'}`}
                        onClick={() => setCookMealFilter(f)}
                        style={{ fontSize: '12px', padding: '5px 12px' }}
                      >
                        {f === 'Pang Ulam' ? '🍖 Ulam' : f === 'Pang Merienda' ? '🍿 Merienda' : 'All'}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="grid grid-2">
                  {filteredRecipes.map(recipe => {
                    const remaining = activeBudget - recipe.totalCost;
                    return (
                      <div key={recipe.id} className="card" onClick={() => { setSelected(recipe); setSelectedRecipe(recipe); }} style={{ cursor: 'pointer' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                          <div>
                            <div style={{ fontSize: '32px', marginBottom: '4px' }}>{recipe.image}</div>
                            <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text)' }}>{recipe.name}</h3>
                          </div>
                          <div style={{ textAlign: 'right' }}>
                            <div style={{ color: remaining >= 0 ? '#4CAF50' : '#EF4444', fontWeight: 700, fontSize: '20px' }}>
                              {formatPeso(recipe.totalCost)}
                            </div>
                            <div style={{ color: 'var(--text-muted)', fontSize: '12px' }}>
                              Remaining: {formatPeso(remaining)}
                            </div>
                          </div>
                        </div>
                        <div style={styles.badges}>
                          <span className="badge" style={{ background: '#4CAF50', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <FiClock size={10} /> {recipe.cookingTime}
                          </span>
                          <span className="badge" style={{ background: '#2196F3', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <FiUsers size={10} /> {recipe.servings} servings
                          </span>
                          <span className="badge" style={{ background: getMealType(recipe.category) === 'Ulam' ? '#E53935' : '#FF9800' }}>
                            {getMealType(recipe.category)}
                          </span>
                        </div>
                        <div style={{ marginTop: '10px' }}>
                          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '6px' }}>Ingredients:</p>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                            {recipe.ingredients.map((ing, i) => (
                              <span key={i} style={{
                                background: 'rgba(255,107,53,0.1)', padding: '3px 8px',
                                borderRadius: '50px', fontSize: '11px', color: 'var(--text-secondary)',
                              }}>
                                {ing.name} ({ing.grams}) — {formatPeso(ing.cost)}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div style={{ marginTop: '8px', display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--primary)', fontSize: '13px', fontWeight: 600 }}>
                          View full recipe <FiChevronRight size={14} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {filteredFoods.length > 0 && (
              <div style={{ marginBottom: '40px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '8px' }}>
                  <h2 className="section-title" style={{ margin: 0 }}>Food You Can Buy (₱{activeBudget})</h2>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    {mealFilters.map(f => (
                      <button
                        key={f}
                        className={`btn btn-sm ${buyMealFilter === f ? 'btn-primary' : 'btn-secondary'}`}
                        onClick={() => setBuyMealFilter(f)}
                        style={{ fontSize: '12px', padding: '5px 12px' }}
                      >
                        {f === 'Pang Ulam' ? '🍖 Ulam' : f === 'Pang Merienda' ? '🍿 Merienda' : 'All'}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="grid grid-4">
                  {filteredFoods.map(food => (
                    <div key={food.id} className="card" style={{ textAlign: 'center', padding: '20px', cursor: 'pointer' }}
                      onClick={() => handleFoodClick(food)}>
                      <span style={{ fontSize: 48, display: 'block', marginBottom: '8px' }}>{food.image}</span>
                      <h3 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text)' }}>{food.name}</h3>
                      <span className="badge" style={{ margin: '6px 0' }}>{food.category}</span>
                      <p style={{ color: 'var(--primary)', fontWeight: 700, fontSize: '20px' }}>{formatPeso(food.price)}</p>
                      <span className="badge" style={{ background: getMealType(food.category) === 'Ulam' ? '#E53935' : '#FF9800', fontSize: '10px' }}>
                        {getMealType(food.category)}
                      </span>
                      <div style={{ marginTop: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', color: 'var(--primary)', fontSize: '12px', fontWeight: 600 }}>
                        See recipe <FiChevronRight size={12} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {selected && selectedRecipe && (
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

              {selected && !('steps' in selected) && (
                <div style={{ marginTop: '16px', padding: '12px', background: 'rgba(255,107,53,0.08)', borderRadius: 'var(--radius-sm)' }}>
                  <p style={{ fontSize: '13px', color: 'var(--text-secondary)', textAlign: 'center' }}>
                    Bumili ka na lang ng <strong>{selected.name}</strong> sa halagang {formatPeso(selected.price)} — 
                    or lutuin mo gamit ang recipe sa taas!
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {selected && !selectedRecipe && (
          <div style={styles.overlay} onClick={closeModal}>
            <div className="card" style={{ ...styles.modal, maxWidth: '400px' }} onClick={e => e.stopPropagation()}>
              <button style={styles.closeBtn} onClick={closeModal}><FiX size={18} /></button>
              <div style={{ textAlign: 'center', padding: '20px 0' }}>
                <span style={{ fontSize: '64px' }}>{selected.image}</span>
                <h2 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text)', marginTop: '12px' }}>{selected.name}</h2>
                <span className="badge" style={{ margin: '8px 0' }}>{selected.category}</span>
                <p style={{ color: 'var(--primary)', fontWeight: 700, fontSize: '28px', margin: '12px 0' }}>{formatPeso(selected.price)}</p>
                <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: 1.5 }}>{selected.description}</p>
                <div style={{ marginTop: '16px', padding: '12px', background: 'rgba(255,107,53,0.08)', borderRadius: 'var(--radius-sm)' }}>
                  <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                    Pwedeng bumili nito sa <strong>{selected.price <= 50 ? 'karinderya' : selected.price <= 100 ? 'fast food' : 'restaurant'}</strong> 
                    {' '}sa halagang {formatPeso(selected.price)}. Budget-friendly!
                  </p>
                </div>
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
    flex: 1, padding: '12px 16px',
    borderRadius: '50px', border: '2px solid var(--border)',
    background: 'var(--bg-card)', color: 'var(--text)',
    fontSize: '16px',
    transition: 'border-color 0.2s',
  },
  badges: { display: 'flex', gap: '8px', flexWrap: 'wrap' },
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
