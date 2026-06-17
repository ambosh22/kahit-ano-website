import { useState, useRef, useCallback } from 'react';
import foods from '../data/foods';

const COLORS = [
  '#FF6B35', '#E53935', '#4CAF50', '#2196F3',
  '#9C27B0', '#FF9800', '#00BCD4', '#795548',
  '#607D8B', '#F44336', '#3F51B5', '#009688',
];

export default function FoodWheel({ onResult, foodsList }) {
  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const canvasRef = useRef(null);
  const audioRef = useRef(null);

  const source = foodsList || foods;
  const segments = source.slice(0, 12);
  const segAngle = 360 / segments.length;

  const playTick = useCallback(() => {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = 800;
      gain.gain.value = 0.05;
      osc.start();
      osc.stop(ctx.currentTime + 0.05);
    } catch {}
  }, []);

  const spin = useCallback(() => {
    if (spinning || segments.length === 0) return;
    setSpinning(true);

    const extraSpins = 5 + Math.random() * 5;
    const spinDeg = extraSpins * 360 + Math.random() * 360;
    const totalRotation = rotation + spinDeg;
    setRotation(totalRotation);

    const tickInterval = setInterval(playTick, 80);
    setTimeout(() => {
      clearInterval(tickInterval);
      const normalized = totalRotation % 360;
      const winnerIndex = Math.floor((360 - (normalized % 360)) / segAngle) % segments.length;
      const winner = segments[winnerIndex];
      setSpinning(false);
      if (onResult) onResult(winner);
    }, 4000);
  }, [spinning, rotation, segments, segAngle, playTick, onResult]);

  return (
    <div style={styles.container}>
      <div style={styles.pointer}>▼</div>
      {segments.length === 0 ? (
        <div style={{ padding: '60px 20px', textAlign: 'center', color: 'var(--text-secondary)' }}>
          No foods match the selected filter.
        </div>
      ) : (
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 320 320"
          style={{
            maxWidth: '320px',
            transform: `rotate(${rotation}deg)`,
            transition: spinning ? 'transform 4s cubic-bezier(0.17, 0.67, 0.12, 0.99)' : 'none',
          }}
        >
          {segments.map((food, i) => {
            const startAngle = (i * segAngle - 90) * Math.PI / 180;
            const endAngle = ((i + 1) * segAngle - 90) * Math.PI / 180;
            const x1 = 160 + 150 * Math.cos(startAngle);
            const y1 = 160 + 150 * Math.sin(startAngle);
            const x2 = 160 + 150 * Math.cos(endAngle);
            const y2 = 160 + 150 * Math.sin(endAngle);
            const midAngle = (startAngle + endAngle) / 2;
            const tx = 160 + 110 * Math.cos(midAngle);
            const ty = 160 + 110 * Math.sin(midAngle);

            return (
              <g key={food.id}>
                <path
                  d={`M160,160 L${x1},${y1} A150,150 0 0,1 ${x2},${y2} Z`}
                  fill={COLORS[i % COLORS.length]}
                  stroke="rgba(255,255,255,0.3)"
                  strokeWidth="2"
                />
                <text
                  x={tx}
                  y={ty}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill="white"
                  fontSize="20"
                  fontWeight="bold"
                  style={{ textShadow: '0 1px 3px rgba(0,0,0,0.3)', pointerEvents: 'none' }}
                >
                  {food.image}
                </text>
                <text
                  x={tx}
                  y={ty + 26}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill="white"
                  fontSize="9"
                  fontWeight="600"
                >
                  {food.name.length > 12 ? food.name.slice(0, 12) + '..' : food.name}
                </text>
              </g>
            );
          })}
          <circle cx="160" cy="160" r="20" fill="white" stroke="#FF6B35" strokeWidth="3" />
        </svg>
      )}
      <button
        className="btn btn-primary btn-lg"
        onClick={spin}
        disabled={spinning || segments.length === 0}
        style={styles.spinBtn}
      >
        {spinning ? 'Spinning...' : 'SPIN NOW'}
      </button>
      <audio ref={audioRef} />
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '24px',
    padding: '20px',
  },
  pointer: {
    fontSize: '32px',
    color: 'var(--primary)',
    filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))',
    zIndex: 1,
    marginBottom: '-8px',
  },
  spinBtn: {
    minWidth: '200px',
    fontSize: '20px',
    padding: '16px 40px',
  },
};
