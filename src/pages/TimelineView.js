// ============================================================
//  HUSHDIARY — Timeline View
// ============================================================
import React, { useState, useMemo, useRef } from 'react';
import { MOODS } from '../utils/constants';

export default function TimelineView({ entries, onOpen, onDelete }) {
  const [playId, setPlayId] = useState(null);
  const audioRefs = useRef({});

  const grouped = useMemo(() => {
    const g = {};
    entries.forEach(e => {
      const key = new Date(e.date).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
      if (!g[key]) g[key] = [];
      g[key].push(e);
    });
    return g;
  }, [entries]);

  const togglePlay = (id) => {
    if (playId === id) {
      audioRefs.current[id]?.pause();
      setPlayId(null);
    } else {
      Object.values(audioRefs.current).forEach(a => a?.pause());
      setPlayId(id);
      setTimeout(() => audioRefs.current[id]?.play(), 30);
    }
  };

  /* ── Empty state ── */
  if (!entries.length) return (
    <div style={{ padding: '32px 36px' }}>
      <div style={{ textAlign: 'center', maxWidth: 440, margin: '80px auto', color: 'rgba(196,154,108,.45)' }}>
        <div style={{ fontSize: 52, marginBottom: 16, opacity: .25 }}>📅</div>
        <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 28, fontWeight: 300, color: '#e8d5b5', marginBottom: 10 }}>
          No entries yet
        </h2>
        <p style={{ fontStyle: 'italic', fontSize: 16 }}>Your timeline will flow once you begin recording.</p>
      </div>
    </div>
  );

  return (
    <div style={{ padding: '32px 36px', animation: 'fadeUp .5s ease both' }}>
      <div style={{ marginBottom: 28 }}>
        <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 34, fontWeight: 300, color: '#f5edd8', marginBottom: 4 }}>
          Your Timeline
        </h2>
        <p style={{ fontFamily: "'Crimson Pro', serif", fontStyle: 'italic', fontSize: 15, color: 'rgba(196,154,108,.6)' }}>
          A chronological map of your inner world
        </p>
      </div>

      {Object.entries(grouped).map(([month, ents]) => (
        <div key={month} style={{ marginBottom: 44 }}>
          {/* Month header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 22 }}>
            <div style={{ flex: 1, height: 1, background: 'linear-gradient(to right,rgba(196,154,108,.28),transparent)' }} />
            <div style={{ fontFamily: "'Special Elite', cursive", fontSize: 10, letterSpacing: '3px', color: 'rgba(196,154,108,.6)', flexShrink: 0 }}>
              {month.toUpperCase()}
            </div>
            <div style={{ flex: 1, height: 1, background: 'linear-gradient(to left,rgba(196,154,108,.28),transparent)' }} />
          </div>

          {ents.map((entry, i) => {
            const d = new Date(entry.date);
            const m = MOODS.find(x => x.key === entry.mood);

            return (
              <div key={entry.id} style={{ display: 'flex', gap: 18, marginBottom: 18, animation: `fadeUp .5s ease ${i * .08}s both` }}>
                {/* Date column */}
                <div style={{ width: 54, flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
                  <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 30, fontWeight: 300, color: '#e8d5b5', lineHeight: 1 }}>
                    {d.getDate()}
                  </div>
                  <div style={{ fontFamily: "'Special Elite', cursive", fontSize: 8, letterSpacing: '1px', color: 'rgba(196,154,108,.45)', marginBottom: 7 }}>
                    {d.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase()}
                  </div>
                  <div style={{
                    width: 10, height: 10, borderRadius: '50%',
                    background: m?.color || '#c49a6c',
                    border: '2px solid #150f08',
                    boxShadow: `0 0 8px ${m?.color || '#c49a6c'}55`,
                  }} />
                  {/* Vertical line connector */}
                  {i < ents.length - 1 && (
                    <div style={{
                      position: 'absolute', top: 50, bottom: -18, left: '50%',
                      width: 1, background: 'linear-gradient(to bottom,rgba(196,154,108,.2),transparent)',
                      transform: 'translateX(-50%)',
                    }} />
                  )}
                </div>

                {/* Entry card */}
                <div
                  className="tl-card"
                  onClick={() => onOpen(entry)}
                  style={{
                    flex: 1, background: 'rgba(20,14,8,.75)',
                    border: '1px solid rgba(196,154,108,.12)',
                    padding: '15px 18px', transition: 'all .3s', cursor: 'pointer',
                  }}
                >
                  {/* Card header */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 10, flexWrap: 'wrap' }}>
                    <span style={{ fontFamily: "'Special Elite', cursive", fontSize: 9, letterSpacing: '1px', color: 'rgba(196,154,108,.45)' }}>
                      {d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    {m && (
                      <span style={{
                        background: m.bg, border: `1px solid ${m.color}44`,
                        padding: '2px 8px', fontFamily: "'Special Elite', cursive",
                        fontSize: 8, letterSpacing: '.5px', color: m.color,
                      }}>
                        {m.emoji} {m.label.toUpperCase()}
                      </span>
                    )}
                    {/* Delete button */}
                    <button
                      onClick={e => {
                        e.stopPropagation();
                        if (window.confirm('Remove this memory from the archive?')) onDelete(entry.id);
                      }}
                      title="Delete memory"
                      style={{
                        marginLeft: 'auto', background: 'none',
                        border: '1px solid rgba(196,154,108,.14)',
                        color: 'rgba(196,154,108,.3)', width: 26, height: 26,
                        borderRadius: '50%', cursor: 'pointer', fontSize: 11,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        transition: 'all .2s',
                      }}
                    >✕</button>
                  </div>

                  {/* Written note */}
                  {entry.note && (
                    <div style={{
                      fontFamily: "'Crimson Pro', serif", fontStyle: 'italic',
                      fontSize: 16, color: 'rgba(232,213,181,.8)', lineHeight: 1.55,
                      marginBottom: 10, paddingLeft: 12,
                      borderLeft: `2px solid ${m?.color || 'rgba(196,154,108,.3)'}`,
                    }}>
                      "{entry.note}"
                    </div>
                  )}

                  {/* Photo */}
                  {entry.photo && (
                    <img
                      src={entry.photo}
                      style={{ width: '100%', maxHeight: 175, objectFit: 'cover', marginBottom: 10, filter: 'sepia(7%)', border: '1px solid rgba(196,154,108,.12)', display: 'block' }}
                      alt="Memory"
                    />
                  )}

                  {/* Audio player */}
                  {entry.audio && (
                    <div
                      onClick={e => e.stopPropagation()}
                      style={{ display: 'flex', alignItems: 'center', gap: 9, paddingTop: 9, borderTop: '1px dashed rgba(196,154,108,.14)' }}
                    >
                      <button
                        onClick={() => togglePlay(entry.id)}
                        style={{
                          width: 32, height: 32, borderRadius: '50%',
                          background: playId === entry.id ? '#6b3a2a' : '#4a2f1a',
                          border: `1px solid ${playId === entry.id ? 'rgba(196,154,108,.6)' : 'rgba(196,154,108,.28)'}`,
                          cursor: 'pointer', color: '#c49a6c', fontSize: 11,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          boxShadow: '0 2px 8px rgba(0,0,0,.3)', transition: 'all .2s', flexShrink: 0,
                        }}
                      >
                        {playId === entry.id ? '⏸' : '▶'}
                      </button>

                      {/* Progress bar */}
                      <div style={{ flex: 1, height: 3, background: 'rgba(196,154,108,.14)', borderRadius: 2, overflow: 'hidden' }}>
                        <div style={{
                          height: '100%',
                          background: `linear-gradient(to right,${m?.color || '#c49a6c'},rgba(196,154,108,.4))`,
                          borderRadius: 2,
                          width: playId === entry.id ? '100%' : '0%',
                          transition: playId === entry.id ? `width ${entry.duration || 30}s linear` : 'none',
                        }} />
                      </div>

                      <span style={{ fontFamily: "'Special Elite', cursive", fontSize: 9, color: 'rgba(196,154,108,.38)', letterSpacing: '1px', flexShrink: 0 }}>
                        {Math.floor((entry.duration || 0) / 60)}:{((entry.duration || 0) % 60).toString().padStart(2, '0')}
                      </span>

                      <audio
                        ref={el => audioRefs.current[entry.id] = el}
                        src={entry.audio}
                        onEnded={() => setPlayId(null)}
                        style={{ display: 'none' }}
                      />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}
