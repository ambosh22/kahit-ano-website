import { useState, useEffect, useMemo } from 'react';
import { getMealType } from '../utils/helpers';
import foods from '../data/foods';
import socket from '../services/socket';
import {
  FiSend, FiLogIn, FiFlag, FiRotateCcw, FiTrendingUp, FiAward, FiPlus,
  FiAlertCircle, FiBarChart2,
} from 'react-icons/fi';

function matchFood(keyword) {
  const lower = keyword.toLowerCase().trim();
  if (!lower) return null;
  return foods.find(f => f.name.toLowerCase().includes(lower)) || null;
}

export default function GroupVoting() {
  const [roomCode, setRoomCode] = useState('');
  const [inRoom, setInRoom] = useState(false);
  const [joined, setJoined] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [keyword, setKeyword] = useState('');
  const [hasVoted, setHasVoted] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [winner, setWinner] = useState(null);
  const [dupeMsg, setDupeMsg] = useState('');
  const [isHost, setIsHost] = useState(false);
  const [connected, setConnected] = useState(socket.connected);

  useEffect(() => {
    if (!socket.connected) socket.connect();

    const onConnect = () => setConnected(true);
    const onDisconnect = () => setConnected(false);

    const onRoomCreated = ({ code, state }) => {
      setRoomCode(code);
      setSuggestions([...state.suggestions]);
      setInRoom(true);
      setJoined(true);
      setIsHost(true);
      setHasVoted(false);
      setShowConfetti(false);
      setWinner(null);
    };

    const onRoomJoined = ({ code, state }) => {
      setRoomCode(code);
      setSuggestions([...state.suggestions]);
      setJoined(true);
      setIsHost(false);
      setHasVoted(false);
      setShowConfetti(false);
      setWinner(null);
    };

    const onRoomError = ({ message }) => {
      alert(message);
    };

    const onSuggestError = ({ message }) => {
      setDupeMsg(message);
      setTimeout(() => setDupeMsg(''), 3000);
    };

    const onRoomUpdate = ({ state }) => {
      setSuggestions([...state.suggestions]);
    };

    const onVotingEnded = ({ winner }) => {
      setWinner(winner);
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 5000);
    };

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('room-created', onRoomCreated);
    socket.on('room-joined', onRoomJoined);
    socket.on('room-error', onRoomError);
    socket.on('suggest-error', onSuggestError);
    socket.on('room-update', onRoomUpdate);
    socket.on('voting-ended', onVotingEnded);

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('room-created', onRoomCreated);
      socket.off('room-joined', onRoomJoined);
      socket.off('room-error', onRoomError);
      socket.off('suggest-error', onSuggestError);
      socket.off('room-update', onRoomUpdate);
      socket.off('voting-ended', onVotingEnded);
    };
  }, []);

  const createRoom = () => {
    socket.emit('create-room');
  };

  const joinRoom = () => {
    if (!roomCode) return;
    socket.emit('join-room', { code: roomCode.toUpperCase() });
  };

  const newVote = () => {
    socket.emit('leave-room');
    setShowConfetti(false);
    setInRoom(false);
    setJoined(false);
    setIsHost(false);
    setHasVoted(false);
    setWinner(null);
    setSuggestions([]);
    setRoomCode('');
  };

  const submitSuggestion = () => {
    const trimmed = keyword.trim();
    if (!trimmed) return;
    setDupeMsg('');

    const matched = matchFood(trimmed);
    const mealType = matched ? getMealType(matched.category) : 'Ulam';
    const name = trimmed.charAt(0).toUpperCase() + trimmed.slice(1);

    socket.emit('suggest-food', { name, mealType });
    setKeyword('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') submitSuggestion();
  };

  const vote = (id) => {
    if (hasVoted) return;
    setHasVoted(true);
    socket.emit('vote-food', { id });
  };

  const endVoting = () => {
    socket.emit('end-voting');
  };

  const totalVotes = suggestions.reduce((sum, s) => sum + s.votes, 0);
  const sorted = useMemo(
    () => [...suggestions].sort((a, b) => b.votes - a.votes),
    [suggestions]
  );
  const ulamVotes = suggestions
    .filter(s => s.mealType === 'Ulam')
    .reduce((sum, s) => sum + s.votes, 0);
  const meriendaVotes = suggestions
    .filter(s => s.mealType === 'Merienda')
    .reduce((sum, s) => sum + s.votes, 0);

  const rankColors = [
    'linear-gradient(135deg,#FFD700,#FFA000)',
    'linear-gradient(135deg,#C0C0C0,#9E9E9E)',
    'linear-gradient(135deg,#CD7F32,#8D6E63)',
  ];
  const rankLabels = ['1st', '2nd', '3rd'];

  const canShowContent = inRoom || joined;

  const renderSuggestionInput = () => (
    <div className="card" style={{ marginBottom: '24px', padding: '20px' }}>
      <h3 style={{
        fontSize: '16px', fontWeight: 700, color: 'var(--text)',
        marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px',
      }}>
        <FiTrendingUp size={18} /> Suggest a Food
      </h3>
      <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginBottom: '12px' }}>
        Type any food you're craving — it gets added to the leaderboard!
      </p>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <input
                  type="text"
                  placeholder="e.g. Chicken Adobo, Pizza..."
                  value={keyword}
          onChange={e => setKeyword(e.target.value)}
          onKeyDown={handleKeyDown}
          style={styles.input}
        />
        <button
          className="btn btn-primary"
          onClick={submitSuggestion}
          style={{ display: 'flex', alignItems: 'center', gap: '6px', whiteSpace: 'nowrap' }}
        >
          <FiSend size={16} /> Suggest
        </button>
      </div>
      {dupeMsg && (
        <p style={{ color: '#FF9800', fontSize: '13px', marginTop: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <FiAlertCircle size={14} /> {dupeMsg}
        </p>
      )}
    </div>
  );

  const renderSummary = () => {
    if (suggestions.length === 0) return null;
    return (
      <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <div className="card" style={{ flex: 1, padding: '16px', textAlign: 'center', minWidth: '120px' }}>
          <p style={{ fontSize: '28px', fontWeight: 800, color: 'var(--primary)' }}>{suggestions.length}</p>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Suggestions</p>
        </div>
        <div className="card" style={{
          flex: 1, padding: '16px', textAlign: 'center', minWidth: '120px',
          border: '2px solid #E53935',
        }}>
          <p style={{ fontSize: '28px', fontWeight: 800, color: '#E53935' }}>{ulamVotes}</p>
          <p style={{ fontSize: '13px', color: '#E53935', fontWeight: 600 }}>Ulam Votes</p>
        </div>
        <div className="card" style={{
          flex: 1, padding: '16px', textAlign: 'center', minWidth: '120px',
          border: '2px solid #FF9800',
        }}>
          <p style={{ fontSize: '28px', fontWeight: 800, color: '#FF9800' }}>{meriendaVotes}</p>
          <p style={{ fontSize: '13px', color: '#FF9800', fontWeight: 600 }}>Merienda Votes</p>
        </div>
      </div>
    );
  };

  const renderLeaderboard = () => {
    if (sorted.length === 0) {
      return (
        <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
          <FiBarChart2 size={48} style={{ color: 'var(--text-muted)', marginBottom: '12px' }} />
          <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text)', marginBottom: '8px' }}>
            No suggestions yet
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
            Be the first to suggest a food using the input above!
          </p>
        </div>
      );
    }

    return (
      <>
        <h3 style={{
          fontSize: '20px', fontWeight: 700, color: 'var(--text)',
          marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px',
        }}>
          <FiAward size={22} /> Leaderboard
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
          {sorted.map((food, index) => {
            const pct = totalVotes > 0 ? (food.votes / totalVotes) * 100 : 0;
            const isTop3 = index < 3;
            return (
              <div
                key={food.id}
                className="card"
                onClick={() => vote(food.id)}
                style={{
                  cursor: hasVoted ? 'default' : 'pointer',
                  padding: '16px 20px',
                  display: 'flex', alignItems: 'center', gap: '16px',
                  border: hasVoted && food.votes > 0 && sorted[0].id === food.id
                    ? '2px solid var(--primary)'
                    : '1px solid var(--border)',
                  position: 'relative', overflow: 'hidden',
                }}
              >
                <div style={{
                  width: '40px', height: '40px', borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: isTop3 ? '20px' : '14px', fontWeight: 800,
                  background: isTop3 ? rankColors[index] : 'var(--bg-card)',
                  color: isTop3 ? '#fff' : 'var(--text-muted)',
                  flexShrink: 0,
                }}>
                  {isTop3 ? rankLabels[index] : `#${index + 1}`}
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text)' }}>
                      {food.name}
                    </span>
                    <span style={{
                      fontSize: '11px', fontWeight: 700, padding: '2px 10px', borderRadius: '50px',
                      background: food.mealType === 'Ulam' ? '#E53935' : '#FF9800',
                      color: '#fff', lineHeight: '1.5',
                    }}>
                      {food.mealType}
                    </span>
                  </div>
                  <div style={{
                    height: '6px', background: 'var(--border)', borderRadius: '3px',
                    overflow: 'hidden', marginTop: '6px',
                  }}>
                    <div style={{
                      height: '100%', width: `${pct}%`,
                      background: 'var(--gradient)', borderRadius: '3px',
                      transition: 'width 0.5s ease',
                    }} />
                  </div>
                </div>

                <div style={{ textAlign: 'center', flexShrink: 0 }}>
                  <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--primary)' }}>
                    {food.votes}
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>votes</div>
                </div>

                {!hasVoted && (
                  <div style={{
                    width: '36px', height: '36px', borderRadius: '50%',
                    background: 'var(--gradient)', display: 'flex',
                    alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0, cursor: 'pointer',
                  }}>
                    <FiPlus size={18} color="#fff" />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div style={{ textAlign: 'center' }}>
          {!hasVoted && (
            <p style={{ color: 'var(--text-secondary)', marginBottom: '12px', fontSize: '14px' }}>
              Click a food to cast your vote!
            </p>
          )}
          {hasVoted && isHost && (
            <button
              className="btn btn-primary btn-lg"
              onClick={endVoting}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
            >
              <FiFlag size={20} /> End Voting & See Winner
            </button>
          )}
          {hasVoted && !isHost && (
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
              Vote submitted! Waiting for the host to end voting.
            </p>
          )}
        </div>
      </>
    );
  };

  const renderConfetti = () => {
    if (!showConfetti || !winner) return null;
    return (
      <div style={styles.confettiOverlay}>
        {Array.from({ length: 50 }).map((_, i) => (
          <div key={i} style={{
            ...styles.confettiPiece,
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 2}s`,
            animationDuration: `${2 + Math.random() * 3}s`,
            background: ['#FF6B35', '#FFD700', '#4CAF50', '#E53935', '#2196F3', '#9C27B0'][Math.floor(Math.random() * 6)],
            width: `${8 + Math.random() * 12}px`,
            height: `${8 + Math.random() * 12}px`,
            borderRadius: Math.random() > 0.5 ? '50%' : '2px',
          }} />
        ))}
        <div style={styles.winnerCard}>
          <h2 style={{ fontSize: 'clamp(20px, 5vw, 36px)', fontWeight: 900, color: 'white', marginTop: '16px' }}>
            Final Decision: {winner.name}
          </h2>
          <div style={{
            display: 'inline-block', marginTop: '12px',
            fontSize: '11px', fontWeight: 700, padding: '4px 14px', borderRadius: '50px',
            background: winner.mealType === 'Ulam' ? '#E53935' : '#FF9800',
            color: '#fff',
          }}>
            {winner.mealType}
          </div>
          <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '18px', marginTop: '12px' }}>
            with {winner.votes} vote{winner.votes > 1 ? 's' : ''}!
          </p>
          <button
            className="btn btn-primary btn-lg"
            onClick={newVote}
            style={{ marginTop: '24px', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
          >
            <FiRotateCcw size={18} /> New Vote
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="page">
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h1 className="section-title" style={{ fontSize: '36px', marginBottom: '8px' }}>
            Group Voting
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '16px' }}>
            Mag-away man sa kung saan kakain, dito na lang mag-vote!
          </p>
        </div>

        {!canShowContent && (
          <div className="card" style={{ maxWidth: '450px', margin: '0 auto', textAlign: 'center', padding: '40px' }}>
            <FiAward size={48} style={{ color: 'var(--primary)', marginBottom: '12px' }} />
            <h3 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text)', margin: '16px 0 8px' }}>
              Create or Join a Room
            </h3>
            <button
              className="btn btn-primary btn-lg"
              onClick={createRoom}
              disabled={!connected}
              style={{
                width: '100%', marginBottom: '16px',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                opacity: connected ? 1 : 0.6,
              }}
            >
              <FiPlus size={18} /> {connected ? 'Create Room' : 'Connecting...'}
            </button>
            <div style={{ borderTop: '1px solid var(--border)', paddingTop: '16px' }}>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '10px', fontSize: '14px' }}>
                Or join existing room:
              </p>
              <div style={{ display: 'flex', gap: '8px' }}>
                  <input
                    type="text"
                    placeholder="Enter room code"
                    value={roomCode}
                  onChange={e => setRoomCode(e.target.value.toUpperCase())}
                  style={styles.input}
                />
                <button
                  className="btn btn-primary"
                  onClick={joinRoom}
                  disabled={!connected}
                  style={{ display: 'flex', alignItems: 'center', gap: '6px', opacity: connected ? 1 : 0.6 }}
                >
                  <FiLogIn size={16} /> {connected ? 'Join' : '...'}
                </button>
              </div>
            </div>
          </div>
        )}

        {canShowContent && (
          <div className="animate-fade">
            <div className="card" style={{ textAlign: 'center', marginBottom: '24px' }}>
              <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Room Code</p>
              <h2 style={{
                fontSize: 'clamp(24px, 8vw, 36px)', fontWeight: 900, letterSpacing: '4px',
                background: 'var(--gradient)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}>
                {roomCode}
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>
                Share this code with friends!
              </p>
            </div>

            {renderSuggestionInput()}
            {renderSummary()}
            {renderLeaderboard()}
          </div>
        )}

        {renderConfetti()}
      </div>
    </div>
  );
}

const styles = {
  input: {
    flex: 1, padding: '12px 16px',
    borderRadius: '50px', border: '2px solid var(--border)',
    background: 'var(--bg-card)', color: 'var(--text)',
    fontSize: '14px',
  },
  confettiOverlay: {
    position: 'fixed', inset: 0, zIndex: 3000,
    background: 'rgba(0,0,0,0.8)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    flexDirection: 'column',
    overflow: 'hidden',
  },
  confettiPiece: {
    position: 'absolute', top: '-20px',
    animation: 'confetti-fall 3s ease-in forwards',
    opacity: 0.8,
  },
  winnerCard: {
    textAlign: 'center',
    zIndex: 1,
    padding: '40px',
  },
};
