// ============================================================
//  HUSHDIARY — Shared UI Components
// ============================================================
import React, { useEffect, useRef } from 'react';

/* ── Film edge sprockets ── */
export function FilmEdge({ side }) {
  return (
    <div style={{
      position: 'absolute', top: 0, bottom: 0, [side]: 0,
      width: 26, background: 'rgba(0,0,0,.6)', zIndex: 2,
      display: 'flex', flexDirection: 'column',
      justifyContent: 'space-evenly', alignItems: 'center',
    }}>
      {Array.from({ length: 14 }).map((_, i) => (
        <div key={i} style={{
          width: 13, height: 10, background: 'rgba(10,7,3,.9)',
          borderRadius: 2, border: '1px solid rgba(196,154,108,.1)',
        }} />
      ))}
    </div>
  );
}

/* ── Decorative divider ── */
export function Ornament({ text }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, color: 'rgba(196,154,108,.45)' }}>
      <div style={{ flex: 1, height: 1, background: 'linear-gradient(to right,transparent,rgba(196,154,108,.4))' }} />
      <span style={{
        fontFamily: "'Special Elite', cursive", fontSize: 10,
        letterSpacing: '2px', color: 'rgba(196,154,108,.55)', whiteSpace: 'nowrap',
      }}>{text}</span>
      <div style={{ flex: 1, height: 1, background: 'linear-gradient(to left,transparent,rgba(196,154,108,.4))' }} />
    </div>
  );
}

/* ── Floating particles ── */
export function Particles() {
  const syms = ['✦', '◆', '●', '·', '○', '◇', '✧'];
  return (
    <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 2, overflow: 'hidden' }}>
      {Array.from({ length: 18 }).map((_, i) => (
        <div key={i} style={{
          position: 'absolute',
          left: `${(i * 13 + 7) % 100}vw`,
          top: `${(i * 17 + 11) % 100}vh`,
          color: '#c49a6c',
          fontSize: 7 + i % 7,
          animationName: 'particleDrift',
          animationDuration: `${12 + i * 0.7}s`,
          animationDelay: `${i * 0.9}s`,
          animationTimingFunction: 'ease-in-out',
          animationIterationCount: 'infinite',
          opacity: 0.07,
          fontFamily: 'serif',
        }}>
          {syms[i % syms.length]}
        </div>
      ))}
    </div>
  );
}

/* ── Music toggle orb ── */
export function MusicOrb({ playing, onToggle }) {
  return (
    <button
      onClick={onToggle}
      className="btn-p"
      title={playing ? 'Pause ambient music' : 'Play ambient music'}
      style={{
        position: 'fixed', bottom: 28, right: 28, zIndex: 1000,
        width: 52, height: 52, borderRadius: '50%',
        background: playing
          ? 'linear-gradient(135deg,#6b3a2a,#4a2f1a)'
          : 'linear-gradient(135deg,#2c1a0e,#1a120a)',
        border: `1px solid ${playing ? 'rgba(196,154,108,.7)' : 'rgba(196,154,108,.25)'}`,
        cursor: 'pointer', color: '#c49a6c', fontSize: 20,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: playing
          ? '0 0 20px rgba(196,154,108,.3),0 4px 20px rgba(0,0,0,.5)'
          : '0 4px 20px rgba(0,0,0,.4)',
        transition: 'all .3s ease',
        animation: playing ? 'orbFloat 3s ease-in-out infinite' : 'none',
      }}
    >
      {playing ? '♫' : '♪'}
    </button>
  );
}

/* ── Spinner ── */
export function Spinner() {
  return (
    <div style={{
      width: 15, height: 15,
      border: '2px solid rgba(196,154,108,.3)',
      borderTop: '2px solid #c49a6c',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite',
    }} />
  );
}

/* ── Waveform canvas ── */
export function WaveCanvas({ isRecording, analyserRef }) {
  const cvs  = useRef(null);
  const anim = useRef(null);
  const lvl  = useRef(new Array(40).fill(4));

  useEffect(() => {
    const canvas = cvs.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const W = canvas.width, H = canvas.height;

    const draw = () => {
      ctx.clearRect(0, 0, W, H);

      if (isRecording && analyserRef.current) {
        const d = new Uint8Array(analyserRef.current.frequencyBinCount);
        analyserRef.current.getByteFrequencyData(d);
        const step = Math.floor(d.length / 40);
        for (let i = 0; i < 40; i++) {
          lvl.current[i] = lvl.current[i] * 0.72 + ((d[i * step] || 0) / 255 * H * 0.85 + 3) * 0.28;
        }
      } else {
        const t = Date.now() / 1000;
        for (let i = 0; i < 40; i++) {
          const target = 4 + Math.sin(t + i * 0.4) * 4;
          lvl.current[i] = lvl.current[i] * 0.88 + target * 0.12;
        }
      }

      const bw = W / 40;
      for (let i = 0; i < 40; i++) {
        const h = Math.max(lvl.current[i], 3);
        const x = i * bw + bw * 0.15;
        const y = (H - h) / 2;
        const gr = ctx.createLinearGradient(0, y, 0, y + h);
        if (isRecording) {
          gr.addColorStop(0, 'rgba(220,100,80,.9)');
          gr.addColorStop(.5, 'rgba(196,154,108,1)');
          gr.addColorStop(1, 'rgba(220,100,80,.9)');
        } else {
          gr.addColorStop(0, 'rgba(196,154,108,.28)');
          gr.addColorStop(1, 'rgba(196,154,108,.1)');
        }
        ctx.fillStyle = gr;
        ctx.beginPath();
        ctx.roundRect(x, y, bw * 0.7, h, 2);
        ctx.fill();
      }
      anim.current = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(anim.current);
  }, [isRecording, analyserRef]);

  return (
    <canvas
      ref={cvs}
      width={500}
      height={88}
      style={{ width: '100%', height: 88, display: 'block' }}
    />
  );
}

/* ── Scrolling film strip ── */
export function FilmStrip({ images }) {
  return (
    <div style={{
      position: 'absolute', bottom: 0, left: 26, right: 26,
      height: 68, overflow: 'hidden', zIndex: 3,
      WebkitMaskImage: 'linear-gradient(to right,transparent,black 15%,black 85%,transparent)',
    }}>
      <div style={{
        display: 'flex', gap: 6, width: 'max-content',
        animation: 'filmRoll 28s linear infinite',
      }}>
        {[...images, ...images].map((src, i) => (
          <div key={i} style={{
            width: 56, height: 64, flexShrink: 0, overflow: 'hidden',
            border: '1px solid rgba(196,154,108,.12)',
          }}>
            <img src={src} style={{
              width: '100%', height: '100%', objectFit: 'cover',
              filter: 'sepia(65%) brightness(.55)',
            }} alt="" />
          </div>
        ))}
      </div>
    </div>
  );
}
