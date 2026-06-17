import { useState } from 'react';
import foods from '../data/foods';
import { formatPeso, getMealType } from '../utils/helpers';
import { FiZap, FiRotateCcw, FiShare2, FiHeart } from 'react-icons/fi';

const comboStyles = [
  { name: 'Combo ng Bayan', desc: 'Classic na classic, panalo sa gutom!' },
  { name: 'Pambansang Combo', desc: 'Talagang Pinoy na pangmalakasan!' },
  { name: 'Street Food Special', desc: 'Galing sa kalsada, panalo sa lasa!' },
  { name: 'Gala Combo', desc: 'Perfect sa lakad-lakad with friends!' },
  { name: 'Desperado Meal', desc: 'Yung tipong ubos na ang joy, pero busog ka pa rin!' },
  { name: 'Sweldo Day Special', desc: 'Medyo bongga, deserve mo to!' },
  { name: 'Barkada Share', desc: 'Pwede na ipang-hati sa tropa!' },
  { name: 'Weather Weather Combo', desc: 'Bagay sa kung anumang panahon!' },
];

export default function PinoyCombos() {
  const ulam = foods.filter(f => getMealType(f.category) === 'Ulam');
  const merienda = foods.filter(f => getMealType(f.category) === 'Merienda');

  const generate = () => {
    const u = ulam[Math.floor(Math.random() * ulam.length)];
    const m = merienda[Math.floor(Math.random() * merienda.length)];
    const style = comboStyles[Math.floor(Math.random() * comboStyles.length)];
    return { ulam: u, merienda: m, style };
  };

  const [combo, setCombo] = useState(generate());
  const [saved, setSaved] = useState([]);

  const newCombo = () => setCombo(generate());

  const saveCombo = () => {
    if (saved.find(s => s.ulam.id === combo.ulam.id && s.merienda.id === combo.merienda.id)) return;
    setSaved(prev => [combo, ...prev]);
  };

  const total = combo.ulam.price + combo.merienda.price;

  return (
    <div className="page">
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h1 className="section-title" style={{ fontSize: '36px', marginBottom: '8px' }}>
            Crazy Pinoy Combos
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '16px' }}>
            Random combos na pwede mong ma-try! Baka maging paborito mo pa.
          </p>
        </div>

        <div className="card" style={{ padding: '32px', textAlign: 'center', marginBottom: '24px', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: 'var(--gradient)' }} />
          <div style={{ display: 'inline-block', padding: '4px 16px', borderRadius: '50px', background: 'var(--gradient)', color: '#fff', fontWeight: 700, fontSize: '13px', marginBottom: '16px' }}>
            <FiZap size={14} style={{ marginRight: '6px', verticalAlign: 'middle' }} />
            {combo.style.name}
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '24px' }}>{combo.style.desc}</p>

          <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: '200px', maxWidth: '280px' }}>
              <div style={{ fontSize: '64px', marginBottom: '8px' }}>{combo.ulam.image}</div>
              <h3 style={{ fontWeight: 700, color: 'var(--text)', fontSize: '18px' }}>{combo.ulam.name}</h3>
              <span className="badge" style={{ background: '#E53935' }}>Ulam</span>
              <p style={{ color: 'var(--primary)', fontWeight: 700, fontSize: '20px', marginTop: '8px' }}>{formatPeso(combo.ulam.price)}</p>
            </div>
            <div style={{ fontSize: '36px', color: 'var(--text-muted)', fontWeight: 300 }}>+</div>
            <div style={{ flex: 1, minWidth: '200px', maxWidth: '280px' }}>
              <div style={{ fontSize: '64px', marginBottom: '8px' }}>{combo.merienda.image}</div>
              <h3 style={{ fontWeight: 700, color: 'var(--text)', fontSize: '18px' }}>{combo.merienda.name}</h3>
              <span className="badge" style={{ background: '#FF9800' }}>Merienda</span>
              <p style={{ color: 'var(--primary)', fontWeight: 700, fontSize: '20px', marginTop: '8px' }}>{formatPeso(combo.merienda.price)}</p>
            </div>
          </div>

          <div style={{ marginTop: '24px', padding: '12px', background: 'rgba(255,107,53,0.08)', borderRadius: 'var(--radius-sm)' }}>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
              Total combo: <strong style={{ fontSize: '24px', color: 'var(--primary)' }}>{formatPeso(total)}</strong>
            </p>
          </div>

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginTop: '20px', flexWrap: 'wrap' }}>
            <button className="btn btn-primary btn-lg" onClick={newCombo} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FiRotateCcw size={18} /> Try Another Combo
            </button>
            <button className="btn btn-secondary btn-lg" onClick={saveCombo} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FiHeart size={18} /> Save Combo
            </button>
          </div>
        </div>

        {saved.length > 0 && (
          <div className="animate-fade">
            <h3 style={{ fontWeight: 700, color: 'var(--text)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FiHeart size={18} color="#E53935" /> Saved Combos ({saved.length})
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {saved.map((s, i) => (
                <div key={i} className="card" style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px 20px' }}>
                  <span style={{ fontSize: '32px' }}>{s.ulam.image}</span>
                  <FiZap size={14} color="var(--text-muted)" />
                  <span style={{ fontSize: '32px' }}>{s.merienda.image}</span>
                  <div style={{ flex: 1 }}>
                    <span style={{ fontWeight: 600, color: 'var(--text)' }}>{s.ulam.name}</span>
                    <span style={{ color: 'var(--text-muted)', margin: '0 8px' }}>+</span>
                    <span style={{ fontWeight: 600, color: 'var(--text)' }}>{s.merienda.name}</span>
                    <span className="badge" style={{ marginLeft: '8px', background: 'var(--gradient)', fontSize: '10px' }}>{s.style.name}</span>
                  </div>
                  <span style={{ fontWeight: 700, color: 'var(--primary)' }}>{formatPeso(s.ulam.price + s.merienda.price)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="card" style={{ padding: '20px', marginTop: '24px', textAlign: 'center', background: 'var(--gradient)', color: 'white' }}>
          <FiShare2 size={24} style={{ marginBottom: '8px' }} />
          <h3 style={{ fontWeight: 700, fontSize: '18px' }}>I-share mo sa friends!</h3>
          <p style={{ opacity: 0.9, fontSize: '14px' }}>Baka trip din nila yang combo na yan!</p>
        </div>
      </div>
    </div>
  );
}
