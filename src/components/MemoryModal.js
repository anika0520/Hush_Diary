// ============================================================
//  HUSHDIARY — Memory Detail Modal
// ============================================================
import React, { useEffect } from 'react';
import { MOODS } from '../utils/constants';

export default function MemoryModal({ entry, onClose }) {
  const m = MOODS.find(x => x.key === entry?.mood);
  const d = entry ? new Date(entry.date) : null;

  // Close on Escape key
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  if (!entry) return null;

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0,
        background: 'rgba(8,5,3,.88)',
        backdropFilter: 'blur(8px)',
        zIndex: 5000,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 20,
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: '#1a120a',
          maxWidth: 580, width: '100%', maxHeight: '90vh',
          overflow: 'auto',
          border: '1px solid rgba(196,154,108,.2)',
          boxShadow: '0 32px 100px rgba(0,0,0,.75)',
          animation: 'modalPop .35s cubic-bezier(.23,1,.32,1) both',
          position: 'relative',
        }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          title="Close"
          style={{
            position: 'absolute', top: 16, right: 20,
            background: 'none', border: 'none',
            color: 'rgba(196,154,108,.45)', fontSize: 22,
            cursor: 'pointer', lineHeight: 1, zIndex: 2,
            transition: 'color .2s',
          }}
          onMouseOver={e => e.target.style.color = '#c49a6c'}
          onMouseOut={e => e.target.style.color = 'rgba(196,154,108,.45)'}
        >✕</button>

        {/* Header */}
        <div style={{ padding: '26px 30px 0' }}>
          <div style={{
            fontFamily: "'Cormorant Garamond', serif", fontSize: 26,
            fontWeight: 300, color: '#f5edd8', marginBottom: 8,
          }}>
            {d?.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
          </div>
          <div style={{
            display: 'flex', gap: 12, alignItems: 'center',
            paddingBottom: 18, borderBottom: '1px solid rgba(196,154,108,.1)', flexWrap: 'wrap',
          }}>
            <span style={{ fontFamily: "'Special Elite', cursive", fontSize: 9, letterSpacing: '1.5px', color: 'rgba(196,154,108,.45)' }}>
              {d?.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
            </span>
            {m && (
              <span style={{
                background: m.bg, border: `1px solid ${m.color}44`,
                padding: '3px 10px', fontFamily: "'Special Elite', cursive",
                fontSize: 9, letterSpacing: '1px', color: m.color,
              }}>
                {m.emoji} {m.label.toUpperCase()}
              </span>
            )}
          </div>
        </div>

        {/* Body */}
        <div style={{ padding: '18px 30px 30px' }}>
          {/* Photo */}
          {entry.photo && (
            <img
              src={entry.photo}
              style={{
                width: '100%', maxHeight: 300, objectFit: 'cover',
                marginBottom: 18, filter: 'sepia(8%)',
                border: '1px solid rgba(196,154,108,.1)', display: 'block',
              }}
              alt="Memory"
            />
          )}

          {/* Written note */}
          {entry.note && (
            <div style={{
              fontFamily: "'Crimson Pro', serif", fontStyle: 'italic',
              fontSize: 20, color: 'rgba(232,213,181,.84)',
              lineHeight: 1.65, marginBottom: 18,
              paddingLeft: 16,
              borderLeft: `2px solid ${m?.color || 'rgba(196,154,108,.3)'}`,
            }}>
              "{entry.note}"
            </div>
          )}

          {/* Audio */}
          {entry.audio && (
            <div>
              <div style={{ fontFamily: "'Special Elite', cursive", fontSize: 9, letterSpacing: '2px', color: 'rgba(196,154,108,.45)', marginBottom: 10 }}>
                VOICE RECORDING
              </div>
              <audio src={entry.audio} controls style={{ width: '100%' }} />
            </div>
          )}

          {/* Empty state */}
          {!entry.note && !entry.audio && !entry.photo && (
            <div style={{ fontFamily: "'Crimson Pro', serif", fontStyle: 'italic', color: 'rgba(196,154,108,.35)', fontSize: 16, textAlign: 'center', padding: '20px 0' }}>
              A silent memory.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
