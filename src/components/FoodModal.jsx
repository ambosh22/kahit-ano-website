import { useEffect } from 'react';
import { formatPeso } from '../utils/helpers';

export default function FoodModal({ food, onClose }) {
  useEffect(() => {
    const handleEsc = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  useEffect(() => {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = 523.25;
      gain.gain.value = 0.1;
      osc.start();
      setTimeout(() => {
        osc.frequency.value = 659.25;
        setTimeout(() => {
          osc.frequency.value = 783.99;
          setTimeout(() => { osc.stop(); }, 150);
        }, 150);
      }, 150);
    } catch {}
  }, []);

  if (!food) return null;

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={e => e.stopPropagation()} className="animate-slide">
        <button style={styles.closeBtn} onClick={onClose}>✕</button>
        <div style={styles.content}>
          <div style={styles.imageWrap}>
            <span style={styles.emoji}>{food.image}</span>
          </div>
          <h2 style={styles.name}>{food.name}</h2>
          {food.category && <span className="badge" style={{ marginBottom: '8px' }}>{food.category}</span>}
          {food.price && (
            <div style={styles.priceRow}>
              <span style={styles.priceLabel}>Price</span>
              <span style={styles.priceValue}>{formatPeso(food.price)}</span>
            </div>
          )}
          {food.description && <p style={styles.desc}>{food.description}</p>}
          {food.totalCost && (
            <div style={styles.priceRow}>
              <span style={styles.priceLabel}>Total Cost</span>
              <span style={styles.priceValue}>{formatPeso(food.totalCost)}</span>
            </div>
          )}
          {food.servings && <p style={styles.detail}>Serves: {food.servings}</p>}
          {food.cookingTime && <p style={styles.detail}>Cooking Time: {food.cookingTime}</p>}
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
    background: 'var(--bg-card)',
    borderRadius: 'var(--radius-lg)',
    maxWidth: '420px',
    width: '100%',
    position: 'relative',
    boxShadow: 'var(--shadow-lg)',
    overflow: 'hidden',
  },
  closeBtn: {
    position: 'absolute', top: '12px', right: '12px',
    width: '36px', height: '36px',
    borderRadius: '50%',
    border: 'none',
    background: 'rgba(0,0,0,0.1)',
    fontSize: '18px',
    cursor: 'pointer',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    color: 'var(--text)',
    zIndex: 1,
  },
  content: {
    padding: '32px',
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    textAlign: 'center',
    gap: '8px',
  },
  imageWrap: {
    width: '100px', height: '100px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, rgba(255,107,53,0.15), rgba(255,215,0,0.15))',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    marginBottom: '8px',
  },
  emoji: { fontSize: '48px' },
  name: { fontSize: '24px', fontWeight: 800, color: 'var(--text)' },
  priceRow: {
    display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '12px',
    margin: '4px 0',
  },
  priceLabel: { color: 'var(--text-secondary)', fontSize: '14px' },
  priceValue: { color: 'var(--primary)', fontSize: '22px', fontWeight: 800 },
  desc: { color: 'var(--text-secondary)', fontSize: '14px', lineHeight: 1.5, marginTop: '4px' },
  detail: { color: 'var(--text-muted)', fontSize: '13px' },
};
