// ============================================================
//  HUSHDIARY — Signup Page
// ============================================================
import React, { useState } from 'react';
import { IMGS } from '../utils/constants';
import { DB } from '../utils/db';
import { useToast } from '../components/Toast';
import { FilmEdge, Spinner } from '../components/SharedUI';

const FEATURES = [
  { icon: '🎙', title: 'Voice Recordings',   desc: 'Capture thoughts in your own voice. Revisit them years from now.' },
  { icon: '📷', title: 'Photo Memories',     desc: 'Attach photographs to entries. Build a visual diary of your life.' },
  { icon: '📅', title: 'Timeline Gallery',   desc: "Scroll through memories like vintage photographs in a collector's archive." },
  { icon: '🔒', title: 'Completely Private', desc: 'All memories live only in your browser. No servers, no sharing.' },
];

export default function SignupPage({ onNav, onLogin }) {
  const toast = useToast();
  const [form,    setForm]    = useState({ name: '', email: '', pw: '' });
  const [loading, setLoading] = useState(false);
  const [focus,   setFocus]   = useState(null);
  const [imgOk,   setImgOk]   = useState(false);

  const set = (key) => (e) => setForm(p => ({ ...p, [key]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.pw) { toast('Please fill all fields.', 'err'); return; }
    if (form.pw.length < 6) { toast('Password must be at least 6 characters.', 'err'); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 700));

    const users = DB.getUsers();
    const uid   = DB.uid(form.email);
    if (users[uid]) { toast('An archive already exists for this email.', 'err'); setLoading(false); return; }

    const newUser = {
      uid,
      name:      form.name.trim(),
      email:     form.email.trim().toLowerCase(),
      password:  DB.hash(form.pw),
      createdAt: new Date().toISOString(),
      avatar:    form.name.trim().charAt(0).toUpperCase(),
    };
    users[uid] = newUser;
    DB.saveUsers(users);
    DB.setSession(newUser);
    onLogin(newUser);
  };

  const inputStyle = (id) => ({
    width: '100%', padding: '12px 14px',
    background: focus === id ? '#fdf4e3' : 'rgba(253,244,227,.8)',
    border: 'none',
    borderBottom: `2px solid ${focus === id ? '#8b5e3c' : 'rgba(196,154,108,.4)'}`,
    fontFamily: "'Crimson Pro', serif", fontSize: 16, color: '#1a120a',
    transition: 'all .3s',
  });

  return (
    <div className="page-anim" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', minHeight: '100vh' }}>

      {/* ── Form Panel ── */}
      <div style={{
        background: '#fdf4e3', display: 'flex', flexDirection: 'column',
        justifyContent: 'center', padding: '60px 64px',
        position: 'relative', overflow: 'auto',
      }}>
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'repeating-linear-gradient(0deg,transparent,transparent 27px,rgba(196,154,108,.06) 27px,rgba(196,154,108,.06) 28px)',
          pointerEvents: 'none',
        }} />

        <div style={{ position: 'relative', zIndex: 1, animation: 'fadeUp .8s ease both' }}>
          <div style={{ fontFamily: "'Special Elite', cursive", fontSize: 10, letterSpacing: '4px', color: '#c49a6c', marginBottom: 14 }}>
            BEGIN YOUR STORY
          </div>

          <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 40, fontWeight: 300, color: '#1a120a', lineHeight: 1.08, marginBottom: 10 }}>
            Create your<br />memory archive
          </h1>

          <p style={{ fontFamily: "'Crimson Pro', serif", fontStyle: 'italic', fontSize: 16, color: '#8b5e3c', marginBottom: 34, lineHeight: 1.5 }}>
            Every diary needs its first page.
          </p>

          <form onSubmit={handleSubmit}>
            {[
              { id: 'name',  label: 'YOUR NAME',      type: 'text',     ph: 'What shall we call you?' },
              { id: 'email', label: 'EMAIL ADDRESS',  type: 'email',    ph: 'your@memory.com' },
              { id: 'pw',    label: 'PASSWORD',       type: 'password', ph: 'At least 6 characters' },
            ].map(f => (
              <div key={f.id} style={{ marginBottom: 18 }}>
                <label style={{
                  fontFamily: "'Special Elite', cursive", fontSize: 10,
                  letterSpacing: '3px', color: '#8b5e3c', display: 'block', marginBottom: 8,
                }}>{f.label}</label>
                <input
                  type={f.type}
                  value={form[f.id]}
                  onChange={set(f.id)}
                  onFocus={() => setFocus(f.id)}
                  onBlur={() => setFocus(null)}
                  placeholder={f.ph}
                  style={inputStyle(f.id)}
                />
              </div>
            ))}

            <button
              type="submit"
              disabled={loading}
              className="btn-p"
              style={{
                width: '100%', padding: '15px', marginTop: 10,
                background: 'linear-gradient(135deg,#4a2f1a,#2c1a0e)',
                color: '#e8d5b5', border: '1px solid rgba(196,154,108,.3)',
                fontFamily: "'Crimson Pro', serif", fontSize: 17,
                cursor: loading ? 'default' : 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                boxShadow: '0 4px 20px rgba(0,0,0,.3)', transition: 'all .3s', letterSpacing: '.5px',
              }}
            >
              {loading ? <><Spinner /> Creating...</> : 'Begin my archive →'}
            </button>
          </form>

          <div style={{
            marginTop: 22, paddingTop: 18, borderTop: '1px solid rgba(196,154,108,.2)',
            textAlign: 'center', fontSize: 15, color: '#8b5e3c',
            fontFamily: "'Crimson Pro', serif",
          }}>
            Already have a diary?{' '}
            <span onClick={() => onNav('login')} style={{ color: '#4a2f1a', textDecoration: 'underline', textUnderlineOffset: 3, cursor: 'pointer' }}>
              Return home
            </span>
          </div>

          <div style={{ marginTop: 18, padding: '12px 16px', border: '1px dashed rgba(196,154,108,.3)', textAlign: 'center' }}>
            <div style={{ fontFamily: "'Special Elite', cursive", fontSize: 9, letterSpacing: '3px', color: '#c49a6c', marginBottom: 4 }}>YOUR PRIVACY</div>
            <div style={{ fontSize: 13, color: '#8b5e3c', fontStyle: 'italic' }}>Stored only in your browser. No servers. Truly yours.</div>
          </div>
        </div>
      </div>

      {/* ── Visual Panel ── */}
      <div style={{ position: 'relative', background: '#080503', overflow: 'hidden' }}>
        <FilmEdge side="left" />
        <FilmEdge side="right" />

        <div style={{
          position: 'absolute', inset: 26, zIndex: 1,
          backgroundImage: `url(${IMGS.signupBg})`,
          backgroundSize: 'cover', backgroundPosition: 'center',
          filter: 'sepia(38%) contrast(.82) brightness(.5)',
          opacity: imgOk ? 1 : 0, transition: 'opacity 1.2s',
        }}>
          <img src={IMGS.signupBg} onLoad={() => setImgOk(true)} style={{ display: 'none' }} alt="" />
        </div>

        <div style={{ position: 'absolute', inset: 0, zIndex: 2, background: 'linear-gradient(135deg,rgba(8,5,3,.4),rgba(8,5,3,.65))' }} />

        <div style={{
          position: 'absolute', inset: 0, zIndex: 3,
          display: 'flex', flexDirection: 'column', justifyContent: 'center',
          padding: '48px 52px', animation: 'slideInR .8s ease .3s both',
        }}>
          <div style={{ fontFamily: "'Special Elite', cursive", fontSize: 10, letterSpacing: '4px', color: 'rgba(196,154,108,.6)', marginBottom: 18 }}>WHAT AWAITS YOU</div>
          <div style={{ fontFamily: "'IM Fell English', serif", fontSize: 42, color: '#f5edd8', lineHeight: 1.05, marginBottom: 6 }}>Your own</div>
          <div style={{ fontFamily: "'IM Fell English', serif", fontStyle: 'italic', fontSize: 42, color: '#c49a6c', lineHeight: 1.05, marginBottom: 30 }}>private gallery</div>
          <div style={{ width: 38, height: 1, background: 'rgba(196,154,108,.5)', marginBottom: 28 }} />

          {FEATURES.map((f, i) => (
            <div key={i} style={{ display: 'flex', gap: 14, marginBottom: 22, animation: `fadeUp .6s ease ${.3 + i * .15}s both` }}>
              <div style={{
                width: 40, height: 40, flexShrink: 0,
                background: 'rgba(196,154,108,.1)', border: '1px solid rgba(196,154,108,.2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18,
              }}>{f.icon}</div>
              <div>
                <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 17, color: '#f5edd8', marginBottom: 2 }}>{f.title}</div>
                <div style={{ fontSize: 13, color: 'rgba(232,213,181,.5)', fontStyle: 'italic', lineHeight: 1.4 }}>{f.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
