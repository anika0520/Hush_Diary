// ============================================================
//  HUSHDIARY — Login Page
// ============================================================
import React, { useState } from 'react';
import { IMGS, GALLERY_IMGS, QUOTES } from '../utils/constants';
import { DB } from '../utils/db';
import { useToast } from '../components/Toast';
import { FilmEdge, FilmStrip, Spinner } from '../components/SharedUI';

export default function LoginPage({ onNav, onLogin }) {
  const toast     = useToast();
  const [email,   setEmail]   = useState('');
  const [pw,      setPw]      = useState('');
  const [loading, setLoading] = useState(false);
  const [focus,   setFocus]   = useState(null);
  const [imgOk,   setImgOk]   = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !pw) { toast('Please fill in all fields.', 'err'); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 650));
    const users = DB.getUsers();
    const uid   = DB.uid(email);
    const user  = users[uid];
    if (!user || user.password !== DB.hash(pw)) {
      toast("These credentials don't match any archive.", 'err');
      setLoading(false);
      return;
    }
    DB.setSession(user);
    onLogin(user);
  };

  const inputStyle = (id) => ({
    width: '100%', padding: '13px 15px',
    background: focus === id ? '#fdf4e3' : 'rgba(253,244,227,.8)',
    border: 'none',
    borderBottom: `2px solid ${focus === id ? '#8b5e3c' : 'rgba(196,154,108,.4)'}`,
    fontFamily: "'Crimson Pro', serif", fontSize: 17, color: '#1a120a',
    transition: 'all .3s',
    boxShadow: focus === id ? '0 2px 12px rgba(139,94,60,.1)' : 'none',
  });

  return (
    <div className="page-anim" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', minHeight: '100vh' }}>

      {/* ── Visual Panel ── */}
      <div style={{ position: 'relative', background: '#080503', overflow: 'hidden' }}>
        <FilmEdge side="left" />
        <FilmEdge side="right" />

        {/* Background photo */}
        <div style={{
          position: 'absolute', inset: 26, zIndex: 1,
          backgroundImage: `url(${IMGS.loginBg})`,
          backgroundSize: 'cover', backgroundPosition: 'center',
          filter: 'sepia(45%) contrast(.82) brightness(.55)',
          opacity: imgOk ? 1 : 0, transition: 'opacity 1.2s ease',
        }}>
          <img src={IMGS.loginBg} onLoad={() => setImgOk(true)} style={{ display: 'none' }} alt="" />
        </div>

        {/* Gradient overlay */}
        <div style={{
          position: 'absolute', inset: 0, zIndex: 2,
          background: 'linear-gradient(to bottom,rgba(8,5,3,.25) 0%,rgba(8,5,3,.08) 40%,rgba(8,5,3,.72) 100%)',
        }} />

        {/* Brand text */}
        <div style={{
          position: 'absolute', inset: 0, zIndex: 3,
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          justifyContent: 'center', padding: '40px 52px',
          animation: 'fadeUp 1s ease .3s both',
        }}>
          <div style={{
            fontFamily: "'Special Elite', cursive", fontSize: 10,
            letterSpacing: '6px', color: 'rgba(196,154,108,.65)', marginBottom: 22,
          }}>EST. IN YOUR MEMORY</div>

          <div style={{
            fontFamily: "'IM Fell English', serif", fontSize: 78,
            color: '#f5edd8', lineHeight: .9, textAlign: 'center',
            textShadow: '0 4px 48px rgba(0,0,0,.9)',
            animation: 'textFlicker 9s ease-in-out infinite',
          }}>Hush</div>

          <div style={{
            fontFamily: "'IM Fell English', serif", fontStyle: 'italic',
            fontSize: 60, color: '#c49a6c', lineHeight: 1, textAlign: 'center',
            textShadow: '0 4px 48px rgba(0,0,0,.9)', marginBottom: 28,
          }}>Diary</div>

          <div style={{ width: 52, height: 1, background: 'rgba(196,154,108,.5)', marginBottom: 24 }} />

          <p style={{
            fontFamily: "'Crimson Pro', serif", fontStyle: 'italic',
            fontSize: 17, color: 'rgba(232,213,181,.65)',
            textAlign: 'center', lineHeight: 1.75, maxWidth: 270,
          }}>
            A private gallery where your whispers become timeless memories.
          </p>
        </div>

        <FilmStrip images={GALLERY_IMGS} />
      </div>

      {/* ── Form Panel ── */}
      <div style={{
        background: '#fdf4e3', display: 'flex', flexDirection: 'column',
        justifyContent: 'center', padding: '60px 64px',
        position: 'relative', overflow: 'auto',
      }}>
        {/* Lined paper texture */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'repeating-linear-gradient(0deg,transparent,transparent 27px,rgba(196,154,108,.06) 27px,rgba(196,154,108,.06) 28px)',
          pointerEvents: 'none',
        }} />

        <div style={{ position: 'relative', zIndex: 1, animation: 'fadeUp .8s ease .5s both' }}>
          <div style={{
            fontFamily: "'Special Elite', cursive", fontSize: 10,
            letterSpacing: '4px', color: '#c49a6c', marginBottom: 14,
          }}>WELCOME BACK</div>

          <h1 style={{
            fontFamily: "'Cormorant Garamond', serif", fontSize: 44,
            fontWeight: 300, color: '#1a120a', lineHeight: 1.08, marginBottom: 10,
          }}>Step into<br />your archive</h1>

          <p style={{
            fontFamily: "'Crimson Pro', serif", fontStyle: 'italic',
            fontSize: 17, color: '#8b5e3c', marginBottom: 40, lineHeight: 1.5,
          }}>Where your whispers become timeless.</p>

          <form onSubmit={handleSubmit}>
            {/* Email */}
            <div style={{ marginBottom: 22 }}>
              <label style={{
                fontFamily: "'Special Elite', cursive", fontSize: 10,
                letterSpacing: '3px', color: '#8b5e3c', display: 'block', marginBottom: 9,
              }}>EMAIL ADDRESS</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                onFocus={() => setFocus('email')}
                onBlur={() => setFocus(null)}
                placeholder="your@memory.com"
                style={inputStyle('email')}
              />
            </div>

            {/* Password */}
            <div style={{ marginBottom: 22 }}>
              <label style={{
                fontFamily: "'Special Elite', cursive", fontSize: 10,
                letterSpacing: '3px', color: '#8b5e3c', display: 'block', marginBottom: 9,
              }}>PASSWORD</label>
              <input
                type="password"
                value={pw}
                onChange={e => setPw(e.target.value)}
                onFocus={() => setFocus('pw')}
                onBlur={() => setFocus(null)}
                placeholder="••••••••••"
                style={inputStyle('pw')}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-p"
              style={{
                width: '100%', padding: '16px', marginTop: 6,
                background: loading ? '#5a3a1a' : 'linear-gradient(135deg,#4a2f1a,#2c1a0e)',
                color: '#e8d5b5', border: '1px solid rgba(196,154,108,.3)',
                fontFamily: "'Crimson Pro', serif", fontSize: 17,
                cursor: loading ? 'default' : 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                transition: 'all .3s', letterSpacing: '.5px',
                boxShadow: '0 4px 20px rgba(0,0,0,.3)',
              }}
            >
              {loading ? <><Spinner /> Entering...</> : 'Enter the archive →'}
            </button>
          </form>

          <div style={{
            marginTop: 28, paddingTop: 20, borderTop: '1px solid rgba(196,154,108,.2)',
            textAlign: 'center', fontSize: 15, color: '#8b5e3c',
            fontFamily: "'Crimson Pro', serif",
          }}>
            No diary yet?{' '}
            <span
              onClick={() => onNav('signup')}
              style={{ color: '#4a2f1a', textDecoration: 'underline', textUnderlineOffset: 3, cursor: 'pointer', fontWeight: 500 }}
            >
              Begin your story
            </span>
          </div>

          <blockquote style={{
            marginTop: 28, padding: '14px 18px',
            borderLeft: '2px solid rgba(196,154,108,.4)',
            fontStyle: 'italic', fontSize: 14, color: '#c49a6c',
            background: 'rgba(196,154,108,.05)', lineHeight: 1.65,
          }}>
            "{QUOTES[0].text}"
            <div style={{
              fontFamily: "'Special Elite', cursive", fontSize: 10,
              letterSpacing: '2px', marginTop: 6, opacity: .55,
            }}>— {QUOTES[0].author.toUpperCase()}</div>
          </blockquote>
        </div>
      </div>
    </div>
  );
}
