// ============================================================
//  HUSHDIARY — Gallery View (Polaroid Masonry)
// ============================================================
import React, { useState, useMemo } from 'react';
import { MOODS, GALLERY_IMGS } from '../utils/constants';

const TILTS = [-4, -2, 0, 3, -3, 2, -1, 4, 1, -4, 3, 0];

export default function GalleryView({ entries, onOpen, onNew }) {
  const [filter, setFilter] = useState('all');

  const filtered = useMemo(() => {
    if (filter === 'voice') return entries.filter(e => e.audio);
    if (filter === 'photo') return entries.filter(e => e.photo);
    return entries;
  }, [entries, filter]);

  /* ── Empty state ── */
  if (!entries.length) return (
    <div style={{ padding: '32px 36px', animation: 'fadeUp .5s ease both' }}>
      <div style={{ textAlign: 'center', maxWidth: 480, margin: '80px auto' }}>
        <div style={{ fontSize: 72, marginBottom: 24, opacity: .25 }}>📷</div>
        <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 34, fontWeight: 300, color: '#e8d5b5', marginBottom: 12 }}>
          Your gallery awaits
        </h2>
        <p style={{ fontFamily: "'Crimson Pro', serif", fontStyle: 'italic', fontSize: 17, color: 'rgba(196,154,108,.55)', lineHeight: 1.75, marginBottom: 32 }}>
          Each whisper becomes a photograph of time. Begin recording your story.
        </p>
        <button
          onClick={onNew}
          className="btn-p"
          style={{
            padding: '14px 36px', background: 'linear-gradient(135deg,#6b4a2a,#4a2f1a)',
            color: '#e8d5b5', border: '1px solid rgba(196,154,108,.4)',
            fontFamily: "'Crimson Pro', serif", fontSize: 17, cursor: 'pointer',
            boxShadow: '0 4px 20px rgba(0,0,0,.4)', transition: 'all .3s', letterSpacing: '.5px',
          }}
        >
          ✦ Start your first entry
        </button>
      </div>
    </div>
  );

  return (
    <div style={{ padding: '32px 36px', animation: 'fadeUp .5s ease both' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 34, fontWeight: 300, color: '#f5edd8', marginBottom: 4 }}>
            Memory Gallery
          </h2>
          <p style={{ fontFamily: "'Crimson Pro', serif", fontStyle: 'italic', fontSize: 15, color: 'rgba(196,154,108,.6)' }}>
            {entries.length} {entries.length === 1 ? 'memory' : 'memories'} preserved
          </p>
        </div>
        {/* Filters */}
        <div style={{ display: 'flex', gap: 7 }}>
          {[{ k: 'all', l: 'All' }, { k: 'voice', l: 'Voice' }, { k: 'photo', l: 'Photos' }].map(t => (
            <button
              key={t.k}
              onClick={() => setFilter(t.k)}
              className="btn-p"
              style={{
                padding: '7px 16px',
                background: filter === t.k ? 'rgba(196,154,108,.15)' : 'transparent',
                border: `1px solid ${filter === t.k ? 'rgba(196,154,108,.5)' : 'rgba(196,154,108,.18)'}`,
                fontFamily: "'Special Elite', cursive", fontSize: 9, letterSpacing: '2px',
                color: filter === t.k ? '#c49a6c' : 'rgba(196,154,108,.38)',
                cursor: 'pointer', transition: 'all .2s',
              }}
            >{t.l.toUpperCase()}</button>
          ))}
        </div>
      </div>

      {/* Masonry Polaroid Grid */}
      {filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 0', fontFamily: "'Crimson Pro', serif", fontStyle: 'italic', color: 'rgba(196,154,108,.4)', fontSize: 17 }}>
          No memories match this filter yet.
        </div>
      ) : (
        <div style={{ columns: '4', columnGap: 18 }}>
          {filtered.map((entry, i) => {
            const date    = new Date(entry.date);
            const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
            const m       = MOODS.find(x => x.key === entry.mood);
            const tilt    = TILTS[i % TILTS.length];
            const bgImg   = GALLERY_IMGS[i % GALLERY_IMGS.length];

            return (
              <div
                key={entry.id}
                className="polaroid"
                onClick={() => onOpen(entry)}
                style={{
                  breakInside: 'avoid', marginBottom: 22,
                  transform: `rotate(${tilt}deg)`,
                  display: 'inline-block', width: '100%',
                  animationName: 'cardReveal', animationDuration: '.55s',
                  animationTimingFunction: 'ease', animationFillMode: 'both',
                  animationDelay: `${i * .07}s`, '--tilt': `${tilt}deg`,
                  cursor: 'pointer', transition: 'all .38s cubic-bezier(.23,1,.32,1)',
                }}
              >
                {/* Tape strip */}
                <div style={{
                  width: 46, height: 13,
                  background: 'rgba(232,213,181,.58)',
                  border: '1px solid rgba(196,154,108,.22)',
                  margin: '0 auto -6px', position: 'relative', zIndex: 2,
                  transform: 'rotate(-1.5deg)',
                  boxShadow: '0 1px 4px rgba(0,0,0,.18)',
                }} />

                {/* Photo body */}
                <div style={{
                  background: '#fffdf5', padding: '9px 9px 34px',
                  boxShadow: `${tilt > 0 ? '-' : ''}4px 4px 22px rgba(0,0,0,.32),1px 1px 0 rgba(255,255,255,.7)`,
                  position: 'relative',
                }}>
                  {/* Image area */}
                  {entry.photo ? (
                    <div style={{ height: 175, overflow: 'hidden', position: 'relative' }}>
                      <img
                        src={entry.photo}
                        style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'sepia(8%) contrast(1.04)', display: 'block' }}
                        alt="Memory"
                      />
                      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom,transparent 60%,rgba(0,0,0,.18))' }} />
                    </div>
                  ) : (
                    <div style={{
                      height: 158,
                      backgroundImage: `url(${bgImg})`,
                      backgroundSize: 'cover', backgroundPosition: 'center',
                      filter: 'sepia(28%) brightness(.65)',
                      position: 'relative', overflow: 'hidden',
                    }}>
                      <div style={{
                        position: 'absolute', inset: 0, background: 'rgba(20,14,8,.48)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        flexDirection: 'column', gap: 7,
                      }}>
                        <div style={{ fontSize: 30 }}>{m?.emoji || '✦'}</div>
                        <div style={{ fontFamily: "'Special Elite', cursive", fontSize: 8, letterSpacing: '2px', color: 'rgba(232,213,181,.55)' }}>VOICE MEMORY</div>
                      </div>
                      {/* Pulse rings */}
                      {[55, 75, 95].map((s, ri) => (
                        <div key={ri} style={{
                          position: 'absolute', top: '50%', left: '50%',
                          transform: 'translate(-50%,-50%)',
                          width: s + '%', height: s + '%',
                          border: `1px solid ${m?.color || '#c49a6c'}40`,
                          borderRadius: '50%',
                          animation: `pulse3 ${2 + ri * .6}s ease-in-out ${ri * .45}s infinite`,
                        }} />
                      ))}
                    </div>
                  )}

                  {/* Caption */}
                  <div style={{ paddingTop: 8 }}>
                    <div style={{ fontFamily: "'Special Elite', cursive", fontSize: 9, letterSpacing: '1.5px', color: '#8b5e3c', opacity: .65, marginBottom: 4 }}>
                      {dateStr}
                    </div>
                    {entry.note && (
                      <div style={{ fontFamily: "'Crimson Pro', serif", fontStyle: 'italic', fontSize: 12, color: '#4a2f1a', lineHeight: 1.4, marginBottom: 4 }}>
                        "{entry.note.substring(0, 55)}{entry.note.length > 55 ? '…' : ''}"
                      </div>
                    )}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 5, flexWrap: 'wrap' }}>
                      {m && (
                        <span style={{ background: m.color, padding: '2px 7px', fontFamily: "'Special Elite', cursive", fontSize: 7, letterSpacing: '.5px', color: 'rgba(255,255,255,.88)' }}>
                          {m.emoji} {m.label.toUpperCase()}
                        </span>
                      )}
                      {entry.audio && (
                        <span style={{ fontFamily: "'Special Elite', cursive", fontSize: 7, color: 'rgba(139,94,60,.55)', letterSpacing: '.5px' }}>
                          🎙 VOICE
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
