// ============================================================
//  HUSHDIARY — Main App Layout (Sidebar + Content)
// ============================================================
import React, { useState, useCallback } from 'react';
import { DB } from '../utils/db';
import ambientEngine from '../utils/ambientEngine';
import { useToast } from '../components/Toast';
import { MusicOrb, Particles } from '../components/SharedUI';
import MemoryModal from '../components/MemoryModal';
import GalleryView  from '../pages/GalleryView';
import TimelineView from '../pages/TimelineView';
import RecordView   from '../pages/RecordView';
import StatsView    from '../pages/StatsView';

const NAV_ITEMS = [
  { k: 'gallery',  icon: '◧', label: 'Memory Gallery' },
  { k: 'timeline', icon: '◫', label: 'Timeline'       },
  { k: 'record',   icon: '◉', label: 'New Memory'     },
  { k: 'stats',    icon: '◈', label: 'My Archive'     },
];

export default function MainApp({ user, onLogout }) {
  const toast = useToast();
  const [view,       setView]       = useState('gallery');
  const [entries,    setEntries]    = useState(() => DB.getEntries(user.uid));
  const [openEntry,  setOpenEntry]  = useState(null);
  const [musicOn,    setMusicOn]    = useState(false);

  /* ── Save new entry ── */
  const saveEntry = useCallback((entry) => {
    const updated = [entry, ...entries];
    setEntries(updated);
    DB.saveEntries(user.uid, updated);
    setView('gallery');
  }, [entries, user.uid]);

  /* ── Delete entry ── */
  const deleteEntry = useCallback((id) => {
    const updated = entries.filter(e => e.id !== id);
    setEntries(updated);
    DB.saveEntries(user.uid, updated);
    toast('Memory removed from the archive.');
  }, [entries, user.uid, toast]);

  /* ── Toggle ambient music ── */
  const toggleMusic = () => {
    const result = ambientEngine.toggle();
    setMusicOn(typeof result === 'boolean' ? result : !musicOn);
  };

  /* ── Logout ── */
  const handleLogout = () => {
    ambientEngine.stop();
    DB.clearSession();
    onLogout();
  };

  // Greeting based on time of day
  const h = new Date().getHours();
  const greeting = h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : h < 21 ? 'Good evening' : 'Good night';

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '238px 1fr', height: '100vh', overflow: 'hidden' }}>

      {/* ══════════════ SIDEBAR ══════════════ */}
      <aside style={{
        background: '#0a0703',
        borderRight: '1px solid rgba(196,154,108,.1)',
        display: 'flex', flexDirection: 'column',
        overflow: 'hidden', position: 'relative',
      }}>
        {/* Film sprocket edge */}
        <div style={{
          position: 'absolute', right: 0, top: 0, bottom: 0, width: 3,
          background: 'repeating-linear-gradient(to bottom,transparent 0px,transparent 10px,rgba(196,154,108,.07) 10px,rgba(196,154,108,.07) 14px)',
        }} />

        <div style={{ position: 'relative', zIndex: 1, flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

          {/* Logo */}
          <div style={{ padding: '26px 22px 18px', borderBottom: '1px solid rgba(196,154,108,.08)', flexShrink: 0 }}>
            <div style={{
              fontFamily: "'IM Fell English', serif", fontSize: 25,
              color: '#f5edd8', letterSpacing: '-.5px',
              animation: 'textFlicker 11s ease-in-out infinite',
            }}>
              Hush<em style={{ fontStyle: 'italic', color: '#c49a6c' }}>Diary</em>
            </div>
            <div style={{ fontFamily: "'Special Elite', cursive", fontSize: 8, letterSpacing: '3px', color: 'rgba(196,154,108,.35)', marginTop: 3 }}>
              MEMORY GALLERY
            </div>
          </div>

          {/* User info */}
          <div style={{
            padding: '14px 18px', borderBottom: '1px solid rgba(196,154,108,.08)',
            display: 'flex', gap: 10, alignItems: 'center', flexShrink: 0,
          }}>
            <div style={{
              width: 38, height: 38, borderRadius: '50%',
              background: 'linear-gradient(135deg,rgba(196,154,108,.22),rgba(139,94,60,.32))',
              border: '1px solid rgba(196,154,108,.28)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: "'Cormorant Garamond', serif", fontSize: 17, color: '#e8d5b5', flexShrink: 0,
            }}>
              {user.avatar || user.name?.charAt(0)?.toUpperCase() || '✦'}
            </div>
            <div>
              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 16, color: '#e8d5b5' }}>
                {user.name?.split(' ')[0]}
              </div>
              <div style={{ fontFamily: "'Special Elite', cursive", fontSize: 8, letterSpacing: '1px', color: 'rgba(196,154,108,.38)' }}>
                {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).toUpperCase()}
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav style={{ padding: '14px 10px', flex: 1, overflow: 'auto' }}>
            {NAV_ITEMS.map(n => (
              <div
                key={n.k}
                className="nav-btn"
                onClick={() => setView(n.k)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '11px 11px', marginBottom: 2,
                  borderLeft: `2px solid ${view === n.k ? '#c49a6c' : 'transparent'}`,
                  background: view === n.k ? 'rgba(196,154,108,.08)' : 'transparent',
                  cursor: 'pointer', transition: 'all .22s',
                }}
              >
                <span style={{ fontSize: 17, color: view === n.k ? '#c49a6c' : 'rgba(196,154,108,.3)', width: 20, textAlign: 'center' }}>
                  {n.icon}
                </span>
                <span style={{ fontFamily: "'Crimson Pro', serif", fontSize: 15, color: view === n.k ? '#e8d5b5' : 'rgba(196,154,108,.45)', transition: 'color .2s' }}>
                  {n.label}
                </span>
                {n.k === 'gallery' && entries.length > 0 && (
                  <span style={{
                    marginLeft: 'auto', fontFamily: "'Special Elite', cursive", fontSize: 8,
                    background: 'rgba(196,154,108,.1)', color: 'rgba(196,154,108,.55)', padding: '2px 6px',
                  }}>
                    {entries.length}
                  </span>
                )}
              </div>
            ))}
          </nav>

          {/* Sidebar quote */}
          <div style={{ padding: '14px 18px', borderTop: '1px solid rgba(196,154,108,.08)', flexShrink: 0 }}>
            <div style={{
              fontFamily: "'Crimson Pro', serif", fontStyle: 'italic',
              fontSize: 11.5, color: 'rgba(196,154,108,.28)', lineHeight: 1.65, textAlign: 'center',
            }}>
              "We do not remember days, we remember moments."
            </div>
          </div>

          {/* Logout */}
          <div
            className="nav-btn"
            onClick={handleLogout}
            title="Sign out"
            style={{
              padding: '13px 18px', borderTop: '1px solid rgba(196,154,108,.08)',
              display: 'flex', gap: 8, alignItems: 'center', cursor: 'pointer', flexShrink: 0,
            }}
          >
            <span style={{ color: 'rgba(196,154,108,.28)', fontSize: 13 }}>⟵</span>
            <span style={{ fontFamily: "'Special Elite', cursive", fontSize: 9, letterSpacing: '2px', color: 'rgba(196,154,108,.28)' }}>
              SIGN OUT
            </span>
          </div>
        </div>
      </aside>

      {/* ══════════════ MAIN CONTENT ══════════════ */}
      <main style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden', background: '#120d07' }}>

        {/* Top bar */}
        <div style={{
          padding: '16px 34px', borderBottom: '1px solid rgba(196,154,108,.09)',
          background: 'rgba(18,13,7,.96)', backdropFilter: 'blur(8px)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0,
        }}>
          <div>
            <div style={{
              fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic',
              fontSize: 27, fontWeight: 300, color: '#f5edd8', lineHeight: 1,
            }}>
              {greeting}, {user.name?.split(' ')[0]} ✦
            </div>
            <div style={{ fontFamily: "'Special Elite', cursive", fontSize: 8, letterSpacing: '2px', color: 'rgba(196,154,108,.35)', marginTop: 5 }}>
              {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }).toUpperCase()}
            </div>
          </div>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            {/* Music toggle in topbar too */}
            <button
              onClick={toggleMusic}
              title={musicOn ? 'Pause ambient music' : 'Play ambient music'}
              className="btn-p"
              style={{
                padding: '8px 14px',
                background: musicOn ? 'rgba(196,154,108,.12)' : 'transparent',
                border: `1px solid ${musicOn ? 'rgba(196,154,108,.4)' : 'rgba(196,154,108,.2)'}`,
                fontFamily: "'Special Elite', cursive", fontSize: 9, letterSpacing: '1.5px',
                color: musicOn ? '#c49a6c' : 'rgba(196,154,108,.4)',
                cursor: 'pointer', transition: 'all .3s',
              }}
            >
              {musicOn ? '♫ PLAYING' : '♪ AMBIENT'}
            </button>

            {/* New entry button */}
            <button
              onClick={() => setView('record')}
              className="btn-p"
              style={{
                padding: '9px 20px',
                background: 'rgba(196,154,108,.1)',
                border: '1px solid rgba(196,154,108,.28)',
                fontFamily: "'Crimson Pro', serif", fontSize: 14, color: '#c49a6c',
                cursor: 'pointer', letterSpacing: '.3px', transition: 'all .3s',
              }}
            >
              + New Entry
            </button>
          </div>
        </div>

        {/* Page content */}
        <div className="scroll-y" style={{ flex: 1, overflowY: 'auto' }}>
          {view === 'gallery'  && <GalleryView  entries={entries} onOpen={setOpenEntry} onNew={() => setView('record')} />}
          {view === 'timeline' && <TimelineView entries={entries} onOpen={setOpenEntry} onDelete={deleteEntry} />}
          {view === 'record'   && <RecordView   onSave={saveEntry} />}
          {view === 'stats'    && <StatsView    entries={entries} user={user} />}
        </div>
      </main>

      {/* Memory detail modal */}
      {openEntry && <MemoryModal entry={openEntry} onClose={() => setOpenEntry(null)} />}

      {/* Floating music orb */}
      <MusicOrb playing={musicOn} onToggle={toggleMusic} />
    </div>
  );
}
