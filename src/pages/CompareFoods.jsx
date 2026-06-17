import { useState } from 'react';
import foods from '../data/foods';
import recipes from '../data/recipes';
import { formatPeso, getMealType } from '../utils/helpers';
import { FiGitBranch, FiSearch, FiClock, FiUsers, FiX, FiDollarSign } from 'react-icons/fi';

export default function CompareFoods() {
  const [foodA, setFoodA] = useState(null);
  const [foodB, setFoodB] = useState(null);
  const [searchA, setSearchA] = useState('');
  const [searchB, setSearchB] = useState('');
  const [showSearch, setShowSearch] = useState(null);

  const searchResults = (keyword) => {
    if (!keyword.trim()) return [];
    return foods.filter(f => f.name.toLowerCase().includes(keyword.toLowerCase())).slice(0, 6);
  };

  const selectFood = (slot, food) => {
    if (slot === 'A') setFoodA(food);
    else setFoodB(food);
    setShowSearch(null);
    setSearchA('');
    setSearchB('');
  };

  const recipeA = foodA ? recipes.find(r =>
    r.name.toLowerCase().includes(foodA.name.toLowerCase()) ||
    foodA.name.toLowerCase().includes(r.name.toLowerCase())
  ) : null;

  const recipeB = foodB ? recipes.find(r =>
    r.name.toLowerCase().includes(foodB.name.toLowerCase()) ||
    foodB.name.toLowerCase().includes(r.name.toLowerCase())
  ) : null;

  const Row = ({ label, a, b, colorA, colorB }) => (
    <tr style={{ borderBottom: '1px solid var(--border)' }}>
      <td style={{ padding: '14px 12px', color: 'var(--text-secondary)', fontWeight: 500, fontSize: '14px', whiteSpace: 'nowrap' }}>{label}</td>
      <td style={{ padding: '14px 12px', textAlign: 'center', fontWeight: 600, color: colorA || 'var(--text)', fontSize: '15px' }}>{a}</td>
      <td style={{ padding: '14px 12px', textAlign: 'center', fontWeight: 600, color: colorB || 'var(--text)', fontSize: '15px' }}>{b}</td>
    </tr>
  );

  return (
    <div className="page">
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h1 className="section-title" style={{ fontSize: '36px', marginBottom: '8px' }}>
            Compare Foods
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '16px' }}>
            Alin mas sulit? Alin mas practical? Compare mo na!
          </p>
        </div>

        <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
          {['A', 'B'].map(slot => {
            const food = slot === 'A' ? foodA : foodB;
            const search = slot === 'A' ? searchA : searchB;
            const setSearch = slot === 'A' ? setSearchA : setSearchB;
            return (
              <div key={slot} style={{ flex: 1, minWidth: '280px' }}>
                <div className="card" style={{ padding: '20px', textAlign: 'center' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px', fontWeight: 800, fontSize: '18px', color: '#fff' }}>{slot}</div>
                  {food ? (
                    <div>
                      <div style={{ fontSize: 48, marginBottom: 8 }}>{food.image}</div>
                      <h3 style={{ fontWeight: 700, color: 'var(--text)', fontSize: '18px' }}>{food.name}</h3>
                      <span className="badge" style={{ background: getMealType(food.category) === 'Ulam' ? '#E53935' : '#FF9800' }}>{getMealType(food.category)}</span>
                      <button onClick={() => selectFood(slot, null)} style={{ display: 'block', margin: '10px auto 0', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '12px', textDecoration: 'underline' }}>Change</button>
                    </div>
                  ) : (
                    <div>
                      <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'var(--bg-glass)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px', border: '2px dashed var(--border)' }}>
                        <FiSearch size={24} color="var(--text-muted)" />
                      </div>
                      <button className="btn btn-primary" onClick={() => setShowSearch(slot)} style={{ display: 'flex', alignItems: 'center', gap: '6px', margin: '0 auto' }}>
                        <FiSearch size={14} /> Pick Food {slot}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {showSearch && (
          <div style={styles.overlay} onClick={() => { setShowSearch(null); setSearchA(''); setSearchB(''); }}>
            <div className="card" style={styles.modal} onClick={e => e.stopPropagation()}>
              <button style={styles.closeBtn} onClick={() => { setShowSearch(null); setSearchA(''); setSearchB(''); }}><FiX size={18} /></button>
              <h3 style={{ fontWeight: 700, color: 'var(--text)', marginBottom: '12px' }}>Pick Food {showSearch}</h3>
              <input
                type="text"
                placeholder="Search food..."
                value={showSearch === 'A' ? searchA : searchB}
                onChange={e => {
                  if (showSearch === 'A') setSearchA(e.target.value);
                  else setSearchB(e.target.value);
                }}
                style={styles.searchInput}
                autoFocus
              />
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '12px', maxHeight: '300px', overflowY: 'auto' }}>
                {searchResults(showSearch === 'A' ? searchA : searchB).map(f => (
                  <div key={f.id} onClick={() => selectFood(showSearch, f)} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 14px', borderRadius: 'var(--radius-sm)', cursor: 'pointer', border: '1px solid var(--border)' }}>
                    <span style={{ fontSize: '28px' }}>{f.image}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600, color: 'var(--text)', fontSize: '14px' }}>{f.name}</div>
                      <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{f.category}</span>
                    </div>
                    <span style={{ fontWeight: 700, color: 'var(--primary)' }}>{formatPeso(f.price)}</span>
                  </div>
                ))}
                {searchResults(showSearch === 'A' ? searchA : searchB).length === 0 && <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '20px', fontSize: '14px' }}>Type to search foods...</p>}
              </div>
            </div>
          </div>
        )}

        {foodA && foodB && (
          <div className="card animate-fade" style={{ padding: '20px', marginTop: '24px', overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '350px' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--border)' }}>
                  <th style={{ padding: '12px', textAlign: 'left', color: 'var(--text-secondary)', fontSize: '13px' }}>Attribute</th>
                  <th style={{ padding: '12px', textAlign: 'center', color: 'var(--primary)', fontSize: '14px', fontWeight: 700 }}>
                    <span style={{ fontSize: '24px', display: 'block', marginBottom: '4px' }}>{foodA.image}</span>
                    {foodA.name}
                  </th>
                  <th style={{ padding: '12px', textAlign: 'center', color: 'var(--primary)', fontSize: '14px', fontWeight: 700 }}>
                    <span style={{ fontSize: '24px', display: 'block', marginBottom: '4px' }}>{foodB.image}</span>
                    {foodB.name}
                  </th>
                </tr>
              </thead>
              <tbody>
                <Row label="Price" a={formatPeso(foodA.price)} b={formatPeso(foodB.price)}
                  colorA={foodA.price < foodB.price ? '#4CAF50' : foodA.price > foodB.price ? '#E53935' : undefined}
                  colorB={foodB.price < foodA.price ? '#4CAF50' : foodB.price > foodA.price ? '#E53935' : undefined} />
                <Row label="Category" a={foodA.category} b={foodB.category} />
                <Row label="Type" a={getMealType(foodA.category)} b={getMealType(foodB.category)}
                  colorA={getMealType(foodA.category) === 'Ulam' ? '#E53935' : '#FF9800'}
                  colorB={getMealType(foodB.category) === 'Ulam' ? '#E53935' : '#FF9800'} />
                <Row label="Recipe Available" a={recipeA ? 'Yes' : 'No'} b={recipeB ? 'Yes' : 'No'}
                  colorA={recipeA ? '#4CAF50' : '#E53935'} colorB={recipeB ? '#4CAF50' : '#E53935'} />
                {recipeA && recipeB && (
                  <>
                    <Row label="Cooking Time" a={recipeA.cookingTime} b={recipeB.cookingTime} />
                    <Row label="Servings" a={`${recipeA.servings}`} b={`${recipeB.servings}`} />
                    <Row label="Recipe Cost" a={formatPeso(recipeA.totalCost)} b={formatPeso(recipeB.totalCost)}
                      colorA={recipeA.totalCost < recipeB.totalCost ? '#4CAF50' : recipeA.totalCost > recipeB.totalCost ? '#E53935' : undefined}
                      colorB={recipeB.totalCost < recipeA.totalCost ? '#4CAF50' : recipeB.totalCost > recipeA.totalCost ? '#E53935' : undefined} />
                  </>
                )}
              </tbody>
            </table>
            <div style={{ marginTop: '16px', padding: '12px', borderRadius: 'var(--radius-sm)', background: 'rgba(255,107,53,0.08)', textAlign: 'center' }}>
              <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
                {foodA.price < foodB.price
                  ? `${foodA.name} is mas mura by ${formatPeso(foodB.price - foodA.price)}!`
                  : foodA.price > foodB.price
                  ? `${foodB.name} is mas mura by ${formatPeso(foodA.price - foodB.price)}!`
                  : `Same price! Compare ingredients or recipes to decide.`}
              </p>
            </div>
          </div>
        )}
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
    maxWidth: '420px', width: '100%',
    maxHeight: '80vh', overflowY: 'auto',
    position: 'relative', padding: '24px',
  },
  closeBtn: {
    position: 'sticky', top: '0', float: 'right',
    width: '36px', height: '36px', borderRadius: '50%', border: 'none',
    background: 'rgba(0,0,0,0.1)', cursor: 'pointer',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    color: 'var(--text)',
  },
  searchInput: {
    width: '100%', padding: '12px 16px',
    borderRadius: '50px', border: '2px solid var(--border)',
    background: 'var(--bg-card)', color: 'var(--text)',
    fontSize: '14px', boxSizing: 'border-box',
  },
};
