// ============================================================
//  HUSHDIARY — Record a Memory Page
// ============================================================
import React, { useState, useRef, useEffect } from "react";
import { MOODS } from "../utils/constants";
import { useToast } from "../components/Toast";
import { WaveCanvas, Spinner } from "../components/SharedUI";

export default function RecordView({ onSave }) {
  const toast = useToast();

  // Recording state
  const [isRec, setIsRec] = useState(false);
  const [secs, setSecs] = useState(0);
  const [blob, setBlob] = useState(null);
  const [prevURL, setPrevURL] = useState(null);

  // Entry details
  const [mood, setMood] = useState(null);
  const [note, setNote] = useState("");
  const [photo, setPhoto] = useState(null);
  const [saving, setSaving] = useState(false);
  const [noteFocus, setNoteFocus] = useState(false);

  // Refs
  const mrRef = useRef(null);
  const chunksRef = useRef([]);
  const timerRef = useRef(null);
  const analyserRef = useRef(null);
  const micCtxRef = useRef(null);
  const streamRef = useRef(null);
  const photoRef = useRef(null);

  const fmtTime = (s) =>
    `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, "0")}`;

  /* ── Start recording ── */
  const startRec = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      // Analyser for waveform
      const mc = new (window.AudioContext || window.webkitAudioContext)();
      micCtxRef.current = mc;
      const src = mc.createMediaStreamSource(stream);
      const an = mc.createAnalyser();
      an.fftSize = 256;
      src.connect(an);
      analyserRef.current = an;

      // MediaRecorder
      chunksRef.current = [];
      const mime = MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
        ? "audio/webm;codecs=opus"
        : "audio/webm";
      const mr = new MediaRecorder(stream, { mimeType: mime });
      mr.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };
      mr.onstop = () => {
        const b = new Blob(chunksRef.current, { type: "audio/webm" });
        setBlob(b);
        setPrevURL(URL.createObjectURL(b));
      };
      mr.start(100);
      mrRef.current = mr;

      setIsRec(true);
      setSecs(0);
      timerRef.current = setInterval(() => {
        setSecs((s) => {
          if (s >= 299) {
            stopRec();
            return s;
          }
          return s + 1;
        });
      }, 1000);
    } catch (err) {
      toast(
        "Microphone access denied. Please allow microphone in browser settings.",
        "err",
      );
    }
  };

  /* ── Stop recording ── */
  const stopRec = () => {
    if (mrRef.current && mrRef.current.state !== "inactive")
      mrRef.current.stop();
    streamRef.current?.getTracks().forEach((t) => t.stop());
    try {
      if (micCtxRef.current && micCtxRef.current.state !== "closed") {
        micCtxRef.current.close();
      }
      micCtxRef.current = null;
    } catch {}
    analyserRef.current = null;
    clearInterval(timerRef.current);
    setIsRec(false);
  };

  /* ── Discard ── */
  const discardRec = () => {
    setBlob(null);
    setPrevURL(null);
    setSecs(0);
  };

  /* ── Photo upload ── */
  const handlePhoto = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const rd = new FileReader();
    rd.onload = (ev) => setPhoto(ev.target.result);
    rd.readAsDataURL(file);
  };

  /* ── Save entry ── */
  const handleSave = async () => {
    if (!blob && !photo) {
      toast("Please record a voice memory or add a photo first.", "err");
      return;
    }
    setSaving(true);

    let audioB64 = null;
    if (blob) {
      try {
        audioB64 = await new Promise((res, rej) => {
          const r = new FileReader();
          r.onloadend = () => res(r.result);
          r.onerror = rej;
          r.readAsDataURL(blob);
        });
      } catch {
        toast("Could not encode audio.", "err");
        setSaving(false);
        return;
      }
    }

    const entry = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      mood,
      note: note.trim(),
      audio: audioB64,
      photo,
      duration: secs,
    };

    try {
      onSave(entry);
      // Reset form
      setBlob(null);
      setPrevURL(null);
      setSecs(0);
      setMood(null);
      setNote("");
      setPhoto(null);
      if (photoRef.current) photoRef.current.value = "";
      toast("✦ Memory preserved in your archive");
    } catch {
      toast("Storage may be full. Try removing some entries.", "err");
    }
    setSaving(false);
  };

  // Cleanup on unmount
  useEffect(
    () => () => {
      if (mrRef.current?.state !== "inactive") {
        stopRec();
      }
      clearInterval(timerRef.current);
    },
    [],
  );

  const canSave = !saving && (!!blob || !!photo);

  return (
    <div style={{ padding: "32px 36px", animation: "fadeUp .5s ease both" }}>
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <h2
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 34,
            fontWeight: 300,
            color: "#f5edd8",
            marginBottom: 5,
          }}
        >
          Capture a Memory
        </h2>
        <p
          style={{
            fontFamily: "'Crimson Pro', serif",
            fontStyle: "italic",
            fontSize: 16,
            color: "rgba(196,154,108,.65)",
          }}
        >
          Your voice is the most honest diary entry
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 24,
          maxWidth: 960,
        }}
      >
        {/* ── Recording Card ── */}
        <div
          style={{
            background: "rgba(20,14,8,.85)",
            border: "1px solid rgba(196,154,108,.14)",
            padding: 28,
            backdropFilter: "blur(4px)",
          }}
        >
          <div
            style={{
              fontFamily: "'Special Elite', cursive",
              fontSize: 10,
              letterSpacing: "3px",
              color: "rgba(196,154,108,.55)",
              marginBottom: 20,
            }}
          >
            VOICE RECORDING
          </div>

          {/* Waveform */}
          <div
            style={{
              marginBottom: 18,
              paddingBottom: 16,
              borderBottom: "1px dashed rgba(196,154,108,.18)",
            }}
          >
            <WaveCanvas isRecording={isRec} analyserRef={analyserRef} />
          </div>

          {/* Timer */}
          <div style={{ textAlign: "center", marginBottom: 24 }}>
            <div
              style={{
                fontFamily: "'Special Elite', cursive",
                fontSize: 48,
                letterSpacing: "6px",
                color: isRec ? "#e06050" : "#e8d5b5",
                marginBottom: 7,
                transition: "color .4s",
                textShadow: isRec ? "0 0 24px rgba(220,100,80,.45)" : "none",
              }}
            >
              {fmtTime(secs)}
            </div>
            <div
              style={{
                fontFamily: "'Crimson Pro', serif",
                fontStyle: "italic",
                fontSize: 14,
                color: "rgba(196,154,108,.6)",
                minHeight: 22,
              }}
            >
              {isRec
                ? "● Recording... speak freely, your words are safe here"
                : blob
                  ? "✦ Listen back, then save when ready"
                  : "Tap the button below to begin whispering ✦"}
            </div>
          </div>

          {/* Record Button */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginBottom: 22,
            }}
          >
            <button
              onClick={() => (isRec ? stopRec() : startRec())}
              className="btn-p"
              title={isRec ? "Stop recording" : "Start recording"}
              style={{
                width: 86,
                height: 86,
                borderRadius: "50%",
                background: isRec
                  ? "radial-gradient(circle at 40% 35%,#a02020,#5a1010)"
                  : "radial-gradient(circle at 40% 35%,#5a3a1a,#2c1a0e)",
                border: `2.5px solid ${isRec ? "rgba(220,100,80,.75)" : "rgba(196,154,108,.4)"}`,
                cursor: "pointer",
                fontSize: 30,
                color: isRec ? "#ff8070" : "#c49a6c",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: isRec
                  ? "0 4px 24px rgba(0,0,0,.6)"
                  : "0 4px 24px rgba(0,0,0,.5)",
                animation: isRec
                  ? "recordGlow 2s ease-in-out infinite"
                  : "orbFloat 4.5s ease-in-out infinite",
                transition: "background .5s,border-color .4s,color .4s",
                position: "relative",
                overflow: "hidden",
              }}
            >
              {isRec ? "⏹" : "◉"}
              {isRec && (
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    borderRadius: "50%",
                    background: "rgba(220,80,80,.12)",
                    animation: "rippleOut 1.8s ease-out infinite",
                  }}
                />
              )}
            </button>
          </div>

          <div
            style={{
              textAlign: "center",
              fontFamily: "'Special Elite', cursive",
              fontSize: 9,
              letterSpacing: "2px",
              color: "rgba(196,154,108,.35)",
              marginBottom: 16,
            }}
          >
            {isRec ? "CLICK CIRCLE TO STOP" : "CLICK CIRCLE TO RECORD"}
          </div>

          {/* Playback */}
          {prevURL && !isRec && (
            <div
              style={{
                borderTop: "1px dashed rgba(196,154,108,.2)",
                paddingTop: 16,
                animation: "fadeIn .4s ease both",
              }}
            >
              <div
                style={{
                  fontFamily: "'Special Elite', cursive",
                  fontSize: 9,
                  letterSpacing: "2px",
                  color: "rgba(196,154,108,.45)",
                  marginBottom: 10,
                }}
              >
                PREVIEW YOUR RECORDING
              </div>
              <audio
                src={prevURL}
                controls
                style={{ width: "100%", borderRadius: 2 }}
              />
              <button
                onClick={discardRec}
                style={{
                  marginTop: 10,
                  background: "none",
                  border: "1px solid rgba(196,154,108,.18)",
                  color: "rgba(196,154,108,.45)",
                  fontFamily: "'Special Elite', cursive",
                  fontSize: 9,
                  letterSpacing: "1px",
                  padding: "7px 14px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  transition: "all .2s",
                }}
              >
                × DISCARD &amp; RE-RECORD
              </button>
            </div>
          )}
        </div>

        {/* ── Details Card ── */}
        <div
          style={{
            background: "rgba(20,14,8,.85)",
            border: "1px solid rgba(196,154,108,.14)",
            padding: 28,
            backdropFilter: "blur(4px)",
            display: "flex",
            flexDirection: "column",
            gap: 20,
          }}
        >
          <div
            style={{
              fontFamily: "'Special Elite', cursive",
              fontSize: 10,
              letterSpacing: "3px",
              color: "rgba(196,154,108,.55)",
            }}
          >
            MEMORY DETAILS
          </div>

          {/* Mood selector */}
          <div>
            <div
              style={{
                fontFamily: "'Special Elite', cursive",
                fontSize: 9,
                letterSpacing: "2px",
                color: "rgba(196,154,108,.45)",
                marginBottom: 12,
              }}
            >
              HOW ARE YOU FEELING?
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(4,1fr)",
                gap: 7,
              }}
            >
              {MOODS.map((m) => (
                <div
                  key={m.key}
                  className="mood-chip"
                  onClick={() => setMood(mood === m.key ? null : m.key)}
                  style={{
                    padding: "10px 5px",
                    border: `1px solid ${mood === m.key ? m.color : "rgba(196,154,108,.2)"}`,
                    background: mood === m.key ? m.bg : "rgba(20,14,8,.5)",
                    textAlign: "center",
                    cursor: "pointer",
                    boxShadow:
                      mood === m.key ? `0 0 14px ${m.color}33` : "none",
                    transition: "all .25s",
                  }}
                >
                  <div style={{ fontSize: 18, marginBottom: 3 }}>{m.emoji}</div>
                  <div
                    style={{
                      fontFamily: "'Special Elite', cursive",
                      fontSize: 7,
                      letterSpacing: ".5px",
                      color: mood === m.key ? m.color : "rgba(196,154,108,.45)",
                    }}
                  >
                    {m.label.toUpperCase()}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Written note */}
          <div>
            <div
              style={{
                fontFamily: "'Special Elite', cursive",
                fontSize: 9,
                letterSpacing: "2px",
                color: "rgba(196,154,108,.45)",
                marginBottom: 10,
              }}
            >
              A WRITTEN THOUGHT
            </div>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              onFocus={() => setNoteFocus(true)}
              onBlur={() => setNoteFocus(false)}
              placeholder="Write a few words... or let your voice say it all."
              rows={4}
              style={{
                width: "100%",
                background: noteFocus
                  ? "rgba(44,26,14,.8)"
                  : "rgba(20,14,8,.6)",
                border: `1px solid ${noteFocus ? "rgba(196,154,108,.5)" : "rgba(196,154,108,.2)"}`,
                color: "#e8d5b5",
                fontFamily: "'Crimson Pro', serif",
                fontStyle: "italic",
                fontSize: 16,
                padding: "12px 14px",
                resize: "none",
                outline: "none",
                lineHeight: 1.6,
                transition: "all .3s",
              }}
            />
          </div>

          {/* Photo upload */}
          <div>
            <div
              style={{
                fontFamily: "'Special Elite', cursive",
                fontSize: 9,
                letterSpacing: "2px",
                color: "rgba(196,154,108,.45)",
                marginBottom: 10,
              }}
            >
              ATTACH A PHOTOGRAPH
            </div>
            <div
              className="photo-drop"
              onClick={() => photoRef.current.click()}
              style={{
                border: `1px dashed ${photo ? "rgba(196,154,108,.6)" : "rgba(196,154,108,.22)"}`,
                minHeight: 100,
                cursor: "pointer",
                overflow: "hidden",
                position: "relative",
                transition: "all .3s",
              }}
            >
              {photo ? (
                <>
                  <img
                    src={photo}
                    style={{
                      width: "100%",
                      height: 130,
                      objectFit: "cover",
                      display: "block",
                      filter: "sepia(10%)",
                    }}
                    alt="preview"
                  />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setPhoto(null);
                      if (photoRef.current) photoRef.current.value = "";
                    }}
                    style={{
                      position: "absolute",
                      top: 8,
                      right: 8,
                      background: "rgba(10,7,3,.85)",
                      border: "1px solid rgba(196,154,108,.4)",
                      color: "#c49a6c",
                      width: 28,
                      height: 28,
                      borderRadius: "50%",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 13,
                    }}
                  >
                    ✕
                  </button>
                </>
              ) : (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: 22,
                    gap: 8,
                  }}
                >
                  <div style={{ fontSize: 30, opacity: 0.4 }}>📷</div>
                  <div
                    style={{
                      fontFamily: "'Special Elite', cursive",
                      fontSize: 9,
                      letterSpacing: "2px",
                      color: "rgba(196,154,108,.45)",
                    }}
                  >
                    ADD A PHOTOGRAPH
                  </div>
                  <div
                    style={{
                      fontSize: 13,
                      color: "rgba(196,154,108,.3)",
                      fontStyle: "italic",
                    }}
                  >
                    optional memory attachment
                  </div>
                </div>
              )}
            </div>
            <input
              type="file"
              ref={photoRef}
              accept="image/*"
              onChange={handlePhoto}
              style={{ display: "none" }}
            />
          </div>

          {/* Save button */}
          <button
            onClick={handleSave}
            disabled={!canSave}
            className="btn-p"
            style={{
              padding: "16px",
              background: !canSave
                ? "rgba(44,26,14,.4)"
                : "linear-gradient(135deg,#6b4a2a,#4a2f1a)",
              color: !canSave ? "rgba(196,154,108,.25)" : "#e8d5b5",
              border: `1px solid ${!canSave ? "rgba(196,154,108,.1)" : "rgba(196,154,108,.4)"}`,
              fontFamily: "'Crimson Pro', serif",
              fontSize: 17,
              cursor: !canSave ? "not-allowed" : "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 10,
              letterSpacing: ".5px",
              boxShadow: !canSave ? "none" : "0 4px 20px rgba(0,0,0,.4)",
              transition: "all .3s",
              marginTop: "auto",
            }}
          >
            {saving ? (
              <>
                <Spinner /> Preserving...
              </>
            ) : (
              "✦ Preserve this memory"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
