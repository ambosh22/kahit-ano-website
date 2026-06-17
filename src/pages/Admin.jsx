import { useState } from 'react';
import foods from '../data/foods';
import recipes from '../data/recipes';
import restaurants from '../data/restaurants';
import { formatPeso } from '../utils/helpers';
import { FiSettings, FiDollarSign, FiBookOpen, FiHome, FiTrendingUp, FiPlus, FiEdit2, FiTrash2, FiStar } from 'react-icons/fi';

const tabs = ['Foods', 'Recipes', 'Restaurants', 'Analytics'];

export default function Admin() {
  const [activeTab, setActiveTab] = useState('Foods');

  const totalFoods = foods.length;
  const totalRecipes = recipes.length;
  const totalRestaurants = restaurants.length;
  const categories = [...new Set(foods.map(f => f.category))];
  const popularCategory = categories.map(cat => ({
    name: cat,
    count: foods.filter(f => f.category === cat).length,
  })).sort((a, b) => b.count - a.count);

  return (
    <div className="page">
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h1 className="section-title" style={{ fontSize: '36px', marginBottom: '8px' }}>
            Admin Dashboard
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '16px' }}>
            Manage your food database and view analytics
          </p>
        </div>

        <div className="card" style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center' }}>
            {tabs.map(tab => (
              <button
                key={tab}
                className={`btn btn-sm ${activeTab === tab ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {activeTab === 'Analytics' && (
          <div className="animate-fade">
            <div className="grid grid-3" style={{ marginBottom: '32px' }}>
              <div className="card" style={{ textAlign: 'center', padding: '28px' }}>
                <FiDollarSign size={36} color="var(--primary)" style={{ margin: '0 auto' }} />
                <h3 style={{ fontSize: '32px', fontWeight: 800, color: 'var(--primary)', margin: '8px 0' }}>{totalFoods}</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Total Foods</p>
              </div>
              <div className="card" style={{ textAlign: 'center', padding: '28px' }}>
                <FiBookOpen size={36} color="var(--primary)" style={{ margin: '0 auto' }} />
                <h3 style={{ fontSize: '32px', fontWeight: 800, color: 'var(--primary)', margin: '8px 0' }}>{totalRecipes}</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Total Recipes</p>
              </div>
              <div className="card" style={{ textAlign: 'center', padding: '28px' }}>
                <FiHome size={36} color="var(--primary)" style={{ margin: '0 auto' }} />
                <h3 style={{ fontSize: '32px', fontWeight: 800, color: 'var(--primary)', margin: '8px 0' }}>{totalRestaurants}</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Total Restaurants</p>
              </div>
            </div>

            <div className="card">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                <FiTrendingUp size={20} color="var(--primary)" />
                <h3 style={{ fontWeight: 700, color: 'var(--text)' }}>Popular Categories</h3>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {popularCategory.map((cat) => {
                  const maxCount = popularCategory[0]?.count || 1;
                  const pct = (cat.count / maxCount) * 100;
                  return (
                    <div key={cat.name}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                        <span style={{ color: 'var(--text)', fontSize: '14px' }}>{cat.name}</span>
                        <span style={{ color: 'var(--primary)', fontWeight: 600, fontSize: '14px' }}>{cat.count}</span>
                      </div>
                      <div style={{
                        height: '8px', background: 'var(--border)',
                        borderRadius: '50px', overflow: 'hidden',
                      }}>
                        <div style={{
                          height: '100%', width: `${pct}%`,
                          background: 'var(--gradient)',
                          borderRadius: '50px',
                          transition: 'width 0.5s ease',
                        }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'Foods' && (
          <div className="animate-fade">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontWeight: 700, color: 'var(--text)' }}>All Foods ({totalFoods})</h3>
              <button className="btn btn-primary btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <FiPlus size={14} /> Add Food
              </button>
            </div>
            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--border)', background: 'var(--bg-glass)' }}>
                      <th style={styles.th}>Image</th>
                      <th style={styles.th}>Name</th>
                      <th style={styles.th}>Category</th>
                      <th style={styles.th}>Price</th>
                      <th style={styles.th}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {foods.map(f => (
                      <tr key={f.id} style={{ borderBottom: '1px solid var(--border)' }}>
                        <td style={styles.td}><span style={{ fontSize: '24px' }}>{f.image}</span></td>
                        <td style={styles.td}><span style={{ fontWeight: 600, color: 'var(--text)' }}>{f.name}</span></td>
                        <td style={styles.td}><span className="badge">{f.category}</span></td>
                        <td style={styles.td}><span style={{ color: 'var(--primary)', fontWeight: 600 }}>{formatPeso(f.price)}</span></td>
                        <td style={styles.td}>
                          <div style={{ display: 'flex', gap: '6px' }}>
                            <button className="btn btn-sm btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '6px 12px' }}>
                              <FiEdit2 size={12} /> Edit
                            </button>
                            <button className="btn btn-sm btn-danger" style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '6px 12px' }}>
                              <FiTrash2 size={12} /> Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'Recipes' && (
          <div className="animate-fade">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontWeight: 700, color: 'var(--text)' }}>All Recipes ({totalRecipes})</h3>
              <button className="btn btn-primary btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <FiPlus size={14} /> Add Recipe
              </button>
            </div>
            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--border)', background: 'var(--bg-glass)' }}>
                      <th style={styles.th}>Image</th>
                      <th style={styles.th}>Name</th>
                      <th style={styles.th}>Category</th>
                      <th style={styles.th}>Cost</th>
                      <th style={styles.th}>Time</th>
                      <th style={styles.th}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recipes.map(r => (
                      <tr key={r.id} style={{ borderBottom: '1px solid var(--border)' }}>
                        <td style={styles.td}><span style={{ fontSize: '24px' }}>{r.image}</span></td>
                        <td style={styles.td}><span style={{ fontWeight: 600, color: 'var(--text)' }}>{r.name}</span></td>
                        <td style={styles.td}><span className="badge">{r.category}</span></td>
                        <td style={styles.td}><span style={{ color: 'var(--primary)', fontWeight: 600 }}>{formatPeso(r.totalCost)}</span></td>
                        <td style={styles.td}><span style={{ color: 'var(--text-secondary)' }}>{r.cookingTime}</span></td>
                        <td style={styles.td}>
                          <div style={{ display: 'flex', gap: '6px' }}>
                            <button className="btn btn-sm btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '6px 12px' }}>
                              <FiEdit2 size={12} /> Edit
                            </button>
                            <button className="btn btn-sm btn-danger" style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '6px 12px' }}>
                              <FiTrash2 size={12} /> Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'Restaurants' && (
          <div className="animate-fade">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontWeight: 700, color: 'var(--text)' }}>All Restaurants ({totalRestaurants})</h3>
              <button className="btn btn-primary btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <FiPlus size={14} /> Add Restaurant
              </button>
            </div>
            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--border)', background: 'var(--bg-glass)' }}>
                      <th style={styles.th}>Image</th>
                      <th style={styles.th}>Name</th>
                      <th style={styles.th}>Category</th>
                      <th style={styles.th}>Price Range</th>
                      <th style={styles.th}>Rating</th>
                      <th style={styles.th}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {restaurants.map(r => (
                      <tr key={r.id} style={{ borderBottom: '1px solid var(--border)' }}>
                        <td style={styles.td}><span style={{ fontSize: '24px' }}>{r.image}</span></td>
                        <td style={styles.td}><span style={{ fontWeight: 600, color: 'var(--text)' }}>{r.name}</span></td>
                        <td style={styles.td}><span className="badge">{r.category}</span></td>
                        <td style={styles.td}><span style={{ color: 'var(--text-secondary)' }}>{r.priceRange}</span></td>
                        <td style={styles.td}>
                          <span style={{ color: '#FFD700' }}>★</span>
                          <span style={{ fontWeight: 600 }}> {r.rating}</span>
                        </td>
                        <td style={styles.td}>
                          <div style={{ display: 'flex', gap: '6px' }}>
                            <button className="btn btn-sm btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '6px 12px' }}>
                              <FiEdit2 size={12} /> Edit
                            </button>
                            <button className="btn btn-sm btn-danger" style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '6px 12px' }}>
                              <FiTrash2 size={12} /> Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  th: {
    padding: '12px 16px', textAlign: 'left',
    fontSize: '13px', fontWeight: 600,
    color: 'var(--text-secondary)',
    whiteSpace: 'nowrap',
  },
  td: {
    padding: '12px 16px',
    fontSize: '14px',
    whiteSpace: 'nowrap',
  },
};
