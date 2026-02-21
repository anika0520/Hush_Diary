// ============================================================
//  HUSHDIARY — Stats / My Archive View
// ============================================================
import React, { useMemo } from 'react';
import { MOODS, QUOTES } from '../utils/constants';
import { Ornament } from '../components/SharedUI';

export default function StatsView({ entries, user }) {
  const stats = useMemo(() => {
    const total     = entries.length;
    const withAudio = entries.filter(e => e.audio).length;
    const withPhoto = entries.filter(e => e.photo).length;

    // Streak calculation
    const dateStrings = [...new Set(entries.map(e => new Date(e.date).toDateString()))];
    let streak = 0;
    const check = new Date();
    if (!dateStrings.includes(check.toDateString())) check.setDate(check.getDate() - 1);
    while (dateStrings.includes(check.toDateString())) {
      streak++;
      check.setDate(check.getDate() - 1);
    }

    // Mood counts
    const moodCounts = {};
    entries.forEach(e => { if (e.mood) moodCounts[e.mood] = (moodCounts[e.mood] || 0) + 1; });

    return { total, withAudio, withPhoto, streak, daysActive: dateStrings.length, moodCounts };
  }, [entries]);

  const topMoods = Object.entries(stats.moodCounts).sort((a, b) => b[1] - a[1]);
  const q = QUOTES[Math.floor(Date.now() / 86400000) % QUOTES.length];

  const statCards = [
    { n: stats.total,      l: 'Total Memories' },
    { n: stats.streak,     l: 'Day Streak 🔥'  },
    { n: stats.withAudio,  l: 'Voice Entries'  },
    { n: stats.daysActive, l: 'Days Active'    },
  ];

  return (
    <div style={{ padding: '32px 36px', animation: 'fadeUp .5s ease both' }}>
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 34, fontWeight: 300, color: '#f5edd8', marginBottom: 4 }}>
          My Archive
        </h2>
        <p style={{ fontFamily: "'Crimson Pro', serif", fontStyle: 'italic', fontSize: 15, color: 'rgba(196,154,108,.6)' }}>
          The shape of your inner life
        </p>
      </div>

      {/* Stat cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14, marginBottom: 24 }}>
        {statCards.map((s, i) => (
          <div
            key={i}
            className="stat-c"
            style={{
              background: 'rgba(20,14,8,.85)', border: '1px solid rgba(196,154,108,.14)',
              padding: '22px 18px', textAlign: 'center',
              animation: `fadeUp .5s ease ${i * .1}s both`,
              boxShadow: '0 4px 20px rgba(0,0,0,.3)', transition: 'all .3s cubic-bezier(.23,1,.32,1)',
            }}
          >
            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 52, fontWeight: 300, color: '#c49a6c', lineHeight: 1, marginBottom: 8 }}>
              {s.n}
            </div>
            <div style={{ fontFamily: "'Special Elite', cursive", fontSize: 9, letterSpacing: '2px', color: 'rgba(196,154,108,.45)' }}>
              {s.l.toUpperCase()}
            </div>
          </div>
        ))}
      </div>

      {/* Mood chart */}
      {topMoods.length > 0 && (
        <div style={{ background: 'rgba(20,14,8,.85)', border: '1px solid rgba(196,154,108,.14)', padding: 26, marginBottom: 18 }}>
          <Ornament text="YOUR MOOD PALETTE" />
          <div style={{ marginTop: 22, display: 'flex', gap: 14, alignItems: 'flex-end', height: 150 }}>
            {topMoods.map(([mk, cnt]) => {
              const m   = MOODS.find(x => x.key === mk);
              const pct = cnt / stats.total;
              if (!m) return null;
              return (
                <div key={mk} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 7 }}>
                  <div style={{
                    width: '100%', maxWidth: 50,
                    background: `linear-gradient(to top,${m.color},${m.color}66)`,
                    borderRadius: '3px 3px 0 0',
                    height: Math.max(pct * 130, 6),
                    margin: '0 auto', transition: 'height 1s ease',
                  }} />
                  <div style={{ fontSize: 18 }}>{m.emoji}</div>
                  <div style={{ fontFamily: "'Special Elite', cursive", fontSize: 8, letterSpacing: '.5px', color: 'rgba(196,154,108,.45)', textAlign: 'center' }}>
                    {mk.toUpperCase()}
                  </div>
                  <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 13, color: 'rgba(196,154,108,.6)' }}>
                    {cnt}×
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Bottom row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
        {/* Daily quote */}
        <div style={{ background: 'rgba(20,14,8,.85)', border: '1px solid rgba(196,154,108,.14)', padding: 26 }}>
          <Ornament text="TODAY'S REFLECTION" />
          <blockquote style={{
            marginTop: 18,
            fontFamily: "'Crimson Pro', serif", fontStyle: 'italic',
            fontSize: 19, color: 'rgba(232,213,181,.72)',
            lineHeight: 1.7, paddingLeft: 14,
            borderLeft: '2px solid rgba(196,154,108,.32)',
          }}>
            "{q.text}"
          </blockquote>
          <div style={{ fontFamily: "'Special Elite', cursive", fontSize: 9, letterSpacing: '3px', color: 'rgba(196,154,108,.38)', marginTop: 14 }}>
            — {q.author.toUpperCase()}
          </div>
        </div>

        {/* Recent memory grid */}
        <div style={{ background: 'rgba(20,14,8,.85)', border: '1px solid rgba(196,154,108,.14)', padding: 26 }}>
          <Ornament text="RECENT MEMORIES" />
          <div style={{ marginTop: 18, display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 7 }}>
            {entries.slice(0, 6).map(e => {
              const m = MOODS.find(x => x.key === e.mood);
              return (
                <div key={e.id} style={{ border: '1px solid rgba(196,154,108,.12)', overflow: 'hidden' }}>
                  {e.photo ? (
                    <img src={e.photo} style={{ width: '100%', height: 54, objectFit: 'cover', filter: 'sepia(18%)', display: 'block' }} alt="" />
                  ) : (
                    <div style={{ height: 54, background: m?.bg || 'rgba(196,154,108,.07)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>
                      {m?.emoji || '✦'}
                    </div>
                  )}
                  <div style={{ padding: '4px 6px', fontFamily: "'Special Elite', cursive", fontSize: 7, letterSpacing: '.5px', color: 'rgba(196,154,108,.38)', background: 'rgba(20,14,8,.7)' }}>
                    {new Date(e.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </div>
                </div>
              );
            })}
          </div>
          {entries.length === 0 && (
            <div style={{ textAlign: 'center', padding: '20px 0', fontFamily: "'Crimson Pro', serif", fontStyle: 'italic', color: 'rgba(196,154,108,.35)', fontSize: 14 }}>
              No memories yet
            </div>
          )}
        </div>
      </div>

      {/* Account info */}
      <div style={{ marginTop: 18, background: 'rgba(20,14,8,.85)', border: '1px solid rgba(196,154,108,.14)', padding: 22 }}>
        <Ornament text="ACCOUNT DETAILS" />
        <div style={{ marginTop: 16, display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 14 }}>
          {[
            { l: 'Archivist', v: user.name },
            { l: 'Email',     v: user.email },
            { l: 'Member Since', v: new Date(user.createdAt || Date.now()).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) },
          ].map((item, i) => (
            <div key={i}>
              <div style={{ fontFamily: "'Special Elite', cursive", fontSize: 8, letterSpacing: '2px', color: 'rgba(196,154,108,.38)', marginBottom: 5 }}>
                {item.l.toUpperCase()}
              </div>
              <div style={{ fontFamily: "'Crimson Pro', serif", fontSize: 16, color: '#e8d5b5' }}>
                {item.v}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
