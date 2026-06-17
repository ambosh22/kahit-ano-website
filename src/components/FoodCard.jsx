import { formatPeso } from '../utils/helpers';

export default function FoodCard({ food, onClick, style }) {
  return (
    <div className="card" style={{ ...styles.card, ...style }} onClick={onClick}>
      <div style={styles.imageWrap}>
        <span style={styles.emoji}>{food.image}</span>
      </div>
      <div style={styles.info}>
        <div style={styles.header}>
          <span style={styles.name}>{food.name}</span>
          {food.category && <span className="badge" style={styles.badge}>{food.category}</span>}
        </div>
        {food.price && (
          <span style={styles.price}>{formatPeso(food.price)}</span>
        )}
        {food.description && (
          <p style={styles.desc}>{food.description}</p>
        )}
      </div>
    </div>
  );
}

const styles = {
  card: {
    cursor: 'pointer',
    overflow: 'hidden',
  },
  imageWrap: {
    width: '100%',
    height: '140px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, rgba(255,107,53,0.1), rgba(255,215,0,0.1))',
    borderRadius: 'var(--radius-sm)',
    marginBottom: '12px',
  },
  emoji: { fontSize: '56px' },
  info: { display: 'flex', flexDirection: 'column', gap: '6px' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' },
  name: { fontWeight: 700, fontSize: '16px', color: 'var(--text)' },
  badge: { flexShrink: 0, fontSize: '10px' },
  price: { fontWeight: 700, fontSize: '18px', color: 'var(--primary)' },
  desc: { fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.4 },
};
