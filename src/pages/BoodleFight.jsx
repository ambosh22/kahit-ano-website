import { useState } from 'react';
import foods from '../data/foods';
import { formatPeso, getMealType } from '../utils/helpers';
import { FiUsers, FiRotateCcw, FiHeart, FiShare2, FiPlus } from 'react-icons/fi';

const boodleNames = [
  'Boodle Fight Supreme',
  'Barkada Feast',
  'Family Fiesta',
  'Pambansang Boodle',
  'Eat All You Can Special',
  'Tagaytay Picnic Platter',
  'Beach Day Boodle',
  'Kapitbahayan Handaan',
];

function generatePlatter(size) {
  const ulamList = foods.filter(f => getMealType(f.category) === 'Ulam');
  const meriendaList = foods.filter(f => getMealType(f.category) === 'Merienda');
  const shuffled = [...ulamList].sort(() => Math.random() - 0.5);
  const count = size <= 2 ? 3 : size <= 4 ? 4 : 5;
  const dishes = shuffled.slice(0, Math.min(count, shuffled.length));
  if (dishes.length < count) {
    const extra = [...meriendaList].sort(() => Math.random() - 0.5);
    dishes.push(...extra.slice(0, count - dishes.length));
  }
  const total = dishes.reduce((sum, d) => sum + d.price, 0);
  return {
    name: boodleNames[Math.floor(Math.random() * boodleNames.length)],
    dishes,
    total,
    perPerson: Math.round(total / size),
  };
}

export default function BoodleFight() {
  const [groupSize, setGroupSize] = useState(4);
  const [platter, setPlatter] = useState(null);
  const [saved, setSaved] = useState([]);

  const generate = () => setPlatter(generatePlatter(groupSize));

  const savePlatter = () => {
    if (!platter) return;
    if (saved.find(s => s.name === platter.name && s.total === platter.total)) return;
    setSaved(prev => [platter, ...prev]);
  };

  return (
    <div className="page">
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h1 className="section-title" style={{ fontSize: '36px', marginBottom: '8px' }}>
            Boodle Fight Generator
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '16px' }}>
            Salu-salo na! Let the generator pick your group feast!
          </p>
        </div>

        <div className="card" style={{ padding: '24px', textAlign: 'center', marginBottom: '24px' }}>
          <FiUsers size={40} color="var(--primary)" style={{ marginBottom: '12px' }} />
          <h3 style={{ fontWeight: 700, color: 'var(--text)', marginBottom: '12px', fontSize: '18px' }}>Ilang kayo?</h3>
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '20px' }}>
            {[2, 3, 4, 5, 6, 8, 10].map(n => (
              <button
                key={n}
                className={`btn ${groupSize === n ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setGroupSize(n)}
                style={{ minWidth: '48px' }}
              >{n}</button>
            ))}
          </div>
          <button className="btn btn-primary btn-lg" onClick={generate} style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
            <FiPlus size={20} /> Generate Boodle Fight
          </button>
        </div>

        {platter && (
          <div className="animate-fade card" style={{ padding: '24px', marginBottom: '24px', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: 'var(--gradient)' }} />
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '24px', fontWeight: 900, color: 'var(--text)', marginBottom: '8px' }}>{platter.name}</h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>For {groupSize} people · {platter.dishes.length} dishes</p>
            </div>

            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '20px' }}>
              {platter.dishes.map((dish, i) => (
                <div key={i} className="card" style={{ textAlign: 'center', padding: '16px', minWidth: '130px', flex: 1, maxWidth: '180px' }}>
                  <div style={{ fontSize: '40px', marginBottom: '6px' }}>{dish.image}</div>
                  <div style={{ fontWeight: 600, color: 'var(--text)', fontSize: '13px' }}>{dish.name}</div>
                  <span className="badge" style={{ fontSize: '9px', background: getMealType(dish.category) === 'Ulam' ? '#E53935' : '#FF9800', marginTop: '4px', display: 'inline-block' }}>
                    {getMealType(dish.category)}
                  </span>
                  <div style={{ color: 'var(--primary)', fontWeight: 700, fontSize: '14px', marginTop: '4px' }}>{formatPeso(dish.price)}</div>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap', marginTop: '16px' }}>
              <div className="card" style={{ padding: '16px 24px', textAlign: 'center', flex: 1, minWidth: '140px', background: 'var(--bg-glass)' }}>
                <p style={{ fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '4px' }}>Total</p>
                <p style={{ fontSize: '28px', fontWeight: 900, color: 'var(--primary)' }}>{formatPeso(platter.total)}</p>
              </div>
              <div className="card" style={{ padding: '16px 24px', textAlign: 'center', flex: 1, minWidth: '140px', background: 'var(--bg-glass)' }}>
                <p style={{ fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '4px' }}>Per Person</p>
                <p style={{ fontSize: '28px', fontWeight: 900, color: '#4CAF50' }}>{formatPeso(platter.perPerson)}</p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginTop: '20px', flexWrap: 'wrap' }}>
              <button className="btn btn-primary" onClick={generate} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <FiRotateCcw size={16} /> Try Another
              </button>
              <button className="btn btn-secondary" onClick={savePlatter} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <FiHeart size={16} /> Save
              </button>
            </div>
          </div>
        )}

        {saved.length > 0 && (
          <div className="animate-fade" style={{ marginBottom: '24px' }}>
            <h3 style={{ fontWeight: 700, color: 'var(--text)', marginBottom: '16px' }}>Saved Platters ({saved.length})</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {saved.map((s, i) => (
                <div key={i} className="card" style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px 20px' }}>
                  <div style={{ display: 'flex', gap: '4px' }}>
                    {s.dishes.slice(0, 3).map((d, j) => <span key={j} style={{ fontSize: '24px' }}>{d.image}</span>)}
                    {s.dishes.length > 3 && <span style={{ fontSize: '16px', color: 'var(--text-muted)', alignSelf: 'center' }}>+{s.dishes.length - 3}</span>}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, color: 'var(--text)' }}>{s.name}</div>
                    <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{s.dishes.length} dishes</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: 700, color: 'var(--primary)' }}>{formatPeso(s.total)}</div>
                    <div style={{ fontSize: '11px', color: '#4CAF50' }}>{formatPeso(s.perPerson)}/person</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {!platter && !saved.length && (
          <div className="card" style={{ padding: '40px', textAlign: 'center' }}>
            <FiUsers size={48} color="var(--text-muted)" style={{ marginBottom: '12px' }} />
            <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text)', marginBottom: '8px' }}>No platter yet</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Piliin niyo kung ilan kayo at mag-generate na ng boodle fight!</p>
          </div>
        )}
      </div>
    </div>
  );
}
